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
    <div className="bg-white rounded-2xl border border-[#E6EAF2] p-5 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm sm:text-base text-[#141C38]">
          {t.weakPoints.title}
        </h4>
        <Link
          href="/mind-map"
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition"
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
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group"
          >
            <div className="flex items-center space-x-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="text-xs font-bold text-[#141C38] group-hover:text-purple-700 transition">
                  {item.concept}
                </p>
                <p className="text-[10px] text-slate-400">{item.topic}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                {t.weakPoints.needsPractice}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
            </div>
          </Link>
        ))}

        {weakPoints.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400 bg-slate-50/60 rounded-xl border border-slate-100/60 flex flex-col items-center justify-center space-y-1">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>No weak points detected. All concepts currently clean!</span>
          </div>
        )}
      </div>
    </div>
  );
};
