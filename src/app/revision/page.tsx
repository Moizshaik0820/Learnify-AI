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
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '@/lib/soundEffects';

export default function RevisionCenterPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const language = useStore((s) => s.language);
  const weakPoints = useStore((s) => s.weakPoints);
  const totalXp = useStore((s) => s.totalXp);
  const completedLevels = useStore((s) => s.completedLevels);
  const markWeakPointPracticed = useStore((s) => s.markWeakPointPracticed);
  const t = translations[language];

  const [activeSideMission, setActiveSideMission] = useState<any>(null);

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

  const handleCompleteMission = (mission: any) => {
    markWeakPointPracticed(mission.concept);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      soundEffects.playCelebrationChime();
    } catch (_) {}
    setActiveSideMission(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex">
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-navy-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs bg-white h-full shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-purple-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">{t.nav.revision}</span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#141C38] tracking-tight">
              {t.nav.revision}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Solidify weak concepts with tailored side-missions, earn bonus XP, and unlock legendary castle relics!
            </p>
          </div>

          {/* Weak Points Alert Banner */}
          {weakPoints.length > 0 && (
            <div className="p-5 bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl border border-rose-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>{weakPoints.length} Concepts Identified for Revision</span>
              </div>
              <p className="text-xs text-slate-600">
                These concepts caused mistakes during your recent quizzes. Complete targeted practice missions below to clear them from your weak-points ledger:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {weakPoints.map((wp) => (
                  <Link
                    key={wp.concept}
                    href={`/worlds/${wp.worldId}/${wp.levelId}`}
                    className="px-3 py-1 bg-white rounded-full border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-100/60 shadow-xs transition flex items-center space-x-1"
                  >
                    <span>{wp.concept}</span>
                    <ArrowRight className="w-3 h-3 text-rose-500" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Revision Side Missions */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-[#141C38] flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Revision Side Missions</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sideMissions.map((sm) => (
                <div
                  key={sm.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                        +{sm.xp} Bonus XP
                      </span>
                      <RotateCcw className="w-4 h-4 text-purple-400" />
                    </div>
                    <h4 className="font-bold text-sm text-[#141C38]">{sm.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{sm.desc}</p>
                  </div>

                  <Link
                    href={`/worlds/${sm.worldId}/${sm.levelId}`}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md flex items-center justify-center space-x-1.5 transition active:scale-95"
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
            <h3 className="font-bold text-base text-[#141C38] flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>Castle Achievements</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach.name}
                  className={`p-4 rounded-2xl border transition-all ${
                    ach.unlocked
                      ? 'bg-white border-purple-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                    <Award className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-xs text-[#141C38]">{ach.name}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ach.desc}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-600">
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
