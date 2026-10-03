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
  alternatives?: string[];
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
  // ===== BACKEND ENGINEERING: NETWORK LAYER FUNDAMENTALS =====
  'backend-networking': {
    id: 'backend-networking',
    title: 'Network Layer Fundamentals & The Web Request Lifecycle',
    subject: 'Backend Engineering',
    category: 'Backend',
    difficulty: 'Intermediate',
    estimatedTime: '50 min',
    tags: ['networking', 'DNS', 'TLS', 'HTTP', 'CDN', 'WAF'],
    what: 'Backend systems are anchored to the physical and transport boundaries of the internet. A complete web request travels from client hardware through DNS resolution, CDN edge nodes, WAF/DDoS scrubbing, a reverse proxy/load balancer, TLS termination, an ingress gateway, JWT auth middleware, rate limiting, and finally to the application thread. Engineers must trace every hop to diagnose latency bottlenecks, TCP window starvation, and TLS negotiation failures.',
    why: 'Understanding the full network path is essential for diagnosing p99 latency issues, configuring TLS correctly, choosing CDN strategies, and designing resilient infrastructure. Without this knowledge, engineers cannot explain why a service is slow or properly secure network traffic.',
    how: '## DNS Resolution Pipeline\nThe browser checks its local cache and /etc/hosts first, then queries a Recursive Resolver (ISP or public: 1.1.1.1, 8.8.8.8). The resolver traverses the DNS hierarchy: Root DNS (.) → TLD (.com) → Authoritative Nameserver.\n\n**Anycast Routing:** Multiple servers globally share identical BGP IP addresses, routing client traffic to the nearest geographic topological node — enabling sub-10ms DNS for global users.\n\n## TLS Security\n**TLS 1.2:** Requires 2 Round Trips (2-RTT) to exchange cipher suites, negotiate keys via Diffie-Hellman, and verify certificates.\n**TLS 1.3:** Mandates Ephemeral Diffie-Hellman; drops round-trip latency to 1-RTT and supports 0-RTT session resumption for returning users.\n**Forward Secrecy:** Even if the server private key is compromised, historic traffic captures cannot be retroactively decrypted because session keys are ephemeral.',
    internals: '## Infrastructure Rule\nIn modern high-throughput architectures, public client connections negotiate HTTP/3 or HTTP/2 at an edge proxy (Cloudflare, AWS CloudFront, Nginx), which terminates TLS and proxies traffic over persistent internal HTTP/2 or gRPC keep-alive connections to upstream services.\n\n## Request Lifecycle Stages\n1. Client sends request\n2. Local DNS cache check + OS /etc/hosts\n3. Recursive Resolver lookup\n4. Anycast DNS traversal (Root → TLD → Authoritative)\n5. CDN edge hit/miss decision\n6. WAF DDoS scrubbing + firewall rules\n7. Load Balancer / Reverse Proxy\n8. TLS termination (0-RTT or 1-RTT)\n9. JWT Auth + Rate Limit middleware\n10. Path routing and CORS\n11. DB pool + cache engine\n12. Application business logic',
    realWorld: 'Cloudflare handles DNS + CDN + WAF for millions of domains simultaneously using Anycast. AWS CloudFront terminates TLS at edge PoPs globally before routing to origin. Major banks require TLS 1.3 with forward secrecy to meet compliance requirements (PCI-DSS). Google has moved entirely to HTTP/3 (QUIC) for its properties.',
    advantages: [
      'Anycast routes users to the nearest server automatically, reducing latency',
      'TLS 1.3 reduces handshake from 2-RTT to 1-RTT, with 0-RTT for returning clients',
      'CDN edge caching absorbs 80-95% of traffic before it reaches the origin server',
      'WAF and DDoS scrubbing protect the origin from volumetric attacks'
    ],
    disadvantages: [
      '0-RTT in TLS 1.3 is vulnerable to replay attacks and must be used carefully for idempotent operations only',
      'Anycast can cause routing loops during BGP instability',
      'CDN misconfiguration can lead to stale data being served globally',
      'Deep DNS TTL caching makes failover and blue-green deployments slower'
    ],
    tradeoffs: 'More network hops (CDN, WAF, LB) add baseline latency (5-30ms) but massively improve resilience and security. TLS 1.3 0-RTT improves latency but introduces replay attack surface. Anycast improves geographic latency but complicates DDoS attribution.',
    alternatives: ['Cloudflare / CloudFront CDN edge routing', 'Direct origin hosting (no CDN/WAF proxy)', 'AWS Route53 Latency-Based Routing', 'Service Mesh (Istio / Envoy mTLS)'],
    whenToUse: 'Always — every production backend must understand and configure the full network path correctly. Especially important when designing multi-region systems, configuring CDN caching rules, or debugging latency spikes.',
    whenNotToUse: 'Skip CDN for internal microservice-to-microservice traffic on a private VPC — add latency without benefit. Do not use 0-RTT TLS for state-mutating (POST/DELETE) requests.',
    commonMistakes: [
      'Forgetting to set Strict-Transport-Security (HSTS) headers, allowing downgrade attacks from HTTPS to HTTP',
      'Using SHA-1 or RSA-2048 certificates instead of ECDSA with TLS 1.3',
      'Not configuring CDN cache-control headers correctly, causing private user data to be cached publicly',
      'Allowing wildcard CORS (Access-Control-Allow-Origin: *) on APIs that handle authenticated requests'
    ],
    interviewQuestions: [
      { q: 'What is the difference between TLS 1.2 and TLS 1.3? Why does 1.3 matter for backend performance?', a: 'TLS 1.2 requires 2 Round Trips (2-RTT) to complete the handshake — exchanging cipher suites, negotiating a session key via Diffie-Hellman, and verifying certificates. TLS 1.3 mandates Ephemeral Diffie-Hellman and streamlines the handshake to 1-RTT, halving connection setup time. It also supports 0-RTT session resumption for returning clients. Critically, TLS 1.3 provides Forward Secrecy — session keys are ephemeral, so a future compromise of the server\'s long-term private key cannot retroactively decrypt previously captured traffic.' },
      { q: 'How does Anycast DNS routing work and what problem does it solve?', a: 'Anycast assigns the same IP address to multiple geographically distributed servers simultaneously. BGP routing directs incoming packets to the topologically nearest server. This means a DNS query from Mumbai is answered by a Mumbai PoP, not a US data center. It solves geographic latency (reduces DNS resolution from 100ms to <10ms) and provides DDoS resilience — volumetric attacks are absorbed and distributed across many PoPs rather than overwhelming a single origin.' },
      { q: 'Why does infrastructure terminate TLS at an edge proxy rather than at the application server?', a: 'TLS termination at the edge (Nginx, Cloudflare, AWS ALB) offloads CPU-intensive cryptographic operations from application servers, which can then focus on business logic. It centralizes certificate management and renewal (Let\'s Encrypt / AWS ACM). Internal traffic between the LB and app servers can use mutual TLS (mTLS) or unencrypted HTTP/2 on private VPC networks, reducing overhead while maintaining security boundaries.' }
    ],
    resources: [
      { title: 'High Performance Browser Networking — Ilya Grigorik', url: 'https://hpbn.co', type: 'book', author: 'Ilya Grigorik' },
      { title: 'Cloudflare Learning Center — DNS', url: 'https://www.cloudflare.com/learning/dns/', type: 'docs' },
      { title: 'TLS 1.3 — RFC 8446', url: 'https://datatracker.ietf.org/doc/html/rfc8446', type: 'docs' }
    ],
    relatedTopics: ['backend-http-protocols', 'backend-caching', 'backend-security'],
  },

  // ===== BACKEND: HTTP PROTOCOLS =====
  'backend-http-protocols': {
    id: 'backend-http-protocols',
    title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3 & WebSockets',
    subject: 'Backend Engineering',
    category: 'Backend',
    difficulty: 'Intermediate',
    estimatedTime: '45 min',
    tags: ['HTTP', 'HTTP/2', 'HTTP/3', 'QUIC', 'WebSockets', 'multiplexing'],
    what: 'HTTP has evolved from the text-based, single-request-per-connection HTTP/1.1, through binary-framed multiplexed HTTP/2, to the UDP-based QUIC-powered HTTP/3. Each generation solves specific bottlenecks of the previous. WebSockets provide a separate full-duplex persistent connection model for real-time bidirectional communication. Choosing the right protocol fundamentally affects throughput, latency, and infrastructure design.',
    why: 'HTTP/1.1 Head-of-Line blocking severely limits throughput — browsers compensate by opening 6 parallel TCP sockets per domain, multiplying connection overhead. HTTP/2 solves application-layer HoL blocking but TCP\'s single stream still stalls on packet loss. HTTP/3 over QUIC (UDP) provides true stream independence and 0-RTT handshakes, critical for mobile users on unreliable networks.',
    how: '## HTTP/1.1\nText headers and chunked bodies. Pipelining is broken in practice; browsers open up to 6 separate TCP sockets per domain to work around HoL blocking.\n\n## HTTP/2\nBinary framing with HPACK header compression. True multiplexing: multiple logical streams over a single TCP connection. Solves HTTP-level HoL blocking, but a single lost TCP packet stalls ALL multiplexed streams due to TCP\'s in-order delivery guarantee.\n\n## HTTP/3 (QUIC over UDP)\nBinary framing with QPACK compression over UDP. Each stream is fully independent — a dropped UDP packet only stalls its own stream. Supports 0-RTT handshakes. Ideal for mobile connections where packet loss is common.\n\n## WebSockets\nEstablished via HTTP Upgrade handshake, then switches to a persistent full-duplex TCP connection. Enables bidirectional streaming. Scaled across backend instances using Redis Pub/Sub as a message backplane.',
    internals: '## Infrastructure Rule\nPublic client connections negotiate HTTP/3 or HTTP/2 at an edge proxy (Cloudflare, Nginx), which terminates the connection and proxies internally over persistent HTTP/2 or gRPC keep-alive connections to upstream services.\n\n## HPACK Header Compression\nHTTP/2 maintains a shared compression table between client and server. Static table: 61 pre-defined common headers. Dynamic table: learned from the session. Headers like Authorization, Cookie, and Content-Type are sent as single-byte indexes after the first request.\n\n## QUIC Connection IDs\nUnlike TCP (identified by 4-tuple: src IP, src port, dst IP, dst port), QUIC connections use a Connection ID. If a mobile user switches from WiFi to 4G (changing IP address), the QUIC connection migrates transparently without reconnection.',
    realWorld: 'Google has run HTTP/3 on YouTube and Google Search since 2020. Cloudflare routes 30%+ of its traffic over HTTP/3. Real-time collaboration apps (Figma, Google Docs) use WebSockets for live cursor and document synchronization. Slack uses a WebSocket connection per client, with Redis Pub/Sub routing messages across server instances.',
    advantages: [
      'HTTP/3 provides true per-stream independence — packet loss in one stream doesn\'t block others',
      'HTTP/2 HPACK compression reduces header overhead by 85-95% vs HTTP/1.1',
      'HTTP/3 0-RTT handshake eliminates connection setup latency for returning clients',
      'WebSockets enable full-duplex communication with far lower overhead than polling'
    ],
    disadvantages: [
      'HTTP/3 UDP packets are often blocked by enterprise firewalls that whitelist TCP-only',
      'WebSockets require sticky sessions or a Pub/Sub backplane for horizontal scaling',
      'HTTP/2 server push (deprecated in Chrome 106) was complex to implement correctly',
      'QUIC\'s UDP path bypasses many TCP performance optimizations in network hardware'
    ],
    tradeoffs: 'HTTP/2 over TCP: Great for reliable networks, poor for high packet-loss mobile. HTTP/3 over UDP: Excellent for mobile, but may be blocked by corporate firewalls. WebSockets: Low latency real-time, but stateful connections complicate horizontal scaling.',
    alternatives: ['Long Polling / Comet', 'Server-Sent Events (SSE)', 'gRPC over HTTP/2', 'WebTransport (HTTP/3-based)'],
    whenToUse: 'HTTP/3: Mobile-heavy user bases, global CDN, gaming. HTTP/2: Internal microservice gRPC communication, most API workloads. WebSockets: Live chat, real-time dashboards, collaborative editing, game state synchronization.',
    whenNotToUse: 'Do not use WebSockets for request-response APIs where HTTP/2 multiplexing is sufficient. Avoid HTTP/3 for corporate internal networks where UDP may be blocked. Don\'t use HTTP/1.1 for any new production service.',
    commonMistakes: [
      'Opening too many WebSocket connections from a single client without connection pooling',
      'Forgetting that HTTP/2 still suffers TCP Head-of-Line blocking on packet loss',
      'Not implementing WebSocket heartbeat/ping-pong frames, causing silent disconnections',
      'Using HTTP/1.1 for microservice internal communication, creating unnecessary connection overhead'
    ],
    interviewQuestions: [
      { q: 'What is HTTP Head-of-Line (HoL) blocking and how does each HTTP version address it?', a: 'HTTP/1.1 HoL blocking: browsers send one request per TCP connection and wait for the response before sending the next. Workaround: open 6 parallel TCP connections per domain. HTTP/2 solves this at the application layer with multiplexed binary streams over a single TCP connection — but TCP itself still has HoL blocking: if one TCP packet is lost, all streams wait for retransmission. HTTP/3 (QUIC/UDP) eliminates TCP HoL blocking entirely — streams are independent UDP flows; a lost packet only stalls its own stream.' },
      { q: 'How do WebSockets scale horizontally across multiple server instances?', a: 'A WebSocket creates a stateful persistent TCP connection to a specific server instance. If a user\'s connection is on Server A but their friend\'s connection is on Server B, direct communication is impossible. Solution: Redis Pub/Sub backplane. When Server A receives a message, it publishes to a Redis channel. All servers subscribe to that channel and push the message to their locally connected clients. This decouples WebSocket routing from the application layer.' },
      { q: 'Why is QUIC built on UDP rather than TCP, and what are the trade-offs?', a: 'QUIC is built on UDP because TCP\'s reliable ordered delivery guarantee is implemented in the kernel and cannot be modified by user-space applications. QUIC implements its own reliable ordered delivery per-stream in user space (the QUIC library), allowing streams to be independent. Advantage: no TCP HoL blocking; faster 0-RTT handshakes. Trade-off: UDP is often rate-limited or blocked by enterprise firewalls and network middleboxes; QUIC must also re-implement congestion control in user space.' }
    ],
    resources: [
      { title: 'HTTP/3 Explained — Daniel Stenberg', url: 'https://http3-explained.haxx.se', type: 'book', author: 'Daniel Stenberg' },
      { title: 'WebSockets — Mozilla MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API', type: 'docs' }
    ],
    relatedTopics: ['backend-networking', 'backend-api-design'],
  },

  // ===== BACKEND: CONCURRENCY & RUNTIMES =====
  'backend-concurrency-runtimes': {
    id: 'backend-concurrency-runtimes',
    title: 'Backend Runtimes, Threading & Concurrency Architectures',
    subject: 'Backend Engineering',
    category: 'Backend',
    difficulty: 'Advanced',
    estimatedTime: '60 min',
    tags: ['concurrency', 'threading', 'Node.js', 'Go', 'JVM', 'virtual-threads', 'event-loop', 'goroutines', 'GIL'],
    what: 'Backend throughput is fundamentally constrained by how a programming language runtime executes instructions against operating system threads and system resources. Node.js uses a single-threaded event loop with libuv for async I/O. Go uses M:N goroutine scheduling via CSP (Communicating Sequential Processes). Java/JVM uses OS threads with thread pools, now complemented by Project Loom Virtual Threads. Python is constrained by the GIL (Global Interpreter Lock) and uses WSGI/ASGI to compensate.',
    why: 'Engineers must choose the right concurrency model to avoid thread exhaustion (Java thread pools), event loop starvation (Node.js CPU blocking), and GIL bottlenecks (Python). Wrong choices cause p99 latency spikes, connection drops under load, and CPU underutilization. The concurrency model determines the framework, infrastructure sizing, and scaling strategy.',
    how: '## Node.js: Single-Threaded Event Loop (Libuv)\nNode.js runs JavaScript on Google V8 engine with async I/O via libuv. The event loop phases: Timers (setTimeout) → I/O Callbacks → Idle/Prepare → Poll (epoll/kqueue) → Check (setImmediate) → Close.\nWorker Pool: DNS resolution, file system, and crypto operations run on a dedicated 4-thread pool, offloading the main event loop.\nConstraint: Any synchronous CPU-intensive loop blocks the entire event loop, spiking p99 latency for ALL connected users.\n\n## Go: M:N Goroutine Scheduler\nGo uses Communicating Sequential Processes (CSP) — goroutines communicate through typed channels, not shared memory. The scheduler multiplexes M goroutines onto N OS threads using G (Goroutine), M (Machine/Thread), P (Processor context). Goroutines start with only 2KB stack (vs 1-2MB for OS threads), expanding dynamically. Work Stealing: idle P processors steal goroutines from busy P queues.\n\n## Java JVM: OS Threads vs Virtual Threads\nTraditional Java: 1 application thread = 1 OS kernel thread. Thread pools (Tomcat: 200 threads) cause thread exhaustion under high concurrency. Project Loom (JDK 21+): User-mode Virtual Threads managed by the JVM. Block on I/O without blocking the carrier OS thread — the JVM parks the virtual thread and uses the OS thread for something else.\n\n## Python: WSGI vs ASGI & GIL\nCPython\'s Global Interpreter Lock prevents concurrent native Python bytecode execution across multiple CPU cores. WSGI (Flask/Django): Synchronous per worker, scaled via Gunicorn multi-process prefork. ASGI (FastAPI/Starlette): Async using Python asyncio event loop — coroutines yield control during socket reads/writes.',
    internals: '## Framework Comparison\n- Spring Boot (Java/Kotlin): Multi-threaded / Virtual Threads → Enterprise banking, ERPs\n- Express/NestJS (Node.js): Single-thread Event Loop → BFF, real-time chat\n- FastAPI (Python 3.10+): ASGI/Asyncio → ML model serving, analytics\n- Gin/Fiber (Go): Goroutine per HTTP connection → Ultra-low latency proxies\n- ASP.NET Core (C#): Managed ThreadPool with async/await → Enterprise cloud APIs\n\n## Architectural Guideline\nFor CPU-bound tasks (image processing, video transcoding, ML inference), avoid single-threaded Node.js and GIL-bound Python. Offload to Go, Rust, or C++ worker processes via message queues (Kafka, SQS).',
    realWorld: 'Node.js powers Netflix\'s BFF layer serving 250M+ subscribers. Go powers Uber\'s real-time dispatch and matching microservices. Java Virtual Threads (JDK 21) enabled Spring Boot apps to handle 10× more concurrent connections with the same thread count. Discord migrated from Elixir to Go for its Presence service, handling 5M concurrent users.',
    advantages: [
      'Go goroutines: 2KB stack vs 1-2MB OS thread — 1000× more concurrent requests per GB of RAM',
      'Node.js event loop excels at I/O-bound workloads with thousands of concurrent connections',
      'Java Virtual Threads (JDK 21) eliminate thread pool exhaustion without rewriting to async/await',
      'Python ASGI (FastAPI) enables high-concurrency APIs without the GIL blocking socket I/O'
    ],
    disadvantages: [
      'Node.js: Any synchronous CPU work (regex, crypto, parsing) blocks ALL users on the event loop',
      'Python GIL prevents true CPU parallelism across cores in a single process',
      'Go goroutine leaks (forgotten goroutines blocking on channels) cause slow OOM crashes',
      'Java thread-per-request model (pre-Loom) exhausted 200-thread pools at 200 concurrent slow requests'
    ],
    tradeoffs: 'Event loop (Node.js, Python ASGI) vs Thread pool (Java Spring): Event loops excel at I/O concurrency but fail at CPU work. Thread pools handle CPU bursts but exhaust at high connection counts. Goroutines (Go) strike the best balance for most backend workloads.',
    alternatives: ['Thread-per-request model (Tomcat / Traditional Java)', 'Event-driven single-threaded event loop (Node.js)', 'Virtual threads / Fibers (Java Project Loom, Go Goroutines)', 'Actor model (Akka / Erlang/OTP)'],
    whenToUse: 'Node.js/ASGI: High-concurrency I/O APIs, BFF layers, chat services. Go: Ultra-low latency microservices, network proxies, CLI tools. Java Virtual Threads (JDK 21+): Migrating existing Spring apps to higher concurrency without rewrite. Python: ML model serving endpoints, data pipeline APIs.',
    whenNotToUse: 'Do not use Node.js for CPU-bound tasks (video encoding, cryptography, ML inference). Avoid Python GIL-bound code for CPU-parallel computation — use multiprocessing or Go/Rust workers instead.',
    commonMistakes: [
      'Blocking the Node.js event loop with synchronous JSON.parse() on large payloads in a request handler',
      'Creating goroutines without tracking their lifecycle, causing goroutine leaks that slowly OOM the process',
      'Using Python threading for CPU-bound tasks — GIL serializes execution, providing no speedup',
      'Under-sizing Java thread pools (Tomcat default: 200) for services with slow downstream HTTP calls'
    ],
    interviewQuestions: [
      { q: 'Explain the Node.js event loop and what happens when a synchronous task blocks it.', a: 'Node.js runs a single-threaded event loop using libuv. The loop processes phases in order: Timers (setTimeout callbacks) → I/O Callbacks (completed async operations) → Poll (retrieving new I/O events, blocking if none) → Check (setImmediate) → Close. When any synchronous code runs (e.g., a 500ms for loop, synchronous file read, bcrypt hash), the event loop is blocked for that entire duration. All other users\' HTTP requests queue up waiting. This is catastrophic in production — a single bad handler can spike p99 latency for every connected user.' },
      { q: 'How do Go goroutines differ from OS threads? Why can Go handle 100,000 concurrent connections?', a: 'OS threads have 1-2MB initial stack allocation managed by the kernel, with expensive context switching (~1-10μs). Go goroutines start with only a 2KB stack in user space, growing dynamically up to 1GB. The Go runtime scheduler multiplexes thousands of goroutines onto a small number of OS threads (typically GOMAXPROCS = number of CPU cores) using M:N scheduling with work stealing. A blocked goroutine (waiting on I/O or channel) is parked cheaply without blocking its OS thread. Result: 100,000 goroutines consume ~200MB RAM vs ~100GB for 100,000 OS threads.' },
      { q: 'What is Python\'s GIL and how does ASGI (FastAPI) work around it for I/O-bound workloads?', a: 'The Global Interpreter Lock is a mutex in CPython that ensures only one thread executes Python bytecode at a time, preventing memory corruption in CPython\'s reference counting garbage collector. This means CPU-bound parallel Python code on 8 cores runs no faster than on 1 core. For I/O-bound workloads, ASGI frameworks like FastAPI use Python\'s asyncio event loop. Coroutines (async/await) yield control to the event loop during I/O operations (socket reads, database queries), so the GIL is released during I/O waits. The event loop can then advance other coroutines, achieving high concurrency despite the GIL.' }
    ],
    resources: [
      { title: 'Go Concurrency Patterns — Rob Pike', url: 'https://talks.golang.org/2012/concurrency.slide', type: 'article', author: 'Rob Pike' },
      { title: 'Project Loom — JDK 21 Virtual Threads', url: 'https://openjdk.org/jeps/444', type: 'docs' },
      { title: 'Node.js Event Loop — libuv docs', url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick', type: 'docs' }
    ],
    relatedTopics: ['backend-http-protocols', 'backend-databases-rdbms'],
  },

  // ===== BACKEND: RDBMS & SQL INTERNALS =====
  'backend-databases-rdbms': {
    id: 'backend-databases-rdbms',
    title: 'Relational Databases (RDBMS) & SQL Internals',
    subject: 'Backend Engineering',
    category: 'Backend',
    difficulty: 'Advanced',
    estimatedTime: '70 min',
    tags: ['PostgreSQL', 'MySQL', 'ACID', 'transactions', 'indexes', 'B-tree', 'connection-pooling', 'SQL', 'MVCC'],
    what: 'Relational databases provide strict schema contracts, declarative SQL querying, and ACID transactional consistency. ACID stands for Atomicity (all mutations commit or all abort via WAL), Consistency (schema constraints preserved), Isolation (concurrent transactions isolated by level), and Durability (committed data survives crashes via fsync). Storage engines use B+ Tree indexes for sorted O(log N) lookups and range queries, or LSM Trees for write-heavy workloads. Connection pooling (HikariCP, PgBouncer) is essential to avoid the overhead of creating new DB connections per request.',
    why: 'Relational databases are the backbone of most business applications. Without mastering SQL internals (indexes, isolation levels, query plans), engineers write queries that cause full table scans, deadlocks, and slow under load. Misunderstanding isolation levels leads to data races (dirty reads, phantom reads) that corrupt financial data. Connection pool exhaustion crashes services under load.',
    how: '## ACID Properties\n- **Atomicity:** WAL (Write-Ahead Log) ensures incomplete transactions can be rolled back on crash recovery\n- **Consistency:** Foreign key constraints, unique indexes, and CHECK constraints verified on every write\n- **Isolation:** Controlled via ANSI isolation levels (Read Uncommitted → Serializable)\n- **Durability:** WAL flushed to disk (fsync) before transaction commit confirmation\n\n## B+ Tree Indexes (PostgreSQL, MySQL)\nSelf-balancing tree with all data in leaf nodes, linked sequentially. O(log N) for point lookups. Leaf node linking enables blazingly fast range queries (BETWEEN, >, <). Composite indexes follow the Equality-Range-Sort heuristic: most selective columns first.\n\n## LSM Trees (Cassandra, RocksDB)\nWrites append to in-memory MemTable + WAL. When full, flush to immutable SSTable on disk. Background compaction merges SSTables. Ideal for write-heavy workloads; reads may require checking multiple SSTables (mitigated by Bloom filters).\n\n## Connection Pooling\nOpening a DB connection is expensive: TCP handshake, authentication, process fork (Postgres), ~5-10MB memory allocation per connection. Poolers maintain warm reusable connections. Optimal pool size: connections = (core_count × 2) + effective_spindle_count',
    internals: '## ANSI Isolation Levels\n- **Read Uncommitted:** Allows Dirty Reads (reading uncommitted data from concurrent transactions)\n- **Read Committed:** Eliminates Dirty Reads; still allows Non-Repeatable Reads\n- **Repeatable Read:** Snapshot guarantees; prevents Non-Repeatable Reads; may allow Phantom Reads\n- **Serializable:** Complete isolation via strict 2PL or Serializable Snapshot Isolation (SSI)\n\n## Normalization vs. Denormalization\n- **1NF:** Atomic column values, no repeating groups\n- **2NF:** Non-prime attributes fully depend on candidate key (no partial dependencies)\n- **3NF/BCNF:** No transitive functional dependencies; eliminates data duplication\n- **Denormalization:** Duplicate fields (e.g., user_name on orders) for high read throughput; risks update anomalies\n\n## Query Optimization\nUse EXPLAIN (ANALYZE, BUFFERS). Watch for: Sequential Scans (Seq Scan) on large tables, Nested Loop joins on unbounded records, missing composite indexes.',
    realWorld: 'PostgreSQL powers Shopify (millions of merchants, petabytes of transaction data), Instagram (user data + social graph), and GitHub (repository metadata). HikariCP is the default connection pooler for Spring Boot. PgBouncer is used by Heroku and AWS RDS Proxy to multiplex thousands of app connections to a PostgreSQL instance limited to ~100 max connections.',
    advantages: [
      'ACID guarantees ensure financial data integrity even during concurrent writes and crashes',
      'B+ Tree indexes enable O(log N) point lookups and blazing-fast range queries',
      'SQL is declarative — the query planner chooses the optimal execution path automatically',
      'Mature tooling: EXPLAIN plans, pg_stat_statements, pgBadger for query analysis'
    ],
    disadvantages: [
      'Horizontal write sharding is complex — requires application-level routing or Citus extension',
      'Schema migrations on large tables require careful planning to avoid table locks',
      'SERIALIZABLE isolation significantly reduces concurrent write throughput',
      'Connection overhead (~5-10MB per connection) requires pooling for high-concurrency apps'
    ],
    tradeoffs: 'Normalization vs. Denormalization: normalized schemas have zero data duplication but require expensive JOINs at read time; denormalized schemas have fast reads but complex write logic. Serializable isolation vs. Read Committed: stronger isolation = fewer anomalies but more lock contention and lower throughput.',
    alternatives: ['PostgreSQL (ACID, MVCC, rich extensions)', 'MySQL / MariaDB (InnoDB, high-volume replication)', 'CockroachDB / YugabyteDB (Distributed SQL, Spanner model)', 'SQLite (Embedded, zero-latency serverless)'],
    whenToUse: 'Financial systems, order management, user accounts, inventory — anywhere ACID compliance, referential integrity, and complex querying are required. Use PostgreSQL JSONB for semi-structured data within a relational model.',
    whenNotToUse: 'Avoid RDBMS for: time-series data (use TimescaleDB/InfluxDB), full-text search (Elasticsearch), session storage (Redis), or horizontally scaled write-heavy workloads (use Cassandra).',
    commonMistakes: [
      'Not adding an index on foreign key columns, causing full table scans on every JOIN',
      'Running long-running transactions that hold row locks and block concurrent writers',
      'Using SELECT * in production queries, preventing index-only scans',
      'Not using connection pooling (HikariCP/PgBouncer), causing connection exhaustion under load',
      'Running schema migrations (ALTER TABLE ADD COLUMN) without testing on a production-sized dataset first'
    ],
    interviewQuestions: [
      { q: 'What are ACID properties? Give an example of how each is enforced in PostgreSQL.', a: 'Atomicity: PostgreSQL uses a Write-Ahead Log (WAL). If a transaction fails mid-way, the WAL replay rolls back all changes. Consistency: Constraints (UNIQUE, FK, CHECK) are verified before commit; the transaction aborts if violated. Isolation: PostgreSQL uses MVCC (Multi-Version Concurrency Control) — readers see a snapshot of the database at their transaction start time, without blocking writers. Isolation level is configurable per transaction. Durability: PostgreSQL calls fsync() to flush the WAL buffer to disk before acknowledging commit to the client.' },
      { q: 'Why is connection pooling critical for PostgreSQL? How does PgBouncer work?', a: 'PostgreSQL uses a process-per-connection model (fork()). Each new connection spawns a new OS process with ~5-10MB of memory for stack, authentication, and query buffers. 1000 concurrent app connections = 10GB memory overhead just for connection processes, often exceeding available RAM. PgBouncer sits between the app and PostgreSQL, maintaining a warm pool of authenticated connections. When an app connection wants to execute a query, PgBouncer lends it a pooled server connection, executes the query, then returns the server connection to the pool. The app sees 1000 connections; PostgreSQL sees only 20-50.' },
      { q: 'What is the difference between B+ Tree indexes and LSM Tree indexes?', a: 'B+ Tree (PostgreSQL, MySQL): A self-balancing tree with data sorted in leaf nodes linked sequentially. Point lookups: O(log N). Range queries (BETWEEN, ORDER BY): very fast due to leaf node linking. Writes perform random I/O to maintain sorted order. LSM Tree (Cassandra, RocksDB): Writes are always sequential — appended to an in-memory MemTable, then flushed to immutable sorted SSTables on disk. Background compaction merges SSTables. Writes are 10-100× faster than B-Tree. Reads may check multiple SSTables (mitigated by Bloom filters). Best for write-heavy append-only workloads.' }
    ],
    resources: [
      { title: 'PostgreSQL Documentation — MVCC', url: 'https://www.postgresql.org/docs/current/mvcc.html', type: 'docs' },
      { title: 'Use The Index, Luke! — SQL Indexing Guide', url: 'https://use-the-index-luke.com', type: 'article' },
      { title: 'Designing Data-Intensive Applications — Martin Kleppmann', url: 'https://dataintensive.net', type: 'book', author: 'Martin Kleppmann' }
    ],
    relatedTopics: ['backend-nosql', 'backend-caching'],
  },

  // ===== BACKEND: NoSQL =====
  'backend-nosql': {
    id: 'backend-nosql',
    title: 'NoSQL Architecture & Specialized Data Stores',
    subject: 'Backend Engineering',
    category: 'Backend',
    difficulty: 'Advanced',
    estimatedTime: '60 min',
    tags: ['MongoDB', 'Redis', 'Cassandra', 'NoSQL', 'document-store', 'key-value', 'wide-column', 'vector-db', 'graph-db'],
    what: 'NoSQL systems break relational constraints to prioritize horizontal scalability, flexible semi-structured documents, or specific mathematical abstractions (graphs, vectors, time-series). Document stores (MongoDB): semi-structured BSON/JSON with dynamic schemas. Key-Value (Redis): sub-millisecond in-memory operations with rich data structures. Wide-Column (Cassandra): masterless ring topology for linear horizontal write scalability. Graph (Neo4j): index-free adjacency for O(1) relationship traversal. Vector DBs (Pinecone, Milvus): approximate nearest-neighbor search for ML embeddings.',
    why: 'No single database paradigm handles every workload optimally. Mature systems use Polyglot Persistence: PostgreSQL for transactions, MongoDB for catalog data, Redis for sessions, Elasticsearch for search, and Kafka for event logs. Understanding each NoSQL engine prevents catastrophic design mistakes like storing unbounded arrays in MongoDB documents (16MB limit) or violating Cassandra\'s partition key access patterns.',
    how: '## MongoDB Document Store\nBSON/JSON documents with dynamic schemas (no DDL locks for schema evolution). WiredTiger storage engine: document-level locking, snappy/zstd compression, replica sets using Raft-based leader election.\nEmbed vs. Reference: Embed data accessed together (1:few relationships); reference separate collections for unbounded 1:many (avoid 16MB document limit).\n\n## Redis In-Memory Key-Value\nSingle-threaded event loop with multiplexed I/O → sub-millisecond operations. Data structures: Strings, Hashes, Lists, Sets, Sorted Sets (SkipLists), HyperLogLog, Bitmaps, Streams. Persistence: RDB (periodic snapshot via fork) + AOF (Append-Only File with rewrite). Redis Cluster: 16,384 hash slots distributed via CRC16(key) hashing.\n\n## Cassandra Wide-Column Store\nMasterless peer-to-peer ring based on Amazon Dynamo paper + Google Bigtable. Partition Key hashed via Murmur3 to locate storage nodes. Clustering Key controls on-disk data sorting within a partition. Tunable consistency: ONE, QUORUM, ALL. If R + W > N → strong consistency guaranteed.\n\n## Graph & Vector Databases\nNeo4j: Index-free adjacency; pointer chasing provides O(1) traversal of relationships (vs expensive recursive SQL JOINs). Vector DBs (Pinecone, Milvus, pgvector): HNSW/IVFFlat approximate nearest-neighbor search for high-dimensional embedding similarity search.',
    internals: '## Polyglot Persistence Pattern\nProduction e-commerce platform example: PostgreSQL (ledger transactions, order management) + MongoDB (dynamic product catalog attributes) + Redis (user sessions, shopping cart) + Elasticsearch (product search with fuzzy matching) + Kafka (order event log for analytics and downstream services).\n\n## Database Selection Matrix\n- RDBMS: ACID compliance, complex queries, read replicas → rigid horizontal write sharding\n- Document: Rapid prototyping, dynamic schemas, auto-sharding → no distributed JOINs\n- Key-Value: Sub-millisecond latency, pub-sub, caches → limited by physical RAM\n- Wide-Column: Linear horizontal write scaling, zero single point of failure → query patterns must be locked at design time\n- Search Engine: Full-text search, fuzzy matching, log aggregation → eventual consistency',
    realWorld: 'MongoDB powers Airbnb\'s listing catalog (dynamic attributes per property type). Redis powers Twitter/X\'s timeline cache (300M users\' cached timelines). Cassandra is used by Apple (10 PB), Netflix (streaming state), and Discord (message storage). Neo4j powers LinkedIn\'s People You May Know feature and fraud detection graph queries.',
    advantages: [
      'MongoDB schema flexibility enables rapid feature iteration without DDL migration downtime',
      'Redis delivers sub-millisecond p99 latency — 10-100× faster than PostgreSQL for cache reads',
      'Cassandra provides linear horizontal write scaling — adding nodes doubles write throughput',
      'Vector DBs enable semantic search over billions of embeddings with millisecond ANN query time'
    ],
    disadvantages: [
      'MongoDB: No distributed JOINs; denormalized documents increase update complexity',
      'Redis: Dataset limited by physical RAM budget; expensive for large datasets',
      'Cassandra: Query patterns must be designed around partition keys before schema creation',
      'Vector DBs: Approximate (not exact) nearest-neighbor search; results are probabilistic'
    ],
    tradeoffs: 'Schema flexibility (MongoDB) vs. relational integrity (PostgreSQL). Sub-ms speed (Redis) vs. disk persistence (PostgreSQL). Linear write scale (Cassandra) vs. JOIN capability (PostgreSQL). ANN accuracy vs. search latency (HNSW vs brute-force in Vector DBs).',
    alternatives: ['MongoDB (Document store, rich query engine)', 'Cassandra / ScyllaDB (Wide-column, masterless AP)', 'Redis (In-memory key-value data structures)', 'Neo4j (Property graph database)'],
    whenToUse: 'MongoDB: Product catalogs, user profiles, CMS content. Redis: Sessions, rate limiting, real-time leaderboards, pub/sub. Cassandra: IoT time-series, activity feeds, messaging. Neo4j: Social graphs, fraud detection, recommendation systems.',
    whenNotToUse: 'Do not use MongoDB for financial ledgers requiring strong ACID. Avoid Redis as the primary persistent store for data larger than available RAM. Never use Cassandra for ad-hoc queries without pre-designed partition key access patterns.',
    commonMistakes: [
      'Growing MongoDB documents beyond 16MB by embedding unbounded arrays (use referencing instead)',
      'Using Cassandra for queries that require filtering on non-partition-key columns (allow filtering is a red flag)',
      'Storing large binary blobs in Redis, exhausting memory budget for cache data',
      'Using Redis as the primary database without enabling AOF persistence, losing data on crash'
    ],
    interviewQuestions: [
      { q: 'When would you use Cassandra over PostgreSQL? What query access patterns does Cassandra require?', a: 'Choose Cassandra when: you need linear horizontal write scalability (adding nodes = proportionally more write throughput), you have a high-write time-series or event-log workload, or you need 99.999% availability with no single point of failure (masterless ring). Cassandra requires: queries must always include the partition key (Murmur3-hashed to locate the node). The clustering key defines on-disk sort order for range queries within a partition. Table schemas must be designed around your query patterns upfront — Cassandra is query-first, not entity-first. Running ALLOW FILTERING bypasses this model and causes full table scans.' },
      { q: 'Explain the difference between Redis RDB and AOF persistence modes.', a: 'RDB (Redis Database Backup): Periodically forks the Redis process and writes a point-in-time snapshot to disk. Very compact. Fast restart. Risk: data since the last snapshot is lost on crash (typically 1-15 minutes of data). AOF (Append-Only File): Logs every write command to a file. On restart, Redis replays the AOF to reconstruct state. Configurable fsync: always (every write, most durable), everysec (every second, 1s data loss risk), or never (OS decides). AOF rewrite periodically compacts the file by replaying the current state. Most production deployments use both: RDB for fast restarts, AOF for durability.' },
      { q: 'How does Cassandra achieve tunable consistency? What is quorum?', a: 'Cassandra replicates each partition to N replica nodes (configured by Replication Factor). For each read (R) and write (W) operation, you configure how many replicas must respond. If R + W > N, strong consistency is guaranteed because at least one replica must have participated in both the last write and the current read. Example: N=3, W=2, R=2 → quorum (QUORUM). N=3, W=3, R=1 → ALL writes, ONE read (very durable writes, fast reads). N=3, W=1, R=1 → ONE (lowest latency, highest availability, eventual consistency).' }
    ],
    resources: [
      { title: 'MongoDB Data Modeling Guide', url: 'https://www.mongodb.com/docs/manual/core/data-modeling-introduction/', type: 'docs' },
      { title: 'Redis Data Structures', url: 'https://redis.io/docs/data-types/', type: 'docs' },
      { title: 'Cassandra: The Definitive Guide', url: 'https://www.oreilly.com/library/view/cassandra-the-definitive/9781492097136/', type: 'book' }
    ],
    relatedTopics: ['backend-databases-rdbms', 'backend-caching', 'backend-distributed-systems'],
  },

  // ===== BACKEND: API DESIGN =====
  'backend-api-design': {
    id: 'backend-api-design',
    title: 'API Design: REST, GraphQL & gRPC',
    subject: 'Backend Engineering',
    category: 'Backend',
    difficulty: 'Intermediate',
    estimatedTime: '55 min',
    tags: ['REST', 'GraphQL', 'gRPC', 'Protobuf', 'API', 'HTTP', 'HATEOAS', 'OpenAPI'],
    what: 'APIs establish the boundary contracts of modern backend engineering. REST (Representational State Transfer) is the dominant stateless HTTP API paradigm using resources and HTTP verbs. GraphQL provides a strongly-typed schema where clients define exactly which fields they need. gRPC uses Protocol Buffers (Protobuf) over HTTP/2 for up to 10× faster binary serialization, code-generated stubs, and native streaming support. The choice of API paradigm dictates serialization speed, wire efficiency, client-server coupling, and caching dynamics.',
    why: 'REST over-fetching wastes bandwidth (returning 50 fields when the client needs 5). GraphQL N+1 query problems destroy database performance if not mitigated with DataLoader. gRPC requires HTTP/2 and is incompatible with browser clients without a gRPC-Web proxy. Choosing the wrong paradigm creates performance bottlenecks, versioning nightmares, and tight coupling.',
    how: '## REST\nRichardson Maturity Model: Level 0 (RPC-style) → Level 1 (Resources) → Level 2 (HTTP Verbs: GET, POST, PUT, DELETE) → Level 3 (HATEOAS: hypermedia links in responses). Caching: ETag + Cache-Control: max-age allows intermediary proxies to cache responses. Idempotency: GET/PUT/DELETE must be safe and idempotent; POST is non-idempotent.\n\n## GraphQL\nStrong Type Schema: SDL (Schema Definition Language) defines types, queries, mutations, and subscriptions. Clients specify exact fields → eliminates over-fetching. DataLoader: batches and memoizes N+1 database queries within a single request cycle (solves the classic N+1 problem).\n\n## gRPC + Protocol Buffers\nProtobuf serialization: up to 10× faster and significantly smaller than text JSON. Multiplexed streams over HTTP/2: natively supports unary, client streaming, server streaming, and bidirectional streaming. Code generation: compiles type-safe client stubs across Go, Java, Python, and C++.',
    internals: '## Protobuf vs JSON\nProtobuf fields are encoded with field numbers (not string keys), using variable-length encoding. A Person{name: "Alice", age: 30} serializes to ~9 bytes in Protobuf vs ~25 bytes in JSON. No schema = no parsing ambiguity.\n\n## GraphQL DataLoader Pattern\nWithout DataLoader: fetching 100 posts each with an author field causes 101 database queries (1 for posts + 1 per author). With DataLoader: all author IDs from a request batch are collected, a single IN query fetches them all, results are memoized and distributed to resolvers.\n\n## API Versioning Strategies\n- URL versioning: /api/v1/users (simple, cache-friendly)\n- Header versioning: Accept: application/vnd.api.v2+json (clean URLs, harder to test)\n- GraphQL: add fields, deprecate old ones (non-breaking by default)\n- gRPC: field numbers are stable; new fields are ignored by old clients (backward compatible)',
    realWorld: 'GitHub v4 API is GraphQL. Kubernetes API server uses Protocol Buffers internally (and REST externally). Netflix uses gRPC for service-to-service communication (Protobuf, HTTP/2). Shopify\'s Storefront API is GraphQL. Twitter\'s internal microservices use Protobuf over Kafka.',
    advantages: [
      'gRPC Protobuf: 10× faster serialization and 60-80% smaller payload vs JSON REST',
      'GraphQL: clients fetch exactly the fields they need, eliminating over-fetching on mobile',
      'gRPC bidirectional streaming: enables real-time push without WebSocket complexity',
      'REST: simple, cacheable, and understood by every HTTP client and reverse proxy'
    ],
    disadvantages: [
      'gRPC is incompatible with browser clients without a gRPC-Web proxy (Envoy)',
      'GraphQL N+1 problem: naive resolver implementations cause explosive database query counts',
      'REST over-fetching: returning 50 fields when the mobile app needs only 5',
      'GraphQL caching is complex — queries are POST requests, bypassing HTTP caching'
    ],
    tradeoffs: 'REST: simple, cacheable, universal client support. GraphQL: precise data fetching, complex caching. gRPC: highest performance, code-gen discipline, HTTP/2 required. Internal microservices: gRPC wins. Public APIs: REST or GraphQL.',
    alternatives: ['RESTful JSON API', 'GraphQL (Declarative client-driven querying)', 'gRPC with Protocol Buffers (High-performance RPC)', 'tRPC (Type-safe RPC for TypeScript)'],
    whenToUse: 'REST: Public APIs, third-party integrations, simple CRUD services. GraphQL: Mobile apps with diverse data needs, BFF aggregation layers, complex nested data. gRPC: Internal service-to-service communication, streaming data pipelines, performance-critical microservices.',
    whenNotToUse: 'Do not use gRPC for public browser-facing APIs without a gRPC-Web proxy. Avoid GraphQL for simple CRUD APIs where REST is sufficient. Do not skip DataLoader in GraphQL resolvers that access related entities.',
    commonMistakes: [
      'Not using DataLoader in GraphQL, causing N+1 database queries per request',
      'Exposing gRPC services directly to the internet without an API gateway or gRPC-Web proxy',
      'Using POST for all REST operations instead of correct HTTP verbs (breaking caching and idempotency)',
      'Returning HTTP 200 for error responses in REST (should use 4xx/5xx codes)'
    ],
    interviewQuestions: [
      { q: 'What is the GraphQL N+1 problem and how does DataLoader solve it?', a: 'The N+1 problem: a GraphQL query fetches a list of N posts, and each post\'s resolver fetches the author via a separate DB query → 1 + N total queries. For 100 posts: 101 queries. DataLoader solves this with two techniques: Batching (collects all IDs requested within the same event loop tick, then fires a single batched IN query), and Memoization (caches results within the request lifecycle, so the same entity is never fetched twice). Result: 101 queries become 2 (1 for posts, 1 batched query for all unique authors).' },
      { q: 'How does Protocol Buffers (Protobuf) serialization differ from JSON? Why is it faster?', a: 'JSON is text-based: field names are full strings, values are human-readable text. Every byte is meaningful but verbose. Protobuf is binary: each field is identified by a compact field number (not a string key), values use variable-length encoding (smaller integers encode to fewer bytes). A 30-character JSON key like \'shipping_address_street_1\' becomes a single 1-byte varint field tag. No type ambiguity (schema defines types). No field name parsing. Result: Protobuf is typically 60-80% smaller and 5-10× faster to serialize/deserialize than equivalent JSON.' },
      { q: 'What are REST idempotency guarantees? Why do they matter?', a: 'Idempotency: calling the same endpoint multiple times produces the same result as calling it once. GET (safe + idempotent): read-only, no side effects. PUT (idempotent): replace resource completely; retrying on network error won\'t create duplicates. DELETE (idempotent): deleting already-deleted resource returns 404 but causes no additional side effects. POST (non-idempotent): creating a new resource each time. Idempotency matters for retry logic: if a network request times out, it\'s safe to retry GET/PUT/DELETE but retrying POST may create duplicate records. This is why payment APIs use idempotency keys.' }
    ],
    resources: [
      { title: 'gRPC Documentation', url: 'https://grpc.io/docs/', type: 'docs' },
      { title: 'GraphQL DataLoader', url: 'https://github.com/graphql/dataloader', type: 'docs' },
      { title: 'REST API Design Best Practices', url: 'https://restfulapi.net', type: 'article' }
    ],
    relatedTopics: ['backend-http-protocols', 'backend-messaging', 'backend-security'],
  },

  // ===== BACKEND: MESSAGING & EVENT-DRIVEN =====
  'backend-messaging': {
    id: 'backend-messaging',
    title: 'Async Event-Driven Architecture & Message Brokers',
    subject: 'Backend Engineering',
    category: 'Backend',
    difficulty: 'Advanced',
    estimatedTime: '65 min',
    tags: ['Kafka', 'RabbitMQ', 'SQS', 'event-driven', 'pub-sub', 'Saga', 'distributed-transactions', 'message-queue'],
    what: 'Event-driven architectures decouple producer emissions from consumer processing, ensuring systemic resilience during traffic spikes. Message Queues (RabbitMQ, AWS SQS): push-based delivery, message deleted on ACK, competing consumers share a single queue. Distributed Commit Logs (Apache Kafka, Redpanda): persistent append-only log partitioned by key, consumers pull at their own offset, replay from any offset, retained for days/weeks. The Saga Pattern coordinates distributed transactions across microservices without 2-Phase Commit, using compensating transactions for rollbacks.',
    why: 'Synchronous HTTP calls create tight coupling — if the downstream service is slow, the caller blocks. Under traffic spikes, cascading failures propagate upstream. Event-driven architectures buffer load (Kafka consumers process at their own pace), enable replay (re-process historical events with new logic), and decouple services (producers don\'t know who consumes their events). This is the foundation of CQRS, Event Sourcing, and distributed Saga patterns.',
    how: '## Message Queue (RabbitMQ / AWS SQS)\nExchange routes messages to queues (Direct, Fanout, Topic, Headers bindings). Multiple competing consumers share one queue — each message processed by exactly one consumer. Delivery: at-least-once (with local deduplication for exactly-once). Data deleted on ACK — cannot replay history.\n\n## Distributed Commit Log (Apache Kafka)\nTopics are split into Partitions (append-only log). Producers emit records; partitioning key determines partition via hash(key) % partitions → ordering guaranteed within a partition. Consumer Groups: each partition assigned to exactly one consumer within a group (parallelism = number of partitions). Data persisted to disk for configurable retention (days/weeks). Consumers track their own offset — can replay from any point.\n\n## Saga Pattern\nFor cross-service transactions where 2PC is not viable, Saga coordinates a sequence of local transactions. Choreography: each service emits domain events consumed by the next service (Kafka-based). Orchestration: a central Saga Orchestrator sends commands and awaits responses. On failure: compensating transactions roll back earlier steps.',
    internals: '## Kafka Internals\nLog segments: each partition is a sequence of ordered, immutable log segments on disk. Log compaction: retains only the last value per key for changelog-style topics. ISR (In-Sync Replicas): leader only acknowledges writes once all ISR replicas have confirmed. Producer ACK levels: acks=0 (fire and forget), acks=1 (leader written), acks=all (all ISR confirmed, strongest durability).\n\n## Comparison: Queue vs Kafka\n| Attribute | RabbitMQ/SQS | Kafka |\n|-----------|------------|-------|\n| Replay | ❌ Deleted on ACK | ✅ Replay from any offset |\n| Ordering | Per-queue FIFO | Per-partition ordering |\n| Concurrency | Competing consumers | 1 consumer per partition per group |\n| Use case | Task queues, RPC | Event streaming, CQRS, audit logs |',
    realWorld: 'LinkedIn invented Kafka to process 1 trillion messages per day. Uber uses Kafka for real-time ride events, surge pricing, and analytics. Airbnb uses the Saga pattern with Kafka for payment orchestration across multiple microservices. AWS SQS processes trillions of messages per day for serverless workflows.',
    advantages: [
      'Kafka consumer offset model allows replay — reprocess historical events with updated business logic',
      'Decoupling via events eliminates synchronous blocking — producers don\'t wait for consumer processing',
      'Kafka log compaction enables changelog materialization for rebuilding read models',
      'Saga pattern enables distributed transactions without 2PC — no distributed lock coordination'
    ],
    disadvantages: [
      'Kafka operational complexity: ZooKeeper/KRaft, ISR management, consumer lag monitoring',
      'At-least-once delivery means consumers must implement idempotency for safe reprocessing',
      'Saga compensating transactions are complex to implement correctly for partial failures',
      'Message Queue order: SQS FIFO queues limit to 3,000 messages per second; standard queues have no ordering'
    ],
    tradeoffs: 'Kafka: durable, replayable, high-throughput, operationally complex. RabbitMQ/SQS: simpler, push-based, auto-delete. Saga choreography: loosely coupled, harder to visualize flow. Saga orchestration: centralized control, single point of failure risk.',
    alternatives: ['Apache Kafka (Distributed log, high throughput event streaming)', 'RabbitMQ (AMQP broker, flexible exchange routing)', 'AWS SQS / SNS (Serverless managed queues and pub/sub)', 'Redis Streams (Lightweight log-based stream processing)'],
    whenToUse: 'Kafka: Event sourcing, CQRS, audit trails, real-time analytics, microservice event backbone. RabbitMQ/SQS: Task queues (email sending, image resizing), RPC-style async work, simple fan-out. Saga: Distributed business transactions spanning multiple microservices/databases.',
    whenNotToUse: 'Do not use Kafka for simple task queues where SQS/RabbitMQ is sufficient — Kafka\'s operational overhead is significant. Avoid Saga for simple single-database transactions — use database ACID transactions instead.',
    commonMistakes: [
      'Not making Kafka consumers idempotent, causing duplicate processing on consumer restart/rebalance',
      'Adding more consumers than partitions in a Kafka consumer group — extra consumers sit idle',
      'Forgetting to implement compensating transactions in Saga, leaving the system in a partially committed state',
      'Using Kafka retention of infinite/very long duration without monitoring disk usage growth'
    ],
    interviewQuestions: [
      { q: 'How does Kafka achieve message ordering? When can ordering be violated?', a: 'Kafka guarantees ordering within a single partition. A topic is divided into N partitions; each partition is an append-only ordered log. When a producer sends a message, it\'s routed to a partition via hash(partitionKey) % numPartitions. All messages with the same key go to the same partition → ordered delivery for that key. Ordering can be violated if: (1) no partition key is set (round-robin distribution loses ordering), (2) the number of partitions is increased (keys reroute to different partitions for new messages), (3) producer retries with acks=1 and multiple in-flight requests (enable.idempotence=true prevents this).' },
      { q: 'What is the Saga pattern? Compare choreography vs orchestration.', a: 'The Saga pattern decomposes a distributed transaction into a sequence of local database transactions, each emitting an event that triggers the next service. On failure, compensating transactions undo previous steps. Choreography: each service listens for events and reacts — no central coordinator. Pros: loose coupling, simple to add new services. Cons: hard to track overall flow, event storms can cascade. Orchestration: a central Saga Orchestrator (stateful service or state machine) sends commands and awaits events. Pros: centralized visibility, clear failure handling. Cons: orchestrator is a single point of failure, higher coupling.' },
      { q: 'Why does Kafka use pull-based consumption instead of push?', a: 'Pull-based consumption lets consumers control their own pace. A slow consumer won\'t be overwhelmed by a fast producer — it simply reads at its own rate. Consumers can also implement back-pressure naturally (stop pulling when processing queue is full). Push-based systems must implement sophisticated rate control to avoid overwhelming slow consumers. Pull also enables replay — consumers simply reset their offset to re-read historical data. The trade-off: pull introduces polling latency, mitigated by Kafka\'s long-polling mechanism (consumers wait up to fetch.max.wait.ms for new records before returning empty).' }
    ],
    resources: [
      { title: 'Kafka: The Definitive Guide', url: 'https://www.confluent.io/resources/kafka-the-definitive-guide/', type: 'book' },
      { title: 'Saga Pattern — microservices.io', url: 'https://microservices.io/patterns/data/saga.html', type: 'article' }
    ],
    relatedTopics: ['kafka', 'backend-distributed-systems', 'backend-api-design'],
  },

  // ===== BACKEND: SECURITY & AUTH =====
  'backend-security': {
    id: 'backend-security',
    title: 'Authentication, Authorization & Backend Security (OWASP)',
    subject: 'Backend Engineering',
    category: 'Backend',
    difficulty: 'Advanced',
    estimatedTime: '60 min',
    tags: ['JWT', 'OAuth2', 'OIDC', 'OWASP', 'security', 'authentication', 'authorization', 'RBAC', 'CSRF', 'SQL-injection'],
    what: 'Backend identity systems verify client identity (authentication) and enforce resource permissions (authorization). Stateful sessions use an opaque session ID stored in Redis/DB via an HttpOnly cookie. Stateless JWT contains a self-contained cryptographically signed payload (sub, exp, roles) verifiable by any microservice using the public key — but revocation requires a distributed blacklist. OAuth 2.0 enables delegated access via scopes. OIDC (OpenID Connect) adds an id_token for user profile claims. The OWASP Top 10 defines the most critical web application security risks.',
    why: 'Security failures are catastrophic: credential theft, data breaches, financial fraud. Understanding JWT vs stateful sessions prevents insecure token handling. OAuth 2.0 without PKCE enables authorization code interception attacks on mobile apps. SQL injection without parameterized queries exposes entire databases. SSRF attacks allow attackers to query AWS metadata endpoints (169.254.169.254) to steal cloud credentials.',
    how: '## Stateful Sessions vs JWT\nStateful: Server issues opaque session ID stored in Redis; client sends it as HttpOnly cookie. Instant revocation (delete from Redis). Requires central DB lookup per request.\nJWT: Self-contained signed token (header.payload.signature). Any service verifies with public key — no DB lookup. Downside: to revoke a JWT before expiry, maintain a distributed blacklist (Redis SET of invalidated JTIs).\n\n## OAuth 2.0 + PKCE\nPKCE (Proof Key for Code Exchange): Mandated for SPAs and mobile apps. Client generates a random code_verifier, hashes it to code_challenge, sends with authorization request. Authorization server returns code only to the app that knows the original code_verifier. Prevents authorization code interception.\n\n## OWASP Top 10 Defenses\n- SQL Injection: Parameterized prepared statements; ORM; least-privilege DB users\n- BOLA/IDOR: WHERE id = :id AND tenant_id = :user_tenant on every query; use UUIDv4 not sequential IDs\n- SSRF: Deny internal IP ranges (10.0.0.0/8, 127.0.0.1) in HTTP client; route through isolated outbound proxy\n- XSS: Content-Security-Policy header; HttpOnly cookies for auth tokens; HTML-encode all output\n- CSRF: SameSite=Strict cookies; cryptographic Anti-CSRF double-submit tokens on mutating requests',
    internals: '## Password Hashing\nNever use MD5 or SHA-256 for passwords (fast hashing = GPU brute-force attack). Use adaptive memory-hard algorithms:\n- Argon2id: Winner of the Password Hashing Competition. Configurable memory, iterations, and parallelism — resists GPU and ASIC attacks.\n- Bcrypt: Battle-tested Blowfish-based; configure work factor ≥ 12.\n\n## Rate Limiting Algorithms\n- Token Bucket: Tokens refill at a steady rate. Allows bursts up to bucket capacity. Ideal for web APIs.\n- Sliding Window Log: Tracks exact request timestamps in Redis Sorted Sets. Highly accurate, but memory-intensive.\n- Sliding Window Counter: Blends prior window counts with current window. Low memory footprint, high accuracy.',
    realWorld: 'Auth0 and AWS Cognito implement OAuth 2.0 + OIDC for millions of apps. GitHub uses PKCE for its OAuth apps. Uber uses JWT for short-lived API tokens with Redis-based revocation lists. The 2021 Log4Shell vulnerability enabled SSRF-style remote code execution. The 2017 Equifax breach was caused by a SQL injection in an unpatched library.',
    advantages: [
      'JWT enables stateless authentication — any microservice verifies tokens without a central DB call',
      'OAuth 2.0 + PKCE provides secure delegated authorization without exposing user credentials to third parties',
      'Argon2id makes offline brute-force attacks computationally infeasible with its memory-hard algorithm',
      'RBAC middleware centralizes permission logic, preventing scattered authorization checks'
    ],
    disadvantages: [
      'JWT revocation requires a distributed blacklist (Redis), negating some stateless benefits',
      'OAuth 2.0 flow complexity: authorization code, tokens, refresh tokens, PKCE — easy to implement incorrectly',
      'SameSite=Strict cookies break OAuth flows requiring cross-site redirects',
      'CSRF protection with double-submit tokens requires careful implementation to avoid bypasses'
    ],
    tradeoffs: 'Stateful sessions: instant revocation, requires central DB. JWT: stateless/distributed, complex revocation. Argon2id: secure but ~100ms hash time (intentional — prevents brute force but limits login throughput).',
    alternatives: ['OAuth2 + OIDC with JWTs', 'Stateful session cookies with Redis session store', 'PASETO (Platform-Agnostic Security Tokens)', 'Mutual TLS (mTLS) for microservice zero-trust'],
    whenToUse: 'JWT: Distributed microservices where stateless auth is essential. Stateful sessions: Monolith or small services where instant revocation is required. OAuth 2.0: Third-party app integrations, delegated access. OIDC: Single Sign-On (SSO) across multiple applications.',
    whenNotToUse: 'Do not store JWT in localStorage (XSS vulnerable) — use HttpOnly cookies. Do not implement OAuth without PKCE for SPA/mobile. Never hash passwords with SHA-256 or MD5.',
    commonMistakes: [
      'Storing JWTs in localStorage instead of HttpOnly cookies, exposing them to XSS attacks',
      'Not verifying the JWT algorithm field (alg: none attack or RS256 vs HS256 confusion)',
      'Using sequential integer IDs (1, 2, 3) for resources — enables IDOR/BOLA enumeration attacks',
      'Allowing CORS wildcard (Access-Control-Allow-Origin: *) on authenticated API endpoints'
    ],
    interviewQuestions: [
      { q: 'What is the difference between authentication and authorization? Give examples.', a: 'Authentication: Who are you? Verifying identity. Examples: password login, biometric, JWT/session validation. Authorization: What are you allowed to do? Enforcing permissions. Examples: RBAC (role: admin can delete users, viewer cannot), ABAC (attribute-based: can only access resources in your department), BOLA check (can only read your own invoices). Authentication must happen before authorization. A common mistake is confusing the two — a server that checks a valid JWT (authentication) but doesn\'t check if that user owns the requested resource (authorization) is vulnerable to BOLA/IDOR attacks.' },
      { q: 'Explain how SQL injection works and how parameterized queries prevent it.', a: 'SQL injection: An attacker injects SQL syntax into an input field. Example: username input: admin\' OR 1=1 --. If concatenated directly: SELECT * FROM users WHERE username = \'admin\' OR 1=1 --\'. This returns all users. Worse: \'admin\'; DROP TABLE users; -- deletes the table. Parameterized prepared statements: the query structure is compiled first (SELECT * FROM users WHERE username = ?), and the input is passed as a separate parameter. The database driver ensures the parameter is treated purely as a value, never as SQL syntax. ORMs automatically use parameterized queries, but raw string concatenation in SQL is always dangerous.' },
      { q: 'What is SSRF and how would you prevent it in a backend service?', a: 'SSRF (Server-Side Request Forgery): An attacker tricks the server into making an HTTP request to an internal URL. Example: an API endpoint that fetches a user-provided URL. Attacker provides http://169.254.169.254/latest/meta-data/iam/security-credentials/ (AWS EC2 metadata endpoint) to steal cloud IAM credentials. Prevention: (1) Validate and allowlist permitted URL schemes and domains. (2) Block requests to private IP ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16. (3) Route all outbound HTTP requests through a dedicated forward proxy that enforces the allowlist. (4) Use IMDSv2 on AWS (requires a session token for metadata access).' }
    ],
    resources: [
      { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', type: 'docs' },
      { title: 'OAuth 2.0 Security Best Practices — RFC 9700', url: 'https://datatracker.ietf.org/doc/html/rfc9700', type: 'docs' },
      { title: 'JWT Security Best Practices', url: 'https://curity.io/resources/learn/jwt-best-practices/', type: 'article' }
    ],
    relatedTopics: ['backend-api-design', 'backend-networking', 'spring-security-jwt'],
  },

  // ===== BACKEND: CACHING =====
  'backend-caching': {
    id: 'backend-caching',
    title: 'Advanced Caching Strategies & Invalidation Patterns',
    subject: 'Backend Engineering',
    category: 'Backend',
    difficulty: 'Advanced',
    estimatedTime: '55 min',
    tags: ['caching', 'Redis', 'CDN', 'cache-aside', 'write-through', 'LRU', 'cache-stampede', 'cache-penetration', 'TTL'],
    what: 'Caching bridges the latency gap between fast in-memory execution (Redis: ~0.1ms) and slower persistent disk access (PostgreSQL: 1-50ms). Caching topologies: Cache-Aside (app checks cache, on miss loads from DB), Read-Through (cache handles DB reads transparently), Write-Through (synchronous cache + DB write), Write-Behind (async batch DB updates). Eviction policies: LRU (Least Recently Used), LFU (Least Frequently Used). Critical failure modes: Cache Avalanche (mass expiry), Cache Stampede/Thundering Herd (hot key expiry), Cache Penetration (non-existent keys hitting DB).',
    why: 'A single Redis cache layer can absorb 95%+ of read traffic, reducing database load by orders of magnitude. Without proper caching, databases become bottlenecks under read-heavy loads. Without proper invalidation and failure mode protection, caching systems can cascade and overwhelm the database (the exact failure mode they are designed to prevent).',
    how: '## Cache-Aside (Lazy Loading)\nApplication checks cache → hit: return cached value. Miss: load from DB, populate cache, return value. Cache failures do not cascade to DB failures. Most common pattern for read-heavy workloads.\n\n## Read-Through\nApp treats cache as the primary store. Cache library handles DB reads transparently. Simplifies app code but cache provider must support it.\n\n## Write-Through\nWrites update cache AND primary DB synchronously. Guarantees strong read consistency immediately after write. Doubles write latency.\n\n## Write-Behind (Write-Back)\nWrites update cache instantly; background workers batch-flush to DB. Highest write throughput. Risk: data loss if cache crashes before flushing.\n\n## Failure Mode Protections\n- **Cache Avalanche:** Many keys expire simultaneously → DB overwhelmed. Fix: add random jitter to TTLs (TTL = base + random(0, jitter)).\n- **Cache Stampede (Thundering Herd):** Hot key expires → hundreds of concurrent DB queries. Fix: Probabilistic Early Recomputation or distributed mutex locking (Redlock).\n- **Cache Penetration:** Requests for non-existent keys bypass cache and hit DB repeatedly. Fix: Bloom filter (probabilistic membership check) or cache null values with short TTL.',
    internals: '## LRU vs LFU Eviction\nLRU (Least Recently Used): Discards items not accessed for the longest time. Implemented via a doubly-linked list + HashMap (O(1) access + O(1) eviction). Weakness: a one-time scan of cold data evicts hot items (cache pollution).\nLFU (Least Frequently Used): Tracks access frequency; discards items with lowest count. Better for stable popularity distributions; more complex to implement.\n\n## Redlock Algorithm\nFor distributed Cache Stampede protection: client tries to acquire a lock in Redis using SET key value NX PX 30000 (atomic SET if not exists with 30s TTL). Only one client acquires the lock and recomputes the cache value; others wait or serve the stale value. Uses majority quorum across 5 Redis instances for fault tolerance.\n\n## Cache Warming Strategies\nPre-populating cache before traffic hits: (1) Scheduled batch jobs load popular data. (2) Shadow traffic replays production requests against a new cache. (3) Gradual traffic shifting allows the cache to warm under real load.',
    realWorld: 'Twitter caches each user\'s home timeline in Redis (300M users\' timelines pre-computed). Instagram caches user media metadata in Memcached. Netflix uses EVCache (built on Memcached) with 700+ nodes globally. Cloudflare\'s CDN caches petabytes of content at 300+ PoPs worldwide. Facebook TAO is a distributed cache serving social graph reads at trillion-request-per-day scale.',
    advantages: [
      'Redis cache layer reduces database load by 90-99% for read-heavy workloads',
      'Write-behind pattern absorbs write bursts without overloading the primary database',
      'Bloom filters eliminate cache penetration attacks with just 10 bits per element (~1% false positive rate)',
      'CDN edge caching serves content in <10ms globally without hitting origin servers'
    ],
    disadvantages: [
      'Cache invalidation is one of the hardest problems in computer science — stale data causes incorrect behavior',
      'Write-behind caching risks data loss on cache server crash before flush',
      'Distributed Redlock has race conditions in certain network partition scenarios',
      'Cache warming after a cold start causes a DB thundering herd until the cache heats up'
    ],
    tradeoffs: 'Strong consistency (Write-Through, double write latency) vs. eventual consistency (Write-Behind, data loss risk). LRU (recency-optimized) vs. LFU (frequency-optimized). Low TTL (fresh data, high DB load) vs. high TTL (stale data, low DB load).',
    alternatives: ['Cache-Aside (Lazy loading)', 'Write-Through / Write-Back caching', 'Refresh-Ahead (Proactive cache warming)', 'Two-tier caching (In-memory Caffeine + Distributed Redis)'],
    whenToUse: 'Cache-Aside: General read-heavy workloads, user profile data, product catalog. Write-Through: Financial account balances where consistency is critical. Write-Behind: High-write click counters, analytics event aggregation. Bloom Filters: Cache penetration protection for any endpoint receiving random key queries.',
    whenNotToUse: 'Do not cache frequently updated data with high consistency requirements (live stock prices, seat inventory). Avoid caching large binary blobs in Redis that exhaust memory budget. Don\'t use Write-Behind for any data where loss is unacceptable.',
    commonMistakes: [
      'Not adding TTL jitter, causing cache avalanche when batch-loaded keys all expire simultaneously',
      'Caching mutable user-specific data globally instead of per-user, causing data leakage between users',
      'Not monitoring cache hit rate — a low hit rate (< 80%) indicates the cache is not effective',
      'Setting TTL too long for user session data, causing stale authorization state after role changes'
    ],
    interviewQuestions: [
      { q: 'What is a Cache Stampede (Thundering Herd) and how do you prevent it?', a: 'A Cache Stampede occurs when a highly popular (hot) cache key expires. All concurrent requests simultaneously get a cache miss, query the database, and attempt to write the result back. For a key receiving 10,000 req/s, this means 10,000 simultaneous DB queries in the milliseconds after expiry. Prevention strategies: (1) Probabilistic Early Recomputation: before the TTL expires, a small probability of triggering a background cache refresh increases, so the cache is refreshed before it actually expires. (2) Distributed Mutex (Redlock): only one process acquires the lock to recompute; others either wait or serve the stale value temporarily. (3) Stale-While-Revalidate: serve the stale cached value immediately while triggering an async background refresh.' },
      { q: 'Compare Cache-Aside and Write-Through patterns. When would you use each?', a: 'Cache-Aside (Lazy Loading): On read, check cache → miss → load from DB → populate cache → return. Pros: only requested data is cached (memory efficient), cache failures don\'t break reads. Cons: first request after cache miss always hits DB (cold start latency), potential for stale data between write and next cache miss. Use for: read-heavy workloads, general-purpose caching. Write-Through: On write, update both cache and DB synchronously. Pros: cache is always consistent with DB, reads always hit cache after first write. Cons: every write is slower (cache + DB latency), unused cached data occupies memory. Use for: write-then-read patterns where consistency is critical (user profile updates).' },
      { q: 'What is Cache Penetration? How does a Bloom filter prevent it?', a: 'Cache Penetration: an attacker or buggy client continuously requests keys that don\'t exist in cache or DB (e.g., random UUIDs). Each request gets a cache miss, queries the DB (also a miss), and returns empty. Sustained at high RPS, this bypasses the cache entirely and overwhelms the DB. A Bloom filter is a probabilistic data structure that answers: "Is this element in the set?" with zero false negatives (if it says no, the element definitely doesn\'t exist) but small false positive rate (~1%). Store all valid resource IDs in a Bloom filter. Before hitting cache/DB, check the Bloom filter. If it says "not in set", return 404 immediately — no DB query needed.' }
    ],
    resources: [
      { title: 'Redis Caching Patterns', url: 'https://redis.io/docs/manual/patterns/', type: 'docs' },
      { title: 'Caching Best Practices — AWS', url: 'https://aws.amazon.com/caching/best-practices/', type: 'article' }
    ],
    relatedTopics: ['redis-concurrency', 'backend-distributed-systems', 'backend-databases-rdbms'],
  },

  // ===== BACKEND: DISTRIBUTED SYSTEMS =====
  'backend-distributed-systems': {
    id: 'backend-distributed-systems',
    title: 'Distributed Systems Theory: CAP, PACELC & Scalability',
    subject: 'Backend Engineering',
    category: 'Backend',
    difficulty: 'Expert',
    estimatedTime: '75 min',
    tags: ['CAP-theorem', 'PACELC', 'sharding', 'consistent-hashing', 'replication', 'circuit-breaker', 'bulkhead', 'microservices'],
    what: 'Distributed systems theory explains the fundamental trade-offs that govern every distributed database and microservice architecture. CAP Theorem: under a Network Partition, a system must choose between Consistency (C) or Availability (A). PACELC extends this: Else (during normal operation), choose between Latency (L) or Consistency (C). Horizontal Sharding distributes a database across physical machines by a Shard Key. Consistent Hashing minimizes remapping when nodes are added/removed. Synchronous replication guarantees zero data loss at the cost of write latency; asynchronous replication provides lower latency at the risk of replication lag.',
    why: 'Engineers who don\'t understand CAP/PACELC make wrong database choices (using Cassandra when strong consistency is required, or PostgreSQL when linear horizontal scale is needed). Misunderstanding sharding leads to hotspot partitions that eliminate all scaling benefit. Without circuit breakers and bulkheads, a slow downstream microservice cascades failures across the entire system.',
    how: '## CAP Theorem\nCP Systems (HBase, ZooKeeper, etcd): Reject stale reads during network partitions — sacrifice availability to maintain consistency. Used for leader election, distributed locks, configuration.\nAP Systems (Cassandra, DynamoDB): Serve potentially stale reads to stay available during partitions. Used for user sessions, shopping carts, social feeds where eventual consistency is acceptable.\n\n## PACELC Theorem\nExtends CAP to normal (non-partition) operation: MongoDB (PC/EC): prioritizes consistency over latency during normal operations. DynamoDB (PA/EL): prioritizes availability and latency.\n\n## Horizontal Sharding\nRange-based sharding: shard by value range (A-M → Shard 1, N-Z → Shard 2). Problem: leads to write hotspots if data is skewed. Hash-based sharding: hash(key) % N distributes writes evenly. Consistent Hashing: nodes and keys are mapped to a 360° virtual ring. Adding/removing a node only migrates K/N keys (K = keys on that node). Virtual nodes (vnodes) ensure uniform distribution.\n\n## Replication\nSynchronous: Leader waits for all ISR replicas to confirm disk write. Zero data loss, higher write latency.\nAsynchronous: Leader commits immediately; replicas sync asynchronously. Lower latency, risks replication lag and data loss on failover.',
    internals: '## Microservices Resilience Patterns\n**Circuit Breaker:** Monitors downstream failure rate. Closed (normal) → Open (failing fast, no requests forwarded) → Half-Open (probing recovery). Prevents thread pool exhaustion by failing fast.\n\n**Bulkhead Pattern:** Isolates resource pools (thread pools, semaphores, connection pools) per downstream dependency. A slow payment service can only exhaust its own thread pool — user service threads remain unaffected.\n\n**API Gateway / BFF:** Centralizes SSL termination, rate limiting, JWT validation, and request transformation. BFF (Backend for Frontend) provides optimized APIs for each client type (mobile, web, IoT).\n\n## Zero-Downtime Database Migrations\nExpand and Contract Pattern:\n1. Add new nullable column\n2. Deploy app writing to both old and new columns\n3. Backfill historical data\n4. Update reads to new column\n5. Deprecate and drop old column (after confirming rollout)\nNever: ALTER TABLE on a live database in a single step on a large table (table lock).',
    realWorld: 'Netflix uses circuit breakers (Hystrix/Resilience4j) between all microservices. DynamoDB (AP/EL) powers Amazon\'s shopping cart — availability over consistency. etcd (CP) is used by Kubernetes for cluster state storage. Cassandra (AP/EL) powers Discord\'s message storage with 4B messages/day. Consistent hashing is used by Memcached, Cassandra, and AWS DynamoDB for key distribution.',
    advantages: [
      'Consistent hashing minimizes data migration when adding/removing cache or database nodes',
      'Circuit breakers prevent cascading failures by failing fast rather than exhausting thread pools',
      'Bulkheads provide fault isolation — one slow service cannot take down unrelated services',
      'AP systems (Cassandra) provide 99.999% availability even during data center partitions'
    ],
    disadvantages: [
      'CAP is a fundamental constraint — you cannot have Consistency AND Availability during a partition',
      'Hash-based sharding requires rebalancing when changing the number of shards (consistent hashing mitigates this)',
      'Asynchronous replication risks losing committed writes on leader failure before replication completes',
      'Expand-and-Contract migrations are slow (sometimes months for large tables) and require careful coordination'
    ],
    tradeoffs: 'Consistency vs Availability (CAP). Latency vs Consistency (PACELC). Synchronous replication (zero data loss, higher latency) vs Asynchronous (lower latency, possible data loss). Circuit breaker fail-fast (better UX under failures) vs timeout/retry (potentially recovering from transient errors).',
    alternatives: ['Strict Consistency with Raft / Paxos (etcd, Consul)', 'Eventual Consistency with CRDTs / Vector Clocks (Dynamo, Cassandra)', 'Two-Phase Commit (2PC / XA transactions)', 'Saga Pattern (Choreographed or Orchestrated)'],
    whenToUse: 'CP systems (etcd, ZooKeeper): Distributed locks, leader election, configuration management. AP systems (Cassandra, DynamoDB): Session stores, shopping carts, social feeds, IoT time-series. Circuit breakers: Any synchronous microservice-to-microservice call. Consistent hashing: Distributed caches (Memcached, Redis Cluster), database sharding.',
    whenNotToUse: 'Do not use AP systems for financial ledgers requiring strict consistency. Avoid sharding prematurely — PostgreSQL with read replicas and connection pooling handles significant scale before sharding is needed.',
    commonMistakes: [
      'Choosing the wrong CAP properties for a use case — using an AP database for financial transactions',
      'Range-based sharding without analyzing data distribution, causing hotspot partitions',
      'Not setting circuit breaker timeouts correctly — too low causes false positives; too high wastes thread pool capacity',
      'Running breaking schema migrations (DROP COLUMN, ALTER TYPE) on live production databases without the expand-contract pattern'
    ],
    interviewQuestions: [
      { q: 'Explain CAP Theorem. Give an example of a CP and an AP system and when you would choose each.', a: 'CAP Theorem (Brewer, 2000): A distributed system cannot simultaneously guarantee all three: Consistency (every read returns the most recent write), Availability (every request receives a response), and Partition Tolerance (system continues operating despite network partitions). Since network partitions are unavoidable in distributed systems, the real choice is CP vs AP. CP System example: etcd/ZooKeeper. Under partition, etcd stops serving reads from minority partitions to avoid stale data. Choose for: distributed locks, leader election, Kubernetes cluster state. AP System example: Cassandra/DynamoDB. Under partition, all nodes continue serving reads (possibly stale). Choose for: shopping carts, user sessions, social feeds where eventual consistency is acceptable.' },
      { q: 'How does consistent hashing work? What problem does it solve compared to hash(key) % N?', a: 'hash(key) % N: When N changes (node added or removed), almost all keys remap to new nodes — requires migrating N-1/N of all data. Consistent hashing: maps both nodes and keys to positions on a 360° virtual ring using the same hash function. Each key is assigned to the first node clockwise from its position. When a node is removed, only its keys (K/N total keys) migrate to the next clockwise node. Adding a node only moves keys from the next clockwise neighbor. Virtual nodes (vnodes): each physical node gets multiple positions on the ring (e.g., 150 vnodes) for uniform load distribution. Used by: Cassandra, Memcached, Redis Cluster, AWS DynamoDB.' },
      { q: 'What is the Circuit Breaker pattern? Describe its state machine.', a: 'Circuit Breaker monitors downstream service calls and prevents cascading failures. States: Closed (normal): requests pass through; failure rate tracked. If failure rate exceeds threshold (e.g., >50% in last 10 requests), transition to Open. Open (failing fast): requests immediately fail without calling downstream. Saves thread pool capacity. After a timeout (e.g., 30s), transition to Half-Open. Half-Open (probing): allow a limited number of test requests. If they succeed: transition back to Closed. If they fail: return to Open. Implementations: Netflix Hystrix (deprecated), Resilience4j (Java), Polly (.NET), Python circuitbreaker library.' }
    ],
    resources: [
      { title: 'Designing Data-Intensive Applications — Kleppmann', url: 'https://dataintensive.net', type: 'book', author: 'Martin Kleppmann' },
      { title: 'CAP Twelve Years Later — Eric Brewer', url: 'https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/', type: 'article' },
      { title: 'Resilience4j Documentation', url: 'https://resilience4j.readme.io', type: 'docs' }
    ],
    relatedTopics: ['backend-nosql', 'backend-messaging', 'backend-caching'],
  },

  // ===== BACKEND: DEVOPS & CONTAINERS =====
  'backend-devops-containers': {
    id: 'backend-devops-containers',
    title: 'DevOps, Docker & Kubernetes (K8s) Architecture',
    subject: 'Backend Engineering',
    category: 'Backend',
    difficulty: 'Advanced',
    estimatedTime: '65 min',
    tags: ['Docker', 'Kubernetes', 'containers', 'DevOps', 'K8s', 'CI/CD', 'deployment', 'orchestration'],
    what: 'Modern backend engineers own the lifecycle of their code beyond the local IDE. Docker containers are isolated Linux processes sharing the host OS kernel, enforced via Linux namespaces (pid, net, mnt, user) and cgroups (CPU shares, RAM limits, disk I/O). Kubernetes (K8s) orchestrates container deployment, self-healing, and elasticity. The Control Plane consists of: kube-apiserver, etcd (distributed state store), kube-scheduler, and controller-manager. Worker Nodes run: kubelet (node agent), kube-proxy (network routing), and the container runtime (containerd).',
    why: 'Without containerization, "works on my machine" bugs are inevitable due to OS, library, and environment differences. Without Kubernetes orchestration, scaling requires manual server management, self-healing requires manual intervention, and rolling deployments cause downtime. Modern cloud-native engineering demands fluency in Docker and K8s.',
    how: '## Docker Internals\nLinux Namespaces: Process isolation (pid), networking (net), filesystem mounts (mnt), user IDs (user). Effectively creates an isolated environment without a full hypervisor.\ncgroups (Control Groups): Enforce hardware boundaries — maximum CPU shares, RAM allocations, disk I/O bandwidth per container.\nMulti-Stage Builds: Compile binaries in a build image (includes compilers, dev dependencies). Copy only the minimal runtime artifacts into a lightweight scratch/alpine base image. Dramatically reduces image attack surface and size.\n\n## Kubernetes Architecture\nControl Plane: kube-apiserver (REST API entrypoint), etcd (distributed KV store for cluster state), kube-scheduler (assigns pods to nodes based on resource requests), controller-manager (reconciliation loops: ReplicaSet, Deployment, StatefulSet controllers).\nWorker Nodes: kubelet (node agent — applies pod specs, reports health), kube-proxy (iptables/IPVS rules for Service routing), containerd (container runtime).\nPrimitives: Pod (smallest deployable unit), Deployment (desired replica count + rolling update strategy), Service (stable ClusterIP, NodePort, or LoadBalancer), Ingress (HTTP/HTTPS routing rules).',
    internals: '## Kubernetes Pod Scheduling\nScheduler selects nodes based on: ResourceRequests (CPU/memory requests), NodeSelector/Affinity (label matching), Taints and Tolerations (dedicated node pools), Pod Anti-Affinity (spread across failure domains).\n\n## Rolling Update Strategy\nDeployment spec: maxSurge (extra pods during update), maxUnavailable (pods that can be down). Rolling update replaces pods incrementally — zero downtime if health checks are correct.\n\n## Graceful Shutdown\nSIGTERM Protocol: When K8s scales down a pod: 1) Stop accepting new HTTP requests. 2) Allow ongoing DB transactions to complete. 3) Close DB pool and cache connections. 4) Exit within terminationGracePeriodSeconds before SIGKILL.',
    realWorld: 'Google runs 2 billion container instances per week on Borg (the internal predecessor to Kubernetes). Spotify, Airbnb, and Lyft run their entire backend on Kubernetes. Docker Hub hosts 8M+ container images. GitHub Actions and GitLab CI use Docker containers for every CI/CD build step.',
    advantages: [
      'Docker containers ensure identical environments from dev to prod — eliminates environment-specific bugs',
      'Kubernetes self-healing: automatically restarts crashed pods and reschedules on failed nodes',
      'K8s Horizontal Pod Autoscaler scales pods based on CPU/memory metrics automatically',
      'Multi-stage Docker builds reduce production image size by 80-95% vs single-stage builds'
    ],
    disadvantages: [
      'Kubernetes has a steep learning curve — significant operational overhead for small teams',
      'Container images are immutable: any config change requires building and deploying a new image',
      'K8s networking (CNI, Service mesh) adds complexity and potential performance overhead',
      'etcd is a critical single point of failure for the entire K8s cluster control plane'
    ],
    tradeoffs: 'Docker Compose (simple, single-host) vs Kubernetes (complex, multi-node, production-grade). Kubernetes self-manages scaling and healing but adds significant operational complexity. Container isolation is strong but not as strong as VM isolation (shared kernel).',
    alternatives: ['Kubernetes (K8s container orchestration)', 'Docker Swarm (Lightweight cluster orchestration)', 'AWS ECS / Fargate (Managed serverless containers)', 'Serverless Functions (AWS Lambda, Cloudflare Workers)'],
    whenToUse: 'Docker: All production deployments — every service should be containerized for reproducibility. Kubernetes: When you have multiple services, need horizontal scaling, self-healing, and rolling deployments. Start with managed K8s (EKS, GKE, AKS) to reduce operational burden.',
    whenNotToUse: 'Kubernetes is overkill for a single-service application with low traffic — use Docker Compose or a managed PaaS. Avoid Docker for latency-critical system-level services that need direct hardware access.',
    commonMistakes: [
      'Running containers as root (use USER directive in Dockerfile to drop privileges)',
      'Not setting resource requests and limits on K8s pods — causes CPU throttling or OOM kills',
      'Storing state in containers (e.g., writing files to the container filesystem) — use PersistentVolumes',
      'Not implementing SIGTERM handler for graceful shutdown, causing abrupt connection drops during pod restarts'
    ],
    interviewQuestions: [
      { q: 'How does Docker container isolation work? What are Linux namespaces and cgroups?', a: 'Docker containers are Linux processes, not VMs. Isolation comes from two kernel features: Namespaces provide scoped views of system resources: PID namespace (container processes can\'t see host processes), Network namespace (isolated networking stack — separate IP address, routes, interfaces), Mount namespace (isolated filesystem tree from a container image), User namespace (map container root to an unprivileged host user). cgroups (Control Groups) enforce resource limits: max CPU shares (prevents one container monopolizing CPU), max RAM allocation (container gets SIGKILL on OOM), disk I/O rate limits. Containers share the host OS kernel — they are 10-100× lighter than VMs but provide weaker security isolation.' },
      { q: 'What are the components of a Kubernetes Control Plane? What happens if etcd goes down?', a: 'Control Plane: kube-apiserver: REST API server, the gateway for all cluster communication (kubectl, kubelet, controllers all call this). etcd: Distributed consistent KV store holding ALL cluster state (pods, deployments, configmaps, secrets). kube-scheduler: Watches for unscheduled pods and assigns them to nodes based on resource availability, affinity, taints. controller-manager: Runs reconciliation loops (ReplicaSet controller ensures desired replica count; Deployment controller manages rolling updates). If etcd goes down: the apiserver loses its backend store — new API calls fail. Existing running pods continue running (kubelet runs independently on nodes) but cannot be modified, rescheduled, or scaled. The cluster becomes read-only in terms of desired state management.' },
      { q: 'How does a Kubernetes rolling update work? How does it achieve zero downtime?', a: 'A Deployment rolling update works by incrementally replacing old pods with new ones: 1) New ReplicaSet created with updated pod template. 2) Scale up new RS by maxSurge (default: 1) — new pod starts and must pass readinessProbe. 3) Once new pod is Ready (passes health check), scale down old RS by 1 (respecting maxUnavailable). 4) Repeat until old RS has 0 replicas. Zero downtime requires: (a) readinessProbe configured correctly (pod not marked Ready until it can serve traffic), (b) liveness probe to detect unhealthy pods, (c) preStop hook + terminationGracePeriodSeconds to allow in-flight requests to complete before shutdown, (d) sufficient cluster resources to run maxSurge extra pods during transition.' }
    ],
    resources: [
      { title: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs/', type: 'docs' },
      { title: 'Docker Documentation', url: 'https://docs.docker.com', type: 'docs' },
      { title: 'Kubernetes in Action — Marko Luksa', url: 'https://www.manning.com/books/kubernetes-in-action', type: 'book', author: 'Marko Luksa' }
    ],
    relatedTopics: ['backend-observability', 'backend-distributed-systems'],
  },

  // ===== BACKEND: OBSERVABILITY =====
  'backend-observability': {
    id: 'backend-observability',
    title: 'Observability: Metrics, Logging, Tracing & Production Reliability',
    subject: 'Backend Engineering',
    category: 'Backend',
    difficulty: 'Advanced',
    estimatedTime: '50 min',
    tags: ['observability', 'Prometheus', 'Grafana', 'OpenTelemetry', 'distributed-tracing', 'logging', 'SLO', 'SLA', 'metrics'],
    what: 'Observability is the ability to understand the internal state of a system from its external outputs. The Three Pillars: Metrics (Prometheus/Grafana): numeric time-series data aggregated over intervals to measure health — Four Golden Signals: Latency, Traffic (RPS), Errors (5xx rate), Saturation (CPU/memory/connection pool). Structured Logging (ELK stack): append-only JSON records of discrete events with trace_id, service, user_id fields. Distributed Tracing (OpenTelemetry): tracks request execution flow across microservice boundaries using spans and W3C traceparent headers.',
    why: 'Without observability, production incidents are investigated by reading code and guessing. With metrics, you know WHAT is broken (5xx rate spike). With distributed tracing, you know WHERE (which microservice, which downstream call). With structured logging, you know WHY (specific error message and stack trace). All three are required for modern microservice debugging.',
    how: '## Metrics: Prometheus & Grafana\nPrometheus scrapes metrics from /metrics endpoints (pull model). Metric types: Counter (monotonically increasing: request_total), Gauge (current value: active_connections), Histogram (measures distributions: request_duration_bucket[le]). PromQL queries p95 latency: histogram_quantile(0.95, rate(request_duration_bucket[5m])).\n\n## Structured Logging (ELK Stack)\nJSON format with mandatory fields: {level, timestamp, service, trace_id, user_id, message}. Ingestion pipeline: application writes to stdout → Fluentbit/Vector collects → Elasticsearch/OpenSearch indexes → Kibana queries. trace_id links logs to distributed traces for cross-service correlation.\n\n## Distributed Tracing: OpenTelemetry\nContext Propagation: injects W3C traceparent headers into every outgoing HTTP/gRPC request. Each service creates child spans from the incoming trace context. Spans measure: downstream call latency, database query time, cache hit/miss. Trace visualized as a waterfall diagram across service boundaries. Backends: Jaeger, Tempo, AWS X-Ray.',
    internals: '## Four Golden Signals (SRE)\n- **Latency:** p50, p95, p99 request duration. p99 of 2s with p50 of 100ms indicates long-tail issues.\n- **Traffic:** Requests per second (RPS). Baseline + alert on sudden drops (upstream failure) or spikes.\n- **Errors:** 5xx error rate. Alert at >0.1% for critical services. Distinguish application errors from downstream failures.\n- **Saturation:** CPU %, memory %, connection pool utilization %. Alert before hitting 100% to allow scale-out time.\n\n## SLI, SLO, SLA\nSLI (Service Level Indicator): The actual measured metric (e.g., 99.5% of requests served < 200ms).\nSLO (Service Level Objective): Internal target (e.g., 99.9% of requests < 200ms).\nSLA (Service Level Agreement): External customer contract (e.g., 99.9% uptime monthly, financial penalty if breached).\nError Budget: 1 - SLO target. A 99.9% SLO allows 43.8 minutes of downtime per month.',
    realWorld: 'Google SRE pioneered the Four Golden Signals concept. Netflix uses Atlas (metrics), Mantis (stream processing), and Zipkin (tracing). OpenTelemetry is the CNCF standard adopted by AWS, Azure, and GCP. Datadog provides a unified observability platform used by Airbnb, DoorDash, and 25,000+ companies. Cloudflare monitors 1M+ metrics in real time across its global network.',
    advantages: [
      'Distributed tracing pinpoints which microservice and which downstream call is causing latency in seconds',
      'Structured logging with trace_id enables correlating logs across 10+ microservices for a single request',
      'Prometheus histograms accurately measure p99 latency without sampling bias',
      'Error budgets make reliability quantifiable and enable data-driven decisions about feature velocity vs. stability'
    ],
    disadvantages: [
      'OpenTelemetry instrumentation adds ~1-3% CPU overhead per service',
      'High-cardinality metrics (per-user or per-request labels) cause Prometheus cardinality explosion',
      'Log volume at scale (terabytes/day) requires expensive Elasticsearch infrastructure',
      'Distributed traces are sampled (typically 1-10%) to control storage costs, potentially missing rare errors'
    ],
    tradeoffs: 'Full trace sampling (100%) = complete visibility, high storage cost. Head-based sampling = low cost, misses rare errors. Tail-based sampling = only records slow/error traces, complex to implement. Structured logging with trace_id is cheaper than full tracing but provides less visual context.',
    alternatives: ['Prometheus + Grafana (Metrics)', 'ELK Stack / OpenSearch (Centralized logs)', 'OpenTelemetry (Unified instrumentation for traces/metrics/logs)', 'Datadog / New Relic (Commercial APM suite)'],
    whenToUse: 'Always — production microservices without observability are unmaintainable. Implement metrics (Prometheus), structured logging (JSON to stdout), and distributed tracing (OpenTelemetry) from day one. Define SLOs before going to production.',
    whenNotToUse: 'Do not log sensitive PII (passwords, card numbers, SSNs) even in debug mode. Avoid high-cardinality Prometheus labels (user_id, request_id) — creates millions of time series.',
    commonMistakes: [
      'Not adding trace_id to log lines, making cross-service correlation impossible during incidents',
      'Using high-cardinality labels in Prometheus metrics (e.g., per-user labels), causing memory OOM',
      'Setting p99 SLO thresholds without measuring actual traffic distribution first',
      'Not configuring log rotation and retention policies, causing disk space exhaustion'
    ],
    interviewQuestions: [
      { q: 'What are the Four Golden Signals? How do you use them during an incident?', a: 'The Four Golden Signals (Google SRE): Latency: How long are requests taking? Measure p50, p95, p99. A p99 spike with normal p50 indicates long-tail issues (slow queries, GC pauses). Traffic: How many requests per second? Sudden drops may indicate upstream failure or DNS issues. Errors: What % of requests are failing (5xx)? Distinguish between client errors (4xx) and server errors (5xx). Saturation: How full is the system? CPU %, memory %, thread pool %, connection pool %. Alert before hitting 100% to trigger scale-out. Incident response: start with Errors (is there a problem?), then Latency (which requests are slow?), Saturation (is anything maxed out?), Traffic (is the pattern normal?).' },
      { q: 'How does distributed tracing work with OpenTelemetry? What is a span?', a: 'OpenTelemetry adds distributed tracing by propagating context across service boundaries via HTTP headers (W3C Trace Context: traceparent: 00-{traceId}-{parentSpanId}-{flags}). Each service creates a Span: a named, timed operation (e.g., "HTTP GET /users", "SELECT * FROM users", "Redis GET cache:user:123"). Spans are linked via parent-child relationships, forming a Trace (a tree of spans for a single request). The root span starts at the API gateway. Each downstream call creates a child span. The trace visualizes as a Gantt/waterfall diagram, immediately showing where time is spent (which service, which DB query, which cache operation). Exporters send span data to Jaeger/Tempo/X-Ray for visualization and analysis.' },
      { q: 'What is the difference between SLI, SLO, and SLA?', a: 'SLI (Service Level Indicator): The actual measured metric. Examples: request success rate, p99 latency, availability percentage. SLO (Service Level Objective): Internal engineering target for an SLI. Example: 99.9% of API requests complete < 500ms. SLOs drive operational decisions — if you\'re burning error budget, feature work stops, reliability work prioritized. SLA (Service Level Agreement): Legal contract with customers defining minimum service guarantees. Usually less strict than SLO (engineers target 99.95% to guarantee 99.9% SLA). Penalty: financial credits or refunds if breached. Error Budget: 1 - SLO = acceptable failure budget. 99.9% SLO = 43.8 min/month downtime budget. Error budgets make reliability decisions data-driven: if budget is exhausted, release freeze.' }
    ],
    resources: [
      { title: 'Site Reliability Engineering — Google SRE Book', url: 'https://sre.google/sre-book/table-of-contents/', type: 'book' },
      { title: 'OpenTelemetry Documentation', url: 'https://opentelemetry.io/docs/', type: 'docs' },
      { title: 'Prometheus Documentation', url: 'https://prometheus.io/docs/', type: 'docs' }
    ],
    relatedTopics: ['backend-devops-containers', 'backend-distributed-systems'],
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
        id: 'networking',
        name: 'Networking & Protocols',
        topicIds: ['backend-networking', 'backend-http-protocols'],
      },
      {
        id: 'runtimes',
        name: 'Runtimes & Concurrency',
        topicIds: ['backend-concurrency-runtimes'],
      },
      {
        id: 'databases',
        name: 'Databases & Storage',
        topicIds: ['backend-databases-rdbms', 'backend-nosql', 'postgres-jsonb-mvcc', 'redis-concurrency'],
      },
      {
        id: 'api',
        name: 'API Design & Integration',
        topicIds: ['backend-api-design'],
      },
      {
        id: 'messaging',
        name: 'Messaging & Event-Driven',
        topicIds: ['backend-messaging', 'kafka'],
      },
      {
        id: 'security',
        name: 'Security & Authentication',
        topicIds: ['backend-security', 'spring-security-jwt'],
      },
      {
        id: 'caching',
        name: 'Caching Strategies',
        topicIds: ['backend-caching'],
      },
      {
        id: 'distributed',
        name: 'Distributed Systems Theory',
        topicIds: ['backend-distributed-systems'],
      },
      {
        id: 'devops',
        name: 'DevOps & Containers',
        topicIds: ['backend-devops-containers'],
      },
      {
        id: 'observability',
        name: 'Observability & Reliability',
        topicIds: ['backend-observability'],
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
