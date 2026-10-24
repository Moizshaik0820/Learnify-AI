'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import { CastleBlocksBackground } from './CastleBlocksBackground';

export const WelcomeBanner: React.FC = () => {
  const language = useStore((s) => s.language);
  const user = useStore((s) => s.user);
  const userProfile = useStore((s) => s.userProfile);
  const t = translations[language];

  // Determine the next level to continue learning
  const currentLevelByWorld = useStore((s) => s.currentLevelByWorld);
  const world1Lvl = currentLevelByWorld[1] || 1;
  const nextLevelUrl = `/worlds/1/${world1Lvl}`;

  const displayName =
    userProfile?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    null;

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#F0F7FF] via-[#E6F0FA] to-[#EDF4FF] dark:from-[#1E293B] dark:via-[#1A2536] dark:to-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
      {/* Subtle Falling Castle-Block Animation Layer */}
      <CastleBlocksBackground />

      {/* Left Content Area (Foreground) */}
      <div className="relative z-10 max-w-sm sm:max-w-md space-y-2.5 text-left shrink-0">
        <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-[#CBD5E1] block">
          {displayName ? `${t.welcome.greeting}, ${displayName}!` : t.welcome.greeting}
        </span>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E293B] dark:text-[#F1F5F9] leading-tight flex items-center gap-2">
            <span>Learnify AI</span>
            {user && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DBEAFE] dark:bg-[#1E3A5F] text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200/80 dark:border-blue-900/60">
                <Sparkles className="w-3 h-3 mr-1 text-[#3B82F6] dark:text-[#60A5FA]" />
                RLS Connected
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#2563EB] dark:text-[#60A5FA] mt-0.5">
            {t.welcome.tagline}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
          {t.welcome.description}
        </p>

        <div className="pt-1.5">
          <Link
            href={nextLevelUrl}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white dark:text-[#0F172A] text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 dark:shadow-sky-900/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>{t.welcome.startLearning}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Right Artwork: Fantasy Castle Landscape */}
      <div className="relative z-10 w-full md:w-[280px] lg:w-[320px] h-40 sm:h-44 md:h-48 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-white/60 dark:border-[#334155]">
        <Image
          src="/images/hero-castle.png"
          alt="Fantasy Castle Realm"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
    </div>
  );
};
