'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { X, Mail, Lock, User, Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const isAuthModalOpen = useStore((s) => s.isAuthModalOpen);
  const closeAuthModal = useStore((s) => s.closeAuthModal);
  const signInWithEmail = useStore((s) => s.signInWithEmail);
  const signUpWithEmail = useStore((s) => s.signUpWithEmail);
  const authLoading = useStore((s) => s.authLoading);
  const authError = useStore((s) => s.authError);
  const authSuccessMessage = useStore((s) => s.authSuccessMessage);
  const setAuthError = useStore((s) => s.setAuthError);

  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup') {
      const res = await signUpWithEmail(email.trim(), password, fullName.trim() || 'Novice Builder');
      if (res.success && !res.message?.includes('confirmation')) {
        setTimeout(() => closeAuthModal(), 1200);
      }
    } else {
      const res = await signInWithEmail(email.trim(), password);
      if (res.success) {
        closeAuthModal();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={closeAuthModal}
      />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1E293B] rounded-3xl border border-[#E2E8F0] dark:border-[#334155] shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 transition-colors">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#3B82F6] dark:bg-[#60A5FA] flex items-center justify-center text-white dark:text-[#0F172A] shadow-md shadow-blue-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1E293B] dark:text-[#F1F5F9] tracking-tight">
              Learnify AI
            </h2>
            <p className="text-[11px] text-[#2563EB] dark:text-[#93C5FD] font-semibold uppercase tracking-wider">
              Supabase Auth & PostgreSQL
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mb-6">
          {mode === 'signup'
            ? 'Create your account. A blank Mind Map and state starting at 0 will be provisioned automatically.'
            : 'Sign in with your email and password to access your castle progress.'}
        </p>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-[#111827] rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setAuthError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              mode === 'signup'
                ? 'bg-white dark:bg-[#1E293B] text-[#1D4ED8] dark:text-[#93C5FD] shadow-xs'
                : 'text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setAuthError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              mode === 'signin'
                ? 'bg-white dark:bg-[#1E293B] text-[#1D4ED8] dark:text-[#93C5FD] shadow-xs'
                : 'text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Alert feedback */}
        {authError && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start space-x-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {authSuccessMessage && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-start space-x-2 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authSuccessMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
                Full Name / Learner Tag
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#94A3B8]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Castle Architect"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-xs sm:text-sm text-slate-800 dark:text-[#F1F5F9] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:bg-white dark:focus:bg-[#111827] focus:border-[#3B82F6] dark:focus:border-[#60A5FA] focus:ring-2 focus:ring-[#DBEAFE] dark:focus:ring-blue-900/40 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#94A3B8]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-xs sm:text-sm text-slate-800 dark:text-[#F1F5F9] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:bg-white dark:focus:bg-[#111827] focus:border-[#3B82F6] dark:focus:border-[#60A5FA] focus:ring-2 focus:ring-[#DBEAFE] dark:focus:ring-blue-900/40 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#94A3B8]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-xs sm:text-sm text-slate-800 dark:text-[#F1F5F9] placeholder-slate-400 dark:placeholder-[#94A3B8] outline-none focus:bg-white dark:focus:bg-[#111827] focus:border-[#3B82F6] dark:focus:border-[#60A5FA] focus:ring-2 focus:ring-[#DBEAFE] dark:focus:ring-blue-900/40 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white dark:text-[#0F172A] font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {authLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'signup' ? 'Create Account & Initialize State' : 'Sign In'}</span>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400 dark:text-[#94A3B8]">
          Protected by Supabase Row Level Security (RLS) policies.
        </div>
      </div>
    </div>
  );
};
