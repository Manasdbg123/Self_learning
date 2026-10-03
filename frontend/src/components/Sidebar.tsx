'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navSections = [
  {
    label: 'Overview',
    items: [{ href: '/', label: 'Dashboard', icon: '⚡' }],
  },
  {
    label: 'Learning',
    items: [
      { href: '/subjects/programming', label: 'Programming', icon: '☕' },
      { href: '/subjects/system-design', label: 'System Design', icon: '🏗️' },
      { href: '/subjects/backend', label: 'Backend Engineering', icon: '⚙️' },
      { href: '/subjects/ai', label: 'AI / ML', icon: '🤖' },
    ],
  },
  {
    label: 'Practice',
    items: [
      { href: '/lld', label: 'LLD Problems', icon: '🎨' },
      { href: '/hld', label: 'HLD Problems', icon: '🏛️' },
      { href: '/interview', label: 'Interview Mode', icon: '🎯' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/chat', label: 'AI Tutor', icon: '🤖' },
      { href: '/flashcards', label: 'Flashcards', icon: '🃏' },
      { href: '/quiz', label: 'Quizzes', icon: '📝' },
      { href: '/notes', label: 'My Notes', icon: '📓' },
    ],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-zinc-800/60 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">E</div>
          <div>
            <div className="font-bold text-zinc-100 text-sm">EngKnowledge</div>
            <div className="text-zinc-500 text-xs">Personal Learning OS</div>
          </div>
        </Link>
        {/* Close button — only shown on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="16" y2="16" />
              <line x1="16" y1="2" x2="2" y2="16" />
            </svg>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="p-3">
        <Link href="/search" onClick={onClose} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-sm hover:border-zinc-700 transition w-full">
          <span>🔍</span>
          <span>Search...</span>
          <span className="ml-auto text-xs bg-zinc-800 px-1.5 py-0.5 rounded font-mono">⌘K</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold px-3 mb-2">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                      active
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Student Status */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
              K
            </div>
            <div>
              <div className="text-xs text-zinc-200 font-semibold">Kaustuk</div>
              <div className="text-[10px] text-zinc-500">Student & Engineer</div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
            Study Mode
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800/60">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">E</div>
          <span className="font-bold text-zinc-100 text-sm">EngKnowledge</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="5" x2="18" y2="5" />
            <line x1="2" y1="10" x2="18" y2="10" />
            <line x1="2" y1="15" x2="18" y2="15" />
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer backdrop ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-zinc-950 border-r border-zinc-800/60 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ── Desktop sidebar (always visible) ── */}
      <aside className="hidden md:flex w-64 bg-zinc-950 border-r border-zinc-800/60 flex-col h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
