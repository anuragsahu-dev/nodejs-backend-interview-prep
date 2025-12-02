# REST API Theory

## What is an API?

**API (Application Programming Interface)** is a contract that allows two software systems to communicate.

- Defines how clients request data and how servers respond
- Hides internal implementation and exposes structured access
- Example: Frontend → `/api/users` → Backend returns JSON

---

## What is REST?

**REST = Representational State Transfer**

REST is a way of building APIs that promotes stateless communication, resource-based URLs, and a uniform interface so clients and servers can interact in a clear and scalable way.

### Simple Definition:
"Represent your data as **resources** and access them through **predictable URLs** using **standard HTTP methods**."

---

## What is a REST API?

A **REST API** is an API built using REST principles, where:
- The server exposes **resources** through clean, meaningful URLs (like `/users`, `/orders/10`)
- The client interacts with those resources through **HTTP methods** (GET, POST, PUT, PATCH, DELETE)
- The API returns **representations** of resources (usually JSON)
- It follows rules like **statelessness** and **uniform interface**

---

## What does RESTful mean?

An API is **RESTful** when it fully follows REST rules and constraints, such as:

- Resource-based URLs
- Standard HTTP methods
- Statelessness
- Proper use of HTTP status codes
- Cacheable responses
- Uniform, predictable structure

**In short:** RESTful APIs are APIs that correctly implement REST principles.

---

## Why REST Was Created

Earlier APIs were:
- Too complex
- Not scalable
- Inconsistent
- Hard to maintain

REST introduced a **simple, universal way** of building APIs using:
- HTTP
- URLs
- JSON
- Standard methods (GET, POST, PUT, DELETE)

---

## Core Principles of RESTful APIs

**1. Everything is a Resource**
- Resources: Users, Orders, Products
- Each resource has a unique URL: `/users`, `/orders/123`, `/products/iphone`

**2. Use Standard HTTP Methods**
- `GET` → Read
- `POST` → Create
- `PUT/PATCH` → Update
- `DELETE` → Remove
- ❌ Don't create custom methods like `/getUsers`, `/deleteProduct`

**3. Stateless**
- Server doesn't remember past requests
- Every request is independent and self-contained
- All required data (token, params) sent with each request

**4. Use Representations**
- Resources can be represented in multiple formats:
  - JSON (most common)
  - XML
  - HTML
- Example: `/users/1` → returns JSON representation of user

**5. Uniform Interface**
- Consistent conventions everywhere
- Use nouns in URLs
- Use HTTP status codes
- Predictable and easy to understand

**6. Client–Server Separation**
- Client (UI) and Server (business logic) are independent
- Both can evolve separately
- Allows independent scaling

---

## REST Example (User Resource)

```
GET    /users       → Fetch all users
POST   /users       → Create a new user
GET    /users/10    → Fetch user with ID 10
PUT    /users/10    → Replace user 10 completely
PATCH  /users/10    → Update specific fields of user 10
DELETE /users/10    → Delete user 10
```

This predictable pattern is the heart of REST.

---

## Why REST is Popular

- ✅ Simple and intuitive
- ✅ Easy to scale
- ✅ Works everywhere (web, mobile, backend, frontend)
- ✅ Uses existing web standards
- ✅ Human-readable
- ✅ Easy to cache
- ✅ Independent of frameworks/languages

**Interview Answer:**
REST is an architectural style that defines how clients and servers communicate using resource-based URLs, standard HTTP methods, stateless interactions, and uniform conventions to make APIs scalable, predictable, and easy to maintain.

---

## REST Architectural Constraints (6 Principles)

### 1. Client–Server
- UI (client) and backend logic (server) are separate
- Allows independent scaling and evolution

### 2. Stateless
- Server does not store client session
- Every request contains all required data (token, params)

### 3. Cacheable
- Responses must define whether they are cacheable (`Cache-Control`)
- Improves performance and reduces server load

### 4. Uniform Interface
- Ensures consistent interactions:
  - Use standard HTTP methods
  - Use resource-based URLs
  - Use JSON/XML
  - Use hypermedia (optional)

### 5. Layered System
- Client should not know whether the response came from:
  - Server
  - Proxy
  - Load balancer
  - Cache layer

### 6. Code on Demand (Optional)
- Server can send executable code (e.g., scripts)
- Rarely used in REST APIs

---

## HTTP Methods

| Method | Meaning | Typical Use | Idempotent |
|--------|---------|-------------|------------|
| `GET` | Fetch data | Read resource | Yes |
| `POST` | Create new resource | Create user, upload data | No |
| `PUT` | Replace entire resource | Full update | Yes |
| `PATCH` | Partially update resource | Update only changed fields | No |
| `DELETE` | Delete resource | Remove user/product | Yes |
| `OPTIONS` | Check allowed methods | Browser preflight | Yes |
| `HEAD` | Same as GET but without body | Check resource existence | Yes |

---

## HTTP Status Code Families

| Family | Meaning | Common Examples |
|--------|---------|-----------------|
| **1xx** | Informational | `101 Switching Protocols` |
| **2xx** | Success | `200 OK`, `201 Created`, `204 No Content` |
| **3xx** | Redirection | `301 Moved Permanently`, `304 Not Modified` |
| **4xx** | Client error | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| **5xx** | Server error | `500 Internal Server Error`, `503 Service Unavailable` |

---

## Query Params vs Path Params vs Body vs Headers

### Path Params
- Identify a specific resource
- Part of the URL
- Example: `/users/:id` → `/users/42`

### Query Params
- For filtering, searching, pagination, sorting
- Example: `/users?page=2&limit=10&role=admin`

### Request Body
- For sending large or structured data
- Mostly used with `POST/PUT/PATCH`
- Example:
```json
{
  "name": "John",
  "email": "john@example.com"
}
```

### Headers
- Meta-data of the request
- Examples:
  - `Authorization: Bearer token`
  - `Content-Type: application/json`
  - `Accept: application/json`

---

## Pagination

### Why Pagination?
- Avoid sending huge datasets at once
- Improves API performance and reduces DB load

### Types:

**1. Offset–Limit Pagination**
```
?page=1&limit=20
?offset=40&limit=20
```

**2. Cursor-Based Pagination**
```
?cursor=lastItemId
```
- Better for large datasets & real-time feeds
- More efficient for frequently changing data

### Response Example:
```json
{
  "data": [...],
  "page": 3,
  "limit": 10,
  "totalPages": 12,
  "totalItems": 115
}
```

---

## Filtering & Searching

### Filtering
Use query params to filter results:
```
/products?category=shoes&price[gt]=1000
/users?role=admin&status=active
```

### Searching
Free-text search across multiple fields:
```
/products?search=iphone
/users?q=john
```

---

## Sorting

Sort results by one or more fields:
```
/products?sort=price           // ascending
/products?sort=-price          // descending
/products?sort=price,name      // multiple fields
```

---

## API Versioning Strategies

### Why Version?
To introduce new changes without breaking existing clients.

### Methods:

**1. URL Versioning (Most Common)**
```
/api/v1/users
/api/v2/users
```
✅ Clear, easy to understand, widely used

**2. Header-Based**
```
Accept: application/vnd.company.v2+json
```
✅ Cleaner URLs, but harder to test

**3. Query Param Versioning**
```
/users?version=2
```
❌ Not recommended (mixes versioning with filtering)

**4. Domain/Subdomain**
```
v2.api.example.com
```
✅ Good for major version changes

**Best Practice:** Use URL versioning (`/api/v1/users`)

---

## REST vs GraphQL vs gRPC

### REST

**What it is:**
- Resource-based architecture
- Uses HTTP methods (GET, POST, PUT, DELETE)
- Multiple endpoints for different resources

**Pros:**
- Simple and widely understood
- Works with standard HTTP
- Easy to cache
- Great for public APIs

**Cons:**
- Over-fetching (getting more data than needed)
- Under-fetching (need multiple requests)
- Versioning can be complex

**Best for:**
- Public APIs
- Simple CRUD operations
- Mobile apps
- Web applications

---

### GraphQL

**What it is:**
- Query language for APIs
- Client defines exact data shape needed
- Single endpoint for all queries

**Pros:**
- No over-fetching/under-fetching
- Client gets exactly what it asks for
- Strong typing
- Great for complex UIs

**Cons:**
- More complex to implement
- Harder to cache
- Requires GraphQL server
- Learning curve

**Best for:**
- Complex UIs with varying data needs
- Mobile apps with limited bandwidth
- Apps with many related entities

---

### gRPC

**What it is:**
- High-performance RPC framework
- Uses HTTP/2 and Protocol Buffers (binary)
- Strongly typed contracts

**Pros:**
- Very fast (binary format)
- Efficient (HTTP/2 multiplexing)
- Built-in code generation
- Great for microservices

**Cons:**
- Not human-readable
- Limited browser support
- Steeper learning curve
- Not ideal for public APIs

**Best for:**
- Microservices communication
- Internal APIs
- Real-time streaming
- High-performance systems

---

### Comparison Table

| Feature | REST | GraphQL | gRPC |
|---------|------|---------|------|
| **Data Format** | JSON | JSON | Protobuf (binary) |
| **Protocol** | HTTP/1.1 | HTTP | HTTP/2 |
| **Endpoints** | Multiple | Single | Multiple (services) |
| **Speed** | Moderate | Moderate | Very Fast |
| **Caching** | Easy | Complex | Limited |
| **Browser Support** | Excellent | Excellent | Limited |
| **Learning Curve** | Easy | Moderate | Steep |
| **Ideal For** | Public APIs | Complex UIs | Microservices |
| **Tooling** | Excellent | Good | Good |

---

## Stateless vs Stateful APIs

### Stateless API (REST Preferred)

- Server stores **no session data**
- Every request is **self-contained**
- More **scalable** (can distribute across servers)
- Example: JWT token sent in every request

```javascript
// Every request includes auth token
GET /users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Stateful API

- Server **stores user session**
- Hard to scale horizontally
- Example: Session-based login stored in server memory

```javascript
// Server remembers session
GET /users
Cookie: sessionId=abc123
```

**REST prefers stateless** for better scalability.

---

## Resource Naming & Best Practices

### Use Nouns, Not Verbs
```
❌ /getUsers
❌ /createUser
✅ /users
```

### Use Plural Nouns
```
✅ /users
✅ /products
✅ /orders
```

### Use Nested Resources (When Needed)
```
✅ /users/42/orders
✅ /posts/10/comments
```

### Use Kebab-Case
```
✅ /user-profiles
✅ /order-items
```

### Avoid Deeply Nested Routes
```
❌ /users/1/orders/35/items/7/details
✅ /order-items/7
Keep max 2–3 levels
```

### Use Consistent HTTP Methods
```
GET    → Fetch
POST   → Create
PUT    → Full update
PATCH  → Partial update
DELETE → Remove
```

### Return Proper Status Codes
```
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
404 Not Found
500 Internal Server Error
```

### Provide Clear Error Responses
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 42 not found"
  }
}
```

---

## Interview Tips

- **REST definition:** Resource-based architecture using HTTP methods and URLs
- **REST API:** API built using REST principles with resource-based URLs and HTTP methods
- **RESTful:** API that fully follows REST constraints (stateless, uniform interface, etc.)
- **Key principle:** Stateless, uniform interface, client-server separation
- **HTTP methods:** GET (read), POST (create), PUT/PATCH (update), DELETE (remove)
- **Status codes:** 2xx success, 4xx client error, 5xx server error
- **Versioning:** Use URL versioning (`/api/v1/users`)
- **REST vs GraphQL:** REST = multiple endpoints, GraphQL = single endpoint with flexible queries
- **REST vs gRPC:** REST = JSON over HTTP/1.1, gRPC = Protobuf over HTTP/2 (faster, for microservices)