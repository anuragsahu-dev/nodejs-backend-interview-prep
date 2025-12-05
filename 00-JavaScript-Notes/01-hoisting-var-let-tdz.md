# JavaScript Fundamentals: Hoisting, Scope, and Variable Declarations

## 1. What is JavaScript?

**JavaScript** is a high-level, dynamic, interpreted scripting language primarily used for both frontend and backend web development. It enables developers to create interactive, responsive, and functional websites and applications.

### Why JavaScript is Important?

- **Most widely used language** for web development
- **Cross-platform** - works on both browser (client-side) and server (Node.js)
- **Asynchronous programming support** - makes API calls and real-time applications easy to handle

---

## 2. Variable Lifecycle: Declaration, Initialization, and Assignment

### 2.1 Variable Declaration

**Declaration** is the process of introducing a variable name to JavaScript, reserving memory space for it.

```javascript
var name;      // Declaration using var
let age;       // Declaration using let
const PI;      // ❌ Error: const must be initialized during declaration
```

**Key Points:**

- `var` and `let` can be declared without initialization
- `const` **must** be initialized at the time of declaration

### 2.2 Variable Initialization

**Initialization** is the process of assigning a value to a variable for the first time during declaration.

```javascript
var name = "John"; // Declaration + Initialization
let age = 25; // Declaration + Initialization
const PI = 3.14159; // Declaration + Initialization (required for const)
```

### 2.3 Variable Assignment

**Assignment** is the process of giving a value to an already declared variable.

```javascript
let username; // Declaration
username = "Alice"; // Assignment
```

### 2.4 Variable Re-assignment

**Re-assignment** is changing the value of a variable that already has a value.

```javascript
let count = 10; // Declaration + Initialization
count = 20; // Re-assignment

const MAX = 100; // const cannot be re-assigned
MAX = 200; // ❌ TypeError: Assignment to constant variable
```

**Important Note about `const` with Objects and Arrays:**

```javascript
const user = { name: "John" };
user.name = "Jane"; // ✅ Allowed - modifying property
user = { name: "Bob" }; // ❌ Error - re-assigning the reference

const numbers = [1, 2, 3];
numbers.push(4); // ✅ Allowed - modifying array
numbers = [5, 6, 7]; // ❌ Error - re-assigning the reference
```

---

## 3. What are var, let, and const in JavaScript?

In JavaScript, `var`, `let`, and `const` are keywords used to declare variables, but they differ in **scope**, **hoisting behavior**, and **re-assignment rules**.

### 3.1 var

`var` is **function-scoped** or **global-scoped**. It is hoisted and initialized with `undefined`.

**Characteristics:**

- **Scope:** Function or Global
- **Can be updated:** Yes
- **Can be re-declared:** Yes
- **Hoisted:** Yes, initialized with `undefined`
- **Block-scoped:** No

**Example (Hoisting):**

```javascript
console.log(a); // undefined (hoisted and initialized)
var a = 10;
console.log(a); // 10
```

**Example (Function Scope):**

```javascript
function test() {
  var message = "Hello";
  if (true) {
    var message = "Hi"; // Same variable (function-scoped)
  }
  console.log(message); // "Hi"
}
```

### 3.2 let

`let` is **block-scoped**, meaning it only exists inside `{ }`. It is hoisted but **not initialized**, staying in the Temporal Dead Zone (TDZ) until its declaration line.

**Characteristics:**

- **Scope:** Block
- **Can be updated:** Yes
- **Can be re-declared in same scope:** No
- **Hoisted:** Yes, but NOT initialized (TDZ)

**Example (TDZ):**

```javascript
console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 20;
console.log(b); // 20
```

**Example (Block Scope):**

```javascript
let x = 10;
if (true) {
  let x = 20; // Different variable (block-scoped)
  console.log(x); // 20
}
console.log(x); // 10
```

### 3.3 const

`const` is **block-scoped**, and its value **cannot be re-assigned**. It **must be initialized** at the time of declaration.

**Characteristics:**

- **Scope:** Block
- **Can be updated:** No (primitive values)
- **Can be re-declared:** No
- **Hoisted:** Yes, but stays in TDZ
- **Initialization required:** Yes (mandatory)

**Example:**

```javascript
const PI = 3.14159;
PI = 3.14;         // ❌ TypeError: Assignment to constant variable

const MAX;         // ❌ SyntaxError: Missing initializer in const declaration
```

---

## 4. What is Hoisting in JavaScript?

**Hoisting** is JavaScript's behavior of moving variable and function declarations to the top of their scope during the **memory creation phase**. Only **declarations** are hoisted, not **initializations**.

### Hoisting Behavior:

| Type                 | Hoisted? | Initialized?           | Accessible Before Declaration? |
| -------------------- | -------- | ---------------------- | ------------------------------ |
| `var`                | Yes      | Yes (with `undefined`) | Yes (returns `undefined`)      |
| `let`                | Yes      | No (TDZ)               | No (ReferenceError)            |
| `const`              | Yes      | No (TDZ)               | No (ReferenceError)            |
| Function Declaration | Yes      | Yes (fully hoisted)    | Yes                            |

### Examples:

**var Hoisting:**

```javascript
console.log(a); // undefined
var a = 10;
console.log(a); // 10

// How JavaScript interprets it:
// var a;              // Declaration hoisted
// console.log(a);     // undefined
// a = 10;             // Initialization stays in place
// console.log(a);     // 10
```

**let/const Hoisting (TDZ):**

```javascript
console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 20;
```

**Function Declaration Hoisting:**

```javascript
greet(); // "Hello!" - works because function is fully hoisted

function greet() {
  console.log("Hello!");
}
```

---

## 5. What is Temporal Dead Zone (TDZ)?

**Temporal Dead Zone (TDZ)** is the period between the start of a scope and the actual variable declaration where `let` and `const` exist but **cannot be accessed**. Accessing them gives a `ReferenceError`.

### Key Points:

- `let` and `const` are hoisted but **not initialized**
- TDZ starts at the beginning of the scope
- TDZ ends when the code reaches the declaration line
- Accessing a variable inside TDZ throws `ReferenceError`

### Example:

```javascript
// TDZ starts here for variable 'x'
console.log(x); // ❌ ReferenceError: Cannot access 'x' before initialization
let x = 10; // TDZ ends here
console.log(x); // 10
```

### Why TDZ Exists?

TDZ helps catch errors where variables are used before they are properly declared, making code more predictable and reducing bugs.

---

## 6. Scope in JavaScript

**Scope** determines where a variable can be accessed in a program.

### Types of Scope:

#### 6.1 Global Scope

Variables declared outside any function or block are in the **global scope** and accessible everywhere.

```javascript
var globalVar = "I'm global";

function test() {
  console.log(globalVar); // Accessible
}
```

#### 6.2 Function Scope

Variables declared with `var` inside a function are **function-scoped** - accessible only within that function.

```javascript
function test() {
  var functionScoped = "Only inside function";

  if (true) {
    var functionScoped2 = "Also function-scoped";
  }

  console.log(functionScoped); // ✅ Accessible
  console.log(functionScoped2); // ✅ Accessible (var ignores block)
}

console.log(functionScoped); // ❌ ReferenceError
```

#### 6.3 Block Scope

Variables declared with `let` and `const` inside `{ }` are **block-scoped** - accessible only within that block.

```javascript
if (true) {
  let blockScoped = "Only inside block";
  var notBlockScoped = "I escape the block";
}

console.log(notBlockScoped); // ✅ Accessible (var)
console.log(blockScoped); // ❌ ReferenceError
```

**Block Scope with Loops:**

```javascript
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}
console.log(i); // ❌ ReferenceError: i is not defined

for (var j = 0; j < 3; j++) {
  console.log(j); // 0, 1, 2
}
console.log(j); // 3 (var leaks out of the loop)
```

#### 6.4 Lexical Scope (Static Scope)

**Lexical Scope** means that inner functions have access to variables defined in their outer (parent) functions. The scope is determined by where the function is **written** in the code, not where it is called.

**Example:**

```javascript
function outer() {
  const outerVar = "I'm from outer";

  function inner() {
    console.log(outerVar); // ✅ Can access outer variable
  }

  inner();
}

outer();
```

**Lexical Scope Chain:**

```javascript
const global = "Global";

function level1() {
  const level1Var = "Level 1";

  function level2() {
    const level2Var = "Level 2";

    function level3() {
      // Can access all outer variables
      console.log(global); // ✅ "Global"
      console.log(level1Var); // ✅ "Level 1"
      console.log(level2Var); // ✅ "Level 2"
    }

    level3();
  }

  level2();
}

level1();
```

**Practical Example (Closures):**

```javascript
function createCounter() {
  let count = 0; // Private variable due to lexical scope

  return {
    increment: function () {
      count++;
      return count;
    },
    getCount: function () {
      return count;
    },
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
```

**Key Points about Lexical Scope:**

- Inner functions can access variables from outer functions
- Outer functions **cannot** access variables from inner functions
- Scope is determined at **write-time**, not **run-time**
- Forms the basis for **closures** in JavaScript

---

## Summary Table

| Feature                 | var                                | let                           | const             |
| ----------------------- | ---------------------------------- | ----------------------------- | ----------------- |
| Scope                   | Function/Global                    | Block                         | Block             |
| Hoisting                | Yes (initialized with `undefined`) | Yes (TDZ)                     | Yes (TDZ)         |
| Re-assignment           | ✅ Yes                             | ✅ Yes                        | ❌ No             |
| Re-declaration          | ✅ Yes                             | ❌ No                         | ❌ No             |
| Initialization Required | ❌ No                              | ❌ No                         | ✅ Yes            |
| TDZ                     | ❌ No                              | ✅ Yes                        | ✅ Yes            |
| Best Practice           | Avoid                              | Use for variables that change | Use for constants |

---

## Interview Tips

1. **Always prefer `const`** by default, use `let` when you need to re-assign, avoid `var`
2. **Understand TDZ** - common interview question about `let`/`const` behavior
3. **Know the difference** between declaration, initialization, and assignment
4. **Lexical scope** is fundamental to understanding closures
5. **Hoisting** is a key concept - be able to explain how JavaScript interprets code
6. **Block scope vs Function scope** - understand when variables are accessible
