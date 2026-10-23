'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, HelpCircle, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CodeEditorProps {
  initialCode: string;
  solutionCode: string;
  hints: string[];
  onApplyCss: (code: string) => void;
  onSuccessNext?: () => void;
  isPassed: boolean;
  validationMessage?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  solutionCode,
  hints,
  onApplyCss,
  onSuccessNext,
  isPassed,
  validationMessage,
}) => {
  const [code, setCode] = useState(initialCode);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  const lines = code.split('\n');

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onApplyCss(newCode);
  };

  const handleReset = () => {
    setCode(initialCode);
    onApplyCss(initialCode);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleShowHint = () => {
    setShowHint(true);
    if (hints.length > 1) {
      setCurrentHintIndex((prev) => (prev + 1) % hints.length);
    }
  };

  const handleRevealSolution = () => {
    setShowSolution(true);
    setCode(solutionCode);
    onApplyCss(solutionCode);
  };

  return (
    <div className="flex flex-col h-full bg-[#0F172A] rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1E293B] border-b border-slate-700 text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="font-mono text-slate-300 ml-2 font-medium">style.css</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShowHint}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 transition"
            title="Get a hint"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>

          <button
            onClick={handleRevealSolution}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 transition"
            title="Reveal solution"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Solution</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 transition"
            title="Reset code to initial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Code Area */}
      <div className="relative flex-1 flex font-mono text-sm leading-6 overflow-hidden">
        {/* Line Numbers */}
        <div className="w-10 py-3 bg-[#0D1322] text-slate-500 select-none text-right pr-2 text-xs border-r border-slate-800/80">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={handleCodeChange}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-emerald-300 font-mono text-sm resize-none outline-none leading-6 selection:bg-purple-600/40 selection:text-white"
        />
      </div>

      {/* Hint Alert Box if active */}
      {showHint && hints.length > 0 && (
        <div className="px-4 py-2.5 bg-purple-950/40 border-t border-purple-900/60 text-xs text-purple-200 flex items-start space-x-2">
          <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-purple-300">Architect&apos;s Hint:</strong> {hints[currentHintIndex]}
          </div>
        </div>
      )}

      {/* Solution Banner if active */}
      {showSolution && (
        <div className="px-4 py-2 bg-indigo-950/60 border-t border-indigo-800 text-xs text-indigo-200">
          Solution applied to editor. Inspect and understand how each rule alters the castle!
        </div>
      )}

      {/* Bottom Action & Feedback Bar */}
      <div className="px-4 py-3 bg-[#131D31] border-t border-slate-700/80 flex items-center justify-between">
        {/* Feedback message */}
        <div className="flex items-center space-x-2 text-xs">
          {isPassed ? (
            <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Castle element reinforced! Challenge passed.</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="line-clamp-1">{validationMessage || 'Write valid CSS to strengthen the fortress.'}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onApplyCss(code)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-900/40 transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Apply to Castle</span>
          </button>

          {isPassed && onSuccessNext && (
            <button
              onClick={onSuccessNext}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-purple-900/40 transition active:scale-95 animate-bounce"
            >
              Take Quiz & Unlock →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
