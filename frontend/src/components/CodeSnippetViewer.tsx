'use client';
import React, { useState } from 'react';

export default function CodeSnippetViewer({ code, language = 'java', title }: { code: string; language?: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)', background: '#090c14' }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* macOS dots */}
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => (
              <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8, display: 'inline-block' }} />
            ))}
          </div>
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {title || language.toUpperCase()}
          </span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 7, cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 11, color: copied ? '#34d399' : 'var(--text-secondary)', fontWeight: 600, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { if (!copied) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={e => { if (!copied) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
      {/* Code */}
      <div style={{ overflowX: 'auto', padding: '18px 20px' }}>
        <pre style={{ margin: 0, border: 'none', background: 'transparent', padding: 0, fontSize: 13, lineHeight: 1.7 }}>
          <code style={{ color: '#cdd6f4', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", background: 'transparent' }}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
