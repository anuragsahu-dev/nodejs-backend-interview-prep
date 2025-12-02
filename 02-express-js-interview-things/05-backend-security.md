# Backend Security – Theory Notes (Interview Ready)

## 1. CORS (Cross-Origin Resource Sharing)

### Definition

CORS is a browser security mechanism that controls which origins (domains/ports/protocols) are allowed to interact with your server. It prevents unauthorized cross-origin requests, protecting the browser from malicious sites trying to access a different site's resources. The server specifies allowed origins, methods, headers, etc., via response headers.

### Why CORS Exists

Browsers follow the **Same-Origin Policy (SOP)**, meaning a browser page can only access resources from the same domain, port, and protocol. CORS relaxes SOP safely when the server explicitly allows it.

### Simple Request vs Preflight Request

#### Simple Request

Browser directly sends request without preflight if:

- Method is: `GET`, `POST`, `HEAD`
- Custom headers: NONE except `Content-Type` as `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`
- No credentials

**Flow:**
```
Browser → Request → Server → Response
```

#### Preflight Request (OPTIONS request)

Triggered when:

- Using `PUT`, `PATCH`, `DELETE`
- Custom headers like: `Authorization`, `X-Token`
- `Content-Type: application/json`
- Sending cookies (`withCredentials: true`)

**Flow:**

1. Browser first sends an `OPTIONS` request
2. Server replies with headers like:
   - `Access-Control-Allow-Origin`
   - `Access-Control-Allow-Methods`
   - `Access-Control-Allow-Headers`
   - `Access-Control-Allow-Credentials`
3. If allowed → browser sends the actual request

**Purpose:** Browser checks "Is this allowed before I send sensitive data?"

### How to Design a Secure CORS Policy

**Don't do:**
```
Access-Control-Allow-Origin: * with credentials
```

**Best practice:**

- Allow specific domains only: `https://yourfrontend.com`
- Restrict methods & headers
- Set `Access-Control-Allow-Credentials: true` only if required
- Avoid wildcards in production

**Interview line:**
> "CORS is a browser-level protection. Servers use CORS headers to explicitly allow which origins, methods, or headers can access their resources."

---

## 2. Helmet

### Definition

Helmet is a collection of security-focused HTTP headers that protect the app from common attacks.

### What Helmet Protects You From

- **XSS Protection** → via `contentSecurityPolicy`
- **Clickjacking** → via `X-Frame-Options`
- **MIME-sniffing** → via `X-Content-Type-Options`
- **HTTPS enforcement** → via `Strict-Transport-Security`
- **HSTS** → prevents downgrade attacks
- **Cross-domain policies** → via `Cross-Origin-Embedder-Policy`, etc.

**Interview line:**
> "Helmet adds multiple pre-configured headers that reduce attack surface against XSS, clickjacking, MIME sniffing, and protocol downgrade attacks."

---

## 3. HPP (HTTP Parameter Pollution)

### Definition

HPP is an attack where an attacker sends duplicate query or body parameters to confuse logic.

**Example attack:**
```
/update?role=user&role=admin
```

If backend reads last occurrence → attacker may elevate privileges.

### Purpose of HPP Middleware

It normalizes parameters, allowing only the first or a single instance of the key.

**Interview line:**
> "HPP prevents attackers from bypassing validation or authorization using duplicated parameters."

---

## 4. Rate Limiting & Brute-Force Protection

### Definition

Rate limiting controls the number of requests allowed per IP/user in a given timeframe to prevent:

- DDoS attacks
- Bruteforce login attempts
- API abuse
- Resource exhaustion

### How It Works Internally

1. Each IP/user gets a counter
2. Counter resets after a time window (e.g., 1 minute)
3. If limit exceeded → server blocks or slows down the user

### Methods Used

- **In-memory counters** → fast but resets on server restart
- **Redis** → best for distributed systems
- **Token bucket / Leaky bucket** algorithms for smooth throttling

### Brute-Force Protection

- Limit login attempts per IP
- Temporarily block the user
- Require CAPTCHA after repeated failures

**Interview line:**
> "I use rate limiting to prevent DDoS and brute-force attacks, usually backed by Redis for distributed environments."

### Rate Limiting Flow

1. Client sends request
2. Rate-limiter middleware runs first
3. Middleware generates Redis key (`rate-limit:<id>`)
4. Middleware fetches current count/tokens
5. Redis increments or refills tokens
6. Check if request limit is crossed
7. If allowed → continue to route
8. If blocked → send `429 Too Many Requests`

**Package:**
```bash
npm i express-rate-limit rate-limit-redis
```

---

## 5. XSS (Cross-Site Scripting)

### Definition

XSS is when an attacker injects malicious JavaScript into web pages viewed by users.

### Types

#### Stored XSS

- Malicious script is stored in DB → served to every user
- Example: Comment sections

#### Reflected XSS

- Script comes via URL/query params
- Example:
  ```
  /search?q=<script>alert(1)</script>
  ```

### Prevention

- Escape output
- Use a strong CSP
- Input validation
- Use libraries like `sanitize-html`

---

## 6. CSRF (Cross-Site Request Forgery)

### Definition

CSRF tricks a user's browser into sending unauthorized actions to a website where they are logged in.

### Example

1. User logged into `bank.com`
2. Attacker makes the user visit a page that triggers:
   ```
   POST https://bank.com/transfer?amount=5000
   ```
3. Browser sends cookies automatically → request succeeds

### Prevention

- CSRF Tokens (double submit cookies)
- SameSite cookies set to `Lax` or `Strict`
- Use JWT in `Authorization` header instead of cookies

---

## 7. SQL Injection

### Definition

Injection attack where attackers inject SQL queries into input fields to manipulate the database.

**Example vulnerable query:**
```sql
SELECT * FROM users WHERE email = '${input}'
```

**Attack:**
```javascript
input = "' OR '1'='1"
```

### Impact

- Bypass authentication
- Delete tables
- Dump database

### Prevention

- Prepared statements / parameterized queries
- ORM (Prisma, Sequelize)
- Strict input validation

---

## 8. NoSQL Injection (MongoDB Injection)

### Definition

Attackers inject query operators into NoSQL queries like MongoDB.

**Example:**
```javascript
{ "email": req.body.email }
```

**Attack:**
```javascript
email: { "$gt": "" }
```

This returns all users because `$gt` matches everything.

### Impact

- Login bypass
- Unauthorized data access

### Prevention

- Validate payload types
- Disallow nested objects in inputs
- Use schema validators (Joi, Zod)
- Use strict query building

---

## 9. API Key Security

### Key Rules

- Never store API keys in code or Git
- Rotate keys regularly
- Limit by:
  - IP
  - Domain
  - Rate limit
  - Scope (read/write)

**Interview line:**
> "API Keys should be stored in env variables, scoped with permissions, and rotated regularly."

---

## 10. Content Security Policy (CSP)

### Definition

CSP is an HTTP header that defines which resources the browser is allowed to load.

### It Prevents

- XSS
- Executing malicious inline scripts
- Loading scripts from unknown domains

**Example:**
```
default-src 'self'
script-src 'self' https://trusted.cdn.com
```

---

## 11. Secrets Management

### Best Practices

- Use `.env` files or secret managers (AWS Secrets Manager, Vault)
- Don't hardcode passwords, JWT secrets
- Rotate secrets periodically
- Use different secrets for dev and prod

---

## 12. Secure Password Policies

### Good Policies

- Minimum 8–12 characters
- Mix of upper/lowercase, numbers, symbols
- No dictionary words
- Hash with `bcrypt` / `argon2`
- Use salt
- Never store plaintext passwords

---

## 13. Best Practices for Protecting APIs

- Use HTTPS always
- Rate limiting + IP blocking
- Validate input using Joi/Zod
- Sanitize input (XSS protection)
- Use proper CORS config
- Implement RBAC/permissions
- Avoid sending sensitive data in JWT payload
- Use `helmet()`
- Use strong hashing for passwords
- Log suspicious activity
- Limit file uploads size
- Avoid exposing stack traces in production

**Interview line:**
> "I protect my APIs using: validation, sanitization, rate limiting, CORS, Helmet, secure headers, HTTPS, RBAC, and safe authentication & token management."
