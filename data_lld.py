# LLD Systems Data extracted from self.pdf

LLD_TOPICS = [
    {
        "id": "lld-url-shortener",
        "title": "System 9: Distributed URL Shortener (TinyURL)",
        "subject": "System Design",
        "category": "LLD",
        "difficulty": "Intermediate",
        "estimatedTime": "45 min",
        "tags": ["Base62", "Token Generation Service", "Hashing", "Java", "Concurrency"],
        "what": """A low-level object-oriented design and complete Java implementation of a high-performance URL shortening engine.

The service converts long arbitrary URLs (up to 2048 chars) into compact 7-character alphanumeric aliases (`https://tiny.url/aZ9k1Qe`), supporting 3.52 Trillion unique short URLs ($62^7 = 3.52 \\times 10^{12}$) without collisions.""",
        "why": """Simple MD5 or SHA-256 truncation produces hash collisions that require database round-trip retry loops.

1. **Pre-allocated Distributed Ranges (Token Generation Service - TGS)**: A distributed coordinator (ZooKeeper) assigns non-overlapping sequential integer ranges (e.g. 1M to 2M) to each application server.
2. **Base62 Bijective Encoding**: Maps 64-bit integer IDs directly to alphanumeric characters (`[0-9a-zA-Z]`) with zero collisions and O(1) mathematical complexity.
3. **Thread-Safe Concurrent Lookups**: Local caches backstopped by persistent key-value mapping.""",
        "how": """1. Server boots and requests an ID range chunk from ZooKeeper (e.g., `range_start = 1000000`, `range_end = 2000000`).
2. Incoming `shorten(longUrl)` increments an internal `AtomicLong`.
3. The atomic integer converts to a 7-character string using Base62 division and remainder operations.
4. Short URL is stored in cache/database and returned to the caller in < 2ms.""",
        "internals": """## Base62 Math & Character Alphabet

Alphabet: `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ` (Total 62 symbols).

For 7 characters:
$$62^7 = 3,521,614,606,208 \\approx 3.52 \\text{ Trillion unique URLs}$$

At 1,000 writes/second:
$$\\frac{3.52 \\times 10^{12}}{1000 \\times 86400 \\times 365} \\approx 111 \\text{ years of capacity}$$""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        TINYURL LOW-LEVEL CLASS DESIGN                             |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +-----------------------------+        +--------------------------------------+  |
|  |     TinyUrlService          |        |        Base62Encoder                 |  |
|  +-----------------------------+        +--------------------------------------+  |
|  | - encoder: Base62Encoder    |------->| + encode(id: long): String           |  |
|  | - idGenerator: RangeIdGen   |        | + decode(shortUrl: String): long     |  |
|  | - urlStore: UrlRepository   |        +--------------------------------------+  |
|  +-----------------------------+                                                  |
|  | + shorten(url, ttl): String |        +--------------------------------------+  |
|  | + getOriginal(code): String |------->|        RangeIdGenerator              |  |
|  +-----------------------------+        +--------------------------------------+  |
|                 |                       | - currentId: AtomicLong              |  |
|                 v                       | - maxId: long                        |  |
|  +-----------------------------+        | + nextId(): long                     |  |
|  |        UrlMapping           |        +--------------------------------------+  |
|  +-----------------------------+                                                  |
|  | - shortKey: String          |                                                  |
|  | - originalUrl: String       |                                                  |
|  | - createdAt: Instant        |                                                  |
|  | - expiresAt: Instant        |                                                  |
|  +-----------------------------+                                                  |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "codeExample": """package com.system.lld.urlshortener;

import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.ConcurrentHashMap;
import java.time.Instant;
import java.util.Map;

public class TinyUrlSystem {
    private static final String ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int BASE = ALPHABET.length();
    
    public record UrlRecord(String shortKey, String longUrl, Instant expiresAt) {}

    public static class Base62 {
        public static String encode(long num) {
            if (num <= 0) return String.valueOf(ALPHABET.charAt(0));
            StringBuilder sb = new StringBuilder();
            while (num > 0) {
                sb.append(ALPHABET.charAt((int)(num % BASE)));
                num /= BASE;
            }
            return sb.reverse().toString();
        }

        public static long decode(String str) {
            long num = 0;
            for (char c : str.toCharArray()) {
                num = num * BASE + ALPHABET.indexOf(c);
            }
            return num;
        }
    }

    public static class RangeTokenGenerator {
        private final AtomicLong counter;
        private final long maxLimit;

        public RangeTokenGenerator(long start, long limit) {
            this.counter = new AtomicLong(start);
            this.maxLimit = limit;
        }

        public long nextId() {
            long id = counter.getAndIncrement();
            if (id > maxLimit) {
                throw new IllegalStateException("Range exhausted! Request new batch from ZooKeeper.");
            }
            return id;
        }
    }

    private final RangeTokenGenerator tokenGen;
    private final Map<String, UrlRecord> store = new ConcurrentHashMap<>();

    public TinyUrlSystem(long startRange, long endRange) {
        this.tokenGen = new RangeTokenGenerator(startRange, endRange);
    }

    public String shortenUrl(String longUrl, long ttlSeconds) {
        long id = tokenGen.nextId();
        String shortKey = Base62.encode(id);
        Instant expiry = (ttlSeconds > 0) ? Instant.now().plusSeconds(ttlSeconds) : Instant.MAX;
        store.put(shortKey, new UrlRecord(shortKey, longUrl, expiry));
        return "https://tiny.url/" + shortKey;
    }

    public String resolveUrl(String shortKey) {
        UrlRecord record = store.get(shortKey);
        if (record == null) return null;
        if (Instant.now().isAfter(record.expiresAt())) {
            store.remove(shortKey);
            return null; // Expired
        }
        return record.longUrl();
    }
}""",
        "realWorld": "Bitly and TinyURL process billions of redirects daily utilizing Base62 token generation with Redis LRU caches in front of distributed NoSQL databases.",
        "advantages": [
            "Zero hash collisions guaranteed by bijection math",
            "O(1) encode and decode runtime complexity",
            "Distributed scalability via ZooKeeper server token ranges"
        ],
        "disadvantages": [
            "Predictable sequential short URLs unless an internal Feistel cipher or permutation table is applied",
            "Coordination overhead when nodes exhaust their allocated token range"
        ],
        "tradeoffs": "Base62 with Counter (Zero collisions, predictable sequence) vs MD5 Hash Truncation (Non-sequential, high collision rate requiring DB retry loops). Base62 was chosen for production scalability.",
        "alternatives": ["MD5 / Murmur3 Hash Truncation", "UUID v4 base64 encoding", "Snowflake 64-bit ID"],
        "whenToUse": "URL shortening, affiliate link generation, compact referral code generators.",
        "whenNotToUse": "Cryptographically secure token generation where numbers must not be guessable.",
        "commonMistakes": [
            "Using MD5 hashing without handling collisions in concurrent threads",
            "Not supporting expiration TTL causing unbounded database storage leaks"
        ],
        "interviewQuestions": [
            {
                "q": "How do you prevent sequential URL enumeration attacks if Base62 encodes sequential numbers?",
                "a": "Pass the sequential 64-bit ID through a reversible lightweight Feistel cipher or bit-permutation function before encoding to Base62. This scrambles the bits pseudo-randomly while preserving 100% collision-free uniqueness."
            }
        ],
        "resources": [
            {"title": "System Design: TinyURL", "url": "https://github.com/donnemartin/system-design-primer", "type": "article"}
        ],
        "relatedTopics": ["hld-url-shortener", "hashmap", "consistent-hashing"]
    },
    {
        "id": "lld-lru-cache",
        "title": "System 10: In-Memory Thread-Safe LRU Cache with TTL",
        "subject": "System Design",
        "category": "LLD",
        "difficulty": "Advanced",
        "estimatedTime": "50 min",
        "tags": ["LRU", "Doubly LinkedList", "ReentrantReadWriteLock", "Java", "Concurrency"],
        "what": """A production-grade, thread-safe In-Memory Least Recently Used (LRU) Cache supporting constant time O(1) operations for `get` and `put`, paired with millisecond-precision Time-To-Live (TTL) expiration.

The core challenge: Java's built-in `LinkedHashMap` is not thread-safe, and wrapping it in `Collections.synchronizedMap` creates coarse-grained locking bottlenecks under high concurrent read traffic.""",
        "why": """1. **HashMap + Doubly Linked List**: HashMap provides O(1) pointer lookup to nodes; Doubly Linked List enables O(1) node detachment and head insertion without array shifting.
2. **ReentrantReadWriteLock**: Multiple threads read simultaneously without contention, while write updates (evictions, mutations, head relocation) acquire an exclusive lock.
3. **Lazy + Active TTL Eviction**: Expired items are discarded on read access or by a background scheduled cleaner.""",
        "how": """1. `get(key)` acquires ReadLock -> checks HashMap. If found and not expired, upgrades to WriteLock -> moves node to Head -> returns value.
2. `put(key, value, ttl)` acquires WriteLock -> if key exists, updates value and moves to Head.
3. If new key and capacity exceeded: tail node (least recently used) is unlinked from Doubly Linked List and removed from HashMap.
4. New node is inserted immediately following the dummy `head` sentinel.""",
        "internals": """## Node Structure & Doubly Linked List Sentinels

Using dummy `head` and `tail` sentinel nodes completely eliminates null-checks during boundary insertions and removals:

```
[Dummy HEAD] <---> [Node: Key A (MRU)] <---> [Node: Key B] <---> [Dummy TAIL] (LRU)
```

- When Node B is accessed:
  `detach(node)` -> `attachHead(node)` in $O(1)$ pointer operations.
- When capacity is full:
  `evictLRU()` removes `tail.prev` in $O(1)$ time.""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        THREAD-SAFE LRU CACHE ARCHITECTURE                         |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                     ThreadSafeLruCache<K, V>                                |  |
|  +-----------------------------------------------------------------------------+  |
|  | - lock: ReentrantReadWriteLock                                              |  |
|  | - map: Map<K, Node<K, V>>                                                   |  |
|  | - head: Node<K, V> (Dummy Sentinel)                                         |  |
|  | - tail: Node<K, V> (Dummy Sentinel)                                         |  |
|  | - capacity: int                                                             |  |
|  +-----------------------------------------------------------------------------+  |
|  | + get(key: K): V                                                            |  |
|  | + put(key: K, value: V, ttlMs: long): void                                  |  |
|  | + remove(key: K): boolean                                                   |  |
|  | - moveToHead(node: Node<K, V>): void                                        |  |
|  | - removeNode(node: Node<K, V>): void                                        |  |
|  | - evictTail(): Node<K, V>                                                   |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "codeExample": """package com.system.lld.lrucache;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ThreadSafeLruCache<K, V> {
    private static class Node<K, V> {
        K key;
        V value;
        long expiresAt;
        Node<K, V> prev, next;

        Node(K key, V value, long expiresAt) {
            this.key = key;
            this.value = value;
            this.expiresAt = expiresAt;
        }
    }

    private final int capacity;
    private final Map<K, Node<K, V>> map;
    private final Node<K, V> head, tail;
    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();

    public ThreadSafeLruCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>(capacity);
        this.head = new Node<>(null, null, 0);
        this.tail = new Node<>(null, null, 0);
        head.next = tail;
        tail.prev = head;
    }

    public V get(K key) {
        rwLock.writeLock().lock();
        try {
            Node<K, V> node = map.get(key);
            if (node == null) return null;
            if (node.expiresAt > 0 && System.currentTimeMillis() > node.expiresAt) {
                removeNode(node);
                map.remove(key);
                return null;
            }
            moveToHead(node);
            return node.value;
        } finally {
            rwLock.writeLock().unlock();
        }
    }

    public void put(K key, V value, long ttlMs) {
        rwLock.writeLock().lock();
        try {
            long expiresAt = (ttlMs > 0) ? System.currentTimeMillis() + ttlMs : 0;
            Node<K, V> existing = map.get(key);
            if (existing != null) {
                existing.value = value;
                existing.expiresAt = expiresAt;
                moveToHead(existing);
                return;
            }
            if (map.size() >= capacity) {
                Node<K, V> lru = tail.prev;
                removeNode(lru);
                map.remove(lru.key);
            }
            Node<K, V> newNode = new Node<>(key, value, expiresAt);
            map.put(key, newNode);
            addToHead(newNode);
        } finally {
            rwLock.writeLock().unlock();
        }
    }

    private void moveToHead(Node<K, V> node) {
        removeNode(node);
        addToHead(node);
    }

    private void addToHead(Node<K, V> node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    private void removeNode(Node<K, V> node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
}""",
        "realWorld": "Guava Cache, Caffeine, and Redis utilize variations of LRU with Doubly-Linked Lists, probabilistic W-TinyLFU, and segmented read-write locks.",
        "advantages": [
            "Strict O(1) time complexity for get, put, and evict operations",
            "Elimination of null checks via dummy sentinel head and tail nodes",
            "Thread safety under concurrent read and write access"
        ],
        "disadvantages": [
            "Read operations require moving nodes to head, necessitating write lock contention",
            "Doubly linked list pointers introduce 24 bytes of pointer overhead per entry"
        ],
        "tradeoffs": "Pure LRU (Susceptible to cache pollution during one-off full-table scans) vs LFU / 2Q (Higher algorithmic complexity). LRU is standard for general web cache layers.",
        "alternatives": ["LFU (Least Frequently Used)", "FIFO", "ARC (Adaptive Replacement Cache)", "Caffeine W-TinyLFU"],
        "whenToUse": "Fast in-memory cache tiers, database query result caches, image and asset caching.",
        "whenNotToUse": "Scenarios where frequency matters more than recency (use LFU instead).",
        "commonMistakes": [
            "Using a Singly-Linked List which requires O(N) traversal to delete the predecessor of a node",
            "Not making node eviction thread-safe, leading to circular pointer loops under concurrency"
        ],
        "interviewQuestions": [
            {
                "q": "Why does a standard LRU cache require a Doubly Linked List instead of a Singly Linked List?",
                "a": "To remove a node from a linked list in O(1) time, you must update its predecessor's next pointer (`node.prev.next = node.next`). In a singly-linked list, finding the predecessor requires an O(N) scan from the head."
            }
        ],
        "resources": [
            {"title": "Caffeine High Performance Caching", "url": "https://github.com/ben-manes/caffeine", "type": "docs"}
        ],
        "relatedTopics": ["hashmap", "caching-strategies", "redis-concurrency"]
    },
    {
        "id": "lld-elevator",
        "title": "System 11: Multi-Elevator Dispatcher & Scheduler",
        "subject": "System Design",
        "category": "LLD",
        "difficulty": "Expert",
        "estimatedTime": "60 min",
        "tags": ["State Pattern", "Strategy Pattern", "OOP", "Java", "Scheduling"],
        "what": """An enterprise object-oriented design and multithreaded simulation of a multi-car elevator control system in a modern skyscraper.

The design implements the State Pattern for elevator movement transitions and the Strategy Pattern for pluggable scheduling algorithms (LOOK / SCAN vs Shortest-Seek Time).""",
        "why": """Elevator dispatching is a classic multi-agent real-time scheduling problem. Inefficient scheduling leads to long wait times, passenger starvation, and excessive power consumption.

1. **State Pattern**: Encapsulates elevator states (`MOVING_UP`, `MOVING_DOWN`, `IDLE`, `DOORS_OPEN`, `MAINTENANCE`).
2. **Strategy Pattern (LOOK Algorithm)**: The elevator continues traveling in its active direction, servicing all floor calls in that direction, reversing only when no pending requests remain ahead.
3. **Centralized Dispatcher**: Allocates hall calls to the most optimal elevator car based on distance, capacity, and trajectory.""",
        "how": """1. Passenger presses Hall Button on Floor 12 (Direction: UP).
2. `ElevatorController` queries all Elevator Cars -> computes a cost function for each car -> selects car with minimum cost.
3. Target car receives floor stop in its `TreeSet<Integer> upRequests` queue.
4. Elevator engine loops: advances floors, reaches Floor 12, transitions to `DOORS_OPEN`, halts for 3 seconds, transitions to `MOVING_UP`.""",
        "internals": """## Scheduling Algorithms: FCFS vs SCAN vs LOOK

- **FCFS**: First-Come-First-Serve. Highly inefficient thrashing.
- **SCAN (Elevator Algorithm)**: The car sweeps from bottom floor to top floor, reversing only at building boundaries.
- **LOOK Algorithm**: Like SCAN, but reverses immediately when there are no requests ahead, avoiding empty trips to the building roof.""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        ELEVATOR CONTROL SYSTEM CLASS DIAGRAM                      |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +----------------------------+             +----------------------------------+  |
|  |     ElevatorController     |             |       DispatchStrategy           |  |
|  +----------------------------+             +----------------------------------+  |
|  | - elevators: List<Elevator>|------------>| + selectBestElevator(...)        |  |
|  | - strategy: DispatchStrat  |             +----------------------------------+  |
|  +----------------------------+                               ^                   |
|  | + requestElevator(...)     |                               |                   |
|  | + step()                   |             +-----------------+----------------+  |
|  +----------------------------+             |                                  |  |
|                 |                           |                                  |  |
|                 v                    [ LookStrategy ]                 [ ProximityStrategy ]
|  +----------------------------+                                                   |
|  |          Elevator          |                                                   |
|  +----------------------------+                                                   |
|  | - id: int                  |                                                   |
|  | - currentFloor: int        |                                                   |
|  | - state: ElevatorState     |                                                   |
|  | - direction: Direction     |                                                   |
|  | - upStops: TreeSet<Integer>|                                                   |
|  | - downStops: TreeSet<Int>  |                                                   |
|  +----------------------------+                                                   |
|  | + addDestination(floor)    |                                                   |
|  | + moveOneFloor()           |                                                   |
|  +----------------------------+                                                   |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "codeExample": """package com.system.lld.elevator;

import java.util.*;

public class ElevatorSystem {
    public enum Direction { UP, DOWN, IDLE }
    public enum ElevatorState { MOVING, STOPPED, DOORS_OPEN }

    public static class Elevator {
        private final int id;
        private int currentFloor = 0;
        private Direction direction = Direction.IDLE;
        private ElevatorState state = ElevatorState.STOPPED;
        private final TreeSet<Integer> upStops = new TreeSet<>();
        private final TreeSet<Integer> downStops = new TreeSet<>(Collections.reverseOrder());

        public Elevator(int id) { this.id = id; }

        public synchronized void addStop(int floor) {
            if (floor > currentFloor) upStops.add(floor);
            else if (floor < currentFloor) downStops.add(floor);
            if (direction == Direction.IDLE) {
                direction = (floor >= currentFloor) ? Direction.UP : Direction.DOWN;
            }
        }

        public synchronized void moveStep() {
            if (direction == Direction.UP) {
                if (!upStops.isEmpty()) {
                    currentFloor++;
                    if (upStops.contains(currentFloor)) {
                        upStops.remove(currentFloor);
                        state = ElevatorState.DOORS_OPEN;
                    }
                } else if (!downStops.isEmpty()) {
                    direction = Direction.DOWN;
                } else {
                    direction = Direction.IDLE;
                }
            } else if (direction == Direction.DOWN) {
                if (!downStops.isEmpty()) {
                    currentFloor--;
                    if (downStops.contains(currentFloor)) {
                        downStops.remove(currentFloor);
                        state = ElevatorState.DOORS_OPEN;
                    }
                } else if (!upStops.isEmpty()) {
                    direction = Direction.UP;
                } else {
                    direction = Direction.IDLE;
                }
            }
        }

        public int getCurrentFloor() { return currentFloor; }
        public Direction getDirection() { return direction; }
        public int getId() { return id; }
    }

    public static class ElevatorDispatcher {
        private final List<Elevator> elevators;

        public ElevatorDispatcher(int numCars) {
            elevators = new ArrayList<>();
            for (int i = 1; i <= numCars; i++) elevators.add(new Elevator(i));
        }

        public Elevator dispatch(int floor, Direction dir) {
            Elevator best = null;
            int minCost = Integer.MAX_VALUE;

            for (Elevator e : elevators) {
                int dist = Math.abs(e.getCurrentFloor() - floor);
                int cost = dist;
                // Prefer cars already moving towards the request
                if (e.getDirection() == dir) cost -= 2;
                else if (e.getDirection() != Direction.IDLE) cost += 10;

                if (cost < minCost) {
                    minCost = cost;
                    best = e;
                }
            }
            if (best != null) best.addStop(floor);
            return best;
        }
    }
}""",
        "realWorld": "Otis CompassPlus and Schindler PORT dispatch systems use advanced destination dispatching algorithms to group passengers going to similar floors into the same elevator car.",
        "advantages": [
            "Elimination of passenger starvation via directional TreeSet ordering",
            "Clear separation of concerns: state transitions vs car control vs system dispatching",
            "Pluggable dispatch strategies via Strategy design pattern"
        ],
        "disadvantages": [
            "LOOK algorithm does not account for car passenger weight capacity",
            "Extreme peak morning traffic requires specialized destination control mode"
        ],
        "tradeoffs": "Destination Dispatch (User inputs destination on floor terminal before boarding) vs Traditional Hall Call (Up/Down button only). Destination dispatch improves throughput by 30% in high-rise office towers.",
        "alternatives": ["SCAN Scheduling", "Shortest Seek Time First (SSTF)", "Genetic Algorithm Dispatch"],
        "whenToUse": "Multi-agent physical simulation, robotics dispatch, elevator controllers, automated storage retrieval systems.",
        "whenNotToUse": "Simple single-car lifts where simple FIFO queue suffices.",
        "commonMistakes": [
            "Not synchronizing shared request queues across dispatch and movement threads",
            "Allowing an elevator to travel to building extremes when no further requests exist (SCAN flaw)"
        ],
        "interviewQuestions": [
            {
                "q": "How does the LOOK algorithm differ from the SCAN elevator algorithm?",
                "a": "The SCAN algorithm forces the elevator to travel all the way to the top and bottom floors of the building before reversing, even if no passengers are waiting there. The LOOK algorithm checks for pending requests ahead; if none exist, it immediately reverses direction, saving significant energy and time."
            }
        ],
        "resources": [
            {"title": "Elevator System Design Interview", "url": "https://github.com", "type": "article"}
        ],
        "relatedTopics": ["solid-principles", "lld-parking-lot", "lld-pubsub"]
    },
    {
        "id": "lld-pubsub",
        "title": "System 13: Distributed Pub/Sub Messaging Engine",
        "subject": "System Design",
        "category": "LLD",
        "difficulty": "Advanced",
        "estimatedTime": "50 min",
        "tags": ["Observer Pattern", "Concurrency", "ThreadPool", "Java", "Messaging"],
        "what": """A low-level object-oriented design and multithreaded Java implementation of an In-Memory Pub/Sub Messaging Engine.

The system decouples producers and consumers using the Observer Pattern, supporting dynamic topic subscription, broadcast fanout, and asynchronous subscriber worker thread isolation to prevent slow consumers from degrading publisher throughput.""",
        "why": """Direct synchronous observer notification blocks the publisher thread when a single subscriber encounters latency, network timeouts, or slow database writes.

1. **Observer Pattern**: Decouples message publishers from subscriber listener loops.
2. **Dedicated ThreadPool Executor per Subscription**: Isolates subscriber processing, guaranteeing fault isolation and non-blocking publisher execution.
3. **Thread-Safe Concurrent Collections**: Uses `CopyOnWriteArrayList` and `ConcurrentHashMap` for lock-free reader iterations.""",
        "how": """1. Producer publishes a message to Topic `order-created`.
2. Broker identifies all active `Subscriber` instances registered for `order-created`.
3. Broker dispatches an async task to each subscriber's dedicated `ExecutorService` queue.
4. Publisher returns immediately without waiting for subscriber execution.""",
        "internals": """## Concurrency & Thread Isolation Model

```
[Publisher Thread] ---> broker.publish("topic", msg) (Returns in < 1ms)
                             |
                             v
                 [ Topic: "order-created" ]
                             |
         +-------------------+-------------------+
         |                                       |
         v (Task pushed)                         v (Task pushed)
[ Subscriber A Thread Pool ]           [ Subscriber B Thread Pool ]
  Worker: Process Email Receipt          Worker: Update Analytics DB
```""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        PUB/SUB MESSAGING ENGINE CLASS DIAGRAM                     |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +--------------------------------+          +---------------------------------+  |
|  |          PubSubBroker          |          |              Topic              |  |
|  +--------------------------------+          +---------------------------------+  |
|  | - topics: ConcurrentMap<String,|--------->| - name: String                  |  |
|  |                         Topic> |          | - subscribers: List<Subscriber> |  |
|  +--------------------------------+          +---------------------------------+  |
|  | + createTopic(name)            |          | + addSubscriber(sub)            |  |
|  | + publish(topic, message)      |          | + broadcast(message)            |  |
|  | + subscribe(topic, subscriber) |          +---------------------------------+  |
|  +--------------------------------+                           |                   |
|                                                               v                   |
|                                              +---------------------------------+  |
|                                              |         Subscriber (I)          |  |
|                                              +---------------------------------+  |
|                                              | + onMessage(message: Message)   |  |
|                                              | + getId(): String               |  |
|                                              +---------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "codeExample": """package com.system.lld.pubsub;

import java.util.*;
import java.util.concurrent.*;

public class DistributedPubSubEngine {
    public record Message(String id, String payload, long timestamp) {}

    public interface Subscriber {
        String getId();
        void onMessage(Message message);
    }

    public static class Topic {
        private final String name;
        private final List<Subscriber> subscribers = new CopyOnWriteArrayList<>();
        private final ExecutorService executor = Executors.newFixedThreadPool(4);

        public Topic(String name) { this.name = name; }

        public void subscribe(Subscriber s) { subscribers.add(s); }
        public void unsubscribe(Subscriber s) { subscribers.remove(s); }

        public void publish(Message message) {
            for (Subscriber sub : subscribers) {
                executor.submit(() -> {
                    try {
                        sub.onMessage(message);
                    } catch (Exception e) {
                        System.err.printf("Error dispatching to %s: %s%n", sub.getId(), e.getMessage());
                    }
                });
            }
        }
    }

    private final Map<String, Topic> topics = new ConcurrentHashMap<>();

    public void createTopic(String name) {
        topics.putIfAbsent(name, new Topic(name));
    }

    public void publish(String topicName, String payload) {
        Topic topic = topics.get(topicName);
        if (topic == null) throw new IllegalArgumentException("Topic does not exist: " + topicName);
        Message msg = new Message(UUID.randomUUID().toString(), payload, System.currentTimeMillis());
        topic.publish(msg);
    }

    public void subscribe(String topicName, Subscriber subscriber) {
        Topic topic = topics.get(topicName);
        if (topic == null) throw new IllegalArgumentException("Topic does not exist: " + topicName);
        topic.subscribe(subscriber);
    }
}""",
        "realWorld": "Google Cloud Pub/Sub, Apache Pulsar, and EventBus (Guava) utilize thread isolation and asynchronous fanout pipelines for high-throughput messaging.",
        "advantages": [
            "Complete decoupling of message producers from message consumers",
            "Slow consumers cannot block publisher threads or other fast consumers",
            "Lock-free subscriber iterations using CopyOnWriteArrayList"
        ],
        "disadvantages": [
            "Unbounded thread pool queues can lead to OutOfMemoryError under prolonged consumer lag",
            "In-memory engine loses queued messages if the process crashes (no disk persistence)"
        ],
        "tradeoffs": "In-Memory Delivery (Zero disk overhead, extreme throughput) vs Persistent Log Storage (Kafka / RabbitMQ, durability guarantees). In-memory pub/sub is ideal for intra-process event distribution.",
        "alternatives": ["Apache Kafka", "RabbitMQ", "Redis Streams", "Disruptor"],
        "whenToUse": "Intra-process microservice event broadcasting, UI event buses, reactive notifications.",
        "whenNotToUse": "Enterprise messaging where financial transactions must be persisted to disk before acknowledgment.",
        "commonMistakes": [
            "Synchronously iterating over subscribers on the publisher thread",
            "Using standard ArrayList without synchronization in multithreaded environments"
        ],
        "interviewQuestions": [
            {
                "q": "What happens if a subscriber is extremely slow in an in-memory Pub/Sub engine?",
                "a": "If subscribers run on isolated bounded thread pools, the slow subscriber's task queue fills up. The broker must implement a backpressure or rejection policy (e.g. `CallerRunsPolicy` or dropping oldest messages) to prevent out-of-memory crashes while allowing fast subscribers to proceed uninterrupted."
            }
        ],
        "resources": [
            {"title": "Enterprise Integration Patterns: Publish-Subscribe Channel", "url": "https://www.enterpriseintegrationpatterns.com", "type": "docs"}
        ],
        "relatedTopics": ["kafka", "solid-principles", "lld-elevator"]
    },
    {
        "id": "lld-snake-ladder",
        "title": "System 14: Snake and Ladder Multiplayer Game",
        "subject": "System Design",
        "category": "LLD",
        "difficulty": "Intermediate",
        "estimatedTime": "45 min",
        "tags": ["OOP", "Design Patterns", "Game Loop", "Java", "Extensibility"],
        "what": """A clean, modular, and extensible object-oriented implementation of the classic Snake and Ladder multiplayer board game in Java.

The design adheres to Single Responsibility Principle (SRP) and Open/Closed Principle (OCP), supporting arbitrary board sizes (100+ cells), customizable snakes and ladders, multiple dice, and pluggable dice-rolling strategies.""",
        "why": """Naive implementations clump board coordinates, player turns, and dice math into a single spaghetti procedural loop.

1. **Single Responsibility**: Decouples Board state, Board Cells/Jumps, Dice mechanics, and Game Engine loop.
2. **Strategy Pattern for Dice**: Pluggable strategies allow swapping random rolling with deterministic rigged rolling for unit testing.
3. **Queue-Based Player Rotation**: Circular FIFO queue smoothly manages turn-taking across $N$ players.""",
        "how": """1. Board initializes with cells 1 to 100. Snakes (head -> tail) and Ladders (base -> top) are registered as `Jump` objects.
2. Players are placed in a FIFO `ArrayDeque<Player>`.
3. Game Loop pops current player -> rolls dice -> computes new position.
4. If new position has a Snake or Ladder, position updates automatically.
5. If new position == 100: Player declared Winner! Otherwise, player rejoins back of queue.""",
        "internals": """## Board & Jump Entity Relationship

```
[ Board (1..N cells) ]
      |
      +---> Cell[i] contains optional [ Jump (start, end) ]
                                            |
                         +------------------+------------------+
                         |                                     |
                  [ Snake (end < start) ]               [ Ladder (end > start) ]
```

### Winning Condition Rule:
A player must land **exactly** on the final cell (e.g. 100). If `current_pos + roll > 100`, the move is invalid and the player remains in place.""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        SNAKE & LADDER GAME CLASS DIAGRAM                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +--------------------------------+          +---------------------------------+  |
|  |           GameController       |          |              Board              |  |
|  +--------------------------------+          +---------------------------------+  |
|  | - board: Board                 |--------->| - totalCells: int               |  |
|  | - dice: Dice                   |          | - jumps: Map<Integer, Jump>     |  |
|  | - players: Deque<Player>       |          +---------------------------------+  |
|  +--------------------------------+          | + getDestination(curr, roll)    |  |
|  | + playGame(): Player           |          +---------------------------------+  |
|  +--------------------------------+                           |                   |
|                 |                                             v                   |
|                 |                            +---------------------------------+  |
|                 +--------------------------->|         Jump (Snake / Ladder)   |  |
|                 |                            +---------------------------------+  |
|                 v                            | - startPosition: int            |  |
|  +--------------------------------+          | - endPosition: int              |  |
|  |             Player             |          +---------------------------------+  |
|  +--------------------------------+                                               |
|  | - id: String, name: String     |                                               |
|  | - currentPosition: int         |                                               |
|  +--------------------------------+                                               |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "codeExample": """package com.system.lld.snakeladder;

import java.util.*;

public class SnakeAndLadderGame {
    public record Jump(int start, int end) {
        public Jump {
            if (start == end) throw new IllegalArgumentException("Start cannot equal end");
        }
    }

    public static class Board {
        private final int totalCells;
        private final Map<Integer, Integer> jumps = new HashMap<>();

        public Board(int totalCells) { this.totalCells = totalCells; }

        public void addSnake(int head, int tail) {
            if (tail >= head) throw new IllegalArgumentException("Snake tail must be below head");
            jumps.put(head, tail);
        }

        public void addLadder(int base, int top) {
            if (top <= base) throw new IllegalArgumentException("Ladder top must be above base");
            jumps.put(base, top);
        }

        public int calculateDestination(int currentPos, int diceRoll) {
            int target = currentPos + diceRoll;
            if (target > totalCells) return currentPos; // Exact landing rule
            return jumps.getOrDefault(target, target);
        }

        public int getTotalCells() { return totalCells; }
    }

    public static class Player {
        private final String name;
        private int position = 0;

        public Player(String name) { this.name = name; }
        public String getName() { return name; }
        public int getPosition() { return position; }
        public void setPosition(int p) { this.position = p; }
    }

    public static class GameEngine {
        private final Board board;
        private final Deque<Player> players = new ArrayDeque<>();
        private final Random random = new Random();

        public GameEngine(Board board, List<Player> playerList) {
            this.board = board;
            players.addAll(playerList);
        }

        public Player playTurn() {
            Player current = players.pollFirst();
            int roll = random.nextInt(6) + 1;
            int nextPos = board.calculateDestination(current.getPosition(), roll);
            current.setPosition(nextPos);

            if (nextPos == board.getTotalCells()) {
                return current; // Winner!
            }
            players.addLast(current);
            return null; // Game continues
        }
    }
}""",
        "realWorld": "Multiplayer turn-based board games (Monopoly, Chess, Ludo) use this state-machine queue rotation and decoupled rules evaluation architecture.",
        "advantages": [
            "Extensible: arbitrary board sizes and any count of snakes or ladders",
            "Deterministic testing supported by injecting mock dice roll strategies",
            "Zero state mutation leaks: Board rules are decoupled from Player turn queues"
        ],
        "disadvantages": [
            "Infinite loops possible if poorly designed snake/ladder chains form circular paths"
        ],
        "tradeoffs": "Exact Landing Rule (Must roll exact number to hit 100) vs Bouncing Rule (Overshoot bounces backwards). Exact landing was implemented per standard tournament rules.",
        "alternatives": ["Monopoly Engine", "Ludo Engine"],
        "whenToUse": "Turn-based multiplayer game systems, state machine learning exercises, interview coding rounds.",
        "whenNotToUse": "Real-time physics-based action games.",
        "commonMistakes": [
            "Allowing a ladder start on the same cell as a snake head",
            "Creating circular loops where ladder tops land on snake heads that point back to the ladder base"
        ],
        "interviewQuestions": [
            {
                "q": "How would you prevent infinite cycles when placing snakes and ladders on the board?",
                "a": "Model the board as a Directed Graph where cells are vertices and jumps are directed edges. Before adding a snake or ladder, run a cycle-detection algorithm (Depth-First Search with recursion stack tracking); if adding the edge creates a cycle, reject the placement."
            }
        ],
        "resources": [
            {"title": "Low Level Design of Snake and Ladder", "url": "https://github.com", "type": "article"}
        ],
        "relatedTopics": ["solid-principles", "lld-elevator", "hashmap"]
    },
    {
        "id": "lld-bookmyshow",
        "title": "System 15: Concurrency-Safe Movie Ticket Reservation (BookMyShow)",
        "subject": "System Design",
        "category": "LLD",
        "difficulty": "Expert",
        "estimatedTime": "60 min",
        "tags": ["Two-Phase Reservation", "Concurrency", "Optimistic Locking", "Java", "BookMyShow"],
        "what": """A low-level object-oriented design and multithreaded Java implementation of a high-concurrency Movie Ticket Booking System (like BookMyShow / Ticketmaster).

The core technical challenge: During blockbuster flash sales (e.g. Avengers opening weekend), thousands of concurrent users click the exact same front-row seat simultaneously. The system must guarantee that zero double-bookings occur without deadlocking database rows.""",
        "why": """Immediate direct booking writes cause transaction collisions and angry users whose cards are charged after someone else secured the seat.

1. **Two-Phase Reservation Lifecycle**:
   - Phase 1: Temporary Lock (Seat transitions from `AVAILABLE` -> `LOCKED` for 10 minutes with user ownership).
   - Phase 2: Permanent Confirmation (Upon payment success, transitions from `LOCKED` -> `BOOKED`). If payment times out, lock automatically releases back to `AVAILABLE`.
2. **Atomic Compare-And-Swap (CAS) / Optimistic Locking**: Ensures only 1 thread wins the lock race.
3. **Lock Cleanup Wheel**: Evicts expired seat holds in O(1) time without periodic full-table scans.""",
        "how": """1. User selects Seat A1 and A2 for Show #501.
2. System executes atomic reservation check: `seat.lock(userId, 600000ms)`.
3. If atomic CAS succeeds: seats become `LOCKED` to User for 10 minutes. A timer is scheduled.
4. User enters payment gateway -> Payment succeeds -> `seat.confirmBooking(userId)` permanently commits the seats.
5. If payment fails or cancels -> `seat.releaseLock(userId)` unlocks seats instantly for other waiting users.""",
        "internals": """## Seat State Lifecycle Machine

```
               [ AVAILABLE ]
                     |
                     | 1. Temporary Lock (Atomic CAS)
                     v
                 [ LOCKED ]
                 /        \\
   2a. Payment  /          \\ 2b. Payment Fails / Timeout (10 min)
      Succeeds /            \\
              v              v
         [ BOOKED ]    [ AVAILABLE ]
        (Permanent)     (Re-released)
```

### Database Concurrency Control (SQL)
```sql
-- Atomic lock acquisition with optimistic version check
UPDATE show_seats 
SET status = 'LOCKED', locked_by = :userId, locked_at = NOW(), version = version + 1
WHERE id = :seatId 
  AND status = 'AVAILABLE' 
  AND version = :expectedVersion;
```""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        BOOKMYSHOW LOW-LEVEL CLASS DESIGN                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +----------------------------+          +-------------------------------------+  |
|  |        BookingService      |          |               Show                  |  |
|  +----------------------------+          +-------------------------------------+  |
|  | - shows: Map<String, Show> |--------->| - id: String                        |  |
|  +----------------------------+          | - movie: Movie                      |  |
|  | + reserveSeats(...)        |          | - seats: Map<String, Seat>          |  |
|  | + confirmBooking(...)      |          +-------------------------------------+  |
|  | + cancelReservation(...)   |                            |                      |
|  +----------------------------+                            v                      |
|                                          +-------------------------------------+  |
|                                          |               Seat                  |  |
|                                          +-------------------------------------+  |
|                                          | - seatNumber: String                |  |
|                                          | - status: SeatStatus                |  |
|                                          | - lockedBy: String                  |  |
|                                          | - lockExpiry: long                  |  |
|                                          | - lock: ReentrantLock               |  |
|                                          +-------------------------------------+  |
|                                          | + tryLock(userId, ttlMs): boolean   |  |
|                                          | + book(userId): boolean             |  |
|                                          | + unlock(userId): void              |  |
|                                          +-------------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "codeExample": """package com.system.lld.bookmyshow;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

public class TicketBookingSystem {
    public enum SeatStatus { AVAILABLE, LOCKED, BOOKED }

    public static class Seat {
        private final String id;
        private SeatStatus status = SeatStatus.AVAILABLE;
        private String lockedBy = null;
        private long lockExpiresAt = 0;
        private final ReentrantLock lock = new ReentrantLock();

        public Seat(String id) { this.id = id; }

        public boolean reserveTemporary(String userId, long ttlMs) {
            lock.lock();
            try {
                long now = System.currentTimeMillis();
                // Release expired lock if present
                if (status == SeatStatus.LOCKED && now > lockExpiresAt) {
                    status = SeatStatus.AVAILABLE;
                    lockedBy = null;
                }
                if (status == SeatStatus.AVAILABLE) {
                    status = SeatStatus.LOCKED;
                    lockedBy = userId;
                    lockExpiresAt = now + ttlMs;
                    return true;
                }
                return false;
            } finally {
                lock.unlock();
            }
        }

        public boolean confirmBooking(String userId) {
            lock.lock();
            try {
                if (status == SeatStatus.LOCKED && userId.equals(lockedBy)) {
                    if (System.currentTimeMillis() <= lockExpiresAt) {
                        status = SeatStatus.BOOKED;
                        return true;
                    }
                }
                return false; // Lock expired or unauthorized
            } finally {
                lock.unlock();
            }
        }

        public void releaseLock(String userId) {
            lock.lock();
            try {
                if (status == SeatStatus.LOCKED && userId.equals(lockedBy)) {
                    status = SeatStatus.AVAILABLE;
                    lockedBy = null;
                    lockExpiresAt = 0;
                }
            } finally {
                lock.unlock();
            }
        }

        public SeatStatus getStatus() { return status; }
        public String getId() { return id; }
    }

    public static class ShowService {
        private final Map<String, Seat> seats = new ConcurrentHashMap<>();

        public ShowService(List<String> seatIds) {
            for (String sid : seatIds) seats.put(sid, new Seat(sid));
        }

        public boolean bookMultipleSeats(String userId, List<String> seatIds, long ttlMs) {
            List<Seat> lockedSeats = new ArrayList<>();
            // Always sort seat IDs to prevent cross-seat deadlocks!
            List<String> sortedSeatIds = new ArrayList<>(seatIds);
            Collections.sort(sortedSeatIds);

            for (String sid : sortedSeatIds) {
                Seat seat = seats.get(sid);
                if (seat != null && seat.reserveTemporary(userId, ttlMs)) {
                    lockedSeats.add(seat);
                } else {
                    // One seat failed! Rollback all previously locked seats in this attempt
                    for (Seat s : lockedSeats) s.releaseLock(userId);
                    return false;
                }
            }
            return true;
        }
    }
}""",
        "realWorld": "BookMyShow, Ticketmaster, and airline seat selection systems use this distributed two-phase reservation pattern with Redis distributed locks and automatic TTL expiration.",
        "advantages": [
            "100% guarantee against double-booking under extreme concurrent traffic",
            "Deadlock prevention by strictly enforcing natural ordering (sorting) on multi-seat lock acquisitions",
            "Automatic recovery from abandoned checkouts via TTL expiration"
        ],
        "disadvantages": [
            "Seats held by users who abandon carts remain unavailable to others for the duration of the 10-minute lock window"
        ],
        "tradeoffs": "Optimistic Locking with In-Memory Hold vs Pessimistic DB Row Locking. Pessimistic locks serialize database connections and crash under 10k RPS. In-memory locks with atomic compare-and-swap handle flash sales smoothly.",
        "alternatives": ["Pessimistic `SELECT FOR UPDATE`", "Redis Redlock Distributed Locking"],
        "whenToUse": "Movie ticketing, concert bookings, airline seat reservation, high-demand inventory flash sales.",
        "whenNotToUse": "Unlimited capacity events or standard e-commerce with flexible warehouse backorders.",
        "commonMistakes": [
            "Not sorting seat IDs before locking multiple seats, which causes catastrophic thread deadlocks",
            "Charging the user's credit card before securing the temporary seat reservation lock"
        ],
        "interviewQuestions": [
            {
                "q": "How do you prevent deadlocks when a user tries to book seats [A1, A2] while another user tries to book seats [A2, A1]?",
                "a": "Always enforce a canonical global lock acquisition order. By sorting the requested seat IDs alphabetically before acquiring locks (both threads acquire A1 first, then A2), circular wait conditions are mathematically impossible, completely eliminating deadlocks."
            }
        ],
        "resources": [
            {"title": "Designing a Movie Ticket Booking System", "url": "https://github.com", "type": "article"}
        ],
        "relatedTopics": ["redis-concurrency", "distributed-transactions", "postgres-jsonb-mvcc"]
    }
]
