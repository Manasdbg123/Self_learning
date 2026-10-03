import json
from data_hld import HLD_TOPICS
from data_lld import LLD_TOPICS
from data_foundations import FOUNDATIONS_TOPICS
from data_tech import TECH_TOPICS

all_new_topics = HLD_TOPICS + LLD_TOPICS + FOUNDATIONS_TOPICS + TECH_TOPICS

print(f"Total new topics to add: {len(all_new_topics)}")

# Read existing knowledge.ts
with open('frontend/src/lib/knowledge.ts', 'r', encoding='utf-8') as f:
    existing_content = f.read()

# Find where topicsDb ends: before '// SUBJECTS STRUCTURE'
split_pos = existing_content.find('// SUBJECTS STRUCTURE')
if split_pos == -1:
    split_pos = existing_content.find('export const subjects: Subject[] = [')

if split_pos == -1:
    raise ValueError("Could not find subjects split position in knowledge.ts")

# Find the last closing bracket of topicsDb before split_pos
db_end_pos = existing_content.rfind('};', 0, split_pos)
if db_end_pos == -1:
    raise ValueError("Could not find closing bracket of topicsDb")

existing_topics_prefix = existing_content[:db_end_pos].rstrip()

def format_topic_ts(t):
    id_str = t['id']
    lines = []
    lines.append(f"  // ===== {t['title'].upper()} =====")
    lines.append(f"  '{id_str}': {{")
    lines.append(f"    id: '{id_str}',")
    lines.append(f"    title: {json.dumps(t['title'])},")
    lines.append(f"    subject: {json.dumps(t['subject'])},")
    lines.append(f"    category: {json.dumps(t['category'])},")
    lines.append(f"    difficulty: {json.dumps(t['difficulty'])},")
    lines.append(f"    estimatedTime: {json.dumps(t['estimatedTime'])},")
    lines.append(f"    tags: {json.dumps(t['tags'])},")
    lines.append(f"    what: {json.dumps(t['what'])},")
    lines.append(f"    why: {json.dumps(t['why'])},")
    lines.append(f"    how: {json.dumps(t['how'])},")
    lines.append(f"    internals: {json.dumps(t['internals'])},")
    lines.append(f"    realWorld: {json.dumps(t['realWorld'])},")
    lines.append(f"    advantages: {json.dumps(t['advantages'])},")
    lines.append(f"    disadvantages: {json.dumps(t['disadvantages'])},")
    lines.append(f"    tradeoffs: {json.dumps(t['tradeoffs'])},")
    lines.append(f"    alternatives: {json.dumps(t['alternatives'])},")
    lines.append(f"    whenToUse: {json.dumps(t['whenToUse'])},")
    lines.append(f"    whenNotToUse: {json.dumps(t['whenNotToUse'])},")
    lines.append(f"    commonMistakes: {json.dumps(t['commonMistakes'])},")
    lines.append(f"    interviewQuestions: {json.dumps(t['interviewQuestions'])},")
    if "codeExample" in t and t["codeExample"]:
        lines.append(f"    codeExample: {json.dumps(t['codeExample'])},")
    if "architecture" in t and t["architecture"]:
        lines.append(f"    architecture: {json.dumps(t['architecture'])},")
    lines.append(f"    resources: {json.dumps(t['resources'])},")
    lines.append(f"    relatedTopics: {json.dumps(t['relatedTopics'])},")
    lines.append(f"  }},")
    return "\n".join(lines)

new_topics_code = "\n\n".join([format_topic_ts(t) for t in all_new_topics])

# New Subjects configuration
subjects_code = """
// =====================================================================
// SUBJECTS STRUCTURE
// =====================================================================

export const subjects: Subject[] = [
  {
    id: 'programming',
    name: 'Programming',
    description: 'Java, DSA, OOP, Design Patterns, and more',
    icon: '☕',
    color: 'from-orange-500 to-amber-600',
    categories: [
      { id: 'java', name: 'Java', topicIds: ['jvm-architecture', 'garbage-collection', 'hashmap'] },
      { id: 'oop', name: 'OOP & Principles', topicIds: ['solid-principles'] },
      { id: 'dsa', name: 'Data Structures & Algorithms', topicIds: [] },
    ],
  },
  {
    id: 'system-design',
    name: 'System Design',
    description: 'HLD, LLD, Scalability, Architecture Patterns',
    icon: '🏗️',
    color: 'from-blue-500 to-indigo-600',
    categories: [
      { 
        id: 'hld', 
        name: 'High Level Design (HLD)', 
        topicIds: [
          'hld-netflix', 
          'hld-uber', 
          'hld-food-delivery', 
          'hld-whatsapp', 
          'hld-twitter', 
          'hld-youtube', 
          'hld-web-crawler', 
          'hld-rate-limiter', 
          'hld-url-shortener'
        ] 
      },
      { 
        id: 'lld', 
        name: 'Low Level Design (LLD)', 
        topicIds: [
          'lld-url-shortener', 
          'lld-lru-cache', 
          'lld-elevator', 
          'lld-parking-lot', 
          'lld-pubsub', 
          'lld-snake-ladder', 
          'lld-bookmyshow'
        ] 
      },
      { 
        id: 'foundations', 
        name: 'Distributed Systems Foundations', 
        topicIds: [
          'consistent-hashing', 
          'scaling-models', 
          'comm-protocols', 
          'load-balancing', 
          'caching-strategies', 
          'distributed-transactions', 
          'cap-pacelc'
        ] 
      },
    ],
  },
  {
    id: 'backend',
    name: 'Backend Engineering',
    description: 'Spring Boot, Kafka, Redis, PostgreSQL, Distributed Systems',
    icon: '⚙️',
    color: 'from-green-500 to-emerald-600',
    categories: [
      { 
        id: 'frameworks', 
        name: 'Core Architecture & Internals', 
        topicIds: ['spring-security-jwt', 'postgres-jsonb-mvcc', 'redis-concurrency'] 
      },
      { 
        id: 'messaging', 
        name: 'Distributed Messaging & Streams', 
        topicIds: ['kafka'] 
      },
    ],
  },
  {
    id: 'ai',
    name: 'AI / ML',
    description: 'Machine Learning, Deep Learning, GenAI, RAG, Agents & Vision',
    icon: '🤖',
    color: 'from-purple-500 to-violet-600',
    categories: [
      { 
        id: 'genai', 
        name: 'Generative AI & Autonomous Agents', 
        topicIds: ['rag', 'agentic-llm'] 
      },
      { 
        id: 'vision', 
        name: 'Computer Vision & Edge AI', 
        topicIds: ['computer-vision-anpr'] 
      },
    ],
  },
  {
    id: 'interview',
    name: 'Interview Prep',
    description: 'Curated questions for Java, Backend, System Design, AI',
    icon: '🎯',
    color: 'from-rose-500 to-pink-600',
    categories: [],
  },
];

export function getTopicsBySubject(subjectId: string): Topic[] {
  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) return [];
  const topicIds = subject.categories.flatMap(c => c.topicIds);
  return topicIds.map(id => topicsDb[id]).filter(Boolean);
}

export function getAllTopics(): Topic[] {
  return Object.values(topicsDb);
}

export function searchTopics(query: string): Topic[] {
  const q = query.toLowerCase();
  return Object.values(topicsDb).filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q)) ||
    t.what.toLowerCase().includes(q) ||
    t.subject.toLowerCase().includes(q)
  );
}
"""

final_ts = existing_topics_prefix + "\n\n" + new_topics_code + "\n};\n" + subjects_code

with open('frontend/src/lib/knowledge.ts', 'w', encoding='utf-8') as f:
    f.write(final_ts)

print("Successfully generated updated frontend/src/lib/knowledge.ts!")
