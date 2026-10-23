'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Sparkles, ShieldCheck, LogIn, CheckCircle2, X } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const user = useStore((s) => s.user);
  const openAuthModal = useStore((s) => s.openAuthModal);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-b border-purple-200/60 px-4 py-2 text-xs flex items-center justify-between text-purple-950">
      <div className="flex items-center space-x-2">
        {user ? (
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        ) : (
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
        )}
        <span>
          {user ? (
            <>
              <strong className="font-semibold text-emerald-800">Supabase RLS Active:</strong> Authenticated as{' '}
              <strong className="text-purple-900">{user.email}</strong>. Progress is strictly scoped to your account.
            </>
          ) : (
            <>
              <strong className="font-semibold">Supabase Authentication:</strong> Sign in or register to persist your CSS Castle journey with Row Level Security.
            </>
          )}
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {!user && (
          <button
            onClick={openAuthModal}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[11px] shadow-xs transition"
          >
            <LogIn className="w-3 h-3" />
            <span>Sign In / Register</span>
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-purple-400 hover:text-purple-700 p-0.5 rounded"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
