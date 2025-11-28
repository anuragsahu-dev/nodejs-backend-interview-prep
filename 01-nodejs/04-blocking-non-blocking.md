# Blocking I/O vs Non-Blocking I/O in Node.js

## What is I/O?

I/O = reading/writing external resources (file system, database, network calls, DNS lookup, etc.)

## 1. Blocking I/O (Synchronous I/O)

### Definition

Blocking I/O means the thread waits until the operation completes. The execution is paused — nothing else can run during that time.

### Example (synchronous FS API)

```javascript
const data = fs.readFileSync("file.txt"); // blocks the thread
console.log("After read"); // runs only after file is read
```

### Problem in Node.js

Node.js has one main thread for JS execution. If it gets blocked:

*   Event loop stops
*   All requests wait
*   App becomes slow / frozen

### Why blocking is bad in Node.js?

Because Node.js is designed for high concurrency. Blocking operations kill that advantage.

## 2. Non-Blocking I/O (Asynchronous I/O)

### Definition

Non-blocking I/O does NOT stop the thread. The call is initiated, and Node.js continues executing other code.

Node.js delegates the I/O to:

*   OS kernel (network operations)
*   libuv thread pool (file system, crypto, DNS, compression)

A callback / Promise is triggered when the I/O finishes.

### Example (async FS API)

```javascript
fs.readFile("file.txt", (err, data) => {
  console.log("Done reading");
});
console.log("Continuing execution...");
```

### Benefits

*   Event loop stays free
*   Can handle thousands of concurrent requests
*   High throughput & responsiveness

## 3. Why Node.js uses Non-Blocking I/O?

Node.js is single-threaded for JavaScript, so it offloads heavy I/O to the OS/libuv.

This allows:

*   Non-blocking concurrency
*   Low cost per connection
*   Real-time apps (chat, streaming, APIs, etc.)

## 4. Is Node.js fully non-blocking?

No. Only I/O is non-blocking.

CPU-heavy tasks (loops, crypto, JSON.parse, image/video processing) block the event loop unless offloaded to:

*   Worker Threads
*   Child Processes
*   Native Addons

## Key Definitions

### Blocking I/O

The thread waits for the operation to finish, blocking the event loop and stopping all other work.

### Non-Blocking I/O

The operation is offloaded and the thread continues execution; results are returned via callbacks, promises, or events.