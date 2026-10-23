'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { WorldCard } from '@/components/dashboard/WorldCard';
import { worldsData } from '@/data/worldsData';
import { useStore } from '@/lib/store';
import { translations } from '@/data/translations';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function WorldsOverviewPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const language = useStore((s) => s.language);
  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex">
      {/* Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
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

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-purple-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">{t.nav.worlds}</span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#141C38] tracking-tight">
              {t.worldsSection.title}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Select a world to view its 24 sequential coding challenges and construct your kingdom.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {worldsData.map((world) => (
              <WorldCard key={world.id} world={world} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
