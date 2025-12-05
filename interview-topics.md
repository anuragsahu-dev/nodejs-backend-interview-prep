## Express.js (Theory)

- What is Express.js?
- Request–Response lifecycle
- What is middleware?
  - Application-level
  - Router-level
  - Error-handling
  - Built-in
  - Third-party
- next() — why and how it works
- express.json(), express.urlencoded()
- app.use vs app.get vs app.all
- Router() and modular routing
- CORS theory (simple vs preflight)
- Express error handling structure
- MVC / layered folder structure
- What is "middleware chain breaking"?

## 2. REST API Theory (Very Important)

- What is an API?
- What is REST?
- REST architectural constraints
- HTTP Methods meaning
- Idempotency (not done)
- HTTP status code families
- Query params vs Path params vs Body vs Headers
- Pagination theory
- Filtering / Searching
- Sorting
- API versioning strategies
- REST vs GraphQL vs gRPC
- Stateless vs Stateful APIs
- Resource naming & best practices

## 3. Authentication Theory (Full Stack)

- Authentication vs Authorization
- Password hashing (salt, bcrypt, argon2 theory)
- What is JWT?
- JWT flow — Access + Refresh tokens
- Why refresh token exists
- Token rotation & invalidation
- Where to store refresh token (DB, Redis)
- Session-based auth theory
- Cookies (HTTP-only, SameSite, Secure)
- Google OAuth 2.0 flow
- OAuth vs OIDC
- RBAC
- When to use session auth vs JWT auth

## 4. Backend Security Theory

- CORS (simple vs preflight, policy design)
- Helmet (what protections it provides)
- HPP (HTTP Parameter Pollution)
- Rate limiting and brute-force protection
- XSS (stored, reflected)
- CSRF
- SQL Injection
- NoSQL Injection
- API Key security
- Content Security Policy (concept)
- Secrets management
- Secure password policies
- Best practices for protecting APIs

## 5. Database Fundamentals (SQL + NoSQL)

- SQL vs NoSQL — when to choose what
- ACID properties
- CAP theorem (Consistency, Availability, Partition tolerance)
- Vertical vs Horizontal scaling
- Replication
- Sharding basics
- Read replica concept
- Write-ahead log (basic idea)
- Normalization (1NF, 2NF, 3NF)
- Index basics (B-tree, unique index, compound index)
- Query optimization basics


not done

## 6. SQL Theory (Basics → Intermediate)

- SELECT, INSERT, UPDATE, DELETE
- JOINS (Inner, Left, Right, Full)
- GROUP BY / HAVING
- Aggregate functions
- Constraints (PK, FK, Unique, Check)
- Views
- Stored Procedures (basic overview)
- Transactions (BEGIN, COMMIT, ROLLBACK)
- Deadlocks (what & why)
- Explain analyze (basic idea)
- WHEN SQL beats NoSQL in real systems
- N+1 problem in SQL


working on

## 7. ORMs Theory (Prisma + Mongoose)

### Prisma

- What is an ORM?
- Prisma schema
- Migrations
- Prisma client generation
- Relations (1-1, 1-n, n-n)
- Transactions in Prisma
- Prisma middlewares
- Prisma vs raw SQL

### Mongoose

- Mongoose Schema
- Schema Types
- Pre & Post middleware
- Virtuals
- Populate
- Indexing in Mongoose
- Lean queries
- Aggregation pipeline basics

## 8. File Uploading Theory (Multer + S3 + Cloudinary + Buffer)

- multipart/form-data explained
- Multer working
- diskStorage vs memoryStorage
- Buffer-based file uploads
- Uploading to S3
- What is an S3 bucket?
- Object storage vs file storage
- Presigned URLs
- Public vs Private buckets
- Cloudinary basics (upload preset, transformations)
- Common file upload security best practices

## 9. Caching Theory (Redis + Managed Redis)

- What is caching?
- In-memory vs persistent caching
- Redis basics
- TTL
- Redis data structures (string, hash, list)
- Eviction policies (LRU, LFU)
- Cache-aside pattern
- Write-through & Write-behind
- Managed Redis (Upstash, ElastiCache)
- Cache invalidation patterns
- Caching real-world use cases (feed, sessions, rate limit)

## 10. Message Broker Theory (RabbitMQ)

- Why message brokers exist
- Producer vs Consumer
- Exchange types
  - Direct
  - Fanout
  - Topic
- Routing keys
- Durable queues
- Prefetch
- Acknowledgements
- Dead Letter Queue (DLQ)
- Retry mechanism
- Use cases (email service, notifications, billing async flow)

## 11. Real-Time Communication Theory

### WebSocket
- WebSocket vs HTTP
- WebSocket vs SSE vs Polling
- Full-duplex communication
- Rooms / Namespaces concept
- Scaling websockets (Redis pub/sub)
- When to use WebSocket

### Webhook

- What is a webhook
- Webhook vs WebSocket
- Signature verification
- Retries & idempotency

### WebRTC (basic only)

- P2P communication
- STUN vs TURN
- Where WebRTC is used (video calls, file transfer)

## 12. Testing Theory (Backend Testing)

- What is unit testing?
- What is integration testing?
- What is E2E testing?
- Mocking
- Testing controllers vs services
- Why backend tests matter
- Test pyramid concept
- Common testing strategies for APIs
- Snapshot testing (optional)

## 13. DevOps Essentials for Backend Developers

### Docker

- What is Docker?
- Image vs Container
- Dockerfile layers
- Volumes vs Bind Mounts
- Docker Compose

### Docker Swarm

- Services
- Replicas
- Ingress load balancing

### CI/CD

- What is CI? What is CD?
- GitHub Actions basics
- Pipelines for Node.js

### Caddy

- Reverse proxy
- Automatic HTTPS

### Cron Jobs

- Cron syntax
- Server background tasks

### AWS Cloud Basics

- EC2
- S3
- SES
- IAM (roles, policies, least privilege)

### Monitoring

- Prometheus (scraping concept)
- Grafana dashboard basics

## 14. Logging + Observability + Monitoring

- What is logging?
- Log levels (info, warn, error, debug)
- Structured logging (JSON logs)
- Morgan vs Winston
- Correlation IDs
- Tracing basics
- Log rotation
- Difference between monitoring vs logging vs tracing

not done
## 15. Backend Architecture + Design Patterns

- MVC
- Layered architecture (controller → service → repo)
- Clean Architecture
- Dependency Injection
- Singleton pattern
- Repository pattern
- Event-driven architecture
- Monolithic vs Microservices

not done
## 16. System Design (SDE-1 Level)

- Load balancer
- Caching layer
- API Gateway (high-level)
- CDN
- Replication
- Sharding
- Indexing
- Queue systems
- Designing:
  - Chat system
  - Notification system
  - URL shortener
  - File upload service
- Horizontal vs Vertical scaling

## 17. NestJS (Full Theory)

- Why NestJS?
- Module system
- Providers
- Dependency Injection
- Decorators
- Controllers
- Services
- Guards (RBAC in Nest)
- Pipes
- Interceptors
- Exception filters
- NestJS folder structure