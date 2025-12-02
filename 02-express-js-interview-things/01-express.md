# What is Express.js?

Express.js is a fast, minimalist, unopinionated web framework for Node.js.
It simplifies building servers and APIs using routing, middleware, and easy request/response handling.
Built on top of Node.js http module.

## Key Features (Short)

**Minimal & Flexible:** Only core features included; everything else added via middleware.

**Powerful Routing:** Clean GET/POST/PUT/DELETE routes → perfect for REST APIs.

**Middleware Support:** Authentication, logging, parsing, error handling, etc.

**Templating Engines:** Supports Pug, EJS, Handlebars for dynamic HTML.

**Built-in Error Handling:** Default + custom error handlers.

**CRUD + REST Friendly:** Natural mapping of HTTP → CRUD.

**Huge Ecosystem:** Thousands of middleware/packages.

## How Express.js Works (Short)

**Server Receives Request**
Express listens for incoming HTTP requests (GET, POST, etc.).

**Route Matching**
Path & HTTP method are matched to a defined route.

**Middleware Pipeline**

Runs middleware in sequence

Tasks: logging, parsing JSON, auth, validations

Ends response or calls next().

**Send Response**
Sends HTML, JSON, file, redirect, or error.

**Error Handling (Optional)**
Custom error middleware catches errors and formats responses.

## When & Why to Use Express.js

Building RESTful APIs or microservices.

Need speed, minimalism, and full control.

Prefer JavaScript everywhere (frontend + backend).

Need flexible project structure.

Fast prototyping / MVPs / quick backend setups.

## Advantages

Fast & Lightweight

Highly Flexible (no forced structure)

Large Ecosystem & Community

JavaScript Full-Stack

Ideal for APIs

## Disadvantages

Few Built-In Features (auth, validation, ORM = external libs)

No Standard Project Structure

Possible Middleware Callback Hell (if poorly structured)

Too Minimal for teams that prefer strict conventions.

## Basic Express Server Example

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

// Middleware: Parse JSON bodies
app.use(express.json());

// Middleware: Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Custom Middleware: Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Route: GET /
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express.js!' });
});

// Route: GET /api/users
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];
  res.json({ success: true, data: users });
});

// Route: POST /api/users
app.post('/api/users', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, error: 'Name is required' });
  }
  
  const newUser = { id: Date.now(), name };
  res.status(201).json({ success: true, data: newUser });
});

// Route: GET /api/users/:id
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ success: true, data: { id, name: 'Sample User' } });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```