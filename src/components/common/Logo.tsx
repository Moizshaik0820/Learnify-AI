'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showTagline = true,
}) => {
  return (
    <Link href="/" className={`flex items-center space-x-3 group ${className}`}>
      {/* Official App Logo Icon */}
      <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition shrink-0">
        <Image
          src="/images/learnify-logo-icon.png"
          alt="Learnify AI Logo"
          width={40}
          height={40}
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span className="text-xl font-black tracking-tight text-[#141C38] dark:text-[#F1F5F9] transition-colors">
            Learnify
          </span>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent ml-1">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-medium tracking-tight mt-1 transition-colors">
            feel the impulse of smart learning.
          </span>
        )}
      </div>
    </Link>
  );
};
