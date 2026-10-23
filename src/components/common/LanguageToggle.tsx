'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);

  const isHinglish = language === 'hinglish';

  return (
    <div className="p-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
        <Globe className="w-4 h-4 text-purple-600" />
        <span>Language</span>
      </div>

      <div className="flex items-center justify-between pt-1">
        {/* English radio */}
        <button
          onClick={() => setLanguage('en')}
          className={`flex items-center space-x-1.5 text-xs font-medium transition ${
            !isHinglish ? 'text-purple-700' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full transition ${
              !isHinglish ? 'bg-purple-600 ring-2 ring-purple-200' : 'bg-slate-300'
            }`}
          />
          <span>English</span>
        </button>

        {/* Hinglish toggle button */}
        <button
          onClick={() => setLanguage(isHinglish ? 'en' : 'hinglish')}
          className="flex items-center space-x-2 text-xs text-slate-600 hover:text-purple-700 transition"
        >
          <div
            className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
              isHinglish ? 'bg-purple-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white transition-transform ${
                isHinglish ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
          <span className={isHinglish ? 'text-purple-700 font-semibold' : 'text-slate-500'}>
            हिंदी (Hinglish)
          </span>
        </button>
      </div>
    </div>
  );
};
