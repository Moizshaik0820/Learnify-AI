'use client';

import React, { useState } from 'react';
import { UploadCloud, FileText, X, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import Link from 'next/link';

export const StudyMaterialCard: React.FC = () => {
  const language = useStore((s) => s.language);
  const t = translations[language];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(pdf|txt|docx)$/i)) {
      setErrorMessage('Please upload a valid PDF, TXT, or DOCX document.');
      return;
    }

    setErrorMessage('');
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
      setErrorMessage(
        err.message || 'Scanned or unreadable document detected. Try pasting text directly!'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzePastedText = async () => {
    if (!pastedText.trim()) {
      setErrorMessage('Please paste study notes or CSS code.');
      return;
    }

    setErrorMessage('');
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/analyze-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pastedText }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze text');
      }

      setAnalysisResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze study text.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E6EAF2] p-5 shadow-sm space-y-3.5">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-[#141C38]">
            {t.studyMaterial.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {t.studyMaterial.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              setActiveTab('upload');
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 text-[#7C3AED] text-xs font-semibold transition active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t.studyMaterial.uploadPdf}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('paste');
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition active:scale-95"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>{t.studyMaterial.pasteText}</span>
          </button>
        </div>

        {/* Supported Formats Footer */}
        <p className="text-[10px] text-slate-400 font-medium text-center">
          {t.studyMaterial.supportedFormats}
        </p>
      </div>

      {/* Interactive Analyzer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-purple-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <h3 className="font-bold text-sm sm:text-base">Study Material Analyzer</h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setAnalysisResult(null);
                  setErrorMessage('');
                }}
                className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    activeTab === 'upload' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Upload PDF Document
                </button>
                <button
                  onClick={() => setActiveTab('paste')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    activeTab === 'paste' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Paste Notes / Text
                </button>
              </div>

              {/* Upload Tab */}
              {activeTab === 'upload' && !analysisResult && (
                <div className="space-y-3">
                  <label className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/30 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition text-center">
                    <UploadCloud className="w-10 h-10 text-purple-500 mb-2" />
                    <span className="text-xs sm:text-sm font-semibold text-purple-900">
                      Click to choose or drag & drop PDF
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Max file size: 10MB (PDF, TXT, DOCX)
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

              {/* Paste Tab */}
              {activeTab === 'paste' && !analysisResult && (
                <div className="space-y-3">
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste CSS lecture notes, syllabus, or concepts here (e.g. 'Today we studied Flexbox justify-content and align-items...')"
                    className="w-full h-36 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:border-purple-500 focus:bg-white resize-none"
                  />
                  <button
                    onClick={handleAnalyzePastedText}
                    disabled={isAnalyzing || !pastedText.trim()}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-semibold shadow-md transition"
                  >
                    {isAnalyzing ? 'Analyzing concepts...' : 'Analyze Study Material'}
                  </button>
                </div>
              )}

              {/* Loading State */}
              {isAnalyzing && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-8 h-8 mx-auto border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-medium text-slate-600">
                    Extracting topics, matching CSS worlds, and formulating exercises...
                  </p>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Analysis Result */}
              {analysisResult && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Analysis complete! Extracted {analysisResult.detectedConcepts?.length || 0} CSS concepts.</span>
                  </div>

                  {/* Recommended Topics */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Matched Castle Worlds & Levels:
                    </h5>
                    <div className="space-y-2">
                      {analysisResult.recommendations?.map((rec: any, i: number) => (
                        <div
                          key={i}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-[#141C38]">{rec.title}</p>
                            <p className="text-[11px] text-slate-500">World {rec.worldId} • Level {rec.levelId}</p>
                          </div>
                          <Link
                            href={`/worlds/${rec.worldId}/${rec.levelId}`}
                            onClick={() => setIsModalOpen(false)}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-[11px] font-semibold flex items-center space-x-1 hover:bg-purple-700 transition"
                          >
                            <span>Practice</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reset analysis button */}
                  <button
                    onClick={() => {
                      setAnalysisResult(null);
                      setPastedText('');
                    }}
                    className="w-full py-2 text-xs text-purple-700 font-semibold hover:bg-purple-50 rounded-lg transition"
                  >
                    Analyze Another Document
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
