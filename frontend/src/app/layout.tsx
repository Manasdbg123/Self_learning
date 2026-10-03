import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'EngKnowledge — AI Engineering Learning Platform',
  description: 'Your personal AI-powered software engineering university. Master Java, System Design, Backend, AI/ML, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-zinc-950 text-zinc-100 antialiased md:flex md:h-screen md:overflow-hidden`}>
        <Sidebar />
        <main className="flex-1 md:overflow-y-auto">
          <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto pt-[calc(3.5rem+1rem)] md:pt-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
