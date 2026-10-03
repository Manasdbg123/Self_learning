# Distributed Systems Foundations Data extracted from self.pdf

FOUNDATIONS_TOPICS = [
    {
        "id": "consistent-hashing",
        "title": "Consistent Hashing & Virtual Nodes",
        "subject": "System Design",
        "category": "Foundations",
        "difficulty": "Advanced",
        "estimatedTime": "45 min",
        "tags": ["Hashing", "Distributed Cache", "Ring", "Vnodes", "Load Balancing"],
        "what": """Consistent Hashing is a distributed hashing scheme that operates independently of the number of servers in a cluster. 

When a hash table is resized (servers added or removed), only $K/N$ keys need to be remapped on average (where $K$ is total keys and $N$ is total servers), unlike traditional `hash(key) % N` where almost 100% of keys are invalidated and rehashed.""",
        "why": """With standard modular hashing `hash(key) % N`:
- If $N$ changes from 10 to 11 (one server added), over 91% of cached keys change their destination server.
- This causes a catastrophic Cache Avalanche where millions of requests miss cache simultaneously and crash the primary database.

Consistent hashing guarantees that adding a server only steals a slice of keys from its immediate neighbor, leaving the rest of the cluster completely untouched.""",
        "how": """1. **The Hash Ring**: Map both server identifiers and object keys to a circular 32-bit or 64-bit integer ring (0 to $2^{32}-1$) using MurmurHash3 or SHA-1.
2. **Key Placement**: Hash the key to find its position on the ring. Walk clockwise until you encounter the first server node. That server is the owner of the key.
3. **Virtual Nodes (Vnodes)**: To prevent non-uniform data distribution (hotspots), each physical server is mapped to multiple pseudo-random positions on the ring (e.g. 100 to 256 virtual nodes per physical host).""",
        "internals": """## Virtual Nodes & Variance Reduction

Without virtual nodes, servers end up with unequal ring partitions.
With $V$ virtual nodes per server:
- Standard deviation of load across servers drops proportionally to $1/\\sqrt{V}$.
- For $V = 100$, load variance across physical machines drops below 5%.
- When a server fails, its keys are evenly distributed across all remaining servers rather than overloading just one neighbor.""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        CONSISTENT HASHING RING WITH VNODES                        |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                0 / 2^32                                           |
|                            [ Node A-v1 ]                                          |
|                       .         |         .                                       |
|                  .              |              .                                  |
|             [ Node C-v2 ]       |          [ Node B-v1 ]                          |
|           .                     |                     .                           |
|         .                       | (Clockwise Lookup)    .                         |
|      Key "user:987" ------> (Walks Clockwise) ---> Lands on [ Node B-v1 ]         |
|     .                                                     .                       |
|    [ Node B-v2 ]                                      [ Node A-v2 ]               |
|     .                                                     .                       |
|       .                                                 .                         |
|         .                                             .                           |
|           .         [ Node C-v1 ]         [ Node B-v3 ]                           |
|                .                       .                                          |
|                     .             .                                               |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "realWorld": "Amazon DynamoDB, Apache Cassandra, Discord guild dispatchers, and Akamai CDN edge routers use consistent hashing rings with virtual nodes to balance petabytes of data.",
        "advantages": [
            "Minimal key migration: only K/N keys moved during scale up or scale down",
            "Uniform load distribution across heterogeneous physical hardware via virtual nodes",
            "Zero single point of failure in ring topology"
        ],
        "disadvantages": [
            "Cascading failure risk if hot keys concentrate on virtual nodes of an already stressed node",
            "Increased memory overhead to store the sorted binary tree ring map on each client router"
        ],
        "tradeoffs": "Virtual Node Count (Memory & Routing Lookup Overhead) vs Balance Uniformity. 100-256 vnodes is the industry sweet spot.",
        "alternatives": ["Rendezvous Hashing (Highest Random Weight)", "Maglev Hashing (Google)", "Bounded Load Consistent Hashing"],
        "whenToUse": "Distributed caching (Memcached / Redis Cluster), sharded databases (Cassandra, DynamoDB), distributed rate limiters.",
        "whenNotToUse": "Single-server databases or small static clusters where server membership never changes.",
        "commonMistakes": [
            "Omitting virtual nodes, causing extreme data skew where one server handles 80% of cluster traffic",
            "Using MD5 without 64-bit space, causing hash collisions"
        ],
        "interviewQuestions": [
            {
                "q": "Why are Virtual Nodes essential in Consistent Hashing?",
                "a": "Without virtual nodes, physical servers hash to random locations on the ring, resulting in highly unequal partition sizes where one server may own 70% of the ring. Virtual nodes map each physical server to 100+ points on the ring, smoothing the distribution so each machine owns an equal fraction of the key space and distributing the load evenly when any node fails."
            }
        ],
        "resources": [
            {"title": "Dynamo: Amazon's Highly Available Key-value Store", "url": "https://www.allthingsdistributed.com", "type": "docs"}
        ],
        "relatedTopics": ["caching-strategies", "cap-pacelc", "hld-rate-limiter"]
    },
    {
        "id": "scaling-models",
        "title": "Scaling Models: Vertical vs Horizontal",
        "subject": "System Design",
        "category": "Foundations",
        "difficulty": "Beginner",
        "estimatedTime": "30 min",
        "tags": ["Scaling", "Scale-Up", "Scale-Out", "Hardware", "High Availability"],
        "what": """Scaling is the capability of a system to handle growing workloads by adding resources.

- **Vertical Scaling (Scale-Up)**: Adding more compute resources (CPU cores, RAM, NVMe SSDs) to a single existing server.
- **Horizontal Scaling (Scale-Out)**: Adding more independent machines into a connected pool managed by a load balancer.""",
        "why": """Every high-scale system begins vertically and transitions horizontally. Understanding when to scale vertically vs horizontally is the most fundamental architectural decision:
- Scaling up is instant, zero code complexity, but has an absolute hardware and financial ceiling.
- Scaling out is theoretically infinite, fault-tolerant, but introduces distributed network complexity, partitioning, and eventual consistency.""",
        "how": """1. **Phase 1 (Monolith / Vertical)**: Single server with 64 vCPU, 256GB RAM, NVMe storage. Handles 5k-20k RPS easily with zero network serialization.
2. **Phase 2 (Stateless Horizontal Web Tier + Vertical DB)**: App servers scale out behind Nginx load balancer; primary database scales up to 128 vCPU.
3. **Phase 3 (Full Horizontal / Sharded)**: Read replicas, sharded database partitions across clusters, asynchronous messaging queues.""",
        "internals": """## Comparison Matrix

| Metric | Vertical Scaling (Scale-Up) | Horizontal Scaling (Scale-Out) |
| :--- | :--- | :--- |
| **Max Capacity** | Hard hardware limit (~few TB RAM, ~128 cores) | Theoretically infinite ($N$ servers) |
| **Downtime** | Requires server downtime to upgrade CPU/RAM | Zero downtime (rolling updates behind load balancer) |
| **Cost Curve** | Exponential (high-end enterprise RAM/CPU is costly) | Linear (commodity cloud instances) |
| **Complexity** | Zero architectural complexity; code runs unmodified | High: network latency, distributed transactions, split-brain |
| **Fault Tolerance** | Single Point of Failure (SPOF) | Built-in resilience (node failures absorbed by pool) |""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        VERTICAL VS HORIZONTAL SCALING                             |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|    VERTICAL (Scale-Up)                         HORIZONTAL (Scale-Out)             |
|                                                                                   |
|       +--------------+                                [ Load Balancer ]           |
|       |  BIG SERVER  |                                        |                   |
|       |  128 vCPUs   |                      +-----------------+-----------------+ |
|       |  1 TB RAM    |                      |                 |                 | |
|       |  40 Gbps NIC |                      v                 v                 v |
|       +--------------+                 [ App Node 1 ]   [ App Node 2 ]   [ App Node 3 ]
|       (Single Box)                     (4 vCPU, 8GB)    (4 vCPU, 8GB)    (4 vCPU, 8GB)
|       - Hard Ceiling                   - Resilient to failure                     |
|       - Single Point of Failure        - Infinite linear expansion                |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "realWorld": "Stack Overflow famously ran on just a few massive vertically-scaled multi-core SQL Server bare-metal machines serving hundreds of millions of monthly pageviews, while Google and Netflix scale out across millions of commodity nodes.",
        "advantages": [
            "Vertical: Zero IPC latency, zero distributed consensus overhead",
            "Horizontal: Resilient against physical hardware failure, cost-effective commodity hardware"
        ],
        "disadvantages": [
            "Vertical: Hard hardware boundary and high cost at the upper boundary",
            "Horizontal: Distributed tracing, data consistency, and network partitions"
        ],
        "tradeoffs": "Simplicity & Raw Speed (Vertical) vs Elasticity & High Availability (Horizontal). Scale stateless web tiers horizontally first, scale data tiers vertically until sharding becomes mandatory.",
        "alternatives": ["Autoscaling Groups", "Serverless Functions (AWS Lambda)"],
        "whenToUse": "Start every new project vertically until load demands horizontal separation.",
        "whenNotToUse": "Prematurely sharding databases horizontally for low-traffic applications.",
        "commonMistakes": [
            "Attempting to scale stateful applications horizontally without externalizing session state into Redis",
            "Assuming horizontal scaling automatically makes code faster (network hops introduce latency)"
        ],
        "interviewQuestions": [
            {
                "q": "What prerequisite must application servers meet before they can scale horizontally?",
                "a": "Application servers must be stateless. Any user session data, uploaded temporary files, or cached authentication tokens must be externalized to centralized distributed services (like Redis for sessions or Amazon S3 for file storage), so any server can handle any request identically."
            }
        ],
        "resources": [
            {"title": "Scale Up vs Scale Out", "url": "https://aws.amazon.com", "type": "article"}
        ],
        "relatedTopics": ["load-balancing", "cap-pacelc", "consistent-hashing"]
    },
    {
        "id": "comm-protocols",
        "title": "Client-Server Communication: Polling, WebSockets, SSE & gRPC",
        "subject": "System Design",
        "category": "Foundations",
        "difficulty": "Intermediate",
        "estimatedTime": "45 min",
        "tags": ["WebSockets", "SSE", "Long Polling", "gRPC", "Protocols"],
        "what": """Modern distributed systems utilize distinct transport protocols depending on latency requirements, message directionality (simplex vs duplex), and payload efficiency.

The four primary paradigms are:
1. **Short Polling**: Client periodically requests updates via HTTP.
2. **Long Polling**: Server holds the HTTP request open until new data arrives or timeout occurs.
3. **WebSockets (RFC 6455)**: Full-duplex persistent bidirectional TCP socket.
4. **Server-Sent Events (SSE)**: Unidirectional push from server to client over standard HTTP streaming (`text/event-stream`).
5. **gRPC / Protocol Buffers**: Binary RPC protocol running over HTTP/2 multiplexing.""",
        "why": """Choosing the wrong communication protocol wastes 90% of bandwidth on empty HTTP headers or crashes mobile devices due to radio battery drain.

- Real-time multiplayer games or chat need bidirectional sub-millisecond WebSockets.
- Stock tickers or LLM token streaming require simple unidirectional Server-Sent Events.
- High-throughput internal microservice RPCs require binary serialized gRPC.""",
        "how": """- **WebSockets**: Begins as an HTTP/1.1 request with `Upgrade: websocket` header -> server replies HTTP 101 Switching Protocols -> socket stays open for framing.
- **Server-Sent Events**: Client sends `Accept: text/event-stream` -> Server leaves connection open and writes text lines: `data: {"token": "hello"}\\n\\n`.
- **gRPC**: Protobuf compiler generates client stub and server interfaces -> serializes structured binary frames over a single multiplexed HTTP/2 TCP connection.""",
        "internals": """## Protocol Decision Matrix

| Protocol | Directionality | Transport | Header Overhead | Reconnection | Best Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Short Polling** | Unidirectional (Client pulls) | HTTP/1.1 | Massive (~1KB headers/req) | Built-in | Infrequent status checks (e.g. check order status every 30s) |
| **Long Polling** | Emulated Duplex | HTTP/1.1 | High (headers on every cycle) | Manual in JS | Legacy fallback for environments blocking WebSockets |
| **Server-Sent Events** | Unidirectional (Server -> Client) | HTTP/2 or 1.1 | Minimal | Automatic via browser `EventSource` | AI streaming (ChatGPT tokens), live sports scores, dashboards |
| **WebSockets** | Full-Duplex (Bidirectional) | TCP Socket | Tiny (2-10 bytes per frame) | Must implement in app code | Collaborative docs (Google Docs), multiplayer games, chat apps |
| **gRPC** | Bidirectional & Streaming | HTTP/2 | Micro (Protobuf binary) | Built-in client connection pool | High-throughput internal microservice-to-microservice RPCs |""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        COMMUNICATION PROTOCOL TOPOLOGIES                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. WEBSOCKETS (Full-Duplex):                                                     |
|     Client <================= Persistent Bidirectional Socket ===============> Server |
|                                                                                   |
|  2. SERVER-SENT EVENTS (Unidirectional Stream):                                   |
|     Client <------------------ Streamed HTTP Event Push ---------------------- Server |
|                                                                                   |
|  3. LONG POLLING (Request / Delayed Response):                                    |
|     Client ---- HTTP GET ----> Server holds connection open until event ---------> |
|     Client <--- Response ----- Server responds when event occurs ---------------+ |
|                                                                                   |
|  4. gRPC / HTTP/2 (Multiplexed Binary Streams):                                   |
|     Client <=== Multiplexed Binary Streams (Protobuf) over single TCP ====> Server |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "realWorld": "ChatGPT uses Server-Sent Events (SSE) for word-by-word token streaming, WhatsApp uses WebSockets/TCP for chat, and Uber uses gRPC for high-throughput internal microservice communications.",
        "advantages": [
            "SSE: Works natively through firewalls/proxies without special socket negotiation; automatic reconnection",
            "WebSockets: Lowest latency bidirectional framing for collaborative apps",
            "gRPC: Up to 7x faster than REST+JSON with strict schema typing"
        ],
        "disadvantages": [
            "WebSockets: Stateful connections complicate horizontal load balancing and failover",
            "gRPC: Binary payloads are not human-readable without debugging proxies"
        ],
        "tradeoffs": "WebSockets (Complex stateful connection tracking) vs SSE (Simple HTTP streaming). For server-to-client notifications or LLM streaming, SSE is significantly simpler and more resilient.",
        "alternatives": ["MQTT (IoT messaging)", "WebTransport (HTTP/3 over QUIC)"],
        "whenToUse": "Choose based on directionality: WebSockets for bidirectional; SSE for server push; gRPC for internal microservices; REST for public APIs.",
        "whenNotToUse": "Do not use WebSockets for simple request-response CRUD APIs.",
        "commonMistakes": [
            "Using WebSockets when unidirectional SSE would eliminate socket maintenance overhead",
            "Failing to implement heartbeats / ping-pong frames to detect dead WebSocket connections through NAT firewalls"
        ],
        "interviewQuestions": [
            {
                "q": "Why is Server-Sent Events (SSE) preferred over WebSockets for ChatGPT streaming responses?",
                "a": "LLM token generation is strictly unidirectional (the server streams tokens to the client; the client doesn't send concurrent data back on the same stream). SSE runs over standard HTTP, natively supports HTTP/2 multiplexing, traverses corporate firewalls effortlessly, and features automatic client-side reconnection via the browser's EventSource API without custom socket code."
            }
        ],
        "resources": [
            {"title": "The WebSocket Protocol (RFC 6455)", "url": "https://datatracker.ietf.org/doc/html/rfc6455", "type": "docs"}
        ],
        "relatedTopics": ["hld-whatsapp", "load-balancing", "spring-security-jwt"]
    },
    {
        "id": "load-balancing",
        "title": "Traffic Ingress: Load Balancing (L4 vs L7) & Reverse Proxies",
        "subject": "System Design",
        "category": "Foundations",
        "difficulty": "Intermediate",
        "estimatedTime": "45 min",
        "tags": ["Load Balancer", "Nginx", "HAProxy", "Envoy", "L4", "L7"],
        "what": """A Load Balancer distributes incoming network traffic efficiently across a pool of backend servers to ensure high availability, fault tolerance, and responsiveness.

Load balancers operate at two primary layers of the OSI model:
- **Layer 4 (Transport Layer)**: Routes traffic based on IP address and TCP/UDP port without decrypting or inspecting packet payloads (e.g. AWS NLB, IPVS).
- **Layer 7 (Application Layer)**: Inspects HTTP headers, cookies, URLs, and JSON payloads to make intelligent routing decisions (e.g. AWS ALB, Nginx, Envoy, HAProxy).""",
        "why": """Without load balancing, traffic concentrates on single servers, causing outages when traffic spikes or nodes crash.

1. **Failure Masking**: Automatic health checking routes traffic away from unhealthy instances in real time.
2. **TLS Termination**: Offloads expensive SSL/TLS handshake cryptography from application servers.
3. **Content-Based Routing**: Directs `/api/video` to streaming clusters and `/api/checkout` to transactional clusters.""",
        "how": """1. Client queries DNS -> resolves to Anycast Virtual IP (VIP) of the Load Balancer.
2. Client sends TCP SYN -> Layer 4 Load Balancer distributes packet flow using consistent hashing on 5-tuple: `(src_ip, src_port, dst_ip, dst_port, protocol)`.
3. If Layer 7: Load Balancer terminates TLS -> inspects HTTP request path (`/api/v1/users`) -> forwards request down persistent keep-alive connection to chosen backend server using Round-Robin, Least-Connections, or IP-Hash.""",
        "internals": """## Layer 4 vs Layer 7 Comparison

| Feature | Layer 4 (Transport) | Layer 7 (Application) |
| :--- | :--- | :--- |
| **OSI Layer** | Layer 4 (TCP / UDP) | Layer 7 (HTTP, HTTPS, gRPC, WebSocket) |
| **Data Visibility** | Blind to payload (packet headers only) | Inspects URLs, cookies, HTTP headers, body |
| **TLS Decryption** | Pass-through (no decryption) | Terminates TLS at the proxy |
| **Throughput** | Millions of packets/sec (ultra-fast) | Lower throughput due to buffer & parse overhead |
| **Routing Flexibility**| IP and Port only | Path-based (`/auth` vs `/search`), header, cookie routing |
| **Examples** | AWS NLB, Linux IPVS, HAProxy (TCP mode) | AWS ALB, Nginx, Envoy, Traefik, HAProxy (HTTP mode) |""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        TWO-TIER LOAD BALANCER TOPOLOGY                            |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Internet Traffic ]                                                             |
|         |                                                                         |
|         v                                                                         |
|  [ Anycast DNS / Cloudflare Edge ]                                                |
|         |                                                                         |
|         v                                                                         |
|  [ Tier 1: Layer 4 Load Balancer (AWS NLB / Maglev) ]                             |
|    - Ultra-fast packet forwarding (No TLS decrypt)                                |
|    - Balances TCP connections across Tier 2 proxies                               |
|         |                                                                         |
|         +-----------------------+-----------------------+                         |
|         |                       |                       |                         |
|         v                       v                       v                         |
|  [ Tier 2: Layer 7 Proxy ] [ Tier 2: Layer 7 Proxy ] [ Tier 2: Layer 7 Proxy ]    |
|    (Nginx / Envoy)         (Nginx / Envoy)         (Nginx / Envoy)                |
|    - Terminates TLS        - Terminates TLS        - Terminates TLS               |
|    - Header / Path routing - Header / Path routing - Header / Path routing        |
|    - Rate Limiting         - Rate Limiting         - Rate Limiting                |
|         |                       |                       |                         |
|         +-----------------------+-----------------------+                         |
|                                 |                                                 |
|                                 v (Private VPC Network)                           |
|      [ Backend Microservices: Auth, Order, Payment, Catalog Clusters ]            |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "realWorld": "Google uses Maglev (L4 network load balancer) at its edge routers to distribute terabits of incoming traffic across thousands of Envoy/BFE Layer 7 application proxy servers.",
        "advantages": [
            "Zero downtime deployments through canary and blue-green weight adjustments",
            "Protection against SYN flood attacks and slowloris connection starvation",
            "Centralized TLS certificate management and HTTP/2 to HTTP/1.1 translation"
        ],
        "disadvantages": [
            "Introduces an extra network hop and potential latency if not optimized",
            "Layer 7 load balancers consume significant CPU for TLS decryption and header parsing"
        ],
        "tradeoffs": "L4 (Maximum throughput, zero application awareness) vs L7 (Deep routing logic, higher CPU cost). High-scale architectures use two tiers: L4 in front of L7.",
        "alternatives": ["DNS Round Robin", "Client-Side Load Balancing (Netflix Ribbon / gRPC)"],
        "whenToUse": "Every production web application with more than one server instance.",
        "whenNotToUse": "Direct peer-to-peer applications.",
        "commonMistakes": [
            "Using Round-Robin when request processing times vary by orders of magnitude (use Least-Connections instead)",
            "Not passing `X-Forwarded-For` and `X-Forwarded-Proto` headers to backend servers"
        ],
        "interviewQuestions": [
            {
                "q": "Why would an architecture use both Layer 4 and Layer 7 load balancers in sequence?",
                "a": "Layer 4 load balancers handle massive packet volume (millions of packets/sec) with minimal CPU usage, distributing raw TCP connections across a tier of Layer 7 proxies. The Layer 7 proxies terminate TLS, inspect HTTP paths/headers, enforce rate limits, and route to specific backend microservice clusters."
            }
        ],
        "resources": [
            {"title": "Introduction to Modern Network Load Balancing and Proxying", "url": "https://blog.envoyproxy.io", "type": "article"}
        ],
        "relatedTopics": ["comm-protocols", "hld-rate-limiter", "scaling-models"]
    },
    {
        "id": "caching-strategies",
        "title": "Distributed Caching & Invalidation Strategies",
        "subject": "System Design",
        "category": "Foundations",
        "difficulty": "Intermediate",
        "estimatedTime": "50 min",
        "tags": ["Caching", "Cache-Aside", "Write-Through", "Write-Behind", "Eviction"],
        "what": """Caching stores copies of frequently accessed data in fast in-memory storage (like Redis or Memcached) to reduce database read pressure and accelerate response times from tens of milliseconds to sub-millisecond speeds.

The two fundamental decisions are **Cache Invalidation** (how data is written) and **Cache Eviction** (which data is discarded when memory is full).""",
        "why": """Disk-based databases (PostgreSQL, MySQL) execute queries in 5-50ms and saturate at thousands of IOPS. In-memory caches serve queries in < 1ms and handle 100k+ operations per node.

However, caching introduces cache stampedes, stale data bugs, and consistency challenges when updates occur.""",
        "how": """1. **Cache-Aside (Lazy Loading)**: Application reads from cache. On miss, reads from DB, writes to cache, and returns. On write, application updates DB and deletes (or updates) cache key.
2. **Write-Through**: Application writes to cache; cache synchronously writes to DB before acknowledging write.
3. **Write-Behind (Write-Back)**: Application writes to cache; cache immediately acknowledges and writes asynchronously in batches to DB.
4. **Refresh-Ahead**: Cache automatically reloads hot keys before their TTL expires.""",
        "internals": """## Invalidation Strategies Comparison

| Pattern | Write Latency | Consistency | Failure Risk |
| :--- | :--- | :--- | :--- |
| **Cache-Aside** | Fast (writes to DB, evicts key) | Eventual (read miss repopulates) | Low; stale data if eviction fails |
| **Write-Through** | Slower (two synchronous writes) | High (cache and DB in lockstep) | If DB write fails, cache write rolls back |
| **Write-Behind** | Blazing fast (memory write only) | Inconsistent until async flush | High: process crash before DB flush causes data loss |

### Eviction Policies
- **LRU (Least Recently Used)**: Discards items not accessed for the longest time.
- **LFU (Least Frequently Used)**: Discards items with the lowest access counter.
- **TTL (Time to Live)**: Automatically purges keys after a predefined lifespan.""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        CACHE-ASIDE READ & WRITE PATTERNS                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  READ FLOW (Cache-Aside):                                                         |
|  [ Client ] ---> 1. GET key ---> [ Redis Cache ]                                  |
|                                         |                                         |
|                 +-----------------------+-----------------------+                 |
|                 | (Cache Hit)                                   | (Cache Miss)    |
|                 v                                               v                 |
|          Returns Value                                2. Query Primary DB         |
|                                                                 |                 |
|                                                                 v                 |
|                                                       3. Write back to Redis      |
|                                                                                   |
|  WRITE FLOW (Safe Invalidation):                                                  |
|  [ Client ] ---> 1. Write / Update Row ---> [ Primary Database ]                  |
|                                                    |                              |
|                                                    v                              |
|                                             2. DEL cache key                      |
|                                                (Do NOT update! Invalidate!)       |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "realWorld": "Facebook operates the world's largest Memcached installation using Cache-Aside with leased keys to eliminate cache stampedes when millions of users view trending posts.",
        "advantages": [
            "Sub-millisecond read latency for high-traffic data",
            "Shields relational databases from read query saturation",
            "Scales independently of database write instances"
        ],
        "disadvantages": [
            "Cache stampede (dog-piling) when popular keys expire",
            "Risk of serving stale data if cache invalidation events fail or lag"
        ],
        "tradeoffs": "Invalidating Cache Key (`DEL key`) vs Updating Cache Key (`SET key value`). Deleting the key is almost always preferred because concurrent writes can overwrite cache with stale data in out-of-order race conditions.",
        "alternatives": ["Local In-Memory Cache (Caffeine)", "Distributed Cache (Redis)", "Database Query Cache"],
        "whenToUse": "Read-heavy workloads (>80% reads), user sessions, catalog queries, configuration parameters.",
        "whenNotToUse": "Rapidly mutating write-heavy data where cache invalidation overhead exceeds query cost.",
        "commonMistakes": [
            "Updating the cache on write instead of invalidating (deleting) the key",
            "Setting the exact same TTL on millions of keys, causing all keys to expire simultaneously (Cache Avalanche)"
        ],
        "interviewQuestions": [
            {
                "q": "What is a Cache Avalanche and how do you prevent it?",
                "a": "A Cache Avalanche occurs when a large number of cached keys expire at the exact same moment, causing a massive wave of concurrent requests to hit the primary database simultaneously and crash it. It is prevented by adding random jitter to the TTL (e.g. `base_ttl + rand(0, 300)` seconds) so keys expire smoothly over time."
            },
            {
                "q": "Why is it better to delete a cache key rather than update it during a database write?",
                "a": "If two concurrent threads update the same record (Thread 1 sets value A, Thread 2 sets value B), network or CPU variations can cause Thread 2 to write to DB second, but Thread 1 to update the cache second. The cache now permanently stores value A while the DB stores value B. Deleting the key ensures the next read safely repopulates the latest value from the DB."
            }
        ],
        "resources": [
            {"title": "Scaling Memcache at Facebook", "url": "https://www.usenix.org", "type": "docs"}
        ],
        "relatedTopics": ["lld-lru-cache", "redis-concurrency", "consistent-hashing"]
    },
    {
        "id": "distributed-transactions",
        "title": "Distributed Transactions: Two-Phase Commit (2PC) vs Saga",
        "subject": "System Design",
        "category": "Foundations",
        "difficulty": "Expert",
        "estimatedTime": "60 min",
        "tags": ["Transactions", "2PC", "Saga", "Distributed", "Consensus", "ACID"],
        "what": """In a microservices architecture where each service owns its private database, transactions cannot rely on single-database ACID guarantees (`BEGIN ... COMMIT`).

A distributed transaction coordinates state changes across multiple physical databases over network connections. The two primary paradigms are:
1. **Two-Phase Commit (2PC)**: Synchronous, blocking protocol providing strict ACID consistency.
2. **Saga Pattern**: Asynchronous, non-blocking sequence of local transactions with compensating actions providing Eventual Consistency (BASE).""",
        "why": """When a customer buys an item:
- Inventory Service decrements stock
- Payment Service charges card
- Order Service marks order created
- Shipping Service creates tracking label

If Payment fails after Inventory decremented, a mechanism must rollback the stock change across network boundaries.""",
        "how": """- **Two-Phase Commit (2PC)**:
  - Phase 1 (Prepare): Coordinator asks all resource managers: "Can you commit?" Resources acquire locks and reply "AGREE" or "ABORT".
  - Phase 2 (Commit): If all agreed, coordinator sends "COMMIT". If any aborted, coordinator sends "ROLLBACK".
- **Saga Pattern**:
  - Executes local transaction in Service 1 -> emits event.
  - Service 2 consumes event -> executes local transaction.
  - If Step 3 fails: Orchestrator triggers compensating transactions backward (e.g. `refundPayment()`, `reAddInventory()`).""",
        "internals": """## 2PC vs Saga Architectural Comparison

| Attribute | Two-Phase Commit (2PC) | Saga Pattern |
| :--- | :--- | :--- |
| **Consistency** | Strict ACID (Immediate) | Eventual Consistency (BASE) |
| **Concurrency** | Low (Holds database locks across network hops) | High (Local transactions lock only momentarily) |
| **Availability** | Low (Blocking: crashes freeze participants) | High (Non-blocking: resilient to service failure) |
| **Rollback Mechanism**| Native DB Undo Logs (`ROLLBACK`) | Application-level Compensating Transactions |
| **Network Fit** | Low-latency local LAN clusters | WAN, cloud microservices, multi-region |""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        2PC VS SAGA PATTERN ARCHITECTURE                           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  TWO-PHASE COMMIT (2PC - Synchronous & Blocking):                                 |
|  [ Coordinator ] === 1. PREPARE ===> [ Node A (Locks) ]  [ Node B (Locks) ]       |
|  [ Coordinator ] <== 2. AGREE/ABORT = [ Node A ]         [ Node B ]               |
|  [ Coordinator ] === 3. COMMIT =====> [ Node A (Unlocks) [ Node B (Unlocks) ]     |
|                                                                                   |
|  SAGA PATTERN (Asynchronous & Compensating):                                      |
|  [ Order Created ]                                                                |
|        |                                                                          |
|        v                                                                          |
|  [ Step 1: Inventory Service ] === Succeeded ===> [ Step 2: Payment Service ]     |
|                                                           |                       |
|                                                           v (Payment Fails!)      |
|  [ Compensate: Restock Inventory ] <=== Triggered ========+                       |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "realWorld": "Financial systems (Uber, Amazon, Stripe) utilize the Saga pattern with workflow engines (Temporal / Cadence / AWS Step Functions) rather than 2PC across microservices.",
        "advantages": [
            "Saga: Extreme throughput with zero long-held distributed database locks",
            "Saga: Resilient to transient network delays and service downtime",
            "2PC: Strict immediate consistency when required by legacy monolithic systems"
        ],
        "disadvantages": [
            "2PC: Complete system stall if coordinator crashes while holding locks",
            "Saga: Application must handle dirty reads and write complex custom compensating logic"
        ],
        "tradeoffs": "ACID / Immediate Consistency (2PC - Poor Scale) vs BASE / Eventual Consistency (Saga - High Scale). Modern cloud microservices almost universally choose the Saga Pattern.",
        "alternatives": ["TCC (Try-Confirm-Cancel)", "Outbox Pattern with Eventual Sourcing"],
        "whenToUse": "Saga: Distributed e-commerce checkout, food delivery, hotel booking, ride matching.",
        "whenNotToUse": "2PC: Avoid over microservices; only acceptable inside tightly-coupled database clusters (e.g. CockroachDB Raft consensus).",
        "commonMistakes": [
            "Assuming 2PC is suitable for microservices across cloud regions",
            "Not making Saga compensating transactions idempotent (risking double refunds on retries)"
        ],
        "interviewQuestions": [
            {
                "q": "What is the single biggest weakness of Two-Phase Commit (2PC)?",
                "a": "2PC is a blocking protocol. During Phase 1, every participating database acquires exclusive locks on its rows. If the central coordinator crashes before sending the Phase 2 commit/rollback message, all participants remain indefinitely locked, starving the entire database of connections and throughput."
            },
            {
                "q": "How does a Saga handle a failure in step 4 of a 5-step distributed transaction?",
                "a": "The Saga executes compensating transactions in reverse order for steps 3, 2, and 1. For example, if Step 4 (Dispatch Courier) fails after Step 3 (Accept Order), Step 2 (Charge Payment), and Step 1 (Reserve Inventory) succeeded, the orchestrator triggers: Cancel Kitchen Order -> Issue Payment Refund -> Re-add Inventory."
            }
        ],
        "resources": [
            {"title": "Saga Distributed Transactions Pattern", "url": "https://microservices.io", "type": "article"}
        ],
        "relatedTopics": ["hld-food-delivery", "cap-pacelc", "kafka"]
    },
    {
        "id": "cap-pacelc",
        "title": "Database Scaling: Partitioning, CAP & PACELC Theorems",
        "subject": "System Design",
        "category": "Foundations",
        "difficulty": "Advanced",
        "estimatedTime": "50 min",
        "tags": ["CAP Theorem", "PACELC", "Sharding", "Replication", "Databases"],
        "what": """The CAP Theorem and its modern extension PACELC define the fundamental trade-offs in distributed data storage systems.

- **CAP Theorem (Eric Brewer)**: In any asynchronous network subject to partitions ($P$), a distributed data store can guarantee at most two of:
  - **Consistency ($C$)**: Every read receives the most recent write or an error.
  - **Availability ($A$)**: Every non-failing node returns a non-error response without guarantee of latest write.
  - **Partition Tolerance ($P$)**: System continues operating despite dropped or delayed network packets.
  *Since network partitions are physically inevitable in distributed hardware, you must choose between CP and AP.*

- **PACELC Theorem (Daniel Abadi)**: If there is a **P**artition, trade off **A**vailability vs **C**onsistency; **E**lse, trade off **L**atency vs **C**onsistency.""",
        "why": """Networks are physically imperfect (fiber cuts, router reboots, GC pauses). When two database nodes cannot communicate across a network split:
- If you accept writes on Node 1, Node 2 becomes inconsistent (**AP system**).
- If you reject writes on Node 1 to prevent divergence, availability is lost (**CP system**).""",
        "how": """- **CP Systems (e.g. HBase, MongoDB with majority write, Spanner, ZooKeeper)**: During a partition, minority nodes reject writes or step down from leadership. Guarantees linearizability at the expense of client error spikes.
- **AP Systems (e.g. Cassandra, DynamoDB, CouchDB)**: Both partitioned sides accept writes. Data diverges temporarily and reconciles via Last-Write-Wins (LWW) or Vector Clocks when the partition heals.""",
        "internals": """## PACELC Classification of Major Databases

$$\\text{If } \\mathbf{P} \\implies [ \\mathbf{A} \\lor \\mathbf{C} ], \\quad \\mathbf{E} \\implies [ \\mathbf{L} \\lor \\mathbf{C} ]$$

| Database | Partition Behavior | Normal Operation Behavior | PACELC Type |
| :--- | :--- | :--- | :--- |
| **Apache Cassandra** | Availability ($A$) | Low Latency ($L$) | **PA/EL** |
| **Amazon DynamoDB** | Availability ($A$) | Low Latency ($L$) | **PA/EL** |
| **MongoDB** | Consistency ($C$) | Low Latency ($L$) | **PC/EL** |
| **Apache HBase** | Consistency ($C$) | Consistency ($C$) | **PC/EC** |
| **Google Spanner** | Consistency ($C$) (TrueTime API) | Consistency ($C$) | **PC/EC** |
| **PostgreSQL (Sync Rep)**| Consistency ($C$) | Consistency ($C$) | **PC/EC** |""",
        "architecture": """+-----------------------------------------------------------------------------------+
|                        CAP THEOREM NETWORK PARTITION SPLIT                        |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Data Center East (Node 1) ]             [ Data Center West (Node 2) ]          |
|  Current Value: X = 10                     Current Value: X = 10                  |
|               |                                           |                       |
|               +============ [ NETWORK PARTITION ] ========+                       |
|               |        (All fiber packets dropped)        |                       |
|               |                                           |                       |
|  Client writes X = 20                                 Client reads X              |
|               |                                           |                       |
|        +------+------+                             +------+------+                |
|        |             |                             |             |                |
|     CHOICE A:     CHOICE B:                     CHOICE A:     CHOICE B:           |
|    (AP System)   (CP System)                   (AP System)   (CP System)          |
|     Accept 20     Reject write!                 Returns 10    Returns ERROR!      |
|    (Available)   (Consistency wins)             (Stale data)  (Availability lost) |
|                                                                                   |
+-----------------------------------------------------------------------------------+""",
        "realWorld": "Financial ledgers (e.g. bank accounts) choose CP/EC; social media feeds (e.g. YouTube comments, Twitter likes) choose PA/EL for instant response times.",
        "advantages": [
            "Provides mathematical clarity for selecting databases based on business risk",
            "PACELC extends CAP to address normal latency trade-offs during 99.9% uptime"
        ],
        "disadvantages": [
            "Many developers misapply CAP to single-node databases where network partitions do not exist"
        ],
        "tradeoffs": "Consistency (Zero stale reads, potential client timeouts) vs Availability (Zero downtime, risk of stale reads or conflicting concurrent writes).",
        "alternatives": ["Tunable Consistency (Cassandra `QUORUM` reads/writes: $R + W > N$)"],
        "whenToUse": "Evaluating database technology for any distributed backend.",
        "whenNotToUse": "Single-instance SQLite or single-node PostgreSQL where distributed networking is absent.",
        "commonMistakes": [
            "Claiming a distributed system can achieve CA (Consistency + Availability) without Partition Tolerance (network partitions cannot be opted out of in physical reality)",
            "Ignoring PACELC latency costs during non-partitioned normal operations"
        ],
        "interviewQuestions": [
            {
                "q": "Why is 'CA' (Consistent and Available) impossible in real-world distributed systems?",
                "a": "Network partitions (P) are physical realities of hardware and networking (switch failures, fiber cuts, GC pauses). When a partition inevitably occurs, a distributed system MUST choose either to allow writes and diverge (sacrificing Consistency) or block writes (sacrificing Availability). Therefore, you can only choose CP or AP."
            },
            {
                "q": "How does Tunable Consistency in Cassandra achieve strong consistency ($R + W > N$)?",
                "a": "If replication factor is $N=3$, choosing Write Quorum $W=2$ and Read Quorum $R=2$ guarantees that $R + W = 4 > 3$. By the Pigeonhole Principle, at least one node read during a query must overlap with the nodes written to during the last update, ensuring the latest timestamped value is always observed."
            }
        ],
        "resources": [
            {"title": "Brewer's CAP Theorem", "url": "https://www.infoq.com", "type": "article"}
        ],
        "relatedTopics": ["consistent-hashing", "distributed-transactions", "kafka"]
    }
]
