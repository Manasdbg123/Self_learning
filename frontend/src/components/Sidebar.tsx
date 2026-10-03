'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  {
    label: 'Study',
    items: [
      { href: '/', label: 'Dashboard', icon: '🏠' },
      { href: '/search', label: 'Search', icon: '🔍' },
    ],
  },
  {
    label: 'Subjects',
    items: [
      { href: '/subjects/programming', label: 'Java & Programming', icon: '☕' },
      { href: '/subjects/system-design', label: 'System Design', icon: '🏗️' },
      { href: '/subjects/backend', label: 'Backend Engineering', icon: '⚙️' },
      { href: '/subjects/ai', label: 'AI / Machine Learning', icon: '🤖' },
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
      { href: '/chat', label: 'AI Tutor', icon: '💬' },
    ],
  },
];

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand */}
      <Link href="/" onClick={onClose} className="sidebar-logo">
        <div className="sidebar-logo-icon">📖</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.2 }}>EngKnowledge</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Engineering Study OS</div>
        </div>
        {onClose && (
          <button
            onClick={(e) => { e.preventDefault(); onClose(); }}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1,
              padding: '2px 6px', borderRadius: 6,
            }}
          >×</button>
        )}
      </Link>

      {/* Search */}
      <Link href="/search" onClick={onClose} className="sidebar-search">
        <span>🔍</span>
        <span style={{ flex: 1 }}>Search topics...</span>
        <span style={{
          fontSize: 10, background: 'var(--bg-muted)', padding: '2px 6px',
          borderRadius: 5, fontFamily: 'monospace', color: 'var(--text-muted)',
        }}>⌘K</span>
      </Link>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {NAV.map((section) => (
          <div key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map((item) => {
              const active = item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`sidebar-link ${active ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
          }}>K</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Kaustuk</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Student · Engineer</div>
          </div>
          <span style={{
            fontSize: 10, padding: '3px 8px', borderRadius: 99,
            background: 'rgba(99,102,241,0.12)', color: 'var(--accent-light)',
            border: '1px solid rgba(99,102,241,0.2)', fontWeight: 600, flexShrink: 0,
          }}>Study</span>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div className="sidebar-logo-icon" style={{ width: 28, height: 28, fontSize: 14, borderRadius: 8 }}>📖</div>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>EngKnowledge</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 8,
            color: 'var(--text-secondary)', cursor: 'pointer', padding: '5px 10px', fontSize: 18,
          }}
        >☰</button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-panel">
            <NavContent onClose={() => setOpen(false)} />
          </div>
          <div className="mobile-drawer-backdrop" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="layout-sidebar">
        <NavContent />
      </aside>
    </>
  );
}
