import React from 'react';
import { FileText, BookOpen, Sparkles } from 'lucide-react';

interface Props {
  onSummarize: () => void;
  onLearn: () => void;
  isLoading?: boolean;
}

export const ActionCard: React.FC<Props> = ({ onSummarize, onLearn, isLoading }) => {
  return (
    <div className="max-w-3xl mx-auto mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-[#3B82F6] dark:text-[#60A5FA]" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-[#CBD5E1]">
          What would you like to do with this material?
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Summarize Card */}
        <button
          onClick={onSummarize}
          disabled={isLoading}
          className="group relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-[#1E3A5F]/40 dark:to-[#111827] border-2 border-blue-200 dark:border-blue-900/60 rounded-2xl hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-[#1E3A5F] flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition">
              <FileText className="w-5 h-5 text-[#3B82F6] dark:text-[#60A5FA]" />
            </div>
            <h4 className="font-bold text-blue-950 dark:text-blue-200 text-base">Summarize</h4>
          </div>
          <p className="text-sm text-blue-800/80 dark:text-[#CBD5E1] leading-relaxed">
            Get an AI-powered summary with key points, concepts, and study tips extracted from your material.
          </p>
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 rounded-2xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>

        {/* Learn It Card */}
        <button
          onClick={onLearn}
          disabled={isLoading}
          className="group relative p-6 bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-[#064E3B]/30 dark:to-[#111827] border-2 border-emerald-200 dark:border-emerald-900/60 rounded-2xl hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center group-hover:bg-emerald-200 transition">
              <BookOpen className="w-5 h-5 text-[#22A447] dark:text-[#4ADE80]" />
            </div>
            <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-base">Learn It</h4>
          </div>
          <p className="text-sm text-emerald-800/80 dark:text-[#CBD5E1] leading-relaxed">
            Discover matching lessons and challenges on Learnify related to the topics in your material.
          </p>
        </button>
      </div>
    </div>
  );
};
