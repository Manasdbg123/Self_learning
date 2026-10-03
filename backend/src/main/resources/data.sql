
-- Seed Comprehensive Engineering Knowledge Base from self.pdf

INSERT INTO topic (subject, category, name, difficulty, overview, deepDive, architecture, codeExample, interviewQuestions) VALUES
('System Design', 'HLD', 'System 1: Netflix (Global Video Streaming System)', 'Expert', 'Netflix is a planetary-scale video-on-demand platform serving personalized streaming to over 100M Daily Active Users and 15M concurrent peak streams. 

The architecture separates control-plane operations (sign-up, search, billing, recommendation, user profiles) from the data-plane (delivering petabits of video chunks per second). The data-plane operates completely outside AWS using Netflix Open Connect—a custom globally distributed Content Delivery Network of physical Open Connect Appliances (OCAs) deployed directly inside thousands of ISP data centers worldwide.', '1. **Master Ingestion & Transcoding**: Studio masters uploaded to Amazon S3. The Transcoding Pipeline splits raw video into thousands of chunks, encoding each into hundreds of profiles (resolutions 360p to 4K, codecs H.264, HEVC, AV1) based on device profiles.
2. **Proactive CDN Push**: During off-peak night hours, new titles are pre-cached across global OCA servers based on regional machine learning predictive demand models.
3. **Playback Initiation**: Client app hits API Gateway (Zuul/Spring Cloud) -> Playback Authorization Service -> Returns manifest file (.m3u8 / .mpd) listing chunk URLs pointing to the optimal local OCA.
4. **Playback & Telemetry**: Client requests 2-10 second video chunks via HTTP GET over TLS. A background heartbeat sends playback telemetry every 10 seconds to Kafka -> Cassandra.

## Storage & Data Tier Architecture

### 1. Playback State Tracking (Cassandra)
Cassandra handles bookmark positions with append-only write speed:
```sql
CREATE KEYSPACE netflix_streaming WITH replication = {
  ''class'': ''NetworkTopologyStrategy'',
  ''us-east'': 3,
  ''eu-west'': 3
};

CREATE TABLE video_playback_state (
  user_id uuid,
  profile_id uuid,
  video_id uuid,
  last_playback_position_sec int,
  total_duration_sec int,
  completed_state boolean,
  updated_at timestamp,
  PRIMARY KEY ((user_id, profile_id), video_id)
);
```

### 2. Video Chunking & Manifest Generation
- Manifest file (.m3u8 for HLS, .mpd for DASH) describes video tracks, audio languages, and subtitle tracks.
- Chunks are typically 2 to 6 seconds long. Client algorithms (BBA - Buffer-Based Algorithm) monitor buffer fill level to step up or down bitrate ladders.', '+-----------------------------------------------------------------------------------+
|                            NETFLIX GLOBAL ARCHITECTURE                            |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Client App (Smart TV / Mobile / Browser) ]                                     |
|         |                                 |                                       |
|         | (1. Auth, Search, Manifest)     | (4. Stream Video Chunks via TLS)      |
|         v                                 v                                       |
|  [ Anycast DNS / API Gateway ]     [ ISP Edge: Open Connect Appliance (OCA) ]     |
|         |                                 ^                                       |
|         v                                 | (3. Proactive Off-Peak Preload)       |
|  [ AWS Control Plane Services ]           |                                       |
|    +-- Zuul API Gateway                   |                                       |
|    +-- Playback Service                   |                                       |
|    +-- Recommendation Engine              |                                       |
|         |                                 |                                       |
|         v                                 |                                       |
|  [ Ingestion & Transcoding Pipeline ] ----+                                       |
|    +-- Raw Mezzanine S3 Staging                                                   |
|    +-- Distributed Transcoder (HEVC/AV1)                                          |
|    +-- Video Manifest Generator                                                   |
|         |                                                                         |
|         v (Telemetry Heartbeat)                                                   |
|  [ Apache Kafka ] -> [ Apache Flink ] -> [ Apache Cassandra (Playback State) ]    |
|                                                                                   |
+-----------------------------------------------------------------------------------+', '', 'Q: How does Netflix achieve 99.999% availability for video playback if AWS has an outage? A: Control plane operations (search, recommendation, login) are deployed across multiple AWS regions with Eureka/Zuul global traffic routing. Video streaming itself runs on ISP Open Connect appliances independently of AWS; if AWS experiences an outage, ongoing and newly initiated streams continue playing from OCA caches.
Q: Why is Cassandra preferred over PostgreSQL for playback state bookmarking? A: With 15M concurrent streams sending state updates every 10 seconds, write throughput exceeds 1.5M writes/sec. Cassandra''s LSM-tree architecture performs sequential append-only disk writes without locks, scaling horizontally across nodes.
Q: How does Adaptive Bitrate (ABR) streaming work under network congestion? A: The client video player continuously measures the buffer occupancy and HTTP chunk download speeds. If buffer depletion accelerates, the player immediately requests the next 2-second chunk from a lower bitrate track specified in the manifest.'),

('System Design', 'HLD', 'System 2: Uber / Grab (Geospatial Ride Dispatch Platform)', 'Expert', 'Uber/Grab is a hyper-real-time geospatial dispatch and matching engine. The platform ingests continuous GPS coordinates from millions of active drivers every 4 seconds, tracks trip states, calculates dynamic surge pricing, and matches rider requests to nearby drivers in under 1 second.

Key technical challenge: Spatial radius queries over fast-moving objects cannot be executed on traditional R-Tree or relational indexes without crippling locking and write contention.', '1. **Location Ingestion**: Driver sends `(lat, lon, driver_id, status)` every 4s via WebSocket -> Netty Location Ingestion Service -> Kafka `driver-locations` topic.
2. **H3 Cell Indexing**: Location Worker consumes Kafka event, computes H3 index at resolution 8 (cell area ~0.74 km2), and writes to Redis geospatial cluster:
   `HSET driver:locations:<h3_index> <driver_id> <coords_timestamp>`
3. **Ride Request & Matching**: Rider requests ride -> Dispatch Service determines rider''s H3 cell -> expands outward through rings (`kRing(h3_index, k)`) -> filters active available drivers within ETA threshold -> runs Hungarian matching algorithm -> sends dispatch notification to top driver.

## Geospatial H3 Indexing vs Geohash

| Metric | Geohash (Rectangular) | Uber H3 (Hexagonal) |
| :--- | :--- | :--- |
| Shape | Square / Rectangle | Regular Hexagon |
| Neighbor Distance | Unequal (orthogonal vs diagonal) | Equidistant (all 6 neighbors exactly equidistant) |
| Distortion at poles | High distortion | Uniform across globe (icosahedron projection) |
| Radius expansion | Complex edge artifacts | Uniform expansion (`kRing(cell, 1)` = 6 cells) |

### Dispatch Flow & Concurrency
When a driver is offered a trip, an atomic distributed lock (Redis Redlock or CAS) reserves the driver for 15 seconds to prevent race conditions from concurrent ride requests.', '+-----------------------------------------------------------------------------------+
|                         UBER GEOSPATIAL DISPATCH SYSTEM                           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Driver App ]  (Every 4s GPS)               [ Rider App ] (Ride Request)        |
|        |                                            |                             |
|        v (WebSocket / Netty)                        v (HTTP / REST)               |
|  [ Location Gateway ]                        [ API Gateway ]                      |
|        |                                            |                             |
|        v                                            v                             |
|  [ Kafka: driver-locations ]                 [ Dispatch & Matching Service ]      |
|        |                                            |                             |
|        v                                            | (k-Ring Neighbor Query)     |
|  [ Location Ingestion Worker ]                      v                             |
|        |                                     [ Redis H3 Geospatial Cluster ]      |
|        +---- Writes driver_id into H3 cell -> (In-Memory Grid, TTL=10s)           |
|                                                     |                             |
|                                                     v                             |
|                                              [ Match Engine ]                     |
|                                               - Filter ETA via OSRM               |
|                                               - Dynamic Surge Service             |
|                                               - Push Offer via WebSocket          |
|                                                                                   |
+-----------------------------------------------------------------------------------+', '', 'Q: Why does Uber use Hexagons (H3) instead of Squares (Geohash)? A: A regular hexagon has only one distance between its center and the centers of all 6 immediate neighbors. Squares have two distinct neighbor distances (orthogonal is 1, diagonal is sqrt(2)). This property makes trajectory smoothing, radius expansion, and cluster aggregation mathematically uniform.
Q: How do you prevent two nearby riders from being matched with the same driver? A: When the matching engine selects an eligible driver, it executes an atomic `SET driver:lock:<id> rider_id NX PX 15000` in Redis. If successful, the driver is locked and offered the trip for 15 seconds. If rejected or timed out, the lock expires.'),

('System Design', 'HLD', 'System 3: Food Delivery Platform (DoorDash / Swiggy / Zomato)', 'Expert', 'Food delivery platforms orchestrate a complex 3-sided marketplace: Customers, Restaurants/Merchants, and Delivery Delivery Partners. 

Unlike e-commerce where items ship asynchronously in 2-3 days, food delivery requires real-time coordination across physical fulfillment, inventory validation, card authorization, preparation timers, and driver dispatch within a 30-45 minute window.

The primary architectural challenge is managing distributed state across independent microservices without distributed locks (Two-Phase Commit).', '1. **Checkout & Reservation**: Customer clicks Place Order -> Order Service creates order in state `PENDING_PAYMENT` -> invokes Saga Orchestrator.
2. **Saga Orchestrator Workflow**:
   - Step 1: Call Payment Service -> Authorize credit card charge -> Success.
   - Step 2: Call Restaurant Service -> Send order to restaurant tablet -> Restaurant accepts -> Success.
   - Step 3: Call Delivery Dispatch Service -> Find & allocate nearby delivery partner.
3. **Compensating Transactions on Failure**:
   - If Restaurant Service rejects: Saga Orchestrator executes compensating transaction: calls Payment Service `refundPayment(tx_id)` -> marks Order `CANCELLED_BY_RESTAURANT` -> notifies user.

## Saga Orchestration State Machine

```
[Order Created]
      |
      v
[Execute Step 1: Charge Card] ---> (Fails) ---> [Order Aborted, Notify User]
      | (Succeeds)
      v
[Execute Step 2: Merchant Accept] ---> (Rejects/Timeout) ---> [Compensate Step 1: Refund Card]
      | (Accepts)                                                    |
      v                                                              v
[Execute Step 3: Dispatch Driver] ---> (No Driver) ---> [Compensate Step 2: Cancel Kitchen]
      | (Driver Assigned)                                            |
      v                                                              v
[Order SUCCESS: Cooking & In-Flight]                    [Compensate Step 1: Refund Card]
```

### Database Schema (PostgreSQL Order Table)
```sql
CREATE TABLE orders (
  order_id UUID PRIMARY KEY,
  customer_id UUID NOT NULL,
  restaurant_id UUID NOT NULL,
  status VARCHAR(32) NOT NULL, -- PENDING_PAYMENT, ACCEPTED, PREPARING, OUT_FOR_DELIVERY, COMPLETED, CANCELLED
  saga_execution_id UUID NOT NULL,
  total_amount_cents INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```', '+-----------------------------------------------------------------------------------+
|                        FOOD DELIVERY SAGA ARCHITECTURE                            |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Customer Mobile App ]                                                          |
|        |                                                                          |
|        v (POST /api/v1/orders)                                                    |
|  [ API Gateway ]                                                                  |
|        |                                                                          |
|        v                                                                          |
|  [ Order Service ]                                                                |
|        |                                                                          |
|        v (Initiates Saga)                                                         |
|  [ Order Saga Orchestrator ] <--------------------+                               |
|        |           |            |                 | (Compensating Events)         |
|        | (1)       | (2)        | (3)             |                               |
|        v           v            v                 |                               |
|   [ Payment ]  [ Kitchen ]   [ Dispatch ]         |                               |
|    Service      Service       Service             |                               |
|        |           |            |                 |                               |
|   (Charge Card) (Notify Tab) (Match Driver)       |                               |
|        +-----------+------------+-----------------+                               |
|                                                                                   |
|  [ Kafka Event Bus: order-events, payment-events, dispatch-events ]               |
|                                                                                   |
+-----------------------------------------------------------------------------------+', '', 'Q: What happens in the Saga pattern if a compensating transaction fails? A: Compensating transactions must be idempotent and retryable indefinitely. If transient network errors occur, the orchestrator retries with exponential backoff. If permanent failure occurs, the order drops into a Dead Letter Queue (DLQ) for human operator reconciliation.
Q: Why is 2PC (Two-Phase Commit) unsuitable for food delivery microservices? A: 2PC is a blocking protocol. If the coordinator or any participant crashes during the prepare phase, locks remain held on all databases, starving the system of throughput.'),

('System Design', 'HLD', 'System 4: WhatsApp / Telegram (End-to-End Encrypted Chat)', 'Expert', 'WhatsApp / Telegram is a global messaging platform delivering over 100 Billion messages per day to 2 Billion active users with sub-100ms latency and End-to-End Encryption (E2EE).

The server architecture acts as an untrusted blind message router: the server cannot read message contents, group texts, or media files. Once a message is delivered to the recipient device, it is permanently deleted from server memory and disk.', '1. **Connection Handshake**: Client establishes persistent TLS/WebSocket session to a Chat Gateway server. Session mapped in Redis: `user_id -> gateway_node_ip`.
2. **Message Transmission**: User A drafts message for User B. User A''s device encrypts the plaintext using User B''s ratchet key. The ciphertext is sent to Chat Gateway over socket.
3. **Routing**:
   - If User B is Online: Gateway queries Redis session store -> forwards ciphertext directly down User B''s active socket -> User B device decrypts and replies with delivery ACK.
   - If User B is Offline: Gateway stores ciphertext in ephemeral offline store (Cassandra or Mnesia). When User B reconnects, pending messages are drained and deleted.

## Cryptographic Architecture (Signal Protocol)

- **X3DH (Extended Triple Diffie-Hellman)**: Allows establishing shared secrets even when the recipient is offline by pre-publishing signed one-time prekeys to the key server.
- **Double Ratchet Algorithm**: Combines a Diffie-Hellman ratchet and a Symmetric KDF ratchet. Every single message produces a brand-new single-use symmetric encryption key.
- **Forward Secrecy**: Compromising current keys does not allow decrypting past messages.
- **Break-in Recovery**: An attacker with compromised keys cannot decrypt future messages once a new DH ratchet step occurs.', '+-----------------------------------------------------------------------------------+
|                        WHATSAPP E2EE CHAT ARCHITECTURE                            |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ User A (Sender) ]                                     [ User B (Receiver) ]    |
|        |                                                           ^              |
|        | 1. Encrypts payload with Ratchet Key                      |              |
|        | 2. Sends Ciphertext                                       |              |
|        v                                                           |              |
|  [ Chat Gateway (Node 1) ]                                 [ Chat Gateway (Node 2) ]
|        |                                                           ^              |
|        | 3. Query Session Store                                    |              |
|        v                                                           |              |
|  [ Redis Session Registry ] ---------------------------------------+              |
|     user_B -> Node 2 IP                                                           |
|        |                                                                          |
|        v (If User B is Offline)                                                   |
|  [ Offline Storage Queue (Cassandra) ]                                            |
|     - Ciphertext stored until User B reconnects                                   |
|     - Immediately purged after ACK received                                       |
|                                                                                   |
+-----------------------------------------------------------------------------------+', '', 'Q: How does WhatsApp support sending messages to users who are currently offline? A: Via X3DH pre-keys. The recipient publishes signed one-time public pre-keys to the server in advance. The sender fetches a pre-key, computes the shared master secret locally, encrypts the message, and sends it to the server. The server holds the ciphertext in an ephemeral queue until the recipient connects.
Q: What is Forward Secrecy in the Double Ratchet algorithm? A: Forward Secrecy ensures that if an attacker compromises the device''s current encryption keys today, they still cannot decrypt any previously recorded past messages, because every message used a unique ephemeral key that was immediately erased from memory after derivation.'),

('System Design', 'HLD', 'System 5: Twitter / X (Timeline Generation & Fanout Engine)', 'Advanced', 'Twitter / X is a real-time microblogging and social networking service handling 500 Million tweets posted per day and over 300 Billion timeline reads per day.

The core engineering hurdle is the extreme read-to-write ratio (~600:1) and the Celebrity / Hotspot problem (e.g. an account with 100M+ followers posting a tweet).', '1. **Tweet Ingestion**: User tweets -> Tweet Service stores tweet metadata in Manhattan / PostgreSQL and broadcasts event to Kafka `tweet-events`.
2. **Fanout Service**:
   - Queries Social Graph Service (FlockDB) to fetch author''s follower list.
   - If author is standard user (<25,000 followers): Pushes `tweet_id` into Redis Home Timeline lists (`LPUSH timeline:<follower_id> <tweet_id>`).
   - If author is celebrity (>25,000 followers): Skips push fanout.
3. **Home Timeline Read**: User opens app -> Timeline Service retrieves user''s Redis list -> fetches celebrity tweets -> runs in-memory multi-way merge sort -> populates user feed in < 50ms.

## Push vs Pull vs Hybrid Trade-Off Matrix

| Strategy | Write Cost | Read Cost | Celebrity Problem |
| :--- | :--- | :--- | :--- |
| **Fanout-on-Write (Push)** | Massive ($O(N)$ writes per tweet) | Minimal ($O(1)$ read from Redis) | Severe write amplification (100M Redis pushes per tweet) |
| **Fanout-on-Read (Pull)** | Minimal ($O(1)$ write) | Heavy ($O(F)$ DB scans + merge) | Terrible read latency for users following many accounts |
| **Hybrid (Twitter Standard)** | Low ($O(N)$ for normal users) | Fast ($O(1)$ + merge top-k celebrity tweets) | Eliminated by skipping push for accounts with >25k followers |

### Redis Timeline Data Structure
Timelines are stored as Redis lists of tweet IDs capped at 800 items:
`LPUSH timeline:user_123 9876543210`
`LTRIM timeline:user_123 0 799`', '+-----------------------------------------------------------------------------------+
|                        TWITTER HYBRID FANOUT ARCHITECTURE                         |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ User Posts Tweet ]                                                             |
|         |                                                                         |
|         v (POST /tweet)                                                           |
|  [ Tweet Service ] ---> [ Tweets DB (Postgres / Manhattan) ]                      |
|         |                                                                         |
|         v (Broadcast)                                                             |
|  [ Kafka: tweet-events ]                                                          |
|         |                                                                         |
|         v                                                                         |
|  [ Fanout Engine ] <---> [ Social Graph Service (FlockDB) ]                       |
|         |                                                                         |
|         +---> If Followers < 25k: PUSH tweet_id into Redis Lists for each follower |
|         |     `LPUSH timeline:<follower_id> <tweet_id>`                           |
|         |                                                                         |
|         +---> If Followers >= 25k (Celebrity): Do NOT push! Mark as Pull candidate|
|                                                                                   |
|  [ User Reads Feed ]                                                              |
|         |                                                                         |
|         v (GET /timeline)                                                         |
|  [ Timeline Service ]                                                             |
|         |-- 1. Read pre-computed Redis Timeline list                              |
|         |-- 2. Fetch recent tweets of followed celebrities                        |
|         |-- 3. In-memory Merge Sort & Return to Client (< 50ms)                   |
|                                                                                   |
+-----------------------------------------------------------------------------------+', '', 'Q: Why store only tweet IDs in Redis instead of full tweet JSON? A: Memory efficiency and data freshness. If a user edits or deletes a tweet, storing only 64-bit integer IDs means the update happens in one place (the Tweet entity store). Followers'' feeds fetch the ID and hydrate it from cache, preventing stale or inconsistent edits.
Q: How do you handle inactive users who haven''t logged in for 6 months? A: Their Redis timeline cache is evicted based on TTL. When they eventually log back in, an async worker re-materializes their timeline on-demand by querying the database for their followed accounts'' recent tweets.'),

('System Design', 'HLD', 'System 6: YouTube / TikTok (Video Ingestion & Recommendation)', 'Expert', 'YouTube / TikTok is a global video sharing platform ingesting over 500 hours of video every minute, serving billions of daily views, and executing ML-based recommendation ranking in real-time.

Key architectural challenges: Resumable chunked file uploading over unreliable connections, distributed Directed Acyclic Graph (DAG) video transcoding, and low-latency global CDN edge delivery.', '1. **Initiate Upload**: Client sends `POST /api/v1/videos/uploads/initiate` -> API Gateway returns `upload_id` and presigned S3 URLs for individual parts.
2. **Parallel Chunk Upload**: Client uploads 10MB chunks in parallel. S3 triggers an event notification upon completion.
3. **DAG Transcoding**:
   - Master chunk merges in temporary storage.
   - Transcoding Scheduler splits video into chunks and schedules tasks: Resolution Scaling (4K -> 1080p -> 720p -> 360p), Audio extraction, Watermarking, Thumbnail extraction.
4. **Publish & Recommendation**: Metadata is saved to Spanner / PostgreSQL; video embeddings enter Vector DB for candidate generation in the feed.

## Video DAG Transcoding Pipeline

```
[Raw MP4 File] 
      |
      +---> [Audio Extractor] ---> [AAC Encoder] ----------------+
      |                                                          |
      +---> [Splitter: 5s GOP Chunks]                            |
                  |                                              |
                  +---> [Worker: 4K Chunk Encoding (AV1/VP9)]    |
                  |                                              |
                  +---> [Worker: 1080p Chunk Encoding (H.264)]   |
                  |                                              |
                  +---> [Worker: 720p Chunk Encoding (H.264)]    |
                  |                                              |
                  +---> [Worker: 360p Chunk Encoding (H.264)]    |
                                |                                |
                                v                                v
                  [Assembler: Stitch Encoded Chunks] <-----------+
                                |
                                v
               [Generate .m3u8 HLS / .mpd DASH Manifests]
                                |
                                v
                 [Distribute to CDN Edge Locations]
```', '+-----------------------------------------------------------------------------------+
|                        YOUTUBE VIDEO INGESTION PIPELINE                           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Content Creator App ]                                                          |
|        |                                                                          |
|        | 1. Initiate Multipart Upload                                             |
|        v                                                                          |
|  [ Upload Service ] ---> Returns Presigned URLs                                   |
|        |                                                                          |
|        | 2. Direct parallel chunk uploads                                         |
|        v                                                                          |
|  [ Cloud Object Storage (S3 / GCS) ]                                              |
|        |                                                                          |
|        | 3. ObjectCreated Event                                                   |
|        v                                                                          |
|  [ Kafka: video-uploaded ]                                                        |
|        |                                                                          |
|        v                                                                          |
|  [ DAG Transcoding Scheduler ]                                                    |
|     |-- Task 1: Video Splitter (5s GOP chunks)                                    |
|     |-- Task 2: Parallel Transcoding Workers (1080p, 720p, 480p, AV1, H.264)      |
|     |-- Task 3: Audio Transcoding & Subtitle Generation                           |
|     |-- Task 4: Thumbnail Generator                                               |
|     |-- Task 5: Manifest Compiler (.m3u8 / .mpd)                                  |
|        |                                                                          |
|        v 4. Sync assets                                                           |
|  [ Global Edge CDN ] <=== [ Video Streaming Clients (HLS/DASH Playback) ]         |
|                                                                                   |
+-----------------------------------------------------------------------------------+', '', 'Q: Why upload chunks directly to S3 via presigned URLs instead of through the application server? A: Direct-to-storage upload removes heavy I/O and network saturation from API web servers, allowing them to remain lightweight stateless services. S3 handles scalable concurrent ingest and byte integrity validation natively.
Q: What is a GOP (Group of Pictures) and why is it important for video chunking? A: A GOP is a sequence of frames that begins with an I-frame (keyframe containing complete picture information) followed by P and B frames (predictive deltas). Videos can only be cleanly split at I-frame boundaries without causing visual distortion or corrupting decoding state.'),

('System Design', 'HLD', 'System 7: Distributed Web Crawler (Search Engine Scale)', 'Expert', 'A Distributed Web Crawler discovers, fetches, and indexes billions of web pages across the public internet for search engines (like Google) or LLM training datasets (Common Crawl).

Key engineering challenges: Obeying politeness constraints (preventing DDoS against target hosts), deduplicating trillions of URLs and page contents, and optimizing crawl throughput across dynamic network conditions.', '1. **URL Frontier Ingestion**: Seed URLs enter Priority Queues (based on PageRank) -> routed to Politeness Queues (one FIFO queue per target hostname domain).
2. **Worker Fetching**: Politeness Worker pulls URL, verifies `robots.txt` compliance, waits for domain rate-limit cooldown, and executes HTTP GET via DNS Resolver cache.
3. **Parsing & Deduplication**:
   - Extracted text is hashed with 64-bit SimHash. If Hamming distance with existing fingerprints is < 3, the page is discarded as duplicate.
   - Newly discovered links are checked against a Distributed Bloom Filter; unseen URLs are added to the Frontier.

## URL Frontier: Priority vs Politeness Architecture

```
Discovered URLs
      |
      v
[ Priority Filter ]
      |
      +---> [ High Priority Queue ]
      +---> [ Medium Priority Queue ]   (Priority Queues determine WHAT to crawl first)
      +---> [ Low Priority Queue ]
      |
      v
[ Politeness Router (Hash on Hostname) ]
      |
      +---> [ Domain Queue: cnn.com ] --------+ (Delay Queue ensures 1 req/sec per host)
      +---> [ Domain Queue: wikipedia.org ] --+
      +---> [ Domain Queue: github.com ] -----+
      |
      v
[ Fetcher Worker Thread Pool ]
      |
      v
[ DNS Cache -> HTTP Fetch -> HTML Parser ]
      |
      +---> [ SimHash Text Deduplication ]
      +---> [ URL Extraction -> Bloom Filter -> URL Frontier ]
```

### SimHash Algorithm
1. Extracts word tokens and assigns weights based on TF-IDF.
2. Hashes each token into a 64-bit binary fingerprint.
3. Sums bit positions: if bit is 1, adds weight; if 0, subtracts weight.
4. Final 64-bit vector: if sum > 0, set bit to 1, else 0.
5. Two pages are near-duplicates if Hamming distance is <= 3.', '+-----------------------------------------------------------------------------------+
|                        DISTRIBUTED WEB CRAWLER PIPELINE                           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Seed URLs ] ---> [ URL Frontier ]                                              |
|                           |                                                       |
|                           v                                                       |
|                     [ Host Politeness Delay Queues (Redis / Kafka) ]              |
|                           |                                                       |
|                           v                                                       |
|                     [ Fetcher Workers (Netty / HTTPClient) ]                      |
|                           |                                                       |
|                           +---> [ Local DNS Cache ]                               |
|                           |                                                       |
|                           v                                                       |
|                     [ HTML Document Content ]                                     |
|                           |                                                       |
|            +--------------+--------------+                                        |
|            |                             |                                        |
|            v                             v                                        |
|   [ Content Parser ]             [ Link Extractor ]                               |
|            |                             |                                        |
|            v                             v                                        |
|   [ SimHash Deduplication ]      [ Bloom Filter URL Seen? ]                       |
|   (Near-duplicate detection)             |                                        |
|            |                             v If Unseen                              |
|            v Saved to                    +---> Back into URL Frontier             |
|   [ Document Storage (Bigtable/S3) ]                                              |
|                                                                                   |
+-----------------------------------------------------------------------------------+', '', 'Q: How does the URL Frontier enforce domain politeness? A: By decoupling priority from execution. URLs for a specific domain are always routed to that domain''s dedicated FIFO queue. A worker thread pops a URL, performs the HTTP request, and records the timestamp. The queue is locked or placed in a delay wheel until the configured cooldown period (e.g. 1000ms) elapses.
Q: How do you detect if two web pages have virtually identical content despite different header timestamps and advertisements? A: Using the SimHash algorithm. SimHash produces a 64-bit fingerprint of the document''s content where similar documents produce fingerprints with very small Hamming distances (typically <= 3 bits differing), allowing near-duplicate detection in O(1) time.'),

('System Design', 'HLD', 'System 8: Distributed Rate Limiter (API Defense Tier)', 'Advanced', 'A Distributed Rate Limiter protects backend microservices against Denial of Service (DoS) attacks, brute force attempts, web scrapers, and cascading downstream failures by throttling incoming requests according to defined quotas (e.g. 100 requests per minute per IP/API Key).

The core technical challenge: In a distributed system with dozens of API Gateway instances, rate limiting counters must remain synchronized without introducing latency or race conditions.', '1. **Request Ingress**: Client request hits API Gateway -> Rate Limiter Filter intercepts `(client_ip, user_id, route)`.
2. **Key Generation**: Creates Redis key: `rate_limit:user:12345:api_v1`.
3. **Atomic Evaluation via Redis Lua Script**:
   - Executes Sliding Window Log: removes entries outside the 60-second window, checks remaining capacity, appends current timestamp, and sets TTL.
   - If count <= limit: returns `1` (Allowed) -> Request proceeds to backend service.
   - If count > limit: returns `0` (Blocked) -> Gateway returns HTTP 429 Too Many Requests with headers:
     `X-RateLimit-Limit: 100`
     `X-RateLimit-Remaining: 0`
     `Retry-After: 24`

## Rate Limiting Algorithm Comparison

| Algorithm | Pros | Cons |
| :--- | :--- | :--- |
| **Token Bucket** | Allows bursts; memory efficient (2 integers) | Distributed synchronization of refill timestamps |
| **Leaky Bucket** | Constant smooth output rate | Requests can back up in queue; delays traffic |
| **Fixed Window** | Low memory footprint | Burst vulnerability: 2x traffic allowed at window boundaries |
| **Sliding Window Log** | 100% accurate; zero boundary bursting | High memory consumption (stores timestamp per request) |

### Production Redis Lua Script (Sliding Window Log)
```lua
local rate_limit_key = KEYS[1]
local current_epoch = tonumber(ARGV[1])
local window_size = tonumber(ARGV[2])
local max_allowed = tonumber(ARGV[3])

-- 1. Evict entries older than the active window
local clear_boundary = current_epoch - window_size
redis.call(''ZREMRANGEBYSCORE'', rate_limit_key, 0, clear_boundary)

-- 2. Count requests in active window
local current_usage = redis.call(''ZCARD'', rate_limit_key)

if current_usage < max_allowed then
    -- 3. Log current request with unique member
    redis.call(''ZADD'', rate_limit_key, current_epoch, current_epoch .. ''-'' .. math.random(100000))
    redis.call(''EXPIRE'', rate_limit_key, math.ceil(window_size / 1000) + 1)
    return 1 -- Allowed
else
    return 0 -- Throttled
end
```', '+-----------------------------------------------------------------------------------+
|                        DISTRIBUTED RATE LIMITER ARCHITECTURE                      |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Client Request ]                                                               |
|        |                                                                          |
|        v                                                                          |
|  [ API Gateway (Envoy / Spring Cloud Gateway) ]                                   |
|        |                                                                          |
|        +---> [ Rate Limiter Middleware Filter ]                                   |
|                     |                                                             |
|                     | Atomic Lua Script Execution (`EVALSHA`)                     |
|                     v                                                             |
|              [ Redis Cluster (Master-Replica with Hash Tagging) ]                 |
|                     |                                                             |
|        +------------+------------+                                                |
|        |                         |                                                |
|   (Allowed: 1)              (Throttled: 0)                                        |
|        |                         |                                                |
|        v                         v                                                |
|  [ Backend Microservices ]  [ HTTP 429 Too Many Requests ]                        |
|                             Headers:                                              |
|                               X-RateLimit-Limit: 100                              |
|                               X-RateLimit-Remaining: 0                           |
|                               Retry-After: 35                                     |
|                                                                                   |
+-----------------------------------------------------------------------------------+', '', 'Q: Why is a Lua script necessary when implementing a rate limiter in Redis? A: A Redis Lua script executes atomically as a single command without interruption. Without Lua, separate `ZREMRANGEBYSCORE`, `ZCARD`, and `ZADD` commands would allow race conditions where two concurrent requests both read the counter below the threshold and both succeed, violating the rate limit.
Q: What happens if the Redis rate limiter cluster crashes? Should you Fail-Open or Fail-Closed? A: It depends on the endpoint. For core user browsing routes, fail-open to preserve user experience. For critical operations (payment processing, password resets, SMS OTP sending), fail-closed or fail to a local in-memory fallback to prevent catastrophic fraud.'),

('System Design', 'LLD', 'System 9: Distributed URL Shortener (TinyURL)', 'Intermediate', 'A low-level object-oriented design and complete Java implementation of a high-performance URL shortening engine.

The service converts long arbitrary URLs (up to 2048 chars) into compact 7-character alphanumeric aliases (`https://tiny.url/aZ9k1Qe`), supporting 3.52 Trillion unique short URLs ($62^7 = 3.52 \times 10^{12}$) without collisions.', '1. Server boots and requests an ID range chunk from ZooKeeper (e.g., `range_start = 1000000`, `range_end = 2000000`).
2. Incoming `shorten(longUrl)` increments an internal `AtomicLong`.
3. The atomic integer converts to a 7-character string using Base62 division and remainder operations.
4. Short URL is stored in cache/database and returned to the caller in < 2ms.

## Base62 Math & Character Alphabet

Alphabet: `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ` (Total 62 symbols).

For 7 characters:
$$62^7 = 3,521,614,606,208 \approx 3.52 \text{ Trillion unique URLs}$$

At 1,000 writes/second:
$$\frac{3.52 \times 10^{12}}{1000 \times 86400 \times 365} \approx 111 \text{ years of capacity}$$', '+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+', 'package com.system.lld.urlshortener;

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
}', 'Q: How do you prevent sequential URL enumeration attacks if Base62 encodes sequential numbers? A: Pass the sequential 64-bit ID through a reversible lightweight Feistel cipher or bit-permutation function before encoding to Base62. This scrambles the bits pseudo-randomly while preserving 100% collision-free uniqueness.'),

('System Design', 'LLD', 'System 10: In-Memory Thread-Safe LRU Cache with TTL', 'Advanced', 'A production-grade, thread-safe In-Memory Least Recently Used (LRU) Cache supporting constant time O(1) operations for `get` and `put`, paired with millisecond-precision Time-To-Live (TTL) expiration.

The core challenge: Java''s built-in `LinkedHashMap` is not thread-safe, and wrapping it in `Collections.synchronizedMap` creates coarse-grained locking bottlenecks under high concurrent read traffic.', '1. `get(key)` acquires ReadLock -> checks HashMap. If found and not expired, upgrades to WriteLock -> moves node to Head -> returns value.
2. `put(key, value, ttl)` acquires WriteLock -> if key exists, updates value and moves to Head.
3. If new key and capacity exceeded: tail node (least recently used) is unlinked from Doubly Linked List and removed from HashMap.
4. New node is inserted immediately following the dummy `head` sentinel.

## Node Structure & Doubly Linked List Sentinels

Using dummy `head` and `tail` sentinel nodes completely eliminates null-checks during boundary insertions and removals:

```
[Dummy HEAD] <---> [Node: Key A (MRU)] <---> [Node: Key B] <---> [Dummy TAIL] (LRU)
```

- When Node B is accessed:
  `detach(node)` -> `attachHead(node)` in $O(1)$ pointer operations.
- When capacity is full:
  `evictLRU()` removes `tail.prev` in $O(1)$ time.', '+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+', 'package com.system.lld.lrucache;

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
}', 'Q: Why does a standard LRU cache require a Doubly Linked List instead of a Singly Linked List? A: To remove a node from a linked list in O(1) time, you must update its predecessor''s next pointer (`node.prev.next = node.next`). In a singly-linked list, finding the predecessor requires an O(N) scan from the head.'),

('System Design', 'LLD', 'System 11: Multi-Elevator Dispatcher & Scheduler', 'Expert', 'An enterprise object-oriented design and multithreaded simulation of a multi-car elevator control system in a modern skyscraper.

The design implements the State Pattern for elevator movement transitions and the Strategy Pattern for pluggable scheduling algorithms (LOOK / SCAN vs Shortest-Seek Time).', '1. Passenger presses Hall Button on Floor 12 (Direction: UP).
2. `ElevatorController` queries all Elevator Cars -> computes a cost function for each car -> selects car with minimum cost.
3. Target car receives floor stop in its `TreeSet<Integer> upRequests` queue.
4. Elevator engine loops: advances floors, reaches Floor 12, transitions to `DOORS_OPEN`, halts for 3 seconds, transitions to `MOVING_UP`.

## Scheduling Algorithms: FCFS vs SCAN vs LOOK

- **FCFS**: First-Come-First-Serve. Highly inefficient thrashing.
- **SCAN (Elevator Algorithm)**: The car sweeps from bottom floor to top floor, reversing only at building boundaries.
- **LOOK Algorithm**: Like SCAN, but reverses immediately when there are no requests ahead, avoiding empty trips to the building roof.', '+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+', 'package com.system.lld.elevator;

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
}', 'Q: How does the LOOK algorithm differ from the SCAN elevator algorithm? A: The SCAN algorithm forces the elevator to travel all the way to the top and bottom floors of the building before reversing, even if no passengers are waiting there. The LOOK algorithm checks for pending requests ahead; if none exist, it immediately reverses direction, saving significant energy and time.'),

('System Design', 'LLD', 'System 13: Distributed Pub/Sub Messaging Engine', 'Advanced', 'A low-level object-oriented design and multithreaded Java implementation of an In-Memory Pub/Sub Messaging Engine.

The system decouples producers and consumers using the Observer Pattern, supporting dynamic topic subscription, broadcast fanout, and asynchronous subscriber worker thread isolation to prevent slow consumers from degrading publisher throughput.', '1. Producer publishes a message to Topic `order-created`.
2. Broker identifies all active `Subscriber` instances registered for `order-created`.
3. Broker dispatches an async task to each subscriber''s dedicated `ExecutorService` queue.
4. Publisher returns immediately without waiting for subscriber execution.

## Concurrency & Thread Isolation Model

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
```', '+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+', 'package com.system.lld.pubsub;

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
}', 'Q: What happens if a subscriber is extremely slow in an in-memory Pub/Sub engine? A: If subscribers run on isolated bounded thread pools, the slow subscriber''s task queue fills up. The broker must implement a backpressure or rejection policy (e.g. `CallerRunsPolicy` or dropping oldest messages) to prevent out-of-memory crashes while allowing fast subscribers to proceed uninterrupted.'),

('System Design', 'LLD', 'System 14: Snake and Ladder Multiplayer Game', 'Intermediate', 'A clean, modular, and extensible object-oriented implementation of the classic Snake and Ladder multiplayer board game in Java.

The design adheres to Single Responsibility Principle (SRP) and Open/Closed Principle (OCP), supporting arbitrary board sizes (100+ cells), customizable snakes and ladders, multiple dice, and pluggable dice-rolling strategies.', '1. Board initializes with cells 1 to 100. Snakes (head -> tail) and Ladders (base -> top) are registered as `Jump` objects.
2. Players are placed in a FIFO `ArrayDeque<Player>`.
3. Game Loop pops current player -> rolls dice -> computes new position.
4. If new position has a Snake or Ladder, position updates automatically.
5. If new position == 100: Player declared Winner! Otherwise, player rejoins back of queue.

## Board & Jump Entity Relationship

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
A player must land **exactly** on the final cell (e.g. 100). If `current_pos + roll > 100`, the move is invalid and the player remains in place.', '+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+', 'package com.system.lld.snakeladder;

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
}', 'Q: How would you prevent infinite cycles when placing snakes and ladders on the board? A: Model the board as a Directed Graph where cells are vertices and jumps are directed edges. Before adding a snake or ladder, run a cycle-detection algorithm (Depth-First Search with recursion stack tracking); if adding the edge creates a cycle, reject the placement.'),

('System Design', 'LLD', 'System 15: Concurrency-Safe Movie Ticket Reservation (BookMyShow)', 'Expert', 'A low-level object-oriented design and multithreaded Java implementation of a high-concurrency Movie Ticket Booking System (like BookMyShow / Ticketmaster).

The core technical challenge: During blockbuster flash sales (e.g. Avengers opening weekend), thousands of concurrent users click the exact same front-row seat simultaneously. The system must guarantee that zero double-bookings occur without deadlocking database rows.', '1. User selects Seat A1 and A2 for Show #501.
2. System executes atomic reservation check: `seat.lock(userId, 600000ms)`.
3. If atomic CAS succeeds: seats become `LOCKED` to User for 10 minutes. A timer is scheduled.
4. User enters payment gateway -> Payment succeeds -> `seat.confirmBooking(userId)` permanently commits the seats.
5. If payment fails or cancels -> `seat.releaseLock(userId)` unlocks seats instantly for other waiting users.

## Seat State Lifecycle Machine

```
               [ AVAILABLE ]
                     |
                     | 1. Temporary Lock (Atomic CAS)
                     v
                 [ LOCKED ]
                 /        \
   2a. Payment  /          \ 2b. Payment Fails / Timeout (10 min)
      Succeeds /            \
              v              v
         [ BOOKED ]    [ AVAILABLE ]
        (Permanent)     (Re-released)
```

### Database Concurrency Control (SQL)
```sql
-- Atomic lock acquisition with optimistic version check
UPDATE show_seats 
SET status = ''LOCKED'', locked_by = :userId, locked_at = NOW(), version = version + 1
WHERE id = :seatId 
  AND status = ''AVAILABLE'' 
  AND version = :expectedVersion;
```', '+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+', 'package com.system.lld.bookmyshow;

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
}', 'Q: How do you prevent deadlocks when a user tries to book seats [A1, A2] while another user tries to book seats [A2, A1]? A: Always enforce a canonical global lock acquisition order. By sorting the requested seat IDs alphabetically before acquiring locks (both threads acquire A1 first, then A2), circular wait conditions are mathematically impossible, completely eliminating deadlocks.'),

('Programming', 'Java', 'JVM Architecture', 'Advanced',
'The JVM (Java Virtual Machine) is an abstract computing machine that enables a computer to run a Java program.',
'Deep Dive: It consists of ClassLoader, Runtime Data Areas (Method Area, Heap, Stack, PC Register, Native Method Stack), and the Execution Engine (Interpreter, JIT Compiler, Garbage Collector).',
'Architecture Component Flow: .java -> javac -> .class -> ClassLoader -> Memory -> Execution Engine.',
'// JVM manages this internally, but understanding -Xmx and -Xms is key.',
'Q: Difference between Stack and Heap? A: Stack is thread-local and stores primitives/references. Heap is global and stores objects.');
