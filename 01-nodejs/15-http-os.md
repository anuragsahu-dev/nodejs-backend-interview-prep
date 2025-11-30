# Node.js HTTP Module — Clean & Clear Notes

## Definition

The http module in Node.js is a core built-in module that allows you to create HTTP servers and handle HTTP requests and responses without using Express.
It gives low-level control over how the server receives data, parses URLs, handles routes, sends headers, and responds.

In simple words:
http module = raw backend server without Express.

## Why do we use http module?

- To understand how Express works internally.
- To handle raw request/response (low-level).
- To build APIs without any external package.
- Important for interviews.

## Example 1 — Basic HTTP Server

```javascript
import http from "node:http";

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello from Node.js HTTP Server!");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

### Why this example is good?

- Clean
- Shows status code
- Shows headers
- Shows basic response

## Example 2 — Manual Routing (No Express)

```javascript
import http from "node:http";

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Home Route");
  }

  if (req.url === "/contact") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Contact Route");
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Route Not Found");
});

server.listen(4000, () => console.log("Server is running on 4000"));
```

## Example 3 — Handling POST Requests

```javascript
import http from "node:http";

const server = http.createServer((req, res) => {
  if (req.url === "/submit" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      const jsonBody = JSON.parse(body);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ received: jsonBody }));
    });
  }
});

server.listen(5000);
```

### Why good?

- Very clean
- Shows how to read raw body (important concept)
- Shows JSON response

# Node.js OS Module — Clean & Clear Notes

## Definition

The os module in Node.js provides system-level information about your computer such as CPU details, RAM usage, OS type, hostname, and network interfaces.

In simple words:
os module = information about the computer where Node.js is running.

## Why use os module?

- Monitoring system performance
- System diagnostics (CPU/RAM usage)
- Used in load balancers
- Used in cluster mode (CPU count needed)
- Helpful for DevOps, backend monitoring, and logging

## Most Important OS module methods

### os.arch()

CPU architecture.

```javascript
console.log(os.arch());  
// x64 or arm64
```

### os.platform()

Operating system platform.

```javascript
console.log(os.platform());
// win32, linux, darwin
```

### os.cpus()

Returns details of all CPU cores.

```javascript
console.log(os.cpus());
```

### os.totalmem() / os.freemem()

```javascript
console.log(os.totalmem());  // in bytes
console.log(os.freemem());
```

Human-readable:

```javascript
console.log((os.totalmem() / 1024 / 1024 / 1024).toFixed(2), "GB");
```

### os.hostname()

```javascript
console.log(os.hostname());
```

### os.uptime()

```javascript
console.log(os.uptime(), "seconds");
```

### os.networkInterfaces()

```javascript
console.log(os.networkInterfaces());
```

## Full Example — API that returns system info

```javascript
import http from "node:http";
import os from "node:os";

const server = http.createServer((req, res) => {
  if (req.url === "/system") {
    const info = {
      hostname: os.hostname(),
      osType: os.type(),
      platform: os.platform(),
      architecture: os.arch(),
      cpuCount: os.cpus().length,
      totalMemGB: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
      freeMemGB: (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
      uptime: os.uptime(),
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(info));
  }

  res.writeHead(404);
  res.end("404");
});

server.listen(7000, () => console.log("Server running on port 7000"));
```
