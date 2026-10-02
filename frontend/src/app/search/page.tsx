'use client';
import React, { useState } from 'react';
import { getAllTopics } from '@/lib/knowledge';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const allTopics = getAllTopics();

  const results = query.length > 1
    ? allTopics.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        t.subject.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase()) ||
        t.what.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const diffBadge: Record<string, string> = {
    Beginner: 'badge-beginner',
    Intermediate: 'badge-intermediate',
    Advanced: 'badge-advanced',
    Expert: 'badge-expert',
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Search Knowledge Base</h1>
        <p className="text-zinc-500 text-sm">Search across all topics, LLD problems, HLD systems, and concepts</p>
      </div>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, concepts, patterns... (e.g. 'Kafka', 'Parking Lot', 'RAG')"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-11 pr-4 py-3.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition text-sm"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">✕</button>
        )}
      </div>

      {query.length > 1 && (
        <div className="space-y-3">
          <p className="text-zinc-500 text-sm">{results.length} result{results.length !== 1 ? 's' : ''} for "<span className="text-zinc-300">{query}</span>"</p>
          {results.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-zinc-300 font-medium">No results found</h3>
              <p className="text-zinc-600 text-sm mt-1">Try different keywords like "HashMap", "System Design", or "SOLID"</p>
            </div>
          ) : (
            results.map(topic => (
              <Link key={topic.id} href={`/topics/${topic.id}`} className="card p-5 flex gap-4 hover:border-zinc-600 transition group">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-zinc-100 group-hover:text-white transition">{topic.title}</h3>
                    <span className={`badge ${diffBadge[topic.difficulty]}`}>{topic.difficulty}</span>
                  </div>
                  <div className="text-zinc-500 text-xs mb-2">{topic.subject} › {topic.category}</div>
                  <p className="text-zinc-500 text-sm line-clamp-2">{topic.what.slice(0, 150)}...</p>
                </div>
                <div className="text-zinc-600 group-hover:text-zinc-400 transition text-xl shrink-0">→</div>
              </Link>
            ))
          )}
        </div>
      )}

      {query.length <= 1 && (
        <div>
          <h2 className="text-sm font-medium text-zinc-500 mb-3">Popular searches</h2>
          <div className="flex flex-wrap gap-2">
            {['JVM', 'HashMap', 'Kafka', 'RAG', 'URL Shortener', 'Parking Lot', 'SOLID', 'Garbage Collection', 'System Design'].map(term => (
              <button key={term} onClick={() => setQuery(term)} className="text-sm bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1.5 rounded-full hover:border-zinc-600 hover:text-zinc-200 transition">
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
