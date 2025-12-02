# Authentication Theory (Full Stack)

## 1. Authentication vs Authorization

### Authentication (AuthN)

It verifies who the user is using credentials like email/password, Google OAuth, OTP, etc.

It is the identity-checking step.

### Authorization (AuthZ)

It decides what the authenticated user can access.

Based on permissions, roles, or policies.

Example: Only admins can delete users, normal users cannot.

**📌 AuthN happens first, then AuthZ.**

---

## 2. Password Hashing (Theory)

### Why hash passwords?

- Storing plain passwords is extremely unsafe.
- Hashing transforms a password into a unique, irreversible string.
- Even developers or attackers with DB access cannot recover the original password.

### What is a salt?

A salt is a random value added to the password before hashing.

It makes every hash unique even if two users share the same password.

**Protects against:**
- Rainbow table attacks
- Precomputed hash attacks
- Bulk brute-force of common passwords

---

## 3. What is JWT?

JWT (JSON Web Token) is a digitally signed token used for stateless authentication.

**It contains:**
- **Header** (algorithm + type)
- **Payload** (user id, role, expiration)
- **Signature** (verifies authenticity)

Server does not store the token — only verifies the signature when receiving it.

Used widely in modern APIs, SPAs, mobile apps.

---

## 4. JWT Flow — Access + Refresh Tokens

### Access Token

- Short-lived (10–15 min)
- Sent with every API request
- Contains user identity + role
- If stolen, damage is limited because it expires quickly

### Refresh Token

- Long-lived (7–30 days)
- Used only to get new access tokens
- Stored in httpOnly Secure cookie (hidden from JS)

### Flow Summary

1. User logs in → validates credentials
2. Server issues:
   - `accessToken` (short-lived)
   - `refreshToken` (long-lived)
3. Access token is used for APIs
4. When access token expires → frontend silently calls `/refresh`
5. Refresh token gives new access token
6. On logout → refresh token is deleted from cookie + DB invalidated

This combination gives both security and good UX (no frequent logins).

---

## 5. Why Refresh Tokens Exist

- Access tokens must expire quickly for security.
- If access token expired and user must re-login every time → terrible UX.
- Refresh token allows renewing access tokens without logging in again.

**Also helps with:**
- Multi-device session control
- Safe token rotation
- Revoking access on logout
- Handling stolen tokens more safely

---

## 6. Token Rotation & Invalidation

### Token Rotation

On every refresh request:
1. Create a new refresh token
2. Mark the old one as invalid or obsolete

**This protects from replay attacks:**
- If a hacker uses an old refresh token → server detects reuse → blocks session

### Invalidation

- On logout → delete refresh token from DB/Redis
- On password change → invalidate all sessions
- On suspicious activity → blacklist or delete tokens

This is how modern apps maintain security while staying stateless.

**Why this matters:**
- **Replay attack prevention:** If an attacker steals an old refresh token and tries to use it, the server immediately detects the reuse because that token was already rotated out. This triggers a security response (like invalidating all sessions for that user).
- **Stolen token mitigation:** Even if a refresh token is compromised, it becomes useless after the next legitimate refresh, limiting the window of vulnerability.
- **Session control:** Allows precise control over active sessions across devices. You can track which refresh tokens are valid and revoke them individually or in bulk.
- **Compliance:** Many security standards (like OAuth 2.0 BCP) recommend or require token rotation for production systems.

**Implementation tip:**
Store refresh tokens in a database or Redis with metadata like:
- Device info
- IP address
- Last used timestamp
- Rotation count

This enables advanced features like:
- "Log out all devices"
- "View active sessions"
- Detecting suspicious login patterns

---

## 7. Cookies in Modern Authentication

This is the most important part — now explained with the perfect balance of detail and simplicity.

A cookie is usually a tiny text file stored in your web browser. A cookie was initially used to store information about the websites that you visit. But with the advances in technology, a cookie can track your web activities and retrieve your content preferences.

**We use `cookie-parser` package for reading cookies from the request.**

### 7.1 Why cookies are used in authentication?

- Cookies automatically travel with requests → perfect for refresh tokens.
- They allow backend to manage authentication without exposing sensitive values to JavaScript.
- They support important security flags that protect tokens from attacks.

### 7.2 Where tokens are stored today

**✔️ Refresh Token → HTTP-only Secure Cookie**
- Hidden from JavaScript (XSS-safe)
- Automatically sent to backend
- Long expiry
- Works perfectly for `/refresh` endpoint

**✔️ Access Token → In Memory (Best Practice)**
- Not stored in localStorage/sessionStorage → prevents XSS theft
- Sent manually in `Authorization` header
- Removed when page reloads → safe
- (For SSR apps you can store access in httpOnly cookie, but requires CSRF protection.)

### 7.3 Important Cookie Flags

| Flag | Why it matters |
|------|----------------|
| `HttpOnly` | JS can't read cookie → prevents XSS stealing refresh tokens |
| `Secure` | Cookie only sent on HTTPS → protects in transit |
| `SameSite=Lax` | Best balance — blocks cross-site automatic requests |
| `SameSite=None` | Required for cross-domain APIs; must pair with Secure |
| `MaxAge` | Controls how long refresh token remains valid |
| `Path` | Restrict cookie usage to specific endpoints (`/auth/refresh`) |
| `Signed` | Optional — helps prevent cookie tampering |

These flags ensure cookies remain safe across browsers, devices, and environments.

**Security Deep Dive:**

**HttpOnly + XSS Protection:**
- Without `HttpOnly`: Malicious script can run `document.cookie` and steal your refresh token
- With `HttpOnly`: Even if XSS vulnerability exists, the token remains inaccessible to JavaScript
- This is why refresh tokens MUST be HttpOnly

**Secure + HTTPS:**
- Without `Secure`: Cookie sent over HTTP → vulnerable to man-in-the-middle attacks
- With `Secure`: Cookie only transmitted over encrypted HTTPS connections
- Always use in production

**SameSite Explained:**
- `SameSite=Strict`: Cookie never sent on cross-site requests (even clicking a link). Too restrictive for most apps.
- `SameSite=Lax`: Cookie sent on top-level navigation (clicking links) but not on cross-site POST/fetch. Good default.
- `SameSite=None`: Cookie sent on all cross-site requests. Required when frontend and backend are on different domains (e.g., `app.example.com` → `api.example.com`). Must pair with `Secure`.

**Real-world scenario:**
```
Frontend: https://myapp.com
Backend: https://api.myapp.com

Cookie settings needed:
{
  httpOnly: true,
  secure: true,
  sameSite: "none"  // Required because different domains
}
```

**Path restriction:**
- Setting `path: "/auth/refresh"` means cookie only sent to that endpoint
- Reduces attack surface
- Prevents accidental exposure to other routes

### 7.4 Minimal backend cookie examples

**Setting a cookie:**
```javascript
res.cookie("refresh", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
});
```

**Reading a cookie:**
```javascript
const refresh = req.cookies.refresh;
```

**Clearing a cookie:**
```javascript
res.clearCookie("refresh", { sameSite: "none", secure: true });
```

Short and effective.

### 7.5 Frontend use

All protected requests must include cookies:

```javascript
axios.get("/api/user", { withCredentials: true });
```

or

```javascript
fetch("/api/user", { credentials: "include" });
```

Without this, cookies won't be sent.

### 7.6 CSRF Impact

If you store access token in cookie:
- Browser automatically sends it → attacker site could trigger unwanted requests

**Use:**
- `SameSite=Lax`
- CSRF token header
- OR store access token in memory

This is why the modern standard = **access in memory, refresh in cookie**.

---

## 8. Refresh Token Storage — DB vs Redis

### Database
- Good for tracking device sessions
- Simple invalidation
- Persisted across restarts

### Redis
- Very fast
- Auto-expiring TTL
- Perfect for high scale
- Enables instant logout across distributed systems

---

## 9. Session-Based Auth

### What are sessions?

- Server creates a session record (sessionId, userId, expiry)
- Sends sessionId in cookie
- Browser auto-sends it on every request

### Benefits:
- Strong security
- Server fully controls sessions (easy invalidation)
- Perfect for use cases like dashboards, admin panels, monolithic apps

### Downside:
- Server must store sessions (stateful)
- Not ideal for large distributed architectures

---

## 10. Google OAuth 2.0 Flow

1. User clicks "Sign in with Google"
2. Redirected to Google consent screen
3. User approves access → Google returns authorization code
4. Backend exchanges code for:
   - Access token
   - Refresh token (Google side)
   - ID token (JWT containing user identity)
5. Backend verifies ID token signature
6. Create user if not exists
7. Generate your app's own JWT/session

This flow is built on OIDC, which provides reliable user identity.

---

## 11. OAuth vs OIDC

### OAuth 2.0
- Delegated authorization
- Used for: "Allow app X to access your Google Drive"

### OIDC
- Authentication layer built on OAuth
- Gives user identity (via ID token)
- Used for: "Login with Google"

---

## 12. RBAC (Role-Based Access Control)

### Idea:
- Users are assigned roles
- Roles define permissions
- Permissions applied through middleware

### Typical roles:
- `user`
- `admin`
- `super-admin`
- `manager`

### Flow:
1. User logs in → backend includes role in JWT
2. Protect route with RBAC middleware
3. Middleware checks if `user.role` is allowed

### Short middleware:
```javascript
const allow = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.sendStatus(403);
  next();
};
```

---

## 13. When to Use Session Auth vs JWT Auth

### Use Session Auth when:
- Server-rendered apps (EJS, SSR)
- Admin panels
- Corporate apps
- Low number of devices

### Use JWT Auth when:
- SPA (React, Next.js, Vue)
- Mobile apps
- Public APIs
- Microservices
- Multi-device logins

---

## 14. Session Storage & Stateless vs Stateful Authentication

### Session Storage Mechanisms

Session data can be stored in different ways depending on your application's needs:

#### 1. In-Memory Storage (Default)
- Sessions stored in server RAM
- **Pros:** Very fast, simple setup
- **Cons:** Lost on server restart, doesn't work with multiple servers
- **Use case:** Development, single-server apps

#### 2. Database Storage (PostgreSQL, MongoDB)
- Sessions stored in database tables/collections
- **Pros:** Persistent, survives restarts, supports multiple servers
- **Cons:** Slower than memory, adds DB load
- **Use case:** Production apps with moderate traffic

#### 3. Redis Storage (Recommended for Production)
- Sessions stored in Redis (in-memory database)
- **Pros:** Very fast, persistent, distributed, auto-expiry with TTL
- **Cons:** Requires Redis server
- **Use case:** High-traffic production apps, microservices

#### 4. File System Storage
- Sessions stored as files on disk
- **Pros:** Simple, persistent
- **Cons:** Slow, not scalable, file system issues
- **Use case:** Rarely used, only for very small apps

---

### Stateless vs Stateful Authentication (Deep Comparison)

#### Stateful Authentication (Session-Based)

**How it works:**
1. User logs in with credentials
2. Server creates session object with user data
3. Server stores session in memory/DB/Redis
4. Server sends `sessionId` to client in cookie
5. Client sends `sessionId` with every request
6. Server looks up session by `sessionId` to verify user

**Characteristics:**
- Server **stores** session data
- Server **maintains state** of logged-in users
- Session data can be modified server-side anytime
- Easy to invalidate sessions immediately

**Pros:**
- ✅ Server has full control over sessions
- ✅ Can instantly revoke access (logout works immediately)
- ✅ Can store large amounts of user data in session
- ✅ Easy to implement "remember me" functionality
- ✅ Can track active users in real-time
- ✅ Better for server-rendered apps (SSR)

**Cons:**
- ❌ Server must store all sessions (memory/storage cost)
- ❌ Harder to scale horizontally (need shared session store)
- ❌ Session lookup on every request (slight performance hit)
- ❌ Not ideal for distributed systems

---

#### Stateless Authentication (JWT-Based)

**How it works:**
1. User logs in with credentials
2. Server creates JWT containing user data
3. Server signs JWT but **doesn't store it**
4. Server sends JWT to client
5. Client sends JWT with every request
6. Server verifies JWT signature (no database lookup)

**Characteristics:**
- Server **doesn't store** any session data
- Server is **stateless** (no memory of past requests)
- All user info is in the token itself
- Token can't be modified server-side after creation

**Pros:**
- ✅ No server-side storage needed (saves memory/DB)
- ✅ Easy to scale horizontally (any server can verify token)
- ✅ Perfect for distributed systems and microservices
- ✅ Works great with mobile apps and SPAs
- ✅ No database lookup on every request (faster)

**Cons:**
- ❌ Can't instantly revoke tokens (must wait for expiry)
- ❌ Token size limited (can't store large data)
- ❌ Logout requires workarounds (blacklist, short expiry)
- ❌ If token stolen, it's valid until expiry

---

### Comparison Table

| Feature | Stateful (Session) | Stateless (JWT) |
|---------|-------------------|-----------------|
| **Server Storage** | Required | Not required |
| **Scalability** | Harder (need shared store) | Easier (any server works) |
| **Logout** | Instant | Delayed (until expiry) |
| **Session Control** | Full control | Limited control |
| **Performance** | DB lookup per request | No lookup (faster) |
| **Data Storage** | Can store large data | Limited by token size |
| **Best For** | Monoliths, SSR, Admin panels | SPAs, Mobile, Microservices |
| **Revocation** | Easy (delete session) | Hard (need blacklist) |

---

### Stateful Authentication Example (Express + Sessions)

#### Example 1: In-Memory Session Storage (Development)

```javascript
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration (in-memory)
app.use(session({
  secret: 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Fake user database
const users = [
  { id: 1, email: 'alice@example.com', password: '$2b$10$...' }, // hashed password
  { id: 2, email: 'bob@example.com', password: '$2b$10$...' }
];

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create session
  req.session.userId = user.id;
  req.session.email = user.email;
  
  res.json({ message: 'Logged in successfully', user: { id: user.id, email: user.email } });
});

// Protected route
app.get('/profile', (req, res) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // User is authenticated, return profile
  res.json({
    userId: req.session.userId,
    email: req.session.email
  });
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // default session cookie name
    res.json({ message: 'Logged out successfully' });
  });
});

// Auth middleware (reusable)
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Use middleware on protected routes
app.get('/dashboard', requireAuth, (req, res) => {
  res.json({ message: 'Welcome to dashboard', userId: req.session.userId });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

#### Example 2: Redis Session Storage (Production)

```javascript
import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import bcrypt from 'bcrypt';

const app = express();

// Create Redis client
const redisClient = createClient({
  host: 'localhost',
  port: 6379
});

redisClient.connect().catch(console.error);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration with Redis
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Login route (same as above)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Find user in database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create session (stored in Redis)
  req.session.userId = user.id;
  req.session.email = user.email;
  req.session.role = user.role;
  
  res.json({ 
    message: 'Logged in successfully', 
    user: { id: user.id, email: user.email, role: user.role } 
  });
});

// View all active sessions (admin feature)
app.get('/admin/sessions', async (req, res) => {
  const keys = await redisClient.keys('sess:*');
  const sessions = [];
  
  for (const key of keys) {
    const sessionData = await redisClient.get(key);
    sessions.push(JSON.parse(sessionData));
  }
  
  res.json({ activeSessions: sessions.length, sessions });
});

// Logout from all devices
app.post('/logout-all', async (req, res) => {
  const userId = req.session.userId;
  
  // Get all session keys
  const keys = await redisClient.keys('sess:*');
  
  // Delete sessions for this user
  for (const key of keys) {
    const sessionData = await redisClient.get(key);
    const session = JSON.parse(sessionData);
    if (session.userId === userId) {
      await redisClient.del(key);
    }
  }
  
  res.json({ message: 'Logged out from all devices' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

### Key Differences in Practice

**Stateful (Session) Example:**
```javascript
// Login creates session in Redis/DB
req.session.userId = user.id;

// Every request looks up session
if (!req.session.userId) return res.status(401);

// Logout deletes session immediately
req.session.destroy();
```

**Stateless (JWT) Example:**
```javascript
// Login creates JWT (no storage)
const token = jwt.sign({ userId: user.id }, SECRET);

// Every request verifies JWT signature (no lookup)
const decoded = jwt.verify(token, SECRET);

// Logout can't delete token (it's on client)
// Must wait for expiry or use blacklist
```

---

### When to Choose Which?

**Choose Stateful (Sessions) when:**
- Building traditional web apps with server-side rendering
- Need instant logout/session revocation
- Building admin panels or internal tools
- Single server or can use shared Redis
- Need to store lots of user data in session
- Security is more important than scalability

**Choose Stateless (JWT) when:**
- Building SPAs (React, Vue, Angular)
- Building mobile apps
- Building microservices architecture
- Need to scale horizontally across many servers
- Building public APIs
- Performance is critical (no DB lookup)

**Hybrid Approach (Best of Both):**
Many modern apps use both:
- **Access token (JWT):** Stateless, short-lived, for API requests
- **Refresh token (Session):** Stateful, long-lived, stored in Redis
- This gives you JWT's performance + Session's control

---

## Modern Best-Practice Authentication Setup (2025 Standard)

This is the recommended setup today:

- ✔️ Access token in memory (never localStorage)
- ✔️ Refresh token in HTTP-only Secure SameSite=None cookie
- ✔️ Refresh token rotation
- ✔️ Device/session tracking in DB/Redis
- ✔️ Google OAuth (OIDC) for social login
- ✔️ RBAC for permissions
- ✔️ 10–15 min access tokens
- ✔️ 7–30 day refresh tokens

This balances security, performance, and user experience.