# Backpressure and highWaterMark in Node.js

## What is Backpressure in Node.js?

Backpressure is a natural situation in streams where the Readable stream sends data faster than the Writable stream can handle.

When Writable cannot keep up → data starts piling up → risk of memory overload → Node.js automatically slows down the Readable stream.

### Why Backpressure Happens?

Think of it like:

- **Readable Stream** = Fast tap
- **Writable Stream** = Slow drain

If tap gives too much water too fast → sink fills → needs to slow the tap.

Same way in Node.js:

```
Readable Stream  →  Writable Stream
(Fast Producer)     (Slow Consumer)
```

Writable stream says: *"Stop! I can't handle more data right now."*

Readable stream then slows down or pauses.

### Technical Explanation

Writable streams have a method:

```javascript
writable.write(chunk)
```

This returns:

- `true` → Writable is ready for more chunks
- `false` → Writable is overloaded (backpressure signal)

When `false` is returned:

- Readable stream should pause data flow
- Wait for `drain` event
- Then resume sending

This prevents memory overflow.

### Interview Definition

> **Backpressure** is the mechanism by which Node.js prevents overwhelming a slow consumer by slowing down the producer. When a writable stream's internal buffer is full, it applies backpressure so the readable stream pauses until it can handle more data.

### Backpressure Example

This example shows how backpressure works internally.

```javascript
import fs from "fs";

const readable = fs.createReadStream("bigfile.txt", {
  highWaterMark: 1024 // 1KB chunks
});

const writable = fs.createWriteStream("copy.txt");

// Read chunks
readable.on("data", (chunk) => {
  const ok = writable.write(chunk);

  if (!ok) {
    // Writable is overwhelmed
    readable.pause();
    console.log("Paused due to backpressure...");
  }
});

// Writable is ready again
writable.on("drain", () => {
  console.log("Drain event → resume reading");
  readable.resume();
});
```

**What's happening here?**

- If `writable.write()` returns `false` → backpressure → pause reading
- When Writable is ready → it emits `drain`
- Readable resumes

### Why Node.js Streams Handle Backpressure Automatically?

When you use:

```javascript
readable.pipe(writable);
```

Node.js automatically manages:

- `pause()`
- `resume()`
- handling `drain` events
- preventing memory overflow

👉 That's why `.pipe()` is recommended.

### Real-Life Examples of Backpressure

**Large file uploads**

User uploads a 10GB file → server must slow down producer.

**Video streaming**

Video file too large for client's poor network → slow consumer.

**Network packets**

If client can't read fast → Node slows sending speed.

**Logs writing to slow HDD**

Logging faster than disk write → backpressure kicks in.

### One-Line Summary

Backpressure = when the writer is slower than the reader → Node.js slows the reader to prevent memory overload.

---

## What is highWaterMark in Streams?

`highWaterMark` is the maximum buffer size (limit) that a stream can hold before applying backpressure.

Think of it as:

- A bucket size
- Once the bucket is full → stop pouring water → apply backpressure

### Why is highWaterMark Important?

When a Readable stream reads data, it stores chunks in an internal buffer.

- If buffer size < `highWaterMark` → it keeps reading more data
- If buffer size reaches `highWaterMark` → it stops reading and waits

This prevents the stream from filling memory.

Same for writable streams:

- If Writable buffer reaches `highWaterMark` → `write()` returns `false`
- This triggers backpressure, signaling Readable to pause

### Default highWaterMark Values

Node.js uses different default sizes:

| Stream Type | Default highWaterMark |
|-------------|----------------------|
| Readable (Buffer mode) | 64 KB |
| Readable (String mode) | 16 KB |
| Writable streams | 16 KB |
| Object Mode Streams | 1 item (not bytes!) |

### Example of Setting highWaterMark

**For file streams:**

```javascript
const readable = fs.createReadStream("bigfile.txt", {
  highWaterMark: 1024 * 64 // 64KB per chunk
});
```

**For objectMode:**

```javascript
const readable = new Readable({
  objectMode: true,
  highWaterMark: 5, // can store 5 objects
  read() {}
});
```

### Simple Explanation

✔ `highWaterMark` = How much data can the stream buffer before saying: *"Stop! I need a break."* (Backpressure)

✔ It protects your app from consuming too much memory.