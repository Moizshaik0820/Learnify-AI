import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface TopicRecommendation {
  worldId: number;
  levelId: number;
  title: string;
  concept: string;
}

interface Props {
  detectedConcepts: string[];
  recommendations: TopicRecommendation[];
  onBack: () => void;
}

const WORLD_NAMES: Record<number, string> = {
  1: 'Basics & Syntax',
  2: 'Styling & Typography',
  3: 'Layout & Positioning',
  4: 'Responsive Design',
  5: 'Visual Effects',
  6: 'Animations',
};

const WORLD_COLORS: Record<number, { bg: string; border: string; text: string; badge: string }> = {
  1: { bg: 'bg-blue-50/80 dark:bg-[#1E3A5F]/40', border: 'border-blue-200 dark:border-blue-900/60', text: 'text-blue-700 dark:text-blue-300', badge: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200' },
  2: { bg: 'bg-indigo-50/80 dark:bg-indigo-950/40', border: 'border-indigo-200 dark:border-indigo-900/60', text: 'text-indigo-700 dark:text-indigo-300', badge: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200' },
  3: { bg: 'bg-emerald-50/80 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-900/60', text: 'text-emerald-700 dark:text-emerald-300', badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200' },
  4: { bg: 'bg-amber-50/80 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-900/60', text: 'text-amber-700 dark:text-amber-300', badge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200' },
  5: { bg: 'bg-rose-50/80 dark:bg-rose-950/40', border: 'border-rose-200 dark:border-rose-900/60', text: 'text-rose-700 dark:text-rose-300', badge: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200' },
  6: { bg: 'bg-cyan-50/80 dark:bg-cyan-950/40', border: 'border-cyan-200 dark:border-cyan-900/60', text: 'text-cyan-700 dark:text-cyan-300', badge: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200' },
};

export const TopicSuggestions: React.FC<Props> = ({
  detectedConcepts,
  recommendations,
  onBack,
}) => {
  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-[#CBD5E1] hover:text-[#3B82F6] dark:hover:text-[#60A5FA] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to options
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-[#064E3B]/30 dark:to-[#111827] rounded-2xl border border-emerald-200 dark:border-emerald-900/60 p-5 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-[#4ADE80]" />
          <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-base">
            Topics Found in Your Material
          </h3>
        </div>
        <p className="text-sm text-emerald-700/80 dark:text-[#CBD5E1]">
          We detected <strong>{detectedConcepts.length}</strong> concepts in your
          material. Here are matching lessons you can start learning right away!
        </p>
      </div>

      {/* Detected concepts pills */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-[#334155] p-5 shadow-sm transition-colors">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-[#94A3B8] mb-3">
          Detected Concepts
        </h4>
        <div className="flex flex-wrap gap-2">
          {detectedConcepts.map((c, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-blue-50 dark:bg-[#1E3A5F]/50 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200 dark:border-blue-900/60 rounded-full text-xs font-semibold"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Lessons */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-[#94A3B8] px-1">
          Recommended Lessons
        </h4>

        {recommendations.map((rec, i) => {
          const colors = WORLD_COLORS[rec.worldId] || WORLD_COLORS[1];
          const worldName = WORLD_NAMES[rec.worldId] || `World ${rec.worldId}`;

          return (
            <div
              key={i}
              className={`${colors.bg} ${colors.border} border rounded-2xl p-4 flex items-center justify-between gap-4 hover:shadow-md transition`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`${colors.badge} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}
                  >
                    {worldName}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-[#94A3B8] font-medium">
                    Level {rec.levelId}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-gray-900 dark:text-[#F1F5F9] truncate">
                  {rec.title}
                </h5>
                <p className="text-xs text-gray-500 dark:text-[#CBD5E1] mt-0.5">
                  Concept: {rec.concept}
                </p>
              </div>

              <Link
                href={`/worlds/${rec.worldId}/${rec.levelId}`}
                className="shrink-0 px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white dark:text-[#0F172A] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Explore all */}
      <div className="text-center pt-2">
        <Link
          href="/worlds/1/1"
          className="inline-flex items-center gap-2 text-sm text-[#3B82F6] dark:text-[#60A5FA] hover:text-[#2563EB] font-medium transition"
        >
          <Sparkles className="w-4 h-4" />
          Or explore all CSS Worlds from the beginning
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
