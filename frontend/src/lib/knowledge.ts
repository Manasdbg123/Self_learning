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
      { id: 'oop', name: 'OOP', topicIds: ['solid-principles'] },
      { id: 'dsa', name: 'Data Structures', topicIds: [] },
    ],
  },
  {
    id: 'system-design',
    name: 'System Design',
    description: 'HLD, LLD, Scalability, Architecture Patterns',
    icon: '🏗️',
    color: 'from-blue-500 to-indigo-600',
    categories: [
      { id: 'hld', name: 'High Level Design', topicIds: ['hld-url-shortener'] },
      { id: 'lld', name: 'Low Level Design', topicIds: ['lld-parking-lot'] },
    ],
  },
  {
    id: 'backend',
    name: 'Backend Engineering',
    description: 'Spring, Kafka, Redis, Microservices, Docker, K8s',
    icon: '⚙️',
    color: 'from-green-500 to-emerald-600',
    categories: [
      { id: 'messaging', name: 'Messaging', topicIds: ['kafka'] },
    ],
  },
  {
    id: 'ai',
    name: 'AI / ML',
    description: 'Machine Learning, Deep Learning, GenAI, RAG, Agents',
    icon: '🤖',
    color: 'from-purple-500 to-violet-600',
    categories: [
      { id: 'genai', name: 'Generative AI', topicIds: ['rag'] },
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
