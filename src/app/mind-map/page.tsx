'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import {
  ChevronRight,
  Network,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles,
  ArrowRight,
  RotateCcw,
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

  const language = useStore((s) => s.language);
  const completedLevels = useStore((s) => s.completedLevels);
  const weakPoints = useStore((s) => s.weakPoints);
  const markWeakPointPracticed = useStore((s) => s.markWeakPointPracticed);
  const t = translations[language];

  // Concept nodes data
  const conceptNodes: MindNode[] = [
    {
      id: 'node-selectors',
      name: 'CSS Selectors & Cascade',
      nameHinglish: 'CSS Selectors aur Cascade',
      worldId: 1,
      levelId: 1,
      category: '1. Basics and Syntax',
      status: weakPoints.some((w) => w.concept.includes('Selector')) ? 'weak' : 'mastered',
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
      status: 'mastered',
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
      status: 'mastered',
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
      status: 'mastered',
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
      status: weakPoints.some((w) => w.concept.includes('Flexbox')) ? 'weak' : 'mastered',
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
      status: 'unlocked',
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
      status: weakPoints.some((w) => w.concept.includes('Media Queries')) ? 'weak' : 'unlocked',
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
      status: 'unlocked',
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
      status: 'locked',
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
      status: 'locked',
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
      status: 'locked',
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
      status: 'locked',
      explanation: 'Continuous living motion cycles for banners, torches, and moat waters.',
      explanationHinglish: 'Lagatar chalne wali jaadui animations banana.',
    },
  ];

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

        <main className="p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-purple-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">{t.nav.mindmap}</span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#141C38] tracking-tight">
              Interactive CSS Mind Map
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Visualize your conceptual mastery across all CSS domains. Click any node to review weak points or launch revision missions.
            </p>
          </div>

          {/* Interactive Mind Map Visual Container */}
          <div className="bg-white rounded-3xl border border-[#E6EAF2] p-6 sm:p-8 shadow-sm space-y-8">
            
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 font-medium">Mastered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-slate-600 font-medium">Needs Practice (Weak Point)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-slate-600 font-medium">Unlocked / In Progress</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="text-slate-600 font-medium">Locked Worlds</span>
              </div>
            </div>

            {/* Central Kingdom Node */}
            <div className="flex justify-center">
              <div className="p-4 px-6 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-purple-500/20 border-2 border-purple-300/40 flex items-center space-x-2.5">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Learnify AI: CSS Castle Architecture</span>
              </div>
            </div>

            {/* Grid of Concept Clusters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
              {conceptNodes.map((node) => {
                const isWeak = node.status === 'weak';
                const isMastered = node.status === 'mastered';
                const isUnlocked = node.status === 'unlocked';

                let cardStyle = 'border-slate-200 bg-slate-50/50 opacity-60';
                let badgeStyle = 'bg-slate-200 text-slate-500';

                if (isWeak) {
                  cardStyle = 'border-rose-300 bg-rose-50/40 hover:shadow-md cursor-pointer';
                  badgeStyle = 'bg-rose-100 text-rose-700 border border-rose-200';
                } else if (isMastered) {
                  cardStyle = 'border-emerald-200 bg-emerald-50/30 hover:shadow-md cursor-pointer';
                  badgeStyle = 'bg-emerald-100 text-emerald-700 border border-emerald-200';
                } else if (isUnlocked) {
                  cardStyle = 'border-purple-200 bg-white hover:shadow-md cursor-pointer';
                  badgeStyle = 'bg-purple-100 text-purple-700 border border-purple-200';
                }

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`rounded-2xl p-4.5 border transition-all ${cardStyle}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {node.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle}`}>
                        {isWeak ? 'Needs Practice' : isMastered ? 'Mastered' : isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#141C38] mt-2">
                      {language === 'hinglish' ? node.nameHinglish : node.name}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {language === 'hinglish' ? node.explanationHinglish : node.explanation}
                    </p>

                    <div className="pt-3 border-t border-slate-100/80 mt-3 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">Level {node.levelId}</span>
                      <span className="font-semibold text-purple-600 flex items-center space-x-1">
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

            <div className="pt-2 flex items-center justify-between">
              {selectedNode.status === 'weak' ? (
                <button
                  onClick={() => {
                    markWeakPointPracticed(selectedNode.name);
                    setSelectedNode(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Mark as Mastered
                </button>
              ) : <div></div>}

              <Link
                href={`/worlds/${selectedNode.worldId}/${selectedNode.levelId}`}
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition"
              >
                <span>Launch Practice Level</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
