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
      iconColor: 'bg-blue-100 dark:bg-[#1E3A5F]/70 text-[#3B82F6] dark:text-[#60A5FA]',
    },
    {
      title: t.quickActions.analyzeStudy,
      subtitle: t.quickActions.analyzeStudySub,
      href: '/study-material',
      icon: FileText,
      iconColor: 'bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-[#93C5FD]',
    },
    {
      title: t.quickActions.takeQuiz,
      subtitle: t.quickActions.takeQuizSub,
      href: `/worlds/1/${currentLevel}`,
      icon: Target,
      iconColor: 'bg-orange-100 dark:bg-orange-950/50 text-[#F97316] dark:text-[#FB923C]', // Special challenge / quiz
    },
    {
      title: t.quickActions.viewMindMap,
      subtitle: t.quickActions.viewMindMapSub,
      href: '/mind-map',
      icon: Network,
      iconColor: 'bg-emerald-100 dark:bg-emerald-950/50 text-[#22A447] dark:text-[#4ADE80]', // Building progress / concepts
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-[#F1F5F9]">
        {t.quickActions.title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-4 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl ${act.iconColor} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1E293B] dark:text-[#F1F5F9] group-hover:text-[#3B82F6] dark:group-hover:text-[#60A5FA] transition">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1] mt-0.5">
                    {act.subtitle}
                  </p>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-[#111827] flex items-center justify-center text-slate-400 dark:text-slate-400 group-hover:bg-[#3B82F6] dark:group-hover:bg-[#60A5FA] group-hover:text-white dark:group-hover:text-[#0F172A] transition shadow-xs">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
