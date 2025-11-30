# Event-Driven Architecture in Node.js

Node.js uses an Event-Driven Architecture (EDA) to handle multiple tasks efficiently without blocking the main thread. Instead of executing code step-by-step in a synchronous manner, Node.js reacts to events as they occur.

This architecture is built around three core concepts:

- **Events** → Signals that something happened
- **Event Emitters** → Objects that emit (trigger) events
- **Listeners** → Functions that execute when an event occurs

Because of this model, Node.js can perform asynchronous work without creating multiple threads, making it highly efficient for I/O-bound operations.

---

## How Event-Driven Architecture Works in Node.js

Node.js runs on a single-threaded event loop. The event loop continuously monitors pending tasks, I/O operations, and callbacks, executing them when their associated events occur.

### Key Components

**1. Events**

Events represent something that happened in your application (file read completed, HTTP request received, data received in a stream, custom application event).

**2. Event Loop**

The event loop tracks asynchronous operations, executes callbacks when events occur, and never blocks (non-blocking I/O).

**3. Callbacks / Listeners**

A listener is a function that reacts when a specific event is emitted. It's the "handler" for the event.

**4. Non-Blocking Architecture**

While Node.js waits for an event (like reading a file from disk), it continues processing other tasks. This is why Node.js can scale to handle thousands of concurrent operations without creating thousands of threads.

---

## EventEmitter Module (Core of Node.js Events)

The `events` module exposes the `EventEmitter` class, which is the foundation of event-driven programming in Node.js.

Almost every core module in Node.js (HTTP, Streams, FS, Process, etc.) internally uses `EventEmitter`.

### Importing EventEmitter

**CommonJS (CJS) syntax:**

```javascript
const EventEmitter = require("events");
```

**ES Module (ESM) syntax:**

```javascript
import { EventEmitter } from "events";
```

> **Note:** The correct import is `{ EventEmitter }` with destructuring, not the default import.

---

## Basic Concepts in EventEmitter

### 1. Event Registration (Listener Binding)

Attach a listener that reacts when an event occurs using the `.on()` method.

```javascript
import { EventEmitter } from "events";

const emitter = new EventEmitter();

emitter.on("eventName", (data) => {
  console.log("Event received:", data);
});
```

### 2. Event Emission

Trigger an event manually using the `.emit()` method.

```javascript
emitter.emit("eventName", "Hello World");
// Output: Event received: Hello World
```

### 3. Event Payload

You can pass any data with the event—objects, strings, numbers, arrays, etc.

```javascript
emitter.on("userRegistered", (userId, email) => {
  console.log(`User ${userId} registered with email: ${email}`);
});

emitter.emit("userRegistered", 101, "user@example.com");
```

---

## Custom EventEmitter Class Example (Recommended for Real Projects)

In real-world applications, it's better to extend the `EventEmitter` class to create domain-specific event emitters.

```javascript
import { EventEmitter } from "events";

class UserEventEmitter extends EventEmitter {
  login(username) {
    this.emit("login", username);
  }

  logout(username) {
    this.emit("logout", username);
  }
}

const userEvents = new UserEventEmitter();

userEvents.on("login", (user) => {
  console.log(`User logged in: ${user}`);
});

userEvents.on("logout", (user) => {
  console.log(`User logged out: ${user}`);
});

userEvents.login("Anurag");
userEvents.logout("Anurag");
```

---

## Real Example: File Processor with Events

A custom file processor that fires events when file operations complete or fail:

```javascript
import { EventEmitter } from "events";
import fs from "fs";

class FileProcessor extends EventEmitter {
  readFile(filePath) {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        this.emit("error", err);
        return;
      }
      this.emit("fileRead", data);
    });
  }
}

const processor = new FileProcessor();

processor.on("fileRead", (content) => {
  console.log("File content received:", content);
});

processor.on("error", (err) => {
  console.error("Error occurred:", err.message);
});

processor.readFile("sample.txt");
```

This uses asynchronous FS, custom event names, class-based emitter, and proper error handling through events.

---

## What Are Events in Node.js?

Events are signals that something happened in your application. They allow different parts of your code to communicate without tight coupling.

### Types of Events

**Built-in Events** (emitted by Node.js core modules):

- **Streams** → `data`, `end`, `error`, `finish`
- **HTTP** → `request`, `response`, `close`
- **Process** → `exit`, `uncaughtException`, `beforeExit`

**Custom Developer Events** (you define for your application):

- `userRegistered`, `orderPlaced`, `paymentSuccess`, `fileProcessed`

### Event Naming Best Practices

Use descriptive, camelCase event names: `userLoggedIn`, `fileUploaded`, `paymentSuccess`

---

## Listeners in Node.js

Listeners are functions that execute when an event occurs. They are the "reaction" to an event.

```javascript
import fs from "fs";

console.log("Reading file...");

fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log("File contents:", data);
});

console.log("This runs immediately, before file is read");
```

The callback function is the listener for the "file read complete" event. This demonstrates the non-blocking nature of event-driven programming.

---

## Event-Driven Programming in Node.js

Event-driven programming is a paradigm where the flow of the program is determined by events rather than sequential execution.

**The core workflow:**

1. You create events (define what can happen)
2. You emit events (trigger when something happens)
3. You react to events using listeners (handle what happens)

This makes Node.js applications highly modular, asynchronous by nature, loosely coupled, and easy to extend.

---

## Benefits of Event-Driven Architecture

1. **Scalability** → Handles many concurrent tasks easily without creating multiple threads
2. **Non-Blocking I/O** → Long operations do not block the main thread
3. **Modularity** → Code becomes clean and divided into independent event modules
4. **Responsiveness** → Ideal for real-time applications (chat apps, notifications, live dashboards)
5. **Perfect Fit for Node's Event Loop** → Works naturally with the single-threaded design
6. **Loose Coupling** → Event emitters and listeners don't need to know about each other

---

## When to Use Event-Driven Architecture?

### Ideal Use Cases

File system operations, streaming large data, chat applications, notification systems, payment/order systems, background job queues, real-time dashboards, microservices communication, WebSocket servers.

### Not Ideal For

**Heavy CPU tasks** (image processing, video encoding, complex calculations, cryptographic operations) → Use **Worker Threads** instead.

---

## Important EventEmitter Methods

### `.on(eventName, listener)`

Registers a listener for an event. The listener will be called every time the event is emitted.

### `.once(eventName, listener)`

Registers a listener that will be called only once, then automatically removed.

### `.emit(eventName, [...args])`

Emits an event with optional arguments.

### `.off(eventName, listener)`

Removes a specific listener from an event.

### `.removeAllListeners([eventName])`

Removes all listeners for a specific event, or all events if no name is provided.

---

## Final Summary

**Event-Driven Architecture** is the foundation of Node.js:

- Node.js is built on Event-Driven Architecture
- Events trigger actions asynchronously
- `EventEmitter` is the core module behind events
- You use `.on()` to listen and `.emit()` to trigger
- This architecture makes Node.js fast, scalable, and ideal for I/O-heavy applications

**Key Takeaways:**

1. Events decouple your code
2. Listeners react to events independently
3. Multiple listeners can respond to the same event
4. EventEmitter is the foundation of streams, HTTP, and most Node.js APIs
5. Always handle `error` events to prevent crashes
