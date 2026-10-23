'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  Volume2,
  VolumeX,
  LogIn,
  LogOut,
  Network,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

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
  const user = useStore((s) => s.user);
  const userProfile = useStore((s) => s.userProfile);
  const learnerLevel = useStore((s) => s.learnerLevel);
  const openAuthModal = useStore((s) => s.openAuthModal);
  const signOutUser = useStore((s) => s.signOutUser);

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

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b border-[#E6EAF2] flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Menu trigger & Search Bar */}
      <div className="flex items-center space-x-3 flex-1 max-w-xl">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search input */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search topics, worlds, or anything..."
            className="w-full pl-10 pr-12 py-2 bg-[#F8FAFD] hover:bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls: Sound Toggle, Notifications, Auth */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Sound Effects & Celebration Chimes Toggle */}
        <button
          onClick={toggleSound}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border transition ${
            soundEnabled
              ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
          }`}
          title="Sound Effects & Celebration Chimes: Play audio cues on level completion and confetti"
          aria-label="Toggle celebration chimes"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-purple-600" />
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
            className="relative p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] text-purple-600 font-medium cursor-pointer">Mark read</span>
              </div>
              <div className="py-2 space-y-2 text-xs text-slate-600">
                <div className="p-2 bg-purple-50/50 rounded-xl border border-purple-100">
                  <p className="font-semibold text-purple-900">Supabase Connected</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Row Level Security enabled for user queries.</p>
                </div>
                <div className="p-2 bg-blue-50/50 rounded-xl border border-blue-100">
                  <p className="font-semibold text-blue-900">Celebration Chimes Ready</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Audio cues will chime on level completion & confetti.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Auth Section: Logged In vs Logged Out */}
        {!user ? (
          <button
            onClick={openAuthModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-sm shadow-purple-500/20 transition active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center text-white ring-2 ring-purple-100 shadow-sm overflow-hidden font-bold text-xs uppercase">
                {displayName.charAt(0) || <User className="w-4 h-4" />}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {displayName}
                </span>
                <span className="text-[10px] text-purple-600 font-semibold leading-none">
                  Lv. {learnerLevel}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px]">
                    Level {learnerLevel} Learner
                  </span>
                </div>

                <Link
                  href="/mind-map"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>My Mind Map</span>
                </Link>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    signOutUser();
                  }}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
