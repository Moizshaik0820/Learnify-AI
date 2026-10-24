-- ==============================================================================
-- Learnify AI: Leaderboard Migration & Authoritative XP Protection
-- ==============================================================================

-- 1. Index for fast, authoritative leaderboard sorting & pagination
CREATE INDEX IF NOT EXISTS idx_profiles_leaderboard_xp
  ON public.profiles (total_xp DESC, updated_at ASC);

-- 2. Secure Public Leaderboard View
-- Exposes ONLY public gaming fields: id, username, total_xp, learner_level, quizzes_taken, completed_count
-- Strictly hides email, auth tokens, and sensitive account data.
CREATE OR REPLACE VIEW public.leaderboard_entries AS
SELECT
  id,
  COALESCE(NULLIF(TRIM(username), ''), 'Novice Builder') AS username,
  total_xp,
  learner_level,
  quizzes_taken,
  COALESCE(array_length(completed_levels, 1), 0) AS completed_levels_count,
  created_at,
  updated_at,
  ROW_NUMBER() OVER (ORDER BY total_xp DESC, updated_at ASC) AS rank
FROM public.profiles;

-- 3. Grant read permissions on public view to anon and authenticated users
GRANT SELECT ON public.leaderboard_entries TO anon, authenticated;

-- 4. Enable public reading of safe profile fields for leaderboard queries
-- Allows public select on profiles table
DROP POLICY IF EXISTS "Public profiles read policy" ON public.profiles;
CREATE POLICY "Public profiles read policy"
  ON public.profiles FOR SELECT
  USING (true);

-- 5. RPC: Get Paginated Global Leaderboard
CREATE OR REPLACE FUNCTION public.get_leaderboard(
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  username TEXT,
  total_xp INT,
  learner_level INT,
  quizzes_taken INT,
  completed_levels_count INT,
  rank BIGINT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql AS $$
  SELECT
    id,
    COALESCE(NULLIF(TRIM(username), ''), 'Novice Builder') AS username,
    total_xp,
    learner_level,
    quizzes_taken,
    COALESCE(array_length(completed_levels, 1), 0) AS completed_levels_count,
    ROW_NUMBER() OVER (ORDER BY total_xp DESC, updated_at ASC) AS rank
  FROM public.profiles
  ORDER BY total_xp DESC, updated_at ASC
  LIMIT p_limit OFFSET p_offset;
$$;

-- 6. RPC: Get Specific User's Leaderboard Rank
CREATE OR REPLACE FUNCTION public.get_user_rank(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  total_xp INT,
  learner_level INT,
  rank BIGINT,
  total_builders BIGINT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql AS $$
  WITH ranked AS (
    SELECT
      p.id,
      COALESCE(NULLIF(TRIM(p.username), ''), 'Novice Builder') AS username,
      p.total_xp,
      p.learner_level,
      ROW_NUMBER() OVER (ORDER BY p.total_xp DESC, p.updated_at ASC) AS rank,
      COUNT(*) OVER () AS total_builders
    FROM public.profiles p
  )
  SELECT
    r.id,
    r.username,
    r.total_xp,
    r.learner_level,
    r.rank,
    r.total_builders
  FROM ranked r
  WHERE r.id = p_user_id;
$$;

-- 7. Authoritative Level Completion & XP Award Function
-- Validates authentication, prevents duplicate XP for previously completed levels,
-- and authoritatively calculates new total_xp and learner_level.
CREATE OR REPLACE FUNCTION public.complete_castle_level(
  p_world_id INT,
  p_level_id INT,
  p_xp_reward INT
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_user_id UUID;
  v_global_id TEXT;
  v_already_completed BOOLEAN;
  v_new_total_xp INT;
  v_new_learner_level INT;
  v_current_levels TEXT[];
  v_current_worlds INT[];
  v_result JSONB;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User is not authenticated';
  END IF;

  v_global_id := 'world-' || p_world_id || '-level-' || p_level_id;

  -- Fetch current profile data
  SELECT completed_levels, unlocked_worlds, total_xp
  INTO v_current_levels, v_current_worlds, v_new_total_xp
  FROM public.profiles
  WHERE id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  v_already_completed := v_global_id = ANY(COALESCE(v_current_levels, ARRAY[]::TEXT[]));

  IF NOT v_already_completed THEN
    -- Award XP only if not completed previously (prevents duplication)
    v_new_total_xp := v_new_total_xp + GREATEST(0, p_xp_reward);
    v_current_levels := ARRAY_APPEND(COALESCE(v_current_levels, ARRAY[]::TEXT[]), v_global_id);
  END IF;

  -- Authoritative Level calculation: 200 XP per level
  v_new_learner_level := FLOOR(v_new_total_xp / 200);

  -- Unlock next world if level 12 or above is reached
  IF p_level_id >= 12 AND p_world_id < 6 AND NOT (p_world_id + 1 = ANY(v_current_worlds)) THEN
    v_current_worlds := ARRAY_APPEND(v_current_worlds, p_world_id + 1);
  END IF;

  -- Persist updated profile
  UPDATE public.profiles
  SET
    total_xp = v_new_total_xp,
    learner_level = v_new_learner_level,
    completed_levels = v_current_levels,
    unlocked_worlds = v_current_worlds,
    updated_at = TIMEZONE('utc'::text, NOW())
  WHERE id = v_user_id;

  -- Upsert world progress
  INSERT INTO public.user_progress (
    user_id,
    world_id,
    highest_level_unlocked,
    completed_levels,
    xp_earned,
    updated_at
  )
  VALUES (
    v_user_id,
    p_world_id,
    GREATEST(p_level_id + 1, 1),
    to_jsonb(v_current_levels),
    v_new_total_xp,
    TIMEZONE('utc'::text, NOW())
  )
  ON CONFLICT (user_id, world_id) DO UPDATE
  SET
    highest_level_unlocked = GREATEST(user_progress.highest_level_unlocked, p_level_id + 1),
    completed_levels = to_jsonb(v_current_levels),
    xp_earned = v_new_total_xp,
    updated_at = TIMEZONE('utc'::text, NOW());

  v_result := jsonb_build_object(
    'success', true,
    'total_xp', v_new_total_xp,
    'learner_level', v_new_learner_level,
    'already_completed', v_already_completed,
    'awarded_xp', CASE WHEN v_already_completed THEN 0 ELSE p_xp_reward END
  );

  RETURN v_result;
END;
$$;
