# SQL Interview Questions & Answers

## Basic Concepts

### 1. What is SQL?

SQL (Structured Query Language) is used to store, read, update, and delete data inside relational databases. It helps manage data using tables, rows, columns, and relationships.

### 2. What are SQL Databases?

SQL databases are relational databases that store data in tables (rows + columns) and maintain relationships using Primary Keys and Foreign Keys.

**Examples:** PostgreSQL, MySQL, SQLite, SQL Server

### 3. When should you use an SQL database?

Use SQL when data is structured, consistent, and needs relationships—for example users ↔ orders, students ↔ courses, etc.

## CRUD Operations

### 4. Write SQL query to create a table.

```sql
CREATE TABLE chai_store (
  id SERIAL PRIMARY KEY,
  chai_name VARCHAR(50),
  price DECIMAL(5,2),
  chai_type VARCHAR(50),
  available BOOLEAN
);
```

### 5. How do you insert data into a table?

**Single row:**

```sql
INSERT INTO chai_store (chai_name, price, chai_type, available)
VALUES ('Masala Chai', 30.00, 'Spiced', TRUE);
```

**Multiple rows:**

```sql
INSERT INTO chai_store (chai_name, price, chai_type, available)
VALUES
  ('Green Chai', 25.00, 'Herbal', TRUE),
  ('Black Chai', 20.00, 'Classic', TRUE);
```

### 6. How do you fetch all rows from a table?

```sql
SELECT * FROM chai_store;
```

### 7. How do you select specific columns?

```sql
SELECT chai_name, price FROM chai_store;
```

### 8. How do you filter rows in SQL?

```sql
SELECT * FROM chai_store WHERE available = TRUE;
```

### 9. How do you sort rows?

```sql
SELECT * FROM chai_store ORDER BY price DESC;
```

### 10. How do you limit the number of results?

```sql
SELECT * FROM chai_store ORDER BY id LIMIT 5;
```

### 11. How to update data in a table?

```sql
UPDATE chai_store
SET price = 32.00
WHERE id = 1;
```

### 12. How to delete data from a table?

```sql
DELETE FROM chai_store WHERE id = 4;
```

### 13. What is the difference between TRUNCATE and DROP?

- **TRUNCATE** removes all rows but keeps the table structure
- **DROP** removes the entire table permanently

## ALTER TABLE

### 14. How do you add a new column to an existing table?

```sql
ALTER TABLE chai_store ADD stock INT DEFAULT 0;
```

### 15. How do you change a column type?

```sql
ALTER TABLE chai_store
ALTER COLUMN price TYPE DECIMAL(10,2);
```

## Joins

### 16. What is an INNER JOIN?

Returns only rows where both tables have matching values.

```sql
SELECT users.name, orders.item
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```

### 17. What is a LEFT JOIN?

Returns all rows from the left table and matching rows from the right table. If no match → NULL.

### 18. What is a RIGHT JOIN?

Returns all rows from the right table and matching rows from the left table.

### 19. What is a FULL OUTER JOIN?

Returns all rows from both tables, matching or not. Supported in PostgreSQL but not in MySQL.

## Aggregate Functions

### 20. What is COUNT()?

```sql
SELECT COUNT(*) FROM orders;
```

### 21. What is SUM()?

```sql
SELECT SUM(price) FROM orders;
```

### 22. What is AVG()?

```sql
SELECT AVG(price) FROM orders;
```

### 23. What are MAX() and MIN()?

```sql
SELECT MAX(price), MIN(price) FROM orders;
```

## GROUP BY & HAVING

### 24. What does GROUP BY do?

Groups rows with the same value so you can apply aggregate functions.

```sql
SELECT user_id, COUNT(*)
FROM orders
GROUP BY user_id;
```

### 25. What is the difference between WHERE and HAVING?

- **WHERE** filters rows before grouping
- **HAVING** filters groups after grouping

```sql
SELECT user_id, COUNT(*)
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 1;
```

## Normalization

### 26. What is data redundancy?

Storing the same data multiple times unnecessarily, causing storage waste and update problems.

### 27. What is data integrity?

Ensuring data is accurate, consistent, and reliable using primary keys, foreign keys, and correct data types.

### 28. What is 1NF? Give example.

**Definition:** Each column must hold atomic (single) values. No repeating groups.

**Bad:** `phones = "9991111,8882222"`

**Good:** Use a separate table `customer_phones` with one phone per row.

### 29. What is 2NF? Give example.

**Definition:** Must be in 1NF + No partial dependency on part of composite primary key.

**Bad:** In table `(order_id, product_id)` → `product_name` depends only on `product_id`.

**Good:** Separate `products` table and reference `product_id` in `order_items`.

### 30. What is 3NF? Give example.

**Definition:** Must be in 2NF + No transitive dependency (no non-key → non-key dependency).

**Bad:** Users table storing both `city` and `state` (state depends on city).

**Good:** Move city/state into `locations` table and reference via `location_id`.

## Advanced Topics

### 31. What is the N+1 problem in SQL?

When your app runs 1 query to get a list, then N more queries for each item.

**Fix:** Use JOIN or IN query.

### 32. What are transactions?

Transactions ensure all operations succeed or none do (atomicity). Used in payments, orders, wallet updates.
