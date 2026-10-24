'use client';

import React from 'react';

interface CastleBlock {
  id: number;
  leftPercent: number;
  width: number;
  height: number;
  delay: string;
  duration: string;
  rotation: string;
  opacity: number;
  colorType: 'blue' | 'sky' | 'stone' | 'sandstone' | 'gold' | 'green';
}

const BLOCKS: CastleBlock[] = [
  { id: 1, leftPercent: 6, width: 22, height: 14, delay: '0.2s', duration: '9.5s', rotation: '6deg', opacity: 0.35, colorType: 'blue' },
  { id: 2, leftPercent: 14, width: 16, height: 11, delay: '3.1s', duration: '11.2s', rotation: '-8deg', opacity: 0.28, colorType: 'stone' },
  { id: 3, leftPercent: 22, width: 24, height: 16, delay: '1.4s', duration: '10.0s', rotation: '12deg', opacity: 0.32, colorType: 'sky' },
  { id: 4, leftPercent: 31, width: 18, height: 12, delay: '5.2s', duration: '12.5s', rotation: '-6deg', opacity: 0.25, colorType: 'sandstone' },
  { id: 5, leftPercent: 38, width: 15, height: 10, delay: '2.8s', duration: '9.0s', rotation: '9deg', opacity: 0.30, colorType: 'gold' },
  { id: 6, leftPercent: 47, width: 20, height: 13, delay: '0.7s', duration: '11.8s', rotation: '-11deg', opacity: 0.26, colorType: 'blue' },
  { id: 7, leftPercent: 55, width: 22, height: 15, delay: '4.3s', duration: '10.4s', rotation: '7deg', opacity: 0.24, colorType: 'stone' },
  { id: 8, leftPercent: 63, width: 16, height: 11, delay: '2.1s', duration: '13.0s', rotation: '-9deg', opacity: 0.28, colorType: 'sky' },
  { id: 9, leftPercent: 71, width: 19, height: 12, delay: '6.0s', duration: '9.8s', rotation: '10deg', opacity: 0.32, colorType: 'green' },
  { id: 10, leftPercent: 79, width: 24, height: 15, delay: '1.9s', duration: '11.5s', rotation: '-7deg', opacity: 0.27, colorType: 'sandstone' },
  { id: 11, leftPercent: 88, width: 18, height: 12, delay: '3.8s', duration: '10.2s', rotation: '8deg', opacity: 0.25, colorType: 'blue' },
  { id: 12, leftPercent: 94, width: 15, height: 10, delay: '5.7s', duration: '12.0s', rotation: '-5deg', opacity: 0.22, colorType: 'stone' },
  { id: 13, leftPercent: 18, width: 20, height: 13, delay: '7.2s', duration: '10.8s', rotation: '11deg', opacity: 0.28, colorType: 'sandstone' },
  { id: 14, leftPercent: 50, width: 17, height: 11, delay: '6.5s', duration: '11.0s', rotation: '-10deg', opacity: 0.25, colorType: 'sky' },
  { id: 15, leftPercent: 83, width: 21, height: 14, delay: '4.9s', duration: '12.2s', rotation: '6deg', opacity: 0.30, colorType: 'gold' },
];

const COLOR_STYLES: Record<CastleBlock['colorType'], { bg: string; topBorder: string; sideBorder: string }> = {
  blue: {
    bg: 'bg-[#3B82F6]/60 dark:bg-[#1E3A5F]/40',
    topBorder: 'border-t-[#93C5FD] dark:border-t-[#60A5FA]/60',
    sideBorder: 'border-r-[#1D4ED8]/60 dark:border-r-[#1E293B] border-b-[#1E3A8A]/60 dark:border-b-[#0F172A]',
  },
  sky: {
    bg: 'bg-[#93C5FD]/50 dark:bg-[#2563EB]/25',
    topBorder: 'border-t-[#DBEAFE] dark:border-t-[#93C5FD]/40',
    sideBorder: 'border-r-[#60A5FA]/60 dark:border-r-[#1E3A5F] border-b-[#3B82F6]/60 dark:border-b-[#0F172A]',
  },
  stone: {
    bg: 'bg-[#94A3B8]/50 dark:bg-[#334155]/40',
    topBorder: 'border-t-[#E2E8F0] dark:border-t-[#475569]/60',
    sideBorder: 'border-r-[#64748B]/60 dark:border-r-[#1E293B] border-b-[#475569]/60 dark:border-b-[#0F172A]',
  },
  sandstone: {
    bg: 'bg-[#E2BA86]/55 dark:bg-[#78350F]/25',
    topBorder: 'border-t-[#FDE68A] dark:border-t-[#D97706]/40',
    sideBorder: 'border-r-[#D97706]/50 dark:border-r-[#451A03] border-b-[#B45309]/50 dark:border-b-[#1C1917]',
  },
  gold: {
    bg: 'bg-[#FACC15]/55 dark:bg-[#CA8A04]/25',
    topBorder: 'border-t-[#FEF08A] dark:border-t-[#FACC15]/40',
    sideBorder: 'border-r-[#EAB308]/60 dark:border-r-[#854D0E] border-b-[#CA8A04]/60 dark:border-b-[#422006]',
  },
  green: {
    bg: 'bg-[#22A447]/55 dark:bg-[#166534]/25',
    topBorder: 'border-t-[#86EFAC] dark:border-t-[#4ADE80]/40',
    sideBorder: 'border-r-[#16A34A]/60 dark:border-r-[#14532D] border-b-[#15803D]/60 dark:border-b-[#052E16]',
  },
};

export const CastleBlocksBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* Subtle brick grid overlay texture */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.02] bg-[radial-gradient(#3B82F6_1px,transparent_1px)] dark:bg-[radial-gradient(#60A5FA_1px,transparent_1px)]"
        style={{ backgroundSize: '18px 18px' }}
      />

      {/* Floating Castle Construction Blocks */}
      {BLOCKS.map((b) => {
        const colors = COLOR_STYLES[b.colorType];
        return (
          <div
            key={b.id}
            className="animate-castle-block absolute top-0"
            style={
              {
                left: `${b.leftPercent}%`,
                width: `${b.width}px`,
                height: `${b.height}px`,
                '--duration': b.duration,
                '--delay': b.delay,
                '--rot': b.rotation,
                '--block-opacity': b.opacity,
              } as React.CSSProperties
            }
          >
            {/* 3D Isometric / Beveled Pixel Castle Brick */}
            <div
              className={`w-full h-full rounded-[2px] ${colors.bg} border-t-2 ${colors.topBorder} border-r ${colors.sideBorder} border-b shadow-xs backdrop-blur-[0.5px] transition-transform`}
            />
          </div>
        );
      })}
    </div>
  );
};
