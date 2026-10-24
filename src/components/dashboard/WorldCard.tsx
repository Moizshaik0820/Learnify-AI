'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CSSWorld } from '@/types';
import { useStore } from '@/lib/store';
import {
  FileCode,
  Palette,
  LayoutGrid,
  Smartphone,
  Sparkles,
  Zap,
  ArrowRight,
  Lock,
} from 'lucide-react';

interface WorldCardProps {
  world: CSSWorld;
}

const iconMap: Record<string, React.ElementType> = {
  FileCode,
  Palette,
  LayoutGrid,
  Smartphone,
  Sparkles,
  Zap,
};

export const WorldCard: React.FC<WorldCardProps> = ({ world }) => {
  const language = useStore((s) => s.language);
  const unlockedWorlds = useStore((s) => s.unlockedWorlds);
  const currentLevelByWorld = useStore((s) => s.currentLevelByWorld);

  const isUnlocked = world.unlockedByDefault || unlockedWorlds.includes(world.id);
  const currentLevel = currentLevelByWorld[world.id] || 0;
  const totalLevels = world.levels.length || 24;
  const progressPercent = Math.min(Math.round((currentLevel / totalLevels) * 100), 100);

  const IconComponent = iconMap[world.iconName] || FileCode;

  const title = language === 'hinglish' && world.titleHinglish ? world.titleHinglish : world.title;
  const desc = language === 'hinglish' && world.shortDescHinglish ? world.shortDescHinglish : world.shortDesc;

  // Navigate to world's active level or level 1
  const targetLevelId = currentLevel > 0 ? currentLevel : 1;
  const destinationUrl = isUnlocked ? `/worlds/${world.id}/${targetLevelId}` : '#';

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Castle Thumbnail Header */}
        <div className="relative w-full h-28 sm:h-32 bg-slate-100 dark:bg-[#111827] overflow-hidden">
          <Image
            src={world.image}
            alt={world.title}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              !isUnlocked ? 'filter grayscale contrast-75 opacity-70' : ''
            }`}
          />
          {!isUnlocked && (
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-black/70 rounded-full text-white text-xs font-medium border border-slate-700/60">
                <Lock className="w-3.5 h-3.5" />
                <span>Locked</span>
              </div>
            </div>
          )}
        </div>

        {/* Card Content Area */}
        <div className="p-4 sm:p-5 space-y-2.5">
          {/* World Title with Icon Badge */}
          <div className="flex items-center space-x-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: world.accentColor || '#3B82F6' }}
            >
              <IconComponent className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-[#F1F5F9] leading-tight">
              {title}
            </h3>
          </div>

          {/* Level Progress Indicator */}
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#CBD5E1]">
              <span className="font-medium text-slate-700 dark:text-[#CBD5E1]">
                Level {currentLevel} / {totalLevels}
              </span>
              {progressPercent > 0 && (
                <span className="text-[11px] font-bold text-[#22A447] dark:text-[#4ADE80]">
                  {progressPercent}% Complete
                </span>
              )}
            </div>

            {/* Progress Bar (Grass Green for construction progress) */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-[#22A447] dark:bg-[#4ADE80]"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] leading-relaxed line-clamp-2 pt-1">
            {desc}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 flex justify-end">
        {isUnlocked ? (
          <Link
            href={destinationUrl}
            className="w-8 h-8 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] flex items-center justify-center text-white dark:text-[#0F172A] shadow-xs transition hover:scale-110 active:scale-95"
            aria-label={`Enter ${world.title}`}
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center cursor-not-allowed">
            <Lock className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  );
};
