'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { WorldCard } from '@/components/dashboard/WorldCard';
import { ProgressStatsCard } from '@/components/dashboard/ProgressStatsCard';
import { StudyMaterialCard } from '@/components/dashboard/StudyMaterialCard';
import { RecentQuizzesCard } from '@/components/dashboard/RecentQuizzesCard';
import { WeakPointsCard } from '@/components/dashboard/WeakPointsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DemoModeBanner } from '@/components/common/DemoModeBanner';
import { worldsData } from '@/data/worldsData';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const language = useStore((s) => s.language);
  const t = translations[language];

  // Filter worlds based on search input
  const filteredWorlds = worldsData.filter((w) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      w.title.toLowerCase().includes(term) ||
      w.shortDesc.toLowerCase().includes(term) ||
      w.levels.some(
        (l) =>
          l.title.toLowerCase().includes(term) ||
          l.concept.toLowerCase().includes(term)
      )
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col text-[#1E293B] dark:text-[#F1F5F9] transition-colors duration-200">
      {/* Top Demo Mode Banner */}
      <DemoModeBanner />

      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
          <Sidebar />
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-64 max-w-xs bg-white dark:bg-[#1E293B] h-full shadow-2xl animate-in slide-in-from-left duration-200">
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onSearchChange={(val) => setSearchFilter(val)}
          />

          <main className="p-4 sm:p-6 lg:p-7 max-w-[1560px] mx-auto w-full">
            {/* 2-Column or 3-Column Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              {/* Central Area: Welcome Banner + CSS Worlds Grid + Quick Actions */}
              <div className="xl:col-span-8 space-y-7">
                {/* 1. Welcome Hero Banner */}
                <WelcomeBanner />

                {/* 2. Explore CSS Worlds Section */}
                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#1E293B] dark:text-[#F1F5F9] tracking-tight">
                      {t.worldsSection.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-0.5">
                      {t.worldsSection.subtitle}
                    </p>
                  </div>

                  {/* 6 Worlds Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredWorlds.map((world) => (
                      <WorldCard key={world.id} world={world} />
                    ))}
                  </div>

                  {filteredWorlds.length === 0 && (
                    <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-[#334155] text-slate-500 dark:text-[#CBD5E1] text-sm">
                      No worlds or levels found matching &ldquo;{searchFilter}&rdquo;. Try searching for &ldquo;flexbox&rdquo;, &ldquo;selectors&rdquo;, or &ldquo;gradient&rdquo;.
                    </div>
                  )}
                </section>

                {/* 3. Bottom Quick Actions Section */}
                <QuickActions />
              </div>

              {/* Right Column: Progress Stats + Study Material + Recent Quizzes + Weak Points */}
              <div className="xl:col-span-4 space-y-5">
                {/* Level 3 Novice Builder Stats */}
                <ProgressStatsCard />

                {/* Upload / Add Study Material */}
                <StudyMaterialCard />

                {/* Recent Quizzes with Score Pills */}
                <RecentQuizzesCard />

                {/* Weak Points with practice links */}
                <WeakPointsCard />
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
