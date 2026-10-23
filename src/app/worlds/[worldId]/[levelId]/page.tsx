'use client';

import React, { useState, useEffect } from 'react';
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
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Code2,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GameWorkspacePage() {
  const params = useParams();
  const router = useRouter();

  const worldId = parseInt(params.worldId as string, 10) || 1;
  const levelId = parseInt(params.levelId as string, 10) || 1;

  const world = worldsData.find((w) => w.id === worldId) || worldsData[0];
  const level = world.levels.find((l) => l.id === levelId) || world.levels[0];

  const language = useStore((s) => s.language);
  const completeLevel = useStore((s) => s.completeLevel);
  const currentLevelByWorld = useStore((s) => s.currentLevelByWorld);
  const completedLevels = useStore((s) => s.completedLevels);
  const t = translations[language];

  // State
  const [customCss, setCustomCss] = useState(level.initialCode);
  const [isPassed, setIsPassed] = useState(false);
  const [validationMsg, setValidationMsg] = useState('');
  const [isTypingModalOpen, setIsTypingModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [showLevelCompletedModal, setShowLevelCompletedModal] = useState(false);

  // Check if already completed previously
  const isAlreadyCompleted = completedLevels.includes(level.globalId);

  // Reset editor on level change
  useEffect(() => {
    setCustomCss(level.initialCode);
    setIsPassed(false);
    setValidationMsg('');
    setShowLevelCompletedModal(false);
  }, [worldId, levelId, level]);

  const handleApplyCss = (code: string) => {
    setCustomCss(code);
    const result = validateCssSolution(code, level.challenges);
    setIsPassed(result.isValid);
    setValidationMsg(result.message);

    if (result.isValid) {
      try {
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
      } catch (_) {}
    }
  };

  const handleLaunchChallengeChain = () => {
    // 1. Open Timed Typing modal
    setIsTypingModalOpen(true);
  };

  const handleTypingCompleted = (accuracy: number, wpm: number) => {
    setIsTypingModalOpen(false);
    // 2. Open Quiz modal
    setIsQuizModalOpen(true);
  };

  const handleQuizCompleted = (score: number, total: number) => {
    setIsQuizModalOpen(false);
    completeLevel(world.id, level.id, level.xpReward);
    setShowLevelCompletedModal(true);
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

  const levelTitle = language === 'hinglish' && level.titleHinglish ? level.titleHinglish : level.title;
  const levelConcept = language === 'hinglish' && level.conceptHinglish ? level.conceptHinglish : level.concept;
  const levelExplanation = language === 'hinglish' && level.explanationHinglish ? level.explanationHinglish : level.explanation;
  const levelInstructions = language === 'hinglish' && level.instructionsHinglish ? level.instructionsHinglish : level.instructions;

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-14 px-6 bg-white border-b border-[#E6EAF2] flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <Link
            href={`/worlds/${world.id}`}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-purple-600 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>World {world.id} Map</span>
          </Link>

          <span className="text-slate-300">|</span>

          <span className="text-xs font-bold text-[#141C38]">
            Level {level.id} of 24: <span className="font-normal text-slate-600">{levelTitle}</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {level.id > 1 && (
            <Link
              href={`/worlds/${world.id}/${level.id - 1}`}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Previous Level"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}

          <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            +{level.xpReward} XP
          </span>

          {level.id < 24 && (
            <Link
              href={`/worlds/${world.id}/${level.id + 1}`}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Castle Construction Preview
              </h3>
              <span className="text-xs font-semibold text-purple-600">
                Alters: {level.castleComponentChanged}
              </span>
            </div>

            <FantasyCastle
              customCss={customCss}
              activeComponent={level.castleComponentChanged}
            />
          </div>

          {/* 2. Concept Lesson & Instructions Card */}
          <div className="bg-white rounded-2xl border border-[#E6EAF2] p-5 shadow-sm space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {levelConcept}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#141C38] mt-1.5">
                  {levelTitle}
                </h2>
              </div>
            </div>

            {/* Simple Concept Explanation */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {levelExplanation}
            </p>

            {/* Working Example Box */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Working Example Code:</span>
              </div>
              <pre className="p-3 bg-slate-900 rounded-xl text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800">
                {level.exampleCode}
              </pre>
            </div>

            {/* Challenge Instructions */}
            <div className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200/60 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Your Challenge:</span>
              </div>
              <p className="text-xs text-purple-900 leading-relaxed font-medium">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-purple-200 shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-black text-[#141C38]">
                {t.game.unlockedNext}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You earned <strong className="text-purple-600">+{level.xpReward} XP</strong> and reinforced your castle!
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-800">
              🏰 Castle Wall Upgraded: <strong>{level.castleComponentChanged}</strong>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-3">
              <Link
                href={`/worlds/${world.id}`}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                World Map
              </Link>

              <button
                onClick={handleNextLevel}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-md hover:from-purple-500 hover:to-indigo-500 flex items-center space-x-1.5 transition active:scale-95"
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
