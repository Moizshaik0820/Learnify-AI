'use client';

import React from 'react';

interface FantasyCastleProps {
  customCss?: string;
  activeComponent?: string;
}

export const FantasyCastle: React.FC<FantasyCastleProps> = ({
  customCss = '',
  activeComponent = 'Castle Grounds',
}) => {
  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0A0E1A] shadow-inner border border-slate-700/60 flex flex-col justify-end items-center select-none">
      {/* Scoped CSS from student editor */}
      {customCss && (
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      )}

      {/* Atmospheric Sky Layer: Moons, Stars, Clouds */}
      <div id="castle-canvas" className="absolute inset-0 pointer-events-none">
        {/* Celestial Moon */}
        <div className="absolute top-6 right-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-200 to-indigo-100 shadow-[0_0_30px_rgba(251,191,36,0.35)] opacity-90"></div>
        {/* Twinkling stars */}
        <div className="absolute top-8 left-12 w-1.5 h-1.5 bg-cyan-200 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-16 left-32 w-1 h-1 bg-white rounded-full opacity-70"></div>
        <div className="absolute top-24 left-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-75"></div>
        <div className="absolute top-12 right-1/3 w-1.5 h-1.5 bg-blue-200 rounded-full opacity-80"></div>

        {/* Floating clouds */}
        <div className="absolute top-14 left-4 w-36 h-8 bg-white/5 rounded-full blur-md"></div>
        <div className="absolute top-20 right-20 w-48 h-10 bg-indigo-500/10 rounded-full blur-lg"></div>

        {/* Mountain background silhouette */}
        <svg className="absolute bottom-16 left-0 right-0 w-full h-32 opacity-30 text-slate-800" viewBox="0 0 800 200" preserveAspectRatio="none">
          <polygon points="0,200 120,60 260,180 420,40 560,160 700,70 800,200" fill="currentColor" />
        </svg>
      </div>

      {/* Active Component Label Tag */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 text-xs text-cyan-300">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>Target: <strong>{activeComponent}</strong></span>
      </div>

      {/* ----------------- THE FANTASY CASTLE STRUCTURE ----------------- */}
      <div className="relative z-10 w-full max-w-[540px] flex flex-col items-center">
        
        {/* Spires, Flags, Weather Vane Tier */}
        <div className="w-full flex justify-between items-end px-12 mb-[-4px] relative z-20">
          {/* Left Spire & Flag */}
          <div className="flex flex-col items-center">
            <div className="castle-flag battle-flag w-8 h-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-r-md origin-left animate-pulse"></div>
            <div className="spire-roof spire-cap-shape w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[40px] border-b-cyan-500 filter drop-shadow"></div>
          </div>

          {/* Central High Spire Crown & Weather Vane */}
          <div className="flex flex-col items-center">
            <div className="weather-vane weathercock w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_8px_#F59E0B] mb-1"></div>
            <div className="spire-roof spire-crown w-0 h-0 border-l-[26px] border-l-transparent border-r-[26px] border-r-transparent border-b-[55px] border-b-indigo-500"></div>
          </div>

          {/* Right Spire & Flag */}
          <div className="flex flex-col items-center">
            <div className="castle-flag magic-banner w-8 h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-r-md origin-left"></div>
            <div className="spire-roof spire-cap-shape w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[40px] border-b-cyan-500 filter drop-shadow"></div>
          </div>
        </div>

        {/* Castle Towers & Main Keep Row */}
        <div id="master-citadel-grid" className="w-full flex justify-center items-end relative z-10">
          
          {/* LEFT TOWER */}
          <div className="left-tower watchtower outer-wall w-20 h-44 bg-slate-700 border-2 border-slate-600 rounded-t-lg relative flex flex-col items-center justify-between p-2 shadow-lg">
            {/* Battlements on top */}
            <div className="battlement-wall absolute -top-3 left-0 right-0 flex justify-between px-1">
              <div className="w-3 h-3 bg-slate-700 border-t-2 border-l-2 border-r-2 border-slate-600"></div>
              <div className="w-3 h-3 bg-slate-700 border-t-2 border-l-2 border-r-2 border-slate-600"></div>
              <div className="w-3 h-3 bg-slate-700 border-t-2 border-l-2 border-r-2 border-slate-600"></div>
            </div>
            
            {/* Slit embrasure windows */}
            <div className="embrasure w-3 h-8 bg-slate-900 border border-slate-800 rounded-full mt-4 shadow-inner"></div>
            <div className="stained-glass w-5 h-8 bg-cyan-400/30 border border-cyan-400/60 rounded-t-full shadow-[0_0_10px_rgba(6,182,212,0.4)]"></div>
            <div className="neon-rune text-[10px] text-purple-300 font-mono">✦</div>
          </div>

          {/* MAIN CENTRAL ROYAL KEEP */}
          <div id="royal-keep" className="main-keep central-keep-hall outer-wall w-48 h-56 bg-slate-800 border-2 border-slate-600 rounded-t-xl relative mx-[-6px] z-10 flex flex-col items-center justify-between p-3 shadow-2xl">
            {/* Central Battlements */}
            <div className="battlement-row absolute -top-4 left-0 right-0 flex justify-between px-2">
              <div className="w-4 h-4 bg-slate-800 border-t-2 border-l-2 border-r-2 border-slate-600"></div>
              <div className="w-4 h-4 bg-slate-800 border-t-2 border-l-2 border-r-2 border-slate-600"></div>
              <div className="w-4 h-4 bg-slate-800 border-t-2 border-l-2 border-r-2 border-slate-600"></div>
              <div className="w-4 h-4 bg-slate-800 border-t-2 border-l-2 border-r-2 border-slate-600"></div>
            </div>

            {/* Rosette Window */}
            <div className="rosette-window w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-400 to-cyan-300 border-2 border-amber-300/80 shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center justify-center text-xs font-bold text-white mt-1">
              ✦
            </div>

            {/* Throne Chamber Banner */}
            <div className="throne-chamber castle-scroll w-36 px-2 py-1 bg-slate-900/90 border border-purple-500/50 rounded text-center text-[11px] text-purple-200 tracking-wider">
              <span className="scroll-title font-semibold">CASTLE KEEP</span>
            </div>

            {/* Main Castle Gate */}
            <div id="castle-gate" className="w-24 h-24 bg-stone-900 border-2 border-stone-700 rounded-t-full relative overflow-hidden flex flex-col items-center justify-end">
              {/* Iron Portcullis Grate */}
              <div id="portcullis" className="absolute inset-0 bg-transparent border-b-4 border-slate-700 grid grid-cols-4 gap-1 p-1">
                <div className="h-full border-r border-slate-700"></div>
                <div className="h-full border-r border-slate-700"></div>
                <div className="h-full border-r border-slate-700"></div>
              </div>
              <div className="w-16 h-8 bg-amber-950/60 border-t border-amber-700/60 rounded-t-lg"></div>
            </div>
          </div>

          {/* RIGHT TOWER */}
          <div className="right-tower watchtower outer-wall w-20 h-44 bg-slate-700 border-2 border-slate-600 rounded-t-lg relative flex flex-col items-center justify-between p-2 shadow-lg">
            <div className="battlement-wall absolute -top-3 left-0 right-0 flex justify-between px-1">
              <div className="w-3 h-3 bg-slate-700 border-t-2 border-l-2 border-r-2 border-slate-600"></div>
              <div className="w-3 h-3 bg-slate-700 border-t-2 border-l-2 border-r-2 border-slate-600"></div>
              <div className="w-3 h-3 bg-slate-700 border-t-2 border-l-2 border-r-2 border-slate-600"></div>
            </div>
            
            <div className="embrasure w-3 h-8 bg-slate-900 border border-slate-800 rounded-full mt-4 shadow-inner"></div>
            <div className="stained-glass w-5 h-8 bg-cyan-400/30 border border-cyan-400/60 rounded-t-full shadow-[0_0_10px_rgba(6,182,212,0.4)]"></div>
            <div className="neon-rune text-[10px] text-purple-300 font-mono">✦</div>
          </div>

        </div>

        {/* Castle Foundation & Courtyard Tier */}
        <div id="castle-foundation" className="w-full max-w-[480px] h-8 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-t-2 border-slate-600 flex items-center justify-center shadow-lg relative z-20">
          <div className="w-32 h-1 bg-slate-600/50 rounded-full"></div>
        </div>

        {/* Drawbridge Plank & Chains */}
        <div id="drawbridge" className="relative z-20 w-32 flex flex-col items-center">
          <div id="drawbridge-plank" className="w-28 h-6 bg-amber-900 border border-amber-700 rounded-b shadow-md flex items-center justify-center text-[10px] text-amber-200">
            ===
          </div>
        </div>

        {/* Castle Moat Water Channel */}
        <div id="castle-moat" className="w-full h-12 bg-gradient-to-b from-blue-700 to-blue-950 border-t-2 border-cyan-500/50 relative overflow-hidden flex items-center justify-around">
          <div className="w-16 h-1 bg-cyan-300/40 rounded-full blur-[1px] animate-pulse"></div>
          <div className="w-24 h-1 bg-blue-300/30 rounded-full blur-[1px]"></div>
          <div className="w-12 h-1 bg-cyan-400/50 rounded-full blur-[1px] animate-pulse"></div>
        </div>

      </div>
    </div>
  );
};
