# Backend Architecture Patterns

## 1. MVC (Model–View–Controller)

**What to say in interview:**

MVC separates the application into Model, View, and Controller. Backend mainly uses:

- **Model** → Database structure
- **Controller** → Handles requests, calls model/service
- **View** → API response (JSON in backend APIs)

It keeps the code organized and easier to maintain.

---

## 2. Layered Architecture (Controller → Service → Repository)

**Simple explanation:**

It separates responsibilities clearly:

- **Controller:** Handles HTTP requests
- **Service:** Business logic
- **Repository:** Database queries

This improves testability and keeps logic clean.

---

## 3. Clean Architecture

Clean Architecture means the core business logic does not depend on frameworks or database. Inner layers are independent; outer layers (DB, HTTP) depend on them. Helps write maintainable and scalable apps.

---

## 4. Dependency Injection (DI)

**Interview explanation:**

Dependency Injection means giving a class its dependencies instead of the class creating them. This reduces tight coupling and makes testing easier.

**Simple DI example in Node.js:**

```javascript
// repository
class UserRepository {
  findUser(id) {
    /* DB logic */
  }
}

// service (dependency injected)
class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo; // injected dependency
  }

  getUser(id) {
    return this.userRepo.findUser(id);
  }
}

// injecting dependency
const userRepo = new UserRepository();
const userService = new UserService(userRepo);
```

**Why this is DI:**

- Service does NOT create `UserRepository`
- We pass (inject) it from outside → loose coupling → easy to mock in tests

---

## 5. Singleton Pattern

A pattern where only one instance of a class exists. Common backend examples:

- Database connection instance
- Logger instance
- Config loader

---

## 6. Repository Pattern

A pattern that abstracts database operations into a separate layer. The service does not know whether we use MongoDB, Postgres, etc. This makes switching databases easy and keeps business logic clean.

---

## 7. Event-Driven Architecture

Instead of calling functions directly, services communicate using events.

**Example:** User signup emits a `USER_CREATED` event → email service listens.

It helps decouple services and improves scalability.

---

## 8. Monolithic vs Microservices

### Monolithic

- One single codebase
- Simple to build & deploy
- Good for small apps

### Microservices

- App split into small independent services
- Services can scale individually
- More complex (communication, deployment, monitoring)
