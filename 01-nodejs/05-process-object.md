# The `process` Object in Node.js

## Short Interview Definition

**The `process` object is a global Node.js object that provides information and control over the current running Node.js process. It can be accessed anywhere without importing.**

---

## What is the `process` Object?

`process` is a **global object** in Node.js that represents the current Node.js process.

- You can access it **anywhere** without importing
- It provides an interface to interact with the OS and runtime environment
- It includes properties like `process.pid`, `process.argv`, and `process.env`

---

## Why Does It Exist?

Node.js needs a way to interact with:

- **Operating System**
- **Environment variables**
- **Command-line arguments**
- **Event loop lifecycle**
- **Process-level events**

The `process` object provides that interface.

---

## Key Features (Interview Must-Know)

### 1. Access Environment Variables

```js
process.env.PORT
process.env.NODE_ENV
```

### 2. Command-Line Arguments

```js
process.argv
```

- `argv[0]` = Node binary path
- `argv[1]` = Script file path
- `argv[2...]` = User arguments

### 3. Exit / Control Process

```js
process.exit(0); // success
process.exit(1); // failure
```

### 4. Current Working Directory

```js
process.cwd();
```

### 5. Process ID

```js
process.pid;
```

### 6. High-Resolution Time

```js
process.hrtime();
```

### 7. Process Events

```js
process.on("exit", () => {});
process.on("uncaughtException", () => {});
process.on("unhandledRejection", () => {});
```

### 8. NextTick Queue

```js
process.nextTick(() => {});
```

**Note:** Runs before Promise microtasks (though order is not guaranteed in modern Node.js).

---

## Internals (Important Interview Point)

The `process` object is **not part of JavaScript**.

It comes from **Node.js bindings written in C/C++**, allowing JavaScript to interact with OS-level features.

---

## Summary

- **Global object** — no need to import
- Provides **OS and runtime information**
- Controls **process lifecycle**
- Handles **environment variables and arguments**
- Exposes **event-driven APIs** for process management