# ORM & ODM (Prisma & Mongoose)

## What is an ORM?

**ORM (Object-Relational Mapping)** is a tool that lets developers interact with a database using objects, classes, and methods instead of manually writing SQL queries.

### Simple Definition (Memorizable)

- "ORM converts your code (objects/classes) into database queries automatically."
- "ORM lets you work with the database using JavaScript/TypeScript instead of raw SQL."
- "ORM abstracts SQL so you can perform CRUD through a clean API."

**Example (generic ORM):**

```javascript
const user = await db.user.findMany(); // No SQL needed
```

---

## Why we don't directly use database drivers & instead use Prisma/Mongoose?

### Problems with Using Database Driver Directly (raw queries)

- You write SQL manually → time-consuming & error-prone
- No schema safety → mistakes only caught at runtime
- No migrations system
- Complex joins or relationships need manual handling
- Harder to maintain in big projects

### Benefits of ORM/ODM (Prisma/Mongoose)

| Feature                    | ORM/ODM | Raw SQL |
| -------------------------- | ------- | ------- |
| Type-safety                | ✔ Yes   | ❌ No   |
| Auto migration             | ✔       | ❌      |
| Easy relations             | ✔       | Hard    |
| Cleaner code               | ✔       | ❌      |
| Less boilerplate           | ✔       | ❌      |
| Validation at schema level | ✔       | ❌      |

---

## Prisma (SQL ORM)

Prisma works with **PostgreSQL, MySQL, SQL Server, SQLite, CockroachDB, MongoDB (experimental)**.

### What is Prisma?

Prisma is a next-gen TypeScript ORM that gives:

- Type-safe queries
- Auto-generated Prisma Client
- Schema model (`prisma.schema`)
- Migrations
- Middlewares
- Transaction support

### 1. Prisma Schema

**Main file:** `schema.prisma`

Defines your models, relations, enums, datasource, and generator.

**Example:**

```prisma
model User {
  id     Int @id @default(autoincrement())
  name   String
  posts  Post[]
}

model Post {
  id       Int @id @default(autoincrement())
  title    String
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}
```

It acts like your **single source of truth** for DB structure.

### 2. Prisma Migrations

Used to sync schema → actual database.

**Command:**

```bash
npx prisma migrate dev --name init
```

**Creates:**

- SQL migration
- Updated Prisma Client types

### 3. Prisma Client Generation

After migration:

```bash
npx prisma generate
```

Then you can use:

```javascript
const users = await prisma.user.findMany();
```

The client gives **auto-completion, type safety, validation, and error hints**.

### 4. Relations in Prisma (1-1, 1-n, n-n)

**One-to-One:**

```prisma
model User {
  id     Int @id
  profile Profile?
}

model Profile {
  id     Int @id
  user   User @relation(fields: [userId], references: [id])
  userId Int @unique
}
```

**One-to-Many:**

(User → many Posts)

```prisma
model User {
  id    Int @id
  posts Post[]
}
```

**Many-to-Many:**

```prisma
model User {
  id    Int @id
  roles Role[] @relation("UserRoles")
}

model Role {
  id    Int @id
  users User[] @relation("UserRoles")
}
```

Prisma auto-creates join table.

### 5. Transactions in Prisma

Used when you need multiple queries to succeed/fail together.

```javascript
await prisma.$transaction([
  prisma.user.create({ data: {...} }),
  prisma.post.create({ data: {...} }),
]);
```

### 6. Prisma Middlewares

Runs before/after DB queries.

**Example: logging middleware**

```javascript
prisma.$use(async (params, next) => {
  console.log("Query: ", params.model, params.action);
  return next(params);
});
```

**Used for:**

- Logging
- Soft deletes
- Multi-tenancy
- Permissions

### 7. Prisma vs Raw SQL — Why Prisma?

**Benefits:**

- ✔ Type-safe
- ✔ Auto-generated client
- ✔ Less boilerplate
- ✔ Cleaner relationships
- ✔ Migrations
- ✔ Prevents SQL injection

**Limitation:**

- ❌ Raw SQL needed in complex performance-heavy queries

### Joins in Prisma

SQL databases need joins to combine tables.

**Example:**

```javascript
const user = await prisma.user.findMany({
  include: { posts: true },
});
```

This works like:

```sql
SELECT * FROM Users
LEFT JOIN Posts ON Posts.authorId = Users.id;
```

---

## Mongoose (MongoDB ODM)

**Mongoose is an ODM** → **Object Document Mapper** (not ORM, because MongoDB is NoSQL)

MongoDB is NoSQL → document-based → no tables/joins.

### 1. Mongoose Schema

Defines structure of a document.

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});
```

**Schema = shape + validation + default values.**

### 2. Schema Types

**Examples:**

- `String`
- `Number`
- `Date`
- `Boolean`
- `ObjectId`
- `Array`
- `Mixed`

```javascript
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: [String],
});
```

### 3. Pre & Post Middleware

**Pre-save:**

```javascript
userSchema.pre("save", function (next) {
  console.log("Before saving");
  next();
});
```

**Post-save:**

```javascript
userSchema.post("save", function (doc) {
  console.log("After saving", doc);
});
```

**Used for:** hashing passwords, logging, etc.

### 4. Virtuals (computed fields)

**Virtuals** are document properties that are **not stored in MongoDB**. They are computed on-the-fly when you access them.

**Why use Virtuals?**

- Save database storage (don't store redundant data)
- Create dynamic fields from existing data
- Format data for API responses

**Example 1: Full Name**

```javascript
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
});

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model("User", userSchema);

// Usage
const user = await User.findOne({ firstName: "John" });
console.log(user.fullName); // "John Doe" (not stored in DB)
```

**Example 2: Age from Date of Birth**

```javascript
const userSchema = new mongoose.Schema({
  dateOfBirth: Date,
});

userSchema.virtual("age").get(function () {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});
```

**Use Cases:**

- Calculate age from birthdate
- Generate full names from first/last names
- Format URLs or slugs
- Calculate totals or percentages
- Create display-friendly formats

**Important:** To include virtuals in JSON responses, use:

```javascript
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });
```

### 5. Populate (MongoDB's version of join)

**Populate** replaces a reference (`ObjectId`) with the actual document from another collection. It's like a JOIN in SQL, but happens in the application layer.

**Schema Setup:**

```javascript
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});
```

**Without Populate:**

```javascript
const post = await Post.findById(postId);
console.log(post.author); // Output: "507f1f77bcf86cd799439011" (just an ObjectId)
```

**With Populate:**

```javascript
const post = await Post.findById(postId).populate("author");
console.log(post.author);
// Output: { _id: "507f...", name: "John Doe", email: "john@example.com" }
```

**Advanced Populate Examples:**

**1. Select specific fields:**

```javascript
await Post.find().populate("author", "name email"); // Only get name and email
```

**2. Populate multiple fields:**

```javascript
await Post.find().populate("author").populate("category");
```

**3. Nested populate:**

```javascript
await Post.find().populate({
  path: "author",
  populate: { path: "company" }, // Populate author's company
});
```

**4. Populate with conditions:**

```javascript
await Post.find().populate({
  path: "comments",
  match: { approved: true }, // Only populate approved comments
  options: { limit: 10, sort: { createdAt: -1 } },
});
```

**Use Cases:**

- Display user info with their posts
- Show product details with category information
- Load comments with author details
- Fetch orders with customer and product data

**Performance Note:** Populate makes **multiple queries** behind the scenes, so use it wisely. For heavy operations, consider aggregation with `$lookup`.

### 6. Indexing in Mongoose

Used for fast searches.

```javascript
userSchema.index({ email: 1 }, { unique: true });
```

MongoDB creates B-tree indexes.

### 7. Lean Queries (performance boost)

`lean()` returns **plain JavaScript objects** instead of full Mongoose documents.

**Normal Query (without lean):**

```javascript
const users = await User.find();
// Returns Mongoose documents with:
// - Methods (save, remove, etc.)
// - Getters/setters
// - Virtuals
// - Change tracking
```

**Lean Query:**

```javascript
const users = await User.find().lean();
// Returns plain JSON objects (faster, lighter)
```

**Performance Comparison:**

| Feature         | Normal                | Lean              |
| --------------- | --------------------- | ----------------- |
| Speed           | Slower                | **~5-10x faster** |
| Memory          | Higher                | **Lower**         |
| Methods         | ✔ Has `.save()`, etc. | ❌ No methods     |
| Virtuals        | ✔ Included            | ❌ Not included   |
| Getters/Setters | ✔ Active              | ❌ Not active     |

**When to Use Lean:**

✅ **Use lean() when:**

- You only need to **read** data (no updates)
- Returning data to API responses
- Processing large datasets
- Performance is critical
- You don't need Mongoose features

❌ **Don't use lean() when:**

- You need to call `.save()` or `.remove()`
- You need virtuals or getters
- You need to modify and save the document

**Example Use Case:**

```javascript
// API endpoint to list users (read-only)
app.get("/api/users", async (req, res) => {
  const users = await User.find().select("name email").lean(); // Fast!
  res.json(users);
});

// Update user (don't use lean)
app.put("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id); // No lean
  user.name = req.body.name;
  await user.save(); // Need save() method
});
```

**Pro Tip:** Combine with `select()` for maximum performance:

```javascript
const users = await User.find()
  .select("name email") // Only fetch needed fields
  .lean(); // Return plain objects
```

### 8. Aggregation Pipeline Basics (MongoDB + Mongoose)

MongoDB's way to perform:

- Grouping
- Filtering
- Sorting
- Joining
- Complex analytics

**Structure:**

```javascript
Model.aggregate([
  { $match: { status: "active" } },
  { $group: { _id: "$role", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);
```

**Common Stages:**

- `$match` → filter
- `$group` → group by field
- `$lookup` → join
- `$project` → shape data
- `$sort` → sorting
- `$limit` → limit
- `$addFields` → computed fields

**MongoDB Join = `$lookup`:**

```javascript
{
  $lookup: {
    from: "posts",
    localField: "_id",
    foreignField: "authorId",
    as: "posts"
  }
}
```

### Aggregation (Full Explanation)

Aggregation means performing advanced data processing inside MongoDB.

It is like SQL's:

- `GROUP BY`
- `JOIN`
- `ORDER BY`
- `SUM`, `AVG`, etc.

But done using a **pipeline of stages**.

**Example: count posts by each author**

```javascript
Post.aggregate([{ $group: { _id: "$authorId", totalPosts: { $sum: 1 } } }]);
```

---

## Final Summary

### ORM vs ODM

| Tool         | Description                     |
| ------------ | ------------------------------- |
| **Prisma**   | Type-safe ORM for SQL databases |
| **Mongoose** | ODM for MongoDB (NoSQL)         |

### Prisma Features

| Feature      | Meaning               |
| ------------ | --------------------- |
| Schema       | Defines models        |
| Migrations   | Update DB             |
| Client       | Auto-generated API    |
| Relations    | 1-1, 1-n, n-n         |
| Middleware   | Query-level hooks     |
| Transactions | Multi-step operations |
| Joins        | Using `include`       |

### Mongoose Features

| Feature     | Meaning               |
| ----------- | --------------------- |
| Schema      | Document structure    |
| Populate    | Relationship/joins    |
| Hooks       | Pre/post logic        |
| Virtuals    | Computed fields       |
| Indexing    | Performance           |
| Lean        | Fast queries          |
| Aggregation | Complex DB operations |
