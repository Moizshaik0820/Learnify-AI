'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import {
  Trophy,
  Crown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Edit3,
  X,
  Shield,
} from 'lucide-react';
import { calculateLevelAndProgress, getAvatarInitials } from '@/lib/levelSystem';

interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatarInitials: string;
  totalXp: number;
  learnerLevel: number;
  levelTitle: string;
  xpProgressInLevel: number;
  quizzesTaken: number;
  completedLevelsCount: number;
  isCurrentUser: boolean;
}

export default function LeaderboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const language = useStore((s) => s.language);
  const user = useStore((s) => s.user);
  const userProfile = useStore((s) => s.userProfile);
  const totalXp = useStore((s) => s.totalXp);
  const updateUsername = useStore((s) => s.updateUsername);
  const t = translations[language];

  // Leaderboard data state
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBuilders, setTotalBuilders] = useState(0);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  // Edit display name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaving, setNameSaving] = useState(false);

  const fetchLeaderboard = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const currentId = user?.id || '';
      const res = await fetch(
        `/api/leaderboard?page=${targetPage}&limit=15${currentId ? `&userId=${currentId}` : ''}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load leaderboard data.');
      }

      let fetchedEntries: LeaderboardEntry[] = data.entries || [];

      // If user is logged in, ensure their entry reflects the current active user
      if (user) {
        const currentCleanName =
          userProfile?.username ||
          user?.user_metadata?.full_name ||
          (user?.email ? user.email.split('@')[0] : 'Novice Builder');

        const { learnerLevel, levelTitle, currentLevelXp } = calculateLevelAndProgress(totalXp);

        // Check if user is in the fetched page list
        const existingIdx = fetchedEntries.findIndex((e) => e.id === user.id);
        if (existingIdx !== -1) {
          fetchedEntries[existingIdx] = {
            ...fetchedEntries[existingIdx],
            isCurrentUser: true,
            username: currentCleanName,
            totalXp: Math.max(fetchedEntries[existingIdx].totalXp, totalXp),
            learnerLevel,
            levelTitle,
            xpProgressInLevel: currentLevelXp,
          };
        } else if (fetchedEntries.length === 0) {
          // If database was empty, show current user as rank 1
          fetchedEntries = [
            {
              id: user.id,
              rank: 1,
              username: currentCleanName,
              avatarInitials: getAvatarInitials(currentCleanName),
              totalXp,
              learnerLevel,
              levelTitle,
              xpProgressInLevel: currentLevelXp,
              quizzesTaken: 0,
              completedLevelsCount: 0,
              isCurrentUser: true,
            },
          ];
        }
      }

      setEntries(fetchedEntries);
      setTotalPages(data.totalPages || 1);
      setTotalBuilders(data.totalBuilders || fetchedEntries.length);
      setCurrentUserRank(data.currentUserRank || (user ? 1 : null));
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the leaderboard.');
    } finally {
      setLoading(false);
    }
  }, [user, userProfile?.username, totalXp]);

  useEffect(() => {
    fetchLeaderboard(page);
  }, [fetchLeaderboard, page]);

  const handleSaveUsername = async () => {
    if (!newDisplayName.trim()) {
      setNameError('Display name cannot be empty.');
      return;
    }
    if (newDisplayName.trim().includes('@')) {
      setNameError('Display name cannot be an email address.');
      return;
    }
    setNameSaving(true);
    setNameError(null);

    const res = await updateUsername(newDisplayName.trim());
    if (res.success) {
      setIsEditingName(false);
      fetchLeaderboard(page);
    } else {
      setNameError(res.error || 'Failed to update display name.');
    }
    setNameSaving(false);
  };

  // Top 3 Podium
  const rank1 = entries.find((e) => e.rank === 1);
  const rank2 = entries.find((e) => e.rank === 2);
  const rank3 = entries.find((e) => e.rank === 3);

  // Check if current user is in the currently visible page
  const currentUserInPage = entries.find((e) => e.isCurrentUser);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F1F5F9] flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs bg-white dark:bg-[#1E293B] h-full shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Header & Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-[#FACC15] flex items-center justify-center shadow-xs border border-amber-200 dark:border-amber-900/60">
                  <Trophy className="w-6 h-6 text-amber-500 fill-amber-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] dark:text-[#F1F5F9] tracking-tight">
                    Learnify AI Leaderboard
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] font-medium mt-0.5">
                    Build your castle. Earn XP. Rise through the ranks.
                  </p>
                </div>
              </div>
            </div>

            {/* Current User Quick Summary Badge */}
            {user && (
              <div className="flex items-center space-x-3 bg-white dark:bg-[#1E293B] p-2.5 px-4 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
                <div className="w-9 h-9 rounded-full bg-[#3B82F6] dark:bg-[#60A5FA] text-white dark:text-[#0F172A] flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {getAvatarInitials(userProfile?.username || user.email?.split('@')[0])}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                      {userProfile?.username || user.email?.split('@')[0] || 'Novice Builder'}
                    </span>
                    <button
                      onClick={() => {
                        setNewDisplayName(userProfile?.username || '');
                        setIsEditingName(true);
                      }}
                      className="p-1 text-slate-400 hover:text-[#3B82F6] dark:hover:text-[#60A5FA] rounded transition"
                      title="Edit Display Name"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-[#CBD5E1]">
                    <span className="font-bold text-[#2563EB] dark:text-[#93C5FD]">
                      Rank #{currentUserRank || '—'}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-amber-600 dark:text-[#FACC15]">
                      {totalXp} XP
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Edit Display Name Modal */}
          {isEditingName && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm p-4">
              <div className="w-full max-w-sm bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-2xl p-5 space-y-3 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
                  <h3 className="font-bold text-sm text-[#1E293B] dark:text-[#F1F5F9]">Change Display Name</h3>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#CBD5E1]">
                  Your display name appears publicly on the global leaderboard. Emails and private details are never shown.
                </p>
                <div>
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="Enter castle builder name..."
                    maxLength={30}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-xs sm:text-sm text-slate-800 dark:text-[#F1F5F9] outline-none focus:border-[#3B82F6] dark:focus:border-[#60A5FA] focus:bg-white dark:focus:bg-[#111827]"
                  />
                  {nameError && (
                    <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 font-medium">{nameError}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#263449]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveUsername}
                    disabled={nameSaving}
                    className="px-4 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white dark:text-[#0F172A] text-xs font-bold transition shadow-xs disabled:opacity-50"
                  >
                    {nameSaving ? 'Saving...' : 'Save Name'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Top 3 Podium (Rank 1 Gold, Rank 2 Silver, Rank 3 Bronze) */}
          {!loading && !error && entries.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 items-end">
              {/* Rank 2: Silver Treatment (Restrained neutral gray) */}
              <div className="order-2 md:order-1 bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-[#334155] p-5 shadow-xs flex flex-col items-center text-center relative overflow-hidden transition-transform hover:-translate-y-1">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600" />
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#263449] border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center font-black text-xs mb-3 shadow-xs">
                  2
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-[#263449] dark:to-[#111827] border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 font-black text-lg mb-2 shadow-inner">
                  {rank2 ? rank2.avatarInitials : '—'}
                </div>
                <h3 className="font-bold text-sm text-[#1E293B] dark:text-[#F1F5F9] truncate max-w-[180px]">
                  {rank2 ? rank2.username : 'Awaiting Builder'}
                </h3>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-[#CBD5E1] mt-0.5">
                  {rank2 ? `Lv. ${rank2.learnerLevel} • ${rank2.levelTitle}` : 'Level —'}
                </span>
                <div className="mt-3 px-3 py-1 bg-slate-100 dark:bg-[#111827] rounded-full border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-700 dark:text-[#CBD5E1]">
                  {rank2 ? `${rank2.totalXp} XP` : '0 XP'}
                </div>
              </div>

              {/* Rank 1: Gold Treatment (#FACC15) Elevated */}
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50/60 to-white dark:from-[#78350F]/25 dark:to-[#1E293B] rounded-3xl border-2 border-[#FACC15] dark:border-[#FACC15]/80 p-6 shadow-md flex flex-col items-center text-center relative overflow-hidden md:-translate-y-3 transition-transform hover:-translate-y-4">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-yellow-300 via-[#FACC15] to-yellow-400" />
                <div className="absolute top-3 right-3 text-amber-500">
                  <Crown className="w-5 h-5 fill-amber-400" />
                </div>
                <div className="w-9 h-9 rounded-full bg-[#FACC15] text-amber-950 flex items-center justify-center font-black text-sm mb-3 shadow-sm border border-yellow-300">
                  1
                </div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-amber-100 to-yellow-200 dark:from-amber-950/70 dark:to-yellow-900/60 border-3 border-[#FACC15] flex items-center justify-center text-amber-950 dark:text-amber-200 font-black text-2xl mb-2 shadow-md">
                  {rank1 ? rank1.avatarInitials : '👑'}
                </div>
                <h3 className="font-black text-base text-[#1E293B] dark:text-[#F1F5F9] truncate max-w-[200px]">
                  {rank1 ? rank1.username : 'Castle Champion'}
                </h3>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 mt-0.5">
                  {rank1 ? `Lv. ${rank1.learnerLevel} • ${rank1.levelTitle}` : 'Level —'}
                </span>
                <div className="mt-3 px-4 py-1.5 bg-[#FACC15] rounded-full border border-yellow-400 text-xs font-black text-amber-950 shadow-xs flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{rank1 ? `${rank1.totalXp} XP` : '0 XP'}</span>
                </div>
              </div>

              {/* Rank 3: Bronze Treatment (#F97316 Warm Orange) */}
              <div className="order-3 bg-white dark:bg-[#1E293B] rounded-3xl border border-orange-200 dark:border-orange-950/80 p-5 shadow-xs flex flex-col items-center text-center relative overflow-hidden transition-transform hover:-translate-y-1">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-300 via-[#F97316] to-orange-400" />
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-300 flex items-center justify-center font-black text-xs mb-3 shadow-xs">
                  3
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-[#111827] border-2 border-[#F97316] flex items-center justify-center text-orange-800 dark:text-orange-300 font-black text-lg mb-2 shadow-inner">
                  {rank3 ? rank3.avatarInitials : '—'}
                </div>
                <h3 className="font-bold text-sm text-[#1E293B] dark:text-[#F1F5F9] truncate max-w-[180px]">
                  {rank3 ? rank3.username : 'Awaiting Builder'}
                </h3>
                <span className="text-[11px] font-semibold text-orange-600 dark:text-[#FB923C] mt-0.5">
                  {rank3 ? `Lv. ${rank3.learnerLevel} • ${rank3.levelTitle}` : 'Level —'}
                </span>
                <div className="mt-3 px-3 py-1 bg-orange-50 dark:bg-orange-950/50 rounded-full border border-orange-200 dark:border-orange-900/60 text-xs font-bold text-orange-700 dark:text-orange-300">
                  {rank3 ? `${rank3.totalXp} XP` : '0 XP'}
                </div>
              </div>
            </div>
          )}

          {/* Off-page User Rank Notification Callout */}
          {user && currentUserRank && !currentUserInPage && (
            <div className="p-3.5 bg-[#DBEAFE]/60 dark:bg-[#1E3A5F]/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl flex items-center justify-between text-xs text-[#1D4ED8] dark:text-[#93C5FD] animate-in fade-in">
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA] shrink-0" />
                <span>
                  You are currently ranked <strong className="font-bold">#{currentUserRank}</strong> globally with{' '}
                  <strong className="font-bold">{totalXp} XP</strong>.
                </span>
              </div>
              <button
                onClick={() => setPage(Math.ceil((currentUserRank || 1) / 15))}
                className="font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline shrink-0 ml-2"
              >
                Go to my page →
              </button>
            </div>
          )}

          {/* Ranked Table Container */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-slate-50/70 dark:bg-[#111827]/70 border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-[#1E293B] dark:text-[#F1F5F9]">Castle Builder Rankings</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-[#CBD5E1]">
                  {totalBuilders} Players
                </span>
              </div>

              <button
                onClick={() => fetchLeaderboard(page)}
                disabled={loading}
                className="flex items-center space-x-1 text-xs font-semibold text-[#3B82F6] dark:text-[#60A5FA] hover:text-[#2563EB] dark:hover:text-[#93C5FD] transition"
                title="Refresh Leaderboard"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Loading Skeleton */}
            {loading && (
              <div className="p-6 space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#111827] animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="space-y-1.5">
                        <div className="w-28 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="w-16 h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                    </div>
                    <div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="p-8 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-[#F1F5F9]">Unable to load leaderboard</h4>
                  <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-0.5">{error}</p>
                </div>
                <button
                  onClick={() => fetchLeaderboard(page)}
                  className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white dark:text-[#0F172A] text-xs font-bold rounded-xl transition shadow-xs"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && entries.length === 0 && (
              <div className="p-10 text-center space-y-3">
                <Trophy className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h4 className="font-bold text-sm text-[#1E293B] dark:text-[#F1F5F9]">No Builders On The Leaderboard Yet</h4>
                <p className="text-xs text-slate-500 dark:text-[#CBD5E1] max-w-sm mx-auto">
                  Be the first architect to earn XP by completing CSS Castle challenges and claim Rank #1!
                </p>
                <Link
                  href="/worlds/1/1"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white dark:text-[#0F172A] text-xs font-bold rounded-xl transition shadow-xs"
                >
                  <span>Start Castle Challenge</span>
                </Link>
              </div>
            )}

            {/* Table Rows: Rank | Player | Level | Total XP */}
            {!loading && !error && entries.length > 0 && (
              <div className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
                {/* Desktop Header Row */}
                <div className="hidden sm:grid sm:grid-cols-12 px-6 py-2.5 text-[11px] font-bold text-slate-400 dark:text-[#94A3B8] uppercase tracking-wider bg-slate-50/40 dark:bg-[#111827]/40">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-5">Player</div>
                  <div className="col-span-3">Level & Title</div>
                  <div className="col-span-3 text-right">Total XP</div>
                </div>

                {entries.map((player) => {
                  const isTop1 = player.rank === 1;
                  const isTop2 = player.rank === 2;
                  const isTop3 = player.rank === 3;

                  return (
                    <div
                      key={player.id}
                      className={`grid grid-cols-1 sm:grid-cols-12 px-4 sm:px-6 py-3.5 items-center gap-2 sm:gap-0 transition ${
                        player.isCurrentUser
                          ? 'bg-[#EFF6FF] dark:bg-[#1E3A5F]/40 border-l-4 border-l-[#3B82F6] dark:border-l-[#60A5FA] font-semibold'
                          : 'hover:bg-slate-50/80 dark:hover:bg-[#111827]/50'
                      }`}
                    >
                      {/* Rank Column */}
                      <div className="sm:col-span-1 flex items-center space-x-1.5">
                        {isTop1 ? (
                          <span className="w-6 h-6 rounded-full bg-[#FACC15] text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">
                            1
                          </span>
                        ) : isTop2 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                            2
                          </span>
                        ) : isTop3 ? (
                          <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-bold text-xs flex items-center justify-center">
                            3
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-1.5">
                            #{player.rank}
                          </span>
                        )}
                      </div>

                      {/* Player Column */}
                      <div className="sm:col-span-5 flex items-center space-x-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0 ${
                            isTop1
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                              : isTop2
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                              : isTop3
                              ? 'bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-200 border border-orange-300 dark:border-orange-700'
                              : 'bg-blue-100 dark:bg-[#1E3A5F] text-[#1D4ED8] dark:text-[#93C5FD]'
                          }`}
                        >
                          {player.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs sm:text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9] truncate">
                              {player.username}
                            </span>
                            {player.isCurrentUser && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#3B82F6] dark:bg-[#60A5FA] text-white dark:text-[#0F172A]">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 dark:text-[#94A3B8] sm:hidden block">
                            Lv. {player.learnerLevel} • {player.totalXp} XP
                          </span>
                        </div>
                      </div>

                      {/* Level & Title Column */}
                      <div className="hidden sm:block sm:col-span-3">
                        <span className="text-xs font-bold text-slate-700 dark:text-[#CBD5E1] block">
                          Level {player.learnerLevel}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-[#94A3B8] truncate block">
                          {player.levelTitle}
                        </span>
                      </div>

                      {/* Total XP Column */}
                      <div className="sm:col-span-3 text-right">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 text-xs font-black">
                          <span>{player.totalXp.toLocaleString()}</span>
                          <span className="text-[10px] text-amber-500 font-bold">XP</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && !error && totalPages > 1 && (
              <div className="px-6 py-3.5 bg-slate-50/60 dark:bg-[#111827]/60 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-[#CBD5E1]">
                  Page <strong className="text-slate-800 dark:text-[#F1F5F9]">{page}</strong> of <strong className="text-slate-800 dark:text-[#F1F5F9]">{totalPages}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#263449] disabled:opacity-40 transition"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-2 py-1 font-bold text-slate-700 dark:text-[#F1F5F9]">
                    {page}
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#263449] disabled:opacity-40 transition"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
