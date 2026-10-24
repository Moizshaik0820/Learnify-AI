'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { worldsData } from '@/data/worldsData';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import { validateCssSolution } from '@/lib/cssValidator';
import { FantasyCastle } from '@/components/game/FantasyCastle';
import { CodeEditor } from '@/components/game/CodeEditor';
import { TimedTypingModal } from '@/components/game/TimedTypingModal';
import { QuizModal } from '@/components/game/QuizModal';
import { CastleCopyProtectionNotice } from '@/components/game/CastleCopyProtectionNotice';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '@/lib/soundEffects';

export default function GameWorkspacePage() {
  const params = useParams();
  const router = useRouter();

  const worldId = parseInt(params.worldId as string, 10) || 1;
  const levelId = parseInt(params.levelId as string, 10) || 1;

  const world = worldsData.find((w) => w.id === worldId) || worldsData[0];
  const level = world.levels.find((l) => l.id === levelId) || world.levels[0];

  const language = useStore((s) => s.language);
  const completeLevel = useStore((s) => s.completeLevel);
  const completedLevels = useStore((s) => s.completedLevels);
  const t = translations[language];

  // State
  const [customCss, setCustomCss] = useState(level.initialCode);
  const [isPassed, setIsPassed] = useState(false);
  const [validationMsg, setValidationMsg] = useState('');
  const [isTypingModalOpen, setIsTypingModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [showLevelCompletedModal, setShowLevelCompletedModal] = useState(false);
  const [showCopyNotice, setShowCopyNotice] = useState(false);

  const copyNoticeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerCopyNotice = () => {
    setShowCopyNotice(true);
    if (copyNoticeTimerRef.current) clearTimeout(copyNoticeTimerRef.current);
    copyNoticeTimerRef.current = setTimeout(() => {
      setShowCopyNotice(false);
    }, 3200);
  };

  // Reset editor on level change
  useEffect(() => {
    setCustomCss(level.initialCode);
    setIsPassed(false);
    setValidationMsg('');
    setShowLevelCompletedModal(false);
  }, [worldId, levelId, level]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (copyNoticeTimerRef.current) clearTimeout(copyNoticeTimerRef.current);
    };
  }, []);

  const handleApplyCss = async (code: string) => {
    setCustomCss(code);

    // Validate solution
    const result = validateCssSolution(code, level.challenges);
    setIsPassed(result.isValid);
    setValidationMsg(result.message);

    if (result.isValid) {
      try {
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
        soundEffects.playCelebrationChime();
      } catch (_) {}
    }
  };

  const handleLaunchChallengeChain = () => {
    setIsTypingModalOpen(true);
  };

  const handleTypingCompleted = () => {
    setIsTypingModalOpen(false);
    setIsQuizModalOpen(true);
  };

  const handleQuizCompleted = () => {
    setIsQuizModalOpen(false);
    completeLevel(world.id, level.id, level.xpReward);
    setShowLevelCompletedModal(true);
    try {
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      soundEffects.playCelebrationChime();
    } catch (_) {}
  };

  const handleNextLevel = () => {
    setShowLevelCompletedModal(false);
    if (level.id < 24) {
      router.push(`/worlds/${world.id}/${level.id + 1}`);
    } else if (world.id < 6) {
      router.push(`/worlds/${world.id + 1}/1`);
    } else {
      router.push('/revision');
    }
  };

  // Keyboard copy interceptor scoped strictly to this gameplay workspace container
  const handleContainerKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
      if (!isPassed) {
        // Prevent copying from challenge area
        e.preventDefault();
        triggerCopyNotice();
      }
    }
  };

  const levelTitle = language === 'hinglish' && level.titleHinglish ? level.titleHinglish : level.title;
  const levelConcept = language === 'hinglish' && level.conceptHinglish ? level.conceptHinglish : level.concept;
  const levelExplanation = language === 'hinglish' && level.explanationHinglish ? level.explanationHinglish : level.explanation;
  const levelInstructions = language === 'hinglish' && level.instructionsHinglish ? level.instructionsHinglish : level.instructions;

  return (
    <div
      onKeyDown={handleContainerKeyDown}
      className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F1F5F9] flex flex-col relative transition-colors duration-200"
    >
      {/* Toast Notice: Code Copying Disabled */}
      <CastleCopyProtectionNotice
        isVisible={showCopyNotice}
        onDismiss={() => setShowCopyNotice(false)}
      />

      {/* Top Navigation Bar */}
      <header className="h-14 px-6 bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between sticky top-0 z-30 transition-colors">
        <div className="flex items-center space-x-3">
          <Link
            href={`/worlds/${world.id}`}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-500 dark:text-[#CBD5E1] hover:text-[#3B82F6] dark:hover:text-[#60A5FA] transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>World {world.id} Map</span>
          </Link>

          <span className="text-slate-300 dark:text-slate-600">|</span>

          <span className="text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9]">
            Level {level.id} of 24: <span className="font-normal text-slate-600 dark:text-[#CBD5E1]">{levelTitle}</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {level.id > 1 && (
            <Link
              href={`/worlds/${world.id}/${level.id - 1}`}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="Previous Level"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}

          <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900/60">
            +{level.xpReward} XP
          </span>

          {level.id < 24 && (
            <Link
              href={`/worlds/${world.id}/${level.id + 1}`}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="Next Level"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </header>

      {/* Main Workspace: 2 Column Layout (Left: Castle & Concept, Right: Code Editor) */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Castle Preview + Concept Explanation */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. The Interactive Fantasy Castle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#94A3B8]">
                Live Castle Construction Preview
              </h3>
              <span className="text-xs font-semibold text-[#3B82F6] dark:text-[#60A5FA]">
                Alters: {level.castleComponentChanged}
              </span>
            </div>

            <FantasyCastle
              customCss={customCss}
              activeComponent={level.castleComponentChanged}
            />
          </div>

          {/* 2. Concept Lesson & Instructions Card */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 shadow-xs space-y-4 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#1D4ED8] dark:text-[#93C5FD] bg-[#DBEAFE] dark:bg-[#1E3A5F] px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/60">
                  {levelConcept}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#1E293B] dark:text-[#F1F5F9] mt-1.5">
                  {levelTitle}
                </h2>
              </div>
            </div>

            {/* Simple Concept Explanation */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
              {levelExplanation}
            </p>

            {/* Working Example Box with Protected Code View */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-[#CBD5E1]">
                <div className="flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#3B82F6] dark:text-[#60A5FA]" />
                  <span>Working Example Code:</span>
                </div>
                {!isPassed && (
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-[#94A3B8] flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-amber-500" />
                    <span>Copy Protected</span>
                  </span>
                )}
              </div>

              {/* Protected Example Code: Drag selection and copy event intercepted */}
              <div
                onCopy={(e) => {
                  if (!isPassed) {
                    e.preventDefault();
                    triggerCopyNotice();
                  }
                }}
                onContextMenu={(e) => {
                  if (!isPassed) {
                    e.preventDefault();
                    triggerCopyNotice();
                  }
                }}
                onDragStart={(e) => e.preventDefault()}
                className="relative select-none"
              >
                <pre className="p-3 bg-slate-900 dark:bg-[#111827] rounded-xl text-cyan-300 dark:text-cyan-400 font-mono text-xs overflow-x-auto border border-slate-800 dark:border-[#334155] select-none">
                  {level.exampleCode}
                </pre>
              </div>
            </div>

            {/* Challenge Instructions */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-[#1E3A5F]/40 dark:to-[#111827] rounded-xl border border-blue-200/80 dark:border-blue-900/60 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900 dark:text-blue-300">
                <Sparkles className="w-4 h-4 text-[#3B82F6] dark:text-[#60A5FA]" />
                <span>Your Challenge:</span>
              </div>
              <p className="text-xs text-blue-950 dark:text-blue-200 leading-relaxed font-medium">
                {levelInstructions}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor */}
        <div className="lg:col-span-5 h-[580px]">
          <CodeEditor
            initialCode={level.initialCode}
            solutionCode={level.solutionCode}
            hints={level.challenges.map((c) => c.hint)}
            onApplyCss={handleApplyCss}
            onSuccessNext={handleLaunchChallengeChain}
            isPassed={isPassed}
            validationMessage={validationMsg}
            onTriggerCopyNotice={triggerCopyNotice}
          />
        </div>

      </main>

      {/* Post-Level Modals */}
      {/* 1. Timed Code-Typing Modal */}
      <TimedTypingModal
        isOpen={isTypingModalOpen}
        targetCode={level.typingChallenge.code}
        timeLimitSeconds={level.typingChallenge.timeLimitSeconds}
        onComplete={handleTypingCompleted}
        onSkip={() => {
          setIsTypingModalOpen(false);
          setIsQuizModalOpen(true);
        }}
      />

      {/* 2. Level Quiz Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        worldId={world.id}
        worldName={world.title}
        levelId={level.id}
        questions={level.quiz}
        onQuizCompleted={handleQuizCompleted}
        onClose={() => setIsQuizModalOpen(false)}
      />

      {/* 3. Level Success Announcement Modal */}
      {showLevelCompletedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-2xl border border-emerald-200 dark:border-emerald-900/60 shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#22A447] dark:text-[#4ADE80] flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-black text-[#1E293B] dark:text-[#F1F5F9]">
                {t.game.unlockedNext}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1">
                You earned <strong className="text-amber-600 dark:text-amber-300">+{level.xpReward} XP</strong> and reinforced your castle!
              </p>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/60 text-xs text-[#1B873A] dark:text-[#4ADE80] font-semibold">
              🏰 Castle Section Constructed: <strong>{level.castleComponentChanged}</strong>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-3">
              <Link
                href={`/worlds/${world.id}`}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                World Map
              </Link>

              <button
                onClick={handleNextLevel}
                className="px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white dark:text-[#0F172A] text-xs font-semibold shadow-md flex items-center space-x-1.5 transition active:scale-95"
              >
                <span>Continue Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
