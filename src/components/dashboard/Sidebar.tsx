'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import {
  Home,
  Layers,
  Trophy,
  TrendingUp,
  FileCheck2,
  RotateCcw,
  Network,
  FileText,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const language = useStore((s) => s.language);
  const soundEnabled = useStore((s) => s.soundEnabled);
  const toggleSound = useStore((s) => s.toggleSound);
  const t = translations[language];

  const navItems = [
    { label: t.nav.home, href: '/', icon: Home },
    { label: t.nav.worlds, href: '/worlds', icon: Layers },
    { label: t.nav.leaderboard, href: '/leaderboard', icon: Trophy },
    { label: t.nav.progress, href: '/#progress-panel', icon: TrendingUp },
    { label: t.nav.history, href: '/quiz-history', icon: FileCheck2 },
    { label: t.nav.revision, href: '/revision', icon: RotateCcw },
    { label: t.nav.mindmap, href: '/mind-map', icon: Network },
    { label: t.nav.study, href: '/study-material', icon: FileText },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border-r border-[#E2E8F0] dark:border-[#334155] flex flex-col justify-between p-5 select-none shrink-0 transition-colors duration-200">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Logo and close button for mobile */}
        <div className="flex items-center justify-between">
          <Logo />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href) && item.href !== '/';

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#DBEAFE] dark:bg-[#1E3A5F] text-[#1D4ED8] dark:text-[#93C5FD] font-bold shadow-xs border border-blue-200/80 dark:border-blue-900/60'
                    : 'text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive
                      ? 'text-[#3B82F6] dark:text-[#60A5FA]'
                      : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-3 pt-6 border-t border-[#E2E8F0] dark:border-[#334155]">
        {/* Sound Effects & Celebration Chimes Control */}
        <button
          onClick={toggleSound}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#162032] border border-[#E2E8F0] dark:border-[#334155] text-xs transition group"
          title="Play audio cues on level completion and confetti"
        >
          <div className="flex items-center space-x-2">
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA] group-hover:scale-110 transition-transform" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
            <span className="font-semibold text-slate-700 dark:text-[#CBD5E1]">Sound Effects</span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              soundEnabled
                ? 'bg-[#DBEAFE] dark:bg-[#1E3A5F] text-[#1D4ED8] dark:text-[#93C5FD]'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            {soundEnabled ? 'Chimes ON' : 'OFF'}
          </span>
        </button>

        {/* Language Selector */}
        <LanguageToggle />

        {/* Castle Encouragement Card */}
        <div className="p-3.5 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]/40 dark:from-[#1E3A5F]/40 dark:to-[#111827] rounded-2xl border border-blue-100 dark:border-blue-900/40 flex items-center justify-between shadow-xs">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-blue-950 dark:text-blue-200 leading-tight">
              &ldquo;{t.sidebarCard.quote}&rdquo;
            </p>
          </div>
          <div className="w-9 h-9 relative shrink-0 ml-2">
            <Image
              src="/images/castle-mini.png"
              alt="Mini Castle"
              width={36}
              height={36}
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
