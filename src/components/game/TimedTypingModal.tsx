'use client';

import React, { useState, useEffect } from 'react';
import { Timer, Zap, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '@/lib/soundEffects';

interface TimedTypingModalProps {
  isOpen: boolean;
  targetCode: string;
  timeLimitSeconds: number;
  onComplete: (accuracy: number, wpm: number) => void;
  onSkip?: () => void;
}

export const TimedTypingModal: React.FC<TimedTypingModalProps> = ({
  isOpen,
  targetCode,
  timeLimitSeconds,
  onComplete,
  onSkip,
}) => {
  const [practiceMode, setPracticeMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
  const [inputLines, setInputLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentLineInput, setCurrentLineInput] = useState('');
  const [lineError, setLineError] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [totalKeyStrokes, setTotalKeyStrokes] = useState(0);
  const [correctKeyStrokes, setCorrectKeyStrokes] = useState(0);

  const targetLines = targetCode.split('\n');

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(timeLimitSeconds);
      setInputLines([]);
      setCurrentLineIndex(0);
      setCurrentLineInput('');
      setLineError(false);
      setAttempts(1);
      setTotalKeyStrokes(0);
      setCorrectKeyStrokes(0);
    }
  }, [isOpen, timeLimitSeconds]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || practiceMode) return;

    if (timeLeft <= 0) {
      // Time expired! Reset current line and penalize
      setLineError(true);
      setCurrentLineInput('');
      setAttempts((a) => a + 1);
      setTimeLeft(timeLimitSeconds);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, practiceMode, timeLimitSeconds]);

  if (!isOpen) return null;

  const currentExpectedLine = targetLines[currentLineIndex] || '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCurrentLineInput(val);
    setTotalKeyStrokes((k) => k + 1);

    // Check prefix correctness
    if (currentExpectedLine.startsWith(val)) {
      setLineError(false);
      setCorrectKeyStrokes((c) => c + 1);
    } else {
      setLineError(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Intercept Enter to advance line if matched
    if (e.key === 'Enter') {
      if (currentLineInput.trim() === currentExpectedLine.trim()) {
        const nextIndex = currentLineIndex + 1;
        setInputLines((prev) => [...prev, currentLineInput]);
        setCurrentLineInput('');
        setCurrentLineIndex(nextIndex);
        setLineError(false);
        soundEffects.playSuccessPing();

        // Check if all lines completed
        if (nextIndex >= targetLines.length) {
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          } catch (_) {}
          const accuracy = Math.round((correctKeyStrokes / Math.max(totalKeyStrokes, 1)) * 100);
          onComplete(accuracy, 40);
        }
      } else {
        // Reset line on Enter if wrong
        setLineError(true);
        setCurrentLineInput('');
        setAttempts((a) => a + 1);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 dark:bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#3B82F6] dark:bg-[#1E3A5F] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-[#FACC15] fill-[#FACC15]" />
            <div>
              <h3 className="font-bold text-sm text-white">Rapid Castle Coding Challenge</h3>
              <p className="text-[11px] text-blue-100 dark:text-blue-200">Type with accuracy to reinforce the stonework</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPracticeMode(!practiceMode)}
              className="text-xs text-blue-100 hover:text-white underline font-medium"
            >
              {practiceMode ? 'Timed Mode' : 'Practice Mode'}
            </button>

            {!practiceMode && (
              <div className="flex items-center space-x-1 font-mono font-bold text-[#FACC15] bg-black/25 px-2.5 py-1 rounded-full border border-amber-300/30">
                <Timer className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 dark:text-[#CBD5E1]">
            Solidify muscle memory! Type each line of CSS code exactly as shown. If you make a mistake or the timer expires, you must retype the whole line.
          </p>

          {/* Code Typing Box */}
          <div className="bg-slate-900 dark:bg-[#111827] rounded-xl p-4 font-mono text-sm border border-slate-800 dark:border-[#334155] space-y-2">
            {/* Previously completed lines */}
            {inputLines.map((line, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-[#22A447] dark:text-[#4ADE80]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{line}</span>
              </div>
            ))}

            {/* Currently active line to type */}
            {currentLineIndex < targetLines.length && (
              <div className="space-y-1">
                <div className="text-slate-400 dark:text-[#94A3B8] text-xs flex items-center justify-between">
                  <span>Line {currentLineIndex + 1} of {targetLines.length}:</span>
                  <span className="text-blue-300 font-semibold">Attempt {attempts}</span>
                </div>
                <div
                  onCopy={(e) => e.preventDefault()}
                  className="p-2 bg-slate-800/80 dark:bg-[#1A2536] rounded border border-blue-500/40 text-blue-200 select-none"
                >
                  {currentExpectedLine}
                </div>

                <div className="pt-2">
                  <input
                    type="text"
                    autoFocus
                    value={currentLineInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onPaste={(e) => e.preventDefault()} // Disallow pasting: must type it out
                    placeholder="Type the line here..."
                    className={`w-full px-3 py-2 rounded bg-slate-950 dark:bg-[#0A0F1D] font-mono text-sm text-white outline-none border transition ${
                      lineError
                        ? 'border-rose-500 ring-2 ring-rose-500/30'
                        : 'border-slate-700 dark:border-slate-600 focus:border-[#3B82F6] dark:focus:border-[#60A5FA] focus:ring-1 focus:ring-[#3B82F6]'
                    }`}
                  />
                  {lineError && (
                    <div className="flex items-center space-x-1.5 text-xs text-rose-400 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Character mismatch! Hit Enter to reset line or backspace to fix.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#CBD5E1] pt-1">
            <span>Accuracy: {Math.round((correctKeyStrokes / Math.max(totalKeyStrokes, 1)) * 100)}%</span>
            <span>Completed: {currentLineIndex} / {targetLines.length} lines</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-[#334155] flex items-center justify-between">
          {onSkip ? (
            <button
              onClick={onSkip}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline"
            >
              Skip to Quiz
            </button>
          ) : <div></div>}

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setCurrentLineInput('');
                setLineError(false);
              }}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-200 dark:hover:bg-[#263449] rounded-lg flex items-center space-x-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Line</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
