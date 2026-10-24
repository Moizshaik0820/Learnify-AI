'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Mountain, CheckCircle2, Award } from 'lucide-react';
import { translations } from '@/data/translations';
import { calculateLevelAndProgress } from '@/lib/levelSystem';

export const ProgressStatsCard: React.FC = () => {
  const totalXp = useStore((s) => s.totalXp);
  const unlockedWorlds = useStore((s) => s.unlockedWorlds);
  const completedLevels = useStore((s) => s.completedLevels);
  const quizzesTaken = useStore((s) => s.quizzesTaken);
  const language = useStore((s) => s.language);
  const t = translations[language];

  const progress = calculateLevelAndProgress(totalXp, language);

  return (
    <div id="progress-panel" className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 shadow-xs space-y-4 transition-colors">
      {/* Top Level & XP Row */}
      <div className="flex items-center space-x-4">
        {/* Circular Level Ring with Golden Yellow Reward Treatment */}
        <div className="relative w-16 h-16 rounded-full flex items-center justify-center shrink-0">
          {/* SVG Progress Ring */}
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-amber-100/70 dark:text-amber-950/40"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#FACC15]"
              strokeDasharray={`${progress.xpPercent}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Level Numbers inside ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold leading-none">Lv. {progress.learnerLevel}</span>
            <span className="text-lg font-black text-[#1E293B] dark:text-[#F1F5F9] leading-none mt-0.5">{progress.learnerLevel}</span>
          </div>
        </div>

        {/* Builder Title & XP Bar */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-[#F1F5F9]">
              {progress.levelTitle}
            </h4>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
              +{progress.xpToNextLevel} XP to Lv.{progress.learnerLevel + 1}
            </span>
          </div>

          <div className="text-xs text-slate-500 dark:text-[#CBD5E1] font-medium">
            <span className="font-bold text-[#1E293B] dark:text-[#F1F5F9]">{progress.totalXp}</span> {t.stats.xp} Total ({progress.currentLevelXp} / 200 in current level)
          </div>

          {/* XP Progress Bar */}
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FACC15] to-[#3B82F6] dark:to-[#60A5FA] rounded-full transition-all duration-500"
              style={{ width: `${progress.xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Row of 3 metric pill badges: Blue for Worlds, Grass Green for Completed Building, Golden for Quizzes */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
        {/* Metric 1: Worlds Unlocked */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#111827]/70 border border-[#E2E8F0] dark:border-[#334155] flex flex-col items-center text-center space-y-1">
          <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-[#1E3A5F] text-[#3B82F6] dark:text-[#60A5FA] flex items-center justify-center">
            <Mountain className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-extrabold text-[#1E293B] dark:text-[#F1F5F9] leading-none">
            {unlockedWorlds.length}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-[#CBD5E1] font-medium leading-tight line-clamp-1">
            {t.stats.worldsUnlocked}
          </span>
        </div>

        {/* Metric 2: Levels Completed (Grass Green: Successful Building Progress) */}
        <div className="p-2.5 rounded-xl bg-emerald-50/40 dark:bg-[#064E3B]/20 border border-emerald-100 dark:border-emerald-900/40 flex flex-col items-center text-center space-y-1">
          <div className="w-6 h-6 rounded-lg bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#22A447] dark:text-[#4ADE80] flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-extrabold text-[#1E293B] dark:text-[#F1F5F9] leading-none">
            {completedLevels.length}
          </span>
          <span className="text-[10px] text-[#1B873A] dark:text-[#4ADE80] font-semibold leading-tight line-clamp-1">
            {t.stats.levelsCompleted}
          </span>
        </div>

        {/* Metric 3: Quizzes Taken (Golden Yellow: Unlocked Rewards) */}
        <div className="p-2.5 rounded-xl bg-amber-50/40 dark:bg-[#78350F]/20 border border-amber-100 dark:border-amber-900/40 flex flex-col items-center text-center space-y-1">
          <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-[#FACC15] flex items-center justify-center">
            <Award className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-extrabold text-[#1E293B] dark:text-[#F1F5F9] leading-none">
            {quizzesTaken}
          </span>
          <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold leading-tight line-clamp-1">
            {t.stats.quizzesTaken}
          </span>
        </div>
      </div>
    </div>
  );
};
