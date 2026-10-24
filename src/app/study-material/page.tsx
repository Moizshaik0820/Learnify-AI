'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import { ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { WorkspaceHeader } from '@/components/WorkspaceHeader';
import { GeminiInput } from '@/components/GeminiInput';
import { ActionCard } from '@/components/ActionCard';
import { SummaryView } from '@/components/SummaryView';
import { TopicSuggestions } from '@/components/TopicSuggestions';

type Step = 'input' | 'choose' | 'summarize' | 'learn';

interface AnalysisData {
  extractedText: string;
  detectedConcepts: string[];
  recommendations: { worldId: number; levelId: number; title: string; concept: string }[];
}

export default function StudyMaterialPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Flow state
  const [step, setStep] = useState<Step>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [summaryData, setSummaryData] = useState<any>(null);

  const language = useStore((s) => s.language);
  const t = translations[language];

  // Step 1: User submits text or file → analyze and extract concepts
  const handleSubmit = async (text: string, files: File[]) => {
    setErrorMsg('');
    setIsLoading(true);
    setSummaryData(null);

    try {
      let res;
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append('file', f));
        res = await fetch('/api/analyze-study', {
          method: 'POST',
          body: formData,
        });
      } else {
        res = await fetch('/api/analyze-study', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      setAnalysisData({
        extractedText: data.extractedText || text,
        detectedConcepts: data.detectedConcepts || [],
        recommendations: data.recommendations || [],
      });
      setStep('choose');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error analyzing material.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2a: Summarize – call AI endpoint
  const handleSummarize = async () => {
    if (!analysisData) return;
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: analysisData.extractedText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Summarization failed');

      setSummaryData(data.summary);
      setStep('summarize');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error generating summary.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2b: Learn It – show topic suggestions
  const handleLearn = () => {
    setStep('learn');
  };

  // Go back to choose step
  const handleBackToChoose = () => {
    setStep('choose');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F1F5F9] flex transition-colors duration-200">
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-10 w-64 max-w-xs bg-white dark:bg-[#1E293B] h-full shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-[#CBD5E1]">
            <Link href="/" className="hover:text-[#3B82F6] dark:hover:text-[#60A5FA] transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 dark:text-[#F1F5F9] font-semibold">{t.nav.study}</span>
          </div>

          <WorkspaceHeader />

          {/* Step 1: Input Area – always visible so user can try new material */}
          <GeminiInput onSubmit={handleSubmit} />

          {/* Loading indicator */}
          {isLoading && (
            <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 py-8">
              <Loader2 className="w-5 h-5 text-[#3B82F6] dark:text-[#60A5FA] animate-spin" />
              <span className="text-sm text-slate-500 dark:text-[#CBD5E1] font-medium">
                {step === 'input' || step === 'choose'
                  ? 'Analyzing your material...'
                  : 'Generating summary with AI...'}
              </span>
            </div>
          )}

          {/* Error */}
          {errorMsg && (
            <div className="max-w-3xl mx-auto p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start space-x-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 2: Choose Action */}
          {step === 'choose' && analysisData && !isLoading && (
            <ActionCard
              onSummarize={handleSummarize}
              onLearn={handleLearn}
              isLoading={isLoading}
            />
          )}

          {/* Step 3a: Summary View */}
          {step === 'summarize' && summaryData && (
            <SummaryView data={summaryData} onBack={handleBackToChoose} />
          )}

          {/* Step 3b: Learn It – Topic Suggestions */}
          {step === 'learn' && analysisData && (
            <TopicSuggestions
              detectedConcepts={analysisData.detectedConcepts}
              recommendations={analysisData.recommendations}
              onBack={handleBackToChoose}
            />
          )}
        </main>
      </div>
    </div>
  );
}
