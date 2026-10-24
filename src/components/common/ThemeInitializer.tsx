'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export const ThemeInitializer: React.FC = () => {
  const initializeTheme = useStore((s) => s.initializeTheme);
  const setTheme = useStore((s) => s.setTheme);

  useEffect(() => {
    // Initialize theme from storage or system preference
    initializeTheme();

    // Listen to OS theme changes if user has not explicitly locked a preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem('learnify_theme');
        if (!stored) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch (_) {}
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [initializeTheme, setTheme]);

  return null;
};
