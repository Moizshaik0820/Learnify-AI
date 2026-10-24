'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { worldsData } from '@/data/worldsData';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import {
  ChevronRight,
  Lock,
  CheckCircle2,
  Play,
} from 'lucide-react';

export default function WorldLevelsPage() {
  const params = useParams();
  const worldId = parseInt(params.worldId as string, 10) || 1;
  const world = worldsData.find((w) => w.id === worldId) || worldsData[0];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const language = useStore((s) => s.language);
  const currentLevelByWorld = useStore((s) => s.currentLevelByWorld);
  const completedLevels = useStore((s) => s.completedLevels);
  const t = translations[language];

  const highestUnlocked = currentLevelByWorld[world.id] || 1;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F1F5F9] flex transition-colors duration-200">
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs bg-white dark:bg-[#1E293B] h-full shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-[#CBD5E1]">
            <Link href="/" className="hover:text-[#3B82F6] dark:hover:text-[#60A5FA] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/worlds" className="hover:text-[#3B82F6] dark:hover:text-[#60A5FA] transition">Worlds</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 dark:text-[#F1F5F9] font-semibold">{world.title}</span>
          </div>

          {/* World Header Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span
                className="px-3 py-1 rounded-full text-white text-xs font-bold"
                style={{ backgroundColor: world.accentColor || '#3B82F6' }}
              >
                World {world.id}
              </span>
              <h1 className="text-2xl font-black text-[#1E293B] dark:text-[#F1F5F9] tracking-tight">
                {language === 'hinglish' && world.titleHinglish ? world.titleHinglish : world.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] leading-relaxed">
                {language === 'hinglish' && world.shortDescHinglish ? world.shortDescHinglish : world.shortDesc}
              </p>
            </div>

            <div className="relative w-40 h-24 rounded-xl overflow-hidden shrink-0 shadow-xs border border-slate-200 dark:border-[#334155]">
              <Image
                src={world.image}
                alt={world.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 24 Sequential Level Cards Grid */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-[#1E293B] dark:text-[#F1F5F9]">
              24 Fortress Levels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {world.levels.map((lvl) => {
                const isCompleted = completedLevels.includes(lvl.globalId);
                const isUnlocked = lvl.id <= highestUnlocked;
                const isCurrent = lvl.id === highestUnlocked;

                return (
                  <div
                    key={lvl.id}
                    className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                      isCompleted
                        ? 'bg-emerald-50/40 dark:bg-[#064E3B]/20 border-emerald-200/80 dark:border-emerald-900/40 hover:shadow-md'
                        : isCurrent
                        ? 'bg-white dark:bg-[#1E293B] border-[#3B82F6] dark:border-[#60A5FA] ring-2 ring-[#3B82F6]/20 dark:ring-blue-900/40 shadow-md'
                        : isUnlocked
                        ? 'bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] hover:shadow-md'
                        : 'bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#334155] opacity-60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isCompleted
                              ? 'bg-[#22A447] text-white'
                              : isCurrent
                              ? 'bg-[#3B82F6] text-white'
                              : isUnlocked
                              ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {lvl.id}
                        </span>

                        {isCompleted ? (
                          <div className="flex items-center space-x-1 text-[#22A447] dark:text-[#4ADE80] text-[11px] font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Done</span>
                          </div>
                        ) : isCurrent ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#DBEAFE] dark:bg-[#1E3A5F] text-[#1D4ED8] dark:text-[#93C5FD] text-[10px] font-extrabold uppercase animate-pulse">
                            Active
                          </span>
                        ) : !isUnlocked ? (
                          <Lock className="w-4 h-4 text-slate-400" />
                        ) : null}
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-[#1E293B] dark:text-[#F1F5F9] line-clamp-1">
                        {language === 'hinglish' && lvl.titleHinglish ? lvl.titleHinglish : lvl.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1] line-clamp-2">
                        {language === 'hinglish' && lvl.conceptHinglish ? lvl.conceptHinglish : lvl.concept}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between text-[11px] text-slate-500 dark:text-[#CBD5E1] mt-2">
                      <span className="font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/60">
                        +{lvl.xpReward} XP
                      </span>
                      {isUnlocked ? (
                        <Link
                          href={`/worlds/${world.id}/${lvl.id}`}
                          className="font-semibold text-[#3B82F6] dark:text-[#60A5FA] hover:text-[#2563EB] dark:hover:text-[#93C5FD] flex items-center space-x-1"
                        >
                          <span>{isCompleted ? 'Replay' : 'Play'}</span>
                          <Play className="w-3 h-3 fill-current" />
                        </Link>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">Locked</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
