import React from 'react';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[80vh] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">AI</div>
          <div className="bg-zinc-800 p-4 rounded-xl max-w-2xl">
            <p className="text-zinc-200">Hello! I am your AI Engineering Tutor. I'm connected to your entire knowledge base.</p>
            <p className="text-zinc-200 mt-2">Try asking me to explain the JVM architecture, or quiz you on Load Balancing!</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-zinc-950 border-t border-zinc-800">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ask anything about System Design or Java..." 
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-indigo-500 transition"
          />
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
