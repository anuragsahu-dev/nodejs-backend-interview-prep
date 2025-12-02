# Database Connection, Aggregation & Joins

## 1. Database Connection in Mongoose (Modern Syntax)

Mongoose connects to MongoDB using `mongoose.connect()`.

### Example — Async/Await (Best Practice)

```javascript
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "mydatabase",
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  }
};
```

**Key Points:**

- `mongoose.connect` returns a promise → `await` handles it
- `dbName` ensures you connect to correct database
- **Recommended:** call this function in `server.js`

---

## 2. Database Connection in Prisma (PostgreSQL)

Prisma connects through a `DATABASE_URL` and Prisma Client.

### Connection File

```javascript
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Prisma Connected to DB");
  } catch (err) {
    console.error("Prisma Error:", err.message);
    process.exit(1);
  }
}

connectDB();
```

**Key Points:**

- Prisma connects automatically when you run the first query
- `$connect()` ensures connection upfront

---

## 3. What is a Join?

### SQL Join

**Join** = combining data from two tables based on a relation.

### Prisma Join

Prisma automatically performs SQL joins using `include`.

**Example:**

```javascript
const users = await prisma.user.findMany({
  include: { posts: true },
});
```

**Equivalent to SQL:**

```sql
SELECT * FROM users
LEFT JOIN posts ON posts.authorId = users.id;
```

---

## 4. MongoDB Join = $lookup (Aggregation Stage)

MongoDB doesn't have joins by default because it's NoSQL, but joins are done using `$lookup`.

**Example:**

```javascript
const data = await User.aggregate([
  {
    $lookup: {
      from: "posts", // collection name
      localField: "_id",
      foreignField: "authorId",
      as: "posts",
    },
  },
]);
```

**Equivalent to SQL join.**

---

## 5. What is Aggregation in MongoDB?

**Aggregation** = MongoDB's powerful data processing pipeline.

**Used for:**

- Filtering
- Grouping
- Counting
- Sorting
- Searching
- Summing
- Joining
- Data analytics

**Works like:**

```
data → pipeline stages → final transformed result
```

**Example pipeline:**

```javascript
Model.aggregate([
  { $match: { status: "active" } },
  { $group: { _id: "$role", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);
```

---

## 6. All Important Aggregation Stages Explained (With Examples)

### 1) $match (filtering)

Filter documents → like SQL `WHERE`.

```javascript
await User.aggregate([{ $match: { age: { $gt: 18 } } }]);
```

### 2) $group (group by + aggregate functions)

Group data by a field.

```javascript
await Order.aggregate([
  {
    $group: {
      _id: "$userId",
      totalAmount: { $sum: "$amount" },
      orderCount: { $sum: 1 },
    },
  },
]);
```

**Functions used inside $group:**

- `$sum`
- `$avg`
- `$min`
- `$max`
- `$push` (collect items)
- `$addToSet` (unique items)

### 3) $sort

Sort results.

```javascript
await Product.aggregate([
  { $sort: { price: -1 } }, // high → low
]);
```

### 4) $limit

Limit number of results.

```javascript
await User.aggregate([{ $limit: 5 }]);
```

### 5) $project (select fields)

Control output fields.

```javascript
await User.aggregate([
  {
    $project: {
      name: 1,
      email: 1,
      _id: 0,
    },
  },
]);
```

### 6) $addFields (computed fields)

Add new calculated field.

```javascript
await User.aggregate([
  {
    $addFields: {
      fullName: { $concat: ["$firstName", " ", "$lastName"] },
    },
  },
]);
```

### 7) $lookup (JOIN)

Join two collections.

```javascript
await User.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders",
    },
  },
]);
```

### 8) $unwind (convert array → multiple docs)

```javascript
await User.aggregate([{ $unwind: "$orders" }]);
```

---

## 7. Full Aggregation Pipeline Example

### Example Problem

**"Find top 3 users who spent the most, include their order list."**

### Solution:

```javascript
await Order.aggregate([
  // 1. Join orders with users collection
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    },
  },

  // 2. Convert user array to single object
  { $unwind: "$user" },

  // 3. Group by user
  {
    $group: {
      _id: "$userId",
      totalSpent: { $sum: "$amount" },
      user: { $first: "$user" },
    },
  },

  // 4. Sort by totalSpent
  { $sort: { totalSpent: -1 } },

  // 5. Limit to top 3
  { $limit: 3 },
]);
```

**This is how real-world reports, dashboards, and analytics are built.**

---

## 8. Searching in Aggregation

### Basic search:

```javascript
await User.aggregate([{ $match: { name: /john/i } }]);
```

### Text search:

```javascript
await User.aggregate([
  {
    $match: {
      $text: { $search: "developer" },
    },
  },
]);
```

---

## Short Summary for Interviews

### JOIN

| Database     | Method                   |
| ------------ | ------------------------ |
| **SQL**      | `JOIN`                   |
| **Prisma**   | `include`                |
| **MongoDB**  | `$lookup`                |
| **Mongoose** | `Model.aggregate([...])` |

### Aggregation

- MongoDB's data processing pipeline
- Supports grouping, sorting, filtering, joining
- Used for analytics and dashboards

### Connection

| ORM/ODM      | Method                          |
| ------------ | ------------------------------- |
| **Prisma**   | `PrismaClient()` + `$connect()` |
| **Mongoose** | `mongoose.connect()`            |
