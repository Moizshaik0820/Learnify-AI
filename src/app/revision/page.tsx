'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import {
  ChevronRight,
  RotateCcw,
  Award,
  Zap,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function RevisionCenterPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const language = useStore((s) => s.language);
  const weakPoints = useStore((s) => s.weakPoints);
  const completedLevels = useStore((s) => s.completedLevels);
  const t = translations[language];

  const sideMissions = [
    {
      id: 'sm-1',
      title: 'Flexbox Alignment Sprint',
      desc: 'Rapidly configure justify-content and align-items to anchor the drawbridge.',
      xp: 50,
      worldId: 3,
      levelId: 13,
      concept: 'Flexbox (Layout)',
    },
    {
      id: 'sm-2',
      title: 'Specificity Gauntlet',
      desc: 'Determine which CSS rule conquers the fortress gates in 60 seconds.',
      xp: 40,
      worldId: 1,
      levelId: 14,
      concept: 'CSS Selectors',
    },
    {
      id: 'sm-3',
      title: 'Responsive Breakpoint Defense',
      desc: 'Set fluid clamp() rules to prevent the courtyard walls from collapsing.',
      xp: 60,
      worldId: 4,
      levelId: 6,
      concept: 'Media Queries',
    },
  ];

  const achievements = [
    { name: 'Castle Founder', desc: 'Completed World 1 Level 1', unlocked: completedLevels.length >= 1 },
    { name: 'Master Mason', desc: 'Finished 10+ Castle Levels', unlocked: completedLevels.length >= 10 },
    { name: 'Knowledge Seeker', desc: 'Analyzed study material or took 3+ quizzes', unlocked: true },
    { name: 'Gothic Stylist', desc: 'Unlocked World 2 Typography', unlocked: true },
  ];

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

        <main className="p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-[#CBD5E1]">
            <Link href="/" className="hover:text-[#3B82F6] dark:hover:text-[#60A5FA] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 dark:text-[#F1F5F9] font-semibold">{t.nav.revision}</span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#1E293B] dark:text-[#F1F5F9] tracking-tight">
              {t.nav.revision}
            </h1>
            <p className="text-sm text-slate-500 dark:text-[#CBD5E1] mt-1">
              Solidify weak concepts with tailored side-missions, earn bonus XP, and unlock legendary castle relics!
            </p>
          </div>

          {/* Weak Points Alert Banner */}
          {weakPoints.length > 0 && (
            <div className="p-5 bg-gradient-to-r from-orange-50/70 to-amber-50/70 dark:from-orange-950/40 dark:to-amber-950/30 rounded-2xl border border-orange-200 dark:border-orange-900/60 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-[#C2410C] dark:text-[#FB923C] font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-[#F97316] dark:text-[#FB923C]" />
                <span>{weakPoints.length} Concepts Identified for Revision</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#CBD5E1]">
                These concepts caused mistakes during your recent quizzes. Complete targeted practice missions below to clear them from your weak-points ledger:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {weakPoints.map((wp) => (
                  <Link
                    key={wp.concept}
                    href={`/worlds/${wp.worldId}/${wp.levelId}`}
                    className="px-3 py-1 bg-white dark:bg-[#1E293B] rounded-full border border-orange-200 dark:border-orange-900/60 text-xs font-semibold text-[#C2410C] dark:text-[#FB923C] hover:bg-orange-100/60 dark:hover:bg-orange-950/80 shadow-xs transition flex items-center space-x-1"
                  >
                    <span>{wp.concept}</span>
                    <ArrowRight className="w-3 h-3 text-[#F97316] dark:text-[#FB923C]" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Revision Side Missions */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-[#1E293B] dark:text-[#F1F5F9] flex items-center space-x-2">
              <Zap className="w-5 h-5 text-[#F97316] dark:text-[#FB923C]" />
              <span>Revision Side Missions</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sideMissions.map((sm) => (
                <div
                  key={sm.id}
                  className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/60">
                        +{sm.xp} Bonus XP
                      </span>
                      <RotateCcw className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA]" />
                    </div>
                    <h4 className="font-bold text-sm text-[#1E293B] dark:text-[#F1F5F9]">{sm.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-[#CBD5E1] leading-relaxed">{sm.desc}</p>
                  </div>

                  <Link
                    href={`/worlds/${sm.worldId}/${sm.levelId}`}
                    className="w-full py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white dark:text-[#0F172A] text-xs font-semibold shadow-xs flex items-center justify-center space-x-1.5 transition active:scale-95"
                  >
                    <span>Start Mission</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Castle Achievements */}
          <div className="space-y-4 pt-4">
            <h3 className="font-bold text-base text-[#1E293B] dark:text-[#F1F5F9] flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#FACC15]" />
              <span>Castle Achievements</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach.name}
                  className={`p-4 rounded-2xl border transition-all ${
                    ach.unlocked
                      ? 'bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] shadow-xs'
                      : 'bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#334155] opacity-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-2">
                    <Award className="w-4 h-4 text-[#FACC15]" />
                  </div>
                  <h5 className="font-bold text-xs text-[#1E293B] dark:text-[#F1F5F9]">{ach.name}</h5>
                  <p className="text-[11px] text-slate-400 dark:text-[#94A3B8] mt-0.5">{ach.desc}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-[#22A447] dark:text-[#4ADE80]">
                    {ach.unlocked ? '✓ Unlocked' : 'Locked'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
