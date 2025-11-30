# Node.js Memory Management

## Definition

Node.js memory management refers to how Node allocates, manages, and frees memory across the V8 heap, native memory, buffers, libuv threadpool, and long-running processes.
Because Node is a server runtime, its memory model is more complex than browser JavaScript.

In simple words:
Node manages JS memory + buffer memory + native memory + threadpool memory.

## 1. Node.js Has More Memory Areas Than Browser

Browser:

- Heap
- Stack

Node:

- V8 heap
- Native C++ memory
- Buffers (outside V8)
- Streams internal memory
- Libuv threadpool
- Zlib/crypto memory
- Long-running process allocations

## 2. V8 Heap Limit

~2GB default

Increase:

```bash
node --max-old-space-size=4096 app.js
```

## 3. Buffers Outside V8 Heap

```javascript
Buffer.alloc(5 * 1024 * 1024 * 1024);
```

- Uses native memory
- Doesn't count toward JS heap
- Important for file & network operations

## 4. Node's GC Handles Long-running Servers

Unlike browsers, Node servers don't reload.
GC must handle:

- long-lived closures
- timers
- file handles
- streams
- sockets
- watchers

## 5. Native Modules Can Leak Memory

Examples:

- fs watchers
- socket connections
- zlib streams
- event listeners not removed

## 6. process.memoryUsage()

```javascript
console.log(process.memoryUsage());
```

Shows:

- rss
- heapTotal
- heapUsed
- external
- arrayBuffers

## 7. Streams Prevent Memory Explosion

Streams allow Node to process:

- GB-sized files
- large uploads
- compressed data

Without loading them into RAM.

## 8. Libuv Threadpool Memory

Threadpool used for:

- zlib
- dns.lookup
- fs
- crypto

Memory allocated outside V8 → less heap pressure.