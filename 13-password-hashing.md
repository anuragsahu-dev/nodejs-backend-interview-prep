# Why do we use bcrypt or argon2 if Node.js already has crypto?

Even though Node.js has the `crypto` module, it is **NOT** designed for password hashing.

## Normal hashing (SHA256, SHA512, MD5) from crypto is too fast

Fast hashing is bad for passwords because attackers can attempt billions of guesses per second using GPUs.

Therefore:

- `crypto.createHash("sha256")`
- `crypto.createHash("sha512")`

are **NOT** safe for passwords.

## Password Hashing Must Be Slow + Expensive

A secure password hashing algorithm must:

- Be slow (to reduce brute-force speed)
- Use a salt (prevent rainbow tables)
- Allow cost/tuning (more expensive over time)
- Often be memory-hard (defeat GPUs)

Built-in crypto hashing cannot do this.

This is why we use:

- `bcrypt`
- `argon2`
- `scrypt` (crypto)

These algorithms are specifically designed for passwords.

## bcrypt — Explanation

`bcrypt` is a slow, adaptive password hashing algorithm used for 20+ years.

### Features:

- Automatic salt generation
- Adjustable cost factor
- Slow hashing → protects against brute force
- Proven, battle-tested algorithm

### Modern usage:

```javascript
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("anurag@123", 10);
const match = await bcrypt.compare("anurag@123", hash);
```

## bcrypt vs bcryptjs (Important!)

| Library | Implementation | Speed | Notes |
|---------|---------------|-------|-------|
| `bcrypt` | C++ native addon | Fast & secure | Recommended |
| `bcryptjs` | Pure JavaScript | Slower | Only when native modules fail |

### Which one do 99% developers use?

**Answer:** `bcrypt`

It's faster and more secure because it uses optimized C++ bindings.

### When to use bcryptjs?

- Old shared hosting servers
- Environments where native modules cannot be compiled

Otherwise → always use `bcrypt`.

## argon2 — Explanation

`argon2` is a modern, stronger, next-generation hashing algorithm.

It won the **Password Hashing Competition (PHC)**.

### Features:

- Memory-hard (stops GPU attacks)
- Stronger than bcrypt
- Configurable (memory, time, parallelism)
- Recommended by security experts

### Modern usage:

```javascript
import argon2 from "argon2";

const hash = await argon2.hash("anurag@123", {
  type: argon2.argon2id, // Best variant
});

const match = await argon2.verify(hash, "anurag@123");
```

### Why is argon2 better than bcrypt?

- `bcrypt` is CPU-hard
- `argon2` is memory-hard → GPUs can't crack it easily
- More future-proof

## If argon2 is better, why do many still use bcrypt?

Because:

- `bcrypt` is older and more widely adopted
- `bcrypt` packages are simpler and lighter
- Many tutorials and codebases still rely on `bcrypt`
- `argon2` requires compiling a heavier native module

### Comparison:

| Goal | Best choice |
|------|-------------|
| Most common, easiest | `bcrypt` |
| Best security | `argon2id` |
| No external dependency (built-in) | `crypto.scrypt` |

## Where does scrypt (from crypto) fit in?

`scrypt` **IS** a password hashing algorithm designed for security.

Node.js `crypto.scrypt` implementation is:

- Slow and memory-hard
- Safe for password hashing
- No external library needed
- More secure than bcrypt (in theory)

### Example:

```javascript
import crypto from "node:crypto";

crypto.scrypt("password", "salt", 64, (err, key) => {
  console.log(key.toString("hex"));
});
```

But `argon2` is still considered the best.

## Final Recommendation (Straightforward)

**If you want what most companies use:**
- `bcrypt`

**If you want maximum security (modern apps):**
- `argon2id`

**If you want zero dependencies:**
- `crypto.scrypt`

**Avoid:**
- `bcryptjs` (use only if native build fails)

## Quick Interview Answer (Short & Powerful)

Node.js `crypto` is not safe for password hashing because SHA algorithms are too fast. Password hashing must be slow and salted, which is why we use `bcrypt`, `scrypt`, or `argon2`. `bcrypt` is most commonly used, `argon2` is the most secure, and `bcryptjs` is a slower JS fallback.