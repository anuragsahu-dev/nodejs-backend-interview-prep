# WebSocket

## 1. What is WebSocket?

WebSockets provide a way to establish a persistent, full-duplex communication channel between a client (browser/mobile app) and a server using a single TCP connection.

**"Persistent" means:** once the connection is created, it stays open.

- Client can send multiple messages anytime
- Server can also send messages anytime (which is impossible in HTTP)

**HTTP:**
Request → Response → Connection closed.

**WebSocket:**
Connection opens → stays active → both can send/receive anytime → closes only when client/server closes it.

## 2. Why HTTP is Not Good for Real-Time?

HTTP is not persistent.

Every time:

1. Browser sends request
2. Server responds
3. Connection ends

Under the hood, every new HTTP request uses 3-way TCP handshake.

## 3. What is 3-Way Handshake? (TCP Handshake)

This happens every time you make an HTTP request.

1. Browser → Server: I want to connect (SYN)
2. Server → Browser: Ok, I know you (SYN-ACK)
3. Browser → Server: Yes, I know you too (ACK)

Only after this process, the actual request goes.

If you send another request → same expensive handshake happens again.

## 4. Why WebSocket for Real-Time?

Because:

- One time 3-way handshake
- Connection remains open till closed manually
- No need to reconnect again and again
- This saves time and improves performance

## 5. Full-Duplex Communication

Full-duplex = 2-way communication at the same time.

- Browser → can send multiple messages anytime
- Server → can send messages anytime

**Example:** WhatsApp chat.

## 6. Polling Explained

Sometimes WebSocket is not required practically. In those cases, we use Polling.

### What is Polling?

Polling means browser sends a request again and again after every few seconds to check:

```
Browser: Any new message?
Server: No
(After 3 sec)
Browser: Any new message?
Server: Yes, here is your message
```

### Problems in Polling

- Too many requests
- Wastes bandwidth
- Delay in receiving new data

## 7. Libraries for WebSocket in Node.js

- `websocket`
- `ws` (lightweight, pure websocket)
- `socket.io`

## 8. Problems with Socket.io

Socket.io is good but:

- It's not real WebSocket (uses custom protocol)
- Requires socket.io on both frontend & backend
- Not natively supported on Android/iOS/Java

Native WebSockets run everywhere.
Socket.io requires custom implementation everywhere.

## 9. Why Use `ws` Library?

- Very lightweight
- Pure WebSocket protocol
- No custom overhead
- Works in browsers, Node, Java, mobile etc.

## 10. Rooms & Namespaces

### Namespaces

Divide server logically:

- `/chat`
- `/notifications`

### Rooms

Divide users inside namespace:

- room A
- room B

Broadcast is easier.

## 11. Scaling WebSockets

HTTP is stateless → easy to scale
WebSockets are stateful → hard to scale

### Main Problem:

- User A is connected to Server 1
- User B is connected to Server 2

A sends message → server 1 gets
But server 2 doesn't know.

### Solution → Redis Pub/Sub

Redis works like a middle communication channel:

```
A → Server1 → Redis → Server2 → B
```

## 12. Challenges in Scaling WebSocket

- Need sticky sessions
- Servers must sync state
- RAM usage increases
- Redis Pub/Sub required
- Fault tolerance issues
- Connection limits

## 13. HTTP vs WebSocket

### HTTP (non persistent)

```
Browser ----request----> Server
Server ----response--> Browser
Connection closed
```

### WebSocket (persistent)

```
Browser === WebSocket === Server
        (Connection stays open)
```

## 14. Polling Diagram

```
Browser → Server: Any new message?
Server → Browser: No

Browser → Server: Any new message?
Server → Browser: No

Browser → Server: Any new message?
Server → Browser: Yes! Here it is.
```

## 15. WebSocket Real-Time Chat

```
           WebSocket Server
               /      \
              /        \
        Browser1     Browser2
         "Hi"  ----->  "Hi"
```

## 16. Scaling WebSockets with Redis

```
         Redis Pub/Sub
        /               \
Server1                 Server2
  ↑                        ↑
User A                   User B
```

## 17. Code Example Using WS Library

### Backend (Node.js using ws)

```javascript
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8000 });

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (msg) => {
    console.log("Received:", msg.toString());

    // Echo message back
    socket.send(`Server received: ${msg}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});
```

### Frontend (Browser)

```html
<script>
  const ws = new WebSocket("ws://localhost:8000");

  ws.onopen = () => {
    console.log("Connected to WS server");
    ws.send("Hello from browser!");
  };

  ws.onmessage = (event) => {
    console.log("Message from server:", event.data);
  };

  ws.onerror = (err) => {
    console.log("Error:", err);
  };
</script>
```

## 18. Simple Ping-Pong Example

### Backend

```javascript
wss.on("connection", (socket) => {
  console.log("WS connected");

  socket.on("message", (data) => {
    if (data.toString() === "ping") {
      socket.send("pong");
    }
  });
});
```
