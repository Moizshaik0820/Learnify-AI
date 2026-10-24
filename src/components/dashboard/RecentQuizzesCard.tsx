'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import { FileCheck2, ChevronRight } from 'lucide-react';

export const RecentQuizzesCard: React.FC = () => {
  const language = useStore((s) => s.language);
  const quizHistory = useStore((s) => s.quizHistory);
  const t = translations[language];

  // Display top 3 recent attempts
  const recentItems = quizHistory.slice(0, 3);

  const iconColors = [
    {
      bg: 'bg-blue-50 dark:bg-[#1E3A5F]/40',
      text: 'text-[#3B82F6] dark:text-[#60A5FA]',
      pill: 'bg-emerald-50 dark:bg-emerald-950/50 text-[#1B873A] dark:text-[#4ADE80] border-emerald-200 dark:border-emerald-800/60',
    },
    {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-[#FACC15]',
      pill: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    },
    {
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      text: 'text-[#F97316] dark:text-[#FB923C]',
      pill: 'bg-emerald-50 dark:bg-emerald-950/50 text-[#1B873A] dark:text-[#4ADE80] border-emerald-200 dark:border-emerald-800/60',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 shadow-xs space-y-3.5 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-[#F1F5F9]">
          {t.recentQuizzes.title}
        </h4>
        <Link
          href="/quiz-history"
          className="text-xs font-semibold text-[#3B82F6] dark:text-[#60A5FA] hover:text-[#2563EB] dark:hover:text-[#93C5FD] transition"
        >
          {t.recentQuizzes.viewAll}
        </Link>
      </div>

      {/* Quiz List */}
      <div className="space-y-2.5">
        {recentItems.map((item, idx) => {
          const colors = iconColors[idx % iconColors.length];
          return (
            <Link
              key={item.id}
              href={`/worlds/${item.worldId}/${item.levelId}`}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#111827]/70 transition border border-transparent hover:border-slate-100 dark:hover:border-[#334155] group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9] group-hover:text-[#3B82F6] dark:group-hover:text-[#60A5FA] transition">
                    {item.worldName} - Level {item.levelId}
                  </p>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${colors.pill}`}>
                      {item.score}/{item.total}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-[#94A3B8]">{item.date}</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition" />
            </Link>
          );
        })}

        {recentItems.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400 dark:text-[#94A3B8] bg-slate-50/60 dark:bg-[#111827]/60 rounded-xl border border-[#E2E8F0] dark:border-[#334155]">
            No quiz attempts recorded yet. Play a level and take your first quiz!
          </div>
        )}
      </div>
    </div>
  );
};
