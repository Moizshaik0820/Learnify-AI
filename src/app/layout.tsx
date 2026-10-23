import type { Metadata } from 'next';
import './globals.css';
import { AuthInitializer } from '@/components/auth/AuthInitializer';
import { AuthModal } from '@/components/auth/AuthModal';

export const metadata: Metadata = {
  title: 'Learnify AI — Feel the pulse of smart learning',
  description:
    'Master CSS by building and styling your own magical fantasy castle. Interactive code editor, timed typing challenges, and intelligent study material analysis.',
  icons: {
    icon: '/images/learnify-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFD] text-[#141C38] antialiased">
        <AuthInitializer />
        <AuthModal />
        {children}
      </body>
    </html>
  );
}
