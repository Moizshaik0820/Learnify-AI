import type { Metadata } from 'next';
import './globals.css';
import { AuthInitializer } from '@/components/auth/AuthInitializer';
import { ThemeInitializer } from '@/components/common/ThemeInitializer';
import { AuthModal } from '@/components/auth/AuthModal';

export const metadata: Metadata = {
  title: 'Learnify AI — Feel the pulse of smart learning',
  description:
    'Master CSS by building and styling your own magical fantasy castle. Interactive code editor, timed typing challenges, and intelligent study material analysis.',
  icons: {
    icon: '/images/learnify-logo.png',
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('learnify_theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s==='dark'||(!s&&d)?'dark':'light';var el=document.documentElement;el.classList.remove('light','dark');el.classList.add(t);el.setAttribute('data-theme',t);el.style.colorScheme=t;}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F1F5F9] antialiased transition-colors duration-200">
        <ThemeInitializer />
        <AuthInitializer />
        <AuthModal />
        {children}
      </body>
    </html>
  );
}
