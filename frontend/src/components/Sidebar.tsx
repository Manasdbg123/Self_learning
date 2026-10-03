'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navSections = [
  {
    label: 'Home',
    items: [{ href: '/', label: 'Dashboard', icon: '🏠' }],
  },
  {
    label: 'Subjects',
    items: [
      { href: '/subjects/programming', label: 'Java & OOP', icon: '☕' },
      { href: '/subjects/system-design', label: 'System Design', icon: '🏗️' },
      { href: '/subjects/backend', label: 'Backend Eng.', icon: '⚙️' },
      { href: '/subjects/ai', label: 'AI / ML', icon: '🤖' },
    ],
  },
  {
    label: 'Practice',
    items: [
      { href: '/hld', label: 'HLD Problems', icon: '🏛️' },
      { href: '/lld', label: 'LLD Problems', icon: '🎨' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/search', label: 'Search Topics', icon: '🔍' },
      { href: '/chat', label: 'AI Tutor', icon: '💬' },
    ],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo / Brand */}
      <div className="px-4 py-5 border-b border-[#1e2438] flex items-center justify-between shrink-0">
        <Link href="/" onClick={onClose} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-base font-bold shadow-lg shadow-indigo-500/30">
            📖
          </div>
          <div>
            <div className="font-bold text-slate-100 text-sm tracking-tight">EngKnowledge</div>
            <div className="text-[11px] text-slate-500">Your Learning OS</div>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-[#1e2438] transition"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="14" y2="14" />
              <line x1="14" y1="2" x2="2" y2="14" />
            </svg>
          </button>
        )}
      </div>

      {/* Quick Search */}
      <div className="px-3 py-3 shrink-0">
        <Link
          href="/search"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#1a1f2e] border border-[#242840] text-slate-500 text-xs hover:border-indigo-500/40 hover:text-slate-300 transition w-full group"
        >
          <span className="text-sm">🔍</span>
          <span className="flex-1">Search topics...</span>
          <span className="text-[10px] bg-[#242840] group-hover:bg-indigo-500/20 group-hover:text-indigo-400 px-1.5 py-0.5 rounded font-mono transition">
            ⌘K
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="section-label mb-2">{section.label}</div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`sidebar-item ${active ? 'active' : ''}`}
                  >
                    <span className="text-base w-5 text-center">{item.icon}</span>
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/60" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#1e2438] bg-[#0f1117]/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow">
            K
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-200 font-semibold truncate">Kaustuk</div>
            <div className="text-[10px] text-slate-500">Student · Engineer</div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-500/12 text-indigo-400 font-semibold border border-indigo-500/20 shrink-0">
            Study
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0f1117]/95 backdrop-blur-md border-b border-[#1e2438]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow shadow-indigo-500/30">
            📖
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-tight">EngKnowledge</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#1e2438] transition"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="17" y2="6" />
            <line x1="3" y1="10" x2="17" y2="10" />
            <line x1="3" y1="14" x2="17" y2="14" />
          </svg>
        </button>
      </div>

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-[#0f1117] border-r border-[#1e2438] flex flex-col transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-60 bg-[#0c1020] border-r border-[#1a2035] flex-col h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
