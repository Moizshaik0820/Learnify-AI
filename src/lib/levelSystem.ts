import { Language } from '@/types';

export const XP_PER_LEVEL = 200;

export interface LevelProgressInfo {
  learnerLevel: number;
  totalXp: number;
  currentLevelXp: number;
  xpToNextLevel: number;
  xpPercent: number;
  levelTitle: string;
}

/**
 * Authoritative XP and level progression calculation.
 * Each level requires exactly 200 XP.
 * Level 0: 0 - 199 XP
 * Level 1: 200 - 399 XP
 * Level 2: 400 - 599 XP, etc.
 */
export function calculateLevelAndProgress(
  totalXp: number,
  language: Language = 'en'
): LevelProgressInfo {
  const safeXp = Math.max(0, Math.floor(totalXp || 0));
  const learnerLevel = Math.floor(safeXp / XP_PER_LEVEL);
  const currentLevelXp = safeXp % XP_PER_LEVEL;
  const xpToNextLevel = XP_PER_LEVEL - currentLevelXp;
  const xpPercent = Math.min(100, Math.round((currentLevelXp / XP_PER_LEVEL) * 100));

  let levelTitle = 'Novice Builder';
  if (learnerLevel === 0) {
    levelTitle = language === 'hinglish' ? 'Novice Builder (Shuruati)' : 'Novice Builder';
  } else if (learnerLevel === 1 || learnerLevel === 2) {
    levelTitle = language === 'hinglish' ? 'Stone Mason (Karigar)' : 'Stone Mason';
  } else if (learnerLevel >= 3 && learnerLevel <= 5) {
    levelTitle = language === 'hinglish' ? 'Castle Architect (Vastu-kaar)' : 'Castle Architect';
  } else if (learnerLevel >= 6 && learnerLevel <= 9) {
    levelTitle = language === 'hinglish' ? 'Master Fortress Builder' : 'Master Fortress Builder';
  } else {
    levelTitle = language === 'hinglish' ? 'CSS Grandmaster (Maha-Guru)' : 'CSS Grandmaster';
  }

  return {
    learnerLevel,
    totalXp: safeXp,
    currentLevelXp,
    xpToNextLevel,
    xpPercent,
    levelTitle,
  };
}

/**
 * Returns user initials or fallback
 */
export function getAvatarInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'LB';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
