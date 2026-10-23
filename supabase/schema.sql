-- ==============================================================================
-- Learnify AI: Supabase PostgreSQL Schema, Row Level Security (RLS) & Triggers
-- ==============================================================================

-- 0. Enable UUID generation extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. Learner Profiles Table (Learnify AI State)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT NOT NULL DEFAULT 'Castle Apprentice',
  learner_level INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  xp_to_next_level INTEGER NOT NULL DEFAULT 200,
  quizzes_taken INTEGER NOT NULL DEFAULT 0,
  unlocked_worlds INTEGER[] NOT NULL DEFAULT '{1}',
  completed_levels TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 2. User Mind Map States Table (Blank Mind Map State Provisioned at 0)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.mind_map_states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT 'Learnify AI: CSS Castle Architecture',
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  mastered_count INTEGER NOT NULL DEFAULT 0,
  weak_count INTEGER NOT NULL DEFAULT 0,
  total_concepts INTEGER NOT NULL DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 3. User World Progress Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  world_id INTEGER NOT NULL,
  highest_level_unlocked INTEGER NOT NULL DEFAULT 1,
  completed_levels JSONB NOT NULL DEFAULT '[]'::jsonb,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, world_id)
);

-- ==============================================================================
-- 4. Quiz Attempts History Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  world_id INTEGER NOT NULL,
  world_name TEXT NOT NULL,
  level_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  wrong_concepts TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 5. Weak Points & Diagnostics Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.weak_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  concept TEXT NOT NULL,
  topic TEXT NOT NULL,
  world_id INTEGER NOT NULL,
  level_id INTEGER NOT NULL,
  error_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Needs Practice',
  color TEXT DEFAULT '#EF4444',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, concept)
);

-- ==============================================================================
-- Row Level Security (RLS) - Users Can Strictly Query & Mutate ONLY Their Own Data
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mind_map_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weak_points ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to guarantee idempotent recreation
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view own mind map" ON public.mind_map_states;
DROP POLICY IF EXISTS "Users can insert own mind map" ON public.mind_map_states;
DROP POLICY IF EXISTS "Users can update own mind map" ON public.mind_map_states;
DROP POLICY IF EXISTS "Users can delete own mind map" ON public.mind_map_states;

DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON public.user_progress;

DROP POLICY IF EXISTS "Users can view own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can delete own quiz attempts" ON public.quiz_attempts;

DROP POLICY IF EXISTS "Users can view own weak points" ON public.weak_points;
DROP POLICY IF EXISTS "Users can insert own weak points" ON public.weak_points;
DROP POLICY IF EXISTS "Users can update own weak points" ON public.weak_points;
DROP POLICY IF EXISTS "Users can delete own weak points" ON public.weak_points;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Mind Map States Policies
CREATE POLICY "Users can view own mind map"
  ON public.mind_map_states FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mind map"
  ON public.mind_map_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mind map"
  ON public.mind_map_states FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mind map"
  ON public.mind_map_states FOR DELETE
  USING (auth.uid() = user_id);

-- User Progress Policies
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON public.user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Quiz Attempts Policies
CREATE POLICY "Users can view own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quiz attempts"
  ON public.quiz_attempts FOR DELETE
  USING (auth.uid() = user_id);

-- Weak Points Policies
CREATE POLICY "Users can view own weak points"
  ON public.weak_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weak points"
  ON public.weak_points FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weak points"
  ON public.weak_points FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weak points"
  ON public.weak_points FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- Database Trigger: Automatically provision blank Mind Map & Learnify AI state
-- (Starting strictly at 0) upon user registration in auth.users
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  initial_username TEXT;
BEGIN
  -- Determine display username from auth metadata or email
  initial_username := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1),
    'Novice Builder'
  );

  -- 1. Provision initial blank Learnify AI profile (starting at 0)
  INSERT INTO public.profiles (
    id,
    email,
    username,
    learner_level,
    total_xp,
    xp_to_next_level,
    quizzes_taken,
    unlocked_worlds,
    completed_levels
  )
  VALUES (
    NEW.id,
    NEW.email,
    initial_username,
    0,                -- Starting at level 0
    0,                -- Starting at 0 total XP
    200,              -- XP target for next level
    0,                -- 0 quizzes taken
    ARRAY[1],         -- World 1 unlocked
    ARRAY[]::TEXT[]   -- 0 completed levels
  )
  ON CONFLICT (id) DO NOTHING;

  -- 2. Provision initial blank Mind Map state (starting at 0)
  INSERT INTO public.mind_map_states (
    user_id,
    title,
    nodes,
    mastered_count,
    weak_count,
    total_concepts
  )
  VALUES (
    NEW.id,
    'Learnify AI: CSS Castle Architecture',
    '[]'::jsonb,      -- Blank concept state
    0,                -- 0 mastered concepts
    0,                -- 0 weak concepts
    12                -- 12 total concept domains
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- 3. Provision initial blank World 1 progress (0 levels completed)
  INSERT INTO public.user_progress (
    user_id,
    world_id,
    highest_level_unlocked,
    completed_levels,
    xp_earned
  )
  VALUES (
    NEW.id,
    1,
    1,
    '[]'::jsonb,
    0
  )
  ON CONFLICT (user_id, world_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger binding to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
