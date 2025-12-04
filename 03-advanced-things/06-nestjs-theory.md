# NestJS Theory (Fresher-Friendly)

## What is NestJS?

NestJS is a Node.js backend framework built on top of Express (or Fastify) that provides a structured, scalable architecture similar to Angular.

**Note:** Interviewers only expect basic theory, not deep internals.

---

## 1. Why NestJS?

**Interview-ready explanation:**

"NestJS is used because it brings structure to backend applications. It comes with built-in modules, dependency injection, decorators, and an opinionated architecture that makes large codebases easier to maintain."

**Key Benefits:**

- Scalable architecture
- Follows MVC-like pattern
- Built-in features: DI, modules, guards, pipes, interceptors
- TypeScript by default
- Easy testing

---

## 2. Module System

### What is a Module?

A module is a class annotated with `@Module()` that groups related controllers, services, and providers.

**Example:**

```typescript
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

**Interview-ready explanation:**

"Modules help structure the application into logical units."

---

## 3. Providers

### What are Providers?

Providers are classes that can be injected into other classes using NestJS's dependency injection system.

Most services, repositories, and utilities are providers.

**Example:**

```typescript
@Injectable()
export class UserService {}
```

---

## 4. Dependency Injection (DI)

### What is DI?

DI allows NestJS to automatically provide instances of classes where needed.

**Example:**

```typescript
constructor(private userService: UserService) {}
```

NestJS automatically creates `userService` and injects it.

**Interview-ready explanation:**

"DI makes the code loosely coupled and easy to test."

---

## 5. Decorators

### What are Decorators?

Decorators are metadata annotations used to tell NestJS how to treat a class or method.

### Common Decorators

| Decorator                                  | Purpose                  |
| ------------------------------------------ | ------------------------ |
| `@Controller()`                            | Marks a controller       |
| `@Get()`, `@Post()`, `@Put()`, `@Delete()` | Route handlers           |
| `@Injectable()`                            | Makes a class a provider |
| `@Module()`                                | Defines a module         |
| `@Body()`, `@Param()`, `@Query()`          | Extract request data     |

**Note:** You are not expected to explain custom decorators as a fresher.

---

## 6. Controllers

### What are Controllers?

Controllers handle incoming HTTP requests and return responses.

**Example:**

```typescript
@Controller("users")
export class UserController {
  @Get()
  getAllUsers() {
    return "Users list";
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return "User created";
  }
}
```

---

## 7. Services

### What are Services?

Services contain business logic, database operations, and reusable functions.

**Example:**

```typescript
@Injectable()
export class UserService {
  findAll() {
    return ["user1", "user2"];
  }
}
```

Services are injected into controllers using dependency injection.

---

## 8. Guards

### What are Guards?

Guards control whether a request should be allowed to proceed.

**Used for:**

- Authentication (e.g., JWT verification)
- Authorization (RBAC - Role-Based Access Control)

**Example:**

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const role = context.switchToHttp().getRequest().user.role;
    return role === "admin";
  }
}
```

**Usage:**

```typescript
@UseGuards(RolesGuard)
@Get('admin')
getAdminData() {
  return 'Admin data';
}
```

**Interview-ready explanation:**

"Guards run before the controller and decide whether a request is allowed."

---

## 9. Pipes

### What are Pipes?

Pipes are used for validation and transformation of request data.

**Used for:**

- Validation (using `class-validator`)
- Data transformation

**Example:**

```typescript
@Post()
create(@Body(new ValidationPipe()) dto: CreateUserDto) {
  return 'User created';
}
```

**Interview-ready explanation:**

"Pipes run before the controller and validate/transform input data."

---

## 10. Interceptors

### What are Interceptors?

Interceptors are used to add extra logic before/after request handling.

**Used for:**

- Logging
- Modifying response
- Adding headers
- Transforming data

**Example:**

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    console.log("Before request...");
    return next.handle();
  }
}
```

**Interview-ready explanation:**

"Interceptors wrap around the request-response cycle to add extra logic."

---

## 11. Exception Filters

### What are Exception Filters?

Exception filters are used to handle errors and customize error responses.

**Example:**

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    return response.json({
      statusCode: exception.getStatus(),
      message: exception.message,
    });
  }
}
```

**Interview-ready explanation:**

"Exception filters let you customize error responses globally or per controller."

---

## 12. NestJS Folder Structure

### Basic Structure

```
src/
 ├── app.module.ts          # Root module
 ├── main.ts                # Entry point
 ├── user/
 │    ├── user.module.ts    # User module
 │    ├── user.controller.ts # User controller
 │    ├── user.service.ts   # User service
 │    └── dto/
 │         └── create-user.dto.ts  # Data Transfer Object
 └── auth/
      ├── auth.module.ts
      ├── auth.controller.ts
      └── auth.service.ts
```

**Note:** You are not expected to know advanced folder structures as a fresher.

---

## 13. Request Lifecycle (Order of Execution)

Understanding the order helps in interviews:

```
1. Middleware
    ↓
2. Guards
    ↓
3. Interceptors (before)
    ↓
4. Pipes
    ↓
5. Controller
    ↓
6. Service
    ↓
7. Interceptors (after)
    ↓
8. Exception Filters (if error occurs)
    ↓
9. Response
```

---

## Interview Summary

### As a Fresher, You Need to Know:

✅ **What NestJS is** - Structured Node.js framework  
✅ **Why it's used** - Scalability, structure, TypeScript, DI  
✅ **Basic building blocks** - Module, Controller, Service  
✅ **Dependency Injection** - Auto-injection of classes  
✅ **Providers** - Injectable classes  
✅ **Guards** - Authentication/Authorization  
✅ **Pipes** - Validation and transformation  
✅ **Interceptors** - Request/response manipulation  
✅ **Exception Filters** - Error handling

### You Don't Need to Know:

❌ Custom decorators  
❌ Complex module systems  
❌ Advanced dependency injection scopes  
❌ Testing NestJS deeply  
❌ Microservices architecture  
❌ GraphQL integration

---

## Quick Interview Answers

**Q: What is NestJS?**  
A: "NestJS is a Node.js framework that provides a structured, scalable architecture using TypeScript, modules, and dependency injection."

**Q: Why use NestJS over Express?**  
A: "NestJS provides built-in structure, dependency injection, and an opinionated architecture that makes large applications easier to maintain."

**Q: What are the main building blocks?**  
A: "Modules, Controllers, Services, Providers, Guards, Pipes, Interceptors, and Exception Filters."

**Q: What is dependency injection?**  
A: "DI is a design pattern where NestJS automatically provides instances of classes, making code loosely coupled and testable."

**Q: What's the difference between Guards and Pipes?**  
A: "Guards decide if a request is allowed (authentication/authorization), while Pipes validate and transform input data."
