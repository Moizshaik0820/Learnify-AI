'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import { FileCheck2, ChevronRight, Award, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

export default function QuizHistoryPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const language = useStore((s) => s.language);
  const quizHistory = useStore((s) => s.quizHistory);
  const weakPoints = useStore((s) => s.weakPoints);
  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex">
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-navy-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs bg-white h-full shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-purple-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">{t.nav.history}</span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#141C38] tracking-tight">
              {t.nav.history}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review your past quiz performances, identify recurring weak concepts, and jump into revision side missions.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Total Quizzes Taken</span>
              <p className="text-2xl font-black text-purple-700 mt-1">{quizHistory.length}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Average Score</span>
              <p className="text-2xl font-black text-blue-600 mt-1">
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
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Concepts Needing Review</span>
              <p className="text-2xl font-black text-rose-600 mt-1">{weakPoints.length}</p>
            </div>
          </div>

          {/* Quiz Attempts Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#141C38]">All Quiz Attempts</h3>
              <span className="text-xs text-slate-400">{quizHistory.length} recorded</span>
            </div>

            <div className="divide-y divide-slate-100">
              {quizHistory.map((q) => {
                const passed = q.score / q.total >= 0.7;
                return (
                  <div key={q.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition">
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        passed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#141C38]">
                          {q.worldName} — Level {q.levelId}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                          <span>{q.date}</span>
                          {q.wrongConcepts.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-rose-500 font-medium">
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
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {q.score} / {q.total}
                        </span>
                      </div>

                      <Link
                        href={`/worlds/${q.worldId}/${q.levelId}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-xs font-semibold flex items-center space-x-1 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake</span>
                      </Link>
                    </div>
                  </div>
                );
              })}

              {quizHistory.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
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
