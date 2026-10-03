import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'EngKnowledge — Engineering Learning Platform',
  description: 'Master System Design, Java, Backend Engineering & more with interactive flashcards, quizzes and curated content.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}`} style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <div className="layout-root">
          <Sidebar />
          <main className="layout-main">
            <div className="layout-content">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
