import { create } from 'zustand';
import { Language, QuizAttempt, WeakPoint } from '@/types';

interface StoreState {
  language: Language;
  setLanguage: (lang: Language) => void;

  learnerLevel: number;
  totalXp: number;
  xpToNextLevel: number;
  unlockedWorlds: number[];
  completedLevels: string[];
  currentLevelByWorld: Record<number, number>;
  quizzesTaken: number;

  quizHistory: QuizAttempt[];
  weakPoints: WeakPoint[];

  demoMode: boolean;
  soundEnabled: boolean;

  // Actions
  completeLevel: (worldId: number, levelId: number, xpEarned: number) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  addWeakPoint: (concept: string, topic: string, worldId: number, levelId: number) => void;
  markWeakPointPracticed: (concept: string) => void;
  unlockWorld: (worldId: number) => void;
  setDemoMode: (enabled: boolean) => void;
  toggleSound: () => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'learnify_ai_progress_v1';

const initialDefaultState = {
  language: 'en' as Language,
  learnerLevel: 3,
  totalXp: 120,
  xpToNextLevel: 500,
  unlockedWorlds: [1, 2, 3],
  completedLevels: [
    'world-1-level-1', 'world-1-level-2', 'world-1-level-3',
    'world-2-level-1',
  ],
  currentLevelByWorld: {
    1: 4,
    2: 2,
    3: 1,
    4: 0,
    5: 0,
    6: 0,
  },
  quizzesTaken: 2,
  quizHistory: [
    {
      id: 'quiz-1',
      worldId: 1,
      worldName: 'Basics and Syntax',
      levelId: 2,
      score: 8,
      total: 10,
      date: '2 days ago',
      timestamp: Date.now() - 2 * 86400000,
      wrongConcepts: ['CSS Selectors'],
    },
    {
      id: 'quiz-2',
      worldId: 2,
      worldName: 'Color & Typography',
      levelId: 1,
      score: 7,
      total: 10,
      date: '3 days ago',
      timestamp: Date.now() - 3 * 86400000,
      wrongConcepts: ['Font Weights'],
    },
    {
      id: 'quiz-3',
      worldId: 3,
      worldName: 'Flexbox',
      levelId: 1,
      score: 9,
      total: 10,
      date: '5 days ago',
      timestamp: Date.now() - 5 * 86400000,
      wrongConcepts: ['Flexbox (Layout)'],
    },
  ],
  weakPoints: [
    {
      concept: 'Flexbox (Layout)',
      topic: 'Layout and Positioning',
      worldId: 3,
      levelId: 1,
      errorCount: 2,
      status: 'Needs Practice' as const,
      color: '#8B5CF6',
    },
    {
      concept: 'CSS Selectors',
      topic: 'Basics and Syntax',
      worldId: 1,
      levelId: 2,
      errorCount: 3,
      status: 'Needs Practice' as const,
      color: '#F97316',
    },
    {
      concept: 'Media Queries',
      topic: 'Responsive Design',
      worldId: 4,
      levelId: 1,
      errorCount: 1,
      status: 'Needs Practice' as const,
      color: '#10B981',
    },
  ],
  demoMode: true,
  soundEnabled: true,
};

// Safe localStorage helper
function loadSavedState() {
  if (typeof window === 'undefined') return initialDefaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...initialDefaultState, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load saved state from localStorage:', e);
  }
  return initialDefaultState;
}

export const useStore = create<StoreState>((set, get) => ({
  ...initialDefaultState,

  setLanguage: (lang: Language) => {
    set({ language: lang });
    try {
      const current = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, language: lang }));
    } catch (_) {}
  },

  completeLevel: (worldId: number, levelId: number, xpEarned: number) => {
    set((state) => {
      const globalId = `world-${worldId}-level-${levelId}`;
      const completedLevels = state.completedLevels.includes(globalId)
        ? state.completedLevels
        : [...state.completedLevels, globalId];

      const currentByWorld = { ...state.currentLevelByWorld };
      if ((currentByWorld[worldId] || 0) <= levelId) {
        currentByWorld[worldId] = levelId + 1;
      }

      // Check unlocking next world if 12+ levels in current world or world completed
      let unlockedWorlds = [...state.unlockedWorlds];
      if (levelId >= 12 && !unlockedWorlds.includes(worldId + 1) && worldId < 6) {
        unlockedWorlds.push(worldId + 1);
      }

      const totalXp = state.totalXp + xpEarned;
      const learnerLevel = Math.floor(totalXp / 200) + 1;

      const updated = {
        ...state,
        completedLevels,
        currentLevelByWorld: currentByWorld,
        unlockedWorlds,
        totalXp,
        learnerLevel,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}

      return updated;
    });
  },

  recordQuizAttempt: (attempt: QuizAttempt) => {
    set((state) => {
      const quizHistory = [attempt, ...state.quizHistory];
      const quizzesTaken = state.quizzesTaken + 1;
      const totalXp = state.totalXp + attempt.score * 5;
      const learnerLevel = Math.floor(totalXp / 200) + 1;

      // Add weak points for wrong concepts
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

      const updated = {
        ...state,
        quizHistory,
        quizzesTaken,
        totalXp,
        learnerLevel,
        weakPoints: newWeakPoints,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}

      return updated;
    });
  },

  addWeakPoint: (concept: string, topic: string, worldId: number, levelId: number) => {
    set((state) => {
      const existing = state.weakPoints.find((w) => w.concept === concept);
      let weakPoints;
      if (existing) {
        weakPoints = state.weakPoints.map((w) =>
          w.concept === concept ? { ...w, errorCount: w.errorCount + 1, status: 'Needs Practice' as const } : w
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
      return { ...state, weakPoints };
    });
  },

  markWeakPointPracticed: (concept: string) => {
    set((state) => {
      const weakPoints = state.weakPoints.map((w) =>
        w.concept === concept ? { ...w, status: 'Mastered' as const } : w
      );
      return { ...state, weakPoints };
    });
  },

  unlockWorld: (worldId: number) => {
    set((state) => {
      if (state.unlockedWorlds.includes(worldId)) return state;
      return { ...state, unlockedWorlds: [...state.unlockedWorlds, worldId] };
    });
  },

  setDemoMode: (enabled: boolean) => set({ demoMode: enabled }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  resetProgress: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    set({ ...initialDefaultState });
  },
}));
