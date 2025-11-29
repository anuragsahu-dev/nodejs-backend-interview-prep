# FS & Path Modules in Node.js

## Overview

Node.js provides two essential core modules for file and path operations:

- **`fs` (File System)** — Interact with files and directories
- **`path`** — Work with file and directory paths safely and consistently

These modules are almost always used together, because `fs` needs correct file paths and `path` generates them safely across different operating systems.

## FS Module (File System)

The `fs` module allows you to read, write, modify, copy, move, delete, and inspect files and directories. It provides both **asynchronous** (non-blocking) and **synchronous** (blocking) methods.

### Common Use Cases

- Read files
- Write files
- Append to files
- Delete files
- Copy files
- Check file permissions
- Work with directories (create, delete, list)

### Asynchronous vs Synchronous Methods

| Type | Blocking | When to Use | Performance |
|------|----------|-------------|-------------|
| **Asynchronous** | Non-blocking | Production servers, web apps | Recommended - doesn't block event loop |
| **Synchronous** | Blocking | Scripts, initialization tasks | Avoid in production - blocks thread |

**Key Point:** Always prefer asynchronous methods in production to maintain Node.js's non-blocking nature.

### Two Versions of FS Module

#### 1. `fs/promises` (Modern - Recommended)

Promise-based API that works with `async/await`:

```javascript
import fs from "node:fs/promises";
```

**Benefits:**
- Clean async/await syntax
- Better error handling with try/catch
- Modern and maintainable code

#### 2. `fs` (Callback-based)

Traditional callback-based API:

```javascript
import fs from "node:fs";
```

**Note:** Still widely used in legacy code, but `fs/promises` is preferred for new projects.

## Path Module

The `path` module provides utilities for working with file system paths in a **safe and cross-platform** way.

### Why Path Module is Important

Different operating systems use different path separators:
- **Windows:** `\` (backslash)
- **macOS/Linux:** `/` (forward slash)

The `path` module automatically handles these differences, ensuring your code works across all platforms.

```javascript
import path from "node:path";
```

### Common Path Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `path.join()` | Join multiple segments into a clean path | `path.join('/user', 'docs', 'file.txt')` |
| `path.resolve()` | Convert relative path to absolute path | `path.resolve('data/file.txt')` |
| `path.basename()` | Get the file name from a path | `path.basename('/user/file.txt')` → `'file.txt'` |
| `path.dirname()` | Get the directory name from a path | `path.dirname('/user/file.txt')` → `'/user'` |
| `path.extname()` | Get the file extension | `path.extname('file.txt')` → `'.txt'` |
| `path.parse()` | Parse path into an object | Returns `{ root, dir, base, ext, name }` |

### Key Differences: `join()` vs `resolve()`

```javascript
// path.join() - concatenates paths
path.join('folder', 'file.txt');  // 'folder/file.txt'

// path.resolve() - creates absolute path
path.resolve('folder', 'file.txt');  // '/current/working/dir/folder/file.txt'
```

## Using FS + Path Together

Combining `fs` and `path` ensures correctness and cross-platform compatibility.

### Example 1: Create Directory and Write File

```javascript
import fs from "node:fs/promises";
import path from "node:path";

// Create directory (recursive: true creates parent dirs if needed)
const dirPath = path.join(process.cwd(), "data");
await fs.mkdir(dirPath, { recursive: true });

// Write file
const filePath = path.join(dirPath, "note.txt");
await fs.writeFile(filePath, "Hello from Node.js!", "utf8");
```

### Example 2: Append and Read File

```javascript
// Append content
await fs.appendFile(filePath, "\nAppended line!", "utf8");

// Read file
const content = await fs.readFile(filePath, "utf8");
console.log(content);
```

### Example 3: Check If File Exists

```javascript
import { constants } from "node:fs";

try {
  await fs.access(filePath, constants.F_OK);
  console.log("File exists!");
} catch {
  console.log("File does NOT exist!");
}
```

**Note:** `fs.access()` is preferred over deprecated `fs.exists()`.

### Example 4: List Files in Directory

```javascript
const files = await fs.readdir(dirPath);
console.log(files);  // Array of file names

// With file types
const filesWithTypes = await fs.readdir(dirPath, { withFileTypes: true });
filesWithTypes.forEach(file => {
  console.log(`${file.name} - ${file.isDirectory() ? 'DIR' : 'FILE'}`);
});
```

### Example 5: Rename/Move File

```javascript
const oldPath = path.join(dirPath, "note.txt");
const newPath = path.join(dirPath, "renamed.txt");
await fs.rename(oldPath, newPath);
```

### Example 6: Copy File

```javascript
const sourcePath = path.join(dirPath, "renamed.txt");
const copyPath = path.join(dirPath, "copy.txt");
await fs.copyFile(sourcePath, copyPath);
```

### Example 7: Delete File or Directory

```javascript
// Delete file
await fs.rm(copyPath);

// Delete directory (recursive: true deletes contents, force: true ignores errors)
await fs.rm(dirPath, { recursive: true, force: true });
```

**Note:** `fs.rm()` is the modern replacement for deprecated `fs.unlink()` (files) and `fs.rmdir()` (directories).

## Security: Preventing Path Traversal Attacks

**Path traversal** is a security vulnerability where malicious users try to access files outside the intended directory using paths like:

```
../../../etc/passwd
```

### Safe Path Join Function

```javascript
function safeJoin(base, target) {
  const resolved = path.resolve(base, target);
  
  // Ensure resolved path starts with base directory
  if (!resolved.startsWith(base)) {
    throw new Error("Invalid path: Path traversal detected");
  }
  
  return resolved;
}

// Usage
const userInput = "../../secret.txt";  // Malicious input
try {
  const safePath = safeJoin("/app/uploads", userInput);
} catch (error) {
  console.error(error.message);  // "Invalid path: Path traversal detected"
}
```

## Important Interview Points

### FS Module
- Provides methods to read, write, append, delete, copy, and inspect files
- Contains both async (non-blocking) and sync (blocking) methods
- **Always use `fs/promises` with `async/await` in production**
- Supports directory operations and permission checks
- `fs.rm()` is the modern way to delete files/directories

### Path Module
- Ensures safe, clean, cross-platform file paths
- Handles OS-specific path separators automatically
- Common methods: `join()`, `resolve()`, `basename()`, `dirname()`, `extname()`, `parse()`
- **Always use with `fs` module** for file operations
- Critical for preventing path traversal vulnerabilities

### Best Practices
1. Use `fs/promises` instead of callback-based `fs`
2. Always combine `fs` with `path` for cross-platform compatibility
3. Use `{ recursive: true }` when creating directories
4. Validate and sanitize user-provided file paths
5. Prefer `fs.access()` over deprecated `fs.exists()`
6. Use `fs.rm()` instead of `fs.unlink()` or `fs.rmdir()`