# 1. Zlib Module

## Definition

The zlib module in Node.js provides tools for data compression and decompression using algorithms like Gzip, Deflate, and Brotli.
It uses Transform Streams, so it can compress data chunk-by-chunk without loading entire files into memory.

In simple words:
Zlib = module that compresses & decompresses data efficiently using streams.

## Why Zlib works best with Streams?

(Your original explanation kept)

- Streams process data in chunks
- Zlib compresses/decompresses in chunks
- High performance
- Low memory usage
- Suitable for big files & HTTP responses

## Example 1 — HTTP Response Compression

```javascript
import http from "node:http";
import zlib from "node:zlib";

http.createServer((req, res) => {
  const responseData = "Hello Anurag, this is a compressed response!".repeat(500);
  const gzipStream = zlib.createGzip();

  res.writeHead(200, {
    "Content-Encoding": "gzip",
    "Content-Type": "text/plain",
  });

  gzipStream.end(responseData);
  gzipStream.pipe(res);
}).listen(3000);
```

## Example 2 — Large File Compression

```javascript
fs.createReadStream("server.log")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("server.log.gz"));
```

## Example 3 — Compressed Download

```javascript
fs.createReadStream("data.txt")
  .pipe(zlib.createGzip())
  .pipe(res);
```

## Example 4 — Brotli Compression

```javascript
fs.createReadStream("input.txt")
  .pipe(zlib.createBrotliCompress())
  .pipe(fs.createWriteStream("input.txt.br"));
```

# 2. DNS Module

## Definition

The dns module` allows Node.js to perform DNS lookups, such as converting domain → IP address or IP → domain.
It can use the OS DNS resolver (lookup) or run real DNS queries (resolve).

In simple words:
DNS module is used to find the IP address of a domain or resolve DNS records.

## dns.lookup()

```javascript
dns.lookup("google.com", (err, address, family) => {
  console.log(address, family);
});
```

## dns.resolve()

```javascript
dns.resolve("google.com", "A", (err, records) => {
  console.log(records);
});
```

## Interview Notes

- lookup → OS cache
- resolve → real DNS query
- Used in load balancers, microservices, service discovery

# 3. Net Module

## Definition

The net module allows you to create TCP servers and TCP clients.
It provides direct access to network sockets, making it ideal for low-level networking.

In simple words:
Net module = create raw TCP connections (no HTTP).

## Example — TCP Server

```javascript
const server = net.createServer((socket) => {
  socket.write("Welcome!");
  socket.on("data", (data) => {
    console.log("Client says:", data.toString());
  });
});

server.listen(6000);
```

## Example — TCP Client

```javascript
const client = net.createConnection(6000, () => {
  client.write("Hello Server!");
});
```

## Interview Notes

- TCP, not HTTP
- Used for chat apps, games, messaging
- Events: data, end, error

# 4. Environment Variables

## Definition

Environment variables are key-value pairs stored outside your code, used for configuration (port, DB URL, API keys).
Node loads these using process.env.

In simple words:
Environment variables store sensitive or environment-specific values.

## Example — .env

```
PORT=5000
DB_PASS=secret123
```

## Load using dotenv

```javascript
import dotenv from "dotenv";
dotenv.config();
```

## Access

```javascript
console.log(process.env.PORT);
```