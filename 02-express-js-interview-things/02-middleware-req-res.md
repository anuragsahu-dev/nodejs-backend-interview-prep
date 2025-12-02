# Request–Response Lifecycle & Middleware in Express

## Request–Response Lifecycle (5 steps — interview-ready)

### Short answer (1–2 lines):
Express receives an HTTP request → passes it through middleware chain → matching route handler runs → controller sends a response → otherwise 404/error middleware handles it. The chain advances with `next()`.

### Detailed 5-step flow (with what to mention in interviews):

#### 1. Client sends HTTP request

Client (browser, mobile app, curl) sends `METHOD /path` to server.

**Mention:** request includes method, path, headers, body (optional).

#### 2. Express receives request & enters middleware chain

Express creates `req`, `res` objects and starts executing middleware in the order they were registered (app-level → router-level → route-level).

**Interview tip:** explain middleware order matters — registration order = execution order.

#### 3. Route matching (path + method)

Express compares request path & method with defined routes. If router mounted at `/api` and request is `/api/users`, router-level routes are considered.

**Mention** route params, query, and wildcard matching.

#### 4. If matched → controller runs → sends response

Controller (or route handler) performs logic (call services, DB), then sends response (`res.send`, `res.json`, `res.status(...).send()`, `res.end()`).

**Always emphasize:** only one response should be sent; calling `res.send` ends response unless streaming.

#### 5. If not matched → 404 or error middleware

If no route matches, typical pattern: call `next()` to go to 404 handler (or `res.status(404).send`) then error middleware if an exception occurs.

Errors thrown or passed via `next(err)` skip to error-handling middleware.

### Key interview points to state:

- The lifecycle is linear and controlled by `next()`.
- Middleware can end the cycle early (e.g., auth denying request).
- Error middleware has 4 args — `(err, req, res, next)` and is executed when `next(err)` is used or when an exception is thrown inside async route (with proper async handlers).

---

## Middleware in Express (clear, interview-friendly)

### Definition (one-liner):
Middleware is a request-processing function that executes before your route handler. It can modify the request/response or move the flow forward using `next()`.

### It uses three args (req, res, next)

**Signature examples:**

```javascript
// normal middleware
function middleware(req, res, next) { /* ... */ }

// arrow
(req, res, next) => { /* ... */ }

// error middleware
function errorHandler(err, req, res, next) { /* ... */ }
```

### Why use middleware? (short bullets)

- Logging (morgan)
- Authentication & authorization
- Input validation (Joi/Zod middleware)
- Body parsing (express.json())
- File uploads (multer)
- Rate limiting, CORS, compression, security headers
- Centralized error handling

---

## Types of middleware (with code + interview answers)

### 1) Application-level

Registered on `app` and runs for all matching requests.

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

**Interview point:** runs in registration order.

### 2) Router-level

Registered on an `express.Router()` instance — useful for grouping routes.

```javascript
const router = express.Router();
router.use(authMiddleware); // applies to routes under this router
router.get('/profile', profileController);
app.use('/users', router);
```

**Interview point:** keeps modules isolated and testable.

### 3) Route-level (inline middleware)

Attached directly to a route.

```javascript
app.post('/secret', authMiddleware, payloadValidation, controller);
```

**Interview point:** good for middleware only used on specific routes.

### 4) Error-handling middleware

Four args: `(err, req, res, next)`.

```javascript
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});
```

**Interview point:** Express identifies this by arg length; use to centralize error responses and logging.

### 5) Built-in middleware

`express.json()`, `express.urlencoded()`, `express.static()`.

### 6) Third-party middleware

`cors`, `helmet`, `morgan`, `express-rate-limit`, `multer`, etc.

---

## Common interview Qs about middleware (with short model answers)

**Q: How does Express determine middleware order?**  
**A:** By the order of `app.use` / `router.use` registration; first registered → executed first.

**Q: Can middleware be asynchronous?**  
**A:** Yes. Use `async` + `try/catch` and call `next(err)` on errors, or use a wrapper to catch rejections.

**Q: How do you conditionally skip middleware?**  
**A:** Call `next()` without sending a response to continue; return early if you want to stop. You can also mount middleware only on certain paths/methods.

---

## next() — why and how it works (deep but simple)

### Definition:
`next()` passes control to the next matching middleware/route in the stack. Without it (and without sending a response), the request will hang.

### Normal usage:

```javascript
app.use((req, res, next) => {
  console.log('middleware 1');
  next(); // continue
});
```

### next(err) usage:

`next(err)` skips remaining non-error middleware and jumps to error-handling middleware.

```javascript
app.use((req, res, next) => {
  if (!req.user) return next(new Error('Unauthorized'));
  next();
});
```

### Async functions caveat (common interview trap):

If an async route throws, Express won't catch it automatically. Use `try/catch` or an async wrapper:

```javascript
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/data', wrap(async (req, res) => {
  const data = await db.find();
  res.json(data);
}));
```

**Interview point:** Always demonstrate knowledge of error propagation in async handlers.

---

## express.json() & express.urlencoded() (detailed)

These are **built-in body-parsing middleware** in Express that parse incoming request bodies and make the data available in `req.body`. Without these, `req.body` would be `undefined`.

### express.json()

**What it does:**
Parses incoming requests with `Content-Type: application/json` and converts the JSON string in the request body into a JavaScript object accessible via `req.body`.

**When to use:**
- Building REST APIs that receive JSON data
- Modern frontend frameworks (React, Vue, Angular) sending JSON
- Mobile apps communicating with backend
- Any API-to-API communication using JSON

**How it works:**
1. Checks if `Content-Type` header is `application/json`
2. Reads the raw request body (which is a stream)
3. Parses the JSON string using `JSON.parse()`
4. Attaches the parsed object to `req.body`
5. Calls `next()` to continue to the next middleware

**Configuration options:**

```javascript
app.use(express.json({
  limit: '10mb',        // Max request body size (default: '100kb')
  strict: true,         // Only parse arrays and objects (default: true)
  type: 'application/json', // Content-Type to parse (default: 'application/json')
  verify: (req, res, buf, encoding) => {
    // Custom verification function (e.g., for webhook signatures)
  }
}));
```

**Example:**

```javascript
// Client sends:
// POST /api/users
// Content-Type: application/json
// Body: {"name": "Alice", "email": "alice@example.com"}

app.use(express.json());

app.post('/api/users', (req, res) => {
  console.log(req.body); // { name: 'Alice', email: 'alice@example.com' }
  console.log(req.body.name); // 'Alice'
  res.json({ success: true, user: req.body });
});
```

**Common issues:**

```javascript
// ❌ Without express.json()
app.post('/api/users', (req, res) => {
  console.log(req.body); // undefined
});

// ✅ With express.json()
app.use(express.json());
app.post('/api/users', (req, res) => {
  console.log(req.body); // { name: 'Alice', ... }
});
```

---

### express.urlencoded({ extended: true })

**What it does:**
Parses incoming requests with `Content-Type: application/x-www-form-urlencoded` (traditional HTML form submissions) and converts the URL-encoded data into a JavaScript object accessible via `req.body`.

**When to use:**
- HTML forms using `<form method="POST">`
- Legacy systems or traditional web applications
- Some third-party webhooks that send form-encoded data
- When you need to support both JSON and form submissions

**How it works:**
1. Checks if `Content-Type` header is `application/x-www-form-urlencoded`
2. Reads the raw request body
3. Parses the URL-encoded string (e.g., `name=Alice&email=alice@example.com`)
4. Converts it to a JavaScript object
5. Attaches the parsed object to `req.body`

**extended: true vs extended: false**

| Option | Library | Supports | Use Case |
|--------|---------|----------|----------|
| `extended: true` | `qs` | Rich objects, nested objects, arrays | Modern apps, complex forms |
| `extended: false` | `querystring` | Simple key-value pairs only | Simple forms, legacy systems |

**Examples:**

```javascript
// extended: true (allows nested objects)
app.use(express.urlencoded({ extended: true }));

// Client sends:
// POST /api/users
// Content-Type: application/x-www-form-urlencoded
// Body: name=Alice&email=alice@example.com&address[city]=NYC&address[zip]=10001

app.post('/api/users', (req, res) => {
  console.log(req.body);
  // {
  //   name: 'Alice',
  //   email: 'alice@example.com',
  //   address: { city: 'NYC', zip: '10001' }
  // }
});
```

```javascript
// extended: false (simple key-value only)
app.use(express.urlencoded({ extended: false }));

// Client sends:
// Body: name=Alice&email=alice@example.com&address[city]=NYC

app.post('/api/users', (req, res) => {
  console.log(req.body);
  // {
  //   name: 'Alice',
  //   email: 'alice@example.com',
  //   'address[city]': 'NYC'  // Not parsed as nested object
  // }
});
```

**Configuration options:**

```javascript
app.use(express.urlencoded({
  extended: true,       // Use qs (true) or querystring (false)
  limit: '10mb',        // Max request body size (default: '100kb')
  parameterLimit: 1000, // Max number of parameters (default: 1000)
  type: 'application/x-www-form-urlencoded' // Content-Type to parse
}));
```

**HTML Form Example:**

```html
<!-- HTML Form -->
<form action="/api/users" method="POST">
  <input type="text" name="name" value="Alice">
  <input type="email" name="email" value="alice@example.com">
  <button type="submit">Submit</button>
</form>
```

```javascript
// Express backend
app.use(express.urlencoded({ extended: true }));

app.post('/api/users', (req, res) => {
  console.log(req.body); // { name: 'Alice', email: 'alice@example.com' }
  res.send('User created!');
});
```

---

### Typical usage (both together):

```javascript
// Register BEFORE routes that need req.body
app.use(express.json());                          // For JSON requests
app.use(express.urlencoded({ extended: true })); // For form submissions

// Now routes can access req.body
app.post('/api/users', (req, res) => {
  // Works for both JSON and form-encoded requests
  const { name, email } = req.body;
  res.json({ success: true, data: { name, email } });
});
```

---

### Size Limits & Security

**Why size limits matter:**
Prevent DoS attacks where attackers send huge payloads to crash your server.

```javascript
// Set appropriate limits based on your use case
app.use(express.json({ limit: '1mb' }));        // API with small JSON payloads
app.use(express.json({ limit: '50mb' }));       // API that accepts large data
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));
```

**Handling size limit errors:**

```javascript
app.use(express.json({ limit: '1mb' }));

app.post('/api/data', (req, res) => {
  // If payload > 1mb, Express will throw an error
  res.json(req.body);
});

// Error handler catches payload too large
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload too large' });
  }
  next(err);
});
```

---

### Content-Type Matching

Both middleware **only parse requests with matching Content-Type headers**.

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Parsed by express.json()
// Content-Type: application/json
// Body: {"name": "Alice"}

// ✅ Parsed by express.urlencoded()
// Content-Type: application/x-www-form-urlencoded
// Body: name=Alice&email=alice@example.com

// ❌ NOT parsed by either (req.body will be undefined)
// Content-Type: text/plain
// Body: Hello World

// ❌ NOT parsed by either (use multer for files)
// Content-Type: multipart/form-data
// Body: (binary file data)
```

---

### Common Interview Questions & Answers

**Q: What happens if you don't use express.json() or express.urlencoded()?**  
**A:** `req.body` will be `undefined`. Express doesn't parse request bodies by default; you must explicitly add body-parsing middleware.

**Q: Can you use both express.json() and express.urlencoded() together?**  
**A:** Yes, and it's common practice. They handle different Content-Types, so they don't conflict. Register both to support JSON APIs and HTML forms.

**Q: What's the difference between extended: true and extended: false?**  
**A:** `extended: true` uses the `qs` library and supports nested objects/arrays. `extended: false` uses the `querystring` library and only supports simple key-value pairs. Use `true` for modern apps.

**Q: Where should you register these middleware?**  
**A:** **Before** any routes that need `req.body`, typically near the top of your app configuration, right after security middleware like `helmet` and `cors`.

**Q: How do you handle file uploads?**  
**A:** `express.json()` and `express.urlencoded()` **cannot** handle file uploads (`multipart/form-data`). Use `multer` middleware instead.

**Q: What's the default size limit?**  
**A:** `100kb` for both. You can increase it using the `limit` option, but be mindful of DoS attacks.

**Q: Can you parse custom Content-Types?**  
**A:** Yes, using the `type` option:

```javascript
app.use(express.json({ 
  type: ['application/json', 'application/vnd.api+json'] 
}));
```

---

### Interview Tips to Mention:

- **Order matters:** Register parsers **before** routes that need `req.body`
- **Security:** Always set appropriate `limit` to prevent DoS attacks
- **Content-Type awareness:** These middleware only parse specific Content-Types
- **Error handling:** Handle `entity.too.large` and JSON parse errors
- **File uploads:** Use `multer` for `multipart/form-data`, not these parsers
- **Performance:** Parsing large bodies can be expensive; validate and limit sizes
- **Modern practice:** Most APIs use `express.json()` exclusively; `urlencoded()` is for HTML forms

---

## app.use vs app.get vs app.all (crisp)

### app.use([path], middleware)

Mounts middleware or router. Not method-specific. Executes for all HTTP methods that match path prefix.

**Example:** `app.use('/api', apiRouter);`

### app.get(path, handler)

Handles only GET requests for the exact route (or pattern).

### app.all(path, handler)

Matches all HTTP methods for the given path (GET, POST, PUT, DELETE, etc.). Useful for common checks like auth for that route.

**Example:** `app.all('/secret', authMiddleware, controller);`

**Interview point:** `app.use('/path', ...)` will also match `/path/subpath` (prefix), while `app.get('/path', ...)` matches exact path pattern per Express routing rules.

---

## express.Router() and Modular Routing

### What is it (one-liner):
`express.Router()` creates an isolated mini-app to group route handlers and middleware.

### Why use routers:

- Organize code (users, posts, auth modules)
- Reuse and test routes separately
- Mount middlewares per module

### Example (clean):

```javascript
// users.router.js
const router = express.Router();
router.get('/', getAllUsers);
router.post('/', createUser);
module.exports = router;

// app.js
const usersRouter = require('./users.router');
app.use('/users', usersRouter);
```

**Interview tip:** Mention route versioning (`app.use('/api/v1', v1Router)`) and separation of concerns (controllers/services/repos).

---

## CORS — Simple vs Preflight (explainable and interview-ready)

### What is CORS?

**Cross-Origin Resource Sharing (CORS)** is a browser security mechanism that controls which origins (domains) can access resources on your server.

By default, browsers block cross-origin requests (e.g., frontend at `https://example.com` calling API at `https://api.example.com`) unless the server explicitly allows it via CORS headers.

### Simple request (no preflight):

**Criteria for a simple request:**
- Method is `GET`, `HEAD`, or `POST`
- Only simple headers are used (e.g., `Accept`, `Accept-Language`, `Content-Language`)
- `Content-Type` is one of:
  - `application/x-www-form-urlencoded`
  - `multipart/form-data`
  - `text/plain`
- No custom headers (like `Authorization`)

**Behavior:** Browser sends the request directly. Server responds with `Access-Control-Allow-Origin` header to indicate if the origin is allowed.

**Example:**
```javascript
// Server response headers
Access-Control-Allow-Origin: https://example.com
```

### Preflight request (OPTIONS):

**Triggered when:**
- Method is `PUT`, `DELETE`, `PATCH`, or other non-simple methods
- Custom headers are used (like `Authorization`, `X-Custom-Header`)
- `Content-Type` is `application/json` (or other non-simple types)

**Behavior:**
1. Browser first sends an **OPTIONS** request (preflight) with:
   - `Access-Control-Request-Method`: The actual method (e.g., `PUT`)
   - `Access-Control-Request-Headers`: Custom headers being sent
2. Server must respond with appropriate CORS headers:
   - `Access-Control-Allow-Origin`: Allowed origin
   - `Access-Control-Allow-Methods`: Allowed methods
   - `Access-Control-Allow-Headers`: Allowed headers
   - `Access-Control-Max-Age`: How long to cache preflight response
3. If preflight succeeds, browser sends the actual request

**Example preflight response:**
```javascript
// Server response to OPTIONS request
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

### Solution (use middleware):

```javascript
const cors = require('cors');

// Allow all origins (not recommended for production)
app.use(cors());

// Allow specific origin
app.use(cors({ origin: 'https://example.com' }));

// Dynamic origin validation
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['https://example.com', 'https://app.example.com'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Key CORS Headers Explained:

| Header | Purpose |
|--------|---------|
| `Access-Control-Allow-Origin` | Specifies which origin(s) can access the resource. Use specific domain or `*` (but not with credentials) |
| `Access-Control-Allow-Methods` | Lists HTTP methods allowed for cross-origin requests |
| `Access-Control-Allow-Headers` | Lists headers that can be used in the actual request |
| `Access-Control-Allow-Credentials` | Set to `true` to allow cookies/auth headers. Cannot use `*` for origin when this is true |
| `Access-Control-Max-Age` | How long (in seconds) the preflight response can be cached |
| `Access-Control-Expose-Headers` | Which response headers the browser can expose to JavaScript |

### Interview points:

- **Explain the difference:** Simple requests go through directly; non-simple requests trigger preflight (OPTIONS).
- **Security:** Never use `Access-Control-Allow-Origin: *` with `credentials: true`. Always validate origins dynamically.
- **Performance:** Use `Access-Control-Max-Age` to cache preflight responses and reduce OPTIONS requests.
- **Common mistake:** Forgetting to handle OPTIONS requests manually if not using `cors` middleware.
- **Credentials:** When sending cookies or Authorization headers, both client (`credentials: 'include'`) and server (`credentials: true`) must opt-in.

### Manual CORS setup (without middleware):

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://example.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
```

---

## Express Error Handling Structure (complete)

### Error handler signature:
`(err, req, res, next)` — must have 4 args.

### Typical pattern:

```javascript
// routes
app.get('/x', async (req, res, next) => {
  try {
    const data = await service();
    res.json(data);
  } catch (err) {
    next(err); // forward to error handler
  }
});

// error handler (last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});
```

### Flow:

Throw or call `next(err)` → Express skips to nearest error middleware → handle/log/respond.

If no error middleware, Express sends default stack in dev or generic message in prod.

### Interview checklist to mention:

- Place error middleware **after** routes.
- Use structured error objects (message, statusCode, code) for consistent API responses.
- For async handlers, use a wrapper to `catch(next)` so unhandled rejections propagate properly.
- Log errors (console, external service like Sentry) and avoid leaking stack traces to clients in production.

---

## MVC / Layered Folder Structure (practical + interviewable)

### MVC (short):

- **Model:** DB schema & queries (e.g., Mongoose models, Prisma).
- **View:** Templates (Pug/EJS) or none for APIs.
- **Controller:** Accepts request, calls service, returns response.

### Better for APIs — Layered architecture:

```
/routes       -> Express routes (map endpoints to controllers)
/controllers  -> Receive req, validate, call services
/services     -> Business logic, orchestration, calls repositories
/repositories -> DB access (ORM/queries)
/middleware   -> auth, validation, logging
/utils        -> helpers (formatting, error classes)
```

### Why this is preferred (interview points):

- Keeps controllers thin & testable.
- Separates business logic from HTTP concerns.
- Makes unit testing easier (mock services/repositories).
- Scales better for large projects.

### Sample basic controller → service flow:

```javascript
// controller
exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (err) { 
    next(err); 
  }
};
```

---

## Middleware Chain Breaking (what it is and how to avoid)

### Definition:
Chain breaking occurs when middleware neither calls `next()` nor sends a response. The request hangs and the client times out.

### Bad example (chain breaking):

```javascript
app.use((req, res, next) => {
  console.log('I forgot next and didn't respond');
  // request will hang
});
```

### How to avoid (best practices):

- Always either `next()` or send a response (`res.send()`, `res.json()`, `res.end()`).
- For async middleware, use `try/catch` and call `next(err)` if something fails.
- Return after `res.send()` to prevent further execution:

```javascript
if (!user) return res.status(401).json({ message: 'Unauth' });
```

- Add timeouts or global error handlers in production to surface stuck requests.
- Add linters or tests that verify middleware calls `next()` or responds.

**Interview tip:** Mention using tools like timeout middleware or external APM to detect long-running requests.

---

## Quick interview-ready bullet summary (memorize these)

- **Lifecycle:** Request → middleware chain → route match → controller → response / 404 / error. `next()` advances.
- **Middleware signature:** `(req, res, next)` / error middleware `(err, req, res, next)`.
- **next(err):** jump to error handlers. `next()` continue normal middleware.
- **Parsers:** `express.json()` → JSON bodies; `express.urlencoded()` → form bodies. Register before routes.
- **app.use vs app.get vs app.all:** `use` mounts middleware/prefix, `get` handles GET, `all` handles all methods for a path.
- **Router:** `express.Router()` for modular routes; mount with `app.use('/path', router)`.
- **CORS preflight:** browser sends OPTIONS for non-simple requests; respond with `Access-Control-Allow-*` or use `cors` middleware.
- **Error handling:** last middleware; 4 args; use consistent error objects; catch async errors and forward with `next()`.
- **Layering:** routes → controllers → services → repositories for clean, testable design.
- **Chain breaking:** always `next()` or `res.*`. Use async wrappers.