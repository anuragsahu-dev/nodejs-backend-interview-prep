# Caching in Backend Development

## 1. What is Caching?

Caching is the technique of storing frequently accessed data in faster storage (memory) so that future requests can be served quickly without hitting the database again.

A simple way to remember:
**Caching = Store once → Reuse many times.**

### Why caching?

- Reduces database load
- Makes APIs much faster
- Saves cost
- Helps handle more traffic

## 2. In-Memory vs Persistent Caching

**In-memory caching** means the data is stored directly in RAM (Redis, Memcached).
It is extremely fast and used for sessions, feeds, rate limits, search results, product data, etc.

**Persistent caching** means the data is stored on disk so it survives restarts.
This is slower and rarely used for API caching.

As a junior backend developer, you only need to focus on in-memory Redis caching.

## 3. What is Redis?

Redis is an in-memory, key–value database used mainly for:

- Caching
- Sessions
- Rate limiting
- Queues
- Pub/Sub

Redis is very fast because it stores everything in RAM, not on disk.

### Key characteristics:

- Key–value store
- Supports many data types
- Millisecond response time
- Perfect for backend performance

## 4. TTL (Time To Live)

TTL is the time after which a key will automatically expire.

**Example:**
If you set `user:101` with TTL 60 seconds → it will delete itself after 1 minute.

Node.js example using ioredis:

```javascript
redis.set("user:101", JSON.stringify(data), "EX", 60);
```

### Use cases:

- OTP expiry
- Session expiry
- Feed cache
- Short-lived API outputs

## 5. Important Redis Data Types (Beginner Level)

### a) String

Stores simple values.

```redis
SET user:1 "Anurag"
```

**Use:** cache API response, config values.

### b) Hash

Stores objects inside one key.

```redis
HSET user:1 name Anurag age 22
```

**Use:** sessions, carts, profiles.

### c) List

Stores ordered elements.

```redis
LPUSH feed:101 "new post"
```

**Use:** notifications, feeds.

## 6. Eviction Policies (LRU, LFU)

When Redis memory is full, it removes some keys.

- **LRU** → Least Recently Used key removed
- **LFU** → Least Frequently Used key removed

Most production systems use LRU.

As a junior backend developer, only LRU and LFU matter for interviews.

## 7. Cache-Aside Pattern (Most Used Pattern)

This is the standard way caching works in real apps.

### Flow:

1. Check cache
2. If found → return it
3. If not found → fetch from DB
4. Save to Redis with TTL
5. Return to client

Node.js example:

```javascript
const key = `product:${id}`;
let cache = await redis.get(key);

if (!cache) {
  const product = await Product.findById(id);
  await redis.set(key, JSON.stringify(product), "EX", 3600);
  return product;
}

return JSON.parse(cache);
```

**Cache-aside = also called lazy loading.**

## 8. Write-Through vs Write-Behind (Simple Explanation)

### Write-Through

Whenever you write to DB, you also write to cache.

- **Pros:** cache always updated
- **Cons:** write becomes slower
- **Use:** rarely used in Node monolith apps

### Write-Behind

Write first to cache → Redis writes to DB later.

- **Pros:** super-fast
- **Cons:** risky
- **Use:** advanced systems (not needed for juniors)

As a junior, only mention them — don't implement.

## 9. Managed Redis Services

Instead of hosting Redis yourself, companies use managed services:

### a) Upstash Redis

- Serverless
- Cheap
- Good for side projects

### b) AWS ElastiCache

- Used in big companies
- High availability
- Automatic scaling

### c) Redis Cloud

- Fully managed Redis

**Most used in production:**

- ElastiCache for medium–large apps
- Upstash for small apps/Next.js apps

## 10. Cache Invalidation (Simple & Important)

Cache invalidation means removing stale/outdated cache.

### Methods:

**1. TTL expiry (most common)**
Let it expire automatically.

**2. Delete on Write**
Whenever you update a product:

```redis
DEL product:101
```

**3. Key versioning**
`v1:products`, `v2:products`

(TTL + Delete on write = enough for junior backend level.)

## 11. Key Naming Patterns (Very Important)

Clean key patterns avoid confusion.

### Examples:

```
user:101
product:45
feed:101
search:products:laptop
session:xyz123
otp:email:user@email.com
```

### Rules:

- Use `:` for separation
- Use `entity:id` format
- Keep names short

## 12. Real-World Use Cases

### 1. Product Detail Caching

Cache product info for 1 hour.

### 2. User Feed Caching

Cache feed for 30–60 seconds.

### 3. Sessions

Store session tokens in Redis.

### 4. Rate Limiting

Store counters in Redis (you already covered this).

### 5. Search Results

Cache expensive searches for 1–5 minutes.

## 13. Node.js Redis Connection (ioredis → recommended)

```javascript
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
});
```

## 14. Final Summary (for interviews)

- **Redis** = in-memory key–value store used for caching
- **TTL** = automatic key expiry
- **Common data types** = string, hash, list
- **Cache-aside pattern** = check cache → DB → update cache
- **Eviction** = LRU, LFU
- **Key naming** = `entity:id` format
- **Managed Redis** = Upstash, ElastiCache
- **Use cases** = sessions, feed, rate limiting, product details
