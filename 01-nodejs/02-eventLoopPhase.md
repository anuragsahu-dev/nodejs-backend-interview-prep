# Part 2 — Event Loop Phases, Microtasks, process.nextTick(), setTimeout vs setImmediate

Part-2 focuses fully on:
- Event Loop phases  
- Microtask queues  
- process.nextTick()  
- setTimeout() vs setImmediate()  
- Order of execution  
- Priority rules  
- Clean diagrams  
- Interview points  

---

# What is the Event Loop (Deep Explanation)

The **Event Loop** is the core mechanism in Node.js that decides **when and how asynchronous callbacks execute**.

JavaScript runs on a **single thread**, so it cannot do everything at the same time.  
But Node.js achieves concurrency because:

- Slow tasks are done by **libuv** (thread pool or OS async operations)
- Event loop **returns their callbacks** to the JS thread
- Callbacks run **only when JS is free**

The event loop works in **phases**, and each phase has its own type of callbacks.

---

# Full Event Loop Phase Diagram (Improved Box Diagram)

```text
+--------------------------------------------------+
|                  TIMERS PHASE                    |
|       (setTimeout, setInterval callbacks)        |
+--------------------------------------------------+
                        |
                        v
+--------------------------------------------------+
|             PENDING CALLBACKS PHASE              |
|   (I/O-related callbacks from previous cycle)    |
+--------------------------------------------------+
                        |
                        v
+--------------------------------------------------+
|                   POLL PHASE                     |
|         - Executes most I/O callbacks            |
|    - If queue empty → may wait or move next      |
+--------------------------------------------------+
                        |
                        v
+--------------------------------------------------+
|                  CHECK PHASE                     |
|            (setImmediate callbacks)              |
+--------------------------------------------------+
                        |
                        v
+--------------------------------------------------+
|             CLOSE CALLBACKS PHASE                |
|   (socket.on('close'), cleanup handlers, etc.)   |
+--------------------------------------------------+
```

**Important:**  
Between every phase → **microtasks** and **process.nextTick()** run.

---

# Microtasks in Node.js

Microtasks include:

- `Promise.then()`  
- `async/await` internal jobs  
- `queueMicrotask()`  

**Microtasks run after the currently executing callback ends and before the event loop continues to the next phase.**

Meaning → **they have higher priority than event loop phases**.

---

## Short Interview Definition
**Microtasks in Node.js are high-priority tasks like Promises that run immediately after the current JS execution and before the event loop continues to the next phase.**

---

# process.nextTick() — The Special Queue

`process.nextTick()` is a **Node.js–specific microtask queue** that runs **immediately after the current JavaScript execution finishes**, before the event loop continues to the next phase.

---

## Priority Rule (Modern Node.js)

In older Node.js versions:
- `process.nextTick()` **always** ran before Promise microtasks.

In **modern Node.js versions**:
- The execution order between **Promise microtasks** and **process.nextTick()** is **not strictly guaranteed**.
- Sometimes Promise runs first.
- Sometimes nextTick runs first.
- **Do NOT rely on any fixed ordering in interviews or real code.**

---

## Why is this important?

Node.js changed internal scheduling behavior across versions.  
So the correct, interview-safe way is:

👉 **Both nextTick and Promise microtasks run before the event loop phases.  
But their order relative to each other is not deterministic.**

---

## ⚠️ Warning  
Overusing `process.nextTick()` can block the event loop and freeze the application because it keeps inserting callbacks in front of event loop phases.

---

## Short Interview Definition

**process.nextTick() schedules a callback to run after the current JavaScript execution, but its priority relative to Promise microtasks is not strictly guaranteed in modern Node.js.**

This is the best and safest definition for interviews.

---

# Microtasks Priority (Modern Node.js)

### Safe and correct order:

1. **Both Promise microtasks and process.nextTick() run before event loop phases**  
2. **Their internal ordering is not consistent across Node.js versions**  
3. **Event Loop phases come only after microtasks are done**

### Interview-Safe Explanation

- Microtasks → always run before event loop phases  
- But **Promise vs nextTick order is not fixed**  
- You should never depend on the order between them  
- Only depend on: “microtasks run before event loop phases”

---

# Example — nextTick vs Promise (Very Important)

```js
console.log("A");

process.nextTick(() => console.log("B"));

Promise.resolve().then(() => console.log("C"));

console.log("D");
```

**Possible Output (Modern Node.js)**
```
A
D
C
B
```
*OR*
```
A
D
B
C
```

**Explanation:**

1. **Top-level code runs first** → A then D
2. **After JS finishes, microtasks run**
3. **But the order between `process.nextTick()` and `Promise.then()` is not guaranteed.**

So depending on Node.js version and internal scheduling:
- Promise may run before nextTick
- nextTick may run before Promise

**Both outputs are correct.**

### Interview Summary (Easy to Memorize)

- **process.nextTick()** = Node.js specific microtask
- Runs after current JS, before event loop
- **Promise microtasks** also run in the same stage
- **Order between them is NOT deterministic in modern Node.js**
- Both always run before any event loop phase
- **Do not rely on their exact order** in interviews or in production code

---

# Timers Phase (setTimeout, setInterval)

This phase handles:
- `setTimeout()`
- `setInterval()`

### Important

`setTimeout(fn, 0)` **does NOT run immediately.**  
Minimum delay is **NOT guaranteed to be exactly 0ms**.

It runs only when:
1. **Timers phase arrives**
2. **Main thread is free**
3. **Microtasks are done**

---

# setImmediate() — The Check Phase Callback

`setImmediate()` runs during the **Check Phase**, which comes right after **Poll Phase**.

**Check Phase → always after I/O completes.**

So:
- **In I/O callbacks** → `setImmediate()` almost always runs first
- **In top-level code** → race condition (order not guaranteed)

### Short Interview Definition

**setImmediate() executes callbacks in the Check Phase and is designed to run immediately after I/O callbacks.**

---

# setTimeout(0) vs setImmediate()

This is one of the biggest interview questions.

### 1. Top-Level Code (not inside I/O)

**Order is not guaranteed.**

```js
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
```

**Possible outputs:**
```
immediate
timeout
```
or
```
timeout
immediate
```

### 2. Inside I/O Callback (Guaranteed Order)

```js
const fs = require("fs");

fs.readFile("file.txt", () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
});
```

**Output (Guaranteed):**
```
immediate
timeout
```

**Why?**  
Inside I/O callback → next phase = **Check Phase**, so `setImmediate` wins.

---

# Poll Phase — The Heart of the Loop

Poll Phase does two important things:
1. **Runs I/O callbacks** (fs, sockets, HTTP, etc.)
2. **If no timers are ready & no immediate callbacks:**
   - It may **wait** for more I/O
   - OR **move to Check Phase**

**This is the longest-running phase.**

---

# Close Callbacks Phase

Runs callbacks such as:
- `socket.on("close")`
- `server.on("close")`

This is the last step before the cycle restarts.
---

# Full Execution Flow Example (Step-by-Step)

```js
console.log("A");

setTimeout(() => console.log("Timeout"), 0);

setImmediate(() => console.log("Immediate"));

Promise.resolve().then(() => console.log("Promise"));

process.nextTick(() => console.log("NextTick"));

console.log("B");
```

**Output:**
```
A
B
NextTick
Promise
Immediate OR Timeout (not fixed in top level)
```

**Explanation:**
1. **Top-level:** A, B
2. **Microtasks:** `NextTick` and `Promise` execute (Order varies)
3. **Event loop phases** start
4. **Timers / Check Phase:** `Immediate` vs `Timeout` (Order varies in top-level)

---

# Important Short Interview Q&A (Part 2)

**1. What are microtasks?**  
High-priority tasks like Promises that run after JS execution and before event loop phases.

**2. What is process.nextTick()?**  
A special Node.js microtask that runs after the current operation and before the event loop continues.

**3. nextTick() vs Promise priority?**  
In modern Node.js, the order is **not guaranteed**. Historically `nextTick` was faster.

**4. Where does setTimeout() execute?**  
Timers Phase.

**5. Where does setImmediate() execute?**  
Check Phase.

**6. What runs first — setTimeout(0) or setImmediate()?**  
- Top-level: unpredictable  
- Inside I/O: `setImmediate`

**7. What is Poll Phase?**  
Phase that executes I/O callbacks and may wait for more I/O.

**8. Why does Node.js need the event loop?**  
To manage async operations and prevent blocking JS thread.

# Quick Snippets for Practice

### setTimeout vs setImmediate
```js
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
```

### nextTick vs Promise
```js
process.nextTick(() => console.log("tick"));
Promise.resolve().then(() => console.log("promise"));
```

### Inside I/O guaranteed order
```js
fs.readFile("file.txt", () => {
  setTimeout(() => console.log("timeout"));
  setImmediate(() => console.log("immediate"));
});
```

---

# Part-2 Summary (Best for Interviews)

- **process.nextTick() & microtasks** > event loop phases (Order between them varies)
- **setTimeout()** → Timers Phase
- **setImmediate()** → Check Phase
- **Inside I/O** → `setImmediate` always wins
- **Poll Phase** is the heart of async operations
- **Microtasks** run between every event loop phase
- **Non-blocking system** allows concurrency even on a single JS thread