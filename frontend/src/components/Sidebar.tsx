'use client';
import React, { useState, useEffect, useRef } from 'react';
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800/60 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-zinc-800/60">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">E</div>
          <div>
            <div className="font-bold text-zinc-100 text-sm">EngKnowledge</div>
            <div className="text-zinc-500 text-xs">Personal Learning OS</div>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="p-3">
        <Link href="/search" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-sm hover:border-zinc-700 transition w-full">
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

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold">M</div>
          <div>
            <div className="text-xs text-zinc-300 font-medium">Manas</div>
            <div className="text-xs text-zinc-600">Engineer</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
