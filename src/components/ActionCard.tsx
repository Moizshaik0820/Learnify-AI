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
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h3 className="text-sm font-semibold text-gray-700">
          What would you like to do with this material?
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Summarize Card */}
        <button
          onClick={onSummarize}
          disabled={isLoading}
          className="group relative p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 rounded-2xl hover:border-purple-400 hover:shadow-lg transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-bold text-purple-900 text-base">Summarize</h4>
          </div>
          <p className="text-sm text-purple-700/80 leading-relaxed">
            Get an AI-powered summary with key points, concepts, and study tips extracted from your material.
          </p>
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 rounded-2xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>

        {/* Learn It Card */}
        <button
          onClick={onLearn}
          disabled={isLoading}
          className="group relative p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl hover:border-emerald-400 hover:shadow-lg transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-bold text-emerald-900 text-base">Learn It</h4>
          </div>
          <p className="text-sm text-emerald-700/80 leading-relaxed">
            Discover matching lessons and challenges on Learnify related to the topics in your material.
          </p>
        </button>
      </div>
    </div>
  );
};
