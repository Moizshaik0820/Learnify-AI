'use client';

import React, { useState } from 'react';
import { LevelQuizQuestion } from '@/types';
import { useStore } from '@/lib/store';
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizModalProps {
  isOpen: boolean;
  worldId: number;
  worldName: string;
  levelId: number;
  questions: LevelQuizQuestion[];
  onQuizCompleted: (score: number, total: number) => void;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  worldId,
  worldName,
  levelId,
  questions,
  onQuizCompleted,
  onClose,
}) => {
  const language = useStore((s) => s.language);
  const recordQuizAttempt = useStore((s) => s.recordQuizAttempt);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongConcepts, setWrongConcepts] = useState<string[]>([]);

  if (!isOpen || !questions || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleSelectOption = (index: number) => {
    if (showExplanation) return; // Locked once confirmed
    setSelectedOption(index);
    setShowExplanation(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setWrongConcepts((prev) => [...prev, currentQ.conceptTag]);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setIsFinished(true);
      const finalScore = score + (selectedOption === currentQ.correctIndex ? 0 : 0);
      
      // Save to store
      recordQuizAttempt({
        id: `quiz-w${worldId}-l${levelId}-${Date.now()}`,
        worldId,
        worldName,
        levelId,
        score: finalScore,
        total: questions.length,
        date: 'Today',
        timestamp: Date.now(),
        wrongConcepts,
      });

      if (finalScore >= Math.ceil(questions.length * 0.7)) {
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (_) {}
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
    setWrongConcepts([]);
  };

  const qText = language === 'hinglish' && currentQ.questionHinglish ? currentQ.questionHinglish : currentQ.question;
  const expText = language === 'hinglish' && currentQ.explanationHinglish ? currentQ.explanationHinglish : currentQ.explanation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-purple-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-sm">Level {levelId} Mastery Quiz</h3>
              <p className="text-[11px] text-purple-200">{worldName}</p>
            </div>
          </div>

          <div className="text-xs bg-black/25 px-2.5 py-1 rounded-full font-medium">
            {isFinished ? 'Results' : `Question ${currentIndex + 1} / ${questions.length}`}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isFinished ? (
            <div className="space-y-4">
              {/* Question */}
              <h4 className="text-base font-semibold text-slate-900 leading-snug">
                {qText}
              </h4>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-slate-800';

                  if (showExplanation) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium';
                    } else if (idx === selectedOption) {
                      btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                    } else {
                      btnStyle = 'border-slate-200 opacity-60 text-slate-500';
                    }
                  } else if (idx === selectedOption) {
                    btnStyle = 'border-purple-600 bg-purple-50 text-purple-900';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showExplanation}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showExplanation && idx === currentQ.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {showExplanation && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {showExplanation && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center space-x-1.5 font-semibold text-purple-700">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Explanation:</span>
                  </div>
                  <p>{expText}</p>
                </div>
              )}
            </div>
          ) : (
            /* Finished Summary Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                <Award className="w-8 h-8 text-amber-300" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {score === questions.length ? 'Mastery Achieved! 🏰' : 'Quiz Completed!'}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  You scored <strong className="text-purple-700 text-sm">{score}</strong> out of <strong className="text-sm">{questions.length}</strong>!
                </p>
              </div>

              {wrongConcepts.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs text-amber-800">
                  <strong>Concepts to revisit:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {Array.from(new Set(wrongConcepts)).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {!isFinished ? (
            <>
              <div></div>
              <button
                onClick={handleNext}
                disabled={!showExplanation}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:hover:bg-purple-600 text-white text-xs font-semibold shadow-md transition"
              >
                <span>{isLast ? 'Complete Quiz' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRestart}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>

              <button
                onClick={() => {
                  onQuizCompleted(score, questions.length);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition"
              >
                Unlock Level & Continue →
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
