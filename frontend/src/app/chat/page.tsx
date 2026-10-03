'use client';
import React, { useState, useRef, useEffect } from 'react';
import { getAllTopics, topicsDb, Topic } from '@/lib/knowledge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

const SUGGESTIONS = [
  'Design Netflix streaming architecture',
  'Design Uber real-time ride dispatch',
  'Explain BookMyShow concurrency locking',
  'How does Consistent Hashing work?',
  'Explain Spring Security JWT filter chain',
  'How does Redis event loop handle 100k OPS?',
  'Explain Kafka consumer group rebalancing',
  'Compare 2PC vs Saga Pattern',
];

export default function ChatPage() {
  const allTopics = getAllTopics();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `I'm your AI Engineering Tutor, connected to your entire knowledge base covering Java, Distributed Systems, 15 complete HLD/LLD problems from Gaurav Sen's curriculum, and modern backend architectures.

I can help you:
- **Deconstruct system architectures** (Netflix, Uber, WhatsApp, YouTube, Food Delivery, BookMyShow)
- **Deep-dive into low-level code & patterns** (Elevator LOOK strategy, LRU Cache, TinyURL, Pub/Sub)
- **Explain distributed fundamentals** (Consistent Hashing, 2PC vs Saga, CAP Theorem, Rate Limiting)
- **Prepare for Staff/Senior interviews** with targeted Q&A and trade-offs

What would you like to explore today?`,
      sources: ['Comprehensive System Design Engineering Notebook'],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const findBestTopicMatch = (query: string): Topic | undefined => {
    const q = query.toLowerCase();
    
    // Direct keyword mappings
    if (q.includes('netflix') || q.includes('streaming')) return topicsDb['hld-netflix'];
    if (q.includes('uber') || q.includes('ride') || q.includes('h3') || q.includes('geospatial')) return topicsDb['hld-uber'];
    if (q.includes('food') || q.includes('doordash') || q.includes('swiggy') || q.includes('zomato')) return topicsDb['hld-food-delivery'];
    if (q.includes('whatsapp') || q.includes('telegram') || q.includes('chat') || q.includes('e2ee') || q.includes('signal')) return topicsDb['hld-whatsapp'];
    if (q.includes('twitter') || q.includes('fanout') || q.includes('timeline')) return topicsDb['hld-twitter'];
    if (q.includes('youtube') || q.includes('tiktok') || q.includes('transcoding') || q.includes('video')) return topicsDb['hld-youtube'];
    if (q.includes('crawler') || q.includes('search engine') || q.includes('simhash')) return topicsDb['hld-web-crawler'];
    if (q.includes('rate limit') || q.includes('token bucket') || q.includes('sliding window')) return topicsDb['hld-rate-limiter'];
    if (q.includes('url shortener') || q.includes('tinyurl') || q.includes('base62')) return topicsDb['lld-url-shortener'] || topicsDb['hld-url-shortener'];
    if (q.includes('lru') || q.includes('cache eviction')) return topicsDb['lld-lru-cache'];
    if (q.includes('elevator') || q.includes('scan') || q.includes('look algorithm')) return topicsDb['lld-elevator'];
    if (q.includes('parking') || q.includes('parking lot')) return topicsDb['lld-parking-lot'];
    if (q.includes('pubsub') || q.includes('pub/sub') || q.includes('observer')) return topicsDb['lld-pubsub'];
    if (q.includes('snake') || q.includes('ladder')) return topicsDb['lld-snake-ladder'];
    if (q.includes('bookmyshow') || q.includes('movie') || q.includes('ticket')) return topicsDb['lld-bookmyshow'];
    if (q.includes('consistent hash') || q.includes('vnode') || q.includes('ring')) return topicsDb['consistent-hashing'];
    if (q.includes('scaling') || q.includes('scale up') || q.includes('vertical')) return topicsDb['scaling-models'];
    if (q.includes('websocket') || q.includes('polling') || q.includes('sse') || q.includes('grpc')) return topicsDb['comm-protocols'];
    if (q.includes('load balanc') || q.includes('l4') || q.includes('l7') || q.includes('nginx')) return topicsDb['load-balancing'];
    if (q.includes('caching') || q.includes('cache-aside') || q.includes('write-through')) return topicsDb['caching-strategies'];
    if (q.includes('saga') || q.includes('2pc') || q.includes('two-phase commit') || q.includes('distributed trans')) return topicsDb['distributed-transactions'];
    if (q.includes('cap') || q.includes('pacelc')) return topicsDb['cap-pacelc'];
    if (q.includes('jwt') || q.includes('spring security') || q.includes('dispatcherservlet')) return topicsDb['spring-security-jwt'];
    if (q.includes('postgres') || q.includes('jsonb') || q.includes('mvcc')) return topicsDb['postgres-jsonb-mvcc'];
    if (q.includes('redis') || q.includes('redlock') || q.includes('event loop')) return topicsDb['redis-concurrency'];
    if (q.includes('agent') || q.includes('react') || q.includes('reflector') || q.includes('planner')) return topicsDb['agentic-llm'];
    if (q.includes('anpr') || q.includes('number plate') || q.includes('yolo') || q.includes('vision')) return topicsDb['computer-vision-anpr'];
    if (q.includes('kafka')) return topicsDb['kafka'];
    if (q.includes('rag')) return topicsDb['rag'];
    if (q.includes('jvm') || q.includes('classloader')) return topicsDb['jvm-architecture'];
    if (q.includes('garbage collection') || q.includes('gc')) return topicsDb['garbage-collection'];
    if (q.includes('hashmap')) return topicsDb['hashmap'];
    if (q.includes('solid')) return topicsDb['solid-principles'];

    // Fallback: search topics by title and tags
    return allTopics.find(t => 
      t.title.toLowerCase().includes(q) || 
      t.tags.some(tag => q.includes(tag.toLowerCase()))
    );
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const matchedTopic = findBestTopicMatch(text);

    let responseContent: string;
    let responseSources: string[];

    if (matchedTopic) {
      const sampleQuestion = matchedTopic.interviewQuestions?.[0];
      responseContent = `## ${matchedTopic.title}

### 📌 Overview & Core Mechanics
${matchedTopic.what}

### 💡 Why It Matters
${matchedTopic.why}

### ⚙️ How It Works & Architecture
${matchedTopic.how}

### ⚖️ Architectural Trade-offs
${matchedTopic.tradeoffs}
${sampleQuestion ? `\n\n### 🎯 Interview Focus:\n**Q: ${sampleQuestion.q}**\n*A: ${sampleQuestion.a}*` : ''}

You can explore the full interactive documentation and code under **[/topics/${matchedTopic.id}](/topics/${matchedTopic.id})**.`;
      responseSources = [matchedTopic.title, matchedTopic.subject, ...matchedTopic.tags.slice(0, 3)];
    } else {
      responseContent = `I searched your engineering knowledge base for "${text}". While I didn't find an exact matching topic module, here are topics you can explore directly:

- **High-Level Design**: Netflix, Uber, WhatsApp, Twitter, YouTube, Food Delivery, Distributed Rate Limiter
- **Low-Level Design**: Thread-Safe LRU Cache, Multi-Elevator Scheduler, BookMyShow Concurrency, TinyURL
- **Distributed Foundations**: Consistent Hashing, 2PC vs Saga, CAP Theorem, Polling vs WebSockets vs SSE
- **Backend & AI**: Spring Security JWT, Redis Event Loop, PostgreSQL JSONB, Agentic AI, ANPR Edge Vision

Try asking: *"How does Uber do geospatial matching?"* or *"Explain the Saga pattern"*.`;
      responseSources = ['Engineering Knowledge Base'];
    }

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: responseContent, sources: responseSources },
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
