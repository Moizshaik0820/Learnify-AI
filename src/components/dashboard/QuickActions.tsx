'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, FileText, Target, Network, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';

export const QuickActions: React.FC = () => {
  const language = useStore((s) => s.language);
  const currentLevelByWorld = useStore((s) => s.currentLevelByWorld);
  const t = translations[language];

  const currentLevel = currentLevelByWorld[1] || 1;

  const actions = [
    {
      title: t.quickActions.playLevel,
      subtitle: t.quickActions.playLevelSub,
      href: `/worlds/1/${currentLevel}`,
      icon: Gamepad2,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: t.quickActions.analyzeStudy,
      subtitle: t.quickActions.analyzeStudySub,
      href: '/study-material',
      icon: FileText,
      color: 'bg-indigo-100 text-indigo-700',
    },
    {
      title: t.quickActions.takeQuiz,
      subtitle: t.quickActions.takeQuizSub,
      href: `/worlds/1/${currentLevel}`,
      icon: Target,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: t.quickActions.viewMindMap,
      subtitle: t.quickActions.viewMindMapSub,
      href: '/mind-map',
      icon: Network,
      color: 'bg-pink-100 text-pink-700',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-sm sm:text-base text-[#141C38]">
        {t.quickActions.title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className="bg-white rounded-2xl border border-[#E6EAF2] p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#141C38] group-hover:text-purple-700 transition">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {act.subtitle}
                  </p>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition shadow-xs">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
