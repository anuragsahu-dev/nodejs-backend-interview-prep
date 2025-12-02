# Database Fundamentals

## 1. Core Database Basics

### What is a Database?

A database is a system used to store, organize, manage, and retrieve data efficiently. It allows multiple users and applications to read/write data safely at the same time.

**Key properties:**

- **Fast access** – Optimized data retrieval using indexing and query optimization
- **Secure storage** – Built-in authentication, authorization, and encryption mechanisms
- **Data integrity** – Ensures accuracy and consistency through constraints and validation
- **Supports queries and indexing** – Enables efficient searching and filtering of data

### What is an SQL Database?

SQL (Relational) databases store data in tables (rows & columns) with a fixed schema.

**Examples:** PostgreSQL, MySQL, SQL Server

**Best for:**

- Structured data with predefined schema
- Relationships between entities (foreign keys)
- Complex queries with JOINs
- Strong consistency requirements
- ACID transactions

**Use cases:**

- Banking systems
- Order management
- Billing systems
- Inventory tracking
- Financial systems

### What is MongoDB? (NoSQL Document Database)

MongoDB is a NoSQL, document-based database that stores data in BSON (JSON-like) documents.

**Best for:**

- Flexible schema (schema can evolve over time)
- Fast writes and high throughput
- Large-scale applications
- High horizontal scaling (sharding)
- Real-time analytics

**Use cases:**

- User profiles
- Social media platforms
- Logging and monitoring systems
- Content management systems

### SQL vs NoSQL — When to Choose What

**Choose SQL when:**

- You need strong consistency (ACID compliance)
- You need ACID transactions
- Data has clear relationships (foreign keys, JOINs)
- Schema is stable and well-defined
- Complex joins are required

**Choose NoSQL (MongoDB) when:**

- Schema is flexible or evolving
- Data grows rapidly and unpredictably
- Need fast writes and high throughput
- Horizontal scaling is required
- Working with JSON-like data structures

---

## 2. ACID & CAP

### ACID Properties

Guarantees safe and reliable transactions in databases (mostly SQL).

- **Atomicity:** All steps in a transaction succeed or none do (all-or-nothing)
- **Consistency:** Database remains in a valid state before and after transaction
- **Isolation:** Concurrent transactions do not interfere with each other
- **Durability:** Once committed, data survives crashes and persists permanently

### CAP Theorem

In distributed databases, you can choose only **two** of these three:

- **Consistency** – Every node sees the same data at the same time
- **Availability** – System always responds to requests (even if data is stale)
- **Partition Tolerance** – System works even with network failures between nodes

**Examples:**

- **MongoDB** → CP (Consistency + Partition Tolerance)
- **Cassandra** → AP (Availability + Partition Tolerance)

---

## 3. Indexing

### What is an Index?

An index is a data structure (like a book index) that makes search much faster by avoiding full scan of the collection/table.

**Benefits:**

- Faster read queries
- Faster filtering and sorting operations

**Trade-off:**

- Slightly slower writes (because index must be updated on every insert/update)
- Additional storage space required

### Why Indexing Improves Read Performance?

Indexes store sorted references of data. So instead of scanning 1,00,000 records sequentially, the database jumps directly to the required location using the index.

**Example:** Without index, finding a user by email requires scanning all records. With index on email, it's a direct lookup.

### Types of Indexes (Basic)

**1. B-Tree Index (Default)**

- Used in both SQL and MongoDB
- Supports sorting and range queries (`>`, `<`, `BETWEEN`)
- Best for equality and range searches

**2. Unique Index**

- Prevents duplicate values in a field
- Example: `email` field should be unique

**3. Compound Index**

- Index on multiple fields together
- Example: `{ email: 1, createdAt: -1 }`
- Order of fields matters for query optimization

**(Optional Advanced Indexes)**

- **Text Index** → For full-text searching
- **TTL Index** → Auto-delete documents after a given time (MongoDB)

---

## 4. Normalization vs Denormalization

### Why Normalize?

To reduce data duplication and maintain data integrity in SQL databases.

**Normalization Levels:**

- **1NF** → Each column contains atomic (indivisible) values
- **2NF** → No partial dependency (all non-key attributes depend on the entire primary key)
- **3NF** → No transitive dependency (non-key attributes don't depend on other non-key attributes)

### Why Denormalize (in NoSQL)?

For performance reasons, especially in read-heavy applications.

MongoDB prefers embedding documents to:

- **Reduce JOINs** – No need for expensive join operations
- **Reduce number of queries** – Fetch all related data in one query
- **Improve read performance** – All data is co-located

---

## 5. Query Optimization

### Avoid SELECT \*

Fetch only required columns. This improves performance and reduces network load by transferring less data.

**Example:**

```sql
-- Bad
SELECT * FROM users;

-- Good
SELECT id, name, email FROM users;
```

### Use Indexes

Create indexes on frequently queried fields for faster searching, filtering, and sorting.

### Filtering on Indexed Fields

Index works only when the filter uses the indexed field.

**Example:**

```sql
-- If index exists on email
WHERE email = 'user@example.com' -- Fast (uses index)
WHERE name = 'John' -- Slow (no index on name)
```

### Use LIMIT + Pagination

Prevents loading the entire dataset at once, reducing memory usage and improving response time.

**Example:**

```sql
SELECT * FROM users LIMIT 10 OFFSET 20;
```

### Explain / Explain Analyze

Used to check:

- **Query execution plan** – How the database will execute the query
- **Whether index is used** – Confirms if your indexes are being utilized
- **How much time query takes** – Identifies slow queries

**Example:**

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

---

## 6. Redis Caching

### Why use Redis?

Redis stores data in-memory, making it extremely fast (microsecond latency).

**Uses:**

- **Reduce DB load** – Cache frequently accessed data
- **Cache frequently accessed results** – Store query results
- **Store sessions** – User session management
- **Rate limiting** – Track API request counts

### How Redis Reduces DB Load

Instead of hitting the database every time:

1. **Check Redis** first
2. **If found (cache hit)** → Return cached data
3. **If not found (cache miss)** → Query database → Store result in Redis for future requests

### Cache Flow

```
Client → Redis (check cache) → DB (if miss) → Redis (store) → Client
```

---

## 7. Replication (Basic)

### What is Replication?

Creating multiple copies of the same database on different servers for redundancy and availability.

**Types:**

- **Primary → Secondary** (most common) – One primary for writes, multiple secondaries for reads

### Why Production Uses Replication

- **High availability** – If primary fails, secondary can take over
- **Failover support** – Automatic promotion of secondary to primary
- **Read scaling** – Distribute read queries across replicas
- **Protect against data loss** – Multiple copies ensure data safety

---

## 8. Handling Database Overload (High Level)

### Major Causes:

- **Missing indexes** – Queries perform full table scans
- **Too many open connections** – Exceeds database connection limits
- **Heavy JOINs or aggregations** – Complex queries consume resources
- **No caching layer** – Every request hits the database
- **Slow queries** – Unoptimized queries block resources
- **Large datasets without sharding** – Single server can't handle the load

### Solutions:

- **Add Redis caching** – Reduce repeated database queries
- **Add indexes** – Speed up query execution
- **Optimize queries** – Rewrite inefficient queries
- **Add read replicas** – Distribute read load
- **Increase connection pool size** – Handle more concurrent connections
- **Scaling up/down** – Vertical (more resources) or horizontal (more servers) scaling

---

## 9. Connection Pooling

### What is Connection Pooling?

A set of pre-created database connections that are reused by your application instead of creating new connections for each request.

### Why Not Create New Connection Per Request?

Because it is:

- **Slow** – Establishing a connection takes time (TCP handshake, authentication)
- **Expensive** – Consumes CPU and memory resources
- **Can crash the database** – Too many connections can exhaust database resources

**Connection pool improves performance and stability** by reusing existing connections.

---

## 10. Consistency Levels (Basic)

### Strong Consistency

You always get the latest data. Every read reflects the most recent write.

**Example:** SQL databases with ACID transactions

### Eventual Consistency

Data becomes consistent after some time. Reads might return stale data temporarily, but eventually, all nodes converge to the same state.

**Common in:** NoSQL distributed systems (Cassandra, DynamoDB)

---

## 11. Backups (Basic)

### What is a Database Backup?

A copy of your database taken at a specific point in time.

### Why Backups Matter?

To restore data if:

- **Server crashes** – Hardware or software failures
- **Data corruption** – Database files get corrupted
- **Accidental deletion** – Human errors (DROP TABLE, DELETE without WHERE)
- **Hacking / ransomware** – Security breaches or malicious attacks

---

## 12. Managed DB vs Self-Hosted

### Managed DB (Atlas, Neon, AWS RDS)

Cloud provider handles:

- **Backups** – Automated backup and restore
- **Scaling** – Auto-scaling based on load
- **Security patches** – Automatic updates
- **Monitoring** – Built-in performance monitoring
- **High availability** – Replication and failover

**Best for production** – Less operational overhead, more focus on application development.

### Self-hosted (Docker on VPS like DigitalOan)

You handle:

- **Backups** – Manual or scripted backups
- **Security** – Firewall, encryption, access control
- **Replication** – Manual setup and monitoring
- **Scaling** – Manual resource allocation
- **Monitoring** – Custom monitoring solutions

**Cheaper but more responsibility** – Requires DevOps expertise.

---

## 13. Default Ports

- **PostgreSQL** → `5432`
- **MongoDB** → `27017`
- **MySQL** → `3306`
