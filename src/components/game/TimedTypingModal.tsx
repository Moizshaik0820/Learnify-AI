'use client';

import React, { useState, useEffect } from 'react';
import { Timer, Zap, CheckCircle2, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
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
      setCorrectKeyStrokes((k) => k + 1);

      // If finished typing line exactly
      if (val === currentExpectedLine) {
        const nextIndex = currentLineIndex + 1;
        setInputLines([...inputLines, val]);
        setCurrentLineInput('');

        if (nextIndex >= targetLines.length) {
          // Completed all lines!
          try {
            confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
            soundEffects.playCelebrationChime();
          } catch (_) {}

          const accuracy = Math.round(
            (correctKeyStrokes / Math.max(totalKeyStrokes, 1)) * 100
          );
          const elapsed = Math.max(timeLimitSeconds - timeLeft, 5);
          const wordCount = targetCode.split(/\s+/).length;
          const wpm = Math.round((wordCount / elapsed) * 60);

          onComplete(accuracy, wpm);
        } else {
          setCurrentLineIndex(nextIndex);
        }
      }
    } else {
      setLineError(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (currentLineInput !== currentExpectedLine) {
        // Punish incorrect submission: clear whole line and increment attempt
        setLineError(true);
        setCurrentLineInput('');
        setAttempts((a) => a + 1);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-purple-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">Speed Code Typing Challenge</h3>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {/* Practice Mode Toggle */}
            <button
              onClick={() => setPracticeMode(!practiceMode)}
              className={`px-2.5 py-1 rounded-full border transition ${
                practiceMode
                  ? 'bg-amber-400 text-slate-900 border-amber-300 font-semibold'
                  : 'bg-white/20 hover:bg-white/30 border-white/30 text-white'
              }`}
            >
              {practiceMode ? 'Practice Mode: ON' : 'Practice Mode: OFF'}
            </button>

            {/* Timer */}
            {!practiceMode && (
              <div className="flex items-center space-x-1 font-mono font-bold text-amber-300 bg-black/30 px-2.5 py-1 rounded-full">
                <Timer className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Solidify muscle memory! Type each line of CSS code exactly as shown. If you make a mistake or the timer expires, you must retype the whole line.
          </p>

          {/* Code Typing Box */}
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm border border-slate-800 space-y-2">
            {/* Previously completed lines */}
            {inputLines.map((line, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{line}</span>
              </div>
            ))}

            {/* Currently active line to type */}
            {currentLineIndex < targetLines.length && (
              <div className="space-y-1">
                <div className="text-slate-400 text-xs flex items-center justify-between">
                  <span>Line {currentLineIndex + 1} of {targetLines.length}:</span>
                  <span className="text-purple-300 font-semibold">Attempt {attempts}</span>
                </div>
                <div className="p-2 bg-slate-800/80 rounded border border-purple-500/40 text-purple-200">
                  {currentExpectedLine}
                </div>

                <div className="pt-2">
                  <input
                    type="text"
                    autoFocus
                    value={currentLineInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type the line here..."
                    className={`w-full px-3 py-2 rounded bg-slate-950 font-mono text-sm text-white outline-none border transition ${
                      lineError
                        ? 'border-rose-500 ring-2 ring-rose-500/30'
                        : 'border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
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
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Accuracy: {Math.round((correctKeyStrokes / Math.max(totalKeyStrokes, 1)) * 100)}%</span>
            <span>Completed: {currentLineIndex} / {targetLines.length} lines</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {onSkip ? (
            <button
              onClick={onSkip}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
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
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
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
