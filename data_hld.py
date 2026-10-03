# HLD Systems Data extracted from self.pdf

HLD_TOPICS = [
    {
        "id": "hld-netflix",
        "title": "System 1: Netflix (Global Video Streaming System)",
        "subject": "System Design",
        "category": "HLD",
        "difficulty": "Expert",
        "estimatedTime": "60 min",
        "tags": ["Streaming", "CDN", "Open Connect", "Cassandra", "Microservices", "Adaptive Bitrate"],
        "what": """Netflix is a planetary-scale video-on-demand platform serving personalized streaming to over 100M Daily Active Users and 15M concurrent peak streams. 

The architecture separates control-plane operations (sign-up, search, billing, recommendation, user profiles) from the data-plane (delivering petabits of video chunks per second). The data-plane operates completely outside AWS using Netflix Open Connect—a custom globally distributed Content Delivery Network of physical Open Connect Appliances (OCAs) deployed directly inside thousands of ISP data centers worldwide.""",
        "why": """Delivering video at 45 Tbps peak bandwidth across global public transit networks is economically impossible and results in unacceptable buffering and packet loss.

1. **Edge Locality (Open Connect)**: Deploying OCAs directly inside consumer ISPs eliminates long-haul transit costs and brings 95%+ of video bytes within 1 network hop of the subscriber.
2. **Adaptive Bitrate Streaming (ABR)**: Dynamic switching between bitrates (HLS / MPEG-DASH chunks) matches real-time user bandwidth and avoids buffering.
3. **High Write Throughput (Cassandra)**: Millions of video heartbeat updates per minute (tracking resume positions) require masterless, write-optimized distributed databases.
4. **Resilience & Chaos Engineering**: Control plane runs in multi-region AWS with active-active failover.""",
        "how": """1. **Master Ingestion & Transcoding**: Studio masters uploaded to Amazon S3. The Transcoding Pipeline splits raw video into thousands of chunks, encoding each into hundreds of profiles (resolutions 360p to 4K, codecs H.264, HEVC, AV1) based on device profiles.
2. **Proactive CDN Push**: During off-peak night hours, new titles are pre-cached across global OCA servers based on regional machine learning predictive demand models.
3. **Playback Initiation**: Client app hits API Gateway (Zuul/Spring Cloud) -> Playback Authorization Service -> Returns manifest file (.m3u8 / .mpd) listing chunk URLs pointing to the optimal local OCA.
4. **Playback & Telemetry**: Client requests 2-10 second video chunks via HTTP GET over TLS. A background heartbeat sends playback telemetry every 10 seconds to Kafka -> Cassandra.""",
        "internals": """## Storage & Data Tier Architecture

### 1. Playback State Tracking (Cassandra)
Cassandra handles bookmark positions with append-only write speed:
```sql
CREATE KEYSPACE netflix_streaming WITH replication = {
  'class': 'NetworkTopologyStrategy',
  'us-east': 3,
  'eu-west': 3
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
- Chunks are typically 2 to 6 seconds long. Client algorithms (BBA - Buffer-Based Algorithm) monitor buffer fill level to step up or down bitrate ladders.""",
        "architecture": """+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+""",
        "realWorld": "Netflix runs >17,000 Open Connect appliances deployed across 150+ countries. During the Squid Game Season 1 premiere, OCA caches absorbed over 98% of all video traffic, shielding AWS transit completely.",
        "advantages": [
            "Near-zero buffering through local ISP edge caching",
            "Linear write scaling for viewing history via Cassandra",
            "Optimal bandwidth efficiency using per-title and per-shot encoding",
            "Zero single points of failure via multi-region active-active deployment"
        ],
        "disadvantages": [
            "Extremely high infrastructure capex for custom OCA hardware",
            "High transcoding compute cost (hundreds of profiles per video title)",
            "Eventual consistency in Cassandra can cause slight delay in resume position across different devices"
        ],
        "tradeoffs": "Edge Caching (High Hardware Cost + Operational ISP Partnerships) vs Transit Bandwidth (Prohibitive recurring cloud egress costs). Netflix chose custom hardware to drop egress bandwidth costs to near-zero.",
        "alternatives": ["Akamai / Cloudflare CDN", "HLS Live Packaging", "Centralized Origin Server Architecture"],
        "whenToUse": "Global video-on-demand platforms with millions of concurrent viewers, large media catalogs, and predictable regional viewing patterns.",
        "whenNotToUse": "Small-scale streaming apps (<10k users) or low-latency sub-second live streaming (e.g. interactive webinars, Twitch gaming chat) where WebRTC or SRT is required.",
        "commonMistakes": [
            "Attempting to stream video directly from application servers instead of CDNs",
            "Using relational DB transactions for high-frequency video playback heartbeat updates",
            "Encoding single bitrate files instead of multi-bitrate ladder chunks"
        ],
        "interviewQuestions": [
            {
                "q": "How does Netflix achieve 99.999% availability for video playback if AWS has an outage?",
                "a": "Control plane operations (search, recommendation, login) are deployed across multiple AWS regions with Eureka/Zuul global traffic routing. Video streaming itself runs on ISP Open Connect appliances independently of AWS; if AWS experiences an outage, ongoing and newly initiated streams continue playing from OCA caches."
            },
            {
                "q": "Why is Cassandra preferred over PostgreSQL for playback state bookmarking?",
                "a": "With 15M concurrent streams sending state updates every 10 seconds, write throughput exceeds 1.5M writes/sec. Cassandra's LSM-tree architecture performs sequential append-only disk writes without locks, scaling horizontally across nodes."
            },
            {
                "q": "How does Adaptive Bitrate (ABR) streaming work under network congestion?",
                "a": "The client video player continuously measures the buffer occupancy and HTTP chunk download speeds. If buffer depletion accelerates, the player immediately requests the next 2-second chunk from a lower bitrate track specified in the manifest."
            }
        ],
        "resources": [
            {"title": "Netflix Open Connect Overview", "url": "https://openconnect.netflix.com/", "type": "docs"},
            {"title": "A Day in the Life of a Netflix Video", "url": "https://netflixtechblog.com", "type": "article"}
        ],
        "relatedTopics": ["hld-youtube", "kafka", "caching-strategies", "consistent-hashing"]
    },
    {
        "id": "hld-uber",
        "title": "System 2: Uber / Grab (Geospatial Ride Dispatch Platform)",
        "subject": "System Design",
        "category": "HLD",
        "difficulty": "Expert",
        "estimatedTime": "60 min",
        "tags": ["Geospatial", "H3", "WebSocket", "Redis", "Kafka", "Ride Matching"],
        "what": """Uber/Grab is a hyper-real-time geospatial dispatch and matching engine. The platform ingests continuous GPS coordinates from millions of active drivers every 4 seconds, tracks trip states, calculates dynamic surge pricing, and matches rider requests to nearby drivers in under 1 second.

Key technical challenge: Spatial radius queries over fast-moving objects cannot be executed on traditional R-Tree or relational indexes without crippling locking and write contention.""",
        "why": """Relational geospatial queries (`ST_DWithin` on PostGIS) fail at 1M writes/sec because every driver location update triggers B-Tree/R-Tree index rebalancing.

1. **H3 Hexagonal Hierarchical Spatial Index**: Uber partitions the globe into discrete hexagonal cells. Hexagons have the property that all 6 neighbors are equidistant, simplifying radius expansion and neighbor searches.
2. **In-Memory Geospatial Tier**: Driver locations update in Redis geospatial or memory rings rather than persistent disks.
3. **Bidirectional Low-Latency Ingress**: WebSockets and Netty maintain persistent socket connections with active driver and rider apps.""",
        "how": """1. **Location Ingestion**: Driver sends `(lat, lon, driver_id, status)` every 4s via WebSocket -> Netty Location Ingestion Service -> Kafka `driver-locations` topic.
2. **H3 Cell Indexing**: Location Worker consumes Kafka event, computes H3 index at resolution 8 (cell area ~0.74 km2), and writes to Redis geospatial cluster:
   `HSET driver:locations:<h3_index> <driver_id> <coords_timestamp>`
3. **Ride Request & Matching**: Rider requests ride -> Dispatch Service determines rider's H3 cell -> expands outward through rings (`kRing(h3_index, k)`) -> filters active available drivers within ETA threshold -> runs Hungarian matching algorithm -> sends dispatch notification to top driver.""",
        "internals": """## Geospatial H3 Indexing vs Geohash

| Metric | Geohash (Rectangular) | Uber H3 (Hexagonal) |
| :--- | :--- | :--- |
| Shape | Square / Rectangle | Regular Hexagon |
| Neighbor Distance | Unequal (orthogonal vs diagonal) | Equidistant (all 6 neighbors exactly equidistant) |
| Distortion at poles | High distortion | Uniform across globe (icosahedron projection) |
| Radius expansion | Complex edge artifacts | Uniform expansion (`kRing(cell, 1)` = 6 cells) |

### Dispatch Flow & Concurrency
When a driver is offered a trip, an atomic distributed lock (Redis Redlock or CAS) reserves the driver for 15 seconds to prevent race conditions from concurrent ride requests.""",
        "architecture": """+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+""",
        "realWorld": "Uber processes over 30 billion location pings per day using H3 resolution 8 cells for dispatch and resolution 6 for surge pricing calculations.",
        "advantages": [
            "Sub-second driver matching using O(1) in-memory hexagonal cell lookups",
            "Zero database disk I/O on location updates by using memory-only Redis clusters",
            "Uniform distance neighbor searches with zero directional distortion"
        ],
        "disadvantages": [
            "Redis memory footprint grows with millions of active global drivers",
            "Complex handoff when drivers hover on boundaries between adjacent H3 hexagons"
        ],
        "tradeoffs": "In-Memory Ephemeral Storage (Redis) vs Persistent Disk (PostgreSQL/PostGIS). Since GPS coordinates become stale after 4 seconds, persistence is unnecessary for dispatch; raw events are archived in cold storage (Parquet/HDFS) for dispute resolution.",
        "alternatives": ["Google S2 Geometry (Spherical Quadtree)", "Geohash", "PostGIS R-Tree"],
        "whenToUse": "Real-time fleet tracking, ride hailing, on-demand courier dispatch, micro-mobility location matching.",
        "whenNotToUse": "Static spatial indexing (e.g. real estate listings or store locators) where traditional PostGIS R-Tree with spatial indexing is simpler and more cost-effective.",
        "commonMistakes": [
            "Writing driver GPS updates directly to relational databases with ACID transactions",
            "Using square bounding boxes which cause radius search distortion at diagonals",
            "Not handling concurrent dispatches where two riders receive the same driver offer"
        ],
        "interviewQuestions": [
            {
                "q": "Why does Uber use Hexagons (H3) instead of Squares (Geohash)?",
                "a": "A regular hexagon has only one distance between its center and the centers of all 6 immediate neighbors. Squares have two distinct neighbor distances (orthogonal is 1, diagonal is sqrt(2)). This property makes trajectory smoothing, radius expansion, and cluster aggregation mathematically uniform."
            },
            {
                "q": "How do you prevent two nearby riders from being matched with the same driver?",
                "a": "When the matching engine selects an eligible driver, it executes an atomic `SET driver:lock:<id> rider_id NX PX 15000` in Redis. If successful, the driver is locked and offered the trip for 15 seconds. If rejected or timed out, the lock expires."
            }
        ],
        "resources": [
            {"title": "H3: Uber's Hexagonal Hierarchical Spatial Index", "url": "https://eng.uber.com/h3/", "type": "article"}
        ],
        "relatedTopics": ["redis-concurrency", "consistent-hashing", "kafka", "comm-protocols"]
    },
    {
        "id": "hld-food-delivery",
        "title": "System 3: Food Delivery Platform (DoorDash / Swiggy / Zomato)",
        "subject": "System Design",
        "category": "HLD",
        "difficulty": "Expert",
        "estimatedTime": "50 min",
        "tags": ["Saga Pattern", "Microservices", "Event-Driven", "Kafka", "Distributed Transactions"],
        "what": """Food delivery platforms orchestrate a complex 3-sided marketplace: Customers, Restaurants/Merchants, and Delivery Delivery Partners. 

Unlike e-commerce where items ship asynchronously in 2-3 days, food delivery requires real-time coordination across physical fulfillment, inventory validation, card authorization, preparation timers, and driver dispatch within a 30-45 minute window.

The primary architectural challenge is managing distributed state across independent microservices without distributed locks (Two-Phase Commit).""",
        "why": """A single order spans 5 separate microservices (Order, Payment, Restaurant, Inventory, Delivery). If payment succeeds but the restaurant rejects the order (kitchen closed), money must be refunded and the driver canceled.

1. **Saga Pattern (Orchestration)**: Coordinates multi-service workflows with compensating transactions when failures occur.
2. **Real-Time Kitchen Order Tickets (KOT)**: WebSockets and push notifications alert merchant tablets instantly.
3. **Dynamic Delivery Assignment**: Combines batch matching with driver pickup route optimization.""",
        "how": """1. **Checkout & Reservation**: Customer clicks Place Order -> Order Service creates order in state `PENDING_PAYMENT` -> invokes Saga Orchestrator.
2. **Saga Orchestrator Workflow**:
   - Step 1: Call Payment Service -> Authorize credit card charge -> Success.
   - Step 2: Call Restaurant Service -> Send order to restaurant tablet -> Restaurant accepts -> Success.
   - Step 3: Call Delivery Dispatch Service -> Find & allocate nearby delivery partner.
3. **Compensating Transactions on Failure**:
   - If Restaurant Service rejects: Saga Orchestrator executes compensating transaction: calls Payment Service `refundPayment(tx_id)` -> marks Order `CANCELLED_BY_RESTAURANT` -> notifies user.""",
        "internals": """## Saga Orchestration State Machine

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
```""",
        "architecture": """+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+""",
        "realWorld": "DoorDash processes tens of thousands of simultaneous orders during peak lunch and dinner hours using Temporal / Cadence workflow engines to run Saga orchestrators with zero state loss.",
        "advantages": [
            "Data consistency across microservices without blocking distributed locks",
            "Clear observability into failure points and compensation workflows",
            "Loose coupling between independent engineering domain services"
        ],
        "disadvantages": [
            "Complex mental model and testing requirements for compensating transactions",
            "Eventual consistency: customers may see momentary pending states"
        ],
        "tradeoffs": "Orchestrated Saga (Centralized coordinator service) vs Choreographed Saga (Event-driven broadcast). Orchestration was chosen because order status requires strict centralized auditing and timeouts.",
        "alternatives": ["Two-Phase Commit (2PC - too slow/blocking)", "Choreographed Event Sourcing"],
        "whenToUse": "Multi-step e-commerce, food delivery, hotel/flight booking where operations span independent database boundaries.",
        "whenNotToUse": "Monolithic architectures where a single database transaction (`BEGIN ... COMMIT`) suffices.",
        "commonMistakes": [
            "Not designing idempotent compensating transactions (e.g. issuing double refunds if retry executes)",
            "Using Two-Phase Commit over microservices across WAN/cloud networks"
        ],
        "interviewQuestions": [
            {
                "q": "What happens in the Saga pattern if a compensating transaction fails?",
                "a": "Compensating transactions must be idempotent and retryable indefinitely. If transient network errors occur, the orchestrator retries with exponential backoff. If permanent failure occurs, the order drops into a Dead Letter Queue (DLQ) for human operator reconciliation."
            },
            {
                "q": "Why is 2PC (Two-Phase Commit) unsuitable for food delivery microservices?",
                "a": "2PC is a blocking protocol. If the coordinator or any participant crashes during the prepare phase, locks remain held on all databases, starving the system of throughput."
            }
        ],
        "resources": [
            {"title": "Pattern: Saga - Microservices.io", "url": "https://microservices.io/patterns/data/saga.html", "type": "article"}
        ],
        "relatedTopics": ["distributed-transactions", "kafka", "postgres-jsonb-mvcc", "hld-uber"]
    },
    {
        "id": "hld-whatsapp",
        "title": "System 4: WhatsApp / Telegram (End-to-End Encrypted Chat)",
        "subject": "System Design",
        "category": "HLD",
        "difficulty": "Expert",
        "estimatedTime": "60 min",
        "tags": ["Messaging", "WebSockets", "Signal Protocol", "E2EE", "Netty", "Cassandra"],
        "what": """WhatsApp / Telegram is a global messaging platform delivering over 100 Billion messages per day to 2 Billion active users with sub-100ms latency and End-to-End Encryption (E2EE).

The server architecture acts as an untrusted blind message router: the server cannot read message contents, group texts, or media files. Once a message is delivered to the recipient device, it is permanently deleted from server memory and disk.""",
        "why": """Maintaining 2 Billion concurrent connections while ensuring zero eavesdropping and instant delivery requires:

1. **Massive Connection Density**: Erlang/Elixir BEAM or Java Netty handling millions of concurrent persistent TCP/WebSocket connections per server node.
2. **Signal Protocol (E2EE)**: Extended Triple Diffie-Hellman (X3DH) for asynchronous key exchange and Double Ratchet Algorithm for forward secrecy and post-compromise security.
3. **Store-and-Forward**: Ephemeral queuing for offline users; messages evaporate from the server the moment receipt ack is received.""",
        "how": """1. **Connection Handshake**: Client establishes persistent TLS/WebSocket session to a Chat Gateway server. Session mapped in Redis: `user_id -> gateway_node_ip`.
2. **Message Transmission**: User A drafts message for User B. User A's device encrypts the plaintext using User B's ratchet key. The ciphertext is sent to Chat Gateway over socket.
3. **Routing**:
   - If User B is Online: Gateway queries Redis session store -> forwards ciphertext directly down User B's active socket -> User B device decrypts and replies with delivery ACK.
   - If User B is Offline: Gateway stores ciphertext in ephemeral offline store (Cassandra or Mnesia). When User B reconnects, pending messages are drained and deleted.""",
        "internals": """## Cryptographic Architecture (Signal Protocol)

- **X3DH (Extended Triple Diffie-Hellman)**: Allows establishing shared secrets even when the recipient is offline by pre-publishing signed one-time prekeys to the key server.
- **Double Ratchet Algorithm**: Combines a Diffie-Hellman ratchet and a Symmetric KDF ratchet. Every single message produces a brand-new single-use symmetric encryption key.
- **Forward Secrecy**: Compromising current keys does not allow decrypting past messages.
- **Break-in Recovery**: An attacker with compromised keys cannot decrypt future messages once a new DH ratchet step occurs.""",
        "architecture": """+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+""",
        "realWorld": "WhatsApp operates with a lean server footprint (~hundreds of servers for billions of users) because servers do not store chat histories—chats live exclusively on user devices.",
        "advantages": [
            "Mathematical privacy: impossible for servers or eavesdroppers to decrypt chats",
            "Extremely low storage footprint due to store-and-forward deletion",
            "High concurrency: 2M+ persistent sockets per Erlang/Netty node"
        ],
        "disadvantages": [
            "Multi-device synchronization requires complex key ratchets per device",
            "Media backups must be encrypted separately and managed by user cloud storage"
        ],
        "tradeoffs": "Store-and-Forward (Ephemeral server storage) vs Persistent Cloud History (Slack / Discord). WhatsApp prioritizes user privacy and low infrastructure storage cost over infinite server-side search.",
        "alternatives": ["Matrix Protocol", "XMPP", "WebRTC Data Channels"],
        "whenToUse": "Private secure communications, enterprise confidential messaging, banking chat integrations.",
        "whenNotToUse": "Team collaboration tools (Slack, Teams) requiring persistent searchable historical archives and multi-year auditing compliance.",
        "commonMistakes": [
            "Storing private keys on the server instead of secure enclave / keychain on client devices",
            "Retaining delivered message payloads in databases indefinitely",
            "Using polling instead of persistent bidirectional WebSockets"
        ],
        "interviewQuestions": [
            {
                "q": "How does WhatsApp support sending messages to users who are currently offline?",
                "a": "Via X3DH pre-keys. The recipient publishes signed one-time public pre-keys to the server in advance. The sender fetches a pre-key, computes the shared master secret locally, encrypts the message, and sends it to the server. The server holds the ciphertext in an ephemeral queue until the recipient connects."
            },
            {
                "q": "What is Forward Secrecy in the Double Ratchet algorithm?",
                "a": "Forward Secrecy ensures that if an attacker compromises the device's current encryption keys today, they still cannot decrypt any previously recorded past messages, because every message used a unique ephemeral key that was immediately erased from memory after derivation."
            }
        ],
        "resources": [
            {"title": "The Double Ratchet Algorithm", "url": "https://signal.org/docs/specifications/doubleratchet/", "type": "docs"}
        ],
        "relatedTopics": ["comm-protocols", "redis-concurrency", "consistent-hashing", "caching-strategies"]
    },
    {
        "id": "hld-twitter",
        "title": "System 5: Twitter / X (Timeline Generation & Fanout Engine)",
        "subject": "System Design",
        "category": "HLD",
        "difficulty": "Advanced",
        "estimatedTime": "50 min",
        "tags": ["Timeline", "Fanout", "Redis", "Kafka", "Social Graph", "Hybrid Model"],
        "what": """Twitter / X is a real-time microblogging and social networking service handling 500 Million tweets posted per day and over 300 Billion timeline reads per day.

The core engineering hurdle is the extreme read-to-write ratio (~600:1) and the Celebrity / Hotspot problem (e.g. an account with 100M+ followers posting a tweet).""",
        "why": """Naive database querying (`SELECT * FROM tweets WHERE user_id IN (SELECT following_id FROM follows WHERE user_id = ?) ORDER BY created_at DESC LIMIT 20`) creates massive disk I/O and crashes under load.

1. **Pre-computed Timelines (Fanout-on-Write / Push)**: When a normal user tweets, write the tweet ID directly into the Redis Home Timeline lists of all their followers.
2. **On-Demand Merging (Fanout-on-Read / Pull)**: For celebrity users (>25k followers), do not push to 100M timelines. Instead, merge their tweets in-memory only when followers open the app.
3. **Hybrid Fanout Engine**: Balances write amplification against read latency.""",
        "how": """1. **Tweet Ingestion**: User tweets -> Tweet Service stores tweet metadata in Manhattan / PostgreSQL and broadcasts event to Kafka `tweet-events`.
2. **Fanout Service**:
   - Queries Social Graph Service (FlockDB) to fetch author's follower list.
   - If author is standard user (<25,000 followers): Pushes `tweet_id` into Redis Home Timeline lists (`LPUSH timeline:<follower_id> <tweet_id>`).
   - If author is celebrity (>25,000 followers): Skips push fanout.
3. **Home Timeline Read**: User opens app -> Timeline Service retrieves user's Redis list -> fetches celebrity tweets -> runs in-memory multi-way merge sort -> populates user feed in < 50ms.""",
        "internals": """## Push vs Pull vs Hybrid Trade-Off Matrix

| Strategy | Write Cost | Read Cost | Celebrity Problem |
| :--- | :--- | :--- | :--- |
| **Fanout-on-Write (Push)** | Massive ($O(N)$ writes per tweet) | Minimal ($O(1)$ read from Redis) | Severe write amplification (100M Redis pushes per tweet) |
| **Fanout-on-Read (Pull)** | Minimal ($O(1)$ write) | Heavy ($O(F)$ DB scans + merge) | Terrible read latency for users following many accounts |
| **Hybrid (Twitter Standard)** | Low ($O(N)$ for normal users) | Fast ($O(1)$ + merge top-k celebrity tweets) | Eliminated by skipping push for accounts with >25k followers |

### Redis Timeline Data Structure
Timelines are stored as Redis lists of tweet IDs capped at 800 items:
`LPUSH timeline:user_123 9876543210`
`LTRIM timeline:user_123 0 799`""",
        "architecture": """+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+""",
        "realWorld": "When Barack Obama or Elon Musk tweets, Twitter avoids executing 100M+ concurrent Redis writes by relying entirely on the hybrid pull path.",
        "advantages": [
            "Sub-50ms feed rendering for hundreds of millions of users",
            "Eliminates write amplification bottlenecks during breaking news events",
            "Caps memory overhead by trimming Redis timeline lists to top 800 entries"
        ],
        "disadvantages": [
            "High Redis RAM requirements for active user timeline caches",
            "Cold user startup: inactive users returning after months require on-demand rebuilding"
        ],
        "tradeoffs": "Memory usage (caching timelines in RAM) vs Compute latency (calculating timelines on DB query). Twitter spends RAM on Redis to ensure blazing fast reads.",
        "alternatives": ["Full Push (Weibo)", "Full Pull (Tumblr / Facebook original)", "Search-based Feed (Elasticsearch)"],
        "whenToUse": "Social media feeds, activity streams, real-time subscriber notification walls.",
        "whenNotToUse": "Small private messaging groups or forums where read/write ratios are balanced.",
        "commonMistakes": [
            "Applying pure Fanout-on-Write to celebrity accounts",
            "Storing full tweet text and user JSON inside the Redis timeline list instead of just 64-bit tweet IDs",
            "Allowing unbounded Redis list growth instead of capping at 800 items"
        ],
        "interviewQuestions": [
            {
                "q": "Why store only tweet IDs in Redis instead of full tweet JSON?",
                "a": "Memory efficiency and data freshness. If a user edits or deletes a tweet, storing only 64-bit integer IDs means the update happens in one place (the Tweet entity store). Followers' feeds fetch the ID and hydrate it from cache, preventing stale or inconsistent edits."
            },
            {
                "q": "How do you handle inactive users who haven't logged in for 6 months?",
                "a": "Their Redis timeline cache is evicted based on TTL. When they eventually log back in, an async worker re-materializes their timeline on-demand by querying the database for their followed accounts' recent tweets."
            }
        ],
        "resources": [
            {"title": "Timelines at Scale - Twitter Engineering", "url": "https://blog.x.com/engineering", "type": "article"}
        ],
        "relatedTopics": ["redis-concurrency", "caching-strategies", "kafka", "consistent-hashing"]
    },
    {
        "id": "hld-youtube",
        "title": "System 6: YouTube / TikTok (Video Ingestion & Recommendation)",
        "subject": "System Design",
        "category": "HLD",
        "difficulty": "Expert",
        "estimatedTime": "60 min",
        "tags": ["Video", "Transcoding", "DAG", "Chunking", "CDN", "Recommendation"],
        "what": """YouTube / TikTok is a global video sharing platform ingesting over 500 hours of video every minute, serving billions of daily views, and executing ML-based recommendation ranking in real-time.

Key architectural challenges: Resumable chunked file uploading over unreliable connections, distributed Directed Acyclic Graph (DAG) video transcoding, and low-latency global CDN edge delivery.""",
        "why": """Uploading and processing multi-gigabyte video files sequentially on single servers causes timeout failures, memory exhaustion, and hours of processing delay.

1. **Resumable Multipart Uploads**: Uploading 10MB byte chunks directly to object storage (Amazon S3 / GCS) via presigned URLs ensures dropped mobile connections resume without restart.
2. **DAG Transcoding Pipeline**: Video is demuxed into audio and video streams, split into 5-second GOP (Group of Pictures) chunks, and transcoded in parallel across thousands of worker containers.
3. **Adaptive CDN Delivery**: Manifest generation for HLS/DASH streaming across edge nodes.""",
        "how": """1. **Initiate Upload**: Client sends `POST /api/v1/videos/uploads/initiate` -> API Gateway returns `upload_id` and presigned S3 URLs for individual parts.
2. **Parallel Chunk Upload**: Client uploads 10MB chunks in parallel. S3 triggers an event notification upon completion.
3. **DAG Transcoding**:
   - Master chunk merges in temporary storage.
   - Transcoding Scheduler splits video into chunks and schedules tasks: Resolution Scaling (4K -> 1080p -> 720p -> 360p), Audio extraction, Watermarking, Thumbnail extraction.
4. **Publish & Recommendation**: Metadata is saved to Spanner / PostgreSQL; video embeddings enter Vector DB for candidate generation in the feed.""",
        "internals": """## Video DAG Transcoding Pipeline

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
```""",
        "architecture": """+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+""",
        "realWorld": "YouTube processes over 500 hours of video every single minute by distributing GOP chunk transcoding across tens of thousands of Borg containers.",
        "advantages": [
            "Failure resilience: failing a single 5s chunk transcoding task retries only that chunk, not the full 2-hour movie",
            "Optimal bandwidth utilization: clients upload directly to object storage, bypassing API web servers",
            "Broad device compatibility via multi-codec manifest packaging"
        ],
        "disadvantages": [
            "Massive storage footprint: storing dozens of resolutions and codec profiles per video multiplies raw size by 5-10x",
            "Complex orchestration of DAG task dependencies"
        ],
        "tradeoffs": "Pre-encoding all resolutions (High Compute & Storage Cost, Instant Playback) vs Just-in-Time Transcoding (Lower Storage, Unacceptable initial playback latency). YouTube pre-encodes common profiles for high-demand videos.",
        "alternatives": ["AWS Elemental MediaConvert", "FFmpeg on EC2 instances", "P2P WebTorrent"],
        "whenToUse": "User-generated content (UGC) video platforms, course video platforms, corporate media repositories.",
        "whenNotToUse": "Ultra-low-latency real-time video communications (Zoom, Google Meet) where sub-second latency requires WebRTC rather than chunked file transcoding.",
        "commonMistakes": [
            "Routing gigabyte video uploads through API web servers instead of direct-to-S3 presigned URLs",
            "Transcoding entire video files in single monolithic processes without chunking"
        ],
        "interviewQuestions": [
            {
                "q": "Why upload chunks directly to S3 via presigned URLs instead of through the application server?",
                "a": "Direct-to-storage upload removes heavy I/O and network saturation from API web servers, allowing them to remain lightweight stateless services. S3 handles scalable concurrent ingest and byte integrity validation natively."
            },
            {
                "q": "What is a GOP (Group of Pictures) and why is it important for video chunking?",
                "a": "A GOP is a sequence of frames that begins with an I-frame (keyframe containing complete picture information) followed by P and B frames (predictive deltas). Videos can only be cleanly split at I-frame boundaries without causing visual distortion or corrupting decoding state."
            }
        ],
        "resources": [
            {"title": "Designing Video Transcoding Pipelines", "url": "https://netflixtechblog.com", "type": "article"}
        ],
        "relatedTopics": ["hld-netflix", "kafka", "caching-strategies", "consistent-hashing"]
    },
    {
        "id": "hld-web-crawler",
        "title": "System 7: Distributed Web Crawler (Search Engine Scale)",
        "subject": "System Design",
        "category": "HLD",
        "difficulty": "Expert",
        "estimatedTime": "60 min",
        "tags": ["Crawler", "URL Frontier", "SimHash", "Politeness", "Deduplication", "Bloom Filter"],
        "what": """A Distributed Web Crawler discovers, fetches, and indexes billions of web pages across the public internet for search engines (like Google) or LLM training datasets (Common Crawl).

Key engineering challenges: Obeying politeness constraints (preventing DDoS against target hosts), deduplicating trillions of URLs and page contents, and optimizing crawl throughput across dynamic network conditions.""",
        "why": """Naively spawning threads to fetch URLs creates immediate cascading failures: crawling a small site with 1,000 threads crashes their web server, while duplicate URLs (circular links, calendar traps) consume infinite disk and memory.

1. **Politeness & Priority (Two-Tier URL Frontier)**: Separates prioritization (crawling important pages first) from politeness (queuing by host with rate limiting).
2. **Bloom Filters for URL Deduplication**: In-memory probabilistic membership checks avoid millions of DB disk lookups.
3. **SimHash Content Fingerprinting**: Detects near-duplicate web pages (e.g. same article with different ads/timestamps).""",
        "how": """1. **URL Frontier Ingestion**: Seed URLs enter Priority Queues (based on PageRank) -> routed to Politeness Queues (one FIFO queue per target hostname domain).
2. **Worker Fetching**: Politeness Worker pulls URL, verifies `robots.txt` compliance, waits for domain rate-limit cooldown, and executes HTTP GET via DNS Resolver cache.
3. **Parsing & Deduplication**:
   - Extracted text is hashed with 64-bit SimHash. If Hamming distance with existing fingerprints is < 3, the page is discarded as duplicate.
   - Newly discovered links are checked against a Distributed Bloom Filter; unseen URLs are added to the Frontier.""",
        "internals": """## URL Frontier: Priority vs Politeness Architecture

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
5. Two pages are near-duplicates if Hamming distance is <= 3.""",
        "architecture": """+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+""",
        "realWorld": "Google and Common Crawl utilize distributed URL frontiers managing tens of billions of URLs with Bloom filters occupying just a few gigabytes of RAM.",
        "advantages": [
            "Guarantees politeness: never overloads a target host with concurrent requests",
            "99.9% deduplication efficiency using compact Bloom filters and SimHash",
            "Handles spider traps and infinite calendar loops through depth and count caps"
        ],
        "disadvantages": [
            "Dynamic client-rendered Single Page Apps (React/Vue) require headless browser rendering (Puppeteer), increasing compute cost by 20x",
            "Distributed state coordination of queue politeness across worker nodes"
        ],
        "tradeoffs": "Freshness vs Crawl Budget. Recrawling every page daily exhausts bandwidth; crawlers use predictive PageRank algorithms to crawl high-frequency news sites hourly and static documentation monthly.",
        "alternatives": ["Apache Nutch", "Scrapy Cluster", "Common Crawl API"],
        "whenToUse": "Search engine indexers, competitive intelligence scraping, large-scale dataset extraction for AI training.",
        "whenNotToUse": "Internal API data integration where webhooks or REST/gRPC data pipelines are supported.",
        "commonMistakes": [
            "Ignoring `robots.txt` or domain politeness, resulting in IP bans and legal liability",
            "Checking URL uniqueness with SQL `SELECT WHERE url = ?` instead of in-memory Bloom filters",
            "Falling into spider traps (e.g. `/calendar?year=2026&month=13...` infinite URLs)"
        ],
        "interviewQuestions": [
            {
                "q": "How does the URL Frontier enforce domain politeness?",
                "a": "By decoupling priority from execution. URLs for a specific domain are always routed to that domain's dedicated FIFO queue. A worker thread pops a URL, performs the HTTP request, and records the timestamp. The queue is locked or placed in a delay wheel until the configured cooldown period (e.g. 1000ms) elapses."
            },
            {
                "q": "How do you detect if two web pages have virtually identical content despite different header timestamps and advertisements?",
                "a": "Using the SimHash algorithm. SimHash produces a 64-bit fingerprint of the document's content where similar documents produce fingerprints with very small Hamming distances (typically <= 3 bits differing), allowing near-duplicate detection in O(1) time."
            }
        ],
        "resources": [
            {"title": "Mercator: A scalable, extensible web crawler", "url": "https://research.google", "type": "docs"}
        ],
        "relatedTopics": ["consistent-hashing", "caching-strategies", "kafka", "hld-rate-limiter"]
    },
    {
        "id": "hld-rate-limiter",
        "title": "System 8: Distributed Rate Limiter (API Defense Tier)",
        "subject": "System Design",
        "category": "HLD",
        "difficulty": "Advanced",
        "estimatedTime": "50 min",
        "tags": ["Rate Limiter", "Redis", "Lua", "Token Bucket", "Sliding Window", "Security"],
        "what": """A Distributed Rate Limiter protects backend microservices against Denial of Service (DoS) attacks, brute force attempts, web scrapers, and cascading downstream failures by throttling incoming requests according to defined quotas (e.g. 100 requests per minute per IP/API Key).

The core technical challenge: In a distributed system with dozens of API Gateway instances, rate limiting counters must remain synchronized without introducing latency or race conditions.""",
        "why": """Local in-memory counters on individual gateway servers fail because a round-robin load balancer distributes requests across nodes, allowing an attacker to exceed quotas by a factor equal to the number of server instances.

1. **Centralized In-Memory Coordination (Redis)**: Redis provides sub-millisecond execution for shared key counters.
2. **Atomic Execution via Lua Scripts**: Eliminates read-modify-write race conditions in distributed environments.
3. **Sliding Window Log Algorithm**: Completely prevents boundary bursting attacks that plague fixed window counters.""",
        "how": """1. **Request Ingress**: Client request hits API Gateway -> Rate Limiter Filter intercepts `(client_ip, user_id, route)`.
2. **Key Generation**: Creates Redis key: `rate_limit:user:12345:api_v1`.
3. **Atomic Evaluation via Redis Lua Script**:
   - Executes Sliding Window Log: removes entries outside the 60-second window, checks remaining capacity, appends current timestamp, and sets TTL.
   - If count <= limit: returns `1` (Allowed) -> Request proceeds to backend service.
   - If count > limit: returns `0` (Blocked) -> Gateway returns HTTP 429 Too Many Requests with headers:
     `X-RateLimit-Limit: 100`
     `X-RateLimit-Remaining: 0`
     `Retry-After: 24`""",
        "internals": """## Rate Limiting Algorithm Comparison

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
redis.call('ZREMRANGEBYSCORE', rate_limit_key, 0, clear_boundary)

-- 2. Count requests in active window
local current_usage = redis.call('ZCARD', rate_limit_key)

if current_usage < max_allowed then
    -- 3. Log current request with unique member
    redis.call('ZADD', rate_limit_key, current_epoch, current_epoch .. '-' .. math.random(100000))
    redis.call('EXPIRE', rate_limit_key, math.ceil(window_size / 1000) + 1)
    return 1 -- Allowed
else
    return 0 -- Throttled
end
```""",
        "architecture": """+-----------------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------------+""",
        "realWorld": "Stripe, Cloudflare, and GitHub utilize distributed Redis token buckets and sliding windows to throttle abuse across hundreds of edge locations.",
        "advantages": [
            "Guaranteed atomic rate evaluation with zero race conditions via Redis Lua",
            "Eliminates 2x boundary traffic spike vulnerabilities",
            "Returns standardized RFC-compliant HTTP 429 rate limit response headers"
        ],
        "disadvantages": [
            "Introduces a network round-trip to Redis on every inbound API call",
            "Redis failure could either fail-open (security risk) or fail-closed (availability outage)"
        ],
        "tradeoffs": "Accuracy (Sliding Window Log in Redis) vs Memory & Latency (Token Bucket in local memory). High-security endpoints (e.g. login, payment checkout) use exact Redis sliding logs; high-throughput content endpoints use local token buckets.",
        "alternatives": ["Envoy Global Rate Limit Service", "Cloudflare Edge Rules", "Bucket4j"],
        "whenToUse": "Public APIs, user authentication endpoints, multi-tenant SaaS tiers, sensitive checkout routes.",
        "whenNotToUse": "Internal high-performance microservice-to-microservice RPCs inside a secure VPC where latency is sub-millisecond and services trust each other.",
        "commonMistakes": [
            "Using non-atomic `GET` followed by `SET` in Redis, introducing race conditions under concurrent requests",
            "Using Fixed Window counters that allow double the rate limit across the boundary minute",
            "Not configuring a fail-open policy when Redis becomes temporarily unreachable"
        ],
        "interviewQuestions": [
            {
                "q": "Why is a Lua script necessary when implementing a rate limiter in Redis?",
                "a": "A Redis Lua script executes atomically as a single command without interruption. Without Lua, separate `ZREMRANGEBYSCORE`, `ZCARD`, and `ZADD` commands would allow race conditions where two concurrent requests both read the counter below the threshold and both succeed, violating the rate limit."
            },
            {
                "q": "What happens if the Redis rate limiter cluster crashes? Should you Fail-Open or Fail-Closed?",
                "a": "It depends on the endpoint. For core user browsing routes, fail-open to preserve user experience. For critical operations (payment processing, password resets, SMS OTP sending), fail-closed or fail to a local in-memory fallback to prevent catastrophic fraud."
            }
        ],
        "resources": [
            {"title": "Scaling your API with Rate Limiters - Stripe", "url": "https://stripe.com/blog/rate-limiters", "type": "article"}
        ],
        "relatedTopics": ["redis-concurrency", "caching-strategies", "hld-web-crawler", "load-balancing"]
    }
]
