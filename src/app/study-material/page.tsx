'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import {
  ChevronRight,
  UploadCloud,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export default function StudyMaterialPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('paste');
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const language = useStore((s) => s.language);
  const t = translations[language];

  // Quick preset sample notes
  const sampleNote1 = `Chapter 3: Mastering CSS Flexbox Layout
In this lecture, we explore CSS Flexbox. Setting display: flex creates a flex container.
Main properties include flex-direction (row vs column), justify-content (flex-start, center, space-between),
and align-items (stretch, center, flex-end). For multi-line flex structures, use flex-wrap: wrap and gap: 16px.
We will build an interactive fantasy castle bridge layout using these principles.`;

  const sampleNote2 = `Responsive Web Design & Viewport Units
Websites must adjust cleanly across desktop, tablet, and mobile displays.
Key techniques include the viewport meta tag, media queries (@media (min-width: 768px)),
fluid font sizes using clamp(1rem, 2.5vw, 2rem), and CSS grid auto-fit minmax columns.`;

  const handleAnalyzeText = async (textToUse?: string) => {
    const text = textToUse || textInput;
    if (!text.trim()) {
      setErrorMsg('Please enter or select study notes.');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/analyze-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze text');
      }

      setAnalysisResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error analyzing material.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(pdf|txt|docx)$/i)) {
      setErrorMsg('Supported formats are PDF, TXT, and DOCX.');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/analyze-study', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze file');
      }

      setAnalysisResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse file. Scanned PDFs are not supported.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex">
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-navy-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs bg-white h-full shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-purple-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">{t.nav.study}</span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#141C38] tracking-tight">
              AI Study Material Analyzer
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Upload your PDF lecture slides or paste notes to automatically extract CSS concepts, diagnose gaps, and generate tailored castle practice challenges.
            </p>
          </div>

          {/* Preset Sample Notes quick buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick Test Presets:</span>
            <button
              onClick={() => {
                setTextInput(sampleNote1);
                setActiveTab('paste');
                handleAnalyzeText(sampleNote1);
              }}
              className="px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs text-purple-700 font-medium transition"
            >
              Preset 1: Flexbox Castle Bridge Notes
            </button>
            <button
              onClick={() => {
                setTextInput(sampleNote2);
                setActiveTab('paste');
                handleAnalyzeText(sampleNote2);
              }}
              className="px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs text-blue-700 font-medium transition"
            >
              Preset 2: Responsive & Clamp Notes
            </button>
          </div>

          {/* Analyzer Card */}
          <div className="bg-white rounded-3xl border border-[#E6EAF2] p-6 shadow-sm space-y-5">
            {/* Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold max-w-md">
              <button
                onClick={() => setActiveTab('paste')}
                className={`flex-1 py-2 rounded-lg transition ${
                  activeTab === 'paste' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Paste Study Notes
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 rounded-lg transition ${
                  activeTab === 'upload' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Upload PDF File
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Paste Tab */}
            {activeTab === 'paste' && (
              <div className="space-y-3">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste your CSS lecture notes, syllabus, or coding snippets here..."
                  className="w-full h-44 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:border-purple-500 focus:bg-white resize-none"
                />
                <button
                  onClick={() => handleAnalyzeText()}
                  disabled={isAnalyzing || !textInput.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold shadow-md transition"
                >
                  {isAnalyzing ? 'Analyzing Material...' : 'Extract & Match Topics'}
                </button>
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-3">
                <label className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/20 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition text-center">
                  <UploadCloud className="w-12 h-12 text-purple-600 mb-2" />
                  <span className="text-sm font-bold text-purple-900">
                    Click to browse or drop PDF here
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Accepts text-based PDFs (max 10MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Analysis Loading State */}
            {isAnalyzing && (
              <div className="py-10 text-center space-y-3">
                <div className="w-9 h-9 mx-auto border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-semibold text-slate-600">
                  Scanning text, extracting CSS concepts, and aligning with Castle Worlds...
                </p>
              </div>
            )}

            {/* Results Display */}
            {analysisResult && !isAnalyzing && (
              <div className="space-y-5 pt-4 border-t border-slate-100 animate-in fade-in">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-xs sm:text-sm text-emerald-900 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Successfully detected {analysisResult.detectedConcepts?.length} CSS concepts!
                  </span>
                </div>

                {/* Concept Pills */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Detected Concepts:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.detectedConcepts?.map((c: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-semibold"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Matched Levels */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recommended Castle Challenges:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysisResult.recommendations?.map((rec: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-purple-600">
                            World {rec.worldId} • Level {rec.levelId}
                          </span>
                          <h5 className="font-bold text-xs sm:text-sm text-[#141C38] mt-0.5">
                            {rec.title}
                          </h5>
                        </div>
                        <Link
                          href={`/worlds/${rec.worldId}/${rec.levelId}`}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center space-x-1 shadow-sm transition"
                        >
                          <span>Play</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
