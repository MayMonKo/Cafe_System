# Database Design Documentation

**System:** Bear’s Bakery Café Management System
**Database:** PostgreSQL

---

## 1. Database Overview

The Bear’s Bakery system uses **PostgreSQL** as its primary relational database.
The database is designed to support:

* Secure user management with role-based access
* Product and menu management with extensible customization
* Order processing and lifecycle tracking
* Loyalty points and discount systems
* Reviews, notifications, and receipt management
* Analytics-ready data structures for managerial insights

The schema follows **normalized relational design**, enforces **data integrity via constraints and enums**, and supports **future analytics and reporting**.

---

## 2. Core Design Principles

1. **Data Integrity**

   * ENUMs are used for roles, order statuses, payment types, and discount types.
   * Foreign keys enforce relational consistency.
   * CHECK constraints prevent invalid numeric values.

2. **Auditability**

   * Orders, discounts, and loyalty points are logged explicitly.
   * Soft deletes (`is_active`) are used instead of hard deletes.

3. **Scalability**

   * Indexes are added on frequently queried columns.
   * Analytics-friendly timestamps are stored at key lifecycle events.

4. **Security Alignment**

   * Database design aligns with JWT + RBAC enforcement at the backend layer.
   * Sensitive data (passwords) is never stored in plain text.

---

## 3. ENUM Types

### 3.1 User Roles

```sql
CREATE TYPE user_role AS ENUM (
  'customer',
  'cashier',
  'manager',
  'admin'
);
```

Defines system access levels for RBAC enforcement.

---

### 3.2 Order Status Lifecycle

```sql
CREATE TYPE order_status AS ENUM (
  'pending',
  'paid',
  'preparing',
  'ready',
  'completed',
  'cancelled'
);
```

Represents the full operational lifecycle of an order.

---

### 3.3 Order Type & Payment Method

```sql
CREATE TYPE order_type AS ENUM ('dine_in', 'takeaway');
CREATE TYPE payment_method AS ENUM ('cash', 'online');
```

Supports dine-in/takeaway selection and payment tracking.

---

### 3.4 Loyalty Points Transaction Type

```sql
CREATE TYPE points_txn_type AS ENUM ('earn', 'redeem', 'adjust');
```

Used for auditing loyalty point changes.

---

### 3.5 Discount Types

```sql
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE discount_scope AS ENUM ('public', 'personal', 'first_time');
```

Supports multiple promotional strategies.

---

## 4. Core Tables

---

### 4.1 Users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  full_name VARCHAR(120),
  fav_flavour_1 VARCHAR(60),
  fav_flavour_2 VARCHAR(60),
  fav_flavour_3 VARCHAR(60),
  points_balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**

* Stores all system users.
* Supports customer profiles, preferences, and loyalty tracking.

---

### 4.2 Product Categories

```sql
CREATE TABLE product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);
```

**Purpose**

* Groups products for menu organization and analytics.

---

### 4.3 Products

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INTEGER NOT NULL REFERENCES product_categories(id),
  base_price NUMERIC(10,2) NOT NULL CHECK (base_price > 0),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**

* Represents all sellable menu items.
* Soft delete (`is_active`) preserves historical order data.

---

### 4.4 Product Customization

#### Product Options

```sql
CREATE TABLE product_options (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
```

#### Product Option Values

```sql
CREATE TABLE product_option_values (
  id SERIAL PRIMARY KEY,
  option_id INTEGER NOT NULL REFERENCES product_options(id),
  value VARCHAR(100) NOT NULL,
  price_modifier NUMERIC(10,2) DEFAULT 0
);
```

**Purpose**

* Supports extensible customization such as size, sugar, spice level, add-ons.

---

## 5. Order Management

---

### 5.1 Orders

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id),
  status order_status NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  order_type order_type NOT NULL DEFAULT 'takeaway',
  payment_method payment_method NOT NULL DEFAULT 'cash',
  order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL,
  preparing_at TIMESTAMP NULL,
  ready_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  cancelled_at TIMESTAMP NULL
);
```

**Purpose**

* Represents a single customer transaction.
* Timestamp fields enable preparation time and peak-hour analytics.

---

### 5.2 Order Items

```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price > 0)
);
```

---

### 5.3 Order Item Options

```sql
CREATE TABLE order_item_options (
  id SERIAL PRIMARY KEY,
  order_item_id INTEGER NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  option_name VARCHAR(100) NOT NULL,
  option_value VARCHAR(100) NOT NULL,
  price_modifier NUMERIC(10,2) DEFAULT 0
);
```

**Purpose**

* Captures chosen customizations per order item.
* Preserves historical configuration even if menu changes later.

---

## 6. Loyalty Points System

### 6.1 Points Ledger

```sql
CREATE TABLE loyalty_points_ledger (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  order_id INTEGER NULL REFERENCES orders(id),
  txn_type points_txn_type NOT NULL,
  points_change INTEGER NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**

* Provides a full audit trail of points earned, redeemed, or adjusted.
* Ensures loyalty balance transparency.

---

## 7. Discounts & Promotions

### 7.1 Discounts

```sql
CREATE TABLE discounts (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE,
  name VARCHAR(120) NOT NULL,
  discount_type discount_type NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  scope discount_scope NOT NULL DEFAULT 'public',
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMP NULL,
  ends_at TIMESTAMP NULL,
  min_spend NUMERIC(10,2) DEFAULT 0,
  usage_limit INTEGER NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 7.2 User Discounts

```sql
CREATE TABLE user_discounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  discount_id INTEGER NOT NULL REFERENCES discounts(id),
  is_used BOOLEAN DEFAULT FALSE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP NULL,
  UNIQUE(user_id, discount_id)
);
```

---

### 7.3 Order Discounts

```sql
CREATE TABLE order_discounts (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  discount_id INTEGER NOT NULL REFERENCES discounts(id),
  discount_amount NUMERIC(10,2) NOT NULL CHECK (discount_amount >= 0)
);
```

---

## 8. Receipts

```sql
CREATE TABLE receipts (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  email_sent_to VARCHAR(255),
  email_sent_at TIMESTAMP NULL,
  file_url TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**

* Tracks receipt delivery and downloadable receipt files.

---

## 9. Notifications

```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**

* Stores in-app notifications such as order status updates.

---

## 10. Reviews

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  UNIQUE(user_id, product_id)
);
```

**Purpose**

* Enables customer feedback and review analytics.
* Enforces one review per product per user.

---

## 11. Analytics Readiness

The database design supports analytics queries for:

* Revenue trends
* Product profitability
* Customer retention
* Peak-hour analysis
* Discount effectiveness
* Loyalty program performance

All critical metrics can be derived directly from relational data without schema modification.

---

## 12. Conclusion

The Bear’s Bakery database is designed to be:

* Secure
* Scalable
* Analytics-ready
* Aligned with real-world café operations

It provides a strong foundation for backend services, frontend applications, and future data-driven enhancements.