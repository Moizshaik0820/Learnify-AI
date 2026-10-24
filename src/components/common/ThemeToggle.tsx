'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useStore } from '@/lib/store';

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  compact = false,
}) => {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 active:scale-95 select-none ${
        isDark
          ? 'bg-[#1E293B] border-[#334155] text-[#F1F5F9] hover:bg-[#263449] hover:border-slate-600 shadow-xs'
          : 'bg-white border-[#E2E8F0] text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <Sun
          className={`w-4 h-4 text-amber-500 absolute transition-all duration-300 transform ${
            isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
          }`}
          aria-hidden="true"
        />
        {/* Moon Icon */}
        <Moon
          className={`w-4 h-4 text-sky-400 absolute transition-all duration-300 transform ${
            isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
          }`}
          aria-hidden="true"
        />
      </div>

      {!compact && (
        <span className="text-[11px] font-semibold hidden md:inline-block tracking-tight text-slate-700 dark:text-[#CBD5E1]">
          {mounted ? (isDark ? 'Dark' : 'Light') : 'Theme'}
        </span>
      )}
    </button>
  );
};
