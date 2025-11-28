# What is Node.js?

Node.js is a **server-side JavaScript runtime** built on top of two major components: **V8** and **libuv**.  
It uses an **event-driven**, **non-blocking**, and **asynchronous** architecture that allows it to handle **thousands of concurrent operations** without blocking the main JavaScript thread.

- Fast and scalable  
- Single-threaded JavaScript execution  
- Uses libuv and OS for async work  
- Great for APIs, real-time apps, streaming, and microservices  

---

## Short Interview Definition

**Node.js is a server-side JavaScript runtime built on V8 and libuv, using an event-driven non-blocking architecture to efficiently handle concurrent operations.**

---

# What Happens When You Run `node index.js`?

1. **OS creates process**  
2. **Node initializes V8 and libuv**  
3. **Node executes top-level code** in the file  
4. **Async tasks are registered** (timers, I/O, etc.)  
5. **Event loop starts**  
6. **Node exits** when event loop has no pending work  

---

# Node.js Major Components

## 1. V8 (JavaScript Engine)

V8 is Google’s high-performance JavaScript engine used by Chrome and Node.js.

### Responsibilities
- Compiles JavaScript → **machine code**
- Executes JavaScript fast
- Performs optimizations (JIT)
- Handles heap allocation & garbage collection

### Short Interview Definition
**V8 is Google’s JS engine that compiles JavaScript into machine code for fast execution.**

## 2. libuv (C Library)

libuv is a **multi-platform C library** that provides Node.js its asynchronous power.

### Responsibilities
- Event Loop  
- Thread Pool  
- Filesystem operations  
- DNS operations  
- TCP/UDP networking  
- Timers  
- Cross-platform async I/O  

### Why it matters  
libuv lets Node.js offload heavy or slow operations away from the JS thread.

### Short Interview Definition
**libuv is a C library that powers Node.js’s event loop, thread pool, and asynchronous I/O capabilities.**

---

# Why Node.js Is Single-Threaded But Still Scalable

- **JavaScript runs on one thread** (Main Thread)
- **Heavy tasks run on:**
  - **libuv thread pool** (File I/O, Crypto, Compression)
  - **OS async operations** (Network I/O)
- **Event loop schedules callbacks** back to the main thread
- **Non-blocking architecture** avoids waiting for slow tasks

**This makes Node.js highly scalable despite being single-threaded.**

---

# What is Concurrency in Node.js?

**Concurrency** means handling **multiple operations at the same time** without waiting for one to finish before starting the next.

Even though JavaScript is single-threaded, Node.js achieves concurrency through:

- Non-blocking I/O  
- Event Loop  
- libuv thread pool  
- OS asynchronous operations  

### Short Interview Definition
**Concurrency in Node.js is handling multiple operations at the same time using non-blocking I/O and the event loop—even though JavaScript runs on a single thread.**

---

# Event Loop — Overview

The **event loop** is the heart of Node.js that decides **when callbacks are executed**.  
It runs continuously in cycles called **phases**, processing different types of callbacks in each phase.

### Event Loop High-Level Box Diagram

   ┌───────────────────────────────────┐
   │           Timers Phase            │
   │      (setTimeout, setInterval)    │
   └─────────────────┬─────────────────┘
                     │
   ┌─────────────────▼─────────────────┐
   │        Pending Callbacks          │
   │      (System ops, errors)         │
   └─────────────────┬─────────────────┘
                     │
   ┌─────────────────▼─────────────────┐
   │           Poll Phase              │
   │   (I/O Callbacks, Connections)    │
   └─────────────────┬─────────────────┘
                     │
   ┌─────────────────▼─────────────────┐
   │           Check Phase             │
   │         (setImmediate)            │
   └─────────────────┬─────────────────┘
                     │
   ┌─────────────────▼─────────────────┐
   │         Close Callbacks           │
   │       (socket.on 'close')         │
   └───────────────────────────────────┘


The loop continues until no tasks remain, after which Node.js exits.

---

# Thread Pool (libuv Worker Threads)

Node.js uses a **libuv-managed thread pool** to run expensive operations in the background.

- **Default size:** 4 threads  
- Each thread runs **one task at a time**  
- Used for:
  - Filesystem operations (`fs.*`)
  - Crypto operations (pbkdf2, scrypt, etc.)
  - DNS lookups (user-space)
  - Compression
  - Native addon work

These tasks run in background threads, and when completed, callbacks return to the **event loop**, keeping JavaScript non-blocking.

---

## Short Interview Definition

**Thread Pool in Node.js is a set of background worker threads provided by libuv to handle expensive tasks so the main JavaScript thread remains non-blocking.**

---

# Thread Pool Example Outputs

### Source Code 1 Output (4 crypto tasks, default 4-thread pool)

- 2195ms Password 4 Done  
- 2209ms Password 3 Done  
- 2306ms Password 1 Done  
- 2352ms Password 2 Done  

Explanation:  
4 threads → 4 tasks run in parallel → finish around same time.

---

### Source Code 2 Output (5 crypto tasks, default 4-thread pool)

- 1975ms Password 1 Done  
- 2097ms Password 3 Done  
- 2185ms Password 2 Done  
- 2357ms Password 4 Done  
- 3813ms Password 5 Done  

Explanation:  
- First 4 tasks use the 4 threads  
- Task 5 waits for a free thread → finishes much later  

**1–4 tasks complete in same average time, 5th task starts only when a thread becomes free.**

---

# Flow of setTimeout() in Node.js

1. `setTimeout()` registered in JS  
2. libuv stores timer information  
3. When delay finishes → callback becomes ready  
4. In **Timers Phase**, callback is queued  
5. V8 executes callback on main thread  

### Example

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer Finished");
}, 1000);

console.log("End");
```

**Output:**
```
Start
End
Timer Finished
```

---

# Important Interview Questions (Part 1)

**1. What is Node.js?**  
A JS runtime using V8 and non-blocking I/O.

**2. What are the two major components of Node.js?**  
V8 and libuv.

**3. What is libuv?**  
A C library that provides the event loop, thread pool, and async features.

**4. What is the default size of the thread pool?**  
4 threads (configurable).

**5. How does Node.js remain non-blocking?**  
By delegating heavy work to libuv/OS while JS runs only callbacks.

**6. Does all async I/O use the thread pool?**  
No — network I/O is mostly handled by the OS kernel.

**7. What is concurrency in Node.js?**  
Handling multiple operations at the same time using non-blocking I/O and the event loop.

**8. What is V8?**  
Google’s JS engine that compiles JS to machine code.

---

# Quick Snippets

### Change thread pool size
```bash
UV_THREADPOOL_SIZE=8 node app.js
```

### Basic Timer Example
```js
console.log('A');
setTimeout(() => console.log('B'), 0);
console.log('C');
// Output: A C B
```
