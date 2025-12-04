# Backend Testing Guide

## Manual Testing vs Automated Testing

### Problems with Manual Testing

Manual testing means testing your API endpoints using tools like Postman or cURL after every code change.

**Problems:**

- **Time-consuming:** You have to manually test every endpoint after each change
- **Human error:** Easy to forget testing edge cases or specific scenarios
- **Not scalable:** As your app grows, manually testing 50+ endpoints becomes impossible
- **No regression detection:** Old features might break when you add new code, but you won't know until users complain
- **Slows down development:** Every small change requires extensive manual verification
- **No CI/CD integration:** Can't automatically verify code before deployment

### Why We Need Automated Testing

Automated tests solve these problems:

- **Fast:** Run hundreds of tests in seconds
- **Reliable:** Tests run the same way every time
- **Regression prevention:** Automatically catch bugs in old features
- **Confidence:** Deploy code knowing it works
- **Documentation:** Tests show how your code should behave
- **CI/CD ready:** Automatically run tests before merging code
- **Refactoring safety:** Change code structure without breaking functionality

**Real-world scenario:**

Without tests: You change a function → manually test 10 endpoints → miss one → bug goes to production.

With tests: You change a function → run `npm test` → all 100 tests pass in 5 seconds → deploy confidently.

## Types of Testing

### 1. Unit Testing

**Unit testing** means testing a single small function or piece of logic in isolation, without database, network, or any external dependencies.

**Purpose:** Ensure your logic works correctly.

**Common Packages:**

- **Jest** (most popular)
- **Vitest** (modern, faster alternative)
- **Mocha + Chai** (older stack)

#### Unit Test Example

**sum.js**

```javascript
export const sum = (a, b) => {
  return a + b;
};
```

**sum.test.js**

```javascript
import { sum } from "./sum.js";

test("should add two numbers correctly", () => {
  expect(sum(5, 3)).toBe(8);
});

test("should handle negative numbers", () => {
  expect(sum(-5, 3)).toBe(-2);
});

test("should handle zero", () => {
  expect(sum(0, 0)).toBe(0);
});
```

**Key Points:**

- Tests only one function
- No database, no server — pure logic only
- Fast and isolated

### 2. Integration Testing

**Integration testing** checks how two or more parts of your app work together.

**Examples:**

- Controller + Service
- Route + Middleware
- API + Database (test database)

**Common Packages:**

- **Supertest** (for HTTP calls)
- **Jest** (test runner)

#### Integration Test Example

**app.js**

```javascript
import express from "express";

const app = express();
app.use(express.json());

app.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.post("/user", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  res.status(201).json({ id: 1, name });
});

export default app;
```

**app.test.js**

```javascript
import request from "supertest";
import app from "./app.js";

describe("GET /hello", () => {
  test("should return 200 with message", async () => {
    const res = await request(app).get("/hello");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Hello World");
  });
});

describe("POST /user", () => {
  test("should create user successfully", async () => {
    const res = await request(app).post("/user").send({ name: "John" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("John");
  });

  test("should return 400 if name is missing", async () => {
    const res = await request(app).post("/user").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Name is required");
  });
});
```

**Key Points:**

- Tests controller + Express pipeline
- No mocking, real route calls
- Tests HTTP layer (status codes, request/response)

### 3. E2E Testing (End-to-End)

**E2E testing** checks the complete flow of the application, like a real user would interact with it.

**Flow:** API Request → Controller → Service → Database → Response

**When to use:** When you want to ensure the whole system works together.

**Packages:**

- **Jest + Supertest** (backend only)
- **Cypress** (full E2E including frontend)
- **Playwright** (modern alternative)

**Note:** Mostly asked conceptually in interviews. Not required to implement as a fresher, but good to understand the concept.

### 4. Mocking

**Mocking** means creating fake versions of functions (especially database calls) so your tests run fast and isolated.

**Why mock?**

- Tests run faster (no real database calls)
- Tests are predictable (no external dependencies)
- Can simulate errors and edge cases easily

#### Mocking Example

**user.service.js**

```javascript
import db from "./database.js";

export const findUser = async (id) => {
  const user = await db.users.findById(id);
  return user;
};

export const createUser = async (userData) => {
  const user = await db.users.create(userData);
  return user;
};
```

**user.test.js**

```javascript
import { jest } from "@jest/globals";

// Mock the entire service module
jest.mock("./user.service.js", () => ({
  findUser: jest.fn().mockResolvedValue({
    id: 1,
    name: "Mock User",
    email: "mock@test.com",
  }),
  createUser: jest.fn().mockResolvedValue({
    id: 2,
    name: "New User",
  }),
}));

import { findUser, createUser } from "./user.service.js";

describe("User Service", () => {
  test("should return mocked user", async () => {
    const result = await findUser(1);

    expect(result.name).toBe("Mock User");
    expect(result.email).toBe("mock@test.com");
  });

  test("should create mocked user", async () => {
    const result = await createUser({ name: "New User" });

    expect(result.id).toBe(2);
    expect(createUser).toHaveBeenCalledWith({ name: "New User" });
  });
});
```

**Key Points:**

- Database calls are replaced with mock calls
- Tests become fast and predictable
- Can test error scenarios without breaking real data

## Testing Controllers vs Services

### Controller Tests (Integration Tests)

**What to test:**

- HTTP layer (status codes, headers)
- Request validation
- Response format
- Authentication/Authorization

**Tools:** Supertest + Jest

**Example:**

```javascript
test("POST /signup should return 201 and user object", async () => {
  const res = await request(app)
    .post("/signup")
    .send({ email: "test@test.com", password: "pass123" });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("user");
});
```

### Service Tests (Unit Tests)

**What to test:**

- Business logic
- Data transformations
- Calculations
- Validation rules

**Tools:** Jest with mocked database

**Example:**

```javascript
test("createUser should hash password before saving", async () => {
  const mockUser = { email: "test@test.com", password: "plain" };
  const result = await createUser(mockUser);

  expect(result.password).not.toBe("plain");
  expect(result.password.length).toBeGreaterThan(20);
});
```

**Interview Answer:**

- **Controllers** = Integration tests (test HTTP layer)
- **Services** = Unit tests (test business logic)

## Why Backend Tests Matter

**Benefits:**

- **Prevent bugs early:** Catch issues before they reach production
- **Code reliability:** Confidence that your code works as expected
- **Easier refactoring:** Change code structure without fear
- **Production readiness:** Critical for professional applications
- **CI/CD integration:** Automatically block bad code from merging
- **Clean architecture:** Forces you to write testable, modular code
- **Documentation:** Tests show how your code should be used

## Test Pyramid

```
        E2E Tests (slow, few)
     Integration Tests (medium)
   Unit Tests (fast, many)
```

**Meaning:**

- **70%** Unit tests (fast, test individual functions)
- **20%** Integration tests (test components working together)
- **10%** E2E tests (test entire user flows)

**Why this ratio?**

- Unit tests are fast and catch most bugs
- E2E tests are slow and expensive to maintain
- Balance gives good coverage without slowing development

## Common Testing Strategies

**What to test:**

- **Happy path:** Test successful scenarios
- **Validation errors:** Missing fields, invalid data
- **Authentication/Authorization:** Protected routes, permissions
- **Database failures:** Mock database errors
- **Edge cases:** Empty arrays, null values, invalid IDs
- **Boundary conditions:** Max/min values, limits

**Best practices:**

- Use in-memory database for MongoDB/PostgreSQL testing
- Use Supertest for route tests
- Mock external APIs (payment gateways, email services)
- Test one thing per test
- Use descriptive test names

## How to Write Tests in Real Projects

### Approach 1: Feature-First (Most Common)

**Steps:**

1. Write the feature code
2. Test manually from Postman
3. Write automated tests for controller/service
4. Add test coverage in CI/CD pipeline

**Pros:**

- Fastest approach for juniors
- Real-world workflow
- Learn testing gradually

**Cons:**

- Might miss edge cases initially

### Approach 2: TDD (Test-Driven Development)

**Steps:**

1. Write test first (it fails — Red)
2. Write minimal code to pass test (Green)
3. Refactor code (Refactor)

**Example TDD Flow:**

```javascript
// Step 1: Write failing test
test("should calculate discount", () => {
  expect(calculateDiscount(100, 10)).toBe(90);
});

// Step 2: Write minimal code
const calculateDiscount = (price, discount) => {
  return price - discount;
};

// Step 3: Refactor
const calculateDiscount = (price, discountPercent) => {
  return price - (price * discountPercent) / 100;
};
```

**Benefits:**

- Cleaner architecture
- Less bug-prone
- Write only necessary code
- Better test coverage

**Drawbacks:**

- Slower at the start
- Requires practice
- Not used in all companies (mostly big products)

**Interview Note:** TDD is mostly asked conceptually. Knowing the concept is enough for fresher interviews.

## Interview Summary

| Concept              | Description                       | Tool                |
| -------------------- | --------------------------------- | ------------------- |
| **Unit Test**        | Test one function in isolation    | Jest, Vitest        |
| **Integration Test** | Test multiple components together | Supertest + Jest    |
| **E2E Test**         | Test complete user flow           | Cypress, Playwright |
| **Mocking**          | Fake database/external calls      | Jest mocks          |
| **Controller Tests** | Integration tests (HTTP layer)    | Supertest           |
| **Service Tests**    | Unit tests (business logic)       | Jest                |
| **Test Pyramid**     | More unit, fewer E2E              | Concept             |
| **TDD**              | Test → Code → Refactor            | Methodology         |

**Quick Answers:**

- **Why automated testing?** Fast, reliable, catches regressions, enables CI/CD
- **What's the test pyramid?** 70% unit, 20% integration, 10% E2E
- **Controller vs Service tests?** Controllers = integration, Services = unit
- **What is mocking?** Fake database calls for fast, isolated tests
- **TDD?** Write test first, then code, then refactor
