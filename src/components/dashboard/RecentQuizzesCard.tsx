'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import { FileCheck2, ChevronRight, HelpCircle } from 'lucide-react';

export const RecentQuizzesCard: React.FC = () => {
  const language = useStore((s) => s.language);
  const quizHistory = useStore((s) => s.quizHistory);
  const t = translations[language];

  // Display top 3 recent attempts
  const recentItems = quizHistory.slice(0, 3);

  const iconColors = [
    { bg: 'bg-blue-50', text: 'text-blue-600', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { bg: 'bg-amber-50', text: 'text-amber-600', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
    { bg: 'bg-purple-50', text: 'text-purple-600', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E6EAF2] p-5 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm sm:text-base text-[#141C38]">
          {t.recentQuizzes.title}
        </h4>
        <Link
          href="/quiz-history"
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition"
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
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141C38] group-hover:text-purple-700 transition">
                    {item.worldName} - Level {item.levelId}
                  </p>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${colors.pill}`}>
                      {item.score}/{item.total}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
            </Link>
          );
        })}

        {recentItems.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400 bg-slate-50/60 rounded-xl border border-slate-100/60">
            No quiz attempts recorded yet. Play a level and take your first quiz!
          </div>
        )}
      </div>
    </div>
  );
};
