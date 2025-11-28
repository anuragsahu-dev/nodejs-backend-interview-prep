# CommonJS vs ES Modules in Node.js

## Short Interview Definition

**CommonJS is the traditional Node.js module system using `require()` and `module.exports`, loaded synchronously at runtime. ES Modules are the modern JavaScript standard using `import` and `export`, loaded asynchronously with static analysis.**

---

## 1. What is CommonJS (CJS)?

CommonJS is the **older, default module system** in Node.js.

### Key Characteristics

- Uses `require()` to import
- Uses `module.exports` or `exports` to export
- **Synchronous loading** (executed at runtime)
- Works out of the box in Node.js without configuration
- File extension usually `.js`

### Example (CommonJS)

```js
// add.js
module.exports = function add(a, b) {
  return a + b;
};

// index.js
const add = require("./add");
console.log(add(2, 3));
```

---

## 2. What are ES Modules (ESM)?

ES Modules are the **official JavaScript module standard** (used in browsers + modern Node.js).

### Key Characteristics

- Uses `import` and `export`
- **Asynchronous** & statically analyzed at compile time
- Can perform **tree-shaking** (dead code elimination)
- File extension usually `.mjs` or `.js` with `"type": "module"`
- **Strict mode** by default

### Example (ES Modules)

```js
// add.js
export function add(a, b) {
  return a + b;
}

// index.js
import { add } from "./add.js";
console.log(add(2, 3));
```

---

## 3. Differences Between CommonJS and ES Modules

| Feature | CommonJS (CJS) | ES Modules (ESM) |
|---------|----------------|------------------|
| **Syntax** | `require()`, `module.exports` | `import`, `export` |
| **Loading** | Synchronous | Asynchronous |
| **Execution** | Runtime-loaded | Compile-time analyzed |
| **File Extensions** | `.js` | `.mjs` or `.js` with `"type": "module"` |
| **Default Mode** | Not strict | Strict mode always |
| **Top-Level await** | ❌ Not supported | ✅ Supported |
| **Exports** | Mutable exports | Live bindings |
| **Performance** | Slower (runtime evaluation) | Faster (static analysis) |
| **Browser Support** | ❌ Not supported natively | ✅ Native browser support |

---

## 4. How Node.js Decides CJS vs ESM?

Node.js treats a file as **ESM** when:

1. The file extension is `.mjs`, **OR**
2. `package.json` contains:
   ```json
   {
     "type": "module"
   }
   ```

Otherwise, Node treats `.js` files as **CommonJS**.

---

## 5. Why ESM Was Introduced?

- To **unify JavaScript modules** across browsers and Node.js
- To allow **static analysis** → better optimization & tree-shaking
- To make JavaScript imports **asynchronous** for better performance

---

## 6. Can CJS and ESM Work Together?

Yes, but with **limitations**.

### From CommonJS → import ESM

❌ **Not allowed directly** (CJS can't `require()` ESM).

### From ESM → import CommonJS

✅ **Works** using:

```js
import pkg from './file.cjs';

## Final Interview-Perfect Summary

**CommonJS is the old Node.js module system using require() and module.exports, loaded synchronously at runtime. ES Modules are the modern JavaScript standard using import and export, loaded asynchronously with static analysis. ES Modules offer better optimization, browser support, and future-proofing.**