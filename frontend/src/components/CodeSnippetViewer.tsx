'use client';
import React, { useState } from 'react';

interface CodeSnippetViewerProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeSnippetViewer({ code, language = 'java', title }: CodeSnippetViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#0d0d10] my-4 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs font-mono text-zinc-400 font-medium ml-2">
            {title || language.toUpperCase()}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 font-medium transition"
        >
          {copied ? (
            <>
              <span className="text-emerald-400">✓</span>
              <span className="text-emerald-300">Copied!</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed text-zinc-300">
        <pre className="!border-0 !p-0 !bg-transparent !m-0">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
