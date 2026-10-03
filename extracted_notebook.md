

<!-- PAGE 1 -->

10/3/26, AM
PDF
Kaustuk CV
i wanted you to prepare me a fully detailed notbook where
you include every thing discussed in gaurav sen system
design playlist in details , with why , what how and other in
details in simple way.and atleast 15 full solution of
The Complete Engineering Notebook: Distributed
Systems, System Design (HLD & LLD), and Modern
Enterprise Backend Architecture
1. Core Distributed Systems Foundations (The Gaurav Sen
Curriculum)
1.1 Vertical vs Horizontal Scaling
Vertical Scaling (Scale-Up): Adding more compute resources (CPU cores, RAM, NVMe
SSDs) to a single machine.
Why: Zero architectural complexity; code runs unmodified; zero network overhead
between processes.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 2 -->

10/3/26, AM
Trade-offs: Hard hardware ceiling; diminishing cost-to-performance ratio; single
point of failure (SPOF) during hardware maintenance.
Horizontal Scaling (Scale-Out): Adding more commodity machines to form an
interconnected pool.
Why: Virtually unlimited scale; high fault tolerance; resilient against isolated
hardware crashes.
Trade-offs: Requires distributed coordination, data partitioning, network
serialization latency, and stateless application designs.
1.2 Client-Server Communication Models
Short Polling: The client sends an HTTP request every N seconds.
Why: Dead simple to implement with standard REST.
Trade-offs: High server overhead, empty responses waste bandwidth, introduces
latency bounded by polling interval.
Long Polling: The client requests data; the server holds the HTTP connection open until
new data arrives or a timeout occurs. Once data arrives, the connection closes, and the
client immediately opens another.
Why: Drastically reduces latency compared to short polling while still working over
standard HTTP/I.I proxies.
Trade-offs: Server connection thread starvation if thread-per-request models (like
classic Tomcat) are used; reconnect storms during bulk updates.
WebSockets: Full-duplex, persistent TCP connection negotiated via an HTTP Upgrade
handshake ( Connection: Upgrade
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 3 -->

10/3/26, AM
Why: Sub-millisecond bidirectional communication with minimal framing overhead
(2-10 bytes per frame vs kilobytes of HTTP headers). Essential for live chat, stock
tickers, and multiplayer synchronization.
Trade-offs: Stateful; complicates load balancing; requires sticky sessions or a
pub/sub backplane (like Redis Pub/Sub) to route messages across instances.
Server-Sent Events (SSE): Persistent unidirectional HTTP streaming from server to client (
Content—Type: text/event-stream
Why: Built-in browser reconnection, lightweight, operates over standard HTTP/2
multiplexing. Ideal for LLM token streaming and live notifications.
Trade-offs: Unidirectional only (client cannot stream upstream over the same
channel).
1.3 Communication Protocols: REST vs gRPC
Dimension
Protocol
Payload
Contract
https://genni.google.corWapp/9c630fe34c54d948
REST (Representational State
Transfer)
HTTP/I.I or HTTP/2
JSON (Human-readable text)
Loose (OpenAPl / Swagger
optional)
gRPC (Google Remote Procedure
call)
Strict HTTP/2 (Multiplexed,
bidirectional streaming)
Protocol Buffers (Compact binary
serialization)
Strict . proto schema compiled
to native code

<!-- PAGE 4 -->

10/3/26, AM
Dimension
Performance
Best Used For
REST (Representational State
Transfer)
Higher parsing latency,
payload bloat
External public APIs, web
clients
gRPC (Google Remote Procedure
call)
High throughput, minimal CPU
parsing overhead
Internal inter-service microservice
RPCs
1.4 Load Balancing & Reverse Proxies
Layer 4 (Transport Layer): Operates on IP and TCP/UDP ports without inspecting packet
payloads (e.g., AWS NLB, HAProxy TCP mode). Extremely fast, minimal CPU cost.
Layer 7 (Application Layer): Inspects HTTP headers, cookies, and URI paths (e.g., NGINX,
Envoy, AWS ALB). Enables path-based routing ( /api/vl/orders vs /api/vl/users ),
SSL termination, and rate limiting.
Load Balancing Algorithms:
Round Robin / Weighted Round Robin: Distributes sequentially; fails when request
execution time varies drastically.
Least Connections: Routes to the node with the fewest active TCP streams; ideal for
long-lived sessions.
IP Hash / Consistent Hash: Routes identical client IPs to the same backend for
session locality.
1.5 Consistent Hashing
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 5 -->

10/3/26, AM
In basic modular hashing (Server Hash(Key) (mod N)), adding or removing a server
invalidates almost 100% of keys, causing massive cache stampedes.
[Server A) (00)
[Server C)
(2400) \
[Server B] (1200)
Virtual Nodes
Mechanism: Both servers and data keys are mapped onto a 360-degree hash ring (e.g.,
using MD5 or MurmurHash3 to [O, 232
— 1]). A key is assigned to the first server
encountered moving clockwise.
Virtual Nodes (Vnodes): Each physical server is assigned multiple positions on the ring
(e.g., 100—256 virtual tokens).
Why: Prevents hot-spots (non-uniform distribution) and ensures that when a server
crashes, its load is distributed evenly across all remaining nodes rather than
flooding a single neighbor.
1.6 Caching Strategies & Eviction Policies
Cache Read/Write Strategies:
Cache-Aside (Lazy Loading): Application checks cache; on miss, fetches from DB,
updates cache, and returns. Application manages caching logic. DB and cache can
drift if updates fail.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 6 -->

10/3/26, AM
Read-Through: Application queries cache service directly. Cache service
transparently fetches from DB on miss.
Write-Through: Application writes to cache; cache synchronously writes to DB
before acknowledging. Strong consistency, high write latency.
Write-Back (Write-Behind): Application writes to cache; cache acknowledges
immediately and batches asynchronous writes to DB. Ultra-low latency, risk of data
loss on cache node crash.
Cache Eviction Algorithms:
LRU (Least Recently Used): Evicts items whose access time is oldest (implemented
via Doubly Linked List + Hash Map).
LFU (Least Frequently Used): Evicts items with the lowest access count
(implemented via Min-Heap or Frequency Linked Lists).
FIFO (First-in, First-Out): Evicts oldest inserted items regardless of usage.
1.7 Distributed Messaging: Apache Kafka Architecture
Kafka is a distributed, partitioned, replicated append-only commit log designed for high-
throughput, fault-tolerant event streaming.
KAFKA CLUSTER
TOPIC: "order
-events"
I Partition 0:
[Offset
https://genni.google.corWapp/9c630fe34c54d948
0] [Offset 1] [Offset
2] [Offset 3]

<!-- PAGE 7 -->

10/3/26, AM
Partition
1:
[Offset
Consumer Group A
(Order Processing)
O] [Offset 1] [Offset 2]
Consumer Group B
(Analytics Engine)
Topics & Partitions: A Topic is a logical category. Topics are split into Partitions, which are
the physical unit of scalability and parallelism. Messages within a partition are strictly
ordered by sequential IDs called Offsets.
Producers & Partitioning Keys: Producers publish events. If a message key is supplied,
Kafka hashes it ( MurmurHash2(key) % num_partitions ) ensuring messages with the
same key (e.g., order _ id ) always land on the exact same partition, guaranteeing strict
per-entity ordering.
Brokers, Controllers, and ISR (In-Sync Replicas):
Each partition has one Leader broker and multiple Follower replicas.
Producers write exclusively to the Leader. Followers pull data to stay in sync.
ISR: Replicas that are fully caught up with the Leader. If a Leader crashes, the Kafka
Controller elects a new Leader exclusively from the ISR pool.
Consumer Groups & Offset Management:
A Partition can be consumed by at most one consumer instance within a specific
Consumer Group at any time. Adding consumers beyond the partition count leaves
them idle.
Different consumer groups maintain independent offset pointers, enabling multiple
systems (e.g., Billing, Inventory, Fraud) to process the same event stream
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 8 -->

10/3/26, AM
independently without duplicate work.
Delivery Semantics:
At-Most-Once: Commit offset before processing. If processing crashes, message is
lost.
At-Least-Once: Process message, then commit offset. If crash occurs after
processing but before commit, message is re-delivered. Requires idempotent
consumer handlers.
Exactly-Once (EOS): Uses transactional producers ( sendOffsetsToTransaction
coordinating commits across partitions and DB states via a two-phase commit.
1.8 Database Scaling: Replication, Partitioning, and CAP Theorem
Replication:
Leader-Follower (Master-Slave): Master handles all writes; slaves replicate logs and
serve reads. Slaves can lag (Replication Lag), leading to stale reads.
Multi-Leader: Multiple nodes accept writes. High availability across regions, but
requires conflict resolution strategies (Last-Write-Wins, CRDTs).
Leaderless (Dynamo-style): Quorum reads and writes (R + W > N).
Sharding Strategies:
Range-Based: Split by key ranges (e.g., IDs 1-10,000). Prone to hot spotting if keys
increase sequentially.
Hash-Based: Hash key modulo shard count. Uniform distribution, but expensive to
rebalance without consistent hashing.
CAP Theorem: In the presence of a Network Partition (P), a distributed system must
choose between:
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 9 -->

10/3/26, AM
Consistency (C): Every read receives the most recent write or an error.
Availability (A): Every non-failing node returns a non-error response, without
guaranteeing it contains the latest write.
PACELC Theorem: If there is a Partition (P), trade off Availability (A) and Consistency (C
); Else (E), trade off Latency (L) and Consistency (C).
1.9 Distributed Transactions: 2PC vs Saga Pattern
Two-Phase Commit (2PC): A coordinator asks all participants to Prepare, and if all vote
yes, asks them to Commit.
Why: Guarantees strong ACID across databases.
Trade-offs: Blocking protocol. If coordinator crashes during the commit phase,
locks are held indefinitely, destroying system availability.
Saga Pattern: A sequence of local transactions where each updates its local database
and publishes an event triggering the next step.
Compensating Transactions: If a step fails, the saga runs compensating actions
backward (e.g., refund money if inventory reservation fails).
Orchestration: A central Saga Orchestrator tells participants what local transaction
to execute next.
Choreography: Each service listens to events and decides when to trigger its local
transaction.
2. Advanced Tech Deep Dives (From Your Profile & Stack)
2.1 Spring Boot, Spring Security & JWT Architecture
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 10 -->

10/3/26, AM
Spring Boot Internal Architecture: Operates around the Dispatcherservlet , which
catches incoming HTTP requests, queries HandlerMapping , invokes the matching
@RestControIIer , and processes serialization via HttpMessageConverter (Jackson)
before passing through Filters and Interceptors.
Spring Security Filter Chain: Security is enforced via a chain of servlet filters (
SecurityFilterChain
Incoming requests pass through CorsF i Iter , CsrfFiIter , and custom
authentication filters before hitting business controllers.
JWT (JSON web Token) Lifecycle:
Structure: Header. Payload. Signature encoded in Base64URL.
Signature Verification: Uses HMAC-SHA256 ( HS256 ) or RSA ( RS256 ):
Signature — HMAC-SHA256(base64Url(header) -F " ." + base64Url(payl,
Stateless Authentication Flow: Client passes JWT in
Authorization: Bearer . A custom JwtAuthenticationFilter
intercepts the request, verifies the signature against the server's public key/secret,
extracts the claims ( sub , rotes ), and injects an
Authentication object into the
SecurityContextHoIder . No database session query required.
2.2 Relational vs Non-Relational & PostgreSQL JSONB
Relational Storage Engine (PostgreSQL / MySQL InnoDB):
Employs B+Trees for indexed lookups (O (log N)). Enforces strict ACID using Write-
Ahead Logging (WAL) for durability and Multi-Version Concurrency Control (MVCC)
for non-blocking reads.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 11 -->

10/3/26, AM
PostgreSQL JSONB Internals:
Unlike raw JSCN (which stores exact text representations), stores
decomposed binary formats. It parses whitespace, normalizes keys, and supports
GIN (Generalized Inverted Index) indexing.
Use Case in NestXchange: Instead of creating separate database tables for different
listing categories (properties, vehicles), a universal Listing table holds standard
relational columns ( id , price , user_id , status ), while dynamic attributes
(e.g., mileage , bedrooms , furnishing ) reside inside a single JSONB column.
GIN indexing over this column enables high-speed filtered queries without dynamic
schema alterations.
2.3 Redis Internals & Concurrency Control
In-Memory Architecture: Uses an event-driven single-threaded execution loop (1/0
Multiplexing via epoll ) to achieve sub-millisecond latencies across hundreds of thousands
of operations per second, eliminating thread context-switching overhead and locking
bottlenecks.
Distributed Locking (Redlock / SETNX):
To prevent double-booking or race conditions across microservice clusters:
Bash
SET resource _ key my_unique_uuid NX PX 3eeee
NX : Set only if key does not exist.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 12 -->

10/3/26, AM
PX 30000 : Set automatic expiry to 30,000 milliseconds to avoid deadlocks if the
holder dies.
Releasing the Lock: Must be executed via an atomic Lua script that compares the stored
UUID with the caller's UUID before deleting, ensuring an instance does not accidentally
unlock a resource whose lock expired and was re-acquired by another process.
2.4 Agentic LLM Architectures: Planner-Executor-Reflector
Planner: Takes a complex goal, queries domain metadata, and decomposes the request
into an ordered Directed Acyclic Graph (DAG) of discrete operational tasks.
Executor: Executes individual tasks by invoking specific external tools, database queries,
or microservice REST/gRPC endpoints using structured JSON function calling.
Reflector (Evaluator): Assesses the execution output against expected preconditions and
validation schemas. If an error or degraded result occurs, it feeds the execution trajectory
and error log back to the Planner for self-correction.
Risk-Tiered Human-in-the-Loop (HITL): Actions categorized by financial or operational
risk:
Tier I (Read-Only / Low-Risk): Automated execution (e.g., checking inventory levels,
reading order status).
Tier 2 (Medium-Risk): Automated execution with audit notifications (e.g., updating
delivery addresses).
Tier 3 (High-Risk): Execution paused; state persisted in PostgreSQL; an approval
ticket is dispatched to an operations dashboard. Resumption occurs only upon valid
cryptographic employee sign-off.
2.5 Retrieval-Augmented Generation (RAG) Architecture
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 13 -->

10/3/26, AM
Ingestion Pipeline:
2.
3.
4.
Document Parsing: Extract clean text from unstructured sources (PDFs, Markdown,
Web pages) using tools like Apache Tika.
Chunking: Split text using recursive character splitters (500—1000 tokens) with a
sliding overlap window (10—20%) to preserve context across boundaries.
Embedding Generation: Map textual chunks into high-dimensional dense vector
spaces (e.g., 1536 dimensions) using models like OpenAI
text-embedding-3-small or open-source HuggingFace models.
Vector Database Indexing: Store embeddings in vector stores (ChromaDB, Pinecone,
pgvector) using Approximate Nearest Neighbor (ANN) index algorithms:
HNSW (Hierarchical Navigable Small World): Multi-layered graphs offering high
query throughput and recall at the expense of memory.
IVF (Inverted File Index): Clusters vector space into Voronoi cells; narrows
search to closest centroids.
Query & Retrieval Pipeline:
2.
3.
User query is transformed into a dense embedding using the same embedding
model.
Perform cosine similarity or dot product search across the vector index to retrieve
the top-K most relevant text chunks:
Cosine Similarity
All
Re-Ranking (Cross-Encoder): Pass the top-K candidates through a fine-grained re-
ranking model to compute exact relevance scores, pruning irrelevant results.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 14 -->

10/3/26, AM
4.
Context Injection: Augment the original prompt with retrieved chunks inside strict
delimiting XML tags and instruct the LLM to ground its response exclusively within
the provided context.
2.6 Computer Vision & ANPR Pipeline
YOLO (You Only Look Once): Single-stage object detector framing detection as a
regression problem. It divides the input image into an S x S grid. Each grid cell predicts
B bounding boxes, confidence scores, and class conditional probabilities in a single
forward pass, achieving real-time inference (30—60 F PS).
Image Preprocessing Pipeline (OpenCV):
2.
3.
4.
Grayscale Conversion: Eliminates redundant chromatic channels, reducing
processing overhead.
Bilateral Filtering / Gaussian Blur: Removes high-frequency camera noise while
preserving sharp plate edge boundaries.
Adaptive Thresholding (Otsu's / Sauvola): Converts grayscale images to binary (pure
black and white) by calculating localized threshold values across neighborhoods,
compensating for strong shadows and headlight glare.
Morphological Transformations: Applies dilation and erosion to close character
gaps and isolate character contours.
OCR Engines (PaddleOCR / EasyOCR):
Uses a two-stage approach: a Text Detection Network (DBNet) locates character
bounding polygons, and a Text Recognition Network (CRNN with CTC loss or SVTR)
decodes character sequences.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 15 -->

10/3/26, AM
--->
3. High-Level Design (HLD) Solutions: 8 Comprehensive
Architectures
System 1: Netflix (Global Video Streaming System)
Requirements
Functional: Upload/encode 4K videos; globally stream video with adaptive bitrate;
personalized home feed; track playback progress.
Non-FunctionaI: High availability (99.999%); low playback startup latency (< 500 ms);
massive read-to-write ratio (1000 : 1); fault-tolerant global edge delivery.
Scale & Estimations
Daily Active Users (DAW): 100 Million.
Concurrent streams at peak: 15 Million.
Average video bitrate: 3 Mbps (Adaptive 500 kbps to 15 Mbps).
Peak Outbound Bandwidth: 15 Million x 3 Mbps 45 T bps (Served entirely via
CDN / Open Connect Appliances).
Architecture & Component Diagram
I Client App
I (Smart TV/Web) I
I (API Requests:
https://genni.google.corWapp/9c630fe34c54d948
I Anycast DNS /
I Geo Routing
Metadata, Auth,
CDN I -
I Edge Open Connect (OCA) I
I Video Byte Delivery
Progress)

<!-- PAGE 16 -->

10/3/26, AM
——->
--->
I API Gateway (Envoy)
I Rate Limit & JWT Auth I
Transcoding & Storage Pipeline
Playback History
Service
Transcoding Engine
(Queue Driven)
Cassandra Cluster
User Watch States
S3 Master Assets & I
CDN Push Workers
2.
3.
4.
5.
6.
Content teams upload raw master mezzanine video files to an Amazon S3 staging bucket.
An S3 ObjectCreated event drops an event into an Apache Kafka queue.
Transcoding workers pull jobs, chunking the video into 2- to 10-second segments.
Each segment is transcoded into multiple codecs (H.264/AVC, H.265/HEVC, AVI) across
dozens of resolutions (360p, 720p, 1080p, 4K) and bitrates.
Transcoding workers generate manifest files:
HLS (HTTP Live Streaming): Master .m3u8 playlist referencing resolution-specific
playlists.
DASH (Dynamic Adaptive Streaming over HTTP):
. mpd XML manifest.
Encoded chunks are distributed across Netflix Open Connect Appliances (OCAs)—
custom FreeBSD storage servers embedded directly inside regional ISPs worldwide.
Database Strategy & Data Flow
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 17 -->

10/3/26, AM
Cassandra (Playback State & Metadata):
Why: Cassandra's masterless ring architecture handles massive write throughput with
linear horizontal scale.
Schema:
SQL
CREATE TABLE user_playback_progress (
user_id uuid,
profile_id uuid,
video_id uuid,
offset _ seconds int,
completed_percentage float,
last _ updated timestamp ,
PRIMARY KEY ((user_id, profile_id) ,
video_id)
Partition key (user_id, profile_id) groups all watch history for a single user onto
the same partition node, enabling single-digit millisecond reads when rendering the
"Continue Watching" carousel.
System 2: Uber / Grab (Real-Time Location & Ride Matching)
Requirements
Functional: Real-time driver location updates every 4 seconds; rider requests pickup;
match rider to nearby active drivers within a radius; live tracking during transit.
Non-Functional: Sub-second latency for location ingestion; high availability over
consistency for location pings; fault-tolerant driver-to-rider matching.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 18 -->

10/3/26, AM
Scale & Estimations
Active Drivers: 1 Million concurrent.
Active Riders: IO Million.
Ingestion Rate: 1 Million updates/ 4 sec
throughput.
Architecture & Component Diagram
250, 000 QPS location write
I Driver Mobile App I -
I (4s Ping via WS)
I Rider Mobile App
I (Request Ride)
Location Ingestion
Service (Netty/Kafka)
Ride Matching Engine
(DAG / State Machine) I
Transaction DB
(PostgreSQL Aurora)
---->
Redis Geospatial
In-Memory Shards
(GEOSEARCH Radius Query)
I I Kafka Match Event
I Drivers Notification I
Geospatial Indexing Strategy: H3 vs S2 vs Geohash
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 19 -->

10/3/26, AM
2.
3.
4.
Geohash: Interleaves latitude/longitude into base32 strings forming hierarchical
rectangular bounding boxes. Edge distortion occurs near poles and meridian boundaries.
Google S2: Projects Earth onto a cube with Hilbert space-filling curves. Quadrilateral
cells, strong performance, but non-uniform edge-to-center distances.
Uber H3 (Hexagonal Hierarchical Spatial Index):
Why Chosen: Hexagons have invariant neighbor distances: every adjacent cell center
is equidistant (unlike squares where diagonal neighbors are 2 times farther). This
makes radius searches, demand-heat calculations, and surge-pricing cluster
expansions mathematically uniform.
Spatial resolution 8 (average hexagon area z O. 737 km , edge length
461 meters) perfectly matches localized driver search radiuses.
Location Ingestion Flow & Redis Sharding
Drivers maintain persistent WebSocket connections to a pool of Netty-based Gateway
servers.
Every 4 seconds, the driver transmits {driver_id, Lat, Ing, status: "AVAILABLE'}
The Gateway pushes location pings to an Apache Kafka driver-locations topic,
partitioned by H31ndex(Lat, Ing, res_8)
Consumer workers consume from Kafka and update a cluster of Redis instances:
Bash
GEOADD drivers:res8: <h3_parent_index> <lng> <lat> <driver_id>
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 20 -->

10/3/26, AM
5.
6.
Redis structures internal keys using Sorted Sets ( ZSET ), where the score is a 52-bit integer
encoding the spatial coordinate (Geohash-derived integer).
When a rider requests a pickup:
The Matching Engine converts the rider coordinate to an H3 index.
It queries Redis using GEOSEARCH across the rider's cell and its 6 immediate
neighboring hexagonal rings:
Bash
GEOSEARCH drivers:res8 FROMLONLAT BYRADIUS 3
The top candidate drivers are dispatched to a Kafka dispatch-offers topic.
System 3: Food Delivery Platform (DoorDash / Zomato / Swiggy)
Requirements
Functional: Dynamic restaurant menu rendering; cart checkouts; real-time transactional
order placement; multi-role tracking (Customer, Restaurant, Delivery Partner);
asynchronous status notifications.
Non-Functional: Zero lost orders (Strict ACID transactional boundaries); sub-second
checkout latency; resilient under meal-time spikes (5 x base traffic).
Scale & Estimations
Daily Orders: 5 Million orders/day.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 21 -->

10/3/26, AM
Peak Order Throughput: 2, 500 orders/ second.
Average order latency requirement: < 800 ms for checkout authorization.
Architecture & Microservices Topology
I Client Apps
I (React/Mobile)
I Restaurant Service I
I (Accept/Reject)
API Gateway
(Spring Cloud/l<ong) I
Order Service
(Spring Boot)
(Kafka Order Events)
Payment Service
(Stripe/PG Adapter) I
——---> I Catalog Service
I (Redis + MongoDB)
---> I Transaction DB
I (MySQL InnoDB 8.e) I
Delivery Dispatch
(Location Engine)
Transactional Order Placement & Concurrency
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 22 -->

10/3/26, AM
Preventing Race Conditions (The "Last Item" Problem): When thousands of users attempt to
purchase a limited menu promotion simultaneously, a standard SELECT followed by an
UPDATE leads to double-allocation due to lost updates.
Concurrency Mechanisms Evaluated:
Optimistic Locking: Reads row witha version column. Updates only if
• : read_version . Fails high-concurrency requests with high rollback
WHERE version .
retry overhead.
Pessimistic Locking: Uses SELECT
FOR UPDATE . Locks the row at the database
engine level; serializes transactions cleanly, but creates lock contention bottlenecks
under heavy load.
Distributed Redis Token Pre-Allocation: Decrement inventory atomically in Redis using an
atomic script:
Lua
if ,
KEYS[I]) =
1 then
tonumber (redis. call ( "GET" ,
local stock
if stock > e then
redis. call( "DECRBY" ,
KEYS[I], 1)
return 1
else
return e
end
else
return —1
KEYS CID)
Once Redis successfully decrements the token, the request asynchronously commits to
the MySQL database.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 23 -->

10/3/26, AM
Order Lifecycle State Machine & The Saga Pattern
Order States: CREATED + PAYMENT_PENDING + PAID + RESTAURANT_ACCEPTED -+
PREPARING * -+ DELIVERED -+ REFUNDED
An Order Orchestrator coordinates steps using Kafka:
2.
3.
4.
OrderService inserts order with status CREATED
PaymentService executes payment. If failed, transitions order to CANCELLED
RestaurantService validates kitchen queue. If rejected, triggers compensating step:
PaymentService issues a REFUND .
If accepted, dispatches message to DeliveryDispatchService to locate courier.
System 4: WhatsApp / Telegram (End-to-End Encrypted Real-Time Chat)
Requirements
Functional: I-on-I private messaging; group chats (1000+ members); delivery receipts
(Sent, Delivered, Read); offline message queuing; media attachment handling.
Non-Functional: Sub-200 ms message latency globally; End-to-End Encryption (E2EE);
zero persistent plain-text storage on application servers; minimal mobile battery
consumption.
Scale & Estimations
Active Users: 2 Billion.
Messages per day: 100 Billion.
Average message QPS: 1, 150, 000 msgs/sec.
Peak QPS: 3, 000, 000 msgs/sec.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 24 -->

10/3/26, AM
Architecture & Component Diagram
------->
I Sender Client
I (E2EE Packet
I Chat Gateway Pod
I (Erlang/Elixir /
I Netty TCP Socket)
over TLS)
Ephemeral Session
Registry (Redis /
Hash Ring)
(Offline)
Receiver Client
Chat Gateway Pod
(Active TCP Stream) I
----> I Offline Inbox C
I (Cassandra / Sc
Protocol Selection: XMPP vs MQTT vs Raw WebSockets
XMPP: Heavy XML framing bloats mobile cellular data; high CPU overhead for parsing.
MQTT: Lightweight binary publish/subscribe protocol designed for constrained IoT
networks; excellent for battery efficiency, but lacks custom application-level session
routing semantics required for chat.
Custom Protocol over TLS/TCP (Noise Protocol + WebSockets): WhatsApp uses a
customized variant of XMPP over noise protocol framing, while Telegram uses MTProto. A
lightweight binary protobuf framing over persistent TLS TCP sockets minimizes header
overhead to bytes.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 25 -->

10/3/26, AM
E2EE (Signal Protocol) Details
Utilizes the Double Ratchet Algorithm combining:
2.
Extended Triple Diffie-Hellman (X3DH) key exchange for mutual authentication and
initial shared secret derivation when starting sessions.
Symmetric-key Ratchet: Generates new ephemeral encryption keys for every single
message sent. Even if a private key is compromised, historical messages remain
cryptographically protected (Forward Secrecy).
Application servers route encrypted opaque payloads: the server sees only sender 'D,
receiver ID, and binary ciphertext.
Connection Maintenance & Offline Queuing
2.
3.
4.
Each client maintains an active bidirectional socket with a Chat Gateway instance.
The Gateway maps user_id -> gateway_instance_ip in an in-memory Redis cluster.
When User A messages User B:
The Gateway looks up User B's current connected gateway IP in Redis.
If User B is online, the message is routed directly through an internal cross-node TCP
connection to User B's gateway and delivered over the socket.
User B acknowledges receipt; the gateway sends a "Delivered" ACK back to User A.
If User B is offline:
The message is appended to User B's inbox table in ScyllaDB/Cassandra.
An Apple APNs or Google FCM Push Notification is triggered.
Once User B reconnects, their gateway pulls unread rows sequentially, streams them
down the socket, and deletes them from ScyllaDB upon confirmation.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 26 -->

I Tweet Service
I (Accepts Tweet)
I Fanout Service
I (Worker Pool)
https://genni.google.corWapp/9c630fe34c54d948
10/3/26, AM
System 5: Twitter / X (Timeline Generation & Fanout Engine)
Requirements
Functional: Post tweets (280 characters, media links); follow users; render home timeline
(tweets from followed users, chronologically or ranked); render user profile timeline.
Non-FunctionaI: Sub-IOO ms timeline fetch latency; fast write ingestion; scalable under
extreme fanout conditions (celebrity accounts with 100M*- followers).
Scale & Estimations
Daily Active Users (DAU): 300 Million.
Tweet Post QPS: 6, 000 writes/second (Peak: 25, 000/ sec).
Timeline Read QPS: 300, 000 reads/ second (Read-heavy: 50
Architecture & Component Diagram
-->
-->
Distributed
(PostgreSQL
Post DB I
/ TiDB) I
Social Graph
Follower Query
User Graph Service I
(Ne04j / FlockDB)
Timeline Cache
Cluster (Redis)
(Read Timeline)

<!-- PAGE 27 -->

10/3/26, AM
I Home Timeline Svc
I (Client APT)
Fanout-on-Write (Push) vs Fanout-on-Read (Pull)
Fanout-on-Write (Push Model):
When a user posts a tweet, the Fanout Service queries the Social Graph for all followers.
It injects the tweet_id into the Redis home timeline list of every follower:
Bash
LPUSH timeline: user: <tweet_id>
L TRIM timeline: user: e 799
# Keep latest 800 tweets
Advantage: Timeline read is instantaneous (O (1) lookup via
LRANGE timeline: user: <id> 0 20 ).
Failure Mode (The Celebrity Problem): When an account with 100 Million followers
posts, the system must perform 100 Million Redis writes, creating severe lag and
memory exhaustion.
Fanout-on-Read (Pull Model):
Tweets are stored only in the author's tweet table.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 28 -->

10/3/26, AM
When a user loads their timeline, the system fetches the list of accounts they follow,
queries their latest tweets, and merges them using a K -way merge algorithm in
memory.
Advantage: Zero write latency.
Disadvantage: High read latency; queries become exponentially slower as follow counts
scale.
Hybrid Architecture (The Industry Standard):
Use Fanout-on-Write for regular users (followers < 25, 000).
Use Fanout-on-Read for celebrities (followers 25, 000).
When a follower loads their timeline:
2.
3.
Read their precomputed Redis timeline (populated by regular users).
Query the latest tweets of the few celebrities they follow.
Merge the lists in memory sorted by timestamp.
System 6: YouTube / TikTok (Video Transcoding, Recommendation & Serving)
Requirements
Functional: Upload videos up to several gigabytes; automated transcoding into adaptive
profiles; global streaming playback; comment & like interactions; recommendation engine
feed.
Non-Functional: Zero corruption of uploaded files; minimal buffering 1% session
time); highly resilient transcoding pipeline.
Architecture & Component Diagram
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 29 -->

10/3/26, AM
I Creator Browser/ Appl ----> I
I (Resumable Upload) I
I Transcoded HLS/DASHI <---
Ingestion Service
(Signed S3 URLs)
Transcoding Cluster
(FFmpeg on Kubernetes I
I Edge CDN Storage
I Viewers (Global)
I (Adaptive Stream)
Candidate
+ Ranking
Retrieval
Model
Chunk Upload Temp I
Object Storage (S3) I
(Upload Complete)
Kafka Transcode
Task Queue
(Extract Features)
Vector DB Index
(Video Embeddings) I
Chunked Resumable Upload Flow
2.
3.
Client initiates upload: POST /api/vl/videos/uploads/initialize .
Upload Service creates an upload session ID and returns a sequence of presigned
Amazon S3 multipart upload URLs.
Client divides video into 5MB chunks and transmits them via parallel PUT requests with
content-range headers. If chunk 12 fails due to network drop, the client retries only chunk
12.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 30 -->

10/3/26, AM
4.
Once all chunks succeed, client triggers POST /api/vl/videos/uploads/complete
joins parts into a unified master binary.
2.
3.
4.
5.
Distributed Transcoding Pipeline
Ingestion triggers a message to Kafka containing the S3 path of the raw master video.
A Master Transcoder worker pulls the video, inspects metadata using FFmpeg, and splits the
file into 5-second segments ( . ts or fragmented .mp4 ).
Kubernetes autoscaling worker pods pull segment batches and transcode in parallel:
Bash
ffmpeg
ffmpeg
—i segment_eel. ts
-i segment_eel. ts
-Vf scale-192€ : 1080 -c: v libx264 -b: v 4500k -c:a aac output
-vf 720 -c•.v libx264 -b•.v 2200k -c•.a aac output _
Workers compile individual playlist manifests ( index_IG380p. m3u8 , index_720p.m3u8 ) and
a master master.m3u8 manifest file.
Files are pushed to persistent object storage and primed across Edge CDN pops.
System 7: Distributed Web Crawler (Google / Common Crawl Scale)
Requirements
Functional: Ingest seed URLs; recursively extract hyperlinks; fetch HTML; parse content;
index metadata; handle deduplication; respect robot exclusion standards ( robots. txt
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 31 -->

10/3/26, AM
Non-Functional: Politeness (do not overwhelm target hosts); crawl throughput exceeding
50, 000 pages/ sec; fault tolerance across network partitions; duplicate document
detection.
Architecture & Component Diagram
I seed URLs Pool
I Deduplication
I Fingerprint Filter I
I (SimHash / Bloom)
URL Frontier
Priority & Politeness I
(Extracted New URLs)
Content Parser
Link Extractor
DNS Resolver Cache I
Fetcher Worker
Pods (Async HTTP)
(Raw HTML Stream)
URL Frontier Architecture: Politeness & Priority
A naive FIFO queue crawls identical domains consecutively, effectively launching an accidental
Distributed Denial of Service (DDoS) against websites.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 32 -->

10/3/26, AM
2.
3.
4.
Incoming URLs
[Priority Queues (Fl, F2, F3)]
---> Dynamically maps URLs based on PageRank
[Politeness Queues (Bl, B2.
Bn)] -> I Queue per Target Hostname (e.g., wikipedia.org)
[Queue Selector Thread]
----------> Checks timestamp: Last crawl > delay threshold?
[Worker Fetcher Thread)
Priority Queues (Front Queues): Categorizes URLs based on domain importance,
PageRank score, and freshness needs.
Politeness Queues (Back Queues): Exactly one queue per target host name (e.g.,
queue:nytimes.com , queue:github. com
Each queue has an associated state holding the timestamp of the last request sent to that
host.
A round-robin worker selector checks queues: it dequeues a URL only if
current Time lastAccessTime CrawlDeIay (parsed from robots. txt
Deduplication at Scale: Bloom Filters & SimHash
URL Deduplication: Checking whether a URL was already visited cannot query a database
at 50, 000 QPS. We use a Bloom Filter in memory:
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 33 -->

10/3/26, AM
A bit array of size rn with k independent hash functions.
Zero false negatives: If it returns false, the URL has definitely never been crawled.
Tolerates minute false positives: A tiny fraction of new URLs might be skipped,
which is acceptable at scale.
Content Deduplication (Near-Duplicate Webpages): Mirrors, scrapers, and dynamic
page wrappers contain identical textual content under different URLs.
SimHash Algorithm:
2.
3.
4.
5.
Extract features (words) from the HTML text and assign weights based on
frequency.
Hash each word into an n-bit fingerprint (n 64).
Sum bit positions: for bit position i, if the feature hash has bit 1, add the
weight; if bit O, subtract the weight.
Construct a 64-bit vector: if sum > O, set bit to 1: else set to O.
Two web documents are near-duplicates if the Hamming distance between
their SimHash tokens is < 3.
System 8: Distributed Rate Limiter (API Security & Token Engine)
Requirements
Functional: Limit API client access based on API token, IP, or route; support tiered limits
(e.g., 100 req/min for Free, IO, 000 req/min for Enterprise); return HTTP 429 (
Too Many Requests ) with retry headers.
Non-Functional: Extremely low latency impact (< 2 ms processing overhead per
request); zero memory leaks; resilient against distributed clock drift.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 34 -->

10/3/26, AM
Comparison of Rate Limiting Algorithms
Token Bucket: Tokens are continuously added to a bucket at a fixed fill rate up to
capacity. Each request consumes a token. Allows controlled traffic bursts up to bucket
capacity.
Leaking Bucket: Requests enter a FIFO queue and leak out at a constant execution rate.
Smooths out traffic spikes into steady processing; drops requests when queue is full.
Fixed Window Counter: Divides time into fixed intervals (e.g., 1 minute). Counts requests
per window.
Vulnerability: A traffic burst at the boundary edge (e.g., last 5 seconds of Minute 1
and first 5 seconds of Minute 2) can allow double the limit within a IO-second
window.
Sliding Window Log: Stores an exact timestamp for every request in a sorted set.
Accurate, but memory footprint explodes under high traffic.
Sliding Window Counter: Approximates sliding window counts mathematically by
combining the previous window's count with the current window:
Current Window Offset
Count — Count
current COUIIt
previous
Window Size
Provides high accuracy with constant O (1) memory usage.
Distributed Implementation: Redis + Atomic Lua Script
To prevent race conditions where concurrent microservice nodes read identical counters
simultaneously, execution is unified inside an atomic Lua script:
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 35 -->

10/3/26, AM
@ IP
Lua
key = KEYSCI]
local
limit =
tonumber (ARCV LI] )
local
tonumber (ARGV [2] )
local
current _ time =
window =
tonumber (ARGV [3] )
local
current _ time - window
local
clear_before —
Remove timestamps older than the sliding window threshold
redis . call ( ZREMRANGEBYSCORE ' ,
key, e, clear_before)
Count remaining requests in the active window
local current_requests -
- redis.ca11('ZCARD' ,
key)
if current_requests < limit then
Add unique member (current_time:unique_random_id)
redis ZADDI , key, current _ time, current _ time .. :
" " redis.caU('TIME')
redis EXPIRE' ,
key, window)
return 1
else
return e
Request Allowed
Request Rate Limited
4. Low-Level Design (LLD) & Object-Oriented Patterns: 7 Concrete
Implementations
System 9: Distributed URL Shortener (TinyURL)
Core Logic: Base62 vs Hashing
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 36 -->

10/3/26, AM
Using an MD5 or SHA-256 hash yields 128/256 bits, which requires truncation. Truncation
increases collision probability, requiring expensive database collision lookups.
Base62 Encoding of Sequential / Snowflake I Ds:
Characters: [a—z, A—Z, 0—9] 62 characters.
A 7-character Base62 string represents:
627
3.52 Trillion unique URLs
Approach: Take a unique 64-bit monotonically increasing integer from a distributed
ID generator (or range allocator) and convert it directly into Base62.
Java Implementation
Java
package com.design . urlshortener;
import java. time . Instant;
import java . util . concurrent . ConcurrentHashMap;
import java . util . concurrent . atomic. AtomicLong;
public class TinyUrlSystem {
private static final String BASE62_CHARS =
"abcdefghij klmnopqrstuvwxyzABCDEFGHIJKLMNC
private static final int BASE
= BASE62_CHARS. ;
// Range-allocated counter simulating unique cluster—generated IDs
private final AtomicLong globalCounter = new AtomicLong(1eeeeeeeeeL) ;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 37 -->

10/3/26, AM
// In-memory persistent caches for demo purposes
private final ConcurrentHashMap<String, UrlMapping> shortToLongMap =
new ConcurrentHE
private final ConcurrentHashMap<String, String> longToShortMap =
new
public record UrlMapping(String longUrI, String shortCode, Instant createdAt, Instant
public String shortenUrI(String longUrI, long ttISeconds) {
if (longToShortMap.containsKey(IongUrl)) {
return longToShortMap. get (longUrl) ;
long uniqueld globalCounter. incrementAndGet() ;
String shortCode = encodeBase62(uniqueId) ;
Instant now = Instant. now();
Instant expires
(ttlSeconds > e) ? now .pIusSeconds(ttISeconds)
. Instant. MAX;
UrlMapping mapping = new IJrIMapping(IongUrI, shortCode, now, expires) ;
shortToLongMap . put (shortCode, mapping) ;
longToShortMap . put (longUrl, shortCode) ;
return shortCode;
public String getOriginaIUrI(String shortCode) {
UrlMapping mapping = shortToLongMap. get(shortCode) ;
if (mapping
null) {
throw new Illegal URL does not exist. ")
if (Instant . now() .isAfter(mapping.expiresAt())) {
shortToLongMap. remove (shortCode) ;
longToShortMap. remove (mapping. longlJrI ( ) ) ;
throw new IllegalStateException("Short URL has expired. ")
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 38 -->

10/3/26, AM
return mapping. longlJrI() ;
private String encodeBase62 (long value) {
StringBuilder sb = new StringBuilder() ;
while (value > e) {
int remainder = (int) (value % BASE) ;
sb . append (BASE62_CHARS. charAt (remainder) ) ;
value /- BASE;
return sb . reverse() .toString() ;
System 10: In-Memory LRU Cache with TTL (Thread-Safe)
Design Rationale & Complexity
Hash Map: Provides 0(1) key-to-node lookup.
Doubly Linked List: Enables 0(1) node removal and insertion at the head.
ReentrantReadWriteLock: Allows concurrent readers while serializing write updates,
preventing data races under multithreaded loads.
HEAD Node I I
https://genni.google.corWapp/9c630fe34c54d948
Node

<!-- PAGE 39 -->

10/3/26, AM
(Most Recent)
Complete Implementation
Java
(Least Recent)
package corn. design . Irucache;
java . time . Instant;
Java . HashMap;
java . util . Map;
j ava . util . concurrent . tocks . ReentrantReadWriteLock ;
import
import
import
import
public
class ThreadSafeLruCache<K, V> {
private static class Node<K, {
K key;
V value;
long expirationTimeMs;
Node<K, prev;
Node<K, V> next;
Node(K key, V value, long expirationTimeMs) {
this . key = key
this. value = value;
this . expirationTimeMs —
boolean isExpired() {
expirationTimeMs ;
return expirationTimeMs > e && System. currentTimeMiIIis() > expirationTimeMs;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 40 -->

10/3/26, AM
private
private
private
private
private
head . next
prev = head;
final
final
final
final
final
int capacity;
Map<K, map;
Node<K, V> head;
Node<K, V> tail;
ReentrantReadWriteLock lock =
new ReentrantReadWriteLock() ;
public ThreadSafeLruCache(int capacity) {
this . capacity = capacity;
this
tail.
public V
lock .
. map =
this.head
this. tail -
new ;
new Node<>(null,
new (null,
= tail;
get(K key) {
writeLock() . lock ( ) ;
null,
null ,
e);
e);
try {
Node<K, V> node = map. get(key) ;
if (node
null) return null;
if (node . isExpired()) {
removeNode(node) ;
map . remove (key) ;
return null;
moveToHead (node) ;
return node . value;
} finally {
lock .writeLock() . unlock() ;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 41 -->

10/3/26, AM
public void put(K key, V value, long ttlMs) {
lock .writeLock() . lock() ;
try {
(ttlMs > e) ? System. currentTimeMiIIis() + ttIMs .
long expireAt =
Node<K, V> existingNode = map. get(key) ;
if (existingNode null) {
e;
existingNode.value value;
existingNode . expirationTimeMs =
moveToHead (existingNode) ;
else {
if (map. size() >= capacity) {
V> Iru = tail. prev;
removeNode(Iru) ;
map . remove(lru . key) ;
expireAt ;
Node<K, newNode = new ,
addNodeToHead (newNode) ;
map . put (key, newNode) ;
value,
expireAt) ;
} finally {
lock .writeLock() . unlock() ;
private void addNodeToHead (Node<K,
V> node) {
node . next = head . next;
node . prev = head;
head.next.prev = node;
head.next = node;
private void removeNode(Node<K,
https://genni.google.corWapp/9c630fe34c54d948
V> node) {

<!-- PAGE 42 -->

10/3/26, AM
node . prev.next = node. next;
node . next . prev = node.prev;
private void moveToHead (Node<K,
removeNode (node) ;
addNodeToHead (node) ;
node) {
System 11: Elevator Control System (Dispatcher & Scheduling)
Design Patterns Applied
State Pattern: Encapsulates elevator states ( 'OVING_UP , mVING_DOWN
MAINTENANCE ).
Strategy Pattern: Decouples the scheduling algorithm ( LOOK , SCAN
Shortest Seek Time First
IDLE ,
LOOK Algorithm: The elevator continues in the current direction as long as there are
pending requests ahead; it reverses direction only when no further requests exist in that
direction.
Elevator
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 43 -->

10/3/26, AM
I Elevator-
I Scheduling I
I LOOK Strategy I
Implementation
Java
I SCAN Strategy I
package com.design . elevator;
import java.util.TreeSet;
public class ElevatorSystem {
public enum Direction { UP, DOWN,
public static class Elevator {
private final int id;
private int currentFloor = e;
private Direction direction —
IDLE
Direction. IDLE ;
// Up requests sorted ascending; down requests sorted descending
private final TreeSet<Integer>
upRequests —
new ;
private final TreeSet<Integer>
new TreeSet<>((a, b) -> b - a);
downRequests =
public Elevator (int id) { this. id = id;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 44 -->

10/3/26, AM
public
if
if
if
public
if
synchronized void addRequest(int targetFIoor) {
(targetFloor currentFloor) return;
(targetFloor > currentFloor) {
upRequests . add (targetFIoor) ;
else {
downRequests . add (targetFIoor) ;
(direction Direction . IDLE) {
direction =
(targetFloor > currentFloor) ? Direction. UP
synchronized void step() {
(direction == Direction . UP) {
if (!upRequests . isEmpty()) {
— upRequests .poIIFirst() ;
currentFIoor —
else if (!downRequests.isEmpty()) {
direction = Direction. DOWN;
currentFIoor = downRequests . poll First() ;
} else {
direction = Direction. IDLE;
} else if (direction Direction. DOWN) {
if (!downRequests.isEmpty()) {
currentFloor = downRequests . poll First() ;
else if (!upRequests . isEmpty()) {
direction = Direction.UP;
upRequests . pollFirst() ;
currentFloor =
else {
direction = Direction. IDLE;
public int getCurrentFIoor() { return currentFIoor;
https://genni.google.corWapp/9c630fe34c54d948
. Direction. DOWN;

<!-- PAGE 45 -->

// Favor idle elevators or those already moving toward the destination
if (e .getDirection() == Direction. IDLE I I e.getDirection() == direction)
if (distance < minDistance) {
minDistance distance;
best e
. elevators . get (e) ;
System 12: Parking Lot Management System
Design Patterns Applied
https://genni.google.corWapp/9c630fe34c54d948
10/3/26, AM
public Direction getDirection() { return direction;
public int getld() { return id;
public interface DispatchStrategy {
Elevator selectElevator(java . util. elevators, int floor ,
public static class NearestElevatorStrategy implements DispatchStrategy {
@Override
return (best ! = null) ? best
Direction
public Elevator selectEIevator(java . util. elevators, int floor,
Elevator best = null;
int minDistance -
- Integer .MAX_VALUE;
for (Elevator e : elevators) {
int distance = Math . abs (e. getCurrentFIoor()
- floor) ;
Dil

<!-- PAGE 46 -->

10/3/26, AM
Factory Pattern: Dynamically allocates ParkingSpot subclasses ( Compact , Large ,
Motorbike
Strategy Pattern: Implements dynamic fee calculation based on duration and vehicle
classification ( HourlyFeeCaIculationStrategy
Implementation
Java
package com.design . parkinglot;
java . time . Duration ;
java . time . Instant;
java. util.*;
J ava . util . concurrent . ConcurrentHashMap ;
import
import
import
import
public
class ParkingLotSystem {
public enum VehicleType { MOTORBIKE, CAR,
public abstract static class Vehicle {
private final String licensePlate;
private final VehicleType type;
TRUCK
public Vehicle(String licensePIate, VehicleType type) {
this . licensePlate = licensePlate;
this . type
= type;
public VehicleType getType() { return type;
public String getLicensePlate() { return licensePIate;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 47 -->

10/3/26, AM
public static class Car extends Vehicle {
public Car(String licensePlate) { super(IicensePIate, VehicleType.CAR) ;
public abstract static class ParkingSpot {
private final String spotld;
private boolean occupied ;
private Vehicle currentVehicle;
public ParkingSpot(String spotld) { this. spot Id =
public abstract boolean canFitVehicle(Vehicle v) ;
spotld;
public synchronized void assignVehicIe(VehicIe v) {
if I I occupied) throw new Illegal una',
this . currentVehicle v;
this . occupied =
true ;
public synchronized void vacate() {
this . currentVehicIe = null;
this . occupied =
false;
public boolean isOccupied() { return occupxed;
public String getSpotId() { return spotld;
public static class CompactSpot extends ParkingSpot {
public CompactSpot (String spotld) { super(spotld);
@Override
public boolean canFitVehicIe(VehicIe v) {
return v.getType() VehicleType.CAR 11 v. get Type()
https://genni.google.corWapp/9c630fe34c54d948
VehicleType.MOTORBIKE

<!-- PAGE 48 -->

10/3/26, AM
public record ParkingTicket(String ticketld, String spotld, String plate,
public static class parkingLot {
private final List<ParkingSpot> spots =
new ArrayList<>() ;
Instant ent
private final Map<String, ParkingTicket> activeTickets =
new ConcurrentHashMap<>(
public void addSpot(ParkingSpot spot) { spots . add(spot);
public synchronized ParkingTicket parkVehicIe(VehicIe v) {
for (parkingspot spot
spots) {
if (l. spot.isOccupied() && spot. canFitVehicIe(v)) {
spot . assignVehicle(v) ;
String ticketld = UUID.randomUUID() .toString() ;
ParkingTicket ticket = new parking Ticket(ticketld,
spot. getSpotId() ,
activeTickets . put (ticketld, ticket) ;
return ticket;
throw new RuntimeException("No available spot for vehicle: "
+ v. get Type());
public synchronized double unparkVehicIe(String ticketld, FeeStrategy feeStrateg)
ParkingTicket ticket —
activeTickets . remove(ticketld) ;
if (ticket
null) throw new Illegal ticket ID. ;
ParkingSpot assignedSpot =
spots . stream()
. filter(s -> s.getSpotId() . equals(ticket. spotld()))
. findFirst()
. orElseThrow() ;
assignedSpot. vacate() ;
long hours = Duration . between (ticket. entryTime() ,
return feeStrategy. calculateFee(hours) ;
https://genni.google.corWapp/9c630fe34c54d948
Instant. now()) . toHours ( )

<!-- PAGE 49 -->

10/3/26, AM
public interface FeeStrategy { double calculateFee(Iong hours);
public static class FlatRateFeeStrategy implements FeeStrategy {
@Override
public double calculateFee(Iong hours) { return hours * 2e.e;
System 13: Distributed Pub/Sub Messaging Engine
Requirements & Architecture
In-memory broker handling dynamic Topic
registration, Subscription
worker thread-pool processing.
Observer Pattern: Decouples subscribers from topic publishers.
fanout, and
Thread pools handle message dispatch asynchronously, isolating slow consumers from
publisher threads.
Implementation
Java
package com.design.pubsub;
import java.utit.*;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 50 -->

10/3/26, AM
import java . concurrent.*;
public class DistributedPubSubEngine {
public record Message(String topic,
public interface Subscriber {
String getld() ;
void onMessage(Message message) ;
public static class Topic {
private final String name;
String payload,
long timestamp)
private final Set<Subscriber> subscribers = ConcurrentHashMap. newKeySet() ;
private final ExecutorService dispatcherPooI = Executors. newCachedThreadPooI() ;
public Topic (String name) { this . name name;
public void addSubscriber(Subscriber sub) { subscribers . add(sub);
public void removeSubscriber(Subscriber sub) { subscribers. remove(sub) ;
public void publish (Message message) {
for (Subscriber sub
. subscribers) {
dispatcherPool . -> {
try {
sub. onMessage(message) ;
catch (Exception ex) {
System. err. printf("Error dispatching to %s: %s%n" ,
public static class PubSubBroker {
https://genni.google.corWapp/9c630fe34c54d948
sub.getld(),

<!-- PAGE 51 -->

10/3/26, AM
private final Map<String, Topic> topics =
new ;
public void createTopic(String topicName) {
topics .putIfAbsent(topicName, new Topic(topicName)) ;
public void subscribe(String topicName, Subscriber subscriber) {
Topic topic = topics . get (topicName) ;
if (topic
null) throw new IllegalArgumentException("Topic does not exist:
topic . addSubscriber(subscriber) ;
public void publish (String topicName, String payload) {
Topic topic = topics . get (topicName) ;
if (topic
null) throw new Illegal does not exist:
topic . publish (new Message(topicName, payload, System. current TimeMiUis())) ;
System 14: Snake and Ladder Multiplayer Game
Object-Oriented Domain Entities
Board: Encapsulates cells containing Jump conditions ( Snake , Ladder ).
Player: Holds positional state, ID, and turn order.
Dice: Strategy abstraction for rolling (supports 1-6 dice or rigged testing dice).
Implementation
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 52 -->

10/3/26, AM
@ IP
Java
package com.design . snakeladder;
import java. util.*;
public class SnakeAndLadderGame {
public record Jump(int start, int end) {
public Jump {
if (start end) throw new Illegal cannot start and
public static class Board {
private final int size;
private final Map<lnteger, Integer> jumps
public Board (int size) { this . size —
— size;
new ;
public void addSnake(int head, int tail) {
if (head tail) throw new head must be higr
jumps . put (head, tail) ;
public void addLadder(int bottom, int top) {
if (bottom top) throw new IllegalArgumentException("Ladder bottom must be
jumps . put (bottom, top) ;
public int resolvePosition(int currentPos) {
return jumps . getOrDefauIt(currentPos, currentPos) ;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 53 -->

10/3/26, AM
public int getSize() { return size;
public static class Player {
private final String name;
private int position = e
public Player(String name) { this . name = name;
public String getName() { return name;
public int getPosition() { return position;
public void setposition(int position) { this . position = position;
public static class Dice {
private final int sides;
private final Random random new Random() ;
public Dice(int sides) { this . sides = sides;
public int roll() { return random. nextlnt(sides) + 1;
public static class GameControIIer {
private final Board board;
private final Dice dice;
private final players = new ;
private boolean isFinished =
false;
public GameControIIer(Board board, Dice dice, playerList) {
this . board = board;
this.dice = dice;
this . players . addAll (playerList) ;
public void play Turn() {
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 54 -->

10/3/26, AM
if (isFinished) return;
Player currentPlayer = players .polIFirst() ;
int rott = dice. roll();
int target = currentPIayer. getPosition() + roll;
if (target <= board .getSize()) {
= board . resolvePosition(target) ;
target
currentPLayer. setPosition (target) ;
if (currentPIayer. getposition() board. getSize()) {
System. out . " + currentPlayer .getName() +
isFinished —
true ;
return ;
players . addLast (currentPIayer) ;
public boolean isFinished() { return isFinished,
System 15: Online Movie Ticket Booking System (BookMyShow)
Concurrency & Race Condition Strategy
' has won the ge
Multiple customers selecting the same seat concurrently leads to race conditions.
Two-Phase Reservation Pattern:
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 55 -->

10/3/26, AM
2.
Temporary Lock: When a customer clicks a seat, the seat transitions from
AVAILABLE to LOCKED with an expiration timestamp (IO minutes) inside Redis
or using an optimistic locking version check in PostgreSQL.
Permanent Reservation: Transitions to BOOKED only upon verified payment
confirmation. If the payment gateway drops or the timer expires, the lock releases
back to AVAILABLE
Implementation
Java
package com.design . bookmyshow;
import java. time . Instant;
import java. util.*;
import java . util . concurrent . ConcurrentHashMap;
public class TicketBookingSystem {
public enum SeatStatus { AVAILABLE,
public static class Seat {
private final String seatld;
LOCKED ,
BOOKED
private SeatStatus status = SeatStatus . AVAILABLE;
private Instant lockExpirationTime =
Instant. MIN;
public
public
if
https://genni.google.corWapp/9c630fe34c54d948
Seat(String seatld) { this. seatld = seatld;
synchronized boolean lockSeat(int holdDurationSeconds) {
(status SeatStatus. BOOKED) return false;

<!-- PAGE 56 -->

10/3/26, AM
// If already locked, verify whether lock has expired
if (status SeatStatus. LOCKED && Instant. now() .isBefore(lockExpirationTime)
return false;
this. status -
- SeatStatus.LOCl<ED;
this . lockExpirationTime =
Instant. now() . plusSeconds (holdDurationSeconds) ;
return true;
public synchronized boolean confirmBooking() {
if (status SeatStatus . LOCKED && Instant. now() . isBefore(IockExpirationTime)
this. status -
- SeatStatus. BOOKED;
return true;
return false;
public synchronized void {
if (status SeatStatus.BOOKED) {
this . status = SeatStatus . AVAILABLE;
this . tockExpirationTime = Instant. MIN;
public SeatStatus getStatus() { return status;
public String getSeatId() { return seatld;
public static class ShowService {
private final Map<String, Seat> seatMap =
public void addSeat(String seatld) {
seatMap .put(seatld, new Seat(seatld));
https://genni.google.corWapp/9c630fe34c54d948
new ConcurrentHashMap<>() ;

<!-- PAGE 57 -->

10/3/26, AM
public boolean holdSeats(List<String> seatlds, int ttlSeconds) {
List<Seat> successfullyLocked = new ;
for (String id
seatlds) {
— seatMap.get(id) ;
Seat seat -
if (seat null && seat . lockSeat(ttISeconds)) {
successfullyLocked . add (seat) ;
} else {
// Rollback previously acquired locks if any seat in the selection
successfullyLocked . forEach(Seat: : releaseLock) ;
return false;
return true;
public boolean finalizeBooking(List<String> seatlds) {
for (String id
. seatlds) {
- seatMap.get(id) ;
Seat seat -
null 11
if (seat
! seat. confirmBooking()) {
false;
return
return true;
5. Architectural Synthesis Matrix: Design Trade-offs & Production
Decision Framework
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 58 -->

10/3/26, AM
Problem Archetype
Media Streaming
(Netflix/YouTube)
Geospatial Dispatch
(Uber)
Transactional Orders
(Food Delivery)
Real-time Chat
(WhatsApp)
Timeline Feed
(Twitter/X)
High-Volume Crawl
(Google)
Primary Latency
Bottleneck
Massive Outbound
Bandwidth
High Ingestion QPS
Database Lock
Contention
Open TCP Stream
Maintenance
Fanout Amplification
Network 1/0 & DNS
Latency
Storage Architecture
S3 Object Store +
Regional ISP
OpenConnect CDNs
Redis Geospatial / ln-
memory H3 spatial
indexing
MySQL InnoDB +
PostgreSQL JSONB
Schemas
ScyllaDB/Cassandra
(Unsent queues only)
Redis Lists + Relational
/ TiDB clusters
Distributed Object
Storage + BigTable
Concurrency Strategy
Async Queue-driven
chunk transcoding
Spatial partitioning via
Uber H3 index
Distributed Redis
token decrement +
Saga orchestration
In-memory connection
socket maps
Hybrid: Push for
regular, Pull for
celebrities
Politeness queues with
per-host delay locks
6. End-to-End Self-Study Web Platform Architecture
https://genni.google.corWapp/9c630fe34c54d948
High-Availability Tac
Anycast Geo-DNS
failover
Kafka replica
replication
Read-write replicas
with Multi-AZ failovc
Ephemeral message
drop upon client AC
Precomputed cache
warmers
Dynamic IP rotation
across fetcher pool:

<!-- PAGE 59 -->

10/3/26, AM
To structure this material in*
i wanted a pdf and also these are not detailed and you not
included every tolols and tech i used , and also i wnated 15
example of fully solved for hld and Ild take atime and give a
fully prepared pdf . with exmples . make sure to make that
C Next.js 14 Client Ap
pdf fully explained.
(REST APIs / so, , -v,
C FastAPI Microservice (Python 3.11 Backend) ]
Java
package com.system.elevator;
import java.util.*;
public class ElevatorControISystem {
public enum Direction { UP, DOWN, IDLE
public static class ElevatorCar {
private final int id;
private int currentFloor = e;
private Direction direction = Direction. IDLE;
// Ascending for upward trips, descending for downward trips
private final TreeSet<Integer> upStops =
new ;
private final downStops =
new
public ElevatorCar(int id) {
this. id = id,
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 60 -->

10/3/26, AM
public synchronized void addDestination(int floor) {
if (floor currentFloor) return;
if (floor > currentFloor) {
upStops . add (floor) ;
if (direction Direction. IDLE) direction = Direction. UP;
else {
downStops . add (floor) ;
if (direction Direction. IDLE# Complete System Architecture & Engineeri
# Module 1: Distributed Systems Core Foundations
## 1.1 Scaling Models: Vertical vs. Horizontal
* (Vertical Scaling) Increasing single—host resources (CPU clock/cores, RAI'
* Zero distributed coordination overhead, consistent memory access, no net
* *Trade-offs:* Hard hardware boundaries, non—linear hardware cost increases, unavoidat
* (Horizontal Scaling) : Distributing compute and storage across independent
* Practically boundless horizontal headroom, fault isolation, elastic prov.
* *Trade-offs:* Distributed state management, network serialization, consistency models
## 1.2 Network Transport & IPC Primitives
COMMUNICATION MODELS OVERVIEW
I Short Polling
I Long Polling
I WebSockets
https://genni.google.corWapp/9c630fe34c54d948
I Client -> Server I Periodic HTTP round-trips
I Client <-> Server I Server holds HTTP request pending I
I Client
--=> Serverl Persistent bidirectional TCP stream I

<!-- PAGE 61 -->

10/3/26, AM
I Server-Sent Events I Client <--- Server I Unidirectional streaming over HTTP I
### Short Polling vs. Long Polling vs. WebSockets vs. SSE
I. Repeated HTTP requests at an interval $\DeIta t$. Inefficient; leac
2. **Long The server suspends response completion until an event occurs or a t
3. **WebSockets (RFC 6455) : ** An initial HTTP handshake negotiates a bidirectional, frame
4. Events (SSE) Long-lived HTTP connection using •text/event-stream'. NE
REST vs. gRPC
* (Representational State Transfer) Typically operates over HTTP/ 1.1 or HTTP/2
* Strictly HTTP/2 transport utilizing binary serialization (Protocol Buffers) .
* *Features:* Multiplexed streams, bidirectional channels, zero-copy parsing, strongly
## 1.3 Traffic Ingress,
Internet
C Layer 4 LB (TCP/UDP:
https://genni.google.corWapp/9c630fe34c54d948
Proxies & Load Balancing
IP + Port routing,
e.g.,
AWS NLB / HAProxy)

<!-- PAGE 62 -->

10/3/26, AM
C Layer 7 LB (HTTP:
Vorders] [/users]
[Order Svc] [User Svc]
TLS Offload, Path—based routing, e.g. ,
Envoy / NGINX)
### Layer 4 vs. Layer 7 Routing
* 4 (14) Operates at the transport layer (TCP/UDP). Inspects packet headers wi
* 7 (L 7) Operates at the application layer. Parses HTTP requests, offloads
### Dispatching Algorithms
* / Weighted Round-Robin Predictable; assumes homogeneous task runtimes
* **Least Connections / Weighted Least Connections:** Routes traffic to the host servicir
* / Consistent Hash Ring:** Preserves spatial affinity for caching layers and statef
## 1.4 Consistent Hashing Mechanics
Node A (00)
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 63 -->

10/3/26, AM
Key 3
\ Key 1
Node C (2400) — Node B (1200)
Key 2
In basic modular partitioning = \pmod N$), alterinf
### The Hash Ring & Virtual Nodes (Vnodes)
* Nodes and data keys map to an integer domain $[e, along a logical ring.
* Keys are mapped to the first node located clockwise from the key's hash value.
* Node addition/ removal limits key remapping to on average.
* **Virtual Nodes (Vnodes) Each physical machine receives $V$ distinct virtual token
$$\text{Target Tokens per Host} \ in [lee, 256]$$
* *Why:* Prevents load skew on non-uniform token placement, and balances redistribution
## 1.5 Distributed Caching & Invalidation Architecture
Cache-Aside (Lazy) Read-Through
App -> Cache
App -> Cache
Write-Through
App -> Cache
Write-Behind (Write-Back)
App -> Cache
App -> DB (on miss) Cache -> DB (on miss) Cache -> DB (Sync) Cache -> Async Queue ->
DB
App -> Cache (re-populate)
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 64 -->

10/3/26, AM
### Invalidation Strategies
* (Lazy Population) Read misses pull from primary storage and backfill
* **Read-Through / Write-Through : Cache sits directly in the read/write path. Write-thr
* **Write-Behind (Write-Back) : Writes update cache instantly; disk updates queue asyncl-
### Cache Eviction Policies
* **Least Recently Used (LRU) : ** Removes elements whose last access is furthest in the pz
* **Least Frequently Used (L FU) : ** Drops items with the lowest access frequencies. Uses f
* (TTL) Enforces passive removal on reads alongside an active probabili
## 1.6 Distributed Messaging:
TOPIC: "order-events"
Apache Kafka Deep Dive
I Partition O: [Offset O] [Offset 1] [Offset 2] [Offset 3] [Offset 4] .
I Partition 1: [Offset O] [Offset 1] [Offset 2] .
I Partition 2: [Offset O] [Offset 1] [Offset 2] [Offset 3] .
Consumer Group A
(Order Processing)
Offset: PO->3, PI->2, P2->3
https://genni.google.corWapp/9c630fe34c54d948
Consumer Group B
(Analytics Pipeline)
Offset: PO->4, PI->1, P2->O

<!-- PAGE 65 -->

10/3/26, AM
### Topics, Partitions, and Offsets
* A is a logical event category partitioned across disk storage systems.
* A **Partition** is an ordered, immutable, append—only log sequence. Messages receive a
* Partitioning enables horizontal read/write scale. Strict sequence ordering is guarantee
### Producers & Partition Keys
* When a message includes a key:
$$\text{partition} = \
This routes messages with matching keys (such as 'account _ id' or •order_id') to the san
* If the key is null, messages distribute via round-robin or sticky partitioning.
### Brokers, Leaders, and In-Sync Replicas (ISR)
* Each partition has one broker handling all read/write traffic, and $R-I$
* (In-Sync Replicas) : ** Replicas that actively fetch records within the ' replica. IE
* 'acks=atl' (or 'acks=-l'): The leader defers write acknowledgments until att ISR membel
### Consumer Groups & Scale Boundaries
* Partitions within a topic are assigned to at most consumer instance per Consume
* If \ consumers > partitions' ,
surplus consumers sit idle.
* Consumers maintain independent commit pointers, allowing multiple downstream applicatic
## 1.7 Data Consistency Models & Distributed Storage
### The CAP & PACELC Theorems
* Under a network partition ($p$), a distributed datastore must choose
* **Consistency ($C$) : ** All alive nodes return the identical, most recent write, or tt
* ($A$) : ** All operational nodes process reads/writes without guaranteei
* **PACELC Formulation If Partitioned ($P$), balance Availability ($A$) vs Consistenc)
* *Example:* DynamoDB/Cassandra choose $PA/EL$; relational databases with synchronous
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 66 -->

10/3/26, AM
### Relational Storage Engines vs. NoSQL
* **B+Tree Storage Engines (PostgreSQL / MySQL InnoDB)
* Optimizes read queries N)$) through balanced, high fan-out trees matching og
* Writes require synchronous WAL (Write-Ahead Log) persistence and random-access page L
* Engines (Cassandra / RocksD8 / ScyllaDB)
* Converts writes to sequential append-only disk operations via in-memory MemTabIes bac
* MemTables flush to immutable SSTabIes (Sorted String Tables) .
* Reads require checking Bloom Filters, MemTabIes, and multiple SSTabIe levels, shiftir
## 1.8 Distributed Coordination & Cross-Service Transactions
### Two-Phase Commit (2PC)
1. Phase The coordinator dispatches a prepare statement. Resource participar
2. Phase If all participants vote 'AGREE' ,
the coordinator logs commit status
3. *Bottlenecks:* Blocking protocol. If the coordinator crashes mid-process, participants
### The Saga Pattern
Decomposes distributed transactions into chained local database transactions.
[Order Svc] (Create Order)
Kafka: "OrderCreated"
[Payment Svc] (Process Charge)
Kafka: "PaymentFailed" -
I (Compensating Rollback)
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 67 -->

10/3/26, AM
[Inventory Svc] (Skip)
[Order Svc] (Set Status: CANCELLED)
* Microservices publish and listen to domain events across Kafka topics
* **Orchestration:** A dedicated orchestrator state machine directs participants via sync
* **Compensating Transactions:** Forward transactions must define backward-compensating
# Module 2: The Enterprise Backend & AI Integration Stack
## 2.1 Spring Boot Internal Architecture & Lifecycle
[ HTTP Request ]
[ Filter Chain: CorsFilter -> CsrfFilter -> JwtAuthenticationFilter ]
[ DispatcherServlet ]
[ HandlerMapping ] ---> Resolves Route Target
[ HandlerAdapter ] ---> Executes Target Method
[ Controller Advice / MessageConverter (Jackson) ]
[ JSON Response ]
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 68 -->

10/3/26, AM
### DispatcherServlet Ingress Flow
* Requests hit the servlet container and enter the Spring container through the front-cor
* 'HandlerMapping' matches incoming URLs to candidate '@RestControIIer' routes.
* 'HandlerAdapter' executes the controller action, leveraging 'HttpMessageConverters' (e.
* Method interception annotations ('@TransactionaI' ,
'@PreAuthorize') execute dynamical I b
### Spring Security Context & JWT Verification Filter
* Sequence : The 'SecurityFiIterChain' intercepts requests before reaching the
Incoming HTTP requests deliver a bearer token: 'Authorization: Bearer <token»
1.
2. 'JwtAuthenticationFilter' intercepts the request, runs signature verification (HMAC-
A validated token populates an 'Authentication' instance (e.g. ,
3.
UsernamePasswordAut
'Java
SecurityContextHolder. getContext() . setAuthentication(auth) ;
The downstream controller executes within the caller's authorized context.
4.
The thread-local context clears on request completion, maintaining stateless executi
5.
## 2.2 Relational Data Systems & JSONB Internals
### B+Tree Indexing & Multi-Version Concurrency Control (MVCC)
* Relational database tables organize pages inside B+Trees. Internal nodes contain routir
* Writes do not block reads, and reads do not block writes. When a row updates,
### PostgreSQL JSONB Decomposition vs. Raw Text JSON
* Raw 'JSON' stores text verbatim, requiring repetitive parsing on queries.
* Internals:** Decomposes JSON keys and values into indexed binary structures. It
* **GIN (Generalized Inverted Index) Builds index maps across all interior paths, keys
' 'sql
Create GIN index on j sonb attributes
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 69 -->

10/3/26, AM
CREATE INDEX ON listings USING gin (dynamic _ attributes) ;
Fast containment query leveraging the index
SELECT * FROM listings
WHERE dynamic _ attributes @> ' category" :
"vehicle", "transmission": "automatic"} ' ;
2.3 Redis Internals & Concurrency Control
REDIS INSTANCE
Ingress Socket Multiplexing (epoll
Non-Blocking Single-Threaded
C Strings /
(0(1) Hash
Hashes
Map)
[ Sorted Sets
(SkipLists)
/ kqueue) ]
Event Loop ]
[ Lua Engine ]
(Atomic Eva I)
Single-Threaded Event Loop & Data Structures
Redis runs on an event-driven, single-threaded execution loop using non-blocking 1/0
multiplexing ( epott on Linux, kqueue on BSD/macOS).
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 70 -->

10/3/26, AM
Commands run sequentially in-memory without multi-threaded locking overhead or CPU
context switches.
Core data types map to optimized low-level data structures:
Strings: Simple Dynamic Strings (SDS) with pre-allocated buffers.
Hashes: ZipLists (for small payloads) migrating to Hash Tables.
Sorted Sets (ZSETs): Dual-structure combining a Hash Map (for 0(1) score lookups)
and a SkipList (for O(log N) insertion and range queries).
Distributed Locking with TTL Safety
Basic SETNX commands without expirations risk perpetual deadlocks if the holding process
crashes.
Bash
# Atomic acquisition with auto—expiration
SET resource : lock : order _ 12345
" NX px 3eeee
NX : Set if Not Exists. Ensures only one caller captures the lock.
PX 30000 : Applies a 30,000 ms TTL expiration limit.
Safe Lock Release via Lua Script: To avoid race conditions where process A clears process
B's expired lock, release operations execute atomically in Lua:
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 71 -->

10/3/26, AM
Lua
IP
if redis . call ("get", KEYS[I]) == ARGV[I] then
return redis . ,
KEYSLI])
return 0
end
2.4 Agentic LLM Architectures: Planner-Executor-RefIector
User Intent -> [ Planner Node ]
(Decomposes Task
Executor Node
(Invokes External
Graph)
] < --+ (Iterative self-correction)
Tools) I
[ Reflector Node ] -
(Validates Preconditions)
C Risk Classifier Filter ]
C Low-Risk
https://genni.google.corWapp/9c630fe34c54d948
High-Risk ]

<!-- PAGE 72 -->

10/3/26, AM
(Auto-Commit)
Component Roles
Human Approval Gate ]
Planner: Evaluates the user query, inspects available tools and schemas, and plans an
execution DAG (Directed Acyclic Graph).
Executor: Traverses the task DAG, invoking domain services via structured JSON function
calling.
Reflector: Evaluates tool responses against expected schemas and business
requirements. If execution errors or malformed payloads emerge, the reflector appends
the error trace to context and prompts the planner to re-route.
Risk-Tiered Human-in-the-Loop (HITL) Integration
Tier 1 (Zero / Low-Risk): Read-only data queries and non-state-changing tasks execute
automatically.
Tier 2 (Medium-Risk): Reversible writes (e.g., updating user notification settings) run
automatically with audit logs.
Tier 3 (High-Risk): Irreversible or financial actions (e.g., updating bank account numbers,
processing refunds > $100). The workflow pauses, persists execution state to a
database, and generates an administrative review event. It resumes only upon receiving
an authorized signature.
2.5 Retrieval-Augmented Generation (RAG) Architecture
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 73 -->

10/3/26, AM
C Documents
User Query
-> [ Parser (Apache Tika) ] —> [ Chunking (Recursive) ]
[ Embedding Model ]
[ vector DB (HNSW Index) ]
[ Embed Query ] -
I (ANN Vector Search)
[ Top—K Candidate Chunks ]
[ Cross—Encoder Re-ranker ]
[ Top-N Filtered Context
[ LLM Prompt Synthesis ]
Ingestion Pipeline
2.
Extraction: Documents (PDFs, docs, images) pass through extractors like Apache Tika to
isolate text and metadata.
Chunking Strategies: Text splits via recursive splitters into 500—1000 token windows
with a 15—20% sliding overlap, preserving contextual meaning across split boundaries.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 74 -->

10/3/26, AM
3.
4.
Dense Embeddings: Vector models project text chunks into high-dimensional space (e.g.,
1536-dimensional embeddings).
Vector Indexing (HNSW): Hierarchical Navigable Small World graphs support
Approximate Nearest Neighbor (ANN) search with logarithmic query times, trading small
arnounts of recall accuracy for high throughput.
Query Pipeline
2.
3.
4.
The user's search text embeds using the same vector model.
ANN search retrieves the top-K candidates based on cosine similarity or dot-product
metrics:
sim u, v
u11211v112
Cross-Encoder Re-ranking: A cross-encoder reviews the top-K chunks alongside the
user query, scoring chunk relevance to pick the top-N sources (N < K).
Context Injection: The prompt context injects the top-N text chunks, instructing the
model to answer using only the provided reference context.
2.6 Computer Vision: Edge ANPR Pipeline
C Camera Stream
https://genni.google.corWapp/9c630fe34c54d948
[ Grayscale ]
-> [ Adaptive Thresholding ]
C YOLO Plate Detector
(Cropped Plate)

<!-- PAGE 75 -->

10/3/26, AM
- Regex Rules ] < -
- CRNN / OCR Engine ]
[ Contrast Normalizat
Output Result < -
YOLO Detection Mechanics
YOLO (You Only Look Once) frames plate localization as an end-to-end regression
problem.
Single-stage forward passes evaluate the input frame, predicting bounding box anchors,
objectness scores, and class vectors across grid regions without candidate region
proposals. This allows the model to process live video feeds at 30—60 F PS.
Preprocessing Operations (OpenCV)
2.
3.
Grayscale Conversion: Reduces three-channel RGB inputs to single-channel intensity
maps.
Bilateral Filtering: Smooths out noise while preserving sharp plate edge boundaries.
Adaptive Thresholding: Calculates dynamic thresholds across local neighborhoods,
keeping text readable under direct headlights or shadow conditions.
OCR (PaddleOCR / EasyOCR) & Parsing
2.
Text detection layers (e.g., DBNet) generate bounding bounding polygons around
character sequences.
Text recognition modules (CRNN with CTC loss or SVTR) convert pixel polygons into text
strings.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 76 -->

10/3/26, AM
3.
Post-processing regular expressions validate and clean the text against regional license
plate formats (e.g.,
Module 3: High-Level System Designs (HLD)
System 1: Netflix (Global Video Streaming System)
Requirements
Functional: Upload and transcode videos; stream adaptive-bitrate video globally; save
user playback positions.
Non-FunctionaI: Low startup latency (< 500 ms), 99.999% uptime, support for high
read-to-write traffic ratios (1000 : 1).
Scale Estimations
Active users: 100 Million daily active users (DAU).
Peak concurrent streams: 15 Million.
Average video bitrate: 3 Mbps across profiles.
Outbound bandwidth: 15 Million x 3 Mbps =
CDNs).
Architecture Diagram
I Client Device
https://genni.google.corWapp/9c630fe34c54d948
Anycast
Edge
DNS
45 T bps (distributed across Edge
I Edge CDN (OCA Pod) I

<!-- PAGE 77 -->

10/3/26, AM
I (ExoPlayer/Web)
I (Metadata
I API Gateway
I (Envoy / Zuul)
I Ingestion Service
I (s3 Mezzanine)
Watch
----->
I (Geo-Routing)
Progress)
User Progress
(Write-Behind
Service
Cache)
Kafka
Transcode
Topic
I (Video Chunks)
--> I Cassandra DB
I (Playback State)
-----> I Transcoding Cluster I
I (FFmpeg on K8s)
Transcoding & Edge Distribution
2.
3.
4.
5.
Video masters upload to temporary S3 mezzanine buckets.
S3 events publish to Kafka, triggering the transcoding engine.
Transcoding workers slice videos into independent 2- to 6-second segments, generating
streams across multiple codecs (AVI, HEVC, H.264) and resolutions (360p to 4K).
. rn3u8 for HLS (HTTP Live Streaming) and
Manifest files are generated:
.mpd for DASH
(Dynamic Adaptive Streaming over HTTP).
Slices push to regional Open Connect Appliances (custom FreeBSD storage boxes inside
ISP data centers).
Data Modeling: Cassandra
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 78 -->

10/3/26, AM
Cassandra handles playback state updates thanks to its high write throughput.
SQL
CREATE KEYSPACE netflix_streaming WITH replication — {
'class' .
• Network TopologyStrategy' ,
' us-east'
eu-west' :
3
CREATE TABLE (
user_id uuid,
profile_id uuid,
video_id uuid,
last_playback_position_sec int,
total _ duration_sec int,
completed _ state boolean ,
updated_at timestamp,
PRIMARY KEY ((user_id, profile_id), video_id)
) WITH CLUSTERING ORDER BY (video_id ASC) ;
Why: The compound partition key (user_id, profile_id) clusters watch histories
onto a single partition, enabling fast queries for "Continue Watching" feeds.
System 2: Uber / Grab (Geospatial Ride Dispatch Platform)
Requirements
Functional: Ingest driver locations every 4 seconds; query nearby drivers; manage match
requests; track active rides.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 79 -->

C Driver App
C Rider App
https://genni.google.corWapp/9c630fe34c54d948
10/3/26, AM
Non-Functional: Location ingestion latency < 500 ms; high availability under network
partitions; consistency across ride reservation states.
Scale Estimations
Active Drivers: I Million active connections.
Location write load: 1 Million/ 4 sec 250, 000 QPS.
Active Riders: IO Million active apps.
Architecture Diagram
----> [ Dispatch Engine ] <---> [ Redis Geospatial Cluster
(WebSocket [ Gateway Netty ]
(Kafka Ingestion)
[ Driver Location Svc ]
(Geo Spatial H3)
-- (HTTP /match)
(Create Trip)
Aurora PostgreSQL DB ]

<!-- PAGE 80 -->

10/3/26, AM
Geospatial Partitioning: H3 Hexagonal Index
Uber's H3 index projects the globe onto a hexagonal grid.
Unlike rectangular or square grids (such as Geohash or S2), hexagons maintain uniform
distances to all 6 adjacent neighbors. This simplifies radius searches, dynamic surge
clustering, and dispatch routing.
2
Driver coordinates resolve to resolution level 8 (average hexagon area 0.737 km
edge radius R' 461 m).
Redis Geospatial Storage
Spatial points store in Redis Sorted Sets using 52-bit integer representations of coordinates:
Bash
# Store driver location
GEOADD 77.2090 28.6139
# Search drivers within 3km
"driver _4991"
GEOSEARCH FROMLONLAT 77. 2e9e 28.6139 BYRADIUS 3 KM ASC
System 3: Food Delivery Platform (DoorDash / Swiggy)
Requirements
Functional: Search restaurant menus; manage carts; run checkout transactions; provide
multi-party tracking (Customer, Restaurant, Courier).
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 81 -->

10/3/26, AM
Non-Functional: Prevent over-ordering on low stock; keep payment-to-order operations
ACID-compliant; scale through peak meal periods.
Architecture Diagram
C Client Apps
[ Kong Gateway ]
[ Order Svc ]
(Kafka Event Bus)
-——> [ Catalog Svc ] (MongoDB + Redis Cache)
[ Inventory Svc ] (Redis Stock Token)
[Restaurant] [Payment] [Delivery Dispatch]
Inventory Race Conditions & Atomic Decrements
Traditional SELECT
FOR UPDATE operations create database lock contention during
high-demand flash sales. Instead, inventory pre-allocates using an atomic Lua script in Redis:
Lua
- KEYSCI]
local stock_key -
tonumber (ARGV [I] )
local requested_qty =
tonumber(redis . call( ' get' ,
stock _ key) or
local current _ stock =
if current_stock requested_qty then
redis . call decrby' , stock_key, requested_qty)
https://genni.google.corWapp/9c630fe34c54d948
"e")

<!-- PAGE 82 -->

10/3/26, AM
return
else
return
end
1 Allocation Approved
Insufficient Inventory
e
The Saga Lifecycle Orchestration
2.
3.
4.
Order Service registers an order in state PENDING_PAYMENT
Payment Service charges the user's card.
If Payment Fails: Order transitions to PAYMENT _ FAILED and the process halts.
Restaurant Service receives the order.
If Rejected by Restaurant: Order transitions to REJECTED ; a compensating refund
transaction triggers on the Payment Service; the Redis inventory reservation reverts.
If Accepted: Order moves to PREPARING and the system dispatches a delivery courier.
System 4: WhatsApp / Telegram (Secure Messaging System)
Requirements
Functional: I-to-I chat; group conversations; delivery statuses (Sent, Delivered, Read);
offline message storage.
Non-Functional: End-to-end encryption; sub-second delivery; zero plain-text storage on
application servers.
Architecture Diagram
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 83 -->

10/3/26, AM
C User A
--->
---> [ Edge
[ Edge Gateway ] - C U
(Active Socket)
+-- (Receiver
Offline Queue Store
Connection Management
Clients maintain persistent, full-duplex TCP connections over mutual TLS using a binary
protocol or WebSockets.
A distributed Redis cluster tracks active sessions:
Key: session: user_id Value: edge_gateway_pod_ip
When User A sends a message to User B:
Gateway ] [ Session Manager ]
(Redis Registry)
Offline) --
(ScyllaD3 / Cassandra)
2.
3.
4.
The Gateway reads the session mapping for User B.
If User B is online, the message forwards across internal networks directly to User
Bs gateway host, which delivers it over the open TCP socket.
If User B is offline, the encrypted payload appends to User B's mailbox in ScyllaDB,
and an external push notification triggers (APNs/FCM).
Once User B reconnects, their client pulls unread payloads sequentially. The server
removes records from temporary storage upon receiving delivery confirmations.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 84 -->

10/3/26, AM
Cryptographic Guarantees (The Signal Protocol)
X3DH (Extended Triple Diffie-Hellman): Performs initial key agreements and establishes
shared secrets even if one party is offline.
Double Ratchet Algorithm: Derives new single-use symmetric encryption keys for every
message sent using KDF (Key Derivation Function) chains. This provides Forward Secrecy
(compromised keys cannot decrypt past messages) and Break-in Recovery (compromised
keys cannot decrypt future communications).
System 5: Twitter / X (Timeline Engine & Social Graph)
Requirements
Functional: Post tweets; follow/unfollow users; view home timelines; view profile
timelines.
Non-Functional: Read latency < 100 ms; manage high read/write traffic ratios (100
); scale through celebrity fanout spikes.
Architecture Diagram
C User Action: Post Tweet ]
C Tweet Service ]
(Fanout Router)
(Followers)
(Followers
--------> Persist to Distributed SQL (TiDB / CockroachDB)
- 25k)
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 85 -->

10/3/26, AM
Push Fanout
Insert Tweet ID
to Follower Redis
Timeline List
Pull Fanout (Celebrity Model) ]
I (Stored in User's Specific Tweet Bucket)
Timeline Aggregator ] (Combines Redis Cache + Live Celebrity Tweets)
Client Device ]
Fanout-on-Write (Push) vs. Fanout-on-Read (Pull)
Fanout-on-Write (Push):
When a user posts a tweet, background workers lookup their followers and insert the
tweet_id into every follower's Redis timeline list:
Bash
timeline : user : <follower_id>
LPUSH
timeline : user :
L TRIM
Strengths: Inexpensive reads (O (1)) via
<tweet_id>
e 799
LRANGE
Bottlenecks: When an account with 80 Million followers tweets, the system must write
millions of records, generating substantial processing lag and cache thrashing.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 86 -->

10/3/26, AM
Fanout-on-Read (Pull):
Tweets persist only to the author's local timeline.
When a user loads their feed, the system fetches all followed user accounts and merges
their recent tweets in-memory using a multi-way merge-sort.
Bottlenecks: Significant CPU overhead and high read latency for users following
thousands of accounts.
Hybrid Model:
Users with < 25, 000 followers use Push fanout.
Accounts with > 25, 000 followers (celebrity tier) use Pull fanout.
The timeline aggregator reads the user's cached Redis list, fetches recent tweets for any
followed celebrities, and merges the results in memory sorted by timestamp.
System 6: YouTube / TikTok (Video Ingestion & Playback)
Requirements
Functional: Resumable large-file uploads; automated transcoding pipelines; streaming
playback; recommendation ranking.
Non-FunctionaI: Prevent partial upload corruptions; keep video playback buffering <
1 ensure high edge-cache availability.
Architecture Diagram
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 87 -->

10/3/26, AM
C Video Creator
-- (Chunked PUT)--> [ Ingestion Gateway ]
[ S3 Temp Bucket ]
(S3 : ObjectCreated)
[ Kafka Transcode
[ Transcoder Pods
36ep
nep
Topic
(1<8s) ]
le8ep
[ S3 Egress Bucket ]
[ CloudFront CDN ]
C Global Viewer ]
Resumable Upload Architecture
2.
3.
4.
The client registers an upload: POST /api/vl/videos/uploads/initiate
The server creates an upload session ID and returns signed multipart upload URLs
pointing to S3.
The client uploads the file in 8MB chunks using HTTP PUT requests, tracking ETags for
each part.
If a network interruption occurs, the client queries uploaded parts via
and resumes uploading from the last missing
GET /
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 88 -->

C Seed URLs
https://genni.google.corWapp/9c630fe34c54d948
10/3/26, AM
offset.
5. On completion, the server merges the parts into a single master asset.
System 7: Distributed Web Crawler (Search Engine Scale)
Requirements
Functional: Crawl web pages starting from seed URLs; extract discovered links;
deduplicate URLs and text; respect robots .txt
Non-Functional: Politeness guarantees (avoid overloading target domains); crawl
throughput > 50, 000 pages/sec; robust deduplication filtering.
Architecture Diagram
[ Worker Crawlers ] <¯¯¯> [ Fast DNS Cache ]
---> [ Priority Queues (PageRank) ]
Politeness Queues ] (1 Queue per Target Domain Host)
(Delay Lock Manager)
(Raw HTML Page)
Content Extractor ]

<!-- PAGE 89 -->

10/3/26, AM
(SimHash Digest)
(Extracted Links)
L Document Deduplication ] L URL Bloom Filter ]
URL Frontier Architecture: Politeness & Prioritization
Priority Queues (Front Queues): Rank URLs by domain importance, PageRank scores,
and update frequency.
Politeness Queues (Back Queues): Group URLs into distinct queues per target host (e.g.,
queue: nytimes.com
Each queue links to a timing lock:
Next Fetch Allowed — Previous Fetch Time + Host Delay (from robots.txt)
Worker threads dequeue URLs only after a host's timing lock expires, preventing
accidental denial-of-service spikes against target websites.
Deduplication Engine
URL Filter: A cluster-wide Bloom Filter confirms whether a URL was previously scheduled.
Its bit-vector representation evaluates hashes in O (1) memory without querying
relational disks.
Content Similarity via SimHash:
Tokenizes text content and calculates token frequency weights.
2. Hashes each token into a 64-bit fingerprint.
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 90 -->

10/3/26, AM
3.
4.
5.
Combines bit positions: for bit position i, add weight if bit is 1, subtract if O.
Yields a 64-bit summary fingerprint: if total sum > 0, set to 1; else set to 0.
Two pages are treated as duplicates if the Hamming distance between their
SimHash values is < 3.
System 8: Distributed Rate Limiter (API Defense Tier)
Algorithm Trade-offs
Algorithm
Token Bucket
Leaky Bucket
Fixed Window
Sliding Log
Sliding Counter
Pros
Handles controlled bursts
Enforces smooth outbound rate
Low memory footprint
High accuracy
Low memory, high accuracy
Cons
Requires dynamic state sync
Delays burst traffic
Traffic spikes at boundaries
Memory scales with traffic
Approximates edge counts
Production Implementation: Redis Sliding Window Log (Lua Script)
Lua
local rate_limit_key
local max_allowed
local current_epoch
https://genni.google.corWapp/9c630fe34c54d948
= KEYS[I]
- tonumber(ARGV[1])
- tonumber(ARGVL2])

<!-- PAGE 91 -->

10/3/26, AM
local
local
redis .
local
window_size
window_size
clear_boundary = current_epoch -
Evict entries older than the active window
call ( ' zremrangebyscore' , rate _ limit _ key, e, clear _ boundary)
Fetch the number of logged requests in the active window
current_usage = redis . call ( ' zcard' , rate _ limit _ key)
if current_usage < max_allowed then
3. Log current request with a unique compound member
local unique _ token = current_epoch
redis zadd' , rate_limit_key, current_epoch, unique_token)
redis . call expire' , rate_limit_key, window _ size)
return 1
return e
end
Allowed
Rate Limited (HTTP 429)
Module 4: Low-Level System Designs (LCD) & Object-
Oriented Implementations
System 9: Distributed URL Shortener (TinyURL)
Design Decisions & Rationale
Base62 Encoding: Base64 contains reserved URL characters ( +
). Base62 uses only
alphanumeric characters ( Ca-zA-ZO-9] ), avoiding URL encoding issues.
Deterministic ID Translation: Hashing URLs introduces collision resolution overhead.
Instead, we generate unique 64-bit integer IDs (via an ID generator or database
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 92 -->

10/3/26, AM
sequences) and convert them to Base62. A 7-character Base62 string yields 627
3.52 Trillion combinations.
Complete Java Implementation
Java
package corn. system. .urlshortener;
java . time . Instant;
J ava . util . Map;
(C)
import
import
import
import
public
j ava . util . concurrent . ConcurrentHashMap ;
j ava . util . concurrent . atomic. AtomicLong;
class TinyUrlEngine {
private static final String ALPHABET =
"abcdefghij klmnopqrstuvwxyzABCDEFGHIJKLMNOPQRf
private static final int BASE
= ALPHABET. length() ;
private final AtomicLong sequenceGenerator;
private final Map<String, UrlRecord> codeToUrIMap;
private final Map<String, String> urlToCodeMap;
public record UrlRecord (String originallJrI, String shortCode,
public TinyUrlEngine(Iong seedOffset) {
this . sequenceGenerator = new AtomicLong(seedOffset) ;
this . codeToUrlMap = new ;
this .urlToCodeMap = new ;
public String shorten (String originalUrI, long ttISeconds) {
https://genni.google.corWapp/9c630fe34c54d948
Instant expirationTime)

<!-- PAGE 93 -->

10/3/26, AM
if (urlToCodeMap. containsKey(originaIUrI)) {
String existingCode = urlToCodeMap.get(originalUrl) ;
— codeToUrlMap. get (existingCode) ;
UrlRecord record —
if (record != null && record . expirationTime() .isAfter(Instant. now())) {
return existingCode;
Long uniqueld = sequenceGenerator. incrementAndGet() ;
String code = encodeBase62(uniqueId) ;
Instant expiration =
(ttISeconds > e) ? Instant. now() . plusSeconds(ttISeconds)
- new UrlRecord(originalUrl, code, expiration) ;
UrlRecord newRecord -
codeToUrlMap . put (code, newRecord) ;
urlToCodeMap . put (originalUrI, code) ;
return code;
public String resolve(String shortCode) {
— codeToUrIMap. get (shortCode) ;
UrlRecord record -
if (record
null) {
throw new code does not exist. ")
if (Instant . now() .isAfter(record . expirationTime())) {
codeToUrlMap. remove(shortCode) ;
url ToCodeMap. remove (record . originallJrI ( ) ) ;
throw new IllegalStateException("Short code expired. ")
return record . originalUrI() ;
private String encodeBase62 (long value) {
StringBuilder sb = new StringBuilder() ;
while (value > 0) {
int remainder = (int) (value % BASE) ;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 94 -->

10/3/26, AM
sb . append (ALPHABET. charAt (remainder)) ;
value BASE;
return sb . reverse() .toString() ;
System 10: Thread-Safe In-Memory LRU Cache with TTL
Design Decisions & Rationale
Hash Map: Delivers 0(1) key-to-node lookups.
Doubly-Linked List: Enables 0(1) node removals and head insertions.
ReentrantReadWriteLock: Grants concurrent read access while serializing write updates,
preventing corruption under high concurrency.
HEAD [KIIV11Expire)
(Most Recent)
[K21V21 Expire]
[K31V31Expire] TAIL
(Oldest / LRU)
Complete Java Implementation
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 95 -->

10/3/26, AM
@ IP
Java
package com.system.Ild.cache;
import java . util.HashMap;
import java.util . Map;
import java . util . concurrent . locks . ReentrantReadWriteLock ;
public class ConcurrentLruCache<K, {
private static class Node<K, V> {
final K key;
V value;
long expireAt;
Node<K, V> prev;
Node<K, next;
Node(K key, V value, long expireAt) {
this . key = key;
this. value value;
this .expireAt =
expireAt ;
boolean isExpired() {
return expireAt > e && System. currentTimeMiIIis() > expireAt;
private
private
private
private
private
https://genni.google.corWapp/9c630fe34c54d948
final
final
final
final
final
int capacity;
Map<K, Node<K, V>> index;
Node<K, V> headSentinel ;
Node<K, V> tail Sentinel;
ReentrantReadWriteLock rwLock;

<!-- PAGE 96 -->

10/3/26, AM
public ConcurrentLruCache(int capacity) {
this . capacity = capacity;
this . index =
new HashMap<>(capacity) ;
this . headSentineL =
new null,
this . tail-Sentinel = new Node<>(null, null,
headSentinel . next —
tail Sentinel;
tailSentinel . prev = headSentineI;
new ReentrantReadWriteLock() ;
this.rwLock -
public V get(K key) {
rwLock . writeLock() . lock() ;
try {
V> node = index . get(key) ;
if (node
null) return null;
if (node . isExpired()) {
unlink (node) ;
index . remove (key) ;
return null;
moveToHead (node) ;
return node. value;
} finally {
rwLock .writeLock() . unlock() ;
public void put(K key, V value, long ttlMs) {
rwLock .writeLock() . lock() ;
try {
e);
e);
long expireTime = (ttlMs > 9) ? System. currentTimeMillis()
+ ttIMs .
Node<K, V> existing = index . get (key) ;
https://genni.google.corWapp/9c630fe34c54d948
e;

<!-- PAGE 97 -->

10/3/26, AM
if (existing null) {
existing. value = value;
existing. expireAt = expireTime;
moveToHead (existing) ;
else {
if (index. size() >= capacity) {
Node<K, V) Iru = tail Sentinel. prev;
unlink (Iru) ;
index . remove(lru . key) ;
new ,
Node<K, created =
attachHead(created) ;
index . put (key, created) ;
} finally {
rwLock . writeLock() . unlock() ;
private void attachHead(Node<K, V> node) {
node . next = headSentineI.next;
node . prev = headSentineI;
headSentinel . next . prev node;
headSentinel . next —
node ;
private void unlink (Node<K, V> node) {
value,
node . prev . next = node.next;
node . next . prev = node .prev;
private void moveToHead (Node<K,
unlink (node) ;
attachHead(node) ;
https://genni.google.corWapp/9c630fe34c54d948
V> node) {
expireTime) ;

<!-- PAGE 98 -->

10/3/26, AM
System 11: Multi-Elevator Dispatcher & Scheduler
Design Decisions & Rationale
Strategy Pattern: Decouples elevator scheduling algorithms ( LOOK , SCAN ,
Shortest-Seek ) from operational state.
LOOK Scheduling: The car travels in its current direction, servicing all pending calls along
the way, and reverses direction only when no further requests remain ahead.
Complete Java Implementation
Java
package com.system.Ild . elevator;
import java.util.*;
public class ElevatorControIIer {
public enum Direction { UP, DOWN, IDLE
public static class ElevatorCar {
private final int id;
private int currentFloor e;
private Direction direction = Direction. IDLE;
private final TreeSet<Integer> upRequests =
new ;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 99 -->

10/3/26, AM
private final TreeSet<Integer> downRequests =
new
public ElevatorCar(int id) {
this. id = id,
public synchronized void requestFIoor(int destinationFIoor) {
if (destinationFIoor currentFIoor) return;
if (destinationFloor > currentFloor) {
upRequests . add (destinationFIoor) ;
} else {
downRequests . add (destinationFIoor) ;
if (direction Direction . IDLE) {
direction
(destinationFIoor > currentFIoor) ? Direction.UP .
public synchronized void processNextStep() {
if (direction Direction . UP) {
if (!upRequests.isEmpty()) {
currentFloor upRequests .poIIFirst() ;
} else if (!downRequests.isEmpty()) {
direction = Direction. DOWN;
currentFloor = downRequests .pollFirst() ;
else {
direction =
Direction . IDLE ;
} else if (direction Direction. DOWN) {
if (!downRequests.isEmpty()) {
currentFIoor = downRequests . poll First() ;
} else if (!upRequests.isEmpty()) {
direction = Direction. UP;
Direction .
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 100 -->

10/3/26, AM
upRequests . poll First() ;
currentFIoor =
else {
direction = Direction. IDLE;
public int getCurrentFIoor() { return currentFIoor;
public Direction getDirection() { return direction;
public int getld() { return id;
public interface DispatchStrategy {
ElevatorCar findOptimaICar(List<EIevatorCar> cars, int sourceFIoor ,
public static class ClosestCarStrategy implements DispatchStrategy {
@Override
Direction dil
public ElevatorCar cars, int sourceFtoor ,
ElevatorCar bestCar null;
int lowestDelta = Integer. MAX_VALUE;
for (ElevatorCar car .
cars) {
int delta -
— Math . abs (car .getCurrentFIoor()
- sourceFIoor) ;
Direction. IDLE I I car. getDirection()
if (car. getDirection()
if (delta < lowestDeIta) {
lowestDelta = delta;
bestCar = car
return (bestCar ! —
null) ? bestCar
. cars . get (9) ;
https://genni.google.corWapp/9c630fe34c54d948
Direct
dir) {

<!-- PAGE 101 -->

10/3/26, AM
System 12: Parking Lot Management System
Design Decisions & Rationale
Inheritance & Polymorphism: Specializes parking spot dimensions ( Compact
Motorbike
Strategy Pattern: Enables pluggable rate policies ( HourlyRateStrategy
FlatRateStrategy , WeekendStrategy
Complete Java Implementation
Java
package com.system.Ild . parkinglot;
time . Duration ;
java . time . Instant;
java. util.*;
j ava . util . concurrent . ConcurrentHashMap ;
Large ,
import
import
import
import
public
java.
class ParkingLotManager {
public enum VehicleSize { MOTORBIKE, CAR,
public abstract static class Vehicle {
https://genni.google.corWapp/9c630fe34c54d948
BUS

<!-- PAGE 102 -->

10/3/26, AM
private final String licensePIate;
private final VehicleSize size;
public Vehicle(String licensePIate, VehicleSize size) {
this . licensePLate = licensePIate;
this. size = size;
public VehicleSize getSize() { return size;
public String getLicensePlate() { return licensePIate;
public static class CompactCar extends Vehicle {
public CompactCar(String plate) { super(plate,
public abstract static class ParkingSpot {
private final String spotld;
private boolean occupied ;
private Vehicle parkedVehicle;
public ParkingSpot(String spotld) {
this . spotld = spotld;
VehicleSize. CAR) ;
public abstract boolean fitsVehicIe(VehicIe vehicle) ;
public synchronized void park (Vehicle vehicle) {
if (occupied I I {
throw new unavailable for vehicle sizing. "
this . parkedVehicte = vehicle;
this . occupied =
true ;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 103 -->

10/3/26, AM
public synchronized void vacate() {
this . parkedVehicle = null;
this . occupied =
false;
public boolean isoccupied() { return occupied;
public String getSpotId() { return spotld;
public static class CarSpot extends ParkingSpot {
public CarSpot (String spotld) { super(spotld) ;
@Override
public boolean fitsVehicIe(VehicIe vehicle) {
return vehicle.getSize() == VehicleSize.CAR I I vehicle.getSize()
VehicleSi
public record ParkingTicket(String ticketld,
public interface BillingStrategy {
double computeFee(Duration elapsed) ;
String spotld,
String plate,
Instant iss
- ratePerH0Lll
public static class StandardHourIyBiIIing implements BillingStrategy {
private final double ratePerHour;
public StandardHourIyBiIIing(doubIe ratePerHour) { this. ratePerHour -
@Override
public double computeFee(Duration elapsed) {
= Math .max(l, (long) Math. ceil (elapsed. toMinutes() / 6e.e)
long billableHours
return billableHours * ratePerHour;
public static class ParkingLotFaciIity {
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 104 -->

10/3/26, AM
private final spots =
new ;
private final Map<String, ParkingTicket> activeTickets =
new ConcurrentHashMap<>(
public void registerSpot(ParkingSpot spot) { spots . add(spot);
public synchronized ParkingTicket checkln(VehicIe vehicle) {
for (ParkingSpot spot
spots) {
if spot. isOccupied() && spot. fitsVehicIe(vehicIe)) {
spot. park (vehicle) ;
String ticketld
UUID. randomUUID() . toString() ;
ParkingTicket ticket = new Parking Ticket(ticketld, spot. getSpotId() ,
activeTickets .put(ticketld, ticket) ;
return ticket;
throw new full for size: "
+ vehicle.getSize(
public synchronized double checkOut(String ticketld, BillingStrategy strategy) {
ParkingTicket ticket activeTickets . remove(ticketld) ;
if (ticket
null) throw new Illegal ArgumentException("Unknown ticket ID. ") ;
ParkingSpot assignedSpot = spots . stream()
. filter(s -> s.getSpotId() . equals(ticket. spotld()))
. findFirst()
. orElseThrow() ;
assignedSpot . vacate() ;
Duration elapsed = Duration . between(ticket. issuedAt() ,
return strategy. computeFee(eIapsed) ;
Instant. now()) ;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 105 -->

10/3/26, AM
System 13: In-Memory Pub/Sub Engine
Design Decisions & Rationale
Observer Pattern: Decouples message publishers from subscriber listener loops.
Bounded Executor Pools: Dispatches messages to subscribers asynchronously across
dedicated thread pools, preventing slow consumers from blocking ingress pipelines.
Complete Java Implementation
Java
package com.system.lld.pubsub;
import java.util.*;
import java . util . concurrent
public class PubSubBus {
public record EventMessage(String topic,
public interface Subscriber {
String getSubscriberId() ;
void onEvent(EventMessage message) ;
public static class TopicChanneI {
private final String topicName;
String payload,
long timestamp)
private final Set<Subscriber> subscribers = ConcurrentHashMap. newKeySet() ;
private final ExecutorService dispatcher = Executors . newVirtuaIThreadPerTaskExecL
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 106 -->

10/3/26, AM
public TopicChanneI(String topicName) {
this . topicName = topicName;
public void subscribe(Subscriber subscriber) { subscribers. add(subscriber);
public void unsubscribe(Subscriber subscriber) { subscribers. remove(subscriber) ;
public void broadcast(EventMessage message) {
for (Subscriber sub
. subscribers) {
dispatcher. submit(() {
try {
sub. onEvent(message) ;
catch (Exception ex) {
System. err. printf("Error dispatching to %s:
sub. getSubscri
private final Map<String, TopicChannel> channels =
public void createTopic(String topicName) {
new ConcurrentHashMap<>() ;
channels .putIfAbsent(topicName, new TopicChanneI(topicName)) ;
public void registerSubscriber(String topicName, Subscriber subscriber)
TopicChannel channel = channels . get (topicName) ;
if (channel
null) throw new Illegal does not exist:
channel . subscribe (subscriber) ;
public void emit (String topicName, String payload) {
TopicChannel channel = channels .get(topicName) ;
if (channel ==
null) throw new IllegalArgumentException("Topic does not exist: '
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 107 -->

10/3/26, AM
channel . broadcast(new EventMessage(topicName, payload, System. currentTimeMiIIis()
System 14: Snake & Ladder Game Engine
Design Decisions & Rationale
Single Responsibility Principle (SRP): Separates board coordinates and transition links (
Snake , Ladder ) from game loop orchestration and dice behaviors.
Deterministic Testability: The DiceRoLLStrategy interface supports pluggable random-
source implementations, simplifying automated unit testing.
Complete Java Implementation
Java
package com.system.lld . snakeladder;
import java.util.*;
public class SnakeAndLadderGame {
public record BoardJump(int fromCeII, int toCeII) {
public BoardJump {
if (fromCell toCell) throw new IllegalArgumentException("Start cannot matc
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 108 -->

10/3/26, AM
public static class GameBoard {
private final int totalCells;
private final Map<lnteger, Integer> jumpMap =
public GameBoard(int totalCells) {
this . totalCetts =
totalCeIIs ;
public void setSnake(int head, int tail) {
new ;
if (head tail) throw new Illegal ArgumentException("Snake head must be ab0'.
jumpMap . put (head, tail) ;
public void setLadder(int start, int end) {
if (start end) throw new Illegal base must be bel
jumpMap . put (start, end) ;
public int calculateNextPosition(int targetPosition) {
return jumpMap. getOrDefault(targetPosition,
public int get TotalCeIIs() { return totalCeIIs;
public static class PlayerToken {
private final String name;
private int currentSquare = e;
targetPosition) ;
public
public
public
public
https://genni.google.corWapp/9c630fe34c54d948
Player Token (String name) { this . name = name;
String getName() { return name;
int getCurrentSquare() { return currentSquare;
void setSquare(int s) { this . currentSquare = s

<!-- PAGE 109 -->

10/3/26, AM
public interface DiceStrategy {
int roll();
public static class StandardDie implements DiceStrategy {
private final Random random = new Random() ;
@Override
public int roll() { return random. nextInt(6) + I;
public static class GameMatch {
private final GameBoard board;
private final DiceStrategy dice;
private final players =
private boolean winnerAnnounced = false;
new ArrayDeque<>() ;
public GameMatch (GameBoard board, DiceStrategy dice, List<PIayerToken> participar
this . board
= board;
this.dice dice;
this . players . addAll (participants) ;
public boolean advanceTurn() {
if (winnerAnnounced) return true;
PlayerToken current = players .pollFirst() ;
int roll = dice. roll();
int dest = current. getCurrentSquare() + roll;
if (dest board .getTotalCelIs()) {
board . calculateNextPosition(dest) ;
dest =
current . setSquare(dest) ;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 110 -->

10/3/26, AM
if (current .getCurrentSquare() board. get TotalCeIIs()) {
System. out . has won the match: " + current.getName());
winnerAnnounced =
true ;
return true;
players . addLast (current) ;
return false;
System 15: Concurrency-Safe Movie Ticket Reservation System
(BookMyShow)
Design Decisions & Rationale
Two-Phase Reservation Lifecycle: Direct commits during seat selection cause booking
collisions.
Phase I (Temporary Lock): Selected seats transition to LOCKED with an expiration
window (e.g., 600 seconds) using thread-safe CAS operations.
Phase 2 (Payment Confirmation): Confirmed purchases mark seats BOOKED . If
payments fail or sessions time out, locks clear and seats return to AVAILABLE
Complete Java Implementation
@ IP
Java
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 111 -->

10/3/26, AM
package com.system.lld . booking;
import java. time . Instant;
import java.utit.*;
import java . util . concurrent. ConcurrentHashMap;
public class TicketReservationManager {
public enum SeatState { AVAILABLE, LOCKED,
public static class SeatEntity {
private final String seatld;
BOOKED
private SeatState state SeatState.AVAILABLE;
private Instant lockReleaseDeadIine =
Instant. MIN;
public SeatEntity(String seatld) { this. seatld seatld;
public synchronized boolean reserveLock (long timeoutSeconds) {
if (state SeatState. BOOKED) return false;
if (state == SeatState. LOCKED && Instant. now() .isBefore(IockReIeaseDeadIine))
return false; // Still actively locked by an in—flight checkout
this . state = SeatState. LOCKED;
this . tockReLeaseDeadLine = Instant. now() .pIusSeconds(timeoutSeconds) ;
return true;
public synchronized boolean commitBooking() {
if (state SeatState. LOCKED && Instant. now() .isBefore(IockReIeaseDeadIine))
this . state = SeatState. BOOKED;
return true;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 112 -->

10/3/26, AM
return false;
public synchronized void unlock() {
if (state SeatState. BOOKED) {
this . state = SeatState.AVAILABLE;
this . lockReteaseDeadIine —
Instant. MIN;
public SeatState getState() { return state;
public String getSeatId() { return seatld;
public static class BookingShowCoordinator {
private final Map<String, SeatEntity> seatlnventory =
new ;
public void provisionSeat(String seatld) {
seatlnventory. put(seatld, new SeatEntity(seatId)) ;
public boolean seatlds, long timeoutSeconds) {
lockedProgress = new ;
for (String Sid
. seatlds) {
SeatEntity seat —
seat Inventory. get (sid) ;
if (seat null && seat. reserveLock(timeoutSeconds)) {
lockedProgress . add (seat) ;
else {
// Roll back previously acquired locks if any seat fails
lockedProgress . forEach (SeatEntity : : unlock) ;
return false;
return true;
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 113 -->

10/3/26, AM
public boolean confirmTransaction(List<String> seatlds) {
for (String Sid
. seatlds) {
SeatEntity seat =
seat Inventory . get (Sid) ;
if (seat null I I
! seat. commitBooking()) {
return false;
return true;
Module 5: Comparative Trade-Off Matrices &
Architectural Synthesis
SYSTEM TRADE-OFF SUMMARY
Problem Domain
Media Streaming
Geo-Dispatch
Order Systems
Instant Messaging
Social Feeds
https://genni.google.corWapp/9c630fe34c54d948
Primary Bottleneck
Outbound Egress
Ingest Write Rate
Data Contention
Open TCP Streams
Celebrity Fanout
Primary Datastore
S3 + Global CDNs
Redis + H3 Index
MySQL + PostgreSQL
ScyllaDB (Inboxes)
Redis + TiDB
Concurrency / Consist
Event-driven transcoc
Spatial sharding by c
Redis token pre-alloc
Ephemeral socket conr
Hybrid Push-Pull pipe

<!-- PAGE 114 -->

10/3/26, AM
I Rate Limiting
I Low-Latency Access
I In—Memory Redis
I Atomic Lua script evE
Module 6: Self-Study Platform Web Architecture
C Next .js 14 Frontend Application (TailwindCSS, Markdown Renderer) ]
(HTTPS REST / SSE Event Streams)
C FastAPI Microservice Cluster (Python 3.11 / Uvicorn) ]
(PostgreSQL 16)
JSONB Curricula
(ChromaD3 / pgvector)
Vector Documentation
(Redis 7)
Session & Cache
Frontend: Next.js application delivering static notes, system design blueprints, and
interactive code walkthroughs.
Backend: FastAPl microservice managing system design '
i wanted a pdf for all this
and an integrated RAG-based search engine.
Data Layer: PostgreSQL (JSONB) for modular curricula data, Redis for cached
architectural templates, and a vector datastore for intelligent document retrieval.
The comprehensive study notes covering the full lecture series and fundamentals are compiled
into the reference manual:
7. How to Exoort This Notebook as a PDF
File Name:
deep-learning-masterclass-notes-v2. pdf
To save MD , entire guide as a clean, publication-ready PDF:
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 115 -->

10/3/26, AM
Location: Saved directly inside your Studio panel as a permanent artifact.
What is Included Inside TINS PDFRéféöéffdéManual:
1' Intelligence + Machine Learning Deep
3 MD
4• MM6i8åfcåPFrfdtiVSii&r5: cortbx map to
2.1
3.
4.
artificiållavéFs. - MD +1
Option 2: CLI Export randoc / Weasyprint
pdf \
--pdf-engine=weasyprint
followed by activation a ff(z)).
MD •
Why biases are necessary (preventing null outputs when weights initialize to zero).
YouTube
The chain rule of differentiation for backpropagation across multi-path and multi-
layer architectures. YouTube
Loss Functions & Vanishing Gradient Taxonomy:
Mathematical derivations and formulas for Regression Losses (MSE, MAE, Huber)
and Classification Losses (Binary Cross-Entropy / Log Loss, Categorical Cross-
Entropy, Softmax). MD +1
Detailed breakdown of the vanishing gradient problem in deep networks using
Sigmoid/Tanh.
Full taxonomy of modern activation functions (ReLU, Leaky ReLU, PReLU, ELU, Swish).
YouTube
Complete Optimizer Suite:
https://genni.google.corWapp/9c630fe34c54d948

<!-- PAGE 116 -->

10/3/26, AM
5.
Comparative mathematical derivations: Batch Gradient Descent, Stochastic
Gradient Descent (SGD), Mini-Batch SGD, SGD with Momentum (exponential moving
averages), AdaGrad, RMSProp, and Adam. MD+I
Code Implementations & Computer Vision (CNNs):
ANN Implementation: Complete TensorFlow/Keras pipeline for tabular churn
classification, featuring feature scaling, Dropout layers, and Early Stopping callbacks
YouTube
CNN Architectures: Mathematics of 2D convolutions, spatial dimension formulas
n+2p—f
1 , padding, stride mechanics, Max Pooling vs. Average Pooling,
flattening, and a full CIFAR-IO classification script. YouTube
You can open and download deep-learning-masterclass-notes-v2. pdf
directly from the
Studio panel on your screen. MD
https://genni.google.corWapp/9c630fe34c54d948