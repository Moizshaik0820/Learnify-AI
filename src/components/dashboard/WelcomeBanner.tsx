'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';

export const WelcomeBanner: React.FC = () => {
  const language = useStore((s) => s.language);
  const t = translations[language];

  // Determine the next level to continue learning
  const currentLevelByWorld = useStore((s) => s.currentLevelByWorld);
  const world1Lvl = currentLevelByWorld[1] || 1;
  const nextLevelUrl = `/worlds/1/${world1Lvl}`;

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#D7E8FD] via-[#E2EAFD] to-[#EDE7FF] border border-blue-100/80 shadow-sm p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left Content Area */}
      <div className="relative z-10 max-w-sm sm:max-w-md space-y-2.5 text-left shrink-0">
        <span className="text-xs sm:text-sm font-semibold text-slate-600 block">
          {t.welcome.greeting}
        </span>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141C38] leading-tight">
            Learnify AI
          </h1>
          <p className="text-xs sm:text-sm font-medium text-purple-700/90 mt-0.5">
            {t.welcome.tagline}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t.welcome.description}
        </p>

        <div className="pt-1.5">
          <Link
            href={nextLevelUrl}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <span>{t.welcome.startLearning}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Right Artwork: Fantasy Castle Landscape */}
      <div className="relative w-full md:w-[280px] lg:w-[320px] h-40 sm:h-44 md:h-48 rounded-2xl overflow-hidden shrink-0 shadow-sm">
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
