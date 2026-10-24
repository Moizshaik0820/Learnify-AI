import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { Language, ThemeMode, QuizAttempt, WeakPoint, AuthUserProfile } from '@/types';
import { supabase } from './supabaseClient';
import { soundEffects } from './soundEffects';
import { calculateLevelAndProgress } from './levelSystem';

let transitionTimer: NodeJS.Timeout | null = null;

function applyThemeToDocument(theme: ThemeMode, animate: boolean = true) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const root = document.documentElement;

  if (animate) {
    root.classList.add('theme-transition');
    if (transitionTimer) clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 250);
  }

  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }

  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;

  try {
    localStorage.setItem('learnify_theme', theme);
  } catch (_) {}
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem('learnify_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (_) {}
  return 'light';
}

interface StoreState {
  // Theme state
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  initializeTheme: () => void;

  // Auth state
  user: User | null;
  session: Session | null;
  userProfile: AuthUserProfile | null;
  authLoading: boolean;
  authError: string | null;
  authSuccessMessage: string | null;
  isAuthModalOpen: boolean;

  // Learner state
  language: Language;
  learnerLevel: number;
  totalXp: number;
  xpToNextLevel: number;
  unlockedWorlds: number[];
  completedLevels: string[];
  currentLevelByWorld: Record<number, number>;
  quizzesTaken: number;

  quizHistory: QuizAttempt[];
  weakPoints: WeakPoint[];

  // Sound Effects & Celebration Chimes
  soundEnabled: boolean;

  // Auth Actions
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setAuthError: (error: string | null) => void;
  setAuthSuccessMessage: (msg: string | null) => void;
  setUser: (user: User | null, session: Session | null) => void;
  fetchAuthenticatedUserData: (userId: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message?: string }>;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signOutUser: () => Promise<void>;
  updateUsername: (newUsername: string) => Promise<{ success: boolean; error?: string }>;

  // Learner Actions
  setLanguage: (lang: Language) => void;
  completeLevel: (worldId: number, levelId: number, xpEarned: number) => Promise<void>;
  recordQuizAttempt: (attempt: QuizAttempt) => Promise<void>;
  addWeakPoint: (concept: string, topic: string, worldId: number, levelId: number) => Promise<void>;
  markWeakPointPracticed: (concept: string) => Promise<void>;
  unlockWorld: (worldId: number) => void;
  toggleSound: () => void;
  resetProgress: () => void;
}

// Initial state strictly starting at 0 for clean provisioning
const initialZeroState = {
  learnerLevel: 0,
  totalXp: 0,
  xpToNextLevel: 200,
  unlockedWorlds: [1],
  completedLevels: [] as string[],
  currentLevelByWorld: {
    1: 1,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  } as Record<number, number>,
  quizzesTaken: 0,
  quizHistory: [] as QuizAttempt[],
  weakPoints: [] as WeakPoint[],
};

export const useStore = create<StoreState>((set, get) => ({
  // Theme state
  theme: 'light' as ThemeMode,
  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: nextTheme });
    applyThemeToDocument(nextTheme, true);
  },
  setTheme: (theme: ThemeMode) => {
    set({ theme });
    applyThemeToDocument(theme, true);
  },
  initializeTheme: () => {
    const initialTheme = getInitialTheme();
    set({ theme: initialTheme });
    applyThemeToDocument(initialTheme, false);
  },

  // Auth state defaults
  user: null,
  session: null,
  userProfile: null,
  authLoading: false,
  authError: null,
  authSuccessMessage: null,
  isAuthModalOpen: false,

  // Learner state starting at 0
  language: 'en' as Language,
  ...initialZeroState,
  soundEnabled: true,

  openAuthModal: () => set({ isAuthModalOpen: true, authError: null, authSuccessMessage: null }),
  closeAuthModal: () => set({ isAuthModalOpen: false, authError: null, authSuccessMessage: null }),
  setAuthError: (error) => set({ authError: error }),
  setAuthSuccessMessage: (msg) => set({ authSuccessMessage: msg }),

  setUser: (user, session) => {
    set({ user, session });
    if (user) {
      get().fetchAuthenticatedUserData(user.id);
    } else {
      set({
        userProfile: null,
        ...initialZeroState,
      });
    }
  },

  // Strictly fetch authenticated user's specific data from Supabase
  fetchAuthenticatedUserData: async (userId: string) => {
    set({ authLoading: true, authError: null });
    try {
      // 1. Fetch Profile
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr) {
        console.warn('Supabase profile query warning:', profileErr.message);
      }

      // 2. Fetch User World Progress
      const { data: progressRows, error: progErr } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (progErr) {
        console.warn('Supabase user_progress query warning:', progErr.message);
      }

      // 3. Fetch Quiz Attempts
      const { data: quizRows, error: quizErr } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (quizErr) {
        console.warn('Supabase quiz_attempts query warning:', quizErr.message);
      }

      // 4. Fetch Weak Points
      const { data: weakRows, error: weakErr } = await supabase
        .from('weak_points')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (weakErr) {
        console.warn('Supabase weak_points query warning:', weakErr.message);
      }

      // Construct currentLevelByWorld map
      const currentLevelByWorld: Record<number, number> = {
        1: 1,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      };

      let completedFromProgress: string[] = [];
      if (progressRows && progressRows.length > 0) {
        progressRows.forEach((row: any) => {
          currentLevelByWorld[row.world_id] = row.highest_level_unlocked || 1;
          if (Array.isArray(row.completed_levels)) {
            completedFromProgress.push(...row.completed_levels);
          }
        });
      }

      const completedLevels = Array.from(
        new Set([
          ...(profile?.completed_levels || []),
          ...completedFromProgress,
        ])
      );

      // Transform quiz attempts
      const quizHistory: QuizAttempt[] = (quizRows || []).map((row: any) => ({
        id: row.id,
        worldId: row.world_id,
        worldName: row.world_name,
        levelId: row.level_id,
        score: row.score,
        total: row.total,
        date: new Date(row.created_at).toLocaleDateString(),
        timestamp: new Date(row.created_at).getTime(),
        wrongConcepts: row.wrong_concepts || [],
      }));

      // Transform weak points
      const weakPoints: WeakPoint[] = (weakRows || []).map((row: any) => ({
        concept: row.concept,
        topic: row.topic,
        worldId: row.world_id,
        levelId: row.level_id,
        errorCount: row.error_count || 1,
        status: row.status as any,
        color: row.color || '#EF4444',
      }));

      const learnerLevel = profile?.learner_level ?? 0;
      const totalXp = profile?.total_xp ?? 0;
      const xpToNextLevel = profile?.xp_to_next_level ?? 200;
      const unlockedWorlds = profile?.unlocked_worlds?.length
        ? profile.unlocked_worlds
        : [1];
      const quizzesTaken = profile?.quizzes_taken ?? quizHistory.length;

      set({
        userProfile: profile
          ? {
              id: profile.id,
              email: profile.email || get().user?.email || null,
              username: profile.username || 'Novice Builder',
              learnerLevel,
              totalXp,
              quizzesTaken,
            }
          : {
              id: userId,
              email: get().user?.email || null,
              username: get().user?.user_metadata?.full_name || 'Novice Builder',
              learnerLevel: 0,
              totalXp: 0,
              quizzesTaken: 0,
            },
        learnerLevel,
        totalXp,
        xpToNextLevel,
        unlockedWorlds,
        completedLevels,
        currentLevelByWorld,
        quizzesTaken,
        quizHistory,
        weakPoints,
        authLoading: false,
      });
    } catch (e: any) {
      console.error('Error fetching authenticated user data:', e);
      set({ authLoading: false });
    }
  },

  signUpWithEmail: async (email, password, fullName) => {
    set({ authLoading: true, authError: null, authSuccessMessage: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: fullName,
          },
        },
      });

      if (error) {
        let errorMsg = error.message;
        if (error.message.toLowerCase().includes('rate limit')) {
          errorMsg = "Supabase email rate limit reached! Go to your Supabase Dashboard -> Authentication -> Providers -> Email -> turn OFF 'Confirm email' so accounts can be registered instantly without sending verification emails.";
        }
        set({ authLoading: false, authError: errorMsg });
        return { success: false, message: errorMsg };
      }

      if (data.user) {
        set({
          user: data.user,
          session: data.session,
          authLoading: false,
          authSuccessMessage: 'Account created! Initialized blank state at 0.',
        });
        await get().fetchAuthenticatedUserData(data.user.id);
        return { success: true };
      }

      set({ authLoading: false });
      return { success: true, message: 'Check your email for confirmation.' };
    } catch (err: any) {
      let message = err.message || 'Failed to sign up';
      if (message.includes('Failed to fetch')) {
        message = 'Connection error (Failed to fetch). Please restart your development server (npm run dev) so the new environment variables take effect.';
      }
      set({ authLoading: false, authError: message });
      return { success: false, message };
    }
  },

  signInWithEmail: async (email, password) => {
    set({ authLoading: true, authError: null, authSuccessMessage: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ authLoading: false, authError: error.message });
        return { success: false, message: error.message };
      }

      if (data.user) {
        set({
          user: data.user,
          session: data.session,
          authLoading: false,
          isAuthModalOpen: false,
        });
        await get().fetchAuthenticatedUserData(data.user.id);
        return { success: true };
      }

      set({ authLoading: false });
      return { success: false, message: 'Unable to authenticate user.' };
    } catch (err: any) {
      const message = err.message || 'Failed to sign in';
      set({ authLoading: false, authError: message });
      return { success: false, message };
    }
  },

  signOutUser: async () => {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    set({
      user: null,
      session: null,
      userProfile: null,
      ...initialZeroState,
    });
  },

  updateUsername: async (newUsername: string) => {
    const trimmed = newUsername.trim();
    if (!trimmed || trimmed.length < 2 || trimmed.length > 30) {
      return { success: false, error: 'Username must be between 2 and 30 characters.' };
    }
    if (trimmed.includes('@')) {
      return { success: false, error: 'Usernames cannot contain email addresses.' };
    }

    const state = get();
    if (state.user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            username: trimmed,
            updated_at: new Date().toISOString(),
          })
          .eq('id', state.user.id);

        if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    set((s) => ({
      userProfile: s.userProfile
        ? { ...s.userProfile, username: trimmed }
        : {
            id: s.user?.id || 'guest',
            email: s.user?.email || null,
            username: trimmed,
            learnerLevel: s.learnerLevel,
            totalXp: s.totalXp,
            quizzesTaken: s.quizzesTaken,
          },
    }));

    return { success: true };
  },

  setLanguage: (lang: Language) => {
    set({ language: lang });
  },

  completeLevel: async (worldId: number, levelId: number, xpEarned: number) => {
    const state = get();
    const globalId = `world-${worldId}-level-${levelId}`;
    const isAlreadyCompleted = state.completedLevels.includes(globalId);
    const completedLevels = isAlreadyCompleted
      ? state.completedLevels
      : [...state.completedLevels, globalId];

    const currentByWorld = { ...state.currentLevelByWorld };
    if ((currentByWorld[worldId] || 0) <= levelId) {
      currentByWorld[worldId] = levelId + 1;
    }

    let unlockedWorlds = [...state.unlockedWorlds];
    if (levelId >= 12 && !unlockedWorlds.includes(worldId + 1) && worldId < 6) {
      unlockedWorlds.push(worldId + 1);
    }

    // Award XP only for new completion (prevent duplicate XP)
    const effectiveXpGain = isAlreadyCompleted ? 0 : xpEarned;
    const totalXp = state.totalXp + effectiveXpGain;
    const { learnerLevel, xpToNextLevel } = calculateLevelAndProgress(totalXp);

    set({
      completedLevels,
      currentLevelByWorld: currentByWorld,
      unlockedWorlds,
      totalXp,
      learnerLevel,
      xpToNextLevel,
    });

    // Play celebration audio cue & sound effects
    soundEffects.playLevelComplete();

    // Persist to Supabase if authenticated
    if (state.user) {
      try {
        const userId = state.user.id;
        // 1. Attempt RPC call for atomic & secure completion
        const { error: rpcError } = await supabase.rpc('complete_castle_level', {
          p_world_id: worldId,
          p_level_id: levelId,
          p_xp_reward: xpEarned,
        });

        if (rpcError) {
          // Fallback to direct table sync if RPC not deployed yet
          await supabase
            .from('profiles')
            .update({
              total_xp: totalXp,
              learner_level: learnerLevel,
              completed_levels: completedLevels,
              unlocked_worlds: unlockedWorlds,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          await supabase.from('user_progress').upsert(
            {
              user_id: userId,
              world_id: worldId,
              highest_level_unlocked: currentByWorld[worldId],
              completed_levels: completedLevels.filter((id) =>
                id.startsWith(`world-${worldId}-`)
              ),
              xp_earned: totalXp,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,world_id' }
          );
        }
      } catch (err) {
        console.warn('Supabase level completion sync notice:', err);
      }
    }
  },

  recordQuizAttempt: async (attempt: QuizAttempt) => {
    const state = get();
    const quizHistory = [attempt, ...state.quizHistory];
    const quizzesTaken = state.quizzesTaken + 1;
    const totalXp = state.totalXp + attempt.score * 5;
    const { learnerLevel, xpToNextLevel } = calculateLevelAndProgress(totalXp);

    // Update weak points for wrong concepts
    const newWeakPoints = [...state.weakPoints];
    attempt.wrongConcepts.forEach((concept) => {
      const existing = newWeakPoints.find((wp) => wp.concept === concept);
      if (existing) {
        existing.errorCount += 1;
        existing.status = 'Needs Practice';
      } else {
        newWeakPoints.push({
          concept,
          topic: attempt.worldName,
          worldId: attempt.worldId,
          levelId: attempt.levelId,
          errorCount: 1,
          status: 'Needs Practice',
          color: '#EF4444',
        });
      }
    });

    set({
      quizHistory,
      quizzesTaken,
      totalXp,
      learnerLevel,
      xpToNextLevel,
      weakPoints: newWeakPoints,
    });

    // Persist to Supabase if authenticated
    if (state.user) {
      try {
        const userId = state.user.id;

        // 1. Insert quiz attempt
        await supabase.from('quiz_attempts').insert({
          user_id: userId,
          world_id: attempt.worldId,
          world_name: attempt.worldName,
          level_id: attempt.levelId,
          score: attempt.score,
          total: attempt.total,
          wrong_concepts: attempt.wrongConcepts,
        });

        // 2. Update profile
        await supabase
          .from('profiles')
          .update({
            total_xp: totalXp,
            learner_level: learnerLevel,
            quizzes_taken: quizzesTaken,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        // 3. Upsert weak points
        for (const concept of attempt.wrongConcepts) {
          const wp = newWeakPoints.find((w) => w.concept === concept);
          if (wp) {
            await supabase.from('weak_points').upsert(
              {
                user_id: userId,
                concept: wp.concept,
                topic: wp.topic,
                world_id: wp.worldId,
                level_id: wp.levelId,
                error_count: wp.errorCount,
                status: 'Needs Practice',
                color: wp.color,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id,concept' }
            );
          }
        }
      } catch (err) {
        console.warn('Supabase quiz attempt sync notice:', err);
      }
    }
  },

  addWeakPoint: async (concept: string, topic: string, worldId: number, levelId: number) => {
    const state = get();
    const existing = state.weakPoints.find((w) => w.concept === concept);
    let weakPoints;
    if (existing) {
      weakPoints = state.weakPoints.map((w) =>
        w.concept === concept
          ? { ...w, errorCount: w.errorCount + 1, status: 'Needs Practice' as const }
          : w
      );
    } else {
      weakPoints = [
        ...state.weakPoints,
        {
          concept,
          topic,
          worldId,
          levelId,
          errorCount: 1,
          status: 'Needs Practice' as const,
          color: '#F97316',
        },
      ];
    }
    set({ weakPoints });

    if (state.user) {
      try {
        const wp = weakPoints.find((w) => w.concept === concept);
        if (wp) {
          await supabase.from('weak_points').upsert(
            {
              user_id: state.user.id,
              concept: wp.concept,
              topic: wp.topic,
              world_id: wp.worldId,
              level_id: wp.levelId,
              error_count: wp.errorCount,
              status: wp.status,
              color: wp.color,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,concept' }
          );
        }
      } catch (_) {}
    }
  },

  markWeakPointPracticed: async (concept: string) => {
    const state = get();
    const weakPoints = state.weakPoints.map((w) =>
      w.concept === concept ? { ...w, status: 'Mastered' as const } : w
    );
    set({ weakPoints });

    if (state.user) {
      try {
        await supabase
          .from('weak_points')
          .update({
            status: 'Mastered',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', state.user.id)
          .eq('concept', concept);
      } catch (_) {}
    }
  },

  unlockWorld: (worldId: number) => {
    const state = get();
    if (state.unlockedWorlds.includes(worldId)) return;
    const unlockedWorlds = [...state.unlockedWorlds, worldId];
    set({ unlockedWorlds });

    if (state.user) {
      const syncUnlock = async () => {
        try {
          await supabase
            .from('profiles')
            .update({
              unlocked_worlds: unlockedWorlds,
              updated_at: new Date().toISOString(),
            })
            .eq('id', state.user!.id);
        } catch (_) {}
      };
      syncUnlock();
    }
  },

  toggleSound: () => {
    set((s) => {
      const nextVal = !s.soundEnabled;
      if (nextVal) {
        // Play brief success ping when enabled
        soundEffects.playSuccessPing();
      }
      return { soundEnabled: nextVal };
    });
  },

  resetProgress: () => {
    set({ ...initialZeroState });
  },
}));
