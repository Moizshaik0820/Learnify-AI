'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);

  const isHinglish = language === 'hinglish';

  return (
    <div className="p-3 bg-white/70 dark:bg-[#111827]/70 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-[#334155] shadow-xs space-y-2 transition-colors">
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
        <Globe className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA]" />
        <span>Language</span>
      </div>

      <div className="flex items-center justify-between pt-1">
        {/* English radio */}
        <button
          onClick={() => setLanguage('en')}
          className={`flex items-center space-x-1.5 text-xs font-medium transition ${
            !isHinglish
              ? 'text-[#1D4ED8] dark:text-[#93C5FD] font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full transition ${
              !isHinglish
                ? 'bg-[#3B82F6] dark:bg-[#60A5FA] ring-2 ring-blue-200 dark:ring-blue-900'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
          />
          <span>English</span>
        </button>

        {/* Hinglish toggle button */}
        <button
          onClick={() => setLanguage(isHinglish ? 'en' : 'hinglish')}
          className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition"
        >
          <div
            className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
              isHinglish
                ? 'bg-[#3B82F6] dark:bg-[#60A5FA]'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white transition-transform ${
                isHinglish ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
          <span
            className={
              isHinglish
                ? 'text-[#1D4ED8] dark:text-[#93C5FD] font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }
          >
            हिंदी (Hinglish)
          </span>
        </button>
      </div>
    </div>
  );
};
