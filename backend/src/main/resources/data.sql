
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
