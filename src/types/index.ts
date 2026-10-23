export type Language = 'en' | 'hinglish';

export interface CSSRuleChallenge {
  property: string;
  expectedValue: string | string[]; // Can accept multiple valid values (e.g. 'flex' or 'inline-flex')
  description: string;
  hint: string;
}

export interface LevelQuizQuestion {
  id: string;
  question: string;
  questionHinglish?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationHinglish?: string;
  conceptTag: string;
}

export interface Level {
  id: number; // 1 to 24 within the world
  globalId: string; // e.g. "world-1-level-1"
  title: string;
  titleHinglish: string;
  concept: string;
  conceptHinglish: string;
  explanation: string;
  explanationHinglish: string;
  exampleCode: string;
  initialCode: string;
  solutionCode: string;
  instructions: string;
  instructionsHinglish: string;
  targetElement: string; // CSS selector inside castle, e.g. "#castle-walls", ".turret-spire"
  castleComponentChanged: string; // "Wall Color", "Keep Height", "Drawbridge Rotation", etc.
  challenges: CSSRuleChallenge[];
  typingChallenge: {
    code: string;
    targetWpm: number;
    timeLimitSeconds: number;
  };
  quiz: LevelQuizQuestion[];
  xpReward: number;
}

export interface CSSWorld {
  id: number; // 1 to 6
  slug: string;
  title: string;
  titleHinglish: string;
  shortDesc: string;
  shortDescHinglish: string;
  image: string;
  accentColor: string; // hex / tailwind color
  iconName: string;
  unlockedByDefault: boolean;
  levels: Level[];
}

export interface QuizAttempt {
  id: string;
  worldId: number;
  worldName: string;
  levelId: number;
  score: number;
  total: number;
  date: string;
  timestamp: number;
  wrongConcepts: string[];
}

export interface WeakPoint {
  concept: string;
  topic: string;
  worldId: number;
  levelId: number;
  errorCount: number;
  status: 'Needs Practice' | 'Mastered' | 'Reviewing';
  color: string;
}

export interface UserProgressState {
  currentLevelByWorld: Record<number, number>; // worldId -> highest completed level
  unlockedWorlds: number[]; // world IDs unlocked
  completedLevels: string[]; // array of globalIds
  totalXp: number;
  learnerLevel: number;
  quizzesTaken: number;
  quizHistory: QuizAttempt[];
  weakPoints: WeakPoint[];
  language: Language;
  soundEnabled: boolean;
}

export interface AuthUserProfile {
  id: string;
  email: string | null;
  username: string;
  learnerLevel: number;
  totalXp: number;
  quizzesTaken: number;
}
