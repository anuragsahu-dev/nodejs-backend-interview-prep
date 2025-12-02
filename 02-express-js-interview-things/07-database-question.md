# Database Interview Questions

## 1. Core Database Basics

**Q1. What is a database?**

A database is a system used to store, organize, manage, and retrieve data efficiently.

**Q2. What is the difference between SQL and NoSQL?**

- **SQL:** Structured tables, fixed schema, strong consistency, supports joins.
- **NoSQL:** Flexible schema, document/key-value storage, scalable horizontally, great for large/rapidly changing data.

**Q3. What is MongoDB?**

MongoDB is a NoSQL document database that stores data in JSON-like (BSON) documents and supports horizontal scaling.

**Q4. What is PostgreSQL/MySQL?**

They are SQL relational databases that store data in tables, support ACID transactions, and are best for structured data and complex queries.

**Q5. When should you use SQL?**

When you need relationships, ACID transactions, and strong consistency (e.g., payments, orders, finance).

**Q6. When should you use MongoDB?**

When data is flexible, schema changes often, you need high write throughput or horizontal scaling (e.g., social media, logs).

---

## 2. ACID & CAP

**Q7. What are ACID properties?**

- **Atomicity:** All or nothing
- **Consistency:** Data stays valid
- **Isolation:** Transactions don’t conflict
- **Durability:** Data survives crashes

**Q8. Why are ACID properties important?**

They ensure safe, reliable, and correct transactions—critical for financial and transactional systems.

**Q9. What is the CAP theorem?**

A distributed database can guarantee only two out of three:

- Consistency
- Availability
- Partition tolerance

**Q10. Which two does MongoDB prefer in CAP?**

MongoDB is generally **CP** (Consistency + Partition tolerance).

---

## 3. Indexing

**Q11. What is an index?**

An index is a data structure that speeds up read queries by avoiding full table/collection scans.

**Q12. How does an index improve performance?**

It stores sorted references, allowing the database to directly jump to the required data instead of scanning all records.

**Q13. When should you NOT use an index?**

On fields with:

- Very low selectivity (e.g., gender: M/F)
- High write workloads (indexes slow writes)

**Q14. What is a unique index?**

An index that ensures no duplicate values exist in a field (example: email).

**Q15. What is a compound index?**

An index created on multiple fields to optimize queries using those fields together.

**Q16. What is a B-Tree index?**

The default index structure in SQL and MongoDB, optimized for range and equality queries.

---

## 4. Normalization & Denormalization

**Q17. What is normalization?**

A process in SQL to reduce redundancy and improve data integrity by organizing data into separate related tables.

**Q18. What is denormalization?**

Combining tables or embedding data to improve read performance, commonly used in MongoDB.

**Q19. Example of denormalization?**

Embedding user details inside a blog post document to avoid frequent JOINs.

---

## 5. Query Optimization

**Q20. Why avoid SELECT \* ?**

It fetches unnecessary data, increases load, and slows queries. Better to select only needed columns.

**Q21. How do indexes help optimize queries?**

They remove the need for full scans and speed up searching, filtering, and sorting.

**Q22. What is EXPLAIN / EXPLAIN ANALYZE?**

A tool to see how the database will execute a query and whether it uses indexes.

**Q23. What is pagination and why is it used?**

Pagination breaks large results into smaller pages using LIMIT/OFFSET to reduce load and improve response time.

---

## 6. Caching (Redis)

**Q24. What is Redis?**

Redis is an in-memory key-value store used for caching, sessions, rate limiting, etc.

**Q25. Why use Redis?**

It is extremely fast because it stores data in memory, reducing the number of expensive database queries.

**Q26. What is a cache hit and cache miss?**

- **Hit:** Data found in Redis
- **Miss:** Data not found (DB query happens)

**Q27. How does Redis reduce DB load?**

By storing frequent results so the application doesn’t hit the main database every time.

---

## 7. Replication

**Q28. What is replication?**

Creating multiple copies of your database across different servers.

**Q29. Why is replication used?**

- High availability
- Failover
- Read scaling
- Data reliability

**Q30. What is a read replica?**

A read-only database copy used to offload read-heavy traffic.

---

## 8. Handling Database Overload

**Q31. What causes DB overload?**

- Missing indexes
- Too many open connections
- Heavy queries
- No caching
- No pagination
- High write volume

**Q32. How do you reduce DB overload?**

- Add Redis caching
- Add indexes
- Optimize queries
- Increase connection pool
- Use read replicas
- Implement pagination

---

## 9. Connection Pooling

**Q33. What is connection pooling?**

A pool of pre-created database connections reused by the application.

**Q34. Why not create a new DB connection for each request?**

It is slow, heavy, and can crash the database. Pooling reduces overhead and improves performance.

---

## 10. Consistency Levels

**Q35. What is strong consistency?**

Every read gets the latest data immediately.

**Q36. What is eventual consistency?**

Data becomes consistent after a short delay (common in NoSQL).

**Q37. Where is eventual consistency used?**

Distributed NoSQL systems like MongoDB, DynamoDB, Cassandra.

---

## 11. Backups

**Q38. What is a database backup?**

A copy of database data used for recovery after failures.

**Q39. Why are backups important?**

They protect against:

- Accidental deletion
- Data corruption
- Ransomware
- Server crashes

**Q40. Difference between replication and backup?**

- **Replication:** Real-time copies
- **Backup:** Historical snapshots (can restore old state)

---

## 12. Managed DB vs Self-Hosted

**Q41. What is MongoDB Atlas?**

A fully managed cloud MongoDB platform offering automatic scaling, backups, and monitoring.

**Q42. What is Neon?**

A modern, serverless PostgreSQL platform with auto-scaling and branching.

**Q43. Why choose managed databases?**

Because they offer:

- Auto backups
- Security patches
- High availability
- Monitoring
- Less DevOps work

**Q44. When would you self-host a database?**

When cost matters or you need full customization and control.

---

## 13. Default DB Ports

**Q45. PostgreSQL port?**

`5432`

**Q46. MongoDB port?**

`27017`

**Q47. MySQL port?**

`3306`
