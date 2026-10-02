import os
import json

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# --- 1. SPRING BOOT DOMAIN EXPANSION ---
topic_entity = """package com.aiep.knowledgeplatform.domain;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String subject;
    private String category;
    private String name;
    private String difficulty;
    
    @Column(columnDefinition = "TEXT")
    private String overview;
    @Column(columnDefinition = "TEXT")
    private String deepDive;
    @Column(columnDefinition = "TEXT")
    private String architecture;
    @Column(columnDefinition = "TEXT")
    private String codeExample;
    @Column(columnDefinition = "TEXT")
    private String interviewQuestions;
}
"""

# --- 2. MASSIVE INITIAL DATA SEED (data.sql) ---
# This seeds the database on Spring Boot startup with the required initial knowledge base
data_sql = """
-- Seed Subjects and Topics

INSERT INTO topic (subject, category, name, difficulty, overview, deepDive, architecture, codeExample, interviewQuestions) VALUES
('System Design', 'HLD', 'URL Shortener', 'Intermediate', 
'A URL shortener is a service that creates an alias (short URL) for a long URL. When users click the short URL, they are redirected to the original URL.', 
'Deep Dive: To handle 100M requests per day, we need to generate unique 7-character base62 hashes. We use a Token Generation Service (TGS) with ZooKeeper to pre-allocate ranges to app servers, preventing collisions without database locks.', 
'Architecture: Client -> Load Balancer -> Web Servers -> Cache (Redis) -> DB (PostgreSQL). TGS runs offline to generate unused hashes.', 
'-- No core code, architectural focus',
'Q: How to prevent duplicate long URLs? A: Use a unique index or bloom filter. Q: How to scale the DB? A: Hash-based sharding on the short URL.'),

('System Design', 'LLD', 'Parking Lot', 'Advanced',
'Design an object-oriented system for a parking lot that handles different vehicle types, parking spots, ticketing, and payments.',
'Deep Dive: The system must track available spots dynamically. We use the Strategy Pattern for pricing models (hourly vs flat) and Factory Pattern for issuing tickets.',
'Actors: Customer, Admin. Entities: ParkingLot, ParkingFloor, ParkingSpot, Vehicle, Ticket, Payment.',
'public class ParkingLot { private List<ParkingFloor> floors; public synchronized Ticket getTicket(Vehicle v) { ... } }',
'Q: How do you handle concurrency if two cars enter at the exact same time? A: Use thread-safe data structures or optimistic locking at the DB level for the spot assignment.'),

('Programming', 'Java', 'JVM Architecture', 'Advanced',
'The JVM (Java Virtual Machine) is an abstract computing machine that enables a computer to run a Java program.',
'Deep Dive: It consists of ClassLoader, Runtime Data Areas (Method Area, Heap, Stack, PC Register, Native Method Stack), and the Execution Engine (Interpreter, JIT Compiler, Garbage Collector).',
'Architecture Component Flow: .java -> javac -> .class -> ClassLoader -> Memory -> Execution Engine.',
'// JVM manages this internally, but understanding -Xmx and -Xms is key.',
'Q: Difference between Stack and Heap? A: Stack is thread-local and stores primitives/references. Heap is global and stores objects.');
"""

# --- 3. NEXT.JS TOPIC UI PAGE ---
# Creates the complex tabbed UI for learning topics requested by the user
topic_page_tsx = """import React from 'react';

export default async function TopicPage({ params }: { params: { id: string } }) {
  // In a real app, this fetches from http://localhost:8080/api/topics/${params.id}
  // Hardcoded fallback for UI demonstration of the requirements
  const topic = {
    title: "URL Shortener",
    subject: "System Design",
    difficulty: "Intermediate",
    time: "45 mins",
    overview: "A service that creates an alias for a long URL.",
    architecture: "Client -> Load Balancer -> API Gateway -> Redis -> PostgreSQL",
    deepDive: "Uses Base62 encoding. Pre-generates keys via ZooKeeper to avoid DB collisions at scale.",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
        <div>
          <p className="text-zinc-500 text-sm mb-2">{topic.subject} / HLD / {topic.title}</p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100">{topic.title}</h1>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">{topic.difficulty}</span>
            <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300">{topic.time} read</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition">Bookmark</button>
          <button className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition">Mark Completed</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-zinc-800 text-sm">
        <button className="py-2 border-b-2 border-indigo-500 text-indigo-400">Overview</button>
        <button className="py-2 text-zinc-400 hover:text-zinc-200">Deep Dive</button>
        <button className="py-2 text-zinc-400 hover:text-zinc-200">Architecture</button>
        <button className="py-2 text-zinc-400 hover:text-zinc-200">Interview</button>
        <button className="py-2 text-zinc-400 hover:text-zinc-200">AI Tutor</button>
      </div>

      {/* Content Area */}
      <div className="prose prose-invert max-w-none mt-8">
        <section className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-200">Overview</h2>
          <p className="text-zinc-400 leading-relaxed">{topic.overview}</p>
        </section>

        <section className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-200">Architecture & Data Flow</h2>
          <pre className="bg-black p-4 rounded-lg text-green-400">
            <code>{topic.architecture}</code>
          </pre>
        </section>

        <section className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-200">Deep Dive</h2>
          <p className="text-zinc-400 leading-relaxed">{topic.deepDive}</p>
        </section>
      </div>
    </div>
  );
}
"""

def generate():
    # Write expanded Spring Boot Domain & Seed Data
    write_file('backend/src/main/java/com/aiep/knowledgeplatform/domain/Topic.java', topic_entity)
    write_file('backend/src/main/resources/data.sql', data_sql)
    
    # Write updated Next.js Frontend UI
    write_file('frontend/src/app/topics/[id]/page.tsx', topic_page_tsx)
    
    print("Database Seed and Advanced UI injected successfully!")

if __name__ == '__main__':
    generate()
