# Streams in Node.js (Complete + Easy Explanation)

## What is a Stream in Node.js?

A Stream in Node.js is a built-in interface that lets you read or write data chunk-by-chunk instead of loading the whole data into memory at once.

Streams make Node.js efficient for:

- Large files
- Network data
- Audio/video processing
- Continuous data flows

## Why Use Streams?

**✅ Memory Efficient**

Process a 1GB file on a machine with 512MB RAM — no crash, because only small chunks (like 64KB) are loaded at a time.

**✅ Time Efficient**

Start processing data immediately (don’t wait for full file).

**✅ Pipeline-friendly**

Streams can be connected to create powerful data pipelines.

**✅ Better UX**

Videos, music, download progress — delivered chunk-by-chunk.

## Types of Streams in Node.js

| Type | Description | Examples |
|------|-------------|----------|
| Readable | You can read data from it | `fs.createReadStream()`, `req`, `process.stdin` |
| Writable | You can write data to it | `fs.createWriteStream()`, `res`, `process.stdout` |
| Duplex | Read + Write at same time | TCP sockets, `net.Socket` |
| Transform | Duplex + modifies data | zlib, crypto streams |

> **Note:**
> 👉 All streams are EventEmitter instances, so they emit events like `data`, `end`, `finish`, `error`.

## How Streams Work (EventEmitter-Based)

### Common Events

**For Readable Streams**

- `data` → new chunk arrived
- `end` → no more data
- `error` → reading error
- `close` → resource closed
- `readable` → data ready to read

**For Writable Streams**

- `drain` → now it’s safe to write more
- `finish` → writing completed
- `error` → writing error
- `close` → file descriptor closed
- `pipe` → `readable.pipe(writable)` called
- `unpipe` → unpipe called

## Readable Stream Example (Improved)

```javascript
import fs from "fs";

// Create a readable stream
const readableStream = fs.createReadStream("myfile.txt", {
  encoding: "utf8",
  highWaterMark: 64 * 1024, // 64KB per chunk
});

// Handle events
readableStream.on("data", (chunk) => {
  console.log(`Chunk size: ${chunk.length}`);
  console.log(chunk);
});

readableStream.on("end", () => {
  console.log("Finished reading file.");
});

readableStream.on("error", (err) => {
  console.error("Stream error:", err);
});
```

## Writable Stream Example (Improved)

```javascript
import fs from "fs";

// Create writable stream
const writableStream = fs.createWriteStream("output.txt");

// Write data in chunks
writableStream.write("Hello, ");
writableStream.write("World!\n");
writableStream.write("Writing to a stream is easy!");

// End the stream
writableStream.end();

// Events
writableStream.on("finish", () => {
  console.log("All data has been written.");
});

writableStream.on("error", (err) => {
  console.error("Write error:", err);
});
```

## Pipe in Streams (Most Important)

The `.pipe()` method connects a Readable Stream → Writable Stream
It handles backpressure automatically.

```javascript
import fs from "fs";

const readable = fs.createReadStream("source.txt");
const writable = fs.createWriteStream("destination.txt");

readable.pipe(writable);

writable.on("finish", () => {
  console.log("File copied successfully!");
});
```

### Chaining Pipes (Multiple Streams)

```javascript
readableStream
  .pipe(transformStream)
  .pipe(writableStream);
```

Commonly used with compression, encryption, formatting, etc.

## Transform Streams (Without Class – Your Request ✔)

Here is a non-class version of a Transform stream:

```javascript
import { Transform } from "stream";
import fs from "fs";

// Transform to uppercase
const toUpperCase = new Transform({
  transform(chunk, encoding, callback) {
    const upper = chunk.toString().toUpperCase();
    callback(null, upper);
  },
});

fs.createReadStream("input.txt")
  .pipe(toUpperCase)
  .pipe(fs.createWriteStream("output-uppercase.txt"))
  .on("finish", () => console.log("Transformation complete!"));
```

## Object Mode Streams (Easy Version)

Streams can handle JavaScript objects instead of Buffers/Strings.

```javascript
import { Readable, Writable } from "stream";

// Writable stream in object mode
const writable = new Writable({
  objectMode: true,
  write(chunk, encoding, callback) {
    console.log("Writing:", chunk);
    callback();
  },
});

// Readable stream in object mode
const readable = new Readable({
  objectMode: true,
  read() {},
});

readable.on("data", (chunk) => writable.write(chunk));

// Push objects (allowed because objectMode: true)
readable.push({ name: "Anurag Sahu" });
readable.push({ age: 21 });
readable.push(null); // end
```

## pipeline() — Best Way for Error Handling

`pipeline()` handles errors automatically in a stream chain.

```javascript
import { pipeline } from "stream";
import fs from "fs";
import zlib from "zlib";

pipeline(
  fs.createReadStream("input.txt"),
  zlib.createGzip(),
  fs.createWriteStream("output.txt.gz"),
  (err) => {
    if (err) console.error("Pipeline failed:", err);
    else console.log("Pipeline succeeded!");
  }
);
```

## pipeline() in Express Route (Your Example Improved)

```javascript
import fs from "fs";
import { pipeline } from "stream";

app.get("/process/transform/pipeline", (req, res) => {
  const sampleStream = fs.createReadStream("sample.txt");
  const outputStream = fs.createWriteStream("output.txt");

  const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk.toString().toUpperCase());
    },
  });

  pipeline(sampleStream, upperCaseTransform, outputStream, (err) => {
    if (err) console.log("Pipeline Error:", err);
  });

  res.send("Pipeline started.");
});
```

## Short Interview Summary

- ✔ Stream = Chunk-based data processing
- ✔ Prevents memory overflow
- ✔ 4 Types → Readable, Writable, Duplex, Transform
- ✔ All streams are EventEmitters
- ✔ `pipe()` = connect streams
- ✔ `pipeline()` = safest error handling
- ✔ Streams can work in objectMode