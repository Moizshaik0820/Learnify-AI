import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Castle,
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
  1: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
  2: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-800' },
  3: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' },
  4: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
  5: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800' },
  6: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-800' },
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
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to options
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-5">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-emerald-900 text-base">
            Topics Found in Your Material
          </h3>
        </div>
        <p className="text-sm text-emerald-700/80">
          We detected <strong>{detectedConcepts.length}</strong> concepts in your
          material. Here are matching lessons you can start learning right away!
        </p>
      </div>

      {/* Detected concepts pills */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Detected Concepts
        </h4>
        <div className="flex flex-wrap gap-2">
          {detectedConcepts.map((c, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-semibold"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Lessons */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
          Recommended Lessons
        </h4>

        {recommendations.map((rec, i) => {
          const colors = WORLD_COLORS[rec.worldId] || WORLD_COLORS[1];
          const worldName = WORLD_NAMES[rec.worldId] || `World ${rec.worldId}`;

          return (
            <div
              key={i}
              className={`${colors.bg} ${colors.border} border rounded-2xl p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`${colors.badge} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}
                  >
                    {worldName}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Level {rec.levelId}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-gray-900 truncate">
                  {rec.title}
                </h5>
                <p className="text-xs text-gray-500 mt-0.5">
                  Concept: {rec.concept}
                </p>
              </div>

              <Link
                href={`/worlds/${rec.worldId}/${rec.levelId}`}
                className={`shrink-0 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition`}
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
          className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium transition"
        >
          <Sparkles className="w-4 h-4" />
          Or explore all CSS Worlds from the beginning
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
