# Modules in Node.js

## What is a Module?

A module in Node.js is a reusable block of code (functions, variables, classes, objects) that is encapsulated and can be imported or exported across files. Each file in Node.js is treated as a separate module.

**Benefits:**
- Keeps code organized
- Avoids global variable pollution
- Enables code reusability

## Module Systems in Node.js

Node.js uses a module system to load, manage, and execute modules.

Node.js supports two module systems:

### 1. CommonJS (CJS)
- Default module system in Node.js
- Uses `require()` to import
- Uses `module.exports` / `exports` to export
- Loaded synchronously
- Works in `.js` files by default

### 2. ES Modules (ESM)
- Modern JavaScript module system
- Uses `import` and `export`
- Loaded asynchronously
- Works when:
  - File extension is `.mjs`, or
  - `"type": "module"` is set in `package.json`

## How Node's Module System Works

When importing a module, Node.js:
1. Resolves the module path
2. Wraps the module in a function (Module Wrapper)
3. Caches the module after first load
4. Returns exported values

## Built-in Node.js Modules

### 1. `fs` (File System)
Used to interact with files and directories.

**Use cases:** Reading/writing files, creating/removing folders, watching file changes

```javascript
import { readFile } from "node:fs/promises";
const data = await readFile("info.txt", "utf8");
```

### 2. `path`
Used to work with file paths in a cross-platform way.

**Use cases:** Join paths, resolve absolute paths, extract file extensions

```javascript
import path from "node:path";
const result = path.join(__dirname, "uploads");
```

### 3. `http`
Used to create raw HTTP servers.

**Use cases:** Building APIs, creating basic web servers, custom routing

```javascript
import http from "node:http";
http.createServer((req, res) => res.end("Hello")).listen(3000);
```

### 4. `events`
Implements the EventEmitter class for pub/sub patterns.

**Use cases:** Custom events, handling async flows, core Node.js internals

```javascript
import EventEmitter from "node:events";
const emitter = new EventEmitter();
emitter.on("start", () => console.log("Started"));
emitter.emit("start");
```

### 5. `crypto`
Used for cryptographic operations.

**Use cases:** Hashing passwords, generating random tokens, encrypt/decrypt operations

```javascript
import crypto from "node:crypto";
const hash = crypto.createHash("sha256").update("data").digest("hex");
```

### 6. `os`
Provides information about the operating system.

**Use cases:** CPU details, memory availability, network interfaces

```javascript
import os from "node:os";
console.log(os.cpus());
```

## Summary

- **Module:** A self-contained file that exports and imports code
- **Module System:** Mechanism Node.js uses to load modules (CommonJS and ESM)
- **Built-in Modules:** `fs`, `path`, `http`, `events`, `crypto`, `os`, etc.