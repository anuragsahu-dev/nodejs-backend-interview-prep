# Crypto Module in Node.js

The `crypto` module in Node.js is a built-in module that provides cryptographic functionalities such as:

- Hashing (SHA256, SHA512, MD5, etc.)
- Encryption & Decryption (AES-256-CBC, etc.)
- HMAC generation
- Key pair generation (RSA, EC, etc.)
- Password hashing (pbkdf2, scrypt)
- Random bytes (secure tokens, OTPs)

It is part of Node's standard library — so no installation is required.

```javascript
import crypto from "node:crypto";
```

## Why Crypto Is Used in Backend

Crypto helps in:

- Securing passwords
- Creating tokens (OTP, reset tokens)
- Encrypting sensitive data (Aadhaar, PAN, etc.)
- Verifying request signatures
- Generating random values
- Creating hashing for files/strings (integrity check)

## Use Case 1: Hashing Passwords (pbkdf2 OR scrypt)

**Hashing = one-way → can't be reversed.**

### Using crypto.scrypt (recommended)

```javascript
import crypto from "node:crypto";

export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString("hex");

  const hashed = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });

  return `${salt}:${hashed}`;
};

export const verifyPassword = async (password, hashedData) => {
  const [salt, storedHash] = hashedData.split(":");

  const hashed = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });

  return hashed === storedHash;
};

// Usage
const h = await hashPassword("anurag@123");
console.log(h);
console.log(await verifyPassword("anurag@123", h));
```

## Use Case 2: Creating OTP or Secure Random Token

OTP, password reset tokens, email verification tokens, etc.

```javascript
import crypto from "node:crypto";

const generateOTP = () => {
  return crypto.randomInt(100000, 999999); // 6-digit OTP
};

const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

console.log(generateOTP());  
console.log(generateToken());
```

## Use Case 3: Hashing Tokens Before Saving to DB

Real-world production pattern:

```javascript
const rawToken = crypto.randomBytes(32).toString("hex");

const hashedToken = crypto
  .createHash("sha256")
  .update(rawToken)
  .digest("hex");

console.log({ rawToken, hashedToken });
```

**Note:** Save only `hashedToken` in the DB.

## Use Case 4: Creating File or String Hashes (SHA256)

Used for verifying file integrity.

```javascript
import crypto from "node:crypto";

const hash = crypto
  .createHash("sha256")
  .update("hello world")
  .digest("hex");

console.log(hash);
```

## Use Case 5: HMAC (Hash-based Message Authentication Code)

Used for verifying API requests (Stripe, Razorpay, webhook signature).

```javascript
import crypto from "node:crypto";

const secret = "my_webhook_secret";
const data = "payment_received";

const signature = crypto
  .createHmac("sha256", secret)
  .update(data)
  .digest("hex");

console.log(signature);
```

## Use Case 6: Encrypt & Decrypt Sensitive Data (AES-256-CBC)

For protecting Aadhaar numbers, addresses, etc.

### Encryption

```javascript
import crypto from "node:crypto";

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);    // 256 bits
const iv = crypto.randomBytes(16);     // 128 bits

export const encrypt = (data) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encrypted };
};
```

### Decryption

```javascript
export const decrypt = ({ encrypted, iv }) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Usage
const enc = encrypt("my secret data");
console.log(enc);

console.log(decrypt(enc));
```

## Use Case 7: Generating Key Pairs (Public-Private Keys)

Used for JWT RS256 algorithm, digital signatures.

```javascript
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

console.log(publicKey.export({ type: "pkcs1", format: "pem" }));
console.log(privateKey.export({ type: "pkcs1", format: "pem" }));
```

## Use Case 8: Signing and Verifying Data

Used in secure APIs.

```javascript
import crypto from "node:crypto";

const sign = crypto.createSign("RSA-SHA256");
sign.update("hello");
const signatureHex = sign.sign(privateKey, "hex");

const verify = crypto.createVerify("RSA-SHA256");
verify.update("hello");

console.log(verify.verify(publicKey, signatureHex, "hex"));
```

## Extra Mini Examples (Modern Syntax)

### Generate random base64 token

```javascript
crypto.randomBytes(24).toString("base64");
```

### Using timingSafeEqual (prevent timing attacks)

```javascript
const isEqual = crypto.timingSafeEqual(
  Buffer.from("abc"),
  Buffer.from("abc")
);

console.log(isEqual);
```

### Hash a JSON object

```javascript
const objHash = crypto
  .createHash("sha256")
  .update(JSON.stringify({ name: "Anurag", age: 21 }))
  .digest("hex");

console.log(objHash);
```

## Interview-Level Summary (Quick Notes)

`crypto` is a built-in Node module for hashing, encryption, HMAC, and secure random values.

**Common functions:**

- `createHash()` → one-way hashing
- `randomBytes()` → tokens
- `scrypt()` / `pbkdf2()` → password hashing
- `createCipheriv()` / `createDecipheriv()` → encryption
- `createHmac()` → signature verification
- `generateKeyPairSync()` → RSA keys