
# What is thread pool in nodesj?

Node.js uses a libuv-managed thread pool (default size: 4 threads) to process tasks like file system operations, DNS lookups, and crypto operations. These tasks run in the background threads, and once completed, callbacks are returned to the event loop, keeping JavaScript non-blocking.

## Short Interview Defination 

learn this defination

**thread pool in Node.js is a set of background worker threads provided by libuv to handle expensive task so that the main JavaScript thread remains non-blocking.**

code example 

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


output 
2195ms Password 4 Done
2209ms Password 3 Done
2306ms Password 1 Done
2352ms Password 2 Done

by default we have 4 thread in thread pool and we are doing 4 crypto operation and one thread handle one crypto operation at a time so here average time of each crypto operation is approx same. 1 crypto operation is running on one thread

