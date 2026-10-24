'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  HelpCircle,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Lock,
  Check,
} from 'lucide-react';
import { CastleCopyProtectionNotice } from './CastleCopyProtectionNotice';

interface CodeEditorProps {
  initialCode: string;
  solutionCode: string;
  hints: string[];
  onApplyCss: (code: string) => void;
  onSuccessNext?: () => void;
  isPassed: boolean;
  validationMessage?: string;
  onTriggerCopyNotice?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  solutionCode,
  hints,
  onApplyCss,
  onSuccessNext,
  isPassed,
  validationMessage,
  onTriggerCopyNotice,
}) => {
  const [code, setCode] = useState(initialCode);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showCopyNotice, setShowCopyNotice] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);

  const noticeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCode(initialCode);
    setShowHint(false);
    setShowSolution(false);
  }, [initialCode]);

  const triggerCopyNotice = () => {
    if (onTriggerCopyNotice) {
      onTriggerCopyNotice();
      return;
    }
    setShowCopyNotice(true);
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => {
      setShowCopyNotice(false);
    }, 3200);
  };

  const lines = code.split('\n');

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onApplyCss(newCode);
  };

  // Keyboard navigation & copy prevention
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Intercept Ctrl+C / Cmd+C during active challenge gameplay
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
      if (!isPassed) {
        e.preventDefault();
        triggerCopyNotice();
      }
    }

    // Support Tab indentation for smooth code editing
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = code.substring(0, start) + '  ' + code.substring(end);
      setCode(updated);
      onApplyCss(updated);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Prevent drag selection copy or clipboard write in challenge
  const handleCopy = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!isPassed) {
      e.preventDefault();
      triggerCopyNotice();
    }
  };

  // Prevent right-click context menu in active gameplay
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isPassed) {
      e.preventDefault();
      triggerCopyNotice();
    }
  };

  const handleCopyButtonClick = () => {
    if (!isPassed) {
      triggerCopyNotice();
    } else {
      // Allowed in review mode after challenge completion
      try {
        navigator.clipboard.writeText(code).then(() => {
          setCopiedReview(true);
          setTimeout(() => setCopiedReview(false), 2000);
        });
      } catch (_) {}
    }
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
    <div className="flex flex-col h-full bg-[#0F172A] rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden relative">
      {/* Internal Copy Notice Toast */}
      <CastleCopyProtectionNotice
        isVisible={showCopyNotice}
        onDismiss={() => setShowCopyNotice(false)}
      />

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
          {/* Copy Code Button: explicitly disabled with tooltip during challenge */}
          <button
            onClick={handleCopyButtonClick}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md border text-xs transition ${
              isPassed
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-emerald-300'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed opacity-80'
            }`}
            title={
              isPassed
                ? 'Copy completed code'
                : 'Code copying is disabled during castle challenges. Build it yourself to earn XP!'
            }
          >
            {isPassed ? (
              copiedReview ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="line-through decoration-amber-400/80">Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleShowHint}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-blue-950/60 hover:bg-blue-900 border border-blue-500/40 text-blue-300 transition"
            title="Get a hint"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>

          <button
            onClick={handleRevealSolution}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 transition"
            title="Inspect solution reference"
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
      <div
        onContextMenu={handleContextMenu}
        className="relative flex-1 flex font-mono text-sm leading-6 overflow-hidden"
      >
        {/* Line Numbers */}
        <div className="w-10 py-3 bg-[#0D1322] text-slate-500 select-none text-right pr-2 text-xs border-r border-slate-800/80">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area: Normal editing & typing preserved, copy intercepted during challenge */}
        <textarea
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          onCopy={handleCopy}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-emerald-300 font-mono text-sm resize-none outline-none leading-6 selection:bg-[#3B82F6]/40 selection:text-white"
        />
      </div>

      {/* Hint Alert Box if active */}
      {showHint && hints.length > 0 && (
        <div className="px-4 py-2.5 bg-blue-950/40 border-t border-blue-900/60 text-xs text-blue-200 flex items-start space-x-2">
          <HelpCircle className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
          <div>
            <strong className="text-blue-300">Architect&apos;s Hint:</strong> {hints[currentHintIndex]}
          </div>
        </div>
      )}

      {/* Solution Banner if active */}
      {showSolution && (
        <div className="px-4 py-2 bg-slate-900 border-t border-blue-800/80 text-xs text-blue-200 flex items-center justify-between">
          <span>Solution applied to editor. Build it yourself to master the concept!</span>
          <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
            Copying Disabled
          </span>
        </div>
      )}

      {/* Bottom Action & Feedback Bar */}
      <div className="px-4 py-3 bg-[#131D31] border-t border-slate-700/80 flex items-center justify-between">
        {/* Feedback message */}
        <div className="flex items-center space-x-2 text-xs">
          {isPassed ? (
            <div className="flex items-center space-x-1.5 text-[#22A447] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
              <span>Castle element reinforced! Challenge passed.</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="line-clamp-1">{validationMessage || 'Write valid CSS to strengthen the fortress.'}</span>
            </div>
          )}
        </div>

        {/* Buttons (Pixel Blue for primary, Grass Green for Passed/Next) */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onApplyCss(code)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-md shadow-blue-900/40 transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Apply to Castle</span>
          </button>

          {isPassed && onSuccessNext && (
            <button
              onClick={onSuccessNext}
              className="px-4 py-2 rounded-xl bg-[#22A447] hover:bg-[#1B873A] text-white text-xs font-semibold shadow-md shadow-emerald-900/40 transition active:scale-95 animate-bounce"
            >
              Take Quiz & Unlock →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
