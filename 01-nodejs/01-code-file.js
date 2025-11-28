import crypto from "node:crypto";

const start = Date.now();

// source code 1

crypto.pbkdf2("password1", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 1 Done`);
});
crypto.pbkdf2("password2", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 2 Done`);
});
crypto.pbkdf2("password3", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 3 Done`);
});
crypto.pbkdf2("password4", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 4 Done`);
});

// source code 2

crypto.pbkdf2("password1", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 1 Done`);
});
crypto.pbkdf2("password2", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 2 Done`);
});
crypto.pbkdf2("password3", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 3 Done`);
});
crypto.pbkdf2("password4", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 4 Done`);
});
crypto.pbkdf2("password5", "salt1", 100000, 1024, "sha512", () => {
  console.log(`${Date.now() - start}ms Password 5 Done`);
});

//  This example for worker thread module 

// source code 3

// worker.js
import { parentPort, workerData } from "node:worker_threads";

function heavyCalculation(number) {
  let count = 0;
  for (let i = 0; i < number; i++) {
    count += i;
  }
  return count;
}

const result = heavyCalculation(workerData.num);

parentPort.postMessage({ result });


// main.js
import { Worker } from "node:worker_threads";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKER_PATH = path.join(__dirname, "worker.js");

function runWorker(num) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(WORKER_PATH, {
      workerData: { num }
    });

    worker.on("message", (msg) => resolve(msg));
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker exited: ${code}`));
    });
  });
}

async function main() {
  console.log("Main thread starting...");

  const start = Date.now();
  const data = await runWorker(1000000000); // heavy loop
  const end = Date.now();

  console.log("Worker result:", data.result);
  console.log("Time taken:", (end - start) + "ms");
}

main();
