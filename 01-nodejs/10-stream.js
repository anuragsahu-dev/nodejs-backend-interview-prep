import express from "express";
import fs from "node:fs";
import { pipeline, Readable, Writable } from "node:stream";
import { upperCaseTransform } from "./upperCaseTransform.js"; // custom transform

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================
// 1. BAD WAY: Read Full File
// ==========================
app.get("/download/bad", async (_req, res) => {
  try {
    // Loads entire file in RAM 
    const data = await fs.promises.readFile("sample.txt", "utf-8");
    res.end(data);
  } catch (error) {
    res.status(500).send("Failed to read file");
  }
});

// ============================
// 2. GOOD WAY: Streaming File
// ============================
app.get("/download/good", (_req, res) => {
  fs.createReadStream("sample.txt").pipe(res);
});

// ==================================
// 3. BAD WAY: Copy file (read + write)
// ==================================
app.get("/copy/bad", (_req, res) => {
  const content = fs.readFileSync("sample.txt"); // ❌ heavy on RAM
  fs.writeFileSync("output.txt", content);
  res.send("File copied (bad way)");
});

// ===================================
// 4. GOOD WAY: Copy using READ STREAM
// ===================================
app.get("/copy/good", (_req, res) => {
  const reader = fs.createReadStream("sample.txt");
  const writer = fs.createWriteStream("output.txt");

  reader.on("data", (chunk) => {
    writer.write(chunk);
  });

  reader.on("end", () => writer.end());

  res.send("File copied (good way using streams)");
});

// =============================
// 5. MANUAL PROCESSING STREAM
// =============================
app.get("/process/manual", (req, res) => {
  const reader = fs.createReadStream("sample.txt");
  const writer = fs.createWriteStream("output.txt");

  reader.on("data", (chunk) => {
    const upper = chunk.toString().toUpperCase();
    const replaced = upper.replaceAll(/\d+/g, "hello");
    writer.write(replaced);
  });

  reader.on("end", () => writer.end());
  res.send("Manual processing started");
});

// =======================
// 6. PIPING (simple copy)
// =======================
app.get("/process/pipes", (req, res) => {
  fs.createReadStream("sample.txt")
    .pipe(fs.createWriteStream("output.txt"));

  res.send("Piping complete");
});

// =========================================
// 7. TRANSFORM STREAM (upperCaseTransform)
// =========================================
app.get("/process/transform", (req, res) => {
  fs.createReadStream("sample.txt")
    .pipe(upperCaseTransform)
    .pipe(fs.createWriteStream("output.txt"));

  res.send("Transform processing started");
});

// =======================================
// 8. PIPELINE (Best error-handling system)
// =======================================
app.get("/process/pipeline", (req, res) => {
  pipeline(
    fs.createReadStream("sample.txt"),
    upperCaseTransform,
    fs.createWriteStream("output.txt"),
    (err) => {
      if (err) console.log("Pipeline Error:", err);
      else console.log("Pipeline Success!");
    }
  );

  res.send("Pipeline started");
});

// ==========================
// 9. OBJECT MODE STREAM DEMO
// ==========================
app.get("/object-mode", (req, res) => {
  // Writable stream that accepts JS objects
  const writable = new Writable({
    objectMode: true,
    write(chunk, _encoding, callback) {
      console.log("Object received:", chunk);
      callback();
    },
  });

  // Readable stream in object mode
  const readable = new Readable({
    objectMode: true,
    read() {}
  });

  readable.on("data", (obj) => writable.write(obj));

  // Push JS objects (works only in objectMode)
  readable.push({ name: "Anurag" });
  readable.push({ skill: "Backend Dev" });
  readable.push(null); // End

  res.send("Object mode stream executed");
});

// =========================================
// 10. TERMINAL INPUT → FILE (stdin logging)
// =========================================
// Type in terminal → saved in log.txt
app.get("/log/start", (req, res) => {
  process.stdin.pipe(fs.createWriteStream("log.txt"));
  res.send("Logging started. Type in terminal.");
});

// ==========================
// 11. READ log.txt to screen
// ==========================
app.get("/log/show", (req, res) => {
  fs.createReadStream("log.txt").pipe(res);
});

// ==========================
// START SERVER
// ==========================
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});


// upperCaseTransform.js

import { Transform } from "node:stream";

export const upperCaseTransform = new Transform({
  transform(chunk, _encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});
