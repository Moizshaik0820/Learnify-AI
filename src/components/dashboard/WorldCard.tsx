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
    <div className="bg-white rounded-2xl border border-[#E6EAF2] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Castle Thumbnail Header */}
        <div className="relative w-full h-28 sm:h-32 bg-slate-100 overflow-hidden">
          <Image
            src={world.image}
            alt={world.title}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              !isUnlocked ? 'filter grayscale contrast-75' : ''
            }`}
          />
          {!isUnlocked && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-black/60 rounded-full text-white text-xs font-medium">
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
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: world.accentColor }}
            >
              <IconComponent className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#141C38] leading-tight">
              {title}
            </h3>
          </div>

          {/* Level Progress Indicator */}
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-700">
                Level {currentLevel} / {totalLevels}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: progressPercent > 0 ? world.accentColor : '#CBD5E1',
                }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 pt-1">
            {desc}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 flex justify-end">
        {isUnlocked ? (
          <Link
            href={destinationUrl}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm transition hover:scale-110 active:scale-95"
            style={{ backgroundColor: world.accentColor }}
            aria-label={`Enter ${world.title}`}
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center cursor-not-allowed">
            <Lock className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  );
};
