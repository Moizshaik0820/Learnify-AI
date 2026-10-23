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
  TrendingUp,
  FileCheck2,
  RotateCcw,
  Network,
  FileText,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const language = useStore((s) => s.language);
  const t = translations[language];

  const navItems = [
    { label: t.nav.home, href: '/', icon: Home },
    { label: t.nav.worlds, href: '/worlds', icon: Layers },
    { label: t.nav.progress, href: '/#progress-panel', icon: TrendingUp },
    { label: t.nav.history, href: '/quiz-history', icon: FileCheck2 },
    { label: t.nav.revision, href: '/revision', icon: RotateCcw },
    { label: t.nav.mindmap, href: '/mind-map', icon: Network },
    { label: t.nav.study, href: '/study-material', icon: FileText },
    { label: t.nav.settings, href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white/95 backdrop-blur-md border-r border-[#E6EAF2] flex flex-col justify-between p-5 select-none shrink-0">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Logo and close button for mobile */}
        <div className="flex items-center justify-between">
          <Logo />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
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
                    ? 'bg-[#F3E8FF]/80 text-[#7C3AED] font-semibold shadow-sm border border-purple-200/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive ? 'text-[#7C3AED]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 pt-6">
        {/* Language Selector */}
        <LanguageToggle />

        {/* Castle Encouragement Card */}
        <div className="p-3.5 bg-gradient-to-br from-[#FAF5FF] to-[#EFF6FF] rounded-2xl border border-purple-100 flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-purple-900 leading-tight">
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
