'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  Volume2,
  VolumeX,
  LogIn,
  LogOut,
  Network,
  Trophy,
  Sun,
  Moon,
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { calculateLevelAndProgress, getAvatarInitials } from '@/lib/levelSystem';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface TopBarProps {
  onOpenMobileMenu?: () => void;
  onSearchChange?: (term: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileMenu,
  onSearchChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Store hooks
  const soundEnabled = useStore((s) => s.soundEnabled);
  const toggleSound = useStore((s) => s.toggleSound);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const user = useStore((s) => s.user);
  const userProfile = useStore((s) => s.userProfile);
  const totalXp = useStore((s) => s.totalXp);
  const openAuthModal = useStore((s) => s.openAuthModal);
  const signOutUser = useStore((s) => s.signOutUser);

  const { learnerLevel, levelTitle } = calculateLevelAndProgress(totalXp);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearchChange) onSearchChange(val);
  };

  const displayName =
    userProfile?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Learner';

  const initials = getAvatarInitials(displayName);

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      {/* Mobile Menu trigger & Search Bar */}
      <div className="flex items-center space-x-3 flex-1 max-w-xl">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search input */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#94A3B8]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search topics, worlds, or anything..."
            className="w-full pl-10 pr-12 py-2 bg-[#F8FAFC] dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#162032] focus:bg-white dark:focus:bg-[#111827] text-xs sm:text-sm text-slate-800 dark:text-[#F1F5F9] placeholder-slate-400 dark:placeholder-[#94A3B8] rounded-xl border border-[#E2E8F0] dark:border-[#334155] focus:border-[#3B82F6] dark:focus:border-[#60A5FA] focus:ring-2 focus:ring-[#DBEAFE] dark:focus:ring-blue-900/40 outline-none transition"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-400 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded shadow-xs">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Sound Toggle, Notifications, Auth */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Light / Dark Mode Toggle */}
        <ThemeToggle />

        {/* Sound Effects & Celebration Chimes Toggle */}
        <button
          onClick={toggleSound}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border transition ${
            soundEnabled
              ? 'bg-[#DBEAFE] dark:bg-[#1E3A5F] border-blue-200 dark:border-blue-900/60 text-[#1D4ED8] dark:text-[#93C5FD] hover:bg-blue-100 dark:hover:bg-[#254B7C]'
              : 'bg-slate-50 dark:bg-[#111827] border-[#E2E8F0] dark:border-[#334155] text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          title="Sound Effects & Celebration Chimes: Play audio cues on level completion and confetti"
          aria-label="Toggle celebration chimes"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA]" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          <span className="text-[11px] font-semibold hidden md:inline-block">
            {soundEnabled ? 'Chimes' : 'Muted'}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-[#3B82F6] dark:hover:text-[#60A5FA] hover:bg-[#DBEAFE]/40 dark:hover:bg-slate-800 rounded-xl transition"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#1E293B]"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
                <span className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9]">Notifications</span>
                <span className="text-[10px] text-[#3B82F6] dark:text-[#60A5FA] font-medium cursor-pointer">Mark read</span>
              </div>
              <div className="py-2 space-y-2 text-xs text-slate-600 dark:text-[#CBD5E1]">
                <div className="p-2 bg-blue-50/60 dark:bg-[#111827]/80 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  <p className="font-semibold text-blue-900 dark:text-blue-300">Supabase Connected</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Row Level Security enabled for user queries.</p>
                </div>
                <div className="p-2 bg-amber-50/60 dark:bg-[#111827]/80 rounded-xl border border-amber-100 dark:border-amber-900/40">
                  <p className="font-semibold text-amber-900 dark:text-amber-300">Global Leaderboard Active</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Rise through ranks by conquering castle challenges!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Auth Section: Logged In vs Logged Out */}
        {!user ? (
          <button
            onClick={openAuthModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white dark:text-[#0F172A] text-xs font-bold shadow-xs transition active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#3B82F6] dark:bg-[#60A5FA] flex items-center justify-center text-white dark:text-[#0F172A] ring-2 ring-blue-100 dark:ring-blue-900 shadow-xs overflow-hidden font-bold text-xs uppercase">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9] leading-tight">
                  {displayName}
                </span>
                <span className="text-[10px] text-[#2563EB] dark:text-[#93C5FD] font-semibold leading-none">
                  Lv. {learnerLevel}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                <div className="px-3 py-2 border-b border-[#E2E8F0] dark:border-[#334155]">
                  <p className="font-bold text-[#1E293B] dark:text-[#F1F5F9] truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#FEF9C3] dark:bg-amber-950/60 text-[#A16207] dark:text-amber-300 font-bold text-[10px] border border-amber-200 dark:border-amber-800/60">
                    Lv. {learnerLevel} {levelTitle}
                  </span>
                </div>

                <Link
                  href="/leaderboard"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-700 dark:text-[#CBD5E1] hover:bg-[#DBEAFE]/40 dark:hover:bg-[#1E3A5F]/60 hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] rounded-lg transition"
                >
                  <Trophy className="w-3.5 h-3.5 text-[#3B82F6] dark:text-[#60A5FA]" />
                  <span>Leaderboard</span>
                </Link>

                <Link
                  href="/mind-map"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-700 dark:text-[#CBD5E1] hover:bg-[#DBEAFE]/40 dark:hover:bg-[#1E3A5F]/60 hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] rounded-lg transition"
                >
                  <Network className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>My Mind Map</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                  }}
                  className="w-full text-left flex items-center justify-between px-3 py-2 text-slate-700 dark:text-[#CBD5E1] hover:bg-[#DBEAFE]/40 dark:hover:bg-[#1E3A5F]/60 hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] rounded-lg transition"
                >
                  <div className="flex items-center space-x-2">
                    {theme === 'dark' ? (
                      <Moon className="w-3.5 h-3.5 text-sky-400" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>Theme</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 capitalize">
                    {theme}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    signOutUser();
                  }}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
