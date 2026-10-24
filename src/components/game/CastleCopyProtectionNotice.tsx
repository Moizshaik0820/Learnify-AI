'use client';

import React from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface CastleCopyProtectionNoticeProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export const CastleCopyProtectionNotice: React.FC<CastleCopyProtectionNoticeProps> = ({
  isVisible,
  onDismiss,
}) => {
  if (!isVisible) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#1E293B] text-white rounded-2xl p-4 shadow-2xl border border-amber-400/40 flex items-start space-x-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-[#FACC15] flex items-center justify-center shrink-0">
        <ShieldAlert className="w-5 h-5 text-amber-400" />
      </div>
      <div className="flex-1 space-y-0.5">
        <h5 className="font-bold text-xs text-amber-300">Challenge In Progress</h5>
        <p className="text-xs text-slate-200 leading-snug">
          Code copying is disabled during castle challenges. Build it yourself to earn XP!
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 text-slate-400 hover:text-white rounded"
        aria-label="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
