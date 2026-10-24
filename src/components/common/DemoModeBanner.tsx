'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { ShieldCheck, LogIn, X, Sparkles } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const user = useStore((s) => s.user);
  const openAuthModal = useStore((s) => s.openAuthModal);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-[#EFF6FF] via-[#DBEAFE]/50 to-[#EFF6FF] dark:from-[#111827] dark:via-[#1E293B]/70 dark:to-[#111827] border-b border-[#E2E8F0] dark:border-[#334155] px-4 py-2 text-xs flex items-center justify-between text-slate-800 dark:text-[#F1F5F9] transition-colors">
      <div className="flex items-center space-x-2">
        {user ? (
          <ShieldCheck className="w-4 h-4 text-[#22A447] dark:text-[#4ADE80] shrink-0" />
        ) : (
          <Sparkles className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA] shrink-0" />
        )}
        <span>
          {user ? (
            <>
              <strong className="font-semibold text-[#1B873A] dark:text-[#4ADE80]">Supabase RLS Active:</strong> Authenticated as{' '}
              <strong className="text-[#1E293B] dark:text-[#F1F5F9]">{user.email}</strong>. Progress is strictly scoped to your account.
            </>
          ) : (
            <>
              <strong className="font-semibold text-[#1D4ED8] dark:text-[#93C5FD]">Supabase Authentication:</strong> Sign in or register to persist your CSS Castle journey with Row Level Security.
            </>
          )}
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {!user && (
          <button
            onClick={openAuthModal}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white dark:text-[#0F172A] font-semibold text-[11px] shadow-xs transition"
          >
            <LogIn className="w-3 h-3" />
            <span>Sign In / Register</span>
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
