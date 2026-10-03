// =====================================================================
// COMPLETE ENGINEERING KNOWLEDGE BASE
// All topics with detailed educational content
// =====================================================================

export interface Topic {
  id: string;
  title: string;
  subject: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedTime: string;
  tags: string[];
  what: string;
  why: string;
  how: string;
  internals: string;
  example?: string;
  realWorld: string;
  advantages: string[];
  disadvantages: string[];
  tradeoffs: string;
  alternatives: string[];
  whenToUse: string;
  whenNotToUse: string;
  commonMistakes: string[];
  interviewQuestions: { q: string; a: string }[];
  codeExample?: string;
  architecture?: string;
  resources: { title: string; url: string; type: 'video' | 'article' | 'docs' | 'book'; author?: string }[];
  relatedTopics: string[];
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  topicIds: string[];
}

// =====================================================================
// TOPICS DATABASE
// =====================================================================

export const topicsDb: Record<string, Topic> = {

  // ===== JVM ARCHITECTURE =====
  'jvm-architecture': {
    id: 'jvm-architecture',
    title: 'JVM Architecture',
    subject: 'Programming',
    category: 'Java',
    difficulty: 'Advanced',
    estimatedTime: '45 min',
    tags: ['Java', 'JVM', 'Memory', 'ClassLoader', 'GC'],
    what: `The Java Virtual Machine (JVM) is an abstract computing machine that provides the runtime environment for Java bytecode execution. It is the cornerstone of the "Write Once, Run Anywhere" principle. The JVM specification defines what a JVM must do, but not how to do it — allowing for multiple implementations (HotSpot, OpenJ9, GraalVM).

The JVM acts as a layer of abstraction between your Java code and the underlying operating system, handling memory management, security, and platform differences transparently.`,
    why: `Without the JVM, Java developers would need to write platform-specific code for Windows, Linux, macOS, etc. — the same problem C/C++ developers face. The JVM solves:

1. **Platform Independence**: Same .class files run on any OS with a JVM
2. **Memory Safety**: No direct memory access = no buffer overflows
3. **Automatic Memory Management**: Garbage collection eliminates manual malloc/free
4. **Security Sandboxing**: Code runs in a controlled environment
5. **Performance Optimization**: JIT compilation brings near-native performance`,
    how: `The JVM execution process:

1. **Source Code** (.java) → **javac compiler** → **Bytecode** (.class files)
2. **ClassLoader** loads .class files into memory
3. **Bytecode Verifier** checks for safety violations
4. **Interpreter** executes bytecode OR **JIT Compiler** compiles hot paths to native code
5. **Garbage Collector** reclaims unused heap memory

The JVM runs a continuous cycle: Load → Link → Initialize → Execute → GC`,
    internals: `## JVM Internal Components

### 1. ClassLoader Subsystem
Loads .class files using three loaders in delegation hierarchy:
- **Bootstrap ClassLoader**: Loads core Java classes (java.lang.*, rt.jar). Written in C++.
- **Extension ClassLoader**: Loads from $JAVA_HOME/lib/ext
- **Application ClassLoader**: Loads your application classes from classpath

### 2. Runtime Data Areas (Memory Regions)
- **Method Area (Metaspace in Java 8+)**: Stores class metadata, static variables, constant pool. Shared across threads.
- **Heap**: Where all objects live. Divided into Young Generation (Eden + S0 + S1) and Old Generation. Shared across threads.
- **JVM Stack**: Per-thread. Stores stack frames (local variables, operand stack, method return address)
- **PC Register**: Per-thread. Points to current instruction being executed
- **Native Method Stack**: Per-thread. For native (C/C++) method calls

### 3. Execution Engine
- **Interpreter**: Executes bytecode line by line. Fast startup, slow execution.
- **JIT (Just-In-Time) Compiler**: Identifies "hot" methods (called frequently) and compiles them to native machine code. Dramatically improves performance.
- **HotSpot JIT tiers**: C1 (client) for fast compilation, C2 (server) for heavily optimized code
- **Garbage Collector**: Reclaims heap memory. Multiple algorithms: Serial, Parallel, G1, ZGC, Shenandoah.

### 4. Garbage Collection Deep Dive
Young Generation GC (Minor GC):
- Objects start in **Eden**
- Surviving GC → **Survivor S0** or **S1**
- After N survivals → promoted to **Old Generation** (Tenuring threshold)

Old Generation GC (Major/Full GC):
- G1GC (default Java 9+): Divides heap into equal-sized regions, collects garbage-first regions
- ZGC (Java 15+): Sub-millisecond pauses, handles multi-terabyte heaps`,
    example: `## Practical Example: Memory Allocation Trace

\`\`\`java
public class JVMDemo {
    // Stored in Method Area (static)
    static int counter = 0;
    
    public static void main(String[] args) {
        // 'args' is stored in main's Stack Frame
        
        // Object created on Heap (Eden space)
        String message = new String("Hello JVM");
        
        // Primitive on Stack
        int x = 42;
        
        // method call creates new Stack Frame
        processMessage(message);
        
        // 'message' reference becomes unreachable here if no other refs
        // GC will eventually reclaim it
    }
    
    static void processMessage(String msg) {
        // New Stack Frame created for this method
        // 'msg' is a reference (pointer) on this frame
        // pointing to the same String object on Heap
        System.out.println(msg);
        // Frame destroyed when method returns
    }
}
\`\`\`

## JVM Tuning Flags
\`\`\`bash
# Set initial and max heap size
-Xms512m -Xmx4g

# Use G1 garbage collector
-XX:+UseG1GC

# Enable JIT compilation logs
-XX:+PrintCompilation

# Thread dump on OutOfMemoryError
-XX:+HeapDumpOnOutOfMemoryError
\`\`\``,
    realWorld: `**Netflix**: Tunes JVM heap sizes and GC settings per microservice based on memory profiles. Uses G1GC with 200ms pause time targets.

**Twitter**: Moved from JVM to native for some services to reduce latency, but uses JVM with ZGC for its core timeline services where predictable GC pauses matter.

**Elasticsearch**: Heavily depends on JVM (Lucene is pure Java). Uses specific GC settings to avoid full GC pauses that could affect search latency. Recommends CMS or G1GC.

**Kafka**: Runs on JVM. Kafka brokers are tuned with large heap sizes and G1GC to handle millions of messages/second.`,
    advantages: [
      'Platform independence — same bytecode runs on any OS',
      'Automatic memory management via garbage collection',
      'JIT compilation delivers near-native performance on hot paths',
      'Built-in security model and bytecode verification',
      'Excellent monitoring and profiling tooling (JConsole, VisualVM, async-profiler)',
      'Rich ecosystem of JVM languages (Kotlin, Scala, Clojure)',
    ],
    disadvantages: [
      'JVM startup time is significant (partially solved by GraalVM native image)',
      'Memory overhead: JVM itself consumes memory (100MB+)',
      'GC pause times can cause latency spikes (solved by ZGC/Shenandoah)',
      'Warm-up time before JIT reaches peak performance',
      'Difficult to use deterministic memory when needed',
    ],
    tradeoffs: `**Performance vs Memory**: JIT compilation delivers great throughput but at the cost of memory (compiled code cache). You can trade memory for performance.

**GC Pause vs Throughput**: Throughput collectors (Parallel GC) give maximum throughput but longer pauses. Low-latency collectors (ZGC) give minimal pauses but reduce overall throughput slightly.

**Startup Time vs Optimization**: JVM takes 1-5 seconds to start and another 30-60 seconds to fully JIT-optimize. For serverless/FaaS, this is problematic — use GraalVM native image for instant startup at the cost of peak throughput.`,
    alternatives: [
      '.NET CLR (similar concept, Microsoft ecosystem)',
      'GraalVM Native Image (AOT compilation, instant startup)',
      'Go runtime (no JVM, simpler GC model)',
      'WebAssembly (emerging universal runtime)',
    ],
    whenToUse: `Use JVM when building long-running server applications (APIs, batch processors, streaming systems) where JIT warm-up time is acceptable. Ideal for Spring Boot, Kafka, Spark, Elasticsearch.`,
    whenNotToUse: `Avoid JVM for serverless functions requiring instant cold-start (use GraalVM native image instead), extremely memory-constrained environments, or systems requiring deterministic real-time memory management (use C/Rust).`,
    commonMistakes: [
      'Setting -Xms too small causing heap resize overhead',
      'Using too-large heap causing long full-GC pauses',
      'Ignoring GC logs — always analyze with GCEasy or similar',
      'Creating too many short-lived large objects causing frequent GC',
      'String concatenation in loops — use StringBuilder instead',
      'Holding references in static fields preventing GC',
    ],
    interviewQuestions: [
      { q: 'What is the difference between JDK, JRE, and JVM?', a: 'JVM is the runtime engine. JRE = JVM + standard libraries needed to run Java programs. JDK = JRE + development tools (javac, javadoc, jar). To develop: need JDK. To just run: JRE is sufficient.' },
      { q: 'What happens when you write new Object() in Java?', a: 'JVM allocates memory on the heap (specifically in Eden space of Young Generation), runs the constructor to initialize the object, and returns a reference. If Eden is full, a Minor GC is triggered first.' },
      { q: 'Explain the difference between Stack and Heap memory', a: 'Stack is thread-local, automatically managed, stores primitives and object references, fixed size, very fast. Heap is shared, GC-managed, stores actual objects, flexible size, slower. Stack overflow = too deep recursion. OutOfMemoryError = heap full.' },
      { q: 'What is JIT compilation and why does it matter?', a: 'The JVM starts by interpreting bytecode (slow). It monitors which methods are called frequently (hot methods). Once a method is "hot," the JIT compiler compiles it directly to native machine code for that CPU. Subsequent calls run at near-native speed. This is why JVM apps get faster over time after startup.' },
      { q: 'What causes a java.lang.OutOfMemoryError?', a: 'Heap space full (too many objects / memory leak), Metaspace full (too many classes / classloader leak), direct buffer memory full (NIO), or GC overhead limit exceeded (spending >98% time in GC with <2% memory freed).' },
    ],
    codeExample: `// Demonstrating Stack vs Heap
public class MemoryDemo {
    public static void main(String[] args) {
        int x = 10;           // x is on Stack
        Integer y = 20;       // y reference on Stack, Integer object on Heap
        String s = "hello";   // s reference on Stack, String on Heap (String Pool)
        
        methodA();            // New Stack Frame created
    }
    
    static void methodA() {
        Object obj = new Object();  // obj ref on Stack, object on Heap
        // When method returns, Stack frame destroyed
        // obj becomes unreachable, eligible for GC
    }
}`,
    architecture: `Java Source (.java)
        ↓ [javac compiler]
Bytecode (.class files)
        ↓
   ClassLoader
   ├── Bootstrap CL
   ├── Extension CL  
   └── Application CL
        ↓
  Bytecode Verifier
        ↓
  Runtime Data Areas
  ├── Method Area (static vars, class metadata)
  ├── Heap (Young Gen: Eden/S0/S1 → Old Gen)
  ├── JVM Stack (per thread: stack frames)
  ├── PC Register (per thread)
  └── Native Method Stack
        ↓
  Execution Engine
  ├── Interpreter (slow, immediate)
  ├── JIT Compiler (fast, after warmup)
  └── Garbage Collector (G1/ZGC/Shenandoah)`,
    resources: [
      { title: 'JVM Internals - James Bloom', url: 'https://blog.jamesdbloom.com/JVMInternals.html', type: 'article' },
      { title: 'Understanding JVM - Gaurav Sen', url: 'https://www.youtube.com/watch?v=UnaNQgzw4zY', type: 'video', author: 'Gaurav Sen' },
      { title: 'Java SE Documentation - JVM Specification', url: 'https://docs.oracle.com/javase/specs/jvms/se21/html/', type: 'docs', author: 'Oracle' },
    ],
    relatedTopics: ['garbage-collection', 'java-memory-model', 'java-threads', 'virtual-threads'],
  },

  // ===== GARBAGE COLLECTION =====
  'garbage-collection': {
    id: 'garbage-collection',
    title: 'Garbage Collection',
    subject: 'Programming',
    category: 'Java',
    difficulty: 'Advanced',
    estimatedTime: '40 min',
    tags: ['Java', 'GC', 'Memory', 'G1GC', 'ZGC'],
    what: `Garbage Collection (GC) is the JVM's automatic memory management system. It identifies objects on the heap that are no longer reachable by the application and frees their memory, preventing memory leaks without requiring developers to manually call free() or delete.

The fundamental question GC answers: "Is this object still reachable from any live thread?" If not, it is garbage and its memory can be reclaimed.`,
    why: `Manual memory management (C/C++) is extremely error-prone:
- **Use-after-free bugs**: Accessing memory already freed → crashes or security vulnerabilities
- **Memory leaks**: Forgetting to free → application consumes ever-increasing memory
- **Double-free bugs**: Freeing same memory twice → heap corruption

GC eliminates entire categories of bugs. The performance cost (GC pauses) is an acceptable tradeoff for the safety and productivity gain.`,
    how: `## GC Algorithms

### Generational Hypothesis
Most objects die young. GC exploits this by dividing heap into generations:

### Minor GC (Young Generation)
1. New objects → **Eden** space
2. Eden fills → **Minor GC** triggered
3. Surviving objects copied to **Survivor (S0)**
4. Next Minor GC: Eden + S0 survivors → S1
5. Objects surviving multiple GCs → **promoted to Old Generation**

### Major/Full GC (Old Generation)
Triggered when Old Gen fills up. More expensive because larger space to scan.`,
    internals: `## GC Algorithms in Detail

### Serial GC (-XX:+UseSerialGC)
- Single-threaded: Stop-The-World for both minor and major GC
- Good for single-core, small heap applications

### Parallel GC (-XX:+UseParallelGC) 
- Multi-threaded GC: Uses all CPU cores
- High throughput but longer pauses
- Default in Java 8

### G1GC (-XX:+UseG1GC)
- Divides heap into ~2000 equal-sized **regions** (1-32MB each)
- Each region can play any role (Eden/Survivor/Old/Humongous)
- Collects **garbage-first** regions (highest garbage ratio)
- Predictable pause times (default target: 200ms)
- Default in Java 9+

### ZGC (-XX:+UseZGC)
- Concurrent: Almost all work done while app runs
- Sub-millisecond pauses regardless of heap size (handles TBs)
- Uses colored pointers and load barriers
- Available Java 11+, production-ready Java 15+

### Shenandoah (-XX:+UseShenandoahGC)
- Similar to ZGC: concurrent, low-pause
- Uses Brooks pointers (forwarding pointers)
- Available since Java 12 (RedHat contribution)`,
    example: `## Demonstrating GC Behavior

\`\`\`java
import java.lang.ref.*;

public class GCDemo {
    
    // 1. Strong Reference - NOT collected while reachable
    static Object strong = new Object();
    
    // 2. Soft Reference - collected when memory is low (good for caches)
    static SoftReference<byte[]> cache = 
        new SoftReference<>(new byte[1024 * 1024]);
    
    // 3. Weak Reference - collected on next GC cycle
    static WeakReference<Object> weak = 
        new WeakReference<>(new Object());
    
    // 4. Phantom Reference - for cleanup after collection
    static ReferenceQueue<Object> queue = new ReferenceQueue<>();
    
    public static void main(String[] args) {
        // Memory leak example - common mistake
        Map<Integer, byte[]> leak = new HashMap<>();
        for (int i = 0; i < 100000; i++) {
            leak.put(i, new byte[1024]); // Keys never removed!
        }
        // Fix: Use WeakHashMap for cache-like structures
    }
}
\`\`\`

## Monitoring GC
\`\`\`bash
# Enable GC logging (Java 9+)
-Xlog:gc*:gc.log:time,uptime,level,tags

# Useful GC flags
-XX:+PrintGCDetails
-XX:MaxGCPauseMillis=200   # G1GC pause target
-XX:G1HeapRegionSize=16m   # G1 region size
\`\`\``,
    realWorld: `**Elasticsearch**: Uses G1GC. Elasticsearch's docs specifically recommend heap sizes under 32GB to enable JVM's compressed ordinary object pointers (CompressedOops) optimization.

**Apache Kafka**: Uses G1GC with tuned settings. Kafka's broker config recommends specific GC settings to avoid large pause times that could cause consumer group rebalances.

**Spring Boot applications**: Most use G1GC (Java 9+ default). Production apps are tuned with -Xmx based on container memory limits.`,
    advantages: [
      'Eliminates entire classes of memory bugs (use-after-free, double-free, leaks)',
      'Developer productivity: no manual memory management',
      'Modern GCs (ZGC) have sub-millisecond pauses',
      'GC adapts to application behavior at runtime',
    ],
    disadvantages: [
      'GC pauses can cause latency spikes (especially Full GC)',
      'Memory overhead: JVM needs extra heap for GC bookkeeping',
      'Non-deterministic: you cannot predict exactly when GC runs',
      'Throughput slightly reduced vs manual memory management',
    ],
    tradeoffs: `**Throughput vs Latency**: Parallel GC maximizes throughput (batch jobs) at cost of longer pauses. ZGC minimizes latency at small throughput cost. Choose based on application SLAs.

**Heap Size vs GC Frequency**: Larger heap → less frequent GC → higher throughput. But larger Old Gen → longer Full GC if it happens. Sweet spot depends on object creation rate.`,
    alternatives: [
      'Manual memory management (C, C++, Rust) — deterministic but error-prone',
      'Reference counting (Swift, Python) — deterministic but cannot handle cycles',
      'Region-based memory (Rust ownership) — no GC, no overhead, compile-time safety',
    ],
    whenToUse: 'Always when using Java/Kotlin/Scala — GC is built into the JVM. Tune which algorithm based on SLA requirements.',
    whenNotToUse: 'Real-time hard-deadline systems (medical devices, aircraft controls) where even sub-ms pauses are unacceptable. Use RTSJ or native languages.',
    commonMistakes: [
      'Setting heap too large: massive heap with old GC algorithms causes very long Full GC pauses',
      'Ignoring GC logs: always analyze GC behavior in production',
      'Creating large temporary arrays in hot paths',
      'Static collections that grow unboundedly (classic memory leak)',
      'Not using try-with-resources for Closeable resources',
      'Finalize() method: makes objects survive one extra GC cycle unexpectedly',
    ],
    interviewQuestions: [
      { q: 'What is the difference between Minor GC and Full GC?', a: 'Minor GC collects only the Young Generation (Eden + Survivor spaces). It is triggered when Eden fills up. Full GC collects both Young and Old generations. Full GC is much more expensive because it scans the entire heap. Full GC is usually triggered when Old Gen fills up.' },
      { q: 'What is a memory leak in Java? How can GC not prevent it?', a: 'A memory leak in Java is when objects are still referenced but never used again. GC can only collect unreachable objects. If you keep a reference in a static Map and never remove it, GC cannot collect those objects even though you never use them. Common examples: event listeners not deregistered, ThreadLocal values not removed, static collections growing unboundedly.' },
      { q: 'When would you choose ZGC over G1GC?', a: 'ZGC when you need consistent sub-millisecond GC pauses — e.g., real-time APIs with p99 latency SLAs, trading systems, or when heap > 32GB where G1GC pauses become significant. G1GC for most general-purpose server applications where 200ms occasional pauses are acceptable.' },
    ],
    resources: [
      { title: 'Java GC Tuning Guide', url: 'https://docs.oracle.com/en/java/javase/21/gctuning/', type: 'docs', author: 'Oracle' },
      { title: 'Understanding Java GC - InfoQ', url: 'https://www.infoq.com/articles/Java_Garbage_Collection_Distilled/', type: 'article' },
    ],
    relatedTopics: ['jvm-architecture', 'java-memory-model', 'java-threads'],
  },

  // ===== HASHMAP =====
  'hashmap': {
    id: 'hashmap',
    title: 'HashMap',
    subject: 'Programming',
    category: 'Java',
    difficulty: 'Intermediate',
    estimatedTime: '35 min',
    tags: ['Java', 'Collections', 'Data Structures', 'Hashing'],
    what: `HashMap is Java's implementation of a hash table — a data structure that maps keys to values using a hash function. It provides O(1) average-case time complexity for get, put, and remove operations.

HashMap is part of Java Collections Framework and implements the Map<K,V> interface. It allows one null key and multiple null values. It is NOT thread-safe (use ConcurrentHashMap for thread-safety).`,
    why: `When you need fast key-based lookup, HashMap is the go-to solution. Without it, finding a value by key in an array or linked list would be O(n). HashMap achieves O(1) average case by using a hash function to directly compute where to store/find a value.

Real-world need: You have 10 million user objects and need to find a user by their ID in microseconds. Array binary search is O(log n). HashMap is O(1).`,
    how: `## Internal Working

1. **Hash Function**: key.hashCode() is called, then a secondary hash function is applied to better distribute bits: \`hash = h ^ (h >>> 16)\`

2. **Bucket Index**: \`index = hash & (capacity - 1)\` (equivalent to hash % capacity, but faster)

3. **Storage**: The (key, value) pair is stored as a Node in an array of Node[] (the bucket array)

4. **Collision Handling**:
   - Java 7: Chaining with LinkedList
   - Java 8+: Chaining with LinkedList, but converts to **Red-Black Tree when bucket size > 8** (TREEIFY_THRESHOLD)

5. **Resize/Rehash**: When load factor (size/capacity) exceeds 0.75, capacity doubles and all entries are rehashed`,
    internals: `## Source-Level Internals

\`\`\`java
// Simplified HashMap internal structure
public class HashMap<K,V> {
    // Default initial capacity - MUST be power of 2
    static final int DEFAULT_INITIAL_CAPACITY = 16;
    
    // Default load factor
    static final float DEFAULT_LOAD_FACTOR = 0.75f;
    
    // Tree threshold - when to convert linked list to Red-Black tree
    static final int TREEIFY_THRESHOLD = 8;
    
    // Array of buckets
    Node<K,V>[] table;
    
    // Current number of key-value pairs
    int size;
    
    // Modification count for fail-fast iterators
    int modCount;
    
    // Threshold to trigger resize (capacity * loadFactor)
    int threshold;
    
    static class Node<K,V> {
        final int hash;
        final K key;
        V value;
        Node<K,V> next;  // Linked list for collision chaining
    }
    
    static class TreeNode<K,V> extends Node<K,V> {
        // Red-Black tree node, used when bucket has > 8 entries
        TreeNode<K,V> parent, left, right, prev;
        boolean red;
    }
}
\`\`\`

## Why Load Factor = 0.75?
This is a mathematical sweet spot from the Poisson distribution analysis. At 0.75 load factor, probability of collision per bucket follows a Poisson distribution with λ=0.5, giving very low collision probability. Lower LF = less collision, more memory. Higher LF = more collision, less memory. 0.75 balances both.

## Why Capacity must be Power of 2?
\`index = hash & (n-1)\` only works perfectly when n is a power of 2. When n=16, n-1=15=0b1111, so & operation is equivalent to mod but much faster.`,
    example: `## Complete Usage Example

\`\`\`java
import java.util.*;

public class HashMapDemo {
    public static void main(String[] args) {
        // Creating with custom initial capacity and load factor
        Map<String, Integer> wordCount = new HashMap<>(32, 0.75f);
        
        String[] words = {"apple", "banana", "apple", "cherry", "banana", "apple"};
        
        // Counting word frequencies
        for (String word : words) {
            // getOrDefault is cleaner than containsKey check
            wordCount.put(word, wordCount.getOrDefault(word, 0) + 1);
            
            // Java 8 alternative:
            // wordCount.merge(word, 1, Integer::sum);
        }
        
        // Iterating entrySet (most efficient)
        for (Map.Entry<String, Integer> entry : wordCount.entrySet()) {
            System.out.printf("%s: %d%n", entry.getKey(), entry.getValue());
        }
        
        // Java 8+ computeIfAbsent — useful for grouping
        Map<Integer, List<String>> byLength = new HashMap<>();
        for (String word : words) {
            byLength.computeIfAbsent(word.length(), k -> new ArrayList<>()).add(word);
        }
        
        // putIfAbsent — idempotent writes
        wordCount.putIfAbsent("date", 1);
        
        // ConcurrentHashMap for thread-safe operations
        Map<String, Integer> concurrent = new java.util.concurrent.ConcurrentHashMap<>(wordCount);
    }
}
\`\`\``,
    realWorld: `**Spring Framework**: Uses HashMap extensively for bean registry, request mapping, configuration properties.

**Java EE / Jakarta EE**: Session management, HTTP request parameter maps.

**Database Connection Pools**: HikariCP uses HashMap to track connections.

**Caching layers**: Local caches before Redis calls often use ConcurrentHashMap.`,
    advantages: [
      'O(1) average time for get, put, remove',
      'Flexible key types (any object implementing hashCode/equals)',
      'Allows null key and null values',
      'Java 8+ tree-ification prevents worst-case O(n) from hash collisions',
    ],
    disadvantages: [
      'Not thread-safe — use ConcurrentHashMap for concurrent access',
      'No ordering guaranteed — use LinkedHashMap (insertion order) or TreeMap (sorted)',
      'Hash collisions can degrade to O(n) with bad hashCode implementations',
      'Memory overhead: each entry has key, value, hash, next pointer',
    ],
    tradeoffs: `HashMap vs LinkedHashMap: LinkedHashMap maintains insertion order at cost of prev/next pointers (extra memory). Use HashMap when order doesn't matter.

HashMap vs TreeMap: TreeMap maintains sorted order at O(log n) cost. Use when you need sorted keys or range queries.

HashMap vs ConcurrentHashMap: ConcurrentHashMap is thread-safe using segment locking, slight performance overhead. Never use HashMap in multi-threaded code.`,
    alternatives: ['LinkedHashMap — ordered', 'TreeMap — sorted', 'ConcurrentHashMap — thread-safe', 'EnumMap — when keys are enum', 'IdentityHashMap — identity-based equality'],
    whenToUse: 'When you need fast key-value lookup with no ordering requirement and single-threaded access.',
    whenNotToUse: 'When you need sorted order (use TreeMap), ordered iteration (LinkedHashMap), thread safety (ConcurrentHashMap), or null-hostile map (use TreeMap).',
    commonMistakes: [
      'Using HashMap in multi-threaded code without synchronization',
      'Mutable objects as keys — changing a key after insertion breaks lookup',
      'Poor hashCode implementation causing all objects to hash to same bucket (O(n))',
      'Not specifying initial capacity when size is known — causes unnecessary rehashing',
      'Using == instead of .equals() for key comparison',
    ],
    interviewQuestions: [
      { q: 'What happens when two keys have the same hashCode in a HashMap?', a: 'This is a collision. Both entries are stored in the same bucket. In Java 8+, if the bucket has ≤8 entries it uses a linked list. If >8 entries, it converts to a Red-Black tree (O(log n) for operations). When getting, it traverses the bucket and compares keys using .equals() to find the right entry.' },
      { q: 'Why is the default load factor 0.75 in HashMap?', a: 'It is a mathematical trade-off between time and space cost. At 0.75 load factor, statistical analysis (Poisson distribution) shows average bucket size stays near 1, keeping get/put at O(1). Lower load factor wastes memory; higher load factor increases collision probability.' },
      { q: 'Can you use a mutable object as a HashMap key? What goes wrong?', a: 'Technically yes, but it breaks the Map contract. When you put(key, value), the hash is computed from the key\'s current state. If you mutate the key afterward, its hashCode changes, so the map cannot find it anymore — the entry becomes "orphaned." Always use immutable objects (String, Integer, UUID) as HashMap keys.' },
    ],
    resources: [
      { title: 'Java HashMap Source Code Analysis', url: 'https://openjdk.org/jeps/0', type: 'docs' },
    ],
    relatedTopics: ['hashset', 'concurrenthashmap', 'treemap', 'linkedhashmap'],
  },

  // ===== URL SHORTENER HLD =====
  'hld-url-shortener': {
    id: 'hld-url-shortener',
    title: 'URL Shortener System Design',
    subject: 'System Design',
    category: 'HLD',
    difficulty: 'Intermediate',
    estimatedTime: '60 min',
    tags: ['HLD', 'System Design', 'Database', 'Scalability', 'Caching'],
    what: `A URL shortener converts long URLs into short aliases (e.g., https://bit.ly/3xK9mP → https://very-long-url.com/...). When a user visits the short URL, the service redirects them to the original URL.

Famous examples: bit.ly, TinyURL, t.co (Twitter), goo.gl (deprecated). This is one of the most common system design interview questions because it covers a wide range of fundamental concepts.`,
    why: `**Problem this solves:**
- URLs in tweets/messages have character limits
- Long URLs are hard to remember and type
- Need analytics: track click counts, geographic distribution, referrers
- Branded short links for marketing campaigns

**Scale requirements**: A production URL shortener like bit.ly handles:
- 100M+ URLs created per day
- 10B+ redirect requests per day
- Sub-50ms redirect latency (user experience critical)`,
    how: `## Core Flow

**Write Path (Shorten URL):**
1. Receive long URL via POST /api/shorten
2. Generate unique 7-char key (e.g., "ab3x9Kp")
3. Store mapping: shortKey → longURL in database
4. Return short URL: https://short.ly/ab3x9Kp

**Read Path (Redirect):**
1. Receive GET /ab3x9Kp
2. Look up short key in cache (Redis)
3. Cache miss → look up in database
4. Return HTTP 301 (permanent) or 302 (temporary) redirect

**Key Generation Strategies:**
- **MD5/SHA256 hash**: Hash(longURL), take first 7 chars. Problem: collisions
- **Base62 encoding**: Auto-increment ID → Base62. 7 chars = 62^7 ≈ 3.5 trillion URLs
- **Pre-generated keys (TGS)**: Token Generation Service pre-creates keys offline`,
    internals: `## Detailed Architecture

### Key Generation Service (KGS)
Pre-generates millions of unique 7-character keys and stores them in a "keys_available" table. When a new URL needs shortening, KGS picks an available key and marks it used. 

Benefits:
- No collision checking needed at request time
- Keys generated offline asynchronously
- Multiple app servers can each pick keys without coordination
- Use ZooKeeper to assign key ranges to app servers

### Database Design
\`\`\`sql
-- Main URL mapping table
CREATE TABLE url_mappings (
    short_key    CHAR(7) PRIMARY KEY,
    long_url     TEXT NOT NULL,
    user_id      BIGINT,
    created_at   TIMESTAMP DEFAULT NOW(),
    expires_at   TIMESTAMP,           -- optional expiration
    click_count  BIGINT DEFAULT 0,
    is_active    BOOLEAN DEFAULT TRUE
);

-- Analytics table (separate, for scale)
CREATE TABLE click_events (
    id          BIGSERIAL,
    short_key   CHAR(7),
    clicked_at  TIMESTAMP,
    country     VARCHAR(2),
    referrer    TEXT,
    user_agent  TEXT
) PARTITION BY RANGE (clicked_at);  -- Partition by date for easy archival
\`\`\`

### Caching Layer (Redis)
Most accessed URLs follow Pareto principle (80% reads from 20% URLs). Cache top 20% with TTL:
\`\`\`
SET url:ab3x9Kp "https://long-original-url.com/..." EX 3600
\`\`\`

Cache-aside pattern: Try Redis first, on miss query DB and populate cache.`,
    example: `## Capacity Estimation

**Assumptions:**
- 100M new URLs/day
- 10:1 read/write ratio → 1B redirects/day
- Average long URL size: 100 bytes
- Metadata per URL: 500 bytes
- Keep data for 5 years

**Traffic:**
- Write QPS: 100M / 86400 ≈ 1160 writes/sec (peak 2x = 2320/s)
- Read QPS: 1B / 86400 ≈ 11600 reads/sec (peak 2x = 23200/s)

**Storage:**
- Per URL: 500 bytes
- Daily: 100M × 500B = 50 GB/day  
- 5 years: 50GB × 365 × 5 ≈ 90 TB

**Bandwidth:**
- Writes: 1160 × 500B = 580 KB/s
- Reads: 11600 × 500B = 5.8 MB/s (URL data, not content)

**Cache:**
- 20% of daily active URLs: 100M × 0.2 × 500B = 10 GB → fits easily in Redis`,
    realWorld: `**Bitly**: Uses a custom data store optimized for URL lookups. Caches aggressively with multiple Redis clusters. Handles 10B+ redirects/month.

**Twitter (t.co)**: All URLs in tweets are wrapped with t.co links for analytics tracking, click counting, and malware scanning before redirect.

**LinkedIn**: Uses URL shortener internally for tracking which links in their emails are clicked, allowing A/B testing of email campaigns.`,
    advantages: [
      'Short, shareable links that fit in SMS, tweets, emails',
      'Analytics: track clicks, geography, referrers',
      'Centralized control: disable links, add expiration',
      'Branded links improve trust and click-through rates',
    ],
    disadvantages: [
      'Single point of failure: if shortener is down, all shortened links break',
      'Privacy concerns: shortener can track all user clicks',
      'Link rot: if shortener company dies, all links break',
      'Phishing vector: users cannot see destination before clicking',
    ],
    tradeoffs: `**301 vs 302 Redirect:**
- 301 (Permanent): Browser caches it. Future clicks go directly to destination, bypassing your server. Saves bandwidth but you lose analytics for cached redirects.
- 302 (Temporary): Browser always hits your server. You capture every click for analytics. Slightly slower.
- **Decision**: Use 301 for public links (performance), 302 for analytics-critical links.

**Custom keys vs Auto-generated:**
- Custom (/my-campaign) is memorable but creates hot-spots in consistent hashing
- Auto-generated (random 7 chars) distributes evenly

**SQL vs NoSQL for URL storage:**
- SQL (PostgreSQL): ACID, easy for analytics queries, good for <1B URLs
- NoSQL (DynamoDB/Cassandra): Better for >1B URLs, distributed by default, no complex queries needed`,
    alternatives: [
      'QR codes for physical media',
      'Custom domain redirects (your own nginx redirect rules)',
      'Direct long URLs with analytics via UTM parameters',
    ],
    whenToUse: 'When you need link tracking analytics, need short links for character-limited platforms (Twitter), or need centralized link management.',
    whenNotToUse: 'When every millisecond of redirect latency matters, when you cannot have single point of failure, or when you need guaranteed long-term link permanence.',
    commonMistakes: [
      'Not handling hash collisions in the key generation',
      'No rate limiting on URL creation API (spam/abuse)',
      'Storing click events synchronously (should be async via Kafka)',
      'Not adding expiration support (storage grows forever)',
      'Single database without read replicas (read bottleneck at scale)',
    ],
    architecture: `Client
   ↓ POST /api/shorten
Load Balancer
   ↓
API Servers (stateless, horizontally scaled)
   ├── Check: is longURL already shortened? (bloom filter)
   ├── Get key from KGS (Key Generation Service)
   ├── Write: shortKey → longURL to DB
   └── Return short URL

Client
   ↓ GET /abc123
Load Balancer
   ↓
API Servers
   ├── Check Redis cache
   │   ├── HIT → return 302 redirect
   │   └── MISS → query DB → populate cache → redirect
   ↓
  Redis (cache, 10GB)
  PostgreSQL (primary, sharded by shortKey)
  PostgreSQL (read replicas × 3)
  Kafka (async analytics events)
  Analytics DB (ClickHouse)
  CDN (for redirect caching at edge)`,
    interviewQuestions: [
      { q: 'How would you prevent two users from getting the same short URL when multiple servers generate keys simultaneously?', a: 'Option 1: Central KGS (Key Generation Service) pre-generates keys and assigns ranges to servers using ZooKeeper distributed coordination — each server works from its own range, no coordination per request. Option 2: Use database auto-increment ID converted to Base62 — DB ensures uniqueness. Option 3: Use UUID + truncate — low probability collision, check-and-retry if collision.' },
      { q: 'How would you scale the URL shortener to handle 1M redirects per second?', a: '1) CDN at the edge for the most popular URLs (served from 100+ edge locations). 2) Redis cluster for in-memory cache of hot URLs. 3) Read replicas for database reads. 4) Horizontally scale stateless API servers behind load balancer. 5) Consistent hashing for DB sharding if data too large. At 1M RPS, CDN handles 90%+, Redis handles 9%, DB handles <1%.' },
      { q: 'What HTTP redirect code would you use and why?', a: '302 (Found/Temporary) for most cases where you need analytics — browser sends every redirect to your server so you can count clicks. 301 (Moved Permanently) is cached by browsers, so you lose click tracking after first visit. Trade-off: 302 = full analytics, more server load. 301 = less server load, less analytics.' },
    ],
    resources: [
      { title: 'Designing a URL Shortening service like TinyURL - Alex Xu', url: 'https://systemdesign.one/url-shortening-system-design/', type: 'article' },
      { title: 'URL Shortener System Design - Gaurav Sen', url: 'https://www.youtube.com/watch?v=JQDHz72OA3c', type: 'video', author: 'Gaurav Sen' },
      { title: 'System Design Interview Vol 1 - Chapter on URL Shortener', url: 'https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF', type: 'book', author: 'Alex Xu' },
    ],
    relatedTopics: ['hld-rate-limiter', 'hld-notification-system', 'caching', 'consistent-hashing'],
  },

  // ===== PARKING LOT LLD =====
  'lld-parking-lot': {
    id: 'lld-parking-lot',
    title: 'Parking Lot - Low Level Design',
    subject: 'System Design',
    category: 'LLD',
    difficulty: 'Intermediate',
    estimatedTime: '75 min',
    tags: ['LLD', 'OOP', 'Design Patterns', 'Java', 'Concurrency'],
    what: `Design a parking lot system that manages vehicle entry, exit, spot assignment, ticketing, and payment. This is one of the most common LLD interview questions.

**The system must handle:**
- Multiple vehicle types (motorcycle, car, truck)
- Multiple floor/level support
- Different spot sizes (compact, medium, large)
- Ticket generation on entry
- Fee calculation on exit
- Multiple payment methods
- Real-time spot availability tracking`,
    why: `This problem tests your ability to:
1. Identify entities and their relationships
2. Apply OOP principles correctly
3. Use appropriate design patterns
4. Handle concurrency (two cars entering simultaneously)
5. Design for extensibility (new vehicle types, payment methods)
6. Think about production concerns (persistence, monitoring)`,
    how: `## Design Process

### Step 1: Identify Actors
- Customer (driver)
- Admin (manages the lot)
- System (automated processes)

### Step 2: Identify Use Cases
- Customer: enter lot, get ticket, park, pay, exit
- Admin: view capacity, add/remove spots, view revenue

### Step 3: Identify Entities
- ParkingLot, ParkingFloor, ParkingSpot, Vehicle, Ticket, Payment, DisplayBoard

### Step 4: Define Relationships
- ParkingLot HAS-MANY ParkingFloor
- ParkingFloor HAS-MANY ParkingSpot
- ParkingSpot IS-OCCUPIED-BY Vehicle
- Ticket ASSOCIATED-WITH ParkingSpot + Vehicle`,
    internals: `## SOLID Analysis

**Single Responsibility**: 
- ParkingSpot knows only about itself and whether it's occupied
- ParkingAttendant handles entry/exit logic
- PaymentProcessor handles payment
- FeeCalculator handles pricing logic

**Open/Closed**:
- Add new VehicleType without modifying existing Vehicle class
- Add new PaymentMethod without modifying PaymentProcessor
- Add new PricingStrategy without modifying FeeCalculator

**Liskov Substitution**:
- Motorcycle, Car, Truck all substitute Vehicle anywhere Vehicle is expected

**Interface Segregation**:
- IDisplayable, IPayable, ISearchable — not one fat interface

**Dependency Inversion**:
- ParkingLot depends on IPricingStrategy, not HourlyPricingStrategy concretely

## Design Patterns Used
- **Strategy Pattern**: Pricing strategy (hourly, flat rate, weekend rate)
- **Factory Pattern**: VehicleFactory.createVehicle(type, licencePlate)
- **Singleton Pattern**: ParkingLot (only one instance)
- **Observer Pattern**: DisplayBoard observes spot availability changes`,
    codeExample: `package com.lld.parkinglot;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

// ========== ENUMS ==========
enum VehicleType { MOTORCYCLE, CAR, TRUCK }
enum SpotSize { SMALL, MEDIUM, LARGE }
enum PaymentStatus { PENDING, COMPLETED, FAILED }
enum SpotStatus { AVAILABLE, OCCUPIED }

// ========== VEHICLE HIERARCHY ==========
abstract class Vehicle {
    protected String licensePlate;
    protected VehicleType vehicleType;
    protected SpotSize requiredSpotSize;
    
    Vehicle(String licensePlate, VehicleType vehicleType, SpotSize requiredSpotSize) {
        this.licensePlate = licensePlate;
        this.vehicleType = vehicleType;
        this.requiredSpotSize = requiredSpotSize;
    }
    
    String getLicensePlate() { return licensePlate; }
    VehicleType getVehicleType() { return vehicleType; }
    SpotSize getRequiredSpotSize() { return requiredSpotSize; }
}

class Motorcycle extends Vehicle {
    Motorcycle(String plate) { super(plate, VehicleType.MOTORCYCLE, SpotSize.SMALL); }
}

class Car extends Vehicle {
    Car(String plate) { super(plate, VehicleType.CAR, SpotSize.MEDIUM); }
}

class Truck extends Vehicle {
    Truck(String plate) { super(plate, VehicleType.TRUCK, SpotSize.LARGE); }
}

// ========== PRICING STRATEGY ==========
interface PricingStrategy {
    double calculateFee(LocalDateTime entryTime, LocalDateTime exitTime);
}

class HourlyPricingStrategy implements PricingStrategy {
    private final Map<SpotSize, Double> ratesPerHour;
    
    HourlyPricingStrategy() {
        ratesPerHour = new EnumMap<>(SpotSize.class);
        ratesPerHour.put(SpotSize.SMALL, 1.0);
        ratesPerHour.put(SpotSize.MEDIUM, 2.0);
        ratesPerHour.put(SpotSize.LARGE, 4.0);
    }
    
    @Override
    public double calculateFee(LocalDateTime entryTime, LocalDateTime exitTime) {
        long minutes = java.time.Duration.between(entryTime, exitTime).toMinutes();
        double hours = Math.ceil(minutes / 60.0);
        return hours * ratesPerHour.getOrDefault(SpotSize.MEDIUM, 2.0);
    }
}

// ========== PARKING SPOT ==========
class ParkingSpot {
    private final String spotId;
    private final SpotSize size;
    private volatile Vehicle parkedVehicle;  // volatile for visibility
    private volatile SpotStatus status;
    private final Object lock = new Object();  // for thread-safe parking
    
    ParkingSpot(String spotId, SpotSize size) {
        this.spotId = spotId;
        this.size = size;
        this.status = SpotStatus.AVAILABLE;
    }
    
    // Thread-safe parking operation
    synchronized boolean park(Vehicle vehicle) {
        if (status != SpotStatus.AVAILABLE) return false;
        if (!canFit(vehicle)) return false;
        this.parkedVehicle = vehicle;
        this.status = SpotStatus.OCCUPIED;
        return true;
    }
    
    synchronized Vehicle removeVehicle() {
        Vehicle v = parkedVehicle;
        parkedVehicle = null;
        status = SpotStatus.AVAILABLE;
        return v;
    }
    
    boolean canFit(Vehicle vehicle) {
        return switch (vehicle.getRequiredSpotSize()) {
            case SMALL -> true;  // Small fits in any spot
            case MEDIUM -> size == SpotSize.MEDIUM || size == SpotSize.LARGE;
            case LARGE -> size == SpotSize.LARGE;
        };
    }
    
    boolean isAvailable() { return status == SpotStatus.AVAILABLE; }
    String getSpotId() { return spotId; }
    SpotSize getSize() { return size; }
}

// ========== TICKET ==========
class Ticket {
    private static final AtomicLong counter = new AtomicLong(1);
    private final String ticketId;
    private final Vehicle vehicle;
    private final ParkingSpot spot;
    private final LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private PaymentStatus paymentStatus;
    
    Ticket(Vehicle vehicle, ParkingSpot spot) {
        this.ticketId = "TKT-" + counter.getAndIncrement();
        this.vehicle = vehicle;
        this.spot = spot;
        this.entryTime = LocalDateTime.now();
        this.paymentStatus = PaymentStatus.PENDING;
    }
    
    double processPayment(PricingStrategy strategy) {
        exitTime = LocalDateTime.now();
        double fee = strategy.calculateFee(entryTime, exitTime);
        this.paymentStatus = PaymentStatus.COMPLETED;
        return fee;
    }
    
    String getTicketId() { return ticketId; }
    ParkingSpot getSpot() { return spot; }
}

// ========== PARKING FLOOR ==========
class ParkingFloor {
    private final int floorNumber;
    private final List<ParkingSpot> spots;
    
    ParkingFloor(int floorNumber, int small, int medium, int large) {
        this.floorNumber = floorNumber;
        spots = new ArrayList<>();
        for (int i = 0; i < small; i++)
            spots.add(new ParkingSpot("F" + floorNumber + "-S" + i, SpotSize.SMALL));
        for (int i = 0; i < medium; i++)
            spots.add(new ParkingSpot("F" + floorNumber + "-M" + i, SpotSize.MEDIUM));
        for (int i = 0; i < large; i++)
            spots.add(new ParkingSpot("F" + floorNumber + "-L" + i, SpotSize.LARGE));
    }
    
    Optional<ParkingSpot> findAvailableSpot(Vehicle vehicle) {
        return spots.stream()
            .filter(s -> s.isAvailable() && s.canFit(vehicle))
            .findFirst();
    }
    
    long getAvailableCount() {
        return spots.stream().filter(ParkingSpot::isAvailable).count();
    }
}

// ========== PARKING LOT (Singleton) ==========
public class ParkingLot {
    private static volatile ParkingLot instance;
    private final String name;
    private final List<ParkingFloor> floors;
    private final Map<String, Ticket> activeTickets;  // licensePlate → Ticket
    private final PricingStrategy pricingStrategy;
    
    private ParkingLot(String name) {
        this.name = name;
        this.floors = new ArrayList<>();
        this.activeTickets = new ConcurrentHashMap<>();
        this.pricingStrategy = new HourlyPricingStrategy();
        // Initialize floors
        floors.add(new ParkingFloor(1, 30, 40, 10));
        floors.add(new ParkingFloor(2, 30, 40, 10));
    }
    
    // Double-checked locking Singleton
    public static ParkingLot getInstance(String name) {
        if (instance == null) {
            synchronized (ParkingLot.class) {
                if (instance == null) {
                    instance = new ParkingLot(name);
                }
            }
        }
        return instance;
    }
    
    public synchronized Ticket processEntry(Vehicle vehicle) {
        if (activeTickets.containsKey(vehicle.getLicensePlate())) {
            throw new IllegalStateException("Vehicle already parked: " + vehicle.getLicensePlate());
        }
        
        // Find available spot across all floors
        for (ParkingFloor floor : floors) {
            Optional<ParkingSpot> spot = floor.findAvailableSpot(vehicle);
            if (spot.isPresent() && spot.get().park(vehicle)) {
                Ticket ticket = new Ticket(vehicle, spot.get());
                activeTickets.put(vehicle.getLicensePlate(), ticket);
                System.out.printf("Vehicle %s parked at spot %s%n",
                    vehicle.getLicensePlate(), spot.get().getSpotId());
                return ticket;
            }
        }
        throw new IllegalStateException("Parking lot full!");
    }
    
    public double processExit(String licensePlate) {
        Ticket ticket = activeTickets.remove(licensePlate);
        if (ticket == null) throw new IllegalArgumentException("No active ticket for: " + licensePlate);
        
        double fee = ticket.processPayment(pricingStrategy);
        ticket.getSpot().removeVehicle();
        System.out.printf("Vehicle %s exited. Fee: $%.2f%n", licensePlate, fee);
        return fee;
    }
}`,
    realWorld: `**Smart parking systems**: OAK (Oakland), SFpark use similar designs but with IoT sensors for real-time spot detection.

**Airport parking**: O'Hare, Heathrow use multi-floor systems with dynamic pricing (early booking cheaper).

**Shopping malls**: Use similar systems to guide drivers to available spots via LED indicators and mobile apps.`,
    advantages: [
      'OOP model closely mirrors real-world domain',
      'Strategy pattern makes pricing algorithms pluggable',
      'Thread-safe spot assignment prevents double-booking',
      'Observer pattern enables real-time display board updates',
    ],
    disadvantages: [
      'In-memory state lost on server restart (need persistence)',
      'Single JVM limits concurrent throughput',
      'No distributed state for multi-building scenarios',
    ],
    tradeoffs: `**Synchronization granularity**: Locking at ParkingLot level is simple but creates bottleneck. Locking at ParkingSpot level is more granular but complex. Best: lock at floor level.

**Spot assignment strategy**: First-available vs Nearest-to-entrance. First-available is O(n) simpler. Nearest-to-entrance requires distance calculation and priority queue.`,
    alternatives: [
      'Event-sourced architecture for audit trail',
      'CQRS for read/write separation in high-traffic scenarios',
    ],
    whenToUse: 'This LLD design is applicable to any resource-reservation system: hotel rooms, library books, appointment scheduling.',
    whenNotToUse: 'N/A — this is a foundational design exercise.',
    commonMistakes: [
      'Not using synchronized or atomic operations for spot assignment (race conditions)',
      'Putting all logic in ParkingLot class (violates Single Responsibility)',
      'No abstraction for pricing — hardcoded fee calculation',
      'Not handling vehicle already parked scenario',
      'Missing ticket validation on exit',
    ],
    interviewQuestions: [
      { q: 'How would you handle two cars trying to park in the last available spot simultaneously?', a: 'Use synchronized methods or ReentrantLock at the ParkingSpot level. The park() method in ParkingSpot is synchronized — only one thread can execute it at a time. Thread 1 enters synchronized park(), parks successfully, returns true. Thread 2 waits, enters synchronized park(), finds spot occupied (status=OCCUPIED), returns false. Thread 2 must then search for next available spot. ConcurrentHashMap for activeTickets ensures thread-safe ticket management.' },
      { q: 'How would you make the pricing dynamic (surge pricing during peak hours)?', a: 'The PricingStrategy interface already handles this. Create a TimeBased-PricingStrategy that checks current hour. During peak (7-9am, 5-7pm), charge 2x normal rate. During nights, 0.5x. The ParkingLot constructor can inject different strategies, or you can use a dynamic strategy that internally applies time-based logic. This follows Open/Closed principle — extend by adding a new strategy, not modifying existing ones.' },
    ],
    resources: [
      { title: 'Parking Lot LLD - Gaurav Sen', url: 'https://www.youtube.com/watch?v=DSGsa0pu8-k', type: 'video', author: 'Gaurav Sen' },
      { title: 'Parking Lot Design Patterns - Educative.io', url: 'https://www.educative.io/courses/grokking-the-object-oriented-design-interview', type: 'article' },
    ],
    relatedTopics: ['solid-principles', 'design-patterns', 'lld-elevator', 'lld-library'],
  },

  // ===== SOLID PRINCIPLES =====
  'solid-principles': {
    id: 'solid-principles',
    title: 'SOLID Principles',
    subject: 'Programming',
    category: 'OOP',
    difficulty: 'Intermediate',
    estimatedTime: '50 min',
    tags: ['OOP', 'SOLID', 'Design', 'Java', 'Clean Code'],
    what: `SOLID is an acronym for five object-oriented design principles that, when followed together, make software systems more maintainable, extensible, and understandable.

- **S** — Single Responsibility Principle
- **O** — Open/Closed Principle  
- **L** — Liskov Substitution Principle
- **I** — Interface Segregation Principle
- **D** — Dependency Inversion Principle

Coined by Robert C. Martin (Uncle Bob) in the early 2000s, formalized in "Agile Software Development" (2002).`,
    why: `Without SOLID, code becomes a "Big Ball of Mud" — a system where everything depends on everything else. Changes break unrelated things. New features require touching dozens of files. Bugs are hard to isolate.

SOLID principles prevent:
- Rigid code that resists change
- Fragile code where small changes cause cascades of failures
- Immobile code that cannot be reused in other systems
- Viscous code where it's easier to hack than to do the right thing`,
    how: `## S — Single Responsibility Principle (SRP)

"A class should have only one reason to change."

One class = one job. If you need to change a class for two different reasons (e.g., logging AND business logic), it violates SRP.

\`\`\`java
// BAD: One class does everything
class UserService {
    void saveUser(User u) { /* DB logic */ }
    String generateReport(User u) { /* Report logic */ }
    void sendEmail(User u) { /* Email logic */ }
}

// GOOD: Each class has one responsibility
class UserRepository { void save(User u) { /* DB only */ } }
class UserReportService { String generateReport(User u) { /* Report only */ } }
class UserEmailService { void sendWelcomeEmail(User u) { /* Email only */ } }
\`\`\`

## O — Open/Closed Principle (OCP)

"Open for extension, closed for modification."

Add new behavior by adding new code, not by changing existing code.

\`\`\`java
// BAD: Every new shape requires modifying AreaCalculator
class AreaCalculator {
    double calculate(Object shape) {
        if (shape instanceof Circle c) return Math.PI * c.radius * c.radius;
        else if (shape instanceof Rectangle r) return r.width * r.height;
        // Need to add new if for every new shape!
    }
}

// GOOD: New shapes extend, never modify AreaCalculator
interface Shape { double area(); }
class Circle implements Shape { public double area() { return Math.PI * radius * radius; } }
class Rectangle implements Shape { public double area() { return width * height; } }
class Triangle implements Shape { public double area() { return 0.5 * base * height; } }
class AreaCalculator { double calculate(Shape s) { return s.area(); } } // Never changes!
\`\`\`

## L — Liskov Substitution Principle (LSP)

"Subtypes must be substitutable for their base types."

If S is a subtype of T, objects of type T may be replaced with S without altering program correctness.

\`\`\`java
// BAD: Square "IS-A" Rectangle is wrong design
class Rectangle { int width, height; 
    void setWidth(int w) { width = w; }
    void setHeight(int h) { height = h; }
}
class Square extends Rectangle {
    // Square MUST have equal sides, but setWidth alone breaks the invariant!
    void setWidth(int w) { width = height = w; } // Side effect!
    void setHeight(int h) { width = height = h; } // Side effect!
}

// This breaks LSP:
void processShape(Rectangle r) {
    r.setWidth(5); r.setHeight(10);
    assert r.area() == 50; // FAILS for Square! Square.area() = 100
}

// GOOD: Use a common abstraction instead of inheritance
interface Shape { int area(); }
class Rectangle implements Shape { ... }
class Square implements Shape { ... }
\`\`\`

## I — Interface Segregation Principle (ISP)

"No client should be forced to implement interfaces it doesn't use."

\`\`\`java
// BAD: Fat interface forces unnecessary implementations
interface Worker {
    void work();
    void eat();    // Robots don't eat!
    void sleep();  // Robots don't sleep!
}
class Robot implements Worker {
    public void work() { /* meaningful */ }
    public void eat() { throw new UnsupportedOperationException(); } // WRONG!
    public void sleep() { throw new UnsupportedOperationException(); } // WRONG!
}

// GOOD: Segregated interfaces
interface Workable { void work(); }
interface Eatable { void eat(); }
interface Sleepable { void sleep(); }
class Human implements Workable, Eatable, Sleepable { ... }
class Robot implements Workable { void work() { /* only meaningful methods */ } }
\`\`\`

## D — Dependency Inversion Principle (DIP)

"High-level modules should not depend on low-level modules. Both should depend on abstractions."

\`\`\`java
// BAD: High-level OrderService depends on low-level MySQLOrderRepo
class OrderService {
    private MySQLOrderRepository repo = new MySQLOrderRepository(); // Tight coupling!
    void placeOrder(Order o) { repo.save(o); }
}

// GOOD: Both depend on abstraction
interface OrderRepository { void save(Order o); }
class MySQLOrderRepository implements OrderRepository { ... }
class MongoOrderRepository implements OrderRepository { ... }

class OrderService {
    private final OrderRepository repo; // Depends on abstraction!
    OrderService(OrderRepository repo) { this.repo = repo; } // Constructor injection
    void placeOrder(Order o) { repo.save(o); }
}
// Now you can inject any implementation, including mocks for testing!
\`\`\``,
    internals: '',
    example: `## Complete Real-World SOLID Example: Payment Processing

\`\`\`java
// Applying all SOLID principles to a payment system

// DIP: High-level depends on abstraction
interface PaymentGateway {
    PaymentResult charge(String customerId, Money amount);
}

// OCP: Extend by adding new implementations
class StripeGateway implements PaymentGateway { ... }
class PayPalGateway implements PaymentGateway { ... }
class RazorpayGateway implements PaymentGateway { ... }

// ISP: Segregated interfaces  
interface Refundable { void refund(String transactionId); }
interface Subscribable { Subscription subscribe(Plan plan); }
class StripeGateway implements PaymentGateway, Refundable, Subscribable { ... }

// SRP: Each class has one job
class PaymentValidator { validate(PaymentRequest r) { ... } }
class PaymentAuditLogger { log(PaymentEvent e) { ... } }
class PaymentNotifier { notifyCustomer(Payment p) { ... } }

// The orchestrating service — SRP: only orchestrates
class CheckoutService {
    private final PaymentGateway gateway;    // DIP
    private final PaymentValidator validator;
    private final PaymentAuditLogger logger;
    private final PaymentNotifier notifier;
    
    CheckoutService(PaymentGateway gateway, ...) { // DIP via injection
        this.gateway = gateway;
        ...
    }
    
    void checkout(Order order) {
        validator.validate(order);
        PaymentResult result = gateway.charge(order.customerId(), order.total());
        logger.log(new PaymentEvent(result));
        notifier.notifyCustomer(result);
    }
}
\`\`\``,
    realWorld: `**Spring Framework**: Entire framework is built on DIP — ApplicationContext injects beans. You define interfaces, Spring injects implementations.

**Java Collections Framework**: OCP — you can implement List, Map, Set for custom behaviors without touching JDK source.

**JUnit**: ISP — separate Test, BeforeEach, AfterEach annotations rather than one fat TestCase interface.`,
    advantages: [
      'Code is easier to maintain and extend',
      'Unit testing becomes trivial (DIP enables mock injection)',
      'Changes are localized — modifying one class does not break others',
      'Onboarding new developers is easier — predictable structure',
    ],
    disadvantages: [
      'Can lead to over-engineering if applied dogmatically to simple problems',
      'More classes and interfaces initially',
      'Abstract code can be harder to trace/debug if taken too far',
    ],
    tradeoffs: 'SOLID adds upfront design cost but reduces long-term maintenance cost. For a quick prototype or throwaway script, SOLID is overkill. For production systems expected to evolve, SOLID is essential.',
    alternatives: ['GRASP patterns', 'DRY + KISS for simpler systems', 'Functional programming principles (immutability, pure functions)'],
    whenToUse: 'Production software that will evolve over time with multiple developers. Especially important for shared libraries and frameworks.',
    whenNotToUse: 'Throw-away scripts, simple one-off tools, or early-stage prototypes where the domain is not yet understood.',
    commonMistakes: [
      'SRP too granularly: One method per class is extreme. "One reason to change" is the test, not line count.',
      'OCP via if-else: Adding new if statement violates OCP. Use polymorphism.',
      'LSP violation in Collections: Java\'s List.add() on unmodifiable list throws exception — violates LSP.',
      'DIP without IoC container: Manual DI in large systems is painful. Use Spring/Guice.',
    ],
    interviewQuestions: [
      { q: 'Give a real example of Liskov Substitution Principle violation', a: 'The classic Rectangle/Square problem. Square IS-A Rectangle mathematically, but substituting a Square for a Rectangle breaks code that assumes setting width and height independently. Solution: Don\'t use inheritance; instead use a common Shape interface. Another example: Java\'s Arrays.asList() returns a List that throws UnsupportedOperationException on add() — violates LSP because List.add() is supposed to work.' },
      { q: 'How does Dependency Inversion Principle help with unit testing?', a: 'When OrderService depends on the concrete MySQLOrderRepository, you cannot unit test it without a real database. With DIP, OrderService depends on the OrderRepository interface. In tests, you inject a MockOrderRepository that returns canned responses without touching the database. This makes unit tests fast (no I/O), isolated, and deterministic.' },
    ],
    resources: [
      { title: 'SOLID Principles - Uncle Bob', url: 'https://www.youtube.com/watch?v=TMuno5RZNeE', type: 'video', author: 'Robert C. Martin' },
      { title: 'SOLID explained with Java examples', url: 'https://www.baeldung.com/solid-principles', type: 'article', author: 'Baeldung' },
    ],
    relatedTopics: ['design-patterns', 'lld-parking-lot', 'oop-principles', 'spring-di'],
  },

  // ===== RAG =====
  'rag': {
    id: 'rag',
    title: 'Retrieval-Augmented Generation (RAG)',
    subject: 'AI',
    category: 'GenAI',
    difficulty: 'Advanced',
    estimatedTime: '60 min',
    tags: ['RAG', 'LLM', 'Vector DB', 'Embeddings', 'AI'],
    what: `Retrieval-Augmented Generation (RAG) is an AI architecture that enhances Large Language Models by giving them access to external, up-to-date, domain-specific knowledge at inference time.

Instead of relying solely on the LLM's training data (which has a knowledge cutoff and may not contain private/specialized information), RAG first retrieves relevant documents from a knowledge base, then provides them as context to the LLM when generating an answer.

**RAG = Retrieval (find relevant info) + Augmentation (add to prompt) + Generation (LLM produces grounded answer)**`,
    why: `**Problems RAG solves:**

1. **Knowledge Cutoff**: LLMs are trained on data up to a certain date. RAG provides real-time, current information.

2. **Hallucination**: LLMs sometimes generate plausible-sounding but false information. RAG grounds the LLM in real retrieved documents, dramatically reducing hallucination.

3. **Domain-Specific Knowledge**: A general LLM doesn't know your company's internal documentation, codebases, or proprietary data. RAG injects this knowledge at query time.

4. **Source Attribution**: RAG answers can cite exactly which document each fact came from. Pure LLM answers cannot.

5. **Model Size**: Instead of fine-tuning a massive model on your entire knowledge base, RAG keeps the model generic and uses efficient retrieval. Cheaper and more maintainable.`,
    how: `## RAG Pipeline

### Phase 1: Ingestion (Offline)
1. **Document Loading**: Load PDFs, docs, URLs, YouTube transcripts, databases
2. **Parsing**: Extract text from various formats
3. **Chunking**: Split documents into segments (typically 256-1024 tokens)
4. **Embedding**: Convert each chunk to a dense vector using an embedding model
5. **Storage**: Store vectors in a vector database (Pinecone, Qdrant, Weaviate)

### Phase 2: Retrieval (Online, per query)
1. **Query Embedding**: Convert user's question to vector
2. **Similarity Search**: Find top-k most similar document chunks (cosine similarity)
3. **Reranking**: Use a cross-encoder to rerank results for precision
4. **Context Assembly**: Combine retrieved chunks with metadata

### Phase 3: Generation
1. **Prompt Construction**: System prompt + retrieved context + user question
2. **LLM Call**: Send assembled prompt to LLM
3. **Citation Extraction**: Parse which sources were used
4. **Response**: Return answer with citations`,
    internals: `## Advanced RAG Techniques

### Chunking Strategies
\`\`\`python
# Fixed-size chunking (simple but may split mid-sentence)
chunks = text.split_by_tokens(chunk_size=512, overlap=50)

# Semantic chunking (splits at natural semantic boundaries)
chunks = SemanticChunker().chunk(text)

# Hierarchical chunking (parent-child relationships)
# Parent chunk: entire section (for context)
# Child chunk: individual paragraphs (for precision)
\`\`\`

### Hybrid Search (BM25 + Vector)
Pure vector search misses exact keyword matches. Pure BM25 misses semantic similarity. Hybrid combines both:

\`\`\`python
# BM25 for keyword matches
bm25_results = bm25.search(query, top_k=20)

# Vector for semantic similarity  
vector_results = vector_db.search(query_embedding, top_k=20)

# Reciprocal Rank Fusion to combine
final = rrf_merge(bm25_results, vector_results, top_k=10)
\`\`\`

### Query Rewriting
The user's query might be poorly formed. Rewrite it before retrieval:
\`\`\`python
rewritten = llm.complete(
    f"Rewrite this search query for better retrieval: {user_query}"
)
results = vector_db.search(embed(rewritten))
\`\`\`

### HyDE (Hypothetical Document Embedding)
Generate a hypothetical ideal answer, embed THAT, and use it for retrieval:
\`\`\`python
hypothetical = llm.complete(f"Write an ideal answer to: {query}")
results = vector_db.search(embed(hypothetical))  # Often better than embedding query
\`\`\`

### Multi-Query Retrieval
Generate multiple phrasings of the query to retrieve diverse documents:
\`\`\`python
queries = llm.complete(f"Generate 5 different phrasings of: {user_query}")
all_results = [vector_db.search(embed(q)) for q in queries]
merged = deduplicate_and_merge(all_results)
\`\`\``,
    example: `## Complete RAG Implementation

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Qdrant
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import RetrievalQAWithSourcesChain

# === INGESTION PIPELINE ===
def ingest_document(file_path: str, topic: str):
    # 1. Load
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    # 2. Chunk
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=512,
        chunk_overlap=50,
        separators=["\\n\\n", "\\n", ". ", " ", ""]
    )
    chunks = splitter.split_documents(documents)
    
    # 3. Add metadata
    for chunk in chunks:
        chunk.metadata.update({
            "topic": topic,
            "source": file_path,
            "ingested_at": datetime.now().isoformat()
        })
    
    # 4. Embed and store
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    vectorstore = Qdrant.from_documents(
        chunks, embeddings, 
        url="http://localhost:6333",
        collection_name="knowledge_base"
    )
    return len(chunks)

# === RETRIEVAL + GENERATION PIPELINE ===
def answer_question(question: str, topic_filter: str = None) -> dict:
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    vectorstore = Qdrant(embeddings, collection_name="knowledge_base")
    
    # Metadata filtering (e.g., only search System Design topics)
    search_kwargs = {"k": 5}
    if topic_filter:
        search_kwargs["filter"] = {"topic": topic_filter}
    
    retriever = vectorstore.as_retriever(search_kwargs=search_kwargs)
    
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    
    # Build prompt with context
    chain = RetrievalQAWithSourcesChain.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
    
    result = chain.invoke({"question": question})
    
    return {
        "answer": result["answer"],
        "sources": [
            {"title": doc.metadata.get("source"), 
             "chunk": doc.page_content[:200]}
            for doc in result["source_documents"]
        ]
    }
\`\`\``,
    realWorld: `**Notion AI**: Uses RAG to answer questions about your own Notion workspace content.

**GitHub Copilot Chat**: Retrieves relevant code from your repository as context before answering questions.

**Customer Support**: Companies like Intercom, Zendesk use RAG to ground support chatbots in product documentation, reducing hallucination in customer-facing answers.

**Legal AI (Harvey, CoCounsel)**: RAG over case law databases to answer legal questions with citations to actual cases.

**Medical AI**: RAG over clinical guidelines (UpToDate, PubMed) to answer clinical decision support questions with source attribution.`,
    advantages: [
      'Reduces hallucination by grounding answers in real documents',
      'No knowledge cutoff — retrieval is always from latest data',
      'Source citations enable verification of every claim',
      'No expensive fine-tuning — knowledge added via documents',
      'Domain adaptation without retraining',
      'Private/confidential knowledge stays in your retrieval system',
    ],
    disadvantages: [
      'Latency: retrieval adds 50-500ms to each response',
      'Retrieval quality directly limits answer quality',
      'Complex pipeline with many failure points (embedding, retrieval, reranking)',
      'Long documents require careful chunking strategy',
      'Context window limits how many retrieved chunks fit in the prompt',
    ],
    tradeoffs: `**Chunk Size**: Smaller chunks → more precise retrieval but may lose context. Larger chunks → more context but noisier retrieval and higher latency. Typical sweet spot: 256-512 tokens with 10-20% overlap.

**Number of retrieved chunks (top-k)**: More chunks → more context → better answer quality, but higher LLM cost and latency. Diminishing returns after ~5-10 chunks.

**Vector DB vs Full-text search**: Vector DB finds semantically similar content. Full-text BM25 finds exact keyword matches. Hybrid (both) is best for most production systems.`,
    alternatives: [
      'Fine-tuning: Bake domain knowledge into model weights (expensive, periodic updates)',
      'Long-context models (Gemini 1.5 Pro: 1M tokens): Feed entire knowledge base as context (expensive per query)',
      'Tool calling/Function calling: LLM calls APIs to get real-time data',
      'GraphRAG: Knowledge graph + RAG for complex multi-hop reasoning',
    ],
    whenToUse: 'When you need LLMs to answer questions about domain-specific, private, or up-to-date information with citations. Ideal for documentation bots, customer support, knowledge management.',
    whenNotToUse: 'For simple structured data queries (use SQL). When answer latency is extremely critical. When your knowledge fits in the LLM context window entirely.',
    commonMistakes: [
      'Chunking without overlap — splitting sentences mid-thought',
      'Not filtering by metadata — retrieving irrelevant documents from wrong topics',
      'No reranking — first retrieval results are not always the most relevant',
      'Trusting LLM to always cite correctly — validate citations programmatically',
      'Embedding the user question directly without rewriting or expansion',
      'Not measuring retrieval quality separately from generation quality',
    ],
    interviewQuestions: [
      { q: 'What is the difference between RAG and fine-tuning?', a: 'Fine-tuning bakes knowledge into model weights — expensive ($$$), slow to update (retrain needed), no source attribution. RAG retrieves knowledge at inference time — cheap, instantly updatable (just add documents), provides source attribution. Fine-tuning is better for style/format learning. RAG is better for factual knowledge. Best systems use both: fine-tuned model + RAG for knowledge.' },
      { q: 'How do you evaluate a RAG system?', a: 'Evaluate both retrieval and generation separately. Retrieval: Precision@k (are retrieved chunks relevant?), Recall@k (are relevant chunks retrieved?). Generation: Faithfulness (is answer supported by retrieved context?), Answer Relevance (does answer address the question?). Use frameworks like RAGAS or TruLens for automated evaluation. Also track hallucination rate on a golden evaluation dataset.' },
      { q: 'What is HyDE and when would you use it?', a: 'HyDE (Hypothetical Document Embedding) generates a hypothetical ideal answer to the query, embeds that hypothetical answer, and uses it for retrieval instead of embedding the raw query. This works because the hypothetical answer is in the same semantic space as real answers in the knowledge base. Useful when queries are short/ambiguous and real documents are long-form — the hypothetical bridges the semantic gap.' },
    ],
    resources: [
      { title: 'RAG Architecture - LangChain docs', url: 'https://python.langchain.com/docs/tutorials/rag/', type: 'docs', author: 'LangChain' },
      { title: 'Building RAG Applications - Pinecone', url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/', type: 'article', author: 'Pinecone' },
      { title: 'Advanced RAG Techniques - YouTube', url: 'https://www.youtube.com/watch?v=sVcwVQRHIc8', type: 'video' },
    ],
    relatedTopics: ['llm-architecture', 'vector-databases', 'embeddings', 'agentic-ai'],
  },

  // ===== KAFKA =====
  'kafka': {
    id: 'kafka',
    title: 'Apache Kafka',
    subject: 'Backend Engineering',
    category: 'Messaging',
    difficulty: 'Advanced',
    estimatedTime: '55 min',
    tags: ['Kafka', 'Distributed Systems', 'Messaging', 'Streaming', 'Microservices'],
    what: `Apache Kafka is a distributed event streaming platform. It is a high-throughput, fault-tolerant, horizontally scalable publish-subscribe message queue that stores streams of events durably and makes them available for real-time and batch processing.

Originally built at LinkedIn in 2010 to handle 1+ trillion messages per day, now used by 80%+ of Fortune 500 companies for event-driven architectures.

**Kafka in one sentence**: A distributed, partitioned, replicated commit log that allows producers to write events and consumers to read them at their own pace — possibly millions of times from the same event.`,
    why: `**Why Kafka over traditional message queues (RabbitMQ, ActiveMQ)?**

Traditional queues: message is consumed → deleted. 

Kafka: message is written to a persistent log. Multiple consumer groups can independently read the same messages. Old messages are available for replay. This is the fundamental architectural difference.

**Problems Kafka solves:**
1. **Service Coupling**: Service A calling Service B directly creates tight coupling. A Kafka topic decouples them.
2. **Backpressure**: Downstream service overwhelmed? Events buffer in Kafka, consumer processes at its own pace.
3. **Audit Log**: Every event is persisted. Replay history for debugging, new service catchup, analytics.
4. **Fan-out**: One event consumed by 10 different services independently.
5. **Peak Load**: Absorb traffic spikes without dropping requests.`,
    how: `## Core Concepts

### Topic
A named channel where events are written. Like a database table but for streams. Topics are split into partitions for parallelism.

### Partition
The unit of parallelism. A topic with 6 partitions can be processed by up to 6 consumers in parallel. Events in one partition are totally ordered. Events across partitions are NOT ordered.

### Producer
Writes events to a topic. Chooses which partition via:
- Round-robin (default)
- Key-based hash (same key always goes to same partition — important for ordering per entity)
- Custom partitioner

### Consumer and Consumer Group
Consumer reads events from partitions. Consumer Group: multiple consumers sharing work. Each partition is assigned to exactly one consumer in the group. Add consumers → more parallel processing.

### Broker
Kafka server that stores partitions. Kafka cluster = multiple brokers for fault tolerance.

### Offset
Integer position of an event within a partition. Consumer tracks its offset — allows precise replay from any point.

### Replication
Each partition has a **Leader** replica and N **Follower** replicas on different brokers. Producer/consumer talks to Leader. Followers replicate asynchronously. If Leader dies, a Follower becomes new Leader automatically.`,
    internals: `## Internals Deep Dive

### Storage: Log Segments
Kafka stores data as **log segments** (large files on disk). Each segment is a sequence of events.

Why disk? Sequential I/O to disk is faster than random I/O to memory. Kafka's sequential writes can achieve 600+ MB/s on spinning disks.

Uses **sendfile()** system call to transfer data from disk to network socket without copying to userspace — zero-copy transfer.

### Producer Batching
Producer doesn't send one message at a time. It buffers messages in memory and sends batches:
\`\`\`java
ProducerConfig.BATCH_SIZE_CONFIG = 16384;  // 16KB batch
ProducerConfig.LINGER_MS_CONFIG = 5;       // Wait up to 5ms to fill batch
// This dramatically improves throughput at small latency cost
\`\`\`

### Delivery Semantics
**At-most-once**: Producer sends, doesn't retry. Consumer auto-commits offset before processing. Risk: data loss.

**At-least-once**: Producer retries on failure (acks=all). Consumer commits after processing. Risk: duplicates.

**Exactly-once**: Idempotent producer (enable.idempotence=true) + Transactional API. Kafka 0.11+. Complex but correct.

### Replication and ISR
**ISR (In-Sync Replicas)**: Set of replicas fully caught up with Leader.

Producer acks setting:
- acks=0: Fire and forget. Maximum throughput, possible data loss.
- acks=1: Leader acknowledges. Fast, but data lost if Leader dies before followers sync.
- acks=all: All ISR must acknowledge. Slowest but no data loss.`,
    example: `\`\`\`java
// Producer
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
props.put(ProducerConfig.ACKS_CONFIG, "all");
props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);

KafkaProducer<String, OrderEvent> producer = new KafkaProducer<>(props);

OrderEvent event = new OrderEvent("ORD-123", "PLACED", customerId);

// Key = orderId: ensures all events for same order go to same partition (ordered)
ProducerRecord<String, OrderEvent> record = new ProducerRecord<>("orders", event.orderId(), event);
producer.send(record, (metadata, ex) -> {
    if (ex == null)
        System.out.printf("Sent to partition %d, offset %d%n", metadata.partition(), metadata.offset());
    else
        log.error("Failed to send", ex);
});

// Consumer
Properties cProps = new Properties();
cProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
cProps.put(ConsumerConfig.GROUP_ID_CONFIG, "order-processor");
cProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
cProps.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false); // Manual commit for at-least-once

KafkaConsumer<String, OrderEvent> consumer = new KafkaConsumer<>(cProps);
consumer.subscribe(List.of("orders"));

while (true) {
    ConsumerRecords<String, OrderEvent> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<String, OrderEvent> record : records) {
        try {
            processOrder(record.value());
            // Commit only after successful processing
            consumer.commitSync(Map.of(
                new TopicPartition(record.topic(), record.partition()),
                new OffsetAndMetadata(record.offset() + 1)
            ));
        } catch (Exception e) {
            log.error("Failed to process order {}", record.key(), e);
            // Don't commit — message will be reprocessed (at-least-once)
        }
    }
}
\`\`\``,
    realWorld: `**LinkedIn**: Kafka was built here. Handles 7 trillion messages per day across feeds, activity tracking, metrics.

**Uber**: Real-time trip events, driver location updates, surge pricing calculations. 1+ trillion messages per day.

**Netflix**: Monitors streaming events, ad insertion, A/B test data collection. Uses Kafka as the backbone of their data pipeline.

**Airbnb**: Booking events, fraud detection, search indexing. Uses Kafka Connect for database change capture.

**Twitter**: Real-time timeline fan-out, analytics, ad event processing.`,
    advantages: [
      'Extremely high throughput (millions of messages/second per broker)',
      'Persistent log enables event replay — powerful for audit, debugging, new service onboarding',
      'Multiple independent consumer groups from same topic',
      'Horizontal scaling: add partitions, add brokers',
      'Fault tolerant via replication',
      'Exactly-once semantics available in Kafka 0.11+',
    ],
    disadvantages: [
      'Operational complexity: ZooKeeper/KRaft, brokers, schema registry',
      'No per-message TTL (only log retention period)',
      'Ordering only guaranteed within a partition, not across partitions',
      'Consumer group rebalancing causes temporary pause in processing',
      'Small message overhead: Kafka is optimized for large batches, not tiny individual messages',
    ],
    tradeoffs: `**Kafka vs RabbitMQ**: RabbitMQ is a traditional broker — complex routing, message priorities, per-message TTL, message deleted on consumption. Best for task queues. Kafka is a log — messages persist, ordered, replayed. Best for event streaming, audit logs, data pipelines.

**More partitions vs fewer**: More partitions = more parallelism = higher throughput. But more partitions = more file handles, more replication overhead, longer leader election time. Rule of thumb: partitions = expected max consumers × 2.

**Replication factor**: RF=1: no redundancy. RF=3 (typical production): tolerate one broker failure. RF=5: tolerate two failures. Higher RF = more network, more disk.`,
    alternatives: ['RabbitMQ — complex routing, task queues', 'AWS Kinesis — managed Kafka alternative', 'Google Pub/Sub — fully managed, auto-scaling', 'Pulsar — next-generation streaming, multi-tenancy', 'NATS — ultra-low latency, simpler model'],
    whenToUse: 'Event-driven microservices, event sourcing, real-time analytics, log aggregation, change data capture (CDC), stream processing, audit logs requiring replay.',
    whenNotToUse: 'Simple job queue where order doesn\'t matter (use RabbitMQ/SQS). Request-response pattern. Small scale applications. When operational complexity is a concern.',
    commonMistakes: [
      'Using one partition per topic: loses all parallelism',
      'Not setting a message key: related events go to different partitions, losing ordering',
      'Auto-committing offsets before processing: causes data loss on failure',
      'Too many small topics: increases ZooKeeper/KRaft overhead',
      'Not monitoring consumer lag: silent failure where consumers fall behind',
      'Storing Kafka as primary database: it is a log, not a DB',
    ],
    interviewQuestions: [
      { q: 'How does Kafka guarantee ordering?', a: 'Kafka guarantees ordering within a partition, not across partitions. All messages with the same key are sent to the same partition (via consistent hashing on the key), so they are totally ordered. If you need all OrderEvents for order-123 to be in order, use orderId as the key. If you need global ordering across all orders, you\'d need a single partition — which eliminates parallelism. This is the fundamental ordering trade-off.' },
      { q: 'What is Consumer Group rebalancing and when does it happen?', a: 'When a consumer in a group joins, leaves, or fails, Kafka must reassign partition ownership among remaining consumers. During rebalancing, all consumers stop processing (Stop-The-World pause). Triggers: new consumer joins, consumer crashes/times out (session.timeout.ms), topic partition count changes. Mitigation: use static group membership (group.instance.id), increase session timeout, use cooperative rebalancing (Kafka 2.4+) which only moves partitions that need to move.' },
    ],
    resources: [
      { title: 'Kafka: The Definitive Guide (Free PDF)', url: 'https://www.confluent.io/resources/kafka-the-definitive-guide/', type: 'book', author: 'Confluent' },
      { title: 'Kafka Architecture - Confluent', url: 'https://developer.confluent.io/learn-kafka/', type: 'docs', author: 'Confluent' },
      { title: 'Kafka in 1 Hour - Gaurav Sen', url: 'https://www.youtube.com/watch?v=Ch5VhJzaoaI', type: 'video', author: 'Gaurav Sen' },
    ],
    relatedTopics: ['redis', 'microservices', 'event-driven-architecture', 'distributed-systems'],
  },

  // ===== SYSTEM 1: NETFLIX (GLOBAL VIDEO STREAMING SYSTEM) =====
  'hld-netflix': {
    id: 'hld-netflix',
    title: "System 1: Netflix (Global Video Streaming System)",
    subject: "System Design",
    category: "HLD",
    difficulty: "Expert",
    estimatedTime: "60 min",
    tags: ["Streaming", "CDN", "Open Connect", "Cassandra", "Microservices", "Adaptive Bitrate"],
    what: "Netflix is a planetary-scale video-on-demand platform serving personalized streaming to over 100M Daily Active Users and 15M concurrent peak streams. \n\nThe architecture separates control-plane operations (sign-up, search, billing, recommendation, user profiles) from the data-plane (delivering petabits of video chunks per second). The data-plane operates completely outside AWS using Netflix Open Connect\u2014a custom globally distributed Content Delivery Network of physical Open Connect Appliances (OCAs) deployed directly inside thousands of ISP data centers worldwide.",
    why: "Delivering video at 45 Tbps peak bandwidth across global public transit networks is economically impossible and results in unacceptable buffering and packet loss.\n\n1. **Edge Locality (Open Connect)**: Deploying OCAs directly inside consumer ISPs eliminates long-haul transit costs and brings 95%+ of video bytes within 1 network hop of the subscriber.\n2. **Adaptive Bitrate Streaming (ABR)**: Dynamic switching between bitrates (HLS / MPEG-DASH chunks) matches real-time user bandwidth and avoids buffering.\n3. **High Write Throughput (Cassandra)**: Millions of video heartbeat updates per minute (tracking resume positions) require masterless, write-optimized distributed databases.\n4. **Resilience & Chaos Engineering**: Control plane runs in multi-region AWS with active-active failover.",
    how: "1. **Master Ingestion & Transcoding**: Studio masters uploaded to Amazon S3. The Transcoding Pipeline splits raw video into thousands of chunks, encoding each into hundreds of profiles (resolutions 360p to 4K, codecs H.264, HEVC, AV1) based on device profiles.\n2. **Proactive CDN Push**: During off-peak night hours, new titles are pre-cached across global OCA servers based on regional machine learning predictive demand models.\n3. **Playback Initiation**: Client app hits API Gateway (Zuul/Spring Cloud) -> Playback Authorization Service -> Returns manifest file (.m3u8 / .mpd) listing chunk URLs pointing to the optimal local OCA.\n4. **Playback & Telemetry**: Client requests 2-10 second video chunks via HTTP GET over TLS. A background heartbeat sends playback telemetry every 10 seconds to Kafka -> Cassandra.",
    internals: "## Storage & Data Tier Architecture\n\n### 1. Playback State Tracking (Cassandra)\nCassandra handles bookmark positions with append-only write speed:\n```sql\nCREATE KEYSPACE netflix_streaming WITH replication = {\n  'class': 'NetworkTopologyStrategy',\n  'us-east': 3,\n  'eu-west': 3\n};\n\nCREATE TABLE video_playback_state (\n  user_id uuid,\n  profile_id uuid,\n  video_id uuid,\n  last_playback_position_sec int,\n  total_duration_sec int,\n  completed_state boolean,\n  updated_at timestamp,\n  PRIMARY KEY ((user_id, profile_id), video_id)\n);\n```\n\n### 2. Video Chunking & Manifest Generation\n- Manifest file (.m3u8 for HLS, .mpd for DASH) describes video tracks, audio languages, and subtitle tracks.\n- Chunks are typically 2 to 6 seconds long. Client algorithms (BBA - Buffer-Based Algorithm) monitor buffer fill level to step up or down bitrate ladders.",
    realWorld: "Netflix runs >17,000 Open Connect appliances deployed across 150+ countries. During the Squid Game Season 1 premiere, OCA caches absorbed over 98% of all video traffic, shielding AWS transit completely.",
    advantages: ["Near-zero buffering through local ISP edge caching", "Linear write scaling for viewing history via Cassandra", "Optimal bandwidth efficiency using per-title and per-shot encoding", "Zero single points of failure via multi-region active-active deployment"],
    disadvantages: ["Extremely high infrastructure capex for custom OCA hardware", "High transcoding compute cost (hundreds of profiles per video title)", "Eventual consistency in Cassandra can cause slight delay in resume position across different devices"],
    tradeoffs: "Edge Caching (High Hardware Cost + Operational ISP Partnerships) vs Transit Bandwidth (Prohibitive recurring cloud egress costs). Netflix chose custom hardware to drop egress bandwidth costs to near-zero.",
    alternatives: ["Akamai / Cloudflare CDN", "HLS Live Packaging", "Centralized Origin Server Architecture"],
    whenToUse: "Global video-on-demand platforms with millions of concurrent viewers, large media catalogs, and predictable regional viewing patterns.",
    whenNotToUse: "Small-scale streaming apps (<10k users) or low-latency sub-second live streaming (e.g. interactive webinars, Twitch gaming chat) where WebRTC or SRT is required.",
    commonMistakes: ["Attempting to stream video directly from application servers instead of CDNs", "Using relational DB transactions for high-frequency video playback heartbeat updates", "Encoding single bitrate files instead of multi-bitrate ladder chunks"],
    interviewQuestions: [{"q": "How does Netflix achieve 99.999% availability for video playback if AWS has an outage?", "a": "Control plane operations (search, recommendation, login) are deployed across multiple AWS regions with Eureka/Zuul global traffic routing. Video streaming itself runs on ISP Open Connect appliances independently of AWS; if AWS experiences an outage, ongoing and newly initiated streams continue playing from OCA caches."}, {"q": "Why is Cassandra preferred over PostgreSQL for playback state bookmarking?", "a": "With 15M concurrent streams sending state updates every 10 seconds, write throughput exceeds 1.5M writes/sec. Cassandra's LSM-tree architecture performs sequential append-only disk writes without locks, scaling horizontally across nodes."}, {"q": "How does Adaptive Bitrate (ABR) streaming work under network congestion?", "a": "The client video player continuously measures the buffer occupancy and HTTP chunk download speeds. If buffer depletion accelerates, the player immediately requests the next 2-second chunk from a lower bitrate track specified in the manifest."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                            NETFLIX GLOBAL ARCHITECTURE                            |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ Client App (Smart TV / Mobile / Browser) ]                                     |\n|         |                                 |                                       |\n|         | (1. Auth, Search, Manifest)     | (4. Stream Video Chunks via TLS)      |\n|         v                                 v                                       |\n|  [ Anycast DNS / API Gateway ]     [ ISP Edge: Open Connect Appliance (OCA) ]     |\n|         |                                 ^                                       |\n|         v                                 | (3. Proactive Off-Peak Preload)       |\n|  [ AWS Control Plane Services ]           |                                       |\n|    +-- Zuul API Gateway                   |                                       |\n|    +-- Playback Service                   |                                       |\n|    +-- Recommendation Engine              |                                       |\n|         |                                 |                                       |\n|         v                                 |                                       |\n|  [ Ingestion & Transcoding Pipeline ] ----+                                       |\n|    +-- Raw Mezzanine S3 Staging                                                   |\n|    +-- Distributed Transcoder (HEVC/AV1)                                          |\n|    +-- Video Manifest Generator                                                   |\n|         |                                                                         |\n|         v (Telemetry Heartbeat)                                                   |\n|  [ Apache Kafka ] -> [ Apache Flink ] -> [ Apache Cassandra (Playback State) ]    |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Netflix Open Connect Overview", "url": "https://openconnect.netflix.com/", "type": "docs"}, {"title": "A Day in the Life of a Netflix Video", "url": "https://netflixtechblog.com", "type": "article"}],
    relatedTopics: ["hld-youtube", "kafka", "caching-strategies", "consistent-hashing"],
  },

  // ===== SYSTEM 2: UBER / GRAB (GEOSPATIAL RIDE DISPATCH PLATFORM) =====
  'hld-uber': {
    id: 'hld-uber',
    title: "System 2: Uber / Grab (Geospatial Ride Dispatch Platform)",
    subject: "System Design",
    category: "HLD",
    difficulty: "Expert",
    estimatedTime: "60 min",
    tags: ["Geospatial", "H3", "WebSocket", "Redis", "Kafka", "Ride Matching"],
    what: "Uber/Grab is a hyper-real-time geospatial dispatch and matching engine. The platform ingests continuous GPS coordinates from millions of active drivers every 4 seconds, tracks trip states, calculates dynamic surge pricing, and matches rider requests to nearby drivers in under 1 second.\n\nKey technical challenge: Spatial radius queries over fast-moving objects cannot be executed on traditional R-Tree or relational indexes without crippling locking and write contention.",
    why: "Relational geospatial queries (`ST_DWithin` on PostGIS) fail at 1M writes/sec because every driver location update triggers B-Tree/R-Tree index rebalancing.\n\n1. **H3 Hexagonal Hierarchical Spatial Index**: Uber partitions the globe into discrete hexagonal cells. Hexagons have the property that all 6 neighbors are equidistant, simplifying radius expansion and neighbor searches.\n2. **In-Memory Geospatial Tier**: Driver locations update in Redis geospatial or memory rings rather than persistent disks.\n3. **Bidirectional Low-Latency Ingress**: WebSockets and Netty maintain persistent socket connections with active driver and rider apps.",
    how: "1. **Location Ingestion**: Driver sends `(lat, lon, driver_id, status)` every 4s via WebSocket -> Netty Location Ingestion Service -> Kafka `driver-locations` topic.\n2. **H3 Cell Indexing**: Location Worker consumes Kafka event, computes H3 index at resolution 8 (cell area ~0.74 km2), and writes to Redis geospatial cluster:\n   `HSET driver:locations:<h3_index> <driver_id> <coords_timestamp>`\n3. **Ride Request & Matching**: Rider requests ride -> Dispatch Service determines rider's H3 cell -> expands outward through rings (`kRing(h3_index, k)`) -> filters active available drivers within ETA threshold -> runs Hungarian matching algorithm -> sends dispatch notification to top driver.",
    internals: "## Geospatial H3 Indexing vs Geohash\n\n| Metric | Geohash (Rectangular) | Uber H3 (Hexagonal) |\n| :--- | :--- | :--- |\n| Shape | Square / Rectangle | Regular Hexagon |\n| Neighbor Distance | Unequal (orthogonal vs diagonal) | Equidistant (all 6 neighbors exactly equidistant) |\n| Distortion at poles | High distortion | Uniform across globe (icosahedron projection) |\n| Radius expansion | Complex edge artifacts | Uniform expansion (`kRing(cell, 1)` = 6 cells) |\n\n### Dispatch Flow & Concurrency\nWhen a driver is offered a trip, an atomic distributed lock (Redis Redlock or CAS) reserves the driver for 15 seconds to prevent race conditions from concurrent ride requests.",
    realWorld: "Uber processes over 30 billion location pings per day using H3 resolution 8 cells for dispatch and resolution 6 for surge pricing calculations.",
    advantages: ["Sub-second driver matching using O(1) in-memory hexagonal cell lookups", "Zero database disk I/O on location updates by using memory-only Redis clusters", "Uniform distance neighbor searches with zero directional distortion"],
    disadvantages: ["Redis memory footprint grows with millions of active global drivers", "Complex handoff when drivers hover on boundaries between adjacent H3 hexagons"],
    tradeoffs: "In-Memory Ephemeral Storage (Redis) vs Persistent Disk (PostgreSQL/PostGIS). Since GPS coordinates become stale after 4 seconds, persistence is unnecessary for dispatch; raw events are archived in cold storage (Parquet/HDFS) for dispute resolution.",
    alternatives: ["Google S2 Geometry (Spherical Quadtree)", "Geohash", "PostGIS R-Tree"],
    whenToUse: "Real-time fleet tracking, ride hailing, on-demand courier dispatch, micro-mobility location matching.",
    whenNotToUse: "Static spatial indexing (e.g. real estate listings or store locators) where traditional PostGIS R-Tree with spatial indexing is simpler and more cost-effective.",
    commonMistakes: ["Writing driver GPS updates directly to relational databases with ACID transactions", "Using square bounding boxes which cause radius search distortion at diagonals", "Not handling concurrent dispatches where two riders receive the same driver offer"],
    interviewQuestions: [{"q": "Why does Uber use Hexagons (H3) instead of Squares (Geohash)?", "a": "A regular hexagon has only one distance between its center and the centers of all 6 immediate neighbors. Squares have two distinct neighbor distances (orthogonal is 1, diagonal is sqrt(2)). This property makes trajectory smoothing, radius expansion, and cluster aggregation mathematically uniform."}, {"q": "How do you prevent two nearby riders from being matched with the same driver?", "a": "When the matching engine selects an eligible driver, it executes an atomic `SET driver:lock:<id> rider_id NX PX 15000` in Redis. If successful, the driver is locked and offered the trip for 15 seconds. If rejected or timed out, the lock expires."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                         UBER GEOSPATIAL DISPATCH SYSTEM                           |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ Driver App ]  (Every 4s GPS)               [ Rider App ] (Ride Request)        |\n|        |                                            |                             |\n|        v (WebSocket / Netty)                        v (HTTP / REST)               |\n|  [ Location Gateway ]                        [ API Gateway ]                      |\n|        |                                            |                             |\n|        v                                            v                             |\n|  [ Kafka: driver-locations ]                 [ Dispatch & Matching Service ]      |\n|        |                                            |                             |\n|        v                                            | (k-Ring Neighbor Query)     |\n|  [ Location Ingestion Worker ]                      v                             |\n|        |                                     [ Redis H3 Geospatial Cluster ]      |\n|        +---- Writes driver_id into H3 cell -> (In-Memory Grid, TTL=10s)           |\n|                                                     |                             |\n|                                                     v                             |\n|                                              [ Match Engine ]                     |\n|                                               - Filter ETA via OSRM               |\n|                                               - Dynamic Surge Service             |\n|                                               - Push Offer via WebSocket          |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "H3: Uber's Hexagonal Hierarchical Spatial Index", "url": "https://eng.uber.com/h3/", "type": "article"}],
    relatedTopics: ["redis-concurrency", "consistent-hashing", "kafka", "comm-protocols"],
  },

  // ===== SYSTEM 3: FOOD DELIVERY PLATFORM (DOORDASH / SWIGGY / ZOMATO) =====
  'hld-food-delivery': {
    id: 'hld-food-delivery',
    title: "System 3: Food Delivery Platform (DoorDash / Swiggy / Zomato)",
    subject: "System Design",
    category: "HLD",
    difficulty: "Expert",
    estimatedTime: "50 min",
    tags: ["Saga Pattern", "Microservices", "Event-Driven", "Kafka", "Distributed Transactions"],
    what: "Food delivery platforms orchestrate a complex 3-sided marketplace: Customers, Restaurants/Merchants, and Delivery Delivery Partners. \n\nUnlike e-commerce where items ship asynchronously in 2-3 days, food delivery requires real-time coordination across physical fulfillment, inventory validation, card authorization, preparation timers, and driver dispatch within a 30-45 minute window.\n\nThe primary architectural challenge is managing distributed state across independent microservices without distributed locks (Two-Phase Commit).",
    why: "A single order spans 5 separate microservices (Order, Payment, Restaurant, Inventory, Delivery). If payment succeeds but the restaurant rejects the order (kitchen closed), money must be refunded and the driver canceled.\n\n1. **Saga Pattern (Orchestration)**: Coordinates multi-service workflows with compensating transactions when failures occur.\n2. **Real-Time Kitchen Order Tickets (KOT)**: WebSockets and push notifications alert merchant tablets instantly.\n3. **Dynamic Delivery Assignment**: Combines batch matching with driver pickup route optimization.",
    how: "1. **Checkout & Reservation**: Customer clicks Place Order -> Order Service creates order in state `PENDING_PAYMENT` -> invokes Saga Orchestrator.\n2. **Saga Orchestrator Workflow**:\n   - Step 1: Call Payment Service -> Authorize credit card charge -> Success.\n   - Step 2: Call Restaurant Service -> Send order to restaurant tablet -> Restaurant accepts -> Success.\n   - Step 3: Call Delivery Dispatch Service -> Find & allocate nearby delivery partner.\n3. **Compensating Transactions on Failure**:\n   - If Restaurant Service rejects: Saga Orchestrator executes compensating transaction: calls Payment Service `refundPayment(tx_id)` -> marks Order `CANCELLED_BY_RESTAURANT` -> notifies user.",
    internals: "## Saga Orchestration State Machine\n\n```\n[Order Created]\n      |\n      v\n[Execute Step 1: Charge Card] ---> (Fails) ---> [Order Aborted, Notify User]\n      | (Succeeds)\n      v\n[Execute Step 2: Merchant Accept] ---> (Rejects/Timeout) ---> [Compensate Step 1: Refund Card]\n      | (Accepts)                                                    |\n      v                                                              v\n[Execute Step 3: Dispatch Driver] ---> (No Driver) ---> [Compensate Step 2: Cancel Kitchen]\n      | (Driver Assigned)                                            |\n      v                                                              v\n[Order SUCCESS: Cooking & In-Flight]                    [Compensate Step 1: Refund Card]\n```\n\n### Database Schema (PostgreSQL Order Table)\n```sql\nCREATE TABLE orders (\n  order_id UUID PRIMARY KEY,\n  customer_id UUID NOT NULL,\n  restaurant_id UUID NOT NULL,\n  status VARCHAR(32) NOT NULL, -- PENDING_PAYMENT, ACCEPTED, PREPARING, OUT_FOR_DELIVERY, COMPLETED, CANCELLED\n  saga_execution_id UUID NOT NULL,\n  total_amount_cents INT NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n```",
    realWorld: "DoorDash processes tens of thousands of simultaneous orders during peak lunch and dinner hours using Temporal / Cadence workflow engines to run Saga orchestrators with zero state loss.",
    advantages: ["Data consistency across microservices without blocking distributed locks", "Clear observability into failure points and compensation workflows", "Loose coupling between independent engineering domain services"],
    disadvantages: ["Complex mental model and testing requirements for compensating transactions", "Eventual consistency: customers may see momentary pending states"],
    tradeoffs: "Orchestrated Saga (Centralized coordinator service) vs Choreographed Saga (Event-driven broadcast). Orchestration was chosen because order status requires strict centralized auditing and timeouts.",
    alternatives: ["Two-Phase Commit (2PC - too slow/blocking)", "Choreographed Event Sourcing"],
    whenToUse: "Multi-step e-commerce, food delivery, hotel/flight booking where operations span independent database boundaries.",
    whenNotToUse: "Monolithic architectures where a single database transaction (`BEGIN ... COMMIT`) suffices.",
    commonMistakes: ["Not designing idempotent compensating transactions (e.g. issuing double refunds if retry executes)", "Using Two-Phase Commit over microservices across WAN/cloud networks"],
    interviewQuestions: [{"q": "What happens in the Saga pattern if a compensating transaction fails?", "a": "Compensating transactions must be idempotent and retryable indefinitely. If transient network errors occur, the orchestrator retries with exponential backoff. If permanent failure occurs, the order drops into a Dead Letter Queue (DLQ) for human operator reconciliation."}, {"q": "Why is 2PC (Two-Phase Commit) unsuitable for food delivery microservices?", "a": "2PC is a blocking protocol. If the coordinator or any participant crashes during the prepare phase, locks remain held on all databases, starving the system of throughput."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        FOOD DELIVERY SAGA ARCHITECTURE                            |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ Customer Mobile App ]                                                          |\n|        |                                                                          |\n|        v (POST /api/v1/orders)                                                    |\n|  [ API Gateway ]                                                                  |\n|        |                                                                          |\n|        v                                                                          |\n|  [ Order Service ]                                                                |\n|        |                                                                          |\n|        v (Initiates Saga)                                                         |\n|  [ Order Saga Orchestrator ] <--------------------+                               |\n|        |           |            |                 | (Compensating Events)         |\n|        | (1)       | (2)        | (3)             |                               |\n|        v           v            v                 |                               |\n|   [ Payment ]  [ Kitchen ]   [ Dispatch ]         |                               |\n|    Service      Service       Service             |                               |\n|        |           |            |                 |                               |\n|   (Charge Card) (Notify Tab) (Match Driver)       |                               |\n|        +-----------+------------+-----------------+                               |\n|                                                                                   |\n|  [ Kafka Event Bus: order-events, payment-events, dispatch-events ]               |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Pattern: Saga - Microservices.io", "url": "https://microservices.io/patterns/data/saga.html", "type": "article"}],
    relatedTopics: ["distributed-transactions", "kafka", "postgres-jsonb-mvcc", "hld-uber"],
  },

  // ===== SYSTEM 4: WHATSAPP / TELEGRAM (END-TO-END ENCRYPTED CHAT) =====
  'hld-whatsapp': {
    id: 'hld-whatsapp',
    title: "System 4: WhatsApp / Telegram (End-to-End Encrypted Chat)",
    subject: "System Design",
    category: "HLD",
    difficulty: "Expert",
    estimatedTime: "60 min",
    tags: ["Messaging", "WebSockets", "Signal Protocol", "E2EE", "Netty", "Cassandra"],
    what: "WhatsApp / Telegram is a global messaging platform delivering over 100 Billion messages per day to 2 Billion active users with sub-100ms latency and End-to-End Encryption (E2EE).\n\nThe server architecture acts as an untrusted blind message router: the server cannot read message contents, group texts, or media files. Once a message is delivered to the recipient device, it is permanently deleted from server memory and disk.",
    why: "Maintaining 2 Billion concurrent connections while ensuring zero eavesdropping and instant delivery requires:\n\n1. **Massive Connection Density**: Erlang/Elixir BEAM or Java Netty handling millions of concurrent persistent TCP/WebSocket connections per server node.\n2. **Signal Protocol (E2EE)**: Extended Triple Diffie-Hellman (X3DH) for asynchronous key exchange and Double Ratchet Algorithm for forward secrecy and post-compromise security.\n3. **Store-and-Forward**: Ephemeral queuing for offline users; messages evaporate from the server the moment receipt ack is received.",
    how: "1. **Connection Handshake**: Client establishes persistent TLS/WebSocket session to a Chat Gateway server. Session mapped in Redis: `user_id -> gateway_node_ip`.\n2. **Message Transmission**: User A drafts message for User B. User A's device encrypts the plaintext using User B's ratchet key. The ciphertext is sent to Chat Gateway over socket.\n3. **Routing**:\n   - If User B is Online: Gateway queries Redis session store -> forwards ciphertext directly down User B's active socket -> User B device decrypts and replies with delivery ACK.\n   - If User B is Offline: Gateway stores ciphertext in ephemeral offline store (Cassandra or Mnesia). When User B reconnects, pending messages are drained and deleted.",
    internals: "## Cryptographic Architecture (Signal Protocol)\n\n- **X3DH (Extended Triple Diffie-Hellman)**: Allows establishing shared secrets even when the recipient is offline by pre-publishing signed one-time prekeys to the key server.\n- **Double Ratchet Algorithm**: Combines a Diffie-Hellman ratchet and a Symmetric KDF ratchet. Every single message produces a brand-new single-use symmetric encryption key.\n- **Forward Secrecy**: Compromising current keys does not allow decrypting past messages.\n- **Break-in Recovery**: An attacker with compromised keys cannot decrypt future messages once a new DH ratchet step occurs.",
    realWorld: "WhatsApp operates with a lean server footprint (~hundreds of servers for billions of users) because servers do not store chat histories\u2014chats live exclusively on user devices.",
    advantages: ["Mathematical privacy: impossible for servers or eavesdroppers to decrypt chats", "Extremely low storage footprint due to store-and-forward deletion", "High concurrency: 2M+ persistent sockets per Erlang/Netty node"],
    disadvantages: ["Multi-device synchronization requires complex key ratchets per device", "Media backups must be encrypted separately and managed by user cloud storage"],
    tradeoffs: "Store-and-Forward (Ephemeral server storage) vs Persistent Cloud History (Slack / Discord). WhatsApp prioritizes user privacy and low infrastructure storage cost over infinite server-side search.",
    alternatives: ["Matrix Protocol", "XMPP", "WebRTC Data Channels"],
    whenToUse: "Private secure communications, enterprise confidential messaging, banking chat integrations.",
    whenNotToUse: "Team collaboration tools (Slack, Teams) requiring persistent searchable historical archives and multi-year auditing compliance.",
    commonMistakes: ["Storing private keys on the server instead of secure enclave / keychain on client devices", "Retaining delivered message payloads in databases indefinitely", "Using polling instead of persistent bidirectional WebSockets"],
    interviewQuestions: [{"q": "How does WhatsApp support sending messages to users who are currently offline?", "a": "Via X3DH pre-keys. The recipient publishes signed one-time public pre-keys to the server in advance. The sender fetches a pre-key, computes the shared master secret locally, encrypts the message, and sends it to the server. The server holds the ciphertext in an ephemeral queue until the recipient connects."}, {"q": "What is Forward Secrecy in the Double Ratchet algorithm?", "a": "Forward Secrecy ensures that if an attacker compromises the device's current encryption keys today, they still cannot decrypt any previously recorded past messages, because every message used a unique ephemeral key that was immediately erased from memory after derivation."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        WHATSAPP E2EE CHAT ARCHITECTURE                            |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ User A (Sender) ]                                     [ User B (Receiver) ]    |\n|        |                                                           ^              |\n|        | 1. Encrypts payload with Ratchet Key                      |              |\n|        | 2. Sends Ciphertext                                       |              |\n|        v                                                           |              |\n|  [ Chat Gateway (Node 1) ]                                 [ Chat Gateway (Node 2) ]\n|        |                                                           ^              |\n|        | 3. Query Session Store                                    |              |\n|        v                                                           |              |\n|  [ Redis Session Registry ] ---------------------------------------+              |\n|     user_B -> Node 2 IP                                                           |\n|        |                                                                          |\n|        v (If User B is Offline)                                                   |\n|  [ Offline Storage Queue (Cassandra) ]                                            |\n|     - Ciphertext stored until User B reconnects                                   |\n|     - Immediately purged after ACK received                                       |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "The Double Ratchet Algorithm", "url": "https://signal.org/docs/specifications/doubleratchet/", "type": "docs"}],
    relatedTopics: ["comm-protocols", "redis-concurrency", "consistent-hashing", "caching-strategies"],
  },

  // ===== SYSTEM 5: TWITTER / X (TIMELINE GENERATION & FANOUT ENGINE) =====
  'hld-twitter': {
    id: 'hld-twitter',
    title: "System 5: Twitter / X (Timeline Generation & Fanout Engine)",
    subject: "System Design",
    category: "HLD",
    difficulty: "Advanced",
    estimatedTime: "50 min",
    tags: ["Timeline", "Fanout", "Redis", "Kafka", "Social Graph", "Hybrid Model"],
    what: "Twitter / X is a real-time microblogging and social networking service handling 500 Million tweets posted per day and over 300 Billion timeline reads per day.\n\nThe core engineering hurdle is the extreme read-to-write ratio (~600:1) and the Celebrity / Hotspot problem (e.g. an account with 100M+ followers posting a tweet).",
    why: "Naive database querying (`SELECT * FROM tweets WHERE user_id IN (SELECT following_id FROM follows WHERE user_id = ?) ORDER BY created_at DESC LIMIT 20`) creates massive disk I/O and crashes under load.\n\n1. **Pre-computed Timelines (Fanout-on-Write / Push)**: When a normal user tweets, write the tweet ID directly into the Redis Home Timeline lists of all their followers.\n2. **On-Demand Merging (Fanout-on-Read / Pull)**: For celebrity users (>25k followers), do not push to 100M timelines. Instead, merge their tweets in-memory only when followers open the app.\n3. **Hybrid Fanout Engine**: Balances write amplification against read latency.",
    how: "1. **Tweet Ingestion**: User tweets -> Tweet Service stores tweet metadata in Manhattan / PostgreSQL and broadcasts event to Kafka `tweet-events`.\n2. **Fanout Service**:\n   - Queries Social Graph Service (FlockDB) to fetch author's follower list.\n   - If author is standard user (<25,000 followers): Pushes `tweet_id` into Redis Home Timeline lists (`LPUSH timeline:<follower_id> <tweet_id>`).\n   - If author is celebrity (>25,000 followers): Skips push fanout.\n3. **Home Timeline Read**: User opens app -> Timeline Service retrieves user's Redis list -> fetches celebrity tweets -> runs in-memory multi-way merge sort -> populates user feed in < 50ms.",
    internals: "## Push vs Pull vs Hybrid Trade-Off Matrix\n\n| Strategy | Write Cost | Read Cost | Celebrity Problem |\n| :--- | :--- | :--- | :--- |\n| **Fanout-on-Write (Push)** | Massive ($O(N)$ writes per tweet) | Minimal ($O(1)$ read from Redis) | Severe write amplification (100M Redis pushes per tweet) |\n| **Fanout-on-Read (Pull)** | Minimal ($O(1)$ write) | Heavy ($O(F)$ DB scans + merge) | Terrible read latency for users following many accounts |\n| **Hybrid (Twitter Standard)** | Low ($O(N)$ for normal users) | Fast ($O(1)$ + merge top-k celebrity tweets) | Eliminated by skipping push for accounts with >25k followers |\n\n### Redis Timeline Data Structure\nTimelines are stored as Redis lists of tweet IDs capped at 800 items:\n`LPUSH timeline:user_123 9876543210`\n`LTRIM timeline:user_123 0 799`",
    realWorld: "When Barack Obama or Elon Musk tweets, Twitter avoids executing 100M+ concurrent Redis writes by relying entirely on the hybrid pull path.",
    advantages: ["Sub-50ms feed rendering for hundreds of millions of users", "Eliminates write amplification bottlenecks during breaking news events", "Caps memory overhead by trimming Redis timeline lists to top 800 entries"],
    disadvantages: ["High Redis RAM requirements for active user timeline caches", "Cold user startup: inactive users returning after months require on-demand rebuilding"],
    tradeoffs: "Memory usage (caching timelines in RAM) vs Compute latency (calculating timelines on DB query). Twitter spends RAM on Redis to ensure blazing fast reads.",
    alternatives: ["Full Push (Weibo)", "Full Pull (Tumblr / Facebook original)", "Search-based Feed (Elasticsearch)"],
    whenToUse: "Social media feeds, activity streams, real-time subscriber notification walls.",
    whenNotToUse: "Small private messaging groups or forums where read/write ratios are balanced.",
    commonMistakes: ["Applying pure Fanout-on-Write to celebrity accounts", "Storing full tweet text and user JSON inside the Redis timeline list instead of just 64-bit tweet IDs", "Allowing unbounded Redis list growth instead of capping at 800 items"],
    interviewQuestions: [{"q": "Why store only tweet IDs in Redis instead of full tweet JSON?", "a": "Memory efficiency and data freshness. If a user edits or deletes a tweet, storing only 64-bit integer IDs means the update happens in one place (the Tweet entity store). Followers' feeds fetch the ID and hydrate it from cache, preventing stale or inconsistent edits."}, {"q": "How do you handle inactive users who haven't logged in for 6 months?", "a": "Their Redis timeline cache is evicted based on TTL. When they eventually log back in, an async worker re-materializes their timeline on-demand by querying the database for their followed accounts' recent tweets."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        TWITTER HYBRID FANOUT ARCHITECTURE                         |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ User Posts Tweet ]                                                             |\n|         |                                                                         |\n|         v (POST /tweet)                                                           |\n|  [ Tweet Service ] ---> [ Tweets DB (Postgres / Manhattan) ]                      |\n|         |                                                                         |\n|         v (Broadcast)                                                             |\n|  [ Kafka: tweet-events ]                                                          |\n|         |                                                                         |\n|         v                                                                         |\n|  [ Fanout Engine ] <---> [ Social Graph Service (FlockDB) ]                       |\n|         |                                                                         |\n|         +---> If Followers < 25k: PUSH tweet_id into Redis Lists for each follower |\n|         |     `LPUSH timeline:<follower_id> <tweet_id>`                           |\n|         |                                                                         |\n|         +---> If Followers >= 25k (Celebrity): Do NOT push! Mark as Pull candidate|\n|                                                                                   |\n|  [ User Reads Feed ]                                                              |\n|         |                                                                         |\n|         v (GET /timeline)                                                         |\n|  [ Timeline Service ]                                                             |\n|         |-- 1. Read pre-computed Redis Timeline list                              |\n|         |-- 2. Fetch recent tweets of followed celebrities                        |\n|         |-- 3. In-memory Merge Sort & Return to Client (< 50ms)                   |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Timelines at Scale - Twitter Engineering", "url": "https://blog.x.com/engineering", "type": "article"}],
    relatedTopics: ["redis-concurrency", "caching-strategies", "kafka", "consistent-hashing"],
  },

  // ===== SYSTEM 6: YOUTUBE / TIKTOK (VIDEO INGESTION & RECOMMENDATION) =====
  'hld-youtube': {
    id: 'hld-youtube',
    title: "System 6: YouTube / TikTok (Video Ingestion & Recommendation)",
    subject: "System Design",
    category: "HLD",
    difficulty: "Expert",
    estimatedTime: "60 min",
    tags: ["Video", "Transcoding", "DAG", "Chunking", "CDN", "Recommendation"],
    what: "YouTube / TikTok is a global video sharing platform ingesting over 500 hours of video every minute, serving billions of daily views, and executing ML-based recommendation ranking in real-time.\n\nKey architectural challenges: Resumable chunked file uploading over unreliable connections, distributed Directed Acyclic Graph (DAG) video transcoding, and low-latency global CDN edge delivery.",
    why: "Uploading and processing multi-gigabyte video files sequentially on single servers causes timeout failures, memory exhaustion, and hours of processing delay.\n\n1. **Resumable Multipart Uploads**: Uploading 10MB byte chunks directly to object storage (Amazon S3 / GCS) via presigned URLs ensures dropped mobile connections resume without restart.\n2. **DAG Transcoding Pipeline**: Video is demuxed into audio and video streams, split into 5-second GOP (Group of Pictures) chunks, and transcoded in parallel across thousands of worker containers.\n3. **Adaptive CDN Delivery**: Manifest generation for HLS/DASH streaming across edge nodes.",
    how: "1. **Initiate Upload**: Client sends `POST /api/v1/videos/uploads/initiate` -> API Gateway returns `upload_id` and presigned S3 URLs for individual parts.\n2. **Parallel Chunk Upload**: Client uploads 10MB chunks in parallel. S3 triggers an event notification upon completion.\n3. **DAG Transcoding**:\n   - Master chunk merges in temporary storage.\n   - Transcoding Scheduler splits video into chunks and schedules tasks: Resolution Scaling (4K -> 1080p -> 720p -> 360p), Audio extraction, Watermarking, Thumbnail extraction.\n4. **Publish & Recommendation**: Metadata is saved to Spanner / PostgreSQL; video embeddings enter Vector DB for candidate generation in the feed.",
    internals: "## Video DAG Transcoding Pipeline\n\n```\n[Raw MP4 File] \n      |\n      +---> [Audio Extractor] ---> [AAC Encoder] ----------------+\n      |                                                          |\n      +---> [Splitter: 5s GOP Chunks]                            |\n                  |                                              |\n                  +---> [Worker: 4K Chunk Encoding (AV1/VP9)]    |\n                  |                                              |\n                  +---> [Worker: 1080p Chunk Encoding (H.264)]   |\n                  |                                              |\n                  +---> [Worker: 720p Chunk Encoding (H.264)]    |\n                  |                                              |\n                  +---> [Worker: 360p Chunk Encoding (H.264)]    |\n                                |                                |\n                                v                                v\n                  [Assembler: Stitch Encoded Chunks] <-----------+\n                                |\n                                v\n               [Generate .m3u8 HLS / .mpd DASH Manifests]\n                                |\n                                v\n                 [Distribute to CDN Edge Locations]\n```",
    realWorld: "YouTube processes over 500 hours of video every single minute by distributing GOP chunk transcoding across tens of thousands of Borg containers.",
    advantages: ["Failure resilience: failing a single 5s chunk transcoding task retries only that chunk, not the full 2-hour movie", "Optimal bandwidth utilization: clients upload directly to object storage, bypassing API web servers", "Broad device compatibility via multi-codec manifest packaging"],
    disadvantages: ["Massive storage footprint: storing dozens of resolutions and codec profiles per video multiplies raw size by 5-10x", "Complex orchestration of DAG task dependencies"],
    tradeoffs: "Pre-encoding all resolutions (High Compute & Storage Cost, Instant Playback) vs Just-in-Time Transcoding (Lower Storage, Unacceptable initial playback latency). YouTube pre-encodes common profiles for high-demand videos.",
    alternatives: ["AWS Elemental MediaConvert", "FFmpeg on EC2 instances", "P2P WebTorrent"],
    whenToUse: "User-generated content (UGC) video platforms, course video platforms, corporate media repositories.",
    whenNotToUse: "Ultra-low-latency real-time video communications (Zoom, Google Meet) where sub-second latency requires WebRTC rather than chunked file transcoding.",
    commonMistakes: ["Routing gigabyte video uploads through API web servers instead of direct-to-S3 presigned URLs", "Transcoding entire video files in single monolithic processes without chunking"],
    interviewQuestions: [{"q": "Why upload chunks directly to S3 via presigned URLs instead of through the application server?", "a": "Direct-to-storage upload removes heavy I/O and network saturation from API web servers, allowing them to remain lightweight stateless services. S3 handles scalable concurrent ingest and byte integrity validation natively."}, {"q": "What is a GOP (Group of Pictures) and why is it important for video chunking?", "a": "A GOP is a sequence of frames that begins with an I-frame (keyframe containing complete picture information) followed by P and B frames (predictive deltas). Videos can only be cleanly split at I-frame boundaries without causing visual distortion or corrupting decoding state."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        YOUTUBE VIDEO INGESTION PIPELINE                           |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ Content Creator App ]                                                          |\n|        |                                                                          |\n|        | 1. Initiate Multipart Upload                                             |\n|        v                                                                          |\n|  [ Upload Service ] ---> Returns Presigned URLs                                   |\n|        |                                                                          |\n|        | 2. Direct parallel chunk uploads                                         |\n|        v                                                                          |\n|  [ Cloud Object Storage (S3 / GCS) ]                                              |\n|        |                                                                          |\n|        | 3. ObjectCreated Event                                                   |\n|        v                                                                          |\n|  [ Kafka: video-uploaded ]                                                        |\n|        |                                                                          |\n|        v                                                                          |\n|  [ DAG Transcoding Scheduler ]                                                    |\n|     |-- Task 1: Video Splitter (5s GOP chunks)                                    |\n|     |-- Task 2: Parallel Transcoding Workers (1080p, 720p, 480p, AV1, H.264)      |\n|     |-- Task 3: Audio Transcoding & Subtitle Generation                           |\n|     |-- Task 4: Thumbnail Generator                                               |\n|     |-- Task 5: Manifest Compiler (.m3u8 / .mpd)                                  |\n|        |                                                                          |\n|        v 4. Sync assets                                                           |\n|  [ Global Edge CDN ] <=== [ Video Streaming Clients (HLS/DASH Playback) ]         |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Designing Video Transcoding Pipelines", "url": "https://netflixtechblog.com", "type": "article"}],
    relatedTopics: ["hld-netflix", "kafka", "caching-strategies", "consistent-hashing"],
  },

  // ===== SYSTEM 7: DISTRIBUTED WEB CRAWLER (SEARCH ENGINE SCALE) =====
  'hld-web-crawler': {
    id: 'hld-web-crawler',
    title: "System 7: Distributed Web Crawler (Search Engine Scale)",
    subject: "System Design",
    category: "HLD",
    difficulty: "Expert",
    estimatedTime: "60 min",
    tags: ["Crawler", "URL Frontier", "SimHash", "Politeness", "Deduplication", "Bloom Filter"],
    what: "A Distributed Web Crawler discovers, fetches, and indexes billions of web pages across the public internet for search engines (like Google) or LLM training datasets (Common Crawl).\n\nKey engineering challenges: Obeying politeness constraints (preventing DDoS against target hosts), deduplicating trillions of URLs and page contents, and optimizing crawl throughput across dynamic network conditions.",
    why: "Naively spawning threads to fetch URLs creates immediate cascading failures: crawling a small site with 1,000 threads crashes their web server, while duplicate URLs (circular links, calendar traps) consume infinite disk and memory.\n\n1. **Politeness & Priority (Two-Tier URL Frontier)**: Separates prioritization (crawling important pages first) from politeness (queuing by host with rate limiting).\n2. **Bloom Filters for URL Deduplication**: In-memory probabilistic membership checks avoid millions of DB disk lookups.\n3. **SimHash Content Fingerprinting**: Detects near-duplicate web pages (e.g. same article with different ads/timestamps).",
    how: "1. **URL Frontier Ingestion**: Seed URLs enter Priority Queues (based on PageRank) -> routed to Politeness Queues (one FIFO queue per target hostname domain).\n2. **Worker Fetching**: Politeness Worker pulls URL, verifies `robots.txt` compliance, waits for domain rate-limit cooldown, and executes HTTP GET via DNS Resolver cache.\n3. **Parsing & Deduplication**:\n   - Extracted text is hashed with 64-bit SimHash. If Hamming distance with existing fingerprints is < 3, the page is discarded as duplicate.\n   - Newly discovered links are checked against a Distributed Bloom Filter; unseen URLs are added to the Frontier.",
    internals: "## URL Frontier: Priority vs Politeness Architecture\n\n```\nDiscovered URLs\n      |\n      v\n[ Priority Filter ]\n      |\n      +---> [ High Priority Queue ]\n      +---> [ Medium Priority Queue ]   (Priority Queues determine WHAT to crawl first)\n      +---> [ Low Priority Queue ]\n      |\n      v\n[ Politeness Router (Hash on Hostname) ]\n      |\n      +---> [ Domain Queue: cnn.com ] --------+ (Delay Queue ensures 1 req/sec per host)\n      +---> [ Domain Queue: wikipedia.org ] --+\n      +---> [ Domain Queue: github.com ] -----+\n      |\n      v\n[ Fetcher Worker Thread Pool ]\n      |\n      v\n[ DNS Cache -> HTTP Fetch -> HTML Parser ]\n      |\n      +---> [ SimHash Text Deduplication ]\n      +---> [ URL Extraction -> Bloom Filter -> URL Frontier ]\n```\n\n### SimHash Algorithm\n1. Extracts word tokens and assigns weights based on TF-IDF.\n2. Hashes each token into a 64-bit binary fingerprint.\n3. Sums bit positions: if bit is 1, adds weight; if 0, subtracts weight.\n4. Final 64-bit vector: if sum > 0, set bit to 1, else 0.\n5. Two pages are near-duplicates if Hamming distance is <= 3.",
    realWorld: "Google and Common Crawl utilize distributed URL frontiers managing tens of billions of URLs with Bloom filters occupying just a few gigabytes of RAM.",
    advantages: ["Guarantees politeness: never overloads a target host with concurrent requests", "99.9% deduplication efficiency using compact Bloom filters and SimHash", "Handles spider traps and infinite calendar loops through depth and count caps"],
    disadvantages: ["Dynamic client-rendered Single Page Apps (React/Vue) require headless browser rendering (Puppeteer), increasing compute cost by 20x", "Distributed state coordination of queue politeness across worker nodes"],
    tradeoffs: "Freshness vs Crawl Budget. Recrawling every page daily exhausts bandwidth; crawlers use predictive PageRank algorithms to crawl high-frequency news sites hourly and static documentation monthly.",
    alternatives: ["Apache Nutch", "Scrapy Cluster", "Common Crawl API"],
    whenToUse: "Search engine indexers, competitive intelligence scraping, large-scale dataset extraction for AI training.",
    whenNotToUse: "Internal API data integration where webhooks or REST/gRPC data pipelines are supported.",
    commonMistakes: ["Ignoring `robots.txt` or domain politeness, resulting in IP bans and legal liability", "Checking URL uniqueness with SQL `SELECT WHERE url = ?` instead of in-memory Bloom filters", "Falling into spider traps (e.g. `/calendar?year=2026&month=13...` infinite URLs)"],
    interviewQuestions: [{"q": "How does the URL Frontier enforce domain politeness?", "a": "By decoupling priority from execution. URLs for a specific domain are always routed to that domain's dedicated FIFO queue. A worker thread pops a URL, performs the HTTP request, and records the timestamp. The queue is locked or placed in a delay wheel until the configured cooldown period (e.g. 1000ms) elapses."}, {"q": "How do you detect if two web pages have virtually identical content despite different header timestamps and advertisements?", "a": "Using the SimHash algorithm. SimHash produces a 64-bit fingerprint of the document's content where similar documents produce fingerprints with very small Hamming distances (typically <= 3 bits differing), allowing near-duplicate detection in O(1) time."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        DISTRIBUTED WEB CRAWLER PIPELINE                           |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ Seed URLs ] ---> [ URL Frontier ]                                              |\n|                           |                                                       |\n|                           v                                                       |\n|                     [ Host Politeness Delay Queues (Redis / Kafka) ]              |\n|                           |                                                       |\n|                           v                                                       |\n|                     [ Fetcher Workers (Netty / HTTPClient) ]                      |\n|                           |                                                       |\n|                           +---> [ Local DNS Cache ]                               |\n|                           |                                                       |\n|                           v                                                       |\n|                     [ HTML Document Content ]                                     |\n|                           |                                                       |\n|            +--------------+--------------+                                        |\n|            |                             |                                        |\n|            v                             v                                        |\n|   [ Content Parser ]             [ Link Extractor ]                               |\n|            |                             |                                        |\n|            v                             v                                        |\n|   [ SimHash Deduplication ]      [ Bloom Filter URL Seen? ]                       |\n|   (Near-duplicate detection)             |                                        |\n|            |                             v If Unseen                              |\n|            v Saved to                    +---> Back into URL Frontier             |\n|   [ Document Storage (Bigtable/S3) ]                                              |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Mercator: A scalable, extensible web crawler", "url": "https://research.google", "type": "docs"}],
    relatedTopics: ["consistent-hashing", "caching-strategies", "kafka", "hld-rate-limiter"],
  },

  // ===== SYSTEM 8: DISTRIBUTED RATE LIMITER (API DEFENSE TIER) =====
  'hld-rate-limiter': {
    id: 'hld-rate-limiter',
    title: "System 8: Distributed Rate Limiter (API Defense Tier)",
    subject: "System Design",
    category: "HLD",
    difficulty: "Advanced",
    estimatedTime: "50 min",
    tags: ["Rate Limiter", "Redis", "Lua", "Token Bucket", "Sliding Window", "Security"],
    what: "A Distributed Rate Limiter protects backend microservices against Denial of Service (DoS) attacks, brute force attempts, web scrapers, and cascading downstream failures by throttling incoming requests according to defined quotas (e.g. 100 requests per minute per IP/API Key).\n\nThe core technical challenge: In a distributed system with dozens of API Gateway instances, rate limiting counters must remain synchronized without introducing latency or race conditions.",
    why: "Local in-memory counters on individual gateway servers fail because a round-robin load balancer distributes requests across nodes, allowing an attacker to exceed quotas by a factor equal to the number of server instances.\n\n1. **Centralized In-Memory Coordination (Redis)**: Redis provides sub-millisecond execution for shared key counters.\n2. **Atomic Execution via Lua Scripts**: Eliminates read-modify-write race conditions in distributed environments.\n3. **Sliding Window Log Algorithm**: Completely prevents boundary bursting attacks that plague fixed window counters.",
    how: "1. **Request Ingress**: Client request hits API Gateway -> Rate Limiter Filter intercepts `(client_ip, user_id, route)`.\n2. **Key Generation**: Creates Redis key: `rate_limit:user:12345:api_v1`.\n3. **Atomic Evaluation via Redis Lua Script**:\n   - Executes Sliding Window Log: removes entries outside the 60-second window, checks remaining capacity, appends current timestamp, and sets TTL.\n   - If count <= limit: returns `1` (Allowed) -> Request proceeds to backend service.\n   - If count > limit: returns `0` (Blocked) -> Gateway returns HTTP 429 Too Many Requests with headers:\n     `X-RateLimit-Limit: 100`\n     `X-RateLimit-Remaining: 0`\n     `Retry-After: 24`",
    internals: "## Rate Limiting Algorithm Comparison\n\n| Algorithm | Pros | Cons |\n| :--- | :--- | :--- |\n| **Token Bucket** | Allows bursts; memory efficient (2 integers) | Distributed synchronization of refill timestamps |\n| **Leaky Bucket** | Constant smooth output rate | Requests can back up in queue; delays traffic |\n| **Fixed Window** | Low memory footprint | Burst vulnerability: 2x traffic allowed at window boundaries |\n| **Sliding Window Log** | 100% accurate; zero boundary bursting | High memory consumption (stores timestamp per request) |\n\n### Production Redis Lua Script (Sliding Window Log)\n```lua\nlocal rate_limit_key = KEYS[1]\nlocal current_epoch = tonumber(ARGV[1])\nlocal window_size = tonumber(ARGV[2])\nlocal max_allowed = tonumber(ARGV[3])\n\n-- 1. Evict entries older than the active window\nlocal clear_boundary = current_epoch - window_size\nredis.call('ZREMRANGEBYSCORE', rate_limit_key, 0, clear_boundary)\n\n-- 2. Count requests in active window\nlocal current_usage = redis.call('ZCARD', rate_limit_key)\n\nif current_usage < max_allowed then\n    -- 3. Log current request with unique member\n    redis.call('ZADD', rate_limit_key, current_epoch, current_epoch .. '-' .. math.random(100000))\n    redis.call('EXPIRE', rate_limit_key, math.ceil(window_size / 1000) + 1)\n    return 1 -- Allowed\nelse\n    return 0 -- Throttled\nend\n```",
    realWorld: "Stripe, Cloudflare, and GitHub utilize distributed Redis token buckets and sliding windows to throttle abuse across hundreds of edge locations.",
    advantages: ["Guaranteed atomic rate evaluation with zero race conditions via Redis Lua", "Eliminates 2x boundary traffic spike vulnerabilities", "Returns standardized RFC-compliant HTTP 429 rate limit response headers"],
    disadvantages: ["Introduces a network round-trip to Redis on every inbound API call", "Redis failure could either fail-open (security risk) or fail-closed (availability outage)"],
    tradeoffs: "Accuracy (Sliding Window Log in Redis) vs Memory & Latency (Token Bucket in local memory). High-security endpoints (e.g. login, payment checkout) use exact Redis sliding logs; high-throughput content endpoints use local token buckets.",
    alternatives: ["Envoy Global Rate Limit Service", "Cloudflare Edge Rules", "Bucket4j"],
    whenToUse: "Public APIs, user authentication endpoints, multi-tenant SaaS tiers, sensitive checkout routes.",
    whenNotToUse: "Internal high-performance microservice-to-microservice RPCs inside a secure VPC where latency is sub-millisecond and services trust each other.",
    commonMistakes: ["Using non-atomic `GET` followed by `SET` in Redis, introducing race conditions under concurrent requests", "Using Fixed Window counters that allow double the rate limit across the boundary minute", "Not configuring a fail-open policy when Redis becomes temporarily unreachable"],
    interviewQuestions: [{"q": "Why is a Lua script necessary when implementing a rate limiter in Redis?", "a": "A Redis Lua script executes atomically as a single command without interruption. Without Lua, separate `ZREMRANGEBYSCORE`, `ZCARD`, and `ZADD` commands would allow race conditions where two concurrent requests both read the counter below the threshold and both succeed, violating the rate limit."}, {"q": "What happens if the Redis rate limiter cluster crashes? Should you Fail-Open or Fail-Closed?", "a": "It depends on the endpoint. For core user browsing routes, fail-open to preserve user experience. For critical operations (payment processing, password resets, SMS OTP sending), fail-closed or fail to a local in-memory fallback to prevent catastrophic fraud."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        DISTRIBUTED RATE LIMITER ARCHITECTURE                      |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ Client Request ]                                                               |\n|        |                                                                          |\n|        v                                                                          |\n|  [ API Gateway (Envoy / Spring Cloud Gateway) ]                                   |\n|        |                                                                          |\n|        +---> [ Rate Limiter Middleware Filter ]                                   |\n|                     |                                                             |\n|                     | Atomic Lua Script Execution (`EVALSHA`)                     |\n|                     v                                                             |\n|              [ Redis Cluster (Master-Replica with Hash Tagging) ]                 |\n|                     |                                                             |\n|        +------------+------------+                                                |\n|        |                         |                                                |\n|   (Allowed: 1)              (Throttled: 0)                                        |\n|        |                         |                                                |\n|        v                         v                                                |\n|  [ Backend Microservices ]  [ HTTP 429 Too Many Requests ]                        |\n|                             Headers:                                              |\n|                               X-RateLimit-Limit: 100                              |\n|                               X-RateLimit-Remaining: 0                           |\n|                               Retry-After: 35                                     |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Scaling your API with Rate Limiters - Stripe", "url": "https://stripe.com/blog/rate-limiters", "type": "article"}],
    relatedTopics: ["redis-concurrency", "caching-strategies", "hld-web-crawler", "load-balancing"],
  },

  // ===== SYSTEM 9: DISTRIBUTED URL SHORTENER (TINYURL) =====
  'lld-url-shortener': {
    id: 'lld-url-shortener',
    title: "System 9: Distributed URL Shortener (TinyURL)",
    subject: "System Design",
    category: "LLD",
    difficulty: "Intermediate",
    estimatedTime: "45 min",
    tags: ["Base62", "Token Generation Service", "Hashing", "Java", "Concurrency"],
    what: "A low-level object-oriented design and complete Java implementation of a high-performance URL shortening engine.\n\nThe service converts long arbitrary URLs (up to 2048 chars) into compact 7-character alphanumeric aliases (`https://tiny.url/aZ9k1Qe`), supporting 3.52 Trillion unique short URLs ($62^7 = 3.52 \\times 10^{12}$) without collisions.",
    why: "Simple MD5 or SHA-256 truncation produces hash collisions that require database round-trip retry loops.\n\n1. **Pre-allocated Distributed Ranges (Token Generation Service - TGS)**: A distributed coordinator (ZooKeeper) assigns non-overlapping sequential integer ranges (e.g. 1M to 2M) to each application server.\n2. **Base62 Bijective Encoding**: Maps 64-bit integer IDs directly to alphanumeric characters (`[0-9a-zA-Z]`) with zero collisions and O(1) mathematical complexity.\n3. **Thread-Safe Concurrent Lookups**: Local caches backstopped by persistent key-value mapping.",
    how: "1. Server boots and requests an ID range chunk from ZooKeeper (e.g., `range_start = 1000000`, `range_end = 2000000`).\n2. Incoming `shorten(longUrl)` increments an internal `AtomicLong`.\n3. The atomic integer converts to a 7-character string using Base62 division and remainder operations.\n4. Short URL is stored in cache/database and returned to the caller in < 2ms.",
    internals: "## Base62 Math & Character Alphabet\n\nAlphabet: `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ` (Total 62 symbols).\n\nFor 7 characters:\n$$62^7 = 3,521,614,606,208 \\approx 3.52 \\text{ Trillion unique URLs}$$\n\nAt 1,000 writes/second:\n$$\\frac{3.52 \\times 10^{12}}{1000 \\times 86400 \\times 365} \\approx 111 \\text{ years of capacity}$$",
    realWorld: "Bitly and TinyURL process billions of redirects daily utilizing Base62 token generation with Redis LRU caches in front of distributed NoSQL databases.",
    advantages: ["Zero hash collisions guaranteed by bijection math", "O(1) encode and decode runtime complexity", "Distributed scalability via ZooKeeper server token ranges"],
    disadvantages: ["Predictable sequential short URLs unless an internal Feistel cipher or permutation table is applied", "Coordination overhead when nodes exhaust their allocated token range"],
    tradeoffs: "Base62 with Counter (Zero collisions, predictable sequence) vs MD5 Hash Truncation (Non-sequential, high collision rate requiring DB retry loops). Base62 was chosen for production scalability.",
    alternatives: ["MD5 / Murmur3 Hash Truncation", "UUID v4 base64 encoding", "Snowflake 64-bit ID"],
    whenToUse: "URL shortening, affiliate link generation, compact referral code generators.",
    whenNotToUse: "Cryptographically secure token generation where numbers must not be guessable.",
    commonMistakes: ["Using MD5 hashing without handling collisions in concurrent threads", "Not supporting expiration TTL causing unbounded database storage leaks"],
    interviewQuestions: [{"q": "How do you prevent sequential URL enumeration attacks if Base62 encodes sequential numbers?", "a": "Pass the sequential 64-bit ID through a reversible lightweight Feistel cipher or bit-permutation function before encoding to Base62. This scrambles the bits pseudo-randomly while preserving 100% collision-free uniqueness."}],
    codeExample: "package com.system.lld.urlshortener;\n\nimport java.util.concurrent.atomic.AtomicLong;\nimport java.util.concurrent.ConcurrentHashMap;\nimport java.time.Instant;\nimport java.util.Map;\n\npublic class TinyUrlSystem {\n    private static final String ALPHABET = \"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\";\n    private static final int BASE = ALPHABET.length();\n    \n    public record UrlRecord(String shortKey, String longUrl, Instant expiresAt) {}\n\n    public static class Base62 {\n        public static String encode(long num) {\n            if (num <= 0) return String.valueOf(ALPHABET.charAt(0));\n            StringBuilder sb = new StringBuilder();\n            while (num > 0) {\n                sb.append(ALPHABET.charAt((int)(num % BASE)));\n                num /= BASE;\n            }\n            return sb.reverse().toString();\n        }\n\n        public static long decode(String str) {\n            long num = 0;\n            for (char c : str.toCharArray()) {\n                num = num * BASE + ALPHABET.indexOf(c);\n            }\n            return num;\n        }\n    }\n\n    public static class RangeTokenGenerator {\n        private final AtomicLong counter;\n        private final long maxLimit;\n\n        public RangeTokenGenerator(long start, long limit) {\n            this.counter = new AtomicLong(start);\n            this.maxLimit = limit;\n        }\n\n        public long nextId() {\n            long id = counter.getAndIncrement();\n            if (id > maxLimit) {\n                throw new IllegalStateException(\"Range exhausted! Request new batch from ZooKeeper.\");\n            }\n            return id;\n        }\n    }\n\n    private final RangeTokenGenerator tokenGen;\n    private final Map<String, UrlRecord> store = new ConcurrentHashMap<>();\n\n    public TinyUrlSystem(long startRange, long endRange) {\n        this.tokenGen = new RangeTokenGenerator(startRange, endRange);\n    }\n\n    public String shortenUrl(String longUrl, long ttlSeconds) {\n        long id = tokenGen.nextId();\n        String shortKey = Base62.encode(id);\n        Instant expiry = (ttlSeconds > 0) ? Instant.now().plusSeconds(ttlSeconds) : Instant.MAX;\n        store.put(shortKey, new UrlRecord(shortKey, longUrl, expiry));\n        return \"https://tiny.url/\" + shortKey;\n    }\n\n    public String resolveUrl(String shortKey) {\n        UrlRecord record = store.get(shortKey);\n        if (record == null) return null;\n        if (Instant.now().isAfter(record.expiresAt())) {\n            store.remove(shortKey);\n            return null; // Expired\n        }\n        return record.longUrl();\n    }\n}",
    architecture: "+-----------------------------------------------------------------------------------+\n|                        TINYURL LOW-LEVEL CLASS DESIGN                             |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  +-----------------------------+        +--------------------------------------+  |\n|  |     TinyUrlService          |        |        Base62Encoder                 |  |\n|  +-----------------------------+        +--------------------------------------+  |\n|  | - encoder: Base62Encoder    |------->| + encode(id: long): String           |  |\n|  | - idGenerator: RangeIdGen   |        | + decode(shortUrl: String): long     |  |\n|  | - urlStore: UrlRepository   |        +--------------------------------------+  |\n|  +-----------------------------+                                                  |\n|  | + shorten(url, ttl): String |        +--------------------------------------+  |\n|  | + getOriginal(code): String |------->|        RangeIdGenerator              |  |\n|  +-----------------------------+        +--------------------------------------+  |\n|                 |                       | - currentId: AtomicLong              |  |\n|                 v                       | - maxId: long                        |  |\n|  +-----------------------------+        | + nextId(): long                     |  |\n|  |        UrlMapping           |        +--------------------------------------+  |\n|  +-----------------------------+                                                  |\n|  | - shortKey: String          |                                                  |\n|  | - originalUrl: String       |                                                  |\n|  | - createdAt: Instant        |                                                  |\n|  | - expiresAt: Instant        |                                                  |\n|  +-----------------------------+                                                  |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "System Design: TinyURL", "url": "https://github.com/donnemartin/system-design-primer", "type": "article"}],
    relatedTopics: ["hld-url-shortener", "hashmap", "consistent-hashing"],
  },

  // ===== SYSTEM 10: IN-MEMORY THREAD-SAFE LRU CACHE WITH TTL =====
  'lld-lru-cache': {
    id: 'lld-lru-cache',
    title: "System 10: In-Memory Thread-Safe LRU Cache with TTL",
    subject: "System Design",
    category: "LLD",
    difficulty: "Advanced",
    estimatedTime: "50 min",
    tags: ["LRU", "Doubly LinkedList", "ReentrantReadWriteLock", "Java", "Concurrency"],
    what: "A production-grade, thread-safe In-Memory Least Recently Used (LRU) Cache supporting constant time O(1) operations for `get` and `put`, paired with millisecond-precision Time-To-Live (TTL) expiration.\n\nThe core challenge: Java's built-in `LinkedHashMap` is not thread-safe, and wrapping it in `Collections.synchronizedMap` creates coarse-grained locking bottlenecks under high concurrent read traffic.",
    why: "1. **HashMap + Doubly Linked List**: HashMap provides O(1) pointer lookup to nodes; Doubly Linked List enables O(1) node detachment and head insertion without array shifting.\n2. **ReentrantReadWriteLock**: Multiple threads read simultaneously without contention, while write updates (evictions, mutations, head relocation) acquire an exclusive lock.\n3. **Lazy + Active TTL Eviction**: Expired items are discarded on read access or by a background scheduled cleaner.",
    how: "1. `get(key)` acquires ReadLock -> checks HashMap. If found and not expired, upgrades to WriteLock -> moves node to Head -> returns value.\n2. `put(key, value, ttl)` acquires WriteLock -> if key exists, updates value and moves to Head.\n3. If new key and capacity exceeded: tail node (least recently used) is unlinked from Doubly Linked List and removed from HashMap.\n4. New node is inserted immediately following the dummy `head` sentinel.",
    internals: "## Node Structure & Doubly Linked List Sentinels\n\nUsing dummy `head` and `tail` sentinel nodes completely eliminates null-checks during boundary insertions and removals:\n\n```\n[Dummy HEAD] <---> [Node: Key A (MRU)] <---> [Node: Key B] <---> [Dummy TAIL] (LRU)\n```\n\n- When Node B is accessed:\n  `detach(node)` -> `attachHead(node)` in $O(1)$ pointer operations.\n- When capacity is full:\n  `evictLRU()` removes `tail.prev` in $O(1)$ time.",
    realWorld: "Guava Cache, Caffeine, and Redis utilize variations of LRU with Doubly-Linked Lists, probabilistic W-TinyLFU, and segmented read-write locks.",
    advantages: ["Strict O(1) time complexity for get, put, and evict operations", "Elimination of null checks via dummy sentinel head and tail nodes", "Thread safety under concurrent read and write access"],
    disadvantages: ["Read operations require moving nodes to head, necessitating write lock contention", "Doubly linked list pointers introduce 24 bytes of pointer overhead per entry"],
    tradeoffs: "Pure LRU (Susceptible to cache pollution during one-off full-table scans) vs LFU / 2Q (Higher algorithmic complexity). LRU is standard for general web cache layers.",
    alternatives: ["LFU (Least Frequently Used)", "FIFO", "ARC (Adaptive Replacement Cache)", "Caffeine W-TinyLFU"],
    whenToUse: "Fast in-memory cache tiers, database query result caches, image and asset caching.",
    whenNotToUse: "Scenarios where frequency matters more than recency (use LFU instead).",
    commonMistakes: ["Using a Singly-Linked List which requires O(N) traversal to delete the predecessor of a node", "Not making node eviction thread-safe, leading to circular pointer loops under concurrency"],
    interviewQuestions: [{"q": "Why does a standard LRU cache require a Doubly Linked List instead of a Singly Linked List?", "a": "To remove a node from a linked list in O(1) time, you must update its predecessor's next pointer (`node.prev.next = node.next`). In a singly-linked list, finding the predecessor requires an O(N) scan from the head."}],
    codeExample: "package com.system.lld.lrucache;\n\nimport java.util.HashMap;\nimport java.util.Map;\nimport java.util.concurrent.locks.ReentrantReadWriteLock;\n\npublic class ThreadSafeLruCache<K, V> {\n    private static class Node<K, V> {\n        K key;\n        V value;\n        long expiresAt;\n        Node<K, V> prev, next;\n\n        Node(K key, V value, long expiresAt) {\n            this.key = key;\n            this.value = value;\n            this.expiresAt = expiresAt;\n        }\n    }\n\n    private final int capacity;\n    private final Map<K, Node<K, V>> map;\n    private final Node<K, V> head, tail;\n    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();\n\n    public ThreadSafeLruCache(int capacity) {\n        this.capacity = capacity;\n        this.map = new HashMap<>(capacity);\n        this.head = new Node<>(null, null, 0);\n        this.tail = new Node<>(null, null, 0);\n        head.next = tail;\n        tail.prev = head;\n    }\n\n    public V get(K key) {\n        rwLock.writeLock().lock();\n        try {\n            Node<K, V> node = map.get(key);\n            if (node == null) return null;\n            if (node.expiresAt > 0 && System.currentTimeMillis() > node.expiresAt) {\n                removeNode(node);\n                map.remove(key);\n                return null;\n            }\n            moveToHead(node);\n            return node.value;\n        } finally {\n            rwLock.writeLock().unlock();\n        }\n    }\n\n    public void put(K key, V value, long ttlMs) {\n        rwLock.writeLock().lock();\n        try {\n            long expiresAt = (ttlMs > 0) ? System.currentTimeMillis() + ttlMs : 0;\n            Node<K, V> existing = map.get(key);\n            if (existing != null) {\n                existing.value = value;\n                existing.expiresAt = expiresAt;\n                moveToHead(existing);\n                return;\n            }\n            if (map.size() >= capacity) {\n                Node<K, V> lru = tail.prev;\n                removeNode(lru);\n                map.remove(lru.key);\n            }\n            Node<K, V> newNode = new Node<>(key, value, expiresAt);\n            map.put(key, newNode);\n            addToHead(newNode);\n        } finally {\n            rwLock.writeLock().unlock();\n        }\n    }\n\n    private void moveToHead(Node<K, V> node) {\n        removeNode(node);\n        addToHead(node);\n    }\n\n    private void addToHead(Node<K, V> node) {\n        node.next = head.next;\n        node.prev = head;\n        head.next.prev = node;\n        head.next = node;\n    }\n\n    private void removeNode(Node<K, V> node) {\n        node.prev.next = node.next;\n        node.next.prev = node.prev;\n    }\n}",
    architecture: "+-----------------------------------------------------------------------------------+\n|                        THREAD-SAFE LRU CACHE ARCHITECTURE                         |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  +-----------------------------------------------------------------------------+  |\n|  |                     ThreadSafeLruCache<K, V>                                |  |\n|  +-----------------------------------------------------------------------------+  |\n|  | - lock: ReentrantReadWriteLock                                              |  |\n|  | - map: Map<K, Node<K, V>>                                                   |  |\n|  | - head: Node<K, V> (Dummy Sentinel)                                         |  |\n|  | - tail: Node<K, V> (Dummy Sentinel)                                         |  |\n|  | - capacity: int                                                             |  |\n|  +-----------------------------------------------------------------------------+  |\n|  | + get(key: K): V                                                            |  |\n|  | + put(key: K, value: V, ttlMs: long): void                                  |  |\n|  | + remove(key: K): boolean                                                   |  |\n|  | - moveToHead(node: Node<K, V>): void                                        |  |\n|  | - removeNode(node: Node<K, V>): void                                        |  |\n|  | - evictTail(): Node<K, V>                                                   |  |\n|  +-----------------------------------------------------------------------------+  |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Caffeine High Performance Caching", "url": "https://github.com/ben-manes/caffeine", "type": "docs"}],
    relatedTopics: ["hashmap", "caching-strategies", "redis-concurrency"],
  },

  // ===== SYSTEM 11: MULTI-ELEVATOR DISPATCHER & SCHEDULER =====
  'lld-elevator': {
    id: 'lld-elevator',
    title: "System 11: Multi-Elevator Dispatcher & Scheduler",
    subject: "System Design",
    category: "LLD",
    difficulty: "Expert",
    estimatedTime: "60 min",
    tags: ["State Pattern", "Strategy Pattern", "OOP", "Java", "Scheduling"],
    what: "An enterprise object-oriented design and multithreaded simulation of a multi-car elevator control system in a modern skyscraper.\n\nThe design implements the State Pattern for elevator movement transitions and the Strategy Pattern for pluggable scheduling algorithms (LOOK / SCAN vs Shortest-Seek Time).",
    why: "Elevator dispatching is a classic multi-agent real-time scheduling problem. Inefficient scheduling leads to long wait times, passenger starvation, and excessive power consumption.\n\n1. **State Pattern**: Encapsulates elevator states (`MOVING_UP`, `MOVING_DOWN`, `IDLE`, `DOORS_OPEN`, `MAINTENANCE`).\n2. **Strategy Pattern (LOOK Algorithm)**: The elevator continues traveling in its active direction, servicing all floor calls in that direction, reversing only when no pending requests remain ahead.\n3. **Centralized Dispatcher**: Allocates hall calls to the most optimal elevator car based on distance, capacity, and trajectory.",
    how: "1. Passenger presses Hall Button on Floor 12 (Direction: UP).\n2. `ElevatorController` queries all Elevator Cars -> computes a cost function for each car -> selects car with minimum cost.\n3. Target car receives floor stop in its `TreeSet<Integer> upRequests` queue.\n4. Elevator engine loops: advances floors, reaches Floor 12, transitions to `DOORS_OPEN`, halts for 3 seconds, transitions to `MOVING_UP`.",
    internals: "## Scheduling Algorithms: FCFS vs SCAN vs LOOK\n\n- **FCFS**: First-Come-First-Serve. Highly inefficient thrashing.\n- **SCAN (Elevator Algorithm)**: The car sweeps from bottom floor to top floor, reversing only at building boundaries.\n- **LOOK Algorithm**: Like SCAN, but reverses immediately when there are no requests ahead, avoiding empty trips to the building roof.",
    realWorld: "Otis CompassPlus and Schindler PORT dispatch systems use advanced destination dispatching algorithms to group passengers going to similar floors into the same elevator car.",
    advantages: ["Elimination of passenger starvation via directional TreeSet ordering", "Clear separation of concerns: state transitions vs car control vs system dispatching", "Pluggable dispatch strategies via Strategy design pattern"],
    disadvantages: ["LOOK algorithm does not account for car passenger weight capacity", "Extreme peak morning traffic requires specialized destination control mode"],
    tradeoffs: "Destination Dispatch (User inputs destination on floor terminal before boarding) vs Traditional Hall Call (Up/Down button only). Destination dispatch improves throughput by 30% in high-rise office towers.",
    alternatives: ["SCAN Scheduling", "Shortest Seek Time First (SSTF)", "Genetic Algorithm Dispatch"],
    whenToUse: "Multi-agent physical simulation, robotics dispatch, elevator controllers, automated storage retrieval systems.",
    whenNotToUse: "Simple single-car lifts where simple FIFO queue suffices.",
    commonMistakes: ["Not synchronizing shared request queues across dispatch and movement threads", "Allowing an elevator to travel to building extremes when no further requests exist (SCAN flaw)"],
    interviewQuestions: [{"q": "How does the LOOK algorithm differ from the SCAN elevator algorithm?", "a": "The SCAN algorithm forces the elevator to travel all the way to the top and bottom floors of the building before reversing, even if no passengers are waiting there. The LOOK algorithm checks for pending requests ahead; if none exist, it immediately reverses direction, saving significant energy and time."}],
    codeExample: "package com.system.lld.elevator;\n\nimport java.util.*;\n\npublic class ElevatorSystem {\n    public enum Direction { UP, DOWN, IDLE }\n    public enum ElevatorState { MOVING, STOPPED, DOORS_OPEN }\n\n    public static class Elevator {\n        private final int id;\n        private int currentFloor = 0;\n        private Direction direction = Direction.IDLE;\n        private ElevatorState state = ElevatorState.STOPPED;\n        private final TreeSet<Integer> upStops = new TreeSet<>();\n        private final TreeSet<Integer> downStops = new TreeSet<>(Collections.reverseOrder());\n\n        public Elevator(int id) { this.id = id; }\n\n        public synchronized void addStop(int floor) {\n            if (floor > currentFloor) upStops.add(floor);\n            else if (floor < currentFloor) downStops.add(floor);\n            if (direction == Direction.IDLE) {\n                direction = (floor >= currentFloor) ? Direction.UP : Direction.DOWN;\n            }\n        }\n\n        public synchronized void moveStep() {\n            if (direction == Direction.UP) {\n                if (!upStops.isEmpty()) {\n                    currentFloor++;\n                    if (upStops.contains(currentFloor)) {\n                        upStops.remove(currentFloor);\n                        state = ElevatorState.DOORS_OPEN;\n                    }\n                } else if (!downStops.isEmpty()) {\n                    direction = Direction.DOWN;\n                } else {\n                    direction = Direction.IDLE;\n                }\n            } else if (direction == Direction.DOWN) {\n                if (!downStops.isEmpty()) {\n                    currentFloor--;\n                    if (downStops.contains(currentFloor)) {\n                        downStops.remove(currentFloor);\n                        state = ElevatorState.DOORS_OPEN;\n                    }\n                } else if (!upStops.isEmpty()) {\n                    direction = Direction.UP;\n                } else {\n                    direction = Direction.IDLE;\n                }\n            }\n        }\n\n        public int getCurrentFloor() { return currentFloor; }\n        public Direction getDirection() { return direction; }\n        public int getId() { return id; }\n    }\n\n    public static class ElevatorDispatcher {\n        private final List<Elevator> elevators;\n\n        public ElevatorDispatcher(int numCars) {\n            elevators = new ArrayList<>();\n            for (int i = 1; i <= numCars; i++) elevators.add(new Elevator(i));\n        }\n\n        public Elevator dispatch(int floor, Direction dir) {\n            Elevator best = null;\n            int minCost = Integer.MAX_VALUE;\n\n            for (Elevator e : elevators) {\n                int dist = Math.abs(e.getCurrentFloor() - floor);\n                int cost = dist;\n                // Prefer cars already moving towards the request\n                if (e.getDirection() == dir) cost -= 2;\n                else if (e.getDirection() != Direction.IDLE) cost += 10;\n\n                if (cost < minCost) {\n                    minCost = cost;\n                    best = e;\n                }\n            }\n            if (best != null) best.addStop(floor);\n            return best;\n        }\n    }\n}",
    architecture: "+-----------------------------------------------------------------------------------+\n|                        ELEVATOR CONTROL SYSTEM CLASS DIAGRAM                      |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  +----------------------------+             +----------------------------------+  |\n|  |     ElevatorController     |             |       DispatchStrategy           |  |\n|  +----------------------------+             +----------------------------------+  |\n|  | - elevators: List<Elevator>|------------>| + selectBestElevator(...)        |  |\n|  | - strategy: DispatchStrat  |             +----------------------------------+  |\n|  +----------------------------+                               ^                   |\n|  | + requestElevator(...)     |                               |                   |\n|  | + step()                   |             +-----------------+----------------+  |\n|  +----------------------------+             |                                  |  |\n|                 |                           |                                  |  |\n|                 v                    [ LookStrategy ]                 [ ProximityStrategy ]\n|  +----------------------------+                                                   |\n|  |          Elevator          |                                                   |\n|  +----------------------------+                                                   |\n|  | - id: int                  |                                                   |\n|  | - currentFloor: int        |                                                   |\n|  | - state: ElevatorState     |                                                   |\n|  | - direction: Direction     |                                                   |\n|  | - upStops: TreeSet<Integer>|                                                   |\n|  | - downStops: TreeSet<Int>  |                                                   |\n|  +----------------------------+                                                   |\n|  | + addDestination(floor)    |                                                   |\n|  | + moveOneFloor()           |                                                   |\n|  +----------------------------+                                                   |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Elevator System Design Interview", "url": "https://github.com", "type": "article"}],
    relatedTopics: ["solid-principles", "lld-parking-lot", "lld-pubsub"],
  },

  // ===== SYSTEM 13: DISTRIBUTED PUB/SUB MESSAGING ENGINE =====
  'lld-pubsub': {
    id: 'lld-pubsub',
    title: "System 13: Distributed Pub/Sub Messaging Engine",
    subject: "System Design",
    category: "LLD",
    difficulty: "Advanced",
    estimatedTime: "50 min",
    tags: ["Observer Pattern", "Concurrency", "ThreadPool", "Java", "Messaging"],
    what: "A low-level object-oriented design and multithreaded Java implementation of an In-Memory Pub/Sub Messaging Engine.\n\nThe system decouples producers and consumers using the Observer Pattern, supporting dynamic topic subscription, broadcast fanout, and asynchronous subscriber worker thread isolation to prevent slow consumers from degrading publisher throughput.",
    why: "Direct synchronous observer notification blocks the publisher thread when a single subscriber encounters latency, network timeouts, or slow database writes.\n\n1. **Observer Pattern**: Decouples message publishers from subscriber listener loops.\n2. **Dedicated ThreadPool Executor per Subscription**: Isolates subscriber processing, guaranteeing fault isolation and non-blocking publisher execution.\n3. **Thread-Safe Concurrent Collections**: Uses `CopyOnWriteArrayList` and `ConcurrentHashMap` for lock-free reader iterations.",
    how: "1. Producer publishes a message to Topic `order-created`.\n2. Broker identifies all active `Subscriber` instances registered for `order-created`.\n3. Broker dispatches an async task to each subscriber's dedicated `ExecutorService` queue.\n4. Publisher returns immediately without waiting for subscriber execution.",
    internals: "## Concurrency & Thread Isolation Model\n\n```\n[Publisher Thread] ---> broker.publish(\"topic\", msg) (Returns in < 1ms)\n                             |\n                             v\n                 [ Topic: \"order-created\" ]\n                             |\n         +-------------------+-------------------+\n         |                                       |\n         v (Task pushed)                         v (Task pushed)\n[ Subscriber A Thread Pool ]           [ Subscriber B Thread Pool ]\n  Worker: Process Email Receipt          Worker: Update Analytics DB\n```",
    realWorld: "Google Cloud Pub/Sub, Apache Pulsar, and EventBus (Guava) utilize thread isolation and asynchronous fanout pipelines for high-throughput messaging.",
    advantages: ["Complete decoupling of message producers from message consumers", "Slow consumers cannot block publisher threads or other fast consumers", "Lock-free subscriber iterations using CopyOnWriteArrayList"],
    disadvantages: ["Unbounded thread pool queues can lead to OutOfMemoryError under prolonged consumer lag", "In-memory engine loses queued messages if the process crashes (no disk persistence)"],
    tradeoffs: "In-Memory Delivery (Zero disk overhead, extreme throughput) vs Persistent Log Storage (Kafka / RabbitMQ, durability guarantees). In-memory pub/sub is ideal for intra-process event distribution.",
    alternatives: ["Apache Kafka", "RabbitMQ", "Redis Streams", "Disruptor"],
    whenToUse: "Intra-process microservice event broadcasting, UI event buses, reactive notifications.",
    whenNotToUse: "Enterprise messaging where financial transactions must be persisted to disk before acknowledgment.",
    commonMistakes: ["Synchronously iterating over subscribers on the publisher thread", "Using standard ArrayList without synchronization in multithreaded environments"],
    interviewQuestions: [{"q": "What happens if a subscriber is extremely slow in an in-memory Pub/Sub engine?", "a": "If subscribers run on isolated bounded thread pools, the slow subscriber's task queue fills up. The broker must implement a backpressure or rejection policy (e.g. `CallerRunsPolicy` or dropping oldest messages) to prevent out-of-memory crashes while allowing fast subscribers to proceed uninterrupted."}],
    codeExample: "package com.system.lld.pubsub;\n\nimport java.util.*;\nimport java.util.concurrent.*;\n\npublic class DistributedPubSubEngine {\n    public record Message(String id, String payload, long timestamp) {}\n\n    public interface Subscriber {\n        String getId();\n        void onMessage(Message message);\n    }\n\n    public static class Topic {\n        private final String name;\n        private final List<Subscriber> subscribers = new CopyOnWriteArrayList<>();\n        private final ExecutorService executor = Executors.newFixedThreadPool(4);\n\n        public Topic(String name) { this.name = name; }\n\n        public void subscribe(Subscriber s) { subscribers.add(s); }\n        public void unsubscribe(Subscriber s) { subscribers.remove(s); }\n\n        public void publish(Message message) {\n            for (Subscriber sub : subscribers) {\n                executor.submit(() -> {\n                    try {\n                        sub.onMessage(message);\n                    } catch (Exception e) {\n                        System.err.printf(\"Error dispatching to %s: %s%n\", sub.getId(), e.getMessage());\n                    }\n                });\n            }\n        }\n    }\n\n    private final Map<String, Topic> topics = new ConcurrentHashMap<>();\n\n    public void createTopic(String name) {\n        topics.putIfAbsent(name, new Topic(name));\n    }\n\n    public void publish(String topicName, String payload) {\n        Topic topic = topics.get(topicName);\n        if (topic == null) throw new IllegalArgumentException(\"Topic does not exist: \" + topicName);\n        Message msg = new Message(UUID.randomUUID().toString(), payload, System.currentTimeMillis());\n        topic.publish(msg);\n    }\n\n    public void subscribe(String topicName, Subscriber subscriber) {\n        Topic topic = topics.get(topicName);\n        if (topic == null) throw new IllegalArgumentException(\"Topic does not exist: \" + topicName);\n        topic.subscribe(subscriber);\n    }\n}",
    architecture: "+-----------------------------------------------------------------------------------+\n|                        PUB/SUB MESSAGING ENGINE CLASS DIAGRAM                     |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  +--------------------------------+          +---------------------------------+  |\n|  |          PubSubBroker          |          |              Topic              |  |\n|  +--------------------------------+          +---------------------------------+  |\n|  | - topics: ConcurrentMap<String,|--------->| - name: String                  |  |\n|  |                         Topic> |          | - subscribers: List<Subscriber> |  |\n|  +--------------------------------+          +---------------------------------+  |\n|  | + createTopic(name)            |          | + addSubscriber(sub)            |  |\n|  | + publish(topic, message)      |          | + broadcast(message)            |  |\n|  | + subscribe(topic, subscriber) |          +---------------------------------+  |\n|  +--------------------------------+                           |                   |\n|                                                               v                   |\n|                                              +---------------------------------+  |\n|                                              |         Subscriber (I)          |  |\n|                                              +---------------------------------+  |\n|                                              | + onMessage(message: Message)   |  |\n|                                              | + getId(): String               |  |\n|                                              +---------------------------------+  |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Enterprise Integration Patterns: Publish-Subscribe Channel", "url": "https://www.enterpriseintegrationpatterns.com", "type": "docs"}],
    relatedTopics: ["kafka", "solid-principles", "lld-elevator"],
  },

  // ===== SYSTEM 14: SNAKE AND LADDER MULTIPLAYER GAME =====
  'lld-snake-ladder': {
    id: 'lld-snake-ladder',
    title: "System 14: Snake and Ladder Multiplayer Game",
    subject: "System Design",
    category: "LLD",
    difficulty: "Intermediate",
    estimatedTime: "45 min",
    tags: ["OOP", "Design Patterns", "Game Loop", "Java", "Extensibility"],
    what: "A clean, modular, and extensible object-oriented implementation of the classic Snake and Ladder multiplayer board game in Java.\n\nThe design adheres to Single Responsibility Principle (SRP) and Open/Closed Principle (OCP), supporting arbitrary board sizes (100+ cells), customizable snakes and ladders, multiple dice, and pluggable dice-rolling strategies.",
    why: "Naive implementations clump board coordinates, player turns, and dice math into a single spaghetti procedural loop.\n\n1. **Single Responsibility**: Decouples Board state, Board Cells/Jumps, Dice mechanics, and Game Engine loop.\n2. **Strategy Pattern for Dice**: Pluggable strategies allow swapping random rolling with deterministic rigged rolling for unit testing.\n3. **Queue-Based Player Rotation**: Circular FIFO queue smoothly manages turn-taking across $N$ players.",
    how: "1. Board initializes with cells 1 to 100. Snakes (head -> tail) and Ladders (base -> top) are registered as `Jump` objects.\n2. Players are placed in a FIFO `ArrayDeque<Player>`.\n3. Game Loop pops current player -> rolls dice -> computes new position.\n4. If new position has a Snake or Ladder, position updates automatically.\n5. If new position == 100: Player declared Winner! Otherwise, player rejoins back of queue.",
    internals: "## Board & Jump Entity Relationship\n\n```\n[ Board (1..N cells) ]\n      |\n      +---> Cell[i] contains optional [ Jump (start, end) ]\n                                            |\n                         +------------------+------------------+\n                         |                                     |\n                  [ Snake (end < start) ]               [ Ladder (end > start) ]\n```\n\n### Winning Condition Rule:\nA player must land **exactly** on the final cell (e.g. 100). If `current_pos + roll > 100`, the move is invalid and the player remains in place.",
    realWorld: "Multiplayer turn-based board games (Monopoly, Chess, Ludo) use this state-machine queue rotation and decoupled rules evaluation architecture.",
    advantages: ["Extensible: arbitrary board sizes and any count of snakes or ladders", "Deterministic testing supported by injecting mock dice roll strategies", "Zero state mutation leaks: Board rules are decoupled from Player turn queues"],
    disadvantages: ["Infinite loops possible if poorly designed snake/ladder chains form circular paths"],
    tradeoffs: "Exact Landing Rule (Must roll exact number to hit 100) vs Bouncing Rule (Overshoot bounces backwards). Exact landing was implemented per standard tournament rules.",
    alternatives: ["Monopoly Engine", "Ludo Engine"],
    whenToUse: "Turn-based multiplayer game systems, state machine learning exercises, interview coding rounds.",
    whenNotToUse: "Real-time physics-based action games.",
    commonMistakes: ["Allowing a ladder start on the same cell as a snake head", "Creating circular loops where ladder tops land on snake heads that point back to the ladder base"],
    interviewQuestions: [{"q": "How would you prevent infinite cycles when placing snakes and ladders on the board?", "a": "Model the board as a Directed Graph where cells are vertices and jumps are directed edges. Before adding a snake or ladder, run a cycle-detection algorithm (Depth-First Search with recursion stack tracking); if adding the edge creates a cycle, reject the placement."}],
    codeExample: "package com.system.lld.snakeladder;\n\nimport java.util.*;\n\npublic class SnakeAndLadderGame {\n    public record Jump(int start, int end) {\n        public Jump {\n            if (start == end) throw new IllegalArgumentException(\"Start cannot equal end\");\n        }\n    }\n\n    public static class Board {\n        private final int totalCells;\n        private final Map<Integer, Integer> jumps = new HashMap<>();\n\n        public Board(int totalCells) { this.totalCells = totalCells; }\n\n        public void addSnake(int head, int tail) {\n            if (tail >= head) throw new IllegalArgumentException(\"Snake tail must be below head\");\n            jumps.put(head, tail);\n        }\n\n        public void addLadder(int base, int top) {\n            if (top <= base) throw new IllegalArgumentException(\"Ladder top must be above base\");\n            jumps.put(base, top);\n        }\n\n        public int calculateDestination(int currentPos, int diceRoll) {\n            int target = currentPos + diceRoll;\n            if (target > totalCells) return currentPos; // Exact landing rule\n            return jumps.getOrDefault(target, target);\n        }\n\n        public int getTotalCells() { return totalCells; }\n    }\n\n    public static class Player {\n        private final String name;\n        private int position = 0;\n\n        public Player(String name) { this.name = name; }\n        public String getName() { return name; }\n        public int getPosition() { return position; }\n        public void setPosition(int p) { this.position = p; }\n    }\n\n    public static class GameEngine {\n        private final Board board;\n        private final Deque<Player> players = new ArrayDeque<>();\n        private final Random random = new Random();\n\n        public GameEngine(Board board, List<Player> playerList) {\n            this.board = board;\n            players.addAll(playerList);\n        }\n\n        public Player playTurn() {\n            Player current = players.pollFirst();\n            int roll = random.nextInt(6) + 1;\n            int nextPos = board.calculateDestination(current.getPosition(), roll);\n            current.setPosition(nextPos);\n\n            if (nextPos == board.getTotalCells()) {\n                return current; // Winner!\n            }\n            players.addLast(current);\n            return null; // Game continues\n        }\n    }\n}",
    architecture: "+-----------------------------------------------------------------------------------+\n|                        SNAKE & LADDER GAME CLASS DIAGRAM                          |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  +--------------------------------+          +---------------------------------+  |\n|  |           GameController       |          |              Board              |  |\n|  +--------------------------------+          +---------------------------------+  |\n|  | - board: Board                 |--------->| - totalCells: int               |  |\n|  | - dice: Dice                   |          | - jumps: Map<Integer, Jump>     |  |\n|  | - players: Deque<Player>       |          +---------------------------------+  |\n|  +--------------------------------+          | + getDestination(curr, roll)    |  |\n|  | + playGame(): Player           |          +---------------------------------+  |\n|  +--------------------------------+                           |                   |\n|                 |                                             v                   |\n|                 |                            +---------------------------------+  |\n|                 +--------------------------->|         Jump (Snake / Ladder)   |  |\n|                 |                            +---------------------------------+  |\n|                 v                            | - startPosition: int            |  |\n|  +--------------------------------+          | - endPosition: int              |  |\n|  |             Player             |          +---------------------------------+  |\n|  +--------------------------------+                                               |\n|  | - id: String, name: String     |                                               |\n|  | - currentPosition: int         |                                               |\n|  +--------------------------------+                                               |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Low Level Design of Snake and Ladder", "url": "https://github.com", "type": "article"}],
    relatedTopics: ["solid-principles", "lld-elevator", "hashmap"],
  },

  // ===== SYSTEM 15: CONCURRENCY-SAFE MOVIE TICKET RESERVATION (BOOKMYSHOW) =====
  'lld-bookmyshow': {
    id: 'lld-bookmyshow',
    title: "System 15: Concurrency-Safe Movie Ticket Reservation (BookMyShow)",
    subject: "System Design",
    category: "LLD",
    difficulty: "Expert",
    estimatedTime: "60 min",
    tags: ["Two-Phase Reservation", "Concurrency", "Optimistic Locking", "Java", "BookMyShow"],
    what: "A low-level object-oriented design and multithreaded Java implementation of a high-concurrency Movie Ticket Booking System (like BookMyShow / Ticketmaster).\n\nThe core technical challenge: During blockbuster flash sales (e.g. Avengers opening weekend), thousands of concurrent users click the exact same front-row seat simultaneously. The system must guarantee that zero double-bookings occur without deadlocking database rows.",
    why: "Immediate direct booking writes cause transaction collisions and angry users whose cards are charged after someone else secured the seat.\n\n1. **Two-Phase Reservation Lifecycle**:\n   - Phase 1: Temporary Lock (Seat transitions from `AVAILABLE` -> `LOCKED` for 10 minutes with user ownership).\n   - Phase 2: Permanent Confirmation (Upon payment success, transitions from `LOCKED` -> `BOOKED`). If payment times out, lock automatically releases back to `AVAILABLE`.\n2. **Atomic Compare-And-Swap (CAS) / Optimistic Locking**: Ensures only 1 thread wins the lock race.\n3. **Lock Cleanup Wheel**: Evicts expired seat holds in O(1) time without periodic full-table scans.",
    how: "1. User selects Seat A1 and A2 for Show #501.\n2. System executes atomic reservation check: `seat.lock(userId, 600000ms)`.\n3. If atomic CAS succeeds: seats become `LOCKED` to User for 10 minutes. A timer is scheduled.\n4. User enters payment gateway -> Payment succeeds -> `seat.confirmBooking(userId)` permanently commits the seats.\n5. If payment fails or cancels -> `seat.releaseLock(userId)` unlocks seats instantly for other waiting users.",
    internals: "## Seat State Lifecycle Machine\n\n```\n               [ AVAILABLE ]\n                     |\n                     | 1. Temporary Lock (Atomic CAS)\n                     v\n                 [ LOCKED ]\n                 /        \\\n   2a. Payment  /          \\ 2b. Payment Fails / Timeout (10 min)\n      Succeeds /            \\\n              v              v\n         [ BOOKED ]    [ AVAILABLE ]\n        (Permanent)     (Re-released)\n```\n\n### Database Concurrency Control (SQL)\n```sql\n-- Atomic lock acquisition with optimistic version check\nUPDATE show_seats \nSET status = 'LOCKED', locked_by = :userId, locked_at = NOW(), version = version + 1\nWHERE id = :seatId \n  AND status = 'AVAILABLE' \n  AND version = :expectedVersion;\n```",
    realWorld: "BookMyShow, Ticketmaster, and airline seat selection systems use this distributed two-phase reservation pattern with Redis distributed locks and automatic TTL expiration.",
    advantages: ["100% guarantee against double-booking under extreme concurrent traffic", "Deadlock prevention by strictly enforcing natural ordering (sorting) on multi-seat lock acquisitions", "Automatic recovery from abandoned checkouts via TTL expiration"],
    disadvantages: ["Seats held by users who abandon carts remain unavailable to others for the duration of the 10-minute lock window"],
    tradeoffs: "Optimistic Locking with In-Memory Hold vs Pessimistic DB Row Locking. Pessimistic locks serialize database connections and crash under 10k RPS. In-memory locks with atomic compare-and-swap handle flash sales smoothly.",
    alternatives: ["Pessimistic `SELECT FOR UPDATE`", "Redis Redlock Distributed Locking"],
    whenToUse: "Movie ticketing, concert bookings, airline seat reservation, high-demand inventory flash sales.",
    whenNotToUse: "Unlimited capacity events or standard e-commerce with flexible warehouse backorders.",
    commonMistakes: ["Not sorting seat IDs before locking multiple seats, which causes catastrophic thread deadlocks", "Charging the user's credit card before securing the temporary seat reservation lock"],
    interviewQuestions: [{"q": "How do you prevent deadlocks when a user tries to book seats [A1, A2] while another user tries to book seats [A2, A1]?", "a": "Always enforce a canonical global lock acquisition order. By sorting the requested seat IDs alphabetically before acquiring locks (both threads acquire A1 first, then A2), circular wait conditions are mathematically impossible, completely eliminating deadlocks."}],
    codeExample: "package com.system.lld.bookmyshow;\n\nimport java.util.*;\nimport java.util.concurrent.ConcurrentHashMap;\nimport java.util.concurrent.locks.ReentrantLock;\n\npublic class TicketBookingSystem {\n    public enum SeatStatus { AVAILABLE, LOCKED, BOOKED }\n\n    public static class Seat {\n        private final String id;\n        private SeatStatus status = SeatStatus.AVAILABLE;\n        private String lockedBy = null;\n        private long lockExpiresAt = 0;\n        private final ReentrantLock lock = new ReentrantLock();\n\n        public Seat(String id) { this.id = id; }\n\n        public boolean reserveTemporary(String userId, long ttlMs) {\n            lock.lock();\n            try {\n                long now = System.currentTimeMillis();\n                // Release expired lock if present\n                if (status == SeatStatus.LOCKED && now > lockExpiresAt) {\n                    status = SeatStatus.AVAILABLE;\n                    lockedBy = null;\n                }\n                if (status == SeatStatus.AVAILABLE) {\n                    status = SeatStatus.LOCKED;\n                    lockedBy = userId;\n                    lockExpiresAt = now + ttlMs;\n                    return true;\n                }\n                return false;\n            } finally {\n                lock.unlock();\n            }\n        }\n\n        public boolean confirmBooking(String userId) {\n            lock.lock();\n            try {\n                if (status == SeatStatus.LOCKED && userId.equals(lockedBy)) {\n                    if (System.currentTimeMillis() <= lockExpiresAt) {\n                        status = SeatStatus.BOOKED;\n                        return true;\n                    }\n                }\n                return false; // Lock expired or unauthorized\n            } finally {\n                lock.unlock();\n            }\n        }\n\n        public void releaseLock(String userId) {\n            lock.lock();\n            try {\n                if (status == SeatStatus.LOCKED && userId.equals(lockedBy)) {\n                    status = SeatStatus.AVAILABLE;\n                    lockedBy = null;\n                    lockExpiresAt = 0;\n                }\n            } finally {\n                lock.unlock();\n            }\n        }\n\n        public SeatStatus getStatus() { return status; }\n        public String getId() { return id; }\n    }\n\n    public static class ShowService {\n        private final Map<String, Seat> seats = new ConcurrentHashMap<>();\n\n        public ShowService(List<String> seatIds) {\n            for (String sid : seatIds) seats.put(sid, new Seat(sid));\n        }\n\n        public boolean bookMultipleSeats(String userId, List<String> seatIds, long ttlMs) {\n            List<Seat> lockedSeats = new ArrayList<>();\n            // Always sort seat IDs to prevent cross-seat deadlocks!\n            List<String> sortedSeatIds = new ArrayList<>(seatIds);\n            Collections.sort(sortedSeatIds);\n\n            for (String sid : sortedSeatIds) {\n                Seat seat = seats.get(sid);\n                if (seat != null && seat.reserveTemporary(userId, ttlMs)) {\n                    lockedSeats.add(seat);\n                } else {\n                    // One seat failed! Rollback all previously locked seats in this attempt\n                    for (Seat s : lockedSeats) s.releaseLock(userId);\n                    return false;\n                }\n            }\n            return true;\n        }\n    }\n}",
    architecture: "+-----------------------------------------------------------------------------------+\n|                        BOOKMYSHOW LOW-LEVEL CLASS DESIGN                          |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  +----------------------------+          +-------------------------------------+  |\n|  |        BookingService      |          |               Show                  |  |\n|  +----------------------------+          +-------------------------------------+  |\n|  | - shows: Map<String, Show> |--------->| - id: String                        |  |\n|  +----------------------------+          | - movie: Movie                      |  |\n|  | + reserveSeats(...)        |          | - seats: Map<String, Seat>          |  |\n|  | + confirmBooking(...)      |          +-------------------------------------+  |\n|  | + cancelReservation(...)   |                            |                      |\n|  +----------------------------+                            v                      |\n|                                          +-------------------------------------+  |\n|                                          |               Seat                  |  |\n|                                          +-------------------------------------+  |\n|                                          | - seatNumber: String                |  |\n|                                          | - status: SeatStatus                |  |\n|                                          | - lockedBy: String                  |  |\n|                                          | - lockExpiry: long                  |  |\n|                                          | - lock: ReentrantLock               |  |\n|                                          +-------------------------------------+  |\n|                                          | + tryLock(userId, ttlMs): boolean   |  |\n|                                          | + book(userId): boolean             |  |\n|                                          | + unlock(userId): void              |  |\n|                                          +-------------------------------------+  |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Designing a Movie Ticket Booking System", "url": "https://github.com", "type": "article"}],
    relatedTopics: ["redis-concurrency", "distributed-transactions", "postgres-jsonb-mvcc"],
  },

  // ===== CONSISTENT HASHING & VIRTUAL NODES =====
  'consistent-hashing': {
    id: 'consistent-hashing',
    title: "Consistent Hashing & Virtual Nodes",
    subject: "System Design",
    category: "Foundations",
    difficulty: "Advanced",
    estimatedTime: "45 min",
    tags: ["Hashing", "Distributed Cache", "Ring", "Vnodes", "Load Balancing"],
    what: "Consistent Hashing is a distributed hashing scheme that operates independently of the number of servers in a cluster. \n\nWhen a hash table is resized (servers added or removed), only $K/N$ keys need to be remapped on average (where $K$ is total keys and $N$ is total servers), unlike traditional `hash(key) % N` where almost 100% of keys are invalidated and rehashed.",
    why: "With standard modular hashing `hash(key) % N`:\n- If $N$ changes from 10 to 11 (one server added), over 91% of cached keys change their destination server.\n- This causes a catastrophic Cache Avalanche where millions of requests miss cache simultaneously and crash the primary database.\n\nConsistent hashing guarantees that adding a server only steals a slice of keys from its immediate neighbor, leaving the rest of the cluster completely untouched.",
    how: "1. **The Hash Ring**: Map both server identifiers and object keys to a circular 32-bit or 64-bit integer ring (0 to $2^{32}-1$) using MurmurHash3 or SHA-1.\n2. **Key Placement**: Hash the key to find its position on the ring. Walk clockwise until you encounter the first server node. That server is the owner of the key.\n3. **Virtual Nodes (Vnodes)**: To prevent non-uniform data distribution (hotspots), each physical server is mapped to multiple pseudo-random positions on the ring (e.g. 100 to 256 virtual nodes per physical host).",
    internals: "## Virtual Nodes & Variance Reduction\n\nWithout virtual nodes, servers end up with unequal ring partitions.\nWith $V$ virtual nodes per server:\n- Standard deviation of load across servers drops proportionally to $1/\\sqrt{V}$.\n- For $V = 100$, load variance across physical machines drops below 5%.\n- When a server fails, its keys are evenly distributed across all remaining servers rather than overloading just one neighbor.",
    realWorld: "Amazon DynamoDB, Apache Cassandra, Discord guild dispatchers, and Akamai CDN edge routers use consistent hashing rings with virtual nodes to balance petabytes of data.",
    advantages: ["Minimal key migration: only K/N keys moved during scale up or scale down", "Uniform load distribution across heterogeneous physical hardware via virtual nodes", "Zero single point of failure in ring topology"],
    disadvantages: ["Cascading failure risk if hot keys concentrate on virtual nodes of an already stressed node", "Increased memory overhead to store the sorted binary tree ring map on each client router"],
    tradeoffs: "Virtual Node Count (Memory & Routing Lookup Overhead) vs Balance Uniformity. 100-256 vnodes is the industry sweet spot.",
    alternatives: ["Rendezvous Hashing (Highest Random Weight)", "Maglev Hashing (Google)", "Bounded Load Consistent Hashing"],
    whenToUse: "Distributed caching (Memcached / Redis Cluster), sharded databases (Cassandra, DynamoDB), distributed rate limiters.",
    whenNotToUse: "Single-server databases or small static clusters where server membership never changes.",
    commonMistakes: ["Omitting virtual nodes, causing extreme data skew where one server handles 80% of cluster traffic", "Using MD5 without 64-bit space, causing hash collisions"],
    interviewQuestions: [{"q": "Why are Virtual Nodes essential in Consistent Hashing?", "a": "Without virtual nodes, physical servers hash to random locations on the ring, resulting in highly unequal partition sizes where one server may own 70% of the ring. Virtual nodes map each physical server to 100+ points on the ring, smoothing the distribution so each machine owns an equal fraction of the key space and distributing the load evenly when any node fails."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        CONSISTENT HASHING RING WITH VNODES                        |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|                                0 / 2^32                                           |\n|                            [ Node A-v1 ]                                          |\n|                       .         |         .                                       |\n|                  .              |              .                                  |\n|             [ Node C-v2 ]       |          [ Node B-v1 ]                          |\n|           .                     |                     .                           |\n|         .                       | (Clockwise Lookup)    .                         |\n|      Key \"user:987\" ------> (Walks Clockwise) ---> Lands on [ Node B-v1 ]         |\n|     .                                                     .                       |\n|    [ Node B-v2 ]                                      [ Node A-v2 ]               |\n|     .                                                     .                       |\n|       .                                                 .                         |\n|         .                                             .                           |\n|           .         [ Node C-v1 ]         [ Node B-v3 ]                           |\n|                .                       .                                          |\n|                     .             .                                               |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Dynamo: Amazon's Highly Available Key-value Store", "url": "https://www.allthingsdistributed.com", "type": "docs"}],
    relatedTopics: ["caching-strategies", "cap-pacelc", "hld-rate-limiter"],
  },

  // ===== SCALING MODELS: VERTICAL VS HORIZONTAL =====
  'scaling-models': {
    id: 'scaling-models',
    title: "Scaling Models: Vertical vs Horizontal",
    subject: "System Design",
    category: "Foundations",
    difficulty: "Beginner",
    estimatedTime: "30 min",
    tags: ["Scaling", "Scale-Up", "Scale-Out", "Hardware", "High Availability"],
    what: "Scaling is the capability of a system to handle growing workloads by adding resources.\n\n- **Vertical Scaling (Scale-Up)**: Adding more compute resources (CPU cores, RAM, NVMe SSDs) to a single existing server.\n- **Horizontal Scaling (Scale-Out)**: Adding more independent machines into a connected pool managed by a load balancer.",
    why: "Every high-scale system begins vertically and transitions horizontally. Understanding when to scale vertically vs horizontally is the most fundamental architectural decision:\n- Scaling up is instant, zero code complexity, but has an absolute hardware and financial ceiling.\n- Scaling out is theoretically infinite, fault-tolerant, but introduces distributed network complexity, partitioning, and eventual consistency.",
    how: "1. **Phase 1 (Monolith / Vertical)**: Single server with 64 vCPU, 256GB RAM, NVMe storage. Handles 5k-20k RPS easily with zero network serialization.\n2. **Phase 2 (Stateless Horizontal Web Tier + Vertical DB)**: App servers scale out behind Nginx load balancer; primary database scales up to 128 vCPU.\n3. **Phase 3 (Full Horizontal / Sharded)**: Read replicas, sharded database partitions across clusters, asynchronous messaging queues.",
    internals: "## Comparison Matrix\n\n| Metric | Vertical Scaling (Scale-Up) | Horizontal Scaling (Scale-Out) |\n| :--- | :--- | :--- |\n| **Max Capacity** | Hard hardware limit (~few TB RAM, ~128 cores) | Theoretically infinite ($N$ servers) |\n| **Downtime** | Requires server downtime to upgrade CPU/RAM | Zero downtime (rolling updates behind load balancer) |\n| **Cost Curve** | Exponential (high-end enterprise RAM/CPU is costly) | Linear (commodity cloud instances) |\n| **Complexity** | Zero architectural complexity; code runs unmodified | High: network latency, distributed transactions, split-brain |\n| **Fault Tolerance** | Single Point of Failure (SPOF) | Built-in resilience (node failures absorbed by pool) |",
    realWorld: "Stack Overflow famously ran on just a few massive vertically-scaled multi-core SQL Server bare-metal machines serving hundreds of millions of monthly pageviews, while Google and Netflix scale out across millions of commodity nodes.",
    advantages: ["Vertical: Zero IPC latency, zero distributed consensus overhead", "Horizontal: Resilient against physical hardware failure, cost-effective commodity hardware"],
    disadvantages: ["Vertical: Hard hardware boundary and high cost at the upper boundary", "Horizontal: Distributed tracing, data consistency, and network partitions"],
    tradeoffs: "Simplicity & Raw Speed (Vertical) vs Elasticity & High Availability (Horizontal). Scale stateless web tiers horizontally first, scale data tiers vertically until sharding becomes mandatory.",
    alternatives: ["Autoscaling Groups", "Serverless Functions (AWS Lambda)"],
    whenToUse: "Start every new project vertically until load demands horizontal separation.",
    whenNotToUse: "Prematurely sharding databases horizontally for low-traffic applications.",
    commonMistakes: ["Attempting to scale stateful applications horizontally without externalizing session state into Redis", "Assuming horizontal scaling automatically makes code faster (network hops introduce latency)"],
    interviewQuestions: [{"q": "What prerequisite must application servers meet before they can scale horizontally?", "a": "Application servers must be stateless. Any user session data, uploaded temporary files, or cached authentication tokens must be externalized to centralized distributed services (like Redis for sessions or Amazon S3 for file storage), so any server can handle any request identically."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        VERTICAL VS HORIZONTAL SCALING                             |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|    VERTICAL (Scale-Up)                         HORIZONTAL (Scale-Out)             |\n|                                                                                   |\n|       +--------------+                                [ Load Balancer ]           |\n|       |  BIG SERVER  |                                        |                   |\n|       |  128 vCPUs   |                      +-----------------+-----------------+ |\n|       |  1 TB RAM    |                      |                 |                 | |\n|       |  40 Gbps NIC |                      v                 v                 v |\n|       +--------------+                 [ App Node 1 ]   [ App Node 2 ]   [ App Node 3 ]\n|       (Single Box)                     (4 vCPU, 8GB)    (4 vCPU, 8GB)    (4 vCPU, 8GB)\n|       - Hard Ceiling                   - Resilient to failure                     |\n|       - Single Point of Failure        - Infinite linear expansion                |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Scale Up vs Scale Out", "url": "https://aws.amazon.com", "type": "article"}],
    relatedTopics: ["load-balancing", "cap-pacelc", "consistent-hashing"],
  },

  // ===== CLIENT-SERVER COMMUNICATION: POLLING, WEBSOCKETS, SSE & GRPC =====
  'comm-protocols': {
    id: 'comm-protocols',
    title: "Client-Server Communication: Polling, WebSockets, SSE & gRPC",
    subject: "System Design",
    category: "Foundations",
    difficulty: "Intermediate",
    estimatedTime: "45 min",
    tags: ["WebSockets", "SSE", "Long Polling", "gRPC", "Protocols"],
    what: "Modern distributed systems utilize distinct transport protocols depending on latency requirements, message directionality (simplex vs duplex), and payload efficiency.\n\nThe four primary paradigms are:\n1. **Short Polling**: Client periodically requests updates via HTTP.\n2. **Long Polling**: Server holds the HTTP request open until new data arrives or timeout occurs.\n3. **WebSockets (RFC 6455)**: Full-duplex persistent bidirectional TCP socket.\n4. **Server-Sent Events (SSE)**: Unidirectional push from server to client over standard HTTP streaming (`text/event-stream`).\n5. **gRPC / Protocol Buffers**: Binary RPC protocol running over HTTP/2 multiplexing.",
    why: "Choosing the wrong communication protocol wastes 90% of bandwidth on empty HTTP headers or crashes mobile devices due to radio battery drain.\n\n- Real-time multiplayer games or chat need bidirectional sub-millisecond WebSockets.\n- Stock tickers or LLM token streaming require simple unidirectional Server-Sent Events.\n- High-throughput internal microservice RPCs require binary serialized gRPC.",
    how: "- **WebSockets**: Begins as an HTTP/1.1 request with `Upgrade: websocket` header -> server replies HTTP 101 Switching Protocols -> socket stays open for framing.\n- **Server-Sent Events**: Client sends `Accept: text/event-stream` -> Server leaves connection open and writes text lines: `data: {\"token\": \"hello\"}\\n\\n`.\n- **gRPC**: Protobuf compiler generates client stub and server interfaces -> serializes structured binary frames over a single multiplexed HTTP/2 TCP connection.",
    internals: "## Protocol Decision Matrix\n\n| Protocol | Directionality | Transport | Header Overhead | Reconnection | Best Use Case |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Short Polling** | Unidirectional (Client pulls) | HTTP/1.1 | Massive (~1KB headers/req) | Built-in | Infrequent status checks (e.g. check order status every 30s) |\n| **Long Polling** | Emulated Duplex | HTTP/1.1 | High (headers on every cycle) | Manual in JS | Legacy fallback for environments blocking WebSockets |\n| **Server-Sent Events** | Unidirectional (Server -> Client) | HTTP/2 or 1.1 | Minimal | Automatic via browser `EventSource` | AI streaming (ChatGPT tokens), live sports scores, dashboards |\n| **WebSockets** | Full-Duplex (Bidirectional) | TCP Socket | Tiny (2-10 bytes per frame) | Must implement in app code | Collaborative docs (Google Docs), multiplayer games, chat apps |\n| **gRPC** | Bidirectional & Streaming | HTTP/2 | Micro (Protobuf binary) | Built-in client connection pool | High-throughput internal microservice-to-microservice RPCs |",
    realWorld: "ChatGPT uses Server-Sent Events (SSE) for word-by-word token streaming, WhatsApp uses WebSockets/TCP for chat, and Uber uses gRPC for high-throughput internal microservice communications.",
    advantages: ["SSE: Works natively through firewalls/proxies without special socket negotiation; automatic reconnection", "WebSockets: Lowest latency bidirectional framing for collaborative apps", "gRPC: Up to 7x faster than REST+JSON with strict schema typing"],
    disadvantages: ["WebSockets: Stateful connections complicate horizontal load balancing and failover", "gRPC: Binary payloads are not human-readable without debugging proxies"],
    tradeoffs: "WebSockets (Complex stateful connection tracking) vs SSE (Simple HTTP streaming). For server-to-client notifications or LLM streaming, SSE is significantly simpler and more resilient.",
    alternatives: ["MQTT (IoT messaging)", "WebTransport (HTTP/3 over QUIC)"],
    whenToUse: "Choose based on directionality: WebSockets for bidirectional; SSE for server push; gRPC for internal microservices; REST for public APIs.",
    whenNotToUse: "Do not use WebSockets for simple request-response CRUD APIs.",
    commonMistakes: ["Using WebSockets when unidirectional SSE would eliminate socket maintenance overhead", "Failing to implement heartbeats / ping-pong frames to detect dead WebSocket connections through NAT firewalls"],
    interviewQuestions: [{"q": "Why is Server-Sent Events (SSE) preferred over WebSockets for ChatGPT streaming responses?", "a": "LLM token generation is strictly unidirectional (the server streams tokens to the client; the client doesn't send concurrent data back on the same stream). SSE runs over standard HTTP, natively supports HTTP/2 multiplexing, traverses corporate firewalls effortlessly, and features automatic client-side reconnection via the browser's EventSource API without custom socket code."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        COMMUNICATION PROTOCOL TOPOLOGIES                          |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  1. WEBSOCKETS (Full-Duplex):                                                     |\n|     Client <================= Persistent Bidirectional Socket ===============> Server |\n|                                                                                   |\n|  2. SERVER-SENT EVENTS (Unidirectional Stream):                                   |\n|     Client <------------------ Streamed HTTP Event Push ---------------------- Server |\n|                                                                                   |\n|  3. LONG POLLING (Request / Delayed Response):                                    |\n|     Client ---- HTTP GET ----> Server holds connection open until event ---------> |\n|     Client <--- Response ----- Server responds when event occurs ---------------+ |\n|                                                                                   |\n|  4. gRPC / HTTP/2 (Multiplexed Binary Streams):                                   |\n|     Client <=== Multiplexed Binary Streams (Protobuf) over single TCP ====> Server |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "The WebSocket Protocol (RFC 6455)", "url": "https://datatracker.ietf.org/doc/html/rfc6455", "type": "docs"}],
    relatedTopics: ["hld-whatsapp", "load-balancing", "spring-security-jwt"],
  },

  // ===== TRAFFIC INGRESS: LOAD BALANCING (L4 VS L7) & REVERSE PROXIES =====
  'load-balancing': {
    id: 'load-balancing',
    title: "Traffic Ingress: Load Balancing (L4 vs L7) & Reverse Proxies",
    subject: "System Design",
    category: "Foundations",
    difficulty: "Intermediate",
    estimatedTime: "45 min",
    tags: ["Load Balancer", "Nginx", "HAProxy", "Envoy", "L4", "L7"],
    what: "A Load Balancer distributes incoming network traffic efficiently across a pool of backend servers to ensure high availability, fault tolerance, and responsiveness.\n\nLoad balancers operate at two primary layers of the OSI model:\n- **Layer 4 (Transport Layer)**: Routes traffic based on IP address and TCP/UDP port without decrypting or inspecting packet payloads (e.g. AWS NLB, IPVS).\n- **Layer 7 (Application Layer)**: Inspects HTTP headers, cookies, URLs, and JSON payloads to make intelligent routing decisions (e.g. AWS ALB, Nginx, Envoy, HAProxy).",
    why: "Without load balancing, traffic concentrates on single servers, causing outages when traffic spikes or nodes crash.\n\n1. **Failure Masking**: Automatic health checking routes traffic away from unhealthy instances in real time.\n2. **TLS Termination**: Offloads expensive SSL/TLS handshake cryptography from application servers.\n3. **Content-Based Routing**: Directs `/api/video` to streaming clusters and `/api/checkout` to transactional clusters.",
    how: "1. Client queries DNS -> resolves to Anycast Virtual IP (VIP) of the Load Balancer.\n2. Client sends TCP SYN -> Layer 4 Load Balancer distributes packet flow using consistent hashing on 5-tuple: `(src_ip, src_port, dst_ip, dst_port, protocol)`.\n3. If Layer 7: Load Balancer terminates TLS -> inspects HTTP request path (`/api/v1/users`) -> forwards request down persistent keep-alive connection to chosen backend server using Round-Robin, Least-Connections, or IP-Hash.",
    internals: "## Layer 4 vs Layer 7 Comparison\n\n| Feature | Layer 4 (Transport) | Layer 7 (Application) |\n| :--- | :--- | :--- |\n| **OSI Layer** | Layer 4 (TCP / UDP) | Layer 7 (HTTP, HTTPS, gRPC, WebSocket) |\n| **Data Visibility** | Blind to payload (packet headers only) | Inspects URLs, cookies, HTTP headers, body |\n| **TLS Decryption** | Pass-through (no decryption) | Terminates TLS at the proxy |\n| **Throughput** | Millions of packets/sec (ultra-fast) | Lower throughput due to buffer & parse overhead |\n| **Routing Flexibility**| IP and Port only | Path-based (`/auth` vs `/search`), header, cookie routing |\n| **Examples** | AWS NLB, Linux IPVS, HAProxy (TCP mode) | AWS ALB, Nginx, Envoy, Traefik, HAProxy (HTTP mode) |",
    realWorld: "Google uses Maglev (L4 network load balancer) at its edge routers to distribute terabits of incoming traffic across thousands of Envoy/BFE Layer 7 application proxy servers.",
    advantages: ["Zero downtime deployments through canary and blue-green weight adjustments", "Protection against SYN flood attacks and slowloris connection starvation", "Centralized TLS certificate management and HTTP/2 to HTTP/1.1 translation"],
    disadvantages: ["Introduces an extra network hop and potential latency if not optimized", "Layer 7 load balancers consume significant CPU for TLS decryption and header parsing"],
    tradeoffs: "L4 (Maximum throughput, zero application awareness) vs L7 (Deep routing logic, higher CPU cost). High-scale architectures use two tiers: L4 in front of L7.",
    alternatives: ["DNS Round Robin", "Client-Side Load Balancing (Netflix Ribbon / gRPC)"],
    whenToUse: "Every production web application with more than one server instance.",
    whenNotToUse: "Direct peer-to-peer applications.",
    commonMistakes: ["Using Round-Robin when request processing times vary by orders of magnitude (use Least-Connections instead)", "Not passing `X-Forwarded-For` and `X-Forwarded-Proto` headers to backend servers"],
    interviewQuestions: [{"q": "Why would an architecture use both Layer 4 and Layer 7 load balancers in sequence?", "a": "Layer 4 load balancers handle massive packet volume (millions of packets/sec) with minimal CPU usage, distributing raw TCP connections across a tier of Layer 7 proxies. The Layer 7 proxies terminate TLS, inspect HTTP paths/headers, enforce rate limits, and route to specific backend microservice clusters."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        TWO-TIER LOAD BALANCER TOPOLOGY                            |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ Internet Traffic ]                                                             |\n|         |                                                                         |\n|         v                                                                         |\n|  [ Anycast DNS / Cloudflare Edge ]                                                |\n|         |                                                                         |\n|         v                                                                         |\n|  [ Tier 1: Layer 4 Load Balancer (AWS NLB / Maglev) ]                             |\n|    - Ultra-fast packet forwarding (No TLS decrypt)                                |\n|    - Balances TCP connections across Tier 2 proxies                               |\n|         |                                                                         |\n|         +-----------------------+-----------------------+                         |\n|         |                       |                       |                         |\n|         v                       v                       v                         |\n|  [ Tier 2: Layer 7 Proxy ] [ Tier 2: Layer 7 Proxy ] [ Tier 2: Layer 7 Proxy ]    |\n|    (Nginx / Envoy)         (Nginx / Envoy)         (Nginx / Envoy)                |\n|    - Terminates TLS        - Terminates TLS        - Terminates TLS               |\n|    - Header / Path routing - Header / Path routing - Header / Path routing        |\n|    - Rate Limiting         - Rate Limiting         - Rate Limiting                |\n|         |                       |                       |                         |\n|         +-----------------------+-----------------------+                         |\n|                                 |                                                 |\n|                                 v (Private VPC Network)                           |\n|      [ Backend Microservices: Auth, Order, Payment, Catalog Clusters ]            |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Introduction to Modern Network Load Balancing and Proxying", "url": "https://blog.envoyproxy.io", "type": "article"}],
    relatedTopics: ["comm-protocols", "hld-rate-limiter", "scaling-models"],
  },

  // ===== DISTRIBUTED CACHING & INVALIDATION STRATEGIES =====
  'caching-strategies': {
    id: 'caching-strategies',
    title: "Distributed Caching & Invalidation Strategies",
    subject: "System Design",
    category: "Foundations",
    difficulty: "Intermediate",
    estimatedTime: "50 min",
    tags: ["Caching", "Cache-Aside", "Write-Through", "Write-Behind", "Eviction"],
    what: "Caching stores copies of frequently accessed data in fast in-memory storage (like Redis or Memcached) to reduce database read pressure and accelerate response times from tens of milliseconds to sub-millisecond speeds.\n\nThe two fundamental decisions are **Cache Invalidation** (how data is written) and **Cache Eviction** (which data is discarded when memory is full).",
    why: "Disk-based databases (PostgreSQL, MySQL) execute queries in 5-50ms and saturate at thousands of IOPS. In-memory caches serve queries in < 1ms and handle 100k+ operations per node.\n\nHowever, caching introduces cache stampedes, stale data bugs, and consistency challenges when updates occur.",
    how: "1. **Cache-Aside (Lazy Loading)**: Application reads from cache. On miss, reads from DB, writes to cache, and returns. On write, application updates DB and deletes (or updates) cache key.\n2. **Write-Through**: Application writes to cache; cache synchronously writes to DB before acknowledging write.\n3. **Write-Behind (Write-Back)**: Application writes to cache; cache immediately acknowledges and writes asynchronously in batches to DB.\n4. **Refresh-Ahead**: Cache automatically reloads hot keys before their TTL expires.",
    internals: "## Invalidation Strategies Comparison\n\n| Pattern | Write Latency | Consistency | Failure Risk |\n| :--- | :--- | :--- | :--- |\n| **Cache-Aside** | Fast (writes to DB, evicts key) | Eventual (read miss repopulates) | Low; stale data if eviction fails |\n| **Write-Through** | Slower (two synchronous writes) | High (cache and DB in lockstep) | If DB write fails, cache write rolls back |\n| **Write-Behind** | Blazing fast (memory write only) | Inconsistent until async flush | High: process crash before DB flush causes data loss |\n\n### Eviction Policies\n- **LRU (Least Recently Used)**: Discards items not accessed for the longest time.\n- **LFU (Least Frequently Used)**: Discards items with the lowest access counter.\n- **TTL (Time to Live)**: Automatically purges keys after a predefined lifespan.",
    realWorld: "Facebook operates the world's largest Memcached installation using Cache-Aside with leased keys to eliminate cache stampedes when millions of users view trending posts.",
    advantages: ["Sub-millisecond read latency for high-traffic data", "Shields relational databases from read query saturation", "Scales independently of database write instances"],
    disadvantages: ["Cache stampede (dog-piling) when popular keys expire", "Risk of serving stale data if cache invalidation events fail or lag"],
    tradeoffs: "Invalidating Cache Key (`DEL key`) vs Updating Cache Key (`SET key value`). Deleting the key is almost always preferred because concurrent writes can overwrite cache with stale data in out-of-order race conditions.",
    alternatives: ["Local In-Memory Cache (Caffeine)", "Distributed Cache (Redis)", "Database Query Cache"],
    whenToUse: "Read-heavy workloads (>80% reads), user sessions, catalog queries, configuration parameters.",
    whenNotToUse: "Rapidly mutating write-heavy data where cache invalidation overhead exceeds query cost.",
    commonMistakes: ["Updating the cache on write instead of invalidating (deleting) the key", "Setting the exact same TTL on millions of keys, causing all keys to expire simultaneously (Cache Avalanche)"],
    interviewQuestions: [{"q": "What is a Cache Avalanche and how do you prevent it?", "a": "A Cache Avalanche occurs when a large number of cached keys expire at the exact same moment, causing a massive wave of concurrent requests to hit the primary database simultaneously and crash it. It is prevented by adding random jitter to the TTL (e.g. `base_ttl + rand(0, 300)` seconds) so keys expire smoothly over time."}, {"q": "Why is it better to delete a cache key rather than update it during a database write?", "a": "If two concurrent threads update the same record (Thread 1 sets value A, Thread 2 sets value B), network or CPU variations can cause Thread 2 to write to DB second, but Thread 1 to update the cache second. The cache now permanently stores value A while the DB stores value B. Deleting the key ensures the next read safely repopulates the latest value from the DB."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        CACHE-ASIDE READ & WRITE PATTERNS                          |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  READ FLOW (Cache-Aside):                                                         |\n|  [ Client ] ---> 1. GET key ---> [ Redis Cache ]                                  |\n|                                         |                                         |\n|                 +-----------------------+-----------------------+                 |\n|                 | (Cache Hit)                                   | (Cache Miss)    |\n|                 v                                               v                 |\n|          Returns Value                                2. Query Primary DB         |\n|                                                                 |                 |\n|                                                                 v                 |\n|                                                       3. Write back to Redis      |\n|                                                                                   |\n|  WRITE FLOW (Safe Invalidation):                                                  |\n|  [ Client ] ---> 1. Write / Update Row ---> [ Primary Database ]                  |\n|                                                    |                              |\n|                                                    v                              |\n|                                             2. DEL cache key                      |\n|                                                (Do NOT update! Invalidate!)       |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Scaling Memcache at Facebook", "url": "https://www.usenix.org", "type": "docs"}],
    relatedTopics: ["lld-lru-cache", "redis-concurrency", "consistent-hashing"],
  },

  // ===== DISTRIBUTED TRANSACTIONS: TWO-PHASE COMMIT (2PC) VS SAGA =====
  'distributed-transactions': {
    id: 'distributed-transactions',
    title: "Distributed Transactions: Two-Phase Commit (2PC) vs Saga",
    subject: "System Design",
    category: "Foundations",
    difficulty: "Expert",
    estimatedTime: "60 min",
    tags: ["Transactions", "2PC", "Saga", "Distributed", "Consensus", "ACID"],
    what: "In a microservices architecture where each service owns its private database, transactions cannot rely on single-database ACID guarantees (`BEGIN ... COMMIT`).\n\nA distributed transaction coordinates state changes across multiple physical databases over network connections. The two primary paradigms are:\n1. **Two-Phase Commit (2PC)**: Synchronous, blocking protocol providing strict ACID consistency.\n2. **Saga Pattern**: Asynchronous, non-blocking sequence of local transactions with compensating actions providing Eventual Consistency (BASE).",
    why: "When a customer buys an item:\n- Inventory Service decrements stock\n- Payment Service charges card\n- Order Service marks order created\n- Shipping Service creates tracking label\n\nIf Payment fails after Inventory decremented, a mechanism must rollback the stock change across network boundaries.",
    how: "- **Two-Phase Commit (2PC)**:\n  - Phase 1 (Prepare): Coordinator asks all resource managers: \"Can you commit?\" Resources acquire locks and reply \"AGREE\" or \"ABORT\".\n  - Phase 2 (Commit): If all agreed, coordinator sends \"COMMIT\". If any aborted, coordinator sends \"ROLLBACK\".\n- **Saga Pattern**:\n  - Executes local transaction in Service 1 -> emits event.\n  - Service 2 consumes event -> executes local transaction.\n  - If Step 3 fails: Orchestrator triggers compensating transactions backward (e.g. `refundPayment()`, `reAddInventory()`).",
    internals: "## 2PC vs Saga Architectural Comparison\n\n| Attribute | Two-Phase Commit (2PC) | Saga Pattern |\n| :--- | :--- | :--- |\n| **Consistency** | Strict ACID (Immediate) | Eventual Consistency (BASE) |\n| **Concurrency** | Low (Holds database locks across network hops) | High (Local transactions lock only momentarily) |\n| **Availability** | Low (Blocking: crashes freeze participants) | High (Non-blocking: resilient to service failure) |\n| **Rollback Mechanism**| Native DB Undo Logs (`ROLLBACK`) | Application-level Compensating Transactions |\n| **Network Fit** | Low-latency local LAN clusters | WAN, cloud microservices, multi-region |",
    realWorld: "Financial systems (Uber, Amazon, Stripe) utilize the Saga pattern with workflow engines (Temporal / Cadence / AWS Step Functions) rather than 2PC across microservices.",
    advantages: ["Saga: Extreme throughput with zero long-held distributed database locks", "Saga: Resilient to transient network delays and service downtime", "2PC: Strict immediate consistency when required by legacy monolithic systems"],
    disadvantages: ["2PC: Complete system stall if coordinator crashes while holding locks", "Saga: Application must handle dirty reads and write complex custom compensating logic"],
    tradeoffs: "ACID / Immediate Consistency (2PC - Poor Scale) vs BASE / Eventual Consistency (Saga - High Scale). Modern cloud microservices almost universally choose the Saga Pattern.",
    alternatives: ["TCC (Try-Confirm-Cancel)", "Outbox Pattern with Eventual Sourcing"],
    whenToUse: "Saga: Distributed e-commerce checkout, food delivery, hotel booking, ride matching.",
    whenNotToUse: "2PC: Avoid over microservices; only acceptable inside tightly-coupled database clusters (e.g. CockroachDB Raft consensus).",
    commonMistakes: ["Assuming 2PC is suitable for microservices across cloud regions", "Not making Saga compensating transactions idempotent (risking double refunds on retries)"],
    interviewQuestions: [{"q": "What is the single biggest weakness of Two-Phase Commit (2PC)?", "a": "2PC is a blocking protocol. During Phase 1, every participating database acquires exclusive locks on its rows. If the central coordinator crashes before sending the Phase 2 commit/rollback message, all participants remain indefinitely locked, starving the entire database of connections and throughput."}, {"q": "How does a Saga handle a failure in step 4 of a 5-step distributed transaction?", "a": "The Saga executes compensating transactions in reverse order for steps 3, 2, and 1. For example, if Step 4 (Dispatch Courier) fails after Step 3 (Accept Order), Step 2 (Charge Payment), and Step 1 (Reserve Inventory) succeeded, the orchestrator triggers: Cancel Kitchen Order -> Issue Payment Refund -> Re-add Inventory."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        2PC VS SAGA PATTERN ARCHITECTURE                           |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  TWO-PHASE COMMIT (2PC - Synchronous & Blocking):                                 |\n|  [ Coordinator ] === 1. PREPARE ===> [ Node A (Locks) ]  [ Node B (Locks) ]       |\n|  [ Coordinator ] <== 2. AGREE/ABORT = [ Node A ]         [ Node B ]               |\n|  [ Coordinator ] === 3. COMMIT =====> [ Node A (Unlocks) [ Node B (Unlocks) ]     |\n|                                                                                   |\n|  SAGA PATTERN (Asynchronous & Compensating):                                      |\n|  [ Order Created ]                                                                |\n|        |                                                                          |\n|        v                                                                          |\n|  [ Step 1: Inventory Service ] === Succeeded ===> [ Step 2: Payment Service ]     |\n|                                                           |                       |\n|                                                           v (Payment Fails!)      |\n|  [ Compensate: Restock Inventory ] <=== Triggered ========+                       |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Saga Distributed Transactions Pattern", "url": "https://microservices.io", "type": "article"}],
    relatedTopics: ["hld-food-delivery", "cap-pacelc", "kafka"],
  },

  // ===== DATABASE SCALING: PARTITIONING, CAP & PACELC THEOREMS =====
  'cap-pacelc': {
    id: 'cap-pacelc',
    title: "Database Scaling: Partitioning, CAP & PACELC Theorems",
    subject: "System Design",
    category: "Foundations",
    difficulty: "Advanced",
    estimatedTime: "50 min",
    tags: ["CAP Theorem", "PACELC", "Sharding", "Replication", "Databases"],
    what: "The CAP Theorem and its modern extension PACELC define the fundamental trade-offs in distributed data storage systems.\n\n- **CAP Theorem (Eric Brewer)**: In any asynchronous network subject to partitions ($P$), a distributed data store can guarantee at most two of:\n  - **Consistency ($C$)**: Every read receives the most recent write or an error.\n  - **Availability ($A$)**: Every non-failing node returns a non-error response without guarantee of latest write.\n  - **Partition Tolerance ($P$)**: System continues operating despite dropped or delayed network packets.\n  *Since network partitions are physically inevitable in distributed hardware, you must choose between CP and AP.*\n\n- **PACELC Theorem (Daniel Abadi)**: If there is a **P**artition, trade off **A**vailability vs **C**onsistency; **E**lse, trade off **L**atency vs **C**onsistency.",
    why: "Networks are physically imperfect (fiber cuts, router reboots, GC pauses). When two database nodes cannot communicate across a network split:\n- If you accept writes on Node 1, Node 2 becomes inconsistent (**AP system**).\n- If you reject writes on Node 1 to prevent divergence, availability is lost (**CP system**).",
    how: "- **CP Systems (e.g. HBase, MongoDB with majority write, Spanner, ZooKeeper)**: During a partition, minority nodes reject writes or step down from leadership. Guarantees linearizability at the expense of client error spikes.\n- **AP Systems (e.g. Cassandra, DynamoDB, CouchDB)**: Both partitioned sides accept writes. Data diverges temporarily and reconciles via Last-Write-Wins (LWW) or Vector Clocks when the partition heals.",
    internals: "## PACELC Classification of Major Databases\n\n$$\\text{If } \\mathbf{P} \\implies [ \\mathbf{A} \\lor \\mathbf{C} ], \\quad \\mathbf{E} \\implies [ \\mathbf{L} \\lor \\mathbf{C} ]$$\n\n| Database | Partition Behavior | Normal Operation Behavior | PACELC Type |\n| :--- | :--- | :--- | :--- |\n| **Apache Cassandra** | Availability ($A$) | Low Latency ($L$) | **PA/EL** |\n| **Amazon DynamoDB** | Availability ($A$) | Low Latency ($L$) | **PA/EL** |\n| **MongoDB** | Consistency ($C$) | Low Latency ($L$) | **PC/EL** |\n| **Apache HBase** | Consistency ($C$) | Consistency ($C$) | **PC/EC** |\n| **Google Spanner** | Consistency ($C$) (TrueTime API) | Consistency ($C$) | **PC/EC** |\n| **PostgreSQL (Sync Rep)**| Consistency ($C$) | Consistency ($C$) | **PC/EC** |",
    realWorld: "Financial ledgers (e.g. bank accounts) choose CP/EC; social media feeds (e.g. YouTube comments, Twitter likes) choose PA/EL for instant response times.",
    advantages: ["Provides mathematical clarity for selecting databases based on business risk", "PACELC extends CAP to address normal latency trade-offs during 99.9% uptime"],
    disadvantages: ["Many developers misapply CAP to single-node databases where network partitions do not exist"],
    tradeoffs: "Consistency (Zero stale reads, potential client timeouts) vs Availability (Zero downtime, risk of stale reads or conflicting concurrent writes).",
    alternatives: ["Tunable Consistency (Cassandra `QUORUM` reads/writes: $R + W > N$)"],
    whenToUse: "Evaluating database technology for any distributed backend.",
    whenNotToUse: "Single-instance SQLite or single-node PostgreSQL where distributed networking is absent.",
    commonMistakes: ["Claiming a distributed system can achieve CA (Consistency + Availability) without Partition Tolerance (network partitions cannot be opted out of in physical reality)", "Ignoring PACELC latency costs during non-partitioned normal operations"],
    interviewQuestions: [{"q": "Why is 'CA' (Consistent and Available) impossible in real-world distributed systems?", "a": "Network partitions (P) are physical realities of hardware and networking (switch failures, fiber cuts, GC pauses). When a partition inevitably occurs, a distributed system MUST choose either to allow writes and diverge (sacrificing Consistency) or block writes (sacrificing Availability). Therefore, you can only choose CP or AP."}, {"q": "How does Tunable Consistency in Cassandra achieve strong consistency ($R + W > N$)?", "a": "If replication factor is $N=3$, choosing Write Quorum $W=2$ and Read Quorum $R=2$ guarantees that $R + W = 4 > 3$. By the Pigeonhole Principle, at least one node read during a query must overlap with the nodes written to during the last update, ensuring the latest timestamped value is always observed."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        CAP THEOREM NETWORK PARTITION SPLIT                        |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ Data Center East (Node 1) ]             [ Data Center West (Node 2) ]          |\n|  Current Value: X = 10                     Current Value: X = 10                  |\n|               |                                           |                       |\n|               +============ [ NETWORK PARTITION ] ========+                       |\n|               |        (All fiber packets dropped)        |                       |\n|               |                                           |                       |\n|  Client writes X = 20                                 Client reads X              |\n|               |                                           |                       |\n|        +------+------+                             +------+------+                |\n|        |             |                             |             |                |\n|     CHOICE A:     CHOICE B:                     CHOICE A:     CHOICE B:           |\n|    (AP System)   (CP System)                   (AP System)   (CP System)          |\n|     Accept 20     Reject write!                 Returns 10    Returns ERROR!      |\n|    (Available)   (Consistency wins)             (Stale data)  (Availability lost) |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Brewer's CAP Theorem", "url": "https://www.infoq.com", "type": "article"}],
    relatedTopics: ["consistent-hashing", "distributed-transactions", "kafka"],
  },

  // ===== SPRING BOOT LIFECYCLE & SPRING SECURITY JWT ARCHITECTURE =====
  'spring-security-jwt': {
    id: 'spring-security-jwt',
    title: "Spring Boot Lifecycle & Spring Security JWT Architecture",
    subject: "Backend",
    category: "Architecture & Frameworks",
    difficulty: "Advanced",
    estimatedTime: "50 min",
    tags: ["Spring Boot", "JWT", "Spring Security", "SecurityContext", "DispatcherServlet"],
    what: "An in-depth technical analysis of Spring Boot's internal web request lifecycle and Spring Security's stateless JSON Web Token (JWT) verification filter chain.\n\nThe architecture traces an HTTP request from initial TCP socket binding through the Tomcat embedded connector, down the `DelegatingFilterProxy` chain, through JWT cryptographic signature verification, and into the `DispatcherServlet` handler mapping pipeline.",
    why: "Stateful session-based authentication (`JSESSIONID` stored in server RAM) breaks horizontal scalability because subsequent requests from the same user must hit the same server instance (sticky sessions) or require distributed session replication.\n\nStateless JWT authentication embeds identity, roles, and cryptographic signatures directly in the `Authorization: Bearer <token>` header, allowing any backend instance to verify requests independently in under 1 millisecond without database lookups.",
    how: "1. Client sends `GET /api/v1/orders` with `Authorization: Bearer eyJhbGci...`.\n2. Request hits Spring Security's `FilterChainProxy`.\n3. Custom `JwtAuthenticationFilter` intercepts the request:\n   - Extracts and verifies HMAC-SHA256 signature using the secret key.\n   - Verifies claims: `exp` (expiration), `iss` (issuer), `sub` (username), `roles`.\n4. If valid, constructs a `UsernamePasswordAuthenticationToken` and injects it into the Thread-Local `SecurityContextHolder.getContext().setAuthentication(auth)`.\n5. Request passes to `DispatcherServlet` -> `HandlerMapping` -> `@RestController` method.\n6. Upon request completion, the thread-local context clears automatically.",
    internals: "## Spring Security Internal Filter Sequence\n\n```\n[ Inbound HTTP Request ]\n         |\n         v\n[ Tomcat Connector / Embedded Server ]\n         |\n         v\n[ DelegatingFilterProxy ]\n         |\n         v\n[ FilterChainProxy (Spring Security) ]\n    |-- 1. CorsFilter\n    |-- 2. CsrfFilter (Disabled for Stateless API)\n    |-- 3. JwtAuthenticationFilter (Custom)\n    |        |-- Validates HMAC-SHA256 / RSA signature\n    |        |-- Injects Authentication into SecurityContextHolder\n    |-- 4. UsernamePasswordAuthenticationFilter\n    |-- 5. ExceptionTranslationFilter\n    |-- 6. AuthorizationFilter (Enforces @PreAuthorize / antMatchers)\n         |\n         v\n[ DispatcherServlet ]\n         |\n         v\n[ HandlerMapping -> HandlerAdapter -> @RestController ]\n```\n\n### Thread-Local Concurrency Hazard\nBecause Spring MVC executes on a thread-per-request model, failing to clear `SecurityContextHolder` between requests results in thread-pool pollution where subsequent requests reuse credentials of a previously executed user!",
    realWorld: "High-throughput enterprise microservices (Netflix, Uber, fintech gateways) utilize Spring Boot with RSA256 asymmetric JWT verification where public keys are cached from JWKS endpoints.",
    advantages: ["Complete statelessness: zero memory or database storage cost per user session", "Horizontal scalability: any backend microservice can authenticate the user instantly", "Fine-grained role-based access control via `@PreAuthorize(\"hasRole('ADMIN')\")`"],
    disadvantages: ["Cannot immediately revoke a stolen JWT before its expiration without maintaining a token blacklist in Redis", "Token payload size: JWTs with many claims increase HTTP header overhead on every request"],
    tradeoffs: "Short-lived Access Tokens (15 min) + Refresh Tokens (7 days, stored in DB/Redis) vs Stateful Sessions. The dual-token pattern provides the security of revocation with the performance of statelessness.",
    alternatives: ["OAuth2 / OIDC Authorization Code Flow", "PASETO (Platform-Agnostic Security Tokens)", "Redis Centralized Session Store"],
    whenToUse: "REST APIs, single-page applications (React/Next.js), microservice authentication.",
    whenNotToUse: "Server-rendered monolithic MVC apps (Thymeleaf/JSP) where standard HTTP-only session cookies are simpler and more secure against XSS.",
    commonMistakes: ["Storing sensitive data (passwords, social security numbers) inside the JWT payload (payload is only Base64-encoded, not encrypted)", "Using symmetric HMAC keys shared across dozens of independent microservices instead of asymmetric RSA private/public keys"],
    interviewQuestions: [{"q": "How do you revoke a JWT before its expiration timestamp if a user logs out or is banned?", "a": "Because JWTs are self-contained and stateless, the server cannot natively revoke them. The production standard is maintaining a centralized Redis blacklist of revoked `jti` (JWT ID) tokens with a TTL equal to the token's remaining lifespan. The `JwtAuthenticationFilter` checks Redis before permitting the request."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        SPRING BOOT & JWT FILTER PIPELINE                          |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ Inbound Request ] (Header: Authorization: Bearer <JWT>)                        |\n|         |                                                                         |\n|         v                                                                         |\n|  [ DelegatingFilterProxy ]                                                        |\n|         |                                                                         |\n|         v                                                                         |\n|  [ SecurityFilterChain ]                                                          |\n|    +-- SecurityContextHolderFilter                                                |\n|    +-- CorsFilter                                                                 |\n|    +-- [ Custom JwtAuthenticationFilter ]                                         |\n|    |      |-- Parse Claims (HMAC256 / RSA)                                        |\n|    |      |-- Check Expiry                                                        |\n|    |      +-- Populate: SecurityContextHolder.getContext().setAuthentication(...) |\n|    +-- AuthorizationFilter (Checks @PreAuthorize(\"hasRole('ADMIN')\"))            |\n|         |                                                                         |\n|         v                                                                         |\n|  [ DispatcherServlet ]                                                            |\n|    +-- HandlerMapping (Finds Controller by URL)                                   |\n|    +-- HandlerInterceptor (preHandle / postHandle)                                |\n|    +-- RestController Method Execution                                            |\n|         |                                                                         |\n|         v                                                                         |\n|  [ ThreadLocal Context Cleared on Exit ]                                          |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Spring Security Architecture Guide", "url": "https://spring.io/guides/topicals/spring-security-architecture", "type": "docs"}],
    relatedTopics: ["redis-concurrency", "postgres-jsonb-mvcc", "comm-protocols"],
  },

  // ===== POSTGRESQL INTERNALS: B+TREE, MVCC & JSONB DECOMPOSITION =====
  'postgres-jsonb-mvcc': {
    id: 'postgres-jsonb-mvcc',
    title: "PostgreSQL Internals: B+Tree, MVCC & JSONB Decomposition",
    subject: "Backend",
    category: "Architecture & Frameworks",
    difficulty: "Advanced",
    estimatedTime: "50 min",
    tags: ["PostgreSQL", "JSONB", "MVCC", "B-Tree", "GIN Index", "Database Internals"],
    what: "An exhaustive deep dive into PostgreSQL's internal storage engine, Multi-Version Concurrency Control (MVCC), B+Tree index structures, and the binary decomposition architecture of `JSONB`.\n\nPostgreSQL bridges the relational and document database worlds by allowing schemaless nested JSON structures to be queried with GIN (Generalized Inverted Index) acceleration at relational speeds.",
    why: "Storing unstructured or dynamic schema data in traditional relational tables requires frequent schema migrations or inefficient EAV (Entity-Attribute-Value) anti-patterns.\n\n1. **JSON vs JSONB**: `json` stores exact raw text (requires re-parsing on every query); `jsonb` stores parsed binary format (slower write, instant indexable reads).\n2. **MVCC (Multi-Version Concurrency Control)**: Readers never block writers, and writers never block readers.\n3. **GIN Indexing**: Enables indexing individual keys, nested objects, and arrays inside JSON documents.",
    how: "- **MVCC Mechanics**: Updates do not overwrite rows in-place. PostgreSQL marks the old row as dead (sets `xmax` transaction ID) and inserts a brand new row version (with `xmin`). VACUUM reclaims dead tuples later.\n- **JSONB Binary Format**: Decomposes JSON into a header, offset table, and typed values. Looking up `payload->'user'->>'id'` jumps directly to the byte offset in O(1) time without parsing the document string.\n- **GIN Indexing**: `CREATE INDEX idx_user_meta ON users USING gin (metadata jsonb_path_ops);` decomposes keys and values into an inverted index.",
    internals: "## JSON vs JSONB Storage Representation\n\n| Feature | `json` Type | `jsonb` Type |\n| :--- | :--- | :--- |\n| **Storage Format** | Exact raw text copy (preserves whitespace & key ordering) | Parsed binary decomposed format (de-duplicated keys, sorted) |\n| **Ingestion Speed** | Faster (no syntax tree parsing) | Slightly slower (parses and normalizes binary tree) |\n| **Query Speed** | Slow: re-parses text on every read | Blazing fast: jumps directly to binary byte offsets |\n| **Indexing Support**| Expression indexes only | Full GIN (Generalized Inverted Index) acceleration |\n| **Use Case** | Raw audit logs where exact formatting matters | Production querying, filtering, and indexing |",
    realWorld: "GitLab, Instagram, and modern SaaS platforms store dynamic tenant preferences and extensible event metadata inside PostgreSQL `jsonb` columns indexed by GIN, achieving MongoDB-like flexibility with PostgreSQL ACID transactions.",
    advantages: ["Combines relational foreign keys and ACID transactions with flexible NoSQL documents", "Sub-millisecond query performance on nested JSON properties via GIN indexes", "MVCC ensures readers never wait for long-running batch update locks"],
    disadvantages: ["Write amplification: updates to small fields rewrite the entire 8KB heap tuple", "Requires active `VACUUM` tuning to prevent table bloat from dead tuples"],
    tradeoffs: "Relational Columns vs JSONB Document. Pure relational columns are faster and consume less disk space; JSONB is chosen when schemas are dynamic, user-customizable, or deeply hierarchical.",
    alternatives: ["MongoDB (NoSQL Document Store)", "MySQL JSON column", "Elasticsearch"],
    whenToUse: "User preferences, dynamic e-commerce product attributes, audit logs, extensible metadata.",
    whenNotToUse: "Static schemas where fixed types (`INTEGER`, `VARCHAR`) and standard foreign keys should be strictly enforced.",
    commonMistakes: ["Using the `json` type instead of `jsonb` in production environments", "Failing to add a GIN index when executing `@>` (contains) queries on large tables"],
    interviewQuestions: [{"q": "Why does an `UPDATE` in PostgreSQL create a dead tuple, and how does MVCC handle it?", "a": "PostgreSQL implements MVCC by creating a new version of the row on every update rather than modifying the data in-place. The old row's `xmax` is set to the current transaction ID, making it invisible to newer transactions while remaining visible to ongoing older transactions. The `VACUUM` daemon reclaims dead row space once no active transaction needs it."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        POSTGRESQL MVCC & JSONB INTERNALS                          |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  POSTGRESQL HEAP PAGE (8 KB Block):                                               |\n|  +-----------------------------------------------------------------------------+  |\n|  | Page Header | Item Pointers [P1, P2, P3] ...                                 |  |\n|  |-----------------------------------------------------------------------------|  |\n|  | Tuple 1 (Version 1): [xmin=100, xmax=105 (Dead)] -> Data: {\"role\": \"user\"}   |  |\n|  | Tuple 2 (Version 2): [xmin=105, xmax=0   (Live)] -> Data: {\"role\": \"admin\"}  |  |\n|  +-----------------------------------------------------------------------------+  |\n|                                                                                   |\n|  JSONB BINARY ENCODING LAYOUT:                                                    |\n|  +-----------------------------------------------------------------------------+  |\n|  | Container Header | Entry Count: 2 | Offsets Table: [Key1: 0x08, Key2: 0x14] |  |\n|  | Data Section: \"role\": string(\"admin\"), \"tier\": int(2)                       |  |\n|  +-----------------------------------------------------------------------------+  |\n|  (Direct offset lookup: O(1) access to 'tier' without scanning 'role')           |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "PostgreSQL: Documentation on JSON Types", "url": "https://www.postgresql.org/docs/current/datatype-json.html", "type": "docs"}],
    relatedTopics: ["spring-security-jwt", "redis-concurrency", "cap-pacelc"],
  },

  // ===== REDIS INTERNALS: EVENT LOOP, CONCURRENCY & REDLOCK =====
  'redis-concurrency': {
    id: 'redis-concurrency',
    title: "Redis Internals: Event Loop, Concurrency & Redlock",
    subject: "Backend",
    category: "Architecture & Frameworks",
    difficulty: "Advanced",
    estimatedTime: "50 min",
    tags: ["Redis", "Event Loop", "Redlock", "Distributed Lock", "Concurrency", "I/O Multiplexing"],
    what: "An exhaustive investigation into Redis's single-threaded event loop architecture, I/O multiplexing (epoll/kqueue), memory data structures, and the Redlock distributed locking algorithm.\n\nRedis achieves over 100,000 Operations Per Second (OPS) on a single core because it executes commands sequentially in memory without context switching, thread contention, or mutex locks.",
    why: "Developers often mistakenly believe multithreading is required for high throughput. \n\n1. **Single-Threaded Command Execution**: By running all commands in memory on a single thread, Redis eliminates locks, race conditions, and thread context switches.\n2. **I/O Multiplexing (`epoll`)**: A single thread monitors thousands of client sockets simultaneously, handling reads and writes only when sockets are ready.\n3. **Atomic Primitives**: Commands like `INCR`, `SETNX`, and embedded Lua scripts execute atomically without interference.",
    how: "- **Socket Event Ingress**: The OS kernel notifies Redis via `epoll_wait()`. The Redis event loop dispatches events to file event handlers.\n- **Distributed Locking (Redlock)**:\n  1. Client acquires current timestamp $T_1$.\n  2. Tries to acquire lock on $N$ independent Redis master nodes (typically 5) using `SET resource_name my_random_value NX PX 30000`.\n  3. If acquired on majority ($> N/2 = 3$) nodes within valid lease time: Lock acquired!\n  4. To release: Evaluates a Lua script that checks if random value matches before deleting.",
    internals: "## Redlock Safe Unlock Lua Script\n\nReleasing a lock must check that the client still owns it (preventing releasing a lock after timeout):\n```lua\nif redis.call(\"get\", KEYS[1]) == ARGV[1] then\n    return redis.call(\"del\", KEYS[1])\nelse\n    return 0\nend\n```\n\n### Redis Memory Data Structures:\n- **String**: Simple Dynamic String (SDS) with pre-allocated buffer and O(1) length.\n- **Hash / Sorted Set**: Small collections use memory-efficient **ZipList / Listpack**; large collections upgrade to **HashTable** and **SkipList** ($O(\\log N)$ search/insertion).",
    realWorld: "GitHub uses Redis for high-speed background job queuing (Resque), and Twitter uses Redis clusters to hold user home timelines in memory.",
    advantages: ["Zero multi-threaded lock contention or deadlock risk on standard commands", "Sub-millisecond latency for in-memory operations", "Rich built-in primitives: Hashes, Bitmaps, HyperLogLogs, Geospatial, Streams"],
    disadvantages: ["Any single slow O(N) command (like `KEYS *` or huge `HGETALL`) blocks the entire server for all clients", "Constrained by available physical RAM capacity"],
    tradeoffs: "In-Memory Speed vs Durability. Redis provides RDB snapshots (point-in-time) and AOF (Append-Only File) logging, trading disk I/O performance against recovery precision.",
    alternatives: ["Memcached", "Aerospike", "KeyDB (Multithreaded Redis fork)"],
    whenToUse: "Session storage, distributed rate limiting, leaderboards, real-time counters, pub/sub.",
    whenNotToUse: "Massive cold storage (terabytes of archival data that exceed RAM capacity).",
    commonMistakes: ["Running `KEYS *` in a production environment, freezing the server for seconds or minutes", "Using non-atomic lock acquisition without `NX PX` flags"],
    interviewQuestions: [{"q": "Why is Redis single-threaded, and how does it still achieve 100k+ requests per second?", "a": "Because CPU is rarely the bottleneck for in-memory caches\u2014memory bandwidth and network I/O are. By avoiding multi-threaded mutexes and locks, Redis eliminates thread synchronization overhead and context switches. It leverages OS non-blocking I/O multiplexing (epoll) to service thousands of concurrent sockets on a single thread."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        REDIS SINGLE-THREADED EVENT LOOP                           |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ Client Socket 1 ]  [ Client Socket 2 ]  [ Client Socket 3 ]                    |\n|           |                 |                   |                                 |\n|           +-----------------+-------------------+                                 |\n|                             |                                                     |\n|                             v                                                     |\n|             [ I/O Multiplexing: epoll / kqueue ]                                  |\n|                             |                                                     |\n|                             v (Socket Ready Events)                               |\n|                  [ Event Demultiplexer Queue ]                                    |\n|                             |                                                     |\n|                             v                                                     |\n|             +-------------------------------+                                     |\n|             |  Single-Threaded Event Loop   |                                     |\n|             |  1. Read Request Frame        |                                     |\n|             |  2. Execute Command in Memory |                                     |\n|             |  3. Write Response Buffer     |                                     |\n|             +-------------------------------+                                     |\n|                             |                                                     |\n|                             v                                                     |\n|  [ In-Memory Hash Tables / SkipLists / SDS Buffers (Zero Mutex Locking!) ]         |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Distributed Locks with Redis", "url": "https://redis.io/docs/manual/patterns/distributed-locks/", "type": "docs"}],
    relatedTopics: ["hld-rate-limiter", "caching-strategies", "lld-lru-cache"],
  },

  // ===== AGENTIC LLM ARCHITECTURES: PLANNER-EXECUTOR-REFLECTOR =====
  'agentic-llm': {
    id: 'agentic-llm',
    title: "Agentic LLM Architectures: Planner-Executor-Reflector",
    subject: "AI",
    category: "GenAI & Agents",
    difficulty: "Expert",
    estimatedTime: "60 min",
    tags: ["AI Agents", "ReAct", "Reflection", "LLM", "Tool Calling", "Autonomous Systems"],
    what: "Agentic LLM Architectures extend static text-generation foundation models into autonomous, goal-driven agents capable of multi-step problem solving, external tool execution, state memory management, and self-correction.\n\nThe standard industry paradigm is the **Planner-Executor-Reflector Loop** (also known as Plan-and-Solve or ReAct with Reflection).",
    why: "Standard LLM prompting suffers from hallucination, lack of access to real-time tools/APIs, and catastrophic failure on complex multi-step reasoning tasks.\n\n1. **Planner**: Deconstructs high-level ambiguous goals into structured DAG sub-tasks.\n2. **Executor**: Executes individual sub-tasks by calling external APIs, SQL queries, or bash scripts.\n3. **Reflector (Critic)**: Evaluates execution output against constraints; triggers corrective loops if outputs are invalid or incomplete.",
    how: "1. **Goal Ingestion**: User prompts: \"Analyze Q3 sales drop and email executive summary to CFO.\"\n2. **Planning Phase**: Planner LLM generates JSON plan:\n   - Task 1: Query PostgreSQL `sales` table for Q2 vs Q3 revenue deltas.\n   - Task 2: Call Python sandbox to generate delta visualization chart.\n   - Task 3: Draft summary report.\n   - Task 4: Call SendGrid API.\n3. **Execution Phase**: Executor calls Tool Broker -> runs SQL query -> retrieves data.\n4. **Reflection Phase**: Reflector inspects SQL result. If empty or erroneous, diagnoses error and commands Planner to re-generate query with adjusted schema.",
    internals: "## The ReAct + Reflection State Machine\n\n```\n[ User Goal ]\n      |\n      v\n+------------------+\n|  Planner Agent   | <-------------------------+\n+------------------+                           |\n      | (Generates Task Plan)                  |\n      v                                        | (Corrective Feedback Loop)\n+------------------+                           |\n|  Executor Agent  |                           |\n+------------------+                           |\n      | (Calls External Tool)                  |\n      v                                        |\n[ Tool Execution: SQL / Bash / API ]           |\n      | (Raw Tool Output)                      |\n      v                                        |\n+------------------+                           |\n| Reflector Agent  | ---> [ Quality / Error? ]-+\n+------------------+        (Self-Healing Loop)\n      |\n      v (Goal Satisfied)\n[ Final Verified Response ]\n```",
    realWorld: "Google Antigravity, Devin, Cursor, and enterprise customer-service copilots use multi-agent Planner-Executor-Reflector architectures to write code, debug terminal outputs, and execute complex workflows.",
    advantages: ["Autonomous self-healing: automatically fixes syntax errors and query mistakes", "Multi-step reasoning capabilities far exceeding single-turn prompting", "Real-world agency through sandboxed API and tool execution"],
    disadvantages: ["High token consumption and latency (multiple LLM calls per task)", "Risk of infinite loops if reflection criteria are ambiguous"],
    tradeoffs: "ReAct (Interleaved Thought-Action-Observation) vs Plan-and-Solve (Upfront Plan). Plan-and-Solve reduces token cost by generating an entire sequence at once; ReAct handles unexpected intermediate tool outcomes better.",
    alternatives: ["ReAct (Reason + Act)", "Reflexion", "Tree of Thoughts (ToT)", "AutoGPT"],
    whenToUse: "Autonomous coding assistants, multi-step customer research, complex data analysis workflows.",
    whenNotToUse: "Simple factual Q&A or low-latency autocomplete (<200ms) where multi-step loops introduce unacceptable delay.",
    commonMistakes: ["Allowing unbounded reflection loops without a hard iteration cap (causing runaway OpenAI API bills)", "Executing LLM-generated code directly on host machines without sandboxed Docker containers"],
    interviewQuestions: [{"q": "How does the Reflector agent prevent an LLM from hallucinating that a task was completed?", "a": "The Reflector evaluates objective ground truth from tool execution outputs (e.g. HTTP status codes, unit test exit codes, schema validation) rather than the LLM's own subjective claims. If a bash command exits with code 1, the Reflector intercepts the stderr message and forces the Planner to re-attempt the task."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        AGENTIC LLM ARCHITECTURE TOPOLOGY                          |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ User Instruction ]                                                             |\n|         |                                                                         |\n|         v                                                                         |\n|  [ Agent Orchestrator (LangGraph / Autogen) ]                                     |\n|    |                                                                              |\n|    +---> [ Memory Tier: Short-Term Context + Long-Term Vector DB (Pinecone) ]     |\n|    |                                                                              |\n|    +---> [ Step 1: Planner ]                                                      |\n|    |        - System Prompt: Chain of Thought                                     |\n|    |        - Decomposes goal into ordered DAG tasks                              |\n|    |                                                                              |\n|    +---> [ Step 2: Executor ]                                                     |\n|    |        - Tool Calling Schema (JSON Schema definitions)                       |\n|    |        - Sandboxed Tool Runtime (Docker / e2b)                               |\n|    |                                                                              |\n|    +---> [ Step 3: Reflector / Critic ]                                           |\n|             - Evaluates: Did tool output satisfy requirements?                    |\n|             - If NO: Rewrites prompt & loops back to Step 1 (Max 5 iterations)    |\n|             - If YES: Synthesizes final response                                  |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "Reflexion: Language Agents with Verbal Reinforcement Learning", "url": "https://arxiv.org/abs/2303.11366", "type": "docs"}],
    relatedTopics: ["rag", "computer-vision-anpr", "comm-protocols"],
  },

  // ===== EDGE COMPUTER VISION: AUTOMATED NUMBER PLATE RECOGNITION (ANPR) =====
  'computer-vision-anpr': {
    id: 'computer-vision-anpr',
    title: "Edge Computer Vision: Automated Number Plate Recognition (ANPR)",
    subject: "AI",
    category: "Computer Vision",
    difficulty: "Advanced",
    estimatedTime: "50 min",
    tags: ["Computer Vision", "YOLO", "OCR", "Edge AI", "ANPR", "OpenCV"],
    what: "A complete multi-stage computer vision engineering pipeline for Automated Number Plate Recognition (ANPR) deployed on edge IoT hardware (Nvidia Jetson, Raspberry Pi) and cloud video ingestion servers.\n\nThe pipeline processes high-frame-rate RTSP video streams from surveillance cameras, detects moving vehicles, isolates license plates, corrects perspective distortion, and runs optical character recognition in under 50 milliseconds.",
    why: "Running full-frame OCR directly on 4K camera frames is computationally impossible at 30 FPS and yields poor accuracy due to background noise, motion blur, and angled cameras.\n\n1. **Multi-Stage Cascade**: Vehicle Detection (YOLO) -> License Plate Localization (YOLO-nano) -> Perspective Transformation -> OCR (DBNet / CRNN).\n2. **Edge Acceleration**: TensorRT / ONNX Runtime execution on embedded GPUs.\n3. **Regex Post-Processing**: Cleans and validates extracted strings against regional alphanumeric registration formats.",
    how: "1. **Frame Capture**: Ingest RTSP stream -> decode frame via hardware H.264 decoder in OpenCV.\n2. **Object Detection**: Run YOLOv8 on downscaled 640x640 frame to detect bounding box of vehicle and license plate.\n3. **Warp Perspective Transformation**: Detect 4 corner points of license plate -> apply homography transform to de-skew plate into flat rectangle.\n4. **Character Recognition**: Feed cropped, normalized plate into lightweight OCR engine -> output text.\n5. **Post-Processing**: Apply regex (e.g. `^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$`) -> publish event to Kafka.",
    internals: "## ANPR Vision Cascade Pipeline\n\n```\n[ RTSP Camera Stream (1080p @ 30 FPS) ]\n                 |\n                 v\n   [ Frame Preprocessing (OpenCV) ]\n   (Grayscale conversion, Gaussian blur, resizing)\n                 |\n                 v\n   [ Stage 1: Vehicle & Plate Detection ]\n   (YOLOv8-nano / ONNX Runtime: Bounding Box [x, y, w, h])\n                 |\n                 v\n   [ Stage 2: Geometric Rectification ]\n   (Perspective Warp & De-skewing)\n                 |\n                 v\n   [ Stage 3: OCR Text Extraction ]\n   (PaddleOCR / EasyOCR / CRNN)\n                 |\n                 v\n   [ Stage 4: Regional Regex Verification ]\n   (Validates format: e.g. \"DL 01 AB 1234\")\n                 |\n                 v\n   [ Event Emitted to Kafka / IoT Gateway ]\n```",
    realWorld: "Smart toll booths (FASTag / E-ZPass), automated parking garages, and highway traffic enforcement systems process millions of license plates daily with >98% accuracy.",
    advantages: ["Sub-50ms latency allows real-time barrier gate opening without vehicle stopping", "Edge processing avoids streaming raw 4K video over cellular WAN to cloud servers", "High accuracy through cascading isolation rather than full-frame OCR"],
    disadvantages: ["Degraded performance under extreme rain, night glare, or mud-obscured plates", "Regional plate variations require localized model retraining"],
    tradeoffs: "Edge Compute (Jetson GPU Hardware Cost, Zero Bandwidth) vs Cloud Compute (Cheap Cameras, Massive Cellular Bandwidth Egress Costs). Edge processing is the industry standard for ANPR.",
    alternatives: ["RFID Transponders (FASTag)", "Cloud Vision API (Google / AWS)"],
    whenToUse: "Automated parking lots, smart toll booths, traffic enforcement, vehicle access control.",
    whenNotToUse: "General document scanning where standard Tesseract or cloud OCR suffices.",
    commonMistakes: ["Running OCR on the full raw camera frame without first cropping the localized plate bounding box", "Skipping perspective de-skewing, which causes OCR to misread angled characters"],
    interviewQuestions: [{"q": "Why is a perspective transformation necessary before passing the license plate image to the OCR model?", "a": "Surveillance cameras are typically mounted high up on poles or toll gantries, creating an acute angle with the vehicle. Characters on the plate appear trapezoidal and skewed. A perspective transform (homography) mathematically straightens the 4 corners of the plate into an un-skewed rectangular image, dramatically boosting OCR character recognition accuracy."}],
    architecture: "+-----------------------------------------------------------------------------------+\n|                        EDGE ANPR COMPUTER VISION ARCHITECTURE                     |\n+-----------------------------------------------------------------------------------+\n|                                                                                   |\n|  [ IP Surveillance Camera ]                                                       |\n|        |                                                                          |\n|        v (RTSP Stream over H.264)                                                 |\n|  [ Edge Gateway (Nvidia Jetson / TensorRT) ]                                      |\n|    +-- Hardware Video Decoder (NVDEC)                                             |\n|    +-- YOLOv8 Detector (Plate Bounding Box Inference: ~15ms)                      |\n|    +-- Homography Perspective Transform (Straightens tilted plates: ~2ms)         |\n|    +-- Lightweight Text Recognizer (CRNN: ~18ms)                                  |\n|    +-- Regex Sanitizer & Confidence Scorer                                        |\n|         |                                                                         |\n|         v (JSON Metadata: {plate: \"MH12DE1433\", confidence: 0.96})                |\n|  [ Cloud Ingestion API / Kafka ]                                                  |\n|         |                                                                         |\n|         v                                                                         |\n|  [ Parking Management System (System 12) / Toll Booth Billing DB ]                |\n|                                                                                   |\n+-----------------------------------------------------------------------------------+",
    resources: [{"title": "OpenCV ANPR Tutorial", "url": "https://pyimagesearch.com", "type": "article"}],
    relatedTopics: ["lld-parking-lot", "agentic-llm", "kafka"],
  },
};

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
