# Webhooks in Backend Development

## What is a Webhook?

A **webhook** is a server-to-server notification system. Whenever an event happens in System A, it automatically sends an HTTP request (mostly POST) to System B.

**Simple definition:** "A webhook is a way for one server to notify another server in real-time whenever something happens."

You don't continuously poll. The sender pushes the event to you.

### Common Examples

- **Stripe** → Sends webhook when payment succeeds
- **GitHub** → Sends webhook when someone pushes code
- **LMS** → Sends webhook when a course is purchased

## How Webhooks Work

1. Client registers a webhook URL → "Send events here"
2. Event happens (purchase, signup, payment success)
3. Server calls the webhook URL with event data
4. Receiver validates → Processes the event

In a typical setup:

- **LMS Server** = Webhook sender
- **Automator Server** = Webhook receiver

## Webhook vs WebSocket

| Feature           | Webhook                                      | WebSocket                           |
| ----------------- | -------------------------------------------- | ----------------------------------- |
| **Connection**    | No persistent connection. One-time HTTP POST | Persistent bidirectional connection |
| **Use case**      | Server → Server notifications                | Real-time chat, live updates        |
| **Who triggers?** | Sender triggers on events                    | Both sides can send anytime         |
| **Reliability**   | Needs retries                                | Built-in live connection            |
| **Simplicity**    | Very easy                                    | More complex                        |

### Key Difference

- **Webhook** = One-time event push (payment completed → send POST)
- **WebSocket** = Open pipe where both sides can talk anytime (chat apps, live dashboards)

## Signature Verification (Security)

Webhook URLs are public endpoints, so you must verify the request is genuine.

### Two Common Ways

#### (a) Token-based (Simple)

Sender includes a secret token in the header. Receiver compares it.

**Sender:**

```javascript
await fetch(webhook.url, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "X-Webhook-Token": webhook.token,
  },
  body: JSON.stringify(payload),
});
```

**Receiver:**

```javascript
if (req.headers["x-webhook-token"] !== "secret") {
  return res.status(401).json({ message: "token mismatch" });
}
```

This is basic but good enough for small systems.

#### (b) Signature-based (Recommended in Production)

**Flow:**

1. Sender signs the body using **HMAC SHA256** + secret
2. Receiver recomputes the signature → Compares
3. Prevents body tampering + replay attacks

**Note:** Most production systems like Stripe, Razorpay, and GitHub use HMAC-based signature verification.

## Retries & Idempotency

Webhooks are unreliable (network breaks, server down, timeout). So webhook senders must retry until the receiver returns `200 OK`.

### Why Retries?

- Receiver may be temporarily down
- Processing may take time
- Network issues

### Problem with Retries

Retries can result in **duplicate events** being delivered.

### Solution: Idempotency

**Meaning:** "Even if the same event is delivered multiple times, your server should process it only once."

**How receivers handle idempotency:**

- Store processed `event.id` in the database
- Ignore if the same `id` comes again
- Stripe, Razorpay, and GitHub all work this way

## Implementation Example

### Sender App (LMS Server)

#### 1. Registering a Webhook

```javascript
app.post("/api/register-webhook", (req, res) => {
  const { url, token, event } = req.body;

  db.push({
    id: Date.now().toString(),
    url,
    token,
    event,
  });

  return res.json({ message: "OK" });
});
```

**What happens:**

- User provides a webhook URL
- Sender stores it
- Later it will send notifications for that event (e.g., purchase)

#### 2. Triggering a Webhook on Purchase

```javascript
app.post("/api/purchase", (req, res) => {
  const { name, email, course } = req.body;

  const payload = {
    id: Date.now().toString(),
    name,
    email,
    course,
  };

  const webhooks = db.filter((webhook) => webhook.event === "purchase");

  sendWebhooks(webhooks, payload);

  return res.json({ message: "Course purchased successfully" });
});
```

**What happens:**

- Purchase event is created
- Find webhook subscribers
- Send POST request to each subscriber

#### 3. Sending the Webhook

```javascript
async function sendWebhooks(webhooks, payload) {
  for (const webhook of webhooks) {
    // TODO: Add retry + idempotency in production
    await fetch(webhook.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Webhook-Token": webhook.token,
      },
      body: JSON.stringify(payload),
    });
  }
}
```

**Note:** In real-world systems, add signing + retries + idempotency here.

### Receiver App (Automator Server)

#### Verifying & Processing Webhook

```javascript
app.post("/webhook", (req, res) => {
  if (req.headers["x-webhook-token"] !== "secret") {
    return res.status(401).json({ message: "token mismatch" });
  }

  const { id, name, email, course } = req.body;

  console.log(`Invite sent to ${name}`);

  return res.json({ message: "OK" });
});
```

**What happens:**

- Token is verified
- Body is extracted
- Event is processed

## Interview Summary

**A webhook** is a server-to-server communication mechanism where one server sends an HTTP POST request to another server whenever an event happens. Unlike WebSockets, webhooks are not persistent connections; they are one-time event pushes.

To secure webhooks, we use **signature verification** or a **secret token**. Since webhooks can fail, the sender must **retry delivery**, and the receiver must implement **idempotency** to avoid duplicate processing.

In a typical implementation, an LMS server sends webhook events to an Automator server after a purchase. This includes token verification and a basic send mechanism. In a real system, you would also include retries, HMAC signatures, and idempotency checks.
