import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Learnify AI — Feel the pulse of smart learning',
  description: 'Master CSS by building and styling your own magical fantasy castle. Interactive code editor, timed typing challenges, and intelligent study material analysis.',
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
        {children}
      </body>
    </html>
  );
}
