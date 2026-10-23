'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Info, Sparkles, Database } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const demoMode = useStore((s) => s.demoMode);

  if (!demoMode) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-b border-purple-200/60 px-4 py-2 text-xs flex items-center justify-between text-purple-900">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
        <span>
          <strong className="font-semibold">Demo Mode Active:</strong> Progress, levels, and quizzes are persisted locally in browser storage.
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <Link
          href="/settings"
          className="flex items-center space-x-1 underline text-purple-700 hover:text-purple-900 font-medium"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Connect Supabase DB</span>
        </Link>
      </div>
    </div>
  );
};
