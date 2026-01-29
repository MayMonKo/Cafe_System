# ☁️ Cloud Café — Web Architecture (With Analytics, ML & Security)

> Scope: **Web app only**
> Frontend: **Vercel**
> Backend: **Render**
> Database: **PostgreSQL**
> Language choice: **JavaScript (frontend + backend)**

---

## Final Tech Stack 

### Frontend (Web App – Vercel)

```text
React
JavaScript
Tailwind CSS
Recharts
```

### Backend (API – Render)

```text
Node.js
Express.js
JWT Authentication
```

### Database

```text
PostgreSQL
```

---

## Where Analytics Lives 

### 🔹 Analytics is **NOT** a separate system

### Analytics Flow

```
Orders (Postgres)
   ↓
Analytics SQL Queries
   ↓
Backend Analytics Endpoints
   ↓
Manager Dashboards (React)
```

### What This Means

* Analytics logic = **SQL**
* Backend exposes `/api/analytics/*`
* Frontend only **visualizes results**

---

## Analytics Layer (Backend – Express)

### Example Endpoints

```text
GET /api/analytics/overview
GET /api/analytics/products
GET /api/analytics/customers
GET /api/analytics/peak-hours
```

Each endpoint:

* Runs **SQL queries**
* Aggregates KPIs
* Returns clean JSON

### Example KPI Queries

* Revenue
* AOV
* MoM growth
* Retention cohorts
* Product ranking

---

## Where ML Lives (Simple & Correct)

### ML = **Analytics Enhancement**


**ML runs as Python scripts / notebooks**, not in production APIs.

### ML Flow

```
Postgres Data
   ↓
Python (Pandas + sklearn)
   ↓
Predictions / Scores
   ↓
Saved back to Postgres
   ↓
Dashboard reads results
```

### Example ML Outputs

* Sales forecast (next 7 days)
* Product demand score

Backend & frontend **do not run ML** — they **consume results**.

---

## Security 

**Three security layers**.

---

## 1. Authentication (JWT)

* Login → issue JWT
* JWT stored in HTTP-only cookie or memory
* Token verified on every API call

---

## 2. Role-Based Access Control (RBAC)

### Roles

```text
customer
cashier
manager
admin
```

### Access Rules

| Endpoint   | Who     |
| ---------- | ------- |
| /orders    | cashier |
| /analytics | manager |
| /users     | admin   |

Backend enforces this:

```js
authorize(['manager'])
```

---

## 3. Data Security

* SQL parameterized queries (no SQL injection)
* Input validation (Zod / Joi / custom)
* Password hashing (bcrypt)
* HTTPS (Render + Vercel)
* No direct DB access from frontend
---

## 6️Final Architecture (Mental Model)

```
[ React Web App ]  ← Vercel
        |
        |  JWT
        v
[ Express API ]   ← Render
   |       |
   |       ├─ Analytics SQL
   |       ├─ RBAC Security
   |       └─ ML Results (read-only)
   v
[ PostgreSQL ]
```

---

## SYSTEM ROLES (LOCKED)

| Role     | Purpose                              |
| -------- | ------------------------------------ |
| Customer | Place orders                         |
| Cashier  | Process & manage orders              |
| Manager  | Monitor performance & make decisions |
| Admin    | Govern the system                    |

---

# CUSTOMER (End User / Buyer)

### Goal

Order food efficiently and track purchases.

---

### Core Use Cases

#### UC-C1: Browse Menu

* View drinks & food
* Filter by category
* View prices & customization options

**Flow**

```
Login / Guest
→ View Menu
→ Select Item
→ Customize
```

---

#### UC-C2: Place Order

* Select quantity
* Customize items
* Submit order

**Flow**

```
Add to Cart
→ Review Order
→ Confirm Order
→ Order Sent to System
```

 Order status = `pending`

---

#### UC-C3: Track Order

* View order status
* View order history

**Flow**

```
Orders Page
→ Current Order Status
→ Completed Orders
```

---

### What Customer CANNOT Do

* See analytics
* Edit menu
* Manage users

---

# CASHIER (Operational Staff)

### Goal

Handle daily order operations quickly and accurately.

---

### Core Use Cases

#### UC-CA1: View Incoming Orders

* See new orders
* View order details

**Flow**

```
Login
→ Orders Dashboard
→ New Orders List
```

---

#### UC-CA2: Update Order Status

* Mark as `paid`
* Mark as `preparing`
* Mark as `completed`
* Cancel order (with reason)

**Flow**

```
Select Order
→ Update Status
→ System Saves Timestamp
```

---

#### UC-CA3: Handle Walk-In Orders

* Create order manually
* Mark as paid immediately

**Flow**

```
New Order
→ Select Items
→ Mark Paid
→ Complete
```

---

### What Cashier CANNOT Do

* View analytics dashboards
* Edit pricing
* Create users

---

# MANAGER (Decision Maker — MOST IMPORTANT ROLE)

### Goal

Make **data-driven operational and business decisions**.

---

## Core Manager Use Cases

---

### UC-M1: View Performance Dashboard

**KPIs**

* Revenue
* Orders
* AOV
* Growth %

**Flow**

```
Login
→ Analytics Dashboard
→ Select Time Range
→ View KPIs
```

---

### UC-M2: Analyze Product Performance

* Top-selling items
* Low-performing items
* Category contribution

**Flow**

```
Analytics
→ Products
→ Filter by Date / Category
→ Identify Trends
```

---

### UC-M3: Understand Customer Behavior

* New vs returning customers
* Retention cohorts
* High-value customers

**Flow**

```
Analytics
→ Customers
→ Cohort View
→ Retention Insights
```

---

### UC-M4: Monitor Time-Based Demand

* Peak hours
* Daily / weekly patterns

**Flow**

```
Analytics
→ Time Analysis
→ Identify Peak Periods
```

---

### UC-M5: Review Forecasts & Alerts

* Short-term sales forecast
* Declining product alerts

**Flow**

```
Analytics
→ Forecasts
→ Review Recommendations
```

Manager **does NOT directly modify data** — they **decide**, not execute.

---

### What Manager CANNOT Do

* Create or delete users
* Change system roles
* Access system logs

---

# ADMIN (System Owner / IT)

### Goal

Ensure **system integrity, security, and configuration**.

---

### Core Admin Use Cases

---

### UC-A1: Manage Users

* Create cashier / manager accounts
* Assign roles
* Disable users

**Flow**

```
Login
→ User Management
→ Create / Update User
```

---

### UC-A2: Manage System Configuration

* Business hours
* Tax rates
* Service settings

**Flow**

```
Settings
→ Update Configuration
→ Save
```

---

### UC-A3: Monitor System Health

* View logs
* Monitor errors
* Check API uptime

**Flow**

```
System Logs
→ Review Events
→ Take Action
```

---

### UC-A4: Data Maintenance (Restricted)

* Archive old data
* Trigger re-analytics
* Backup database

Admin **never** analyzes revenue.

---

## End-to-End Operational Flow (REAL LIFE)

```
Customer places order
   ↓
Cashier processes order
   ↓
Order data stored (PostgreSQL)
   ↓
Analytics queries aggregate data
   ↓
Manager reviews dashboards
   ↓
Manager makes decisions
```
---
## A. Manager Analytics Modules

### 1. Executive Overview (Most Important)

**Purpose:** Daily/weekly decision check

**KPIs**

* Total Revenue
* Total Orders
* Average Order Value (AOV)
* Growth vs previous period
* Peak hour indicator

**Visuals**

* KPI cards
* Revenue trend line
* Orders by hour bar chart

This is the **default landing page for managers**.

---

### 2. Product Performance Analytics

**Purpose:** Menu & pricing decisions

**Insights**

* Top-selling items
* Revenue by category
* Low-performing items
* Product trend (up / down)

**Visuals**

* Bar chart (Top 10 products)
* Pie / stacked bar (category contribution)
* Trend sparkline per product

**Manager Decisions**

* Remove low performers
* Promote high-margin items

---

### 3. Customer Analytics

**Purpose:** Retention & loyalty

**Insights**

* New vs returning customers
* Repeat purchase rate
* Cohort retention (weekly/monthly)
* High-value customers

**Visuals**

* Cohort table
* Donut chart
* Histogram of spend

---

### 4. Time & Operations Analytics

**Purpose:** Staffing & operations

**Insights**

* Peak hours
* Busiest days
* Order volume trends

**Visuals**

* Heatmap (hour vs day)
* Line chart

---

### 5. Forecasts & Alerts (Optional but Strong)

**Purpose:** Planning

**Insights**

* Next 7-day sales forecast
* Declining product alerts

**Visuals**

* Forecast line
* Alert cards

---

---

## Role-Based Pages (Exactly What Each Role Sees)

This is **critical**. Real systems feel different per role.

---

## CUSTOMER UI

### Pages

```
Home / Landing
Menu
Cart
Orders
Profile
```

### Look & Feel

* Friendly
* Visual
* Product-focused
* Minimal data

### Landing Page (Customer)

* Hero section
* Featured drinks
* Promotions
* CTA: “Order Now”

---

## CASHIER UI

### Pages

```
Orders (Live)
POS / New Order
Order History
```

### Look & Feel

* Functional
* Dense
* Fast
* No charts

### Default Page

**Live Orders Queue**

* Order ID
* Status
* Time
* Action buttons

---

## MANAGER UI (Analytics-Heavy)

### Pages

```
Dashboard (Overview)
Analytics
 ├── Products
 ├── Customers
 ├── Time & Operations
 ├── Forecasts
Reports (Optional)
```

### Look & Feel

* Calm
* Professional
* Data-first
* Clear trends

### Default Page

**Executive Overview Dashboard**

---

## ADMIN UI

### Pages

```
User Management
System Settings
Audit Logs
```

### Look & Feel

* Minimal
* Technical
* No charts
* No KPIs

---

## Landing Page (Very Important)

**Two landing pages**.

---

## Public Landing Page (Before Login)

**Audience:** Customers 

### Sections

1. Hero 
2. Featured menu items
3. How it works
4. CTA buttons:

   * Register
   * Login

This sells the product.

---

## Role-Based Landing (After Login)

| Role     | Landing Page    |
| -------- | --------------- |
| Customer | Menu            |
| Cashier  | Live Orders     |
| Manager  | Dashboard       |
| Admin    | User Management |

This is **real SaaS behavior**.

---

## 4️⃣ How Analytics Connect Technically 

```
PostgreSQL
  ↓
SQL Analytics Queries
  ↓
Express API (/analytics)
  ↓
React Charts
```
