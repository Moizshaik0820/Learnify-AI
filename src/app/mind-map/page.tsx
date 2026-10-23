'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import { supabase } from '@/lib/supabaseClient';
import { soundEffects } from '@/lib/soundEffects';
import {
  ChevronRight,
  Network,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface MindNode {
  id: string;
  name: string;
  nameHinglish: string;
  worldId: number;
  levelId: number;
  category: string;
  status: 'mastered' | 'weak' | 'unlocked' | 'locked';
  explanation: string;
  explanationHinglish: string;
}

export default function MindMapPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MindNode | null>(null);

  const user = useStore((s) => s.user);
  const language = useStore((s) => s.language);
  const completedLevels = useStore((s) => s.completedLevels);
  const unlockedWorlds = useStore((s) => s.unlockedWorlds);
  const weakPoints = useStore((s) => s.weakPoints);
  const markWeakPointPracticed = useStore((s) => s.markWeakPointPracticed);
  const t = translations[language];

  // Raw concept definition list
  const baseConcepts = [
    {
      id: 'node-selectors',
      name: 'CSS Selectors & Cascade',
      nameHinglish: 'CSS Selectors aur Cascade',
      worldId: 1,
      levelId: 1,
      category: '1. Basics and Syntax',
      conceptKeyword: 'Selector',
      explanation: 'Element, class, and ID selectors choose which HTML components receive styles.',
      explanationHinglish: 'Element, class, aur ID selectors tay karte hain ki kis element par design lagega.',
    },
    {
      id: 'node-box-model',
      name: 'The CSS Box Model',
      nameHinglish: 'CSS Box Model (Padding, Border, Margin)',
      worldId: 1,
      levelId: 18,
      category: '1. Basics and Syntax',
      conceptKeyword: 'Box Model',
      explanation: 'Content, padding, border, and margin form the physical geometry of all castle chambers.',
      explanationHinglish: 'Content, padding, border, aur margin milkar har element ka naap banate hain.',
    },
    {
      id: 'node-typography',
      name: 'Typography & Web Fonts',
      nameHinglish: 'Typography aur Fonts',
      worldId: 2,
      levelId: 1,
      category: '2. Styling and Typography',
      conceptKeyword: 'Typography',
      explanation: 'Font-family, font-size, line-height, and font-weight craft readable royal manuscripts.',
      explanationHinglish: 'Font family, size aur weight se text ko aakarshit banaya jata hai.',
    },
    {
      id: 'node-gradients',
      name: 'Linear & Radial Gradients',
      nameHinglish: 'Linear aur Radial Gradients',
      worldId: 2,
      levelId: 15,
      category: '2. Styling and Typography',
      conceptKeyword: 'Gradient',
      explanation: 'Seamless color transitions across castle ramparts without loading heavy image assets.',
      explanationHinglish: 'Do ya zyada rangon ka smooth mel bina kisi heavy image ke.',
    },
    {
      id: 'node-flexbox',
      name: 'Flexbox Layout & Alignment',
      nameHinglish: 'Flexbox Layout aur Alignment',
      worldId: 3,
      levelId: 12,
      category: '3. Layout and Positioning',
      conceptKeyword: 'Flexbox',
      explanation: 'One-dimensional distribution along main and cross axes with justify-content and align-items.',
      explanationHinglish: 'Items ko row ya column mein barabar baantna aur align karna.',
    },
    {
      id: 'node-grid',
      name: 'CSS Grid Matrix',
      nameHinglish: 'CSS Grid Matrix (Rows aur Columns)',
      worldId: 3,
      levelId: 20,
      category: '3. Layout and Positioning',
      conceptKeyword: 'Grid',
      explanation: 'Two-dimensional grid tracks for fortress citadel architectures.',
      explanationHinglish: 'Do dishaon (rows aur columns) mein layout tay karna.',
    },
    {
      id: 'node-responsive',
      name: 'Media Queries & Breakpoints',
      nameHinglish: 'Media Queries aur Mobile Design',
      worldId: 4,
      levelId: 6,
      category: '4. Responsive Design',
      conceptKeyword: 'Media Queries',
      explanation: 'Fluid breakpoints that adapt the castle from mobile smartphones to ultra-wide displays.',
      explanationHinglish: 'Har screen size par website ko sahi dikhana.',
    },
    {
      id: 'node-clamp',
      name: 'Fluid Sizing with clamp()',
      nameHinglish: 'clamp() se Fluid Sizing',
      worldId: 4,
      levelId: 3,
      category: '4. Responsive Design',
      conceptKeyword: 'clamp',
      explanation: 'Locks values between min and max bounds based on viewport width.',
      explanationHinglish: 'Minimum aur maximum limit ke beech size ko badalna.',
    },
    {
      id: 'node-shadows',
      name: 'Box Shadows & Glows',
      nameHinglish: 'Box Shadows aur Glows',
      worldId: 5,
      levelId: 1,
      category: '5. Visual Effects',
      conceptKeyword: 'Shadow',
      explanation: 'Casts multi-layer depth shadows and neon magical crystal halos.',
      explanationHinglish: 'Element ke peeche parchhai aur chamakdaar glow banana.',
    },
    {
      id: 'node-transforms',
      name: '2D & 3D Transforms',
      nameHinglish: '2D aur 3D Transforms',
      worldId: 5,
      levelId: 9,
      category: '5. Visual Effects',
      conceptKeyword: 'Transform',
      explanation: 'Translate, rotate, and scale castle drawbridges without disrupting document flow.',
      explanationHinglish: 'Elements ko ghumana, bada karna aur shift karna.',
    },
    {
      id: 'node-transitions',
      name: 'CSS Transitions',
      nameHinglish: 'CSS Transitions',
      worldId: 6,
      levelId: 1,
      category: '6. Motion',
      conceptKeyword: 'Transition',
      explanation: 'Smoothly interpolates state changes over specified durations.',
      explanationHinglish: 'Kissi bhi badlav ko smooth banana.',
    },
    {
      id: 'node-keyframes',
      name: '@keyframes Keyframe Animations',
      nameHinglish: '@keyframes Animations',
      worldId: 6,
      levelId: 5,
      category: '6. Motion',
      conceptKeyword: 'keyframes',
      explanation: 'Continuous living motion cycles for banners, torches, and moat waters.',
      explanationHinglish: 'Lagatar chalne wali jaadui animations banana.',
    },
  ];

  // Strictly compute node status from authenticated user's actual progress
  const conceptNodes: MindNode[] = baseConcepts.map((item) => {
    const isWeak = weakPoints.some(
      (w) =>
        (w.concept.toLowerCase().includes(item.conceptKeyword.toLowerCase()) ||
          item.name.toLowerCase().includes(w.concept.toLowerCase())) &&
        w.status === 'Needs Practice'
    );

    const levelGlobalId = `world-${item.worldId}-level-${item.levelId}`;
    const isCompleted = completedLevels.includes(levelGlobalId);

    const isWorldUnlocked =
      item.worldId === 1 || unlockedWorlds.includes(item.worldId);

    let status: 'mastered' | 'weak' | 'unlocked' | 'locked' = 'locked';

    if (isWeak) {
      status = 'weak';
    } else if (isCompleted) {
      status = 'mastered';
    } else if (isWorldUnlocked) {
      status = 'unlocked';
    } else {
      status = 'locked';
    }

    return {
      id: item.id,
      name: item.name,
      nameHinglish: item.nameHinglish,
      worldId: item.worldId,
      levelId: item.levelId,
      category: item.category,
      status,
      explanation: item.explanation,
      explanationHinglish: item.explanationHinglish,
    };
  });

  const masteredCount = conceptNodes.filter((n) => n.status === 'mastered').length;
  const weakCount = conceptNodes.filter((n) => n.status === 'weak').length;
  const inProgressCount = conceptNodes.filter((n) => n.status === 'unlocked').length;

  // Sync summary to Supabase mind_map_states if user is authenticated
  useEffect(() => {
    if (user?.id) {
      const syncMindMap = async () => {
        try {
          await supabase.from('mind_map_states').upsert(
            {
              user_id: user.id,
              title: 'Learnify AI: CSS Castle Architecture',
              mastered_count: masteredCount,
              weak_count: weakCount,
              total_concepts: conceptNodes.length,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
        } catch (_) {}
      };
      syncMindMap();
    }
  }, [user?.id, masteredCount, weakCount, conceptNodes.length]);

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex">
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-navy-900/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs bg-white h-full shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-purple-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">{t.nav.mindmap}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#141C38] tracking-tight">
                Interactive CSS Mind Map
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Visualizing authenticated progress from your Supabase PostgreSQL cluster.
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{masteredCount} / {conceptNodes.length} Mastered</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{weakCount} Needs Practice</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>{inProgressCount} In Progress</span>
              </span>
            </div>
          </div>

          {/* Interactive Mind Map Visual Container */}
          <div className="bg-white rounded-3xl border border-[#E6EAF2] p-5 sm:p-7 shadow-sm space-y-6">
            
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 font-medium">Mastered ({masteredCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-slate-600 font-medium">Needs Practice ({weakCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-slate-600 font-medium">Unlocked / In Progress ({inProgressCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="text-slate-600 font-medium">Locked Worlds</span>
              </div>
            </div>

            {/* Central Kingdom Node */}
            <div className="flex justify-center">
              <div className="p-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-purple-500/20 border-2 border-purple-300/40 flex items-center space-x-2.5">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Learnify AI: CSS Castle Architecture</span>
              </div>
            </div>

            {/* Grid of Concept Clusters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-2">
              {conceptNodes.map((node) => {
                const isWeak = node.status === 'weak';
                const isMastered = node.status === 'mastered';
                const isUnlocked = node.status === 'unlocked';
                const isLocked = node.status === 'locked';

                let cardStyle = 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-50 shadow-xs cursor-pointer';
                let badgeStyle = 'bg-slate-100 text-slate-600 border border-slate-200';

                if (isWeak) {
                  cardStyle = 'border-rose-200 bg-rose-50/40 hover:border-rose-300 hover:shadow-md cursor-pointer';
                  badgeStyle = 'bg-rose-100 text-rose-700 border border-rose-200';
                } else if (isMastered) {
                  cardStyle = 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300 hover:shadow-md cursor-pointer';
                  badgeStyle = 'bg-emerald-100 text-emerald-700 border border-emerald-200';
                } else if (isUnlocked) {
                  cardStyle = 'border-purple-200 bg-purple-50/20 hover:border-purple-300 hover:shadow-md cursor-pointer';
                  badgeStyle = 'bg-purple-100 text-purple-700 border border-purple-200';
                }

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`group rounded-2xl p-4 sm:p-5 border flex flex-col justify-between h-full transition-all duration-200 hover:-translate-y-0.5 ${cardStyle}`}
                  >
                    {/* Top: Category & Status Badge */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                          {node.category}
                        </span>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${badgeStyle}`}>
                          {isWeak && <AlertTriangle className="w-2.5 h-2.5 text-rose-600 animate-pulse" />}
                          {isMastered && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                          {isUnlocked && <Sparkles className="w-2.5 h-2.5 text-purple-600" />}
                          {isLocked && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                          <span>{isWeak ? 'Needs Practice' : isMastered ? 'Mastered' : isUnlocked ? 'Unlocked' : 'Locked'}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-bold text-sm text-[#141C38] mt-2.5 leading-snug">
                        {language === 'hinglish' ? node.nameHinglish : node.name}
                      </h4>

                      {/* Explanation */}
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {language === 'hinglish' ? node.explanationHinglish : node.explanation}
                      </p>
                    </div>

                    {/* Bottom: Level & Details Link */}
                    <div className="pt-3 border-t border-slate-200/70 mt-3.5 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-slate-400">Level {node.levelId}</span>
                      <span className="font-semibold text-purple-600 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </main>
      </div>

      {/* Node Detail & Revision Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-purple-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                {selectedNode.category}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-lg font-black text-[#141C38]">
                {language === 'hinglish' ? selectedNode.nameHinglish : selectedNode.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {language === 'hinglish' ? selectedNode.explanationHinglish : selectedNode.explanation}
              </p>
            </div>

            {selectedNode.status === 'weak' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Marked as a Weak Point</span>
                </div>
                <p>Mistakes were detected in recent quizzes on this topic. Practice now to strengthen your score!</p>
              </div>
            )}

            {selectedNode.status === 'locked' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>World Currently Locked</span>
                </div>
                <p>Complete earlier CSS castle levels to unlock this domain and earn mastery points!</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              {selectedNode.status === 'weak' ? (
                <button
                  onClick={() => {
                    markWeakPointPracticed(selectedNode.name);
                    soundEffects.playSuccessPing();
                    setSelectedNode(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Mark as Mastered
                </button>
              ) : <div></div>}

              <Link
                href={selectedNode.status === 'locked' ? `/worlds/${selectedNode.worldId}` : `/worlds/${selectedNode.worldId}/${selectedNode.levelId}`}
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition"
              >
                <span>{selectedNode.status === 'locked' ? 'View World' : 'Launch Practice Level'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
