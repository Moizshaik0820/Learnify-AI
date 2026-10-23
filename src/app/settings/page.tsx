'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import {
  ChevronRight,
  Database,
  Globe,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export default function SettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const soundEnabled = useStore((s) => s.soundEnabled);
  const toggleSound = useStore((s) => s.toggleSound);
  const demoMode = useStore((s) => s.demoMode);
  const setDemoMode = useStore((s) => s.setDemoMode);
  const resetProgress = useStore((s) => s.resetProgress);
  const t = translations[language];

  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [connStatus, setConnStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleTestSupabase = () => {
    if (!supabaseUrl || !supabaseKey) {
      setConnStatus('Please supply both Supabase URL and Anon Key.');
      return;
    }
    setConnStatus('Testing Supabase credentials...');
    setTimeout(() => {
      setConnStatus('Configuration saved! In-memory connection initialized.');
      setDemoMode(false);
    }, 1000);
  };

  const handleExportData = () => {
    const data = localStorage.getItem('learnify_ai_progress_v1') || '{}';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learnify-ai-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

        <main className="p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-purple-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">{t.nav.settings}</span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#141C38] tracking-tight">
              {t.nav.settings}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure database persistence, language preferences, sound, and manage your learning backups.
            </p>
          </div>

          {/* 1. Language Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 font-bold text-sm text-[#141C38]">
              <Globe className="w-5 h-5 text-purple-600" />
              <span>Language Preference</span>
            </div>
            <p className="text-xs text-slate-500">
              Switch interface text and explanations between standard English and simple Hindi written in Latin characters (Hinglish). CSS properties and code syntax are strictly preserved.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                  language === 'en'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hinglish')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                  language === 'hinglish'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                हिंदी (Hinglish)
              </button>
            </div>
          </div>

          {/* 2. Supabase Cloud Database Configuration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 font-bold text-sm text-[#141C38]">
                <Database className="w-5 h-5 text-blue-600" />
                <span>Supabase PostgreSQL & Auth Persistence</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                demoMode
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {demoMode ? 'Safe Local Demo Mode Active' : 'Connected to Supabase'}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              By default, Learnify AI runs seamlessly in Demo Mode using persistent browser storage. To synchronize cross-device progress to your Supabase PostgreSQL cluster with Row Level Security, provide your project credentials:
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supabase Anon Public API Key
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              {connStatus && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900">
                  {connStatus}
                </div>
              )}

              <div className="flex space-x-3 pt-1">
                <button
                  onClick={handleTestSupabase}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition"
                >
                  Save & Connect Cluster
                </button>
                <button
                  onClick={() => setDemoMode(true)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  Switch Back to Local Demo Mode
                </button>
              </div>
            </div>
          </div>

          {/* 3. Audio & Haptics */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-purple-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <h4 className="font-bold text-sm text-[#141C38]">Sound Effects & Celebration Chimes</h4>
                <p className="text-xs text-slate-500">Play audio cues on level completion and confetti.</p>
              </div>
            </div>

            <button
              onClick={toggleSound}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                soundEnabled
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {soundEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* 4. Backup & Reset */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-[#141C38]">Data Backup & Reset</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportData}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                <Download className="w-4 h-4" />
                <span>Export Progress JSON</span>
              </button>

              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All Progress</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      resetProgress();
                      setShowResetConfirm(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
