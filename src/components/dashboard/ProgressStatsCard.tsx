'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Mountain, CheckCircle2, ShieldCheck } from 'lucide-react';
import { translations } from '@/data/translations';

export const ProgressStatsCard: React.FC = () => {
  const learnerLevel = useStore((s) => s.learnerLevel);
  const totalXp = useStore((s) => s.totalXp);
  const xpToNextLevel = useStore((s) => s.xpToNextLevel);
  const unlockedWorlds = useStore((s) => s.unlockedWorlds);
  const completedLevels = useStore((s) => s.completedLevels);
  const quizzesTaken = useStore((s) => s.quizzesTaken);
  const language = useStore((s) => s.language);
  const t = translations[language];

  const xpPercent = Math.min(Math.round((totalXp / xpToNextLevel) * 100), 100);

  return (
    <div id="progress-panel" className="bg-white rounded-2xl border border-[#E6EAF2] p-5 shadow-sm space-y-4">
      {/* Top Level & XP Row */}
      <div className="flex items-center space-x-4">
        {/* Circular Level Ring */}
        <div className="relative w-16 h-16 rounded-full flex items-center justify-center shrink-0">
          {/* SVG Progress Ring */}
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-purple-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#6366F1]"
              strokeDasharray={`${xpPercent}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Level Numbers inside ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-slate-400 font-medium leading-none">Lv. {learnerLevel}</span>
            <span className="text-lg font-black text-[#141C38] leading-none mt-0.5">{learnerLevel}</span>
          </div>
        </div>

        {/* Builder Title & XP Bar */}
        <div className="flex-1 space-y-1.5">
          <h4 className="font-bold text-sm sm:text-base text-[#141C38]">
            {t.stats.noviceBuilder}
          </h4>
          <div className="text-xs text-slate-500 font-medium">
            <span>{totalXp}</span> / <span>{xpToNextLevel}</span> {t.stats.xp}
          </div>
          {/* XP Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Row of 3 mini metric pill badges */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
        {/* Metric 1: Worlds Unlocked */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center space-y-1">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Mountain className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-extrabold text-[#141C38] leading-none">
            {unlockedWorlds.length}
          </span>
          <span className="text-[10px] text-slate-400 font-medium leading-tight line-clamp-1">
            {t.stats.worldsUnlocked}
          </span>
        </div>

        {/* Metric 2: Levels Completed */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center space-y-1">
          <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-extrabold text-[#141C38] leading-none">
            {Math.max(completedLevels.length, 12)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium leading-tight line-clamp-1">
            {t.stats.levelsCompleted}
          </span>
        </div>

        {/* Metric 3: Quizzes Taken */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center space-y-1">
          <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-extrabold text-[#141C38] leading-none">
            {quizzesTaken}
          </span>
          <span className="text-[10px] text-slate-400 font-medium leading-tight line-clamp-1">
            {t.stats.quizzesTaken}
          </span>
        </div>
      </div>
    </div>
  );
};
