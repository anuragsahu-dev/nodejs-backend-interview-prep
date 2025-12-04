# WebRTC (Web Real-Time Communication)

## What is WebRTC?

**WebRTC** (Web Real-Time Communication) is a browser-based technology that allows two users to communicate directly using audio, video, or real-time data without requiring a central server to transfer the media.

**Key Point:** Media flows **peer-to-peer**, not through the backend.

## Why Use WebRTC?

WebRTC is used for real-time, peer-to-peer communication:

- **Video calling** (Google Meet, Zoom Web, WhatsApp Web)
- **Voice calling**
- **Live screen sharing**
- **Real-time chat or data sharing**
- **Online gaming** (real-time data packets)

**Benefit:** Reduces server load because once the connection is established, media flows directly between users.

## How WebRTC Works

WebRTC uses three main components:

### 1. Signaling Server

- Two browsers must "find" each other first
- They exchange IP addresses, ports, and media info using **WebSocket** or **HTTP**
- After signaling, browsers connect directly
- **This is the only place where the backend is involved**

### 2. STUN Server

- Helps find your **public IP address**
- Needed because users are behind NAT/firewalls

### 3. TURN Server

- If direct connection fails (firewall/NAT too strict), media is **relayed** through a TURN server
- This is the fallback option and costs more bandwidth

## Backend Role in WebRTC

The backend's job is limited to:

- Running the **signaling server** (often WebSocket)
- Managing **user rooms/calls**
- Optional: Deploy **STUN/TURN servers**

**Note:** Deep-level WebRTC protocols or codecs are **not expected** from junior backend engineers.

## Common Use Cases

- WhatsApp video calls
- Google Meet
- Discord
- Telemedicine apps
- Online multiplayer games
- Live collaboration tools (Figma, Google Docs)

## Interview Q&A

### Q: What is WebRTC?

"WebRTC is a browser technology for direct peer-to-peer audio, video, and data communication."

### Q: Do we need a backend in WebRTC?

"Yes, for signaling and call setup — but media flows peer-to-peer, not through the backend."

### Q: What are STUN and TURN?

- **STUN** → Finds your public IP address
- **TURN** → Relays media when peer-to-peer connection fails

## Summary for Junior Backend Developers

You don't need deep WebRTC knowledge, but you should know:

- **What WebRTC is** → Peer-to-peer, real-time communication
- **Why it's used** → Reduce latency and enable real-time media
- **Backend role** → Signaling only (WebSocket server)
- **STUN/TURN basics** → Network traversal helpers

**Note:** WebRTC is mainly a frontend + networking topic. It's not asked much in junior backend developer interviews, but knowing the basics is beneficial.
