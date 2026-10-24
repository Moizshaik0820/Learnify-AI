'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import { FileCheck2, ChevronRight, RotateCcw } from 'lucide-react';

export default function QuizHistoryPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const language = useStore((s) => s.language);
  const quizHistory = useStore((s) => s.quizHistory);
  const weakPoints = useStore((s) => s.weakPoints);
  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F1F5F9] flex transition-colors duration-200">
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>

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

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-[#CBD5E1]">
            <Link href="/" className="hover:text-[#3B82F6] dark:hover:text-[#60A5FA] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 dark:text-[#F1F5F9] font-semibold">{t.nav.history}</span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#1E293B] dark:text-[#F1F5F9] tracking-tight">
              {t.nav.history}
            </h1>
            <p className="text-sm text-slate-500 dark:text-[#CBD5E1] mt-1">
              Review your past quiz performances, identify recurring weak concepts, and jump into revision side missions.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
              <span className="text-xs text-slate-400 dark:text-[#94A3B8] font-medium">Total Quizzes Taken</span>
              <p className="text-2xl font-black text-[#3B82F6] dark:text-[#60A5FA] mt-1">{quizHistory.length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
              <span className="text-xs text-slate-400 dark:text-[#94A3B8] font-medium">Average Score</span>
              <p className="text-2xl font-black text-[#22A447] dark:text-[#4ADE80] mt-1">
                {quizHistory.length > 0
                  ? Math.round(
                      (quizHistory.reduce((acc, q) => acc + q.score / q.total, 0) /
                        quizHistory.length) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
              <span className="text-xs text-slate-400 dark:text-[#94A3B8] font-medium">Concepts Needing Review</span>
              <p className="text-2xl font-black text-[#F97316] dark:text-[#FB923C] mt-1">{weakPoints.length}</p>
            </div>
          </div>

          {/* Quiz Attempts Table */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1E293B] dark:text-[#F1F5F9]">All Quiz Attempts</h3>
              <span className="text-xs text-slate-400 dark:text-[#94A3B8]">{quizHistory.length} recorded</span>
            </div>

            <div className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
              {quizHistory.map((q) => {
                const passed = q.score / q.total >= 0.7;
                return (
                  <div key={q.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-[#111827]/50 transition">
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        passed ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#22A447] dark:text-[#4ADE80]' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-[#FACC15]'
                      }`}>
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1E293B] dark:text-[#F1F5F9]">
                          {q.worldName} — Level {q.levelId}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 dark:text-[#94A3B8] mt-0.5">
                          <span>{q.date}</span>
                          {q.wrongConcepts.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-[#C2410C] dark:text-[#FB923C] font-medium">
                                Review: {q.wrongConcepts.join(', ')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          passed
                            ? 'bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#1B873A] dark:text-[#4ADE80]'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}>
                          {q.score} / {q.total}
                        </span>
                      </div>

                      <Link
                        href={`/worlds/${q.worldId}/${q.levelId}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#111827] hover:bg-blue-50 dark:hover:bg-[#1E3A5F] text-slate-700 dark:text-[#CBD5E1] hover:text-[#3B82F6] dark:hover:text-[#93C5FD] text-xs font-semibold flex items-center space-x-1 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake</span>
                      </Link>
                    </div>
                  </div>
                );
              })}

              {quizHistory.length === 0 && (
                <div className="p-8 text-center text-slate-400 dark:text-[#94A3B8] text-xs">
                  No quizzes taken yet. Complete your first level challenge to record quiz history!
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
