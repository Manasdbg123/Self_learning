'use client';
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

const SUGGESTIONS = [
  'Explain JVM Architecture',
  'Explain Kafka with a real example',
  'What is the difference between RAG and fine-tuning?',
  'Design a URL Shortener system',
  'Quiz me on SOLID principles',
  'What are the SOLID principles?',
  'Explain HashMap internals',
  'Compare Kafka vs RabbitMQ',
];

const DEMO_RESPONSES: Record<string, { content: string; sources: string[] }> = {
  default: {
    content: `I'm your AI Engineering Tutor, connected to your entire knowledge base covering Java, System Design, Backend Engineering, AI/ML, and more.

I can help you:
- **Explain concepts** at any depth level
- **Quiz you** on any topic
- **Compare technologies** (e.g., Kafka vs RabbitMQ)
- **Design systems** (LLD and HLD)
- **Prepare for interviews** with targeted questions

What would you like to learn today?`,
    sources: [],
  },
  kafka: {
    content: `## Apache Kafka — Core Explanation

**What is Kafka?**
Kafka is a distributed event streaming platform originally built at LinkedIn to handle 1+ trillion messages per day. Unlike traditional message queues (RabbitMQ, ActiveMQ) where messages are deleted after consumption, Kafka stores events in a persistent **commit log** — multiple consumers can independently read the same event multiple times.

**Core Concepts:**
- **Topic**: Named channel where events are written (like a database table for streams)
- **Partition**: Unit of parallelism within a topic. Events in one partition are totally ordered.
- **Producer**: Writes events to a topic
- **Consumer Group**: Multiple consumers sharing partitions for parallel processing
- **Offset**: Integer position of an event within a partition

**Why choose Kafka?**
1. Decouple services (producer doesn't know consumers)
2. Buffer traffic spikes
3. Replay events (new service can replay entire history)
4. Fan-out: one event → multiple independent consumers

**Real-world**: Netflix uses Kafka for streaming events, Uber for 1+ trillion messages/day.

Want me to explain **producer delivery semantics**, **consumer group rebalancing**, or **Kafka vs RabbitMQ** comparison?`,
    sources: ['Apache Kafka Documentation', 'Gaurav Sen - Kafka Architecture Video', 'Confluent: Kafka: The Definitive Guide'],
  },
  rag: {
    content: `## RAG vs Fine-Tuning — Detailed Comparison

Both techniques improve LLM performance for specific domains, but they work fundamentally differently:

**Fine-Tuning:**
- Bakes domain knowledge into model weights
- Requires retraining when knowledge changes (expensive: $$$)
- Cannot cite specific source documents
- Best for: style adaptation, format learning, behavior modification

**RAG (Retrieval-Augmented Generation):**
- Retrieves knowledge at inference time from a vector database
- Instantly updatable — just add new documents
- Provides source attribution for every claim
- Best for: factual knowledge, private data, up-to-date information

**Which to use?**
- Private company data → **RAG** (don't want to include in model weights)
- Latest news / real-time info → **RAG** (no knowledge cutoff)
- Style/tone adaptation → **Fine-tuning**
- Best production systems: **Both** — fine-tuned model + RAG for knowledge

**RAG Pipeline:**
1. Ingest documents → chunk → embed → store in vector DB
2. At query time: embed question → retrieve top-k chunks → assemble prompt → generate

This platform uses RAG to ground my answers in your knowledge base.`,
    sources: ['LangChain RAG Tutorial', 'Pinecone: What is RAG?', 'This platform\'s AI knowledge base'],
  },
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: DEMO_RESPONSES.default.content,
      sources: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    // Smart response matching
    const lowerText = text.toLowerCase();
    let response = DEMO_RESPONSES.default;
    if (lowerText.includes('kafka') || lowerText.includes('rabbitmq')) response = DEMO_RESPONSES.kafka;
    if (lowerText.includes('rag') || lowerText.includes('fine-tun')) response = DEMO_RESPONSES.rag;

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: response.content, sources: response.sources },
    ]);
    setLoading(false);
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold text-zinc-200 mt-4 mb-2">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold text-zinc-300 mt-3 mb-1">$1</h3>')
      .replace(/^- (.+)$/gm, '<li class="text-zinc-400 text-sm ml-4">• $1</li>')
      .replace(/\n\n/g, '<br/><br/>');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-zinc-100">AI Engineering Tutor</h1>
        <p className="text-zinc-500 text-sm">Ask anything about Java, System Design, Backend, AI/ML — grounded in your knowledge base</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shrink-0 mt-1">AI</div>
            )}
            <div className={`max-w-2xl rounded-2xl p-4 ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-sm'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-700/50">
                  <p className="text-xs text-zinc-500 mb-1.5 font-medium">📚 Sources</p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((s, j) => (
                      <span key={j} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">[{j + 1}] {s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shrink-0">AI</div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-sm px-5 py-4">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 pb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1.5 rounded-full hover:border-zinc-600 hover:text-zinc-200 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          placeholder="Ask anything about engineering... (Enter to send, Shift+Enter for new line)"
          rows={2}
          className="flex-1 bg-transparent px-3 py-2 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none resize-none"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="mb-1 mr-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}
