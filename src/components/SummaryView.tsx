import React from 'react';
import {
  CheckCircle2,
  Lightbulb,
  BookOpen,
  ClipboardCopy,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface SummaryData {
  overview?: string;
  keyPoints?: string[];
  concepts?: string[];
  detailedSummary?: string;
  studyTips?: string[];
}

interface Props {
  data: SummaryData;
  onBack: () => void;
}

export const SummaryView: React.FC<Props> = ({ data, onBack }) => {
  const [copied, setCopied] = React.useState(false);

  const copyAll = () => {
    const text = [
      data.overview,
      data.detailedSummary,
      ...(data.keyPoints || []),
      ...(data.studyTips || []),
    ]
      .filter(Boolean)
      .join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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

      {/* Success banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <span className="text-sm font-semibold text-emerald-900">
          Summary generated successfully!
        </span>
      </div>

      {/* Overview */}
      {data.overview && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              Overview
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {data.overview}
          </p>
        </div>
      )}

      {/* Key Points */}
      {data.keyPoints && data.keyPoints.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              Key Points
            </h3>
          </div>
          <ul className="space-y-2">
            {data.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-700 text-sm leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Concepts */}
      {data.concepts && data.concepts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              Key Concepts
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.concepts.map((c, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-semibold"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Summary */}
      {data.detailedSummary && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3">
            Detailed Summary
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {data.detailedSummary}
          </p>
        </div>
      )}

      {/* Study Tips */}
      {data.studyTips && data.studyTips.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-amber-900 text-sm uppercase tracking-wider">
              Study Tips
            </h3>
          </div>
          <ul className="space-y-2">
            {data.studyTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                <span className="text-amber-500 mt-0.5">💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Copy button */}
      <div className="flex justify-end">
        <button
          onClick={copyAll}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition"
        >
          <ClipboardCopy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy Summary'}
        </button>
      </div>
    </div>
  );
};
