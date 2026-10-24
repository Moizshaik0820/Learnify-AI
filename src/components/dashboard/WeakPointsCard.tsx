'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import { ChevronRight, Sparkles } from 'lucide-react';

export const WeakPointsCard: React.FC = () => {
  const language = useStore((s) => s.language);
  const weakPoints = useStore((s) => s.weakPoints);
  const t = translations[language];

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 shadow-xs space-y-3.5 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-[#F1F5F9]">
          {t.weakPoints.title}
        </h4>
        <Link
          href="/mind-map"
          className="text-xs font-semibold text-[#3B82F6] dark:text-[#60A5FA] hover:text-[#2563EB] dark:hover:text-[#93C5FD] transition"
        >
          {t.weakPoints.viewMindMap}
        </Link>
      </div>

      {/* Weak Points List */}
      <div className="space-y-2">
        {weakPoints.map((item) => (
          <Link
            key={item.concept}
            href={`/worlds/${item.worldId}/${item.levelId}`}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#111827]/70 transition border border-transparent hover:border-slate-100 dark:hover:border-[#334155] group"
          >
            <div className="flex items-center space-x-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: item.color || '#F97316' }}
              />
              <div>
                <p className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9] group-hover:text-[#3B82F6] dark:group-hover:text-[#60A5FA] transition">
                  {item.concept}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-[#94A3B8]">{item.topic}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-semibold text-[#C2410C] dark:text-[#FB923C] bg-[#FFEDD5] dark:bg-orange-950/50 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-900/60">
                {t.weakPoints.needsPractice}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition" />
            </div>
          </Link>
        ))}

        {weakPoints.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400 dark:text-[#94A3B8] bg-slate-50/60 dark:bg-[#111827]/60 rounded-xl border border-[#E2E8F0] dark:border-[#334155] flex flex-col items-center justify-center space-y-1">
            <Sparkles className="w-4 h-4 text-[#22A447] dark:text-[#4ADE80]" />
            <span>No weak points detected. All concepts currently clean!</span>
          </div>
        )}
      </div>
    </div>
  );
};
