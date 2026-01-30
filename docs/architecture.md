# PHASE 1.1 — System Architecture


## 1. Purpose of This Architecture

This document defines the **high-level system architecture** of Cloud Café.
It explains how the system components interact, how data flows across layers, and how responsibilities are separated to support **security, scalability, and analytics**.

This architecture is derived directly from the **Phase 0 SRS** and shall remain consistent throughout implementation.

---

## 2. Architectural Style

Cloud Café follows a **three-tier web architecture** with a clear separation of concerns:

1. **Presentation Layer (Frontend)**
2. **Application Layer (Backend API)**
3. **Data Layer (Database + Analytics Storage)**

Additionally, an **offline analytics enhancement layer** is used for machine learning tasks.

This design supports:

* Role-based access control (RBAC)
* SQL-driven analytics
* Maintainable and testable components

---

## 3. High-Level Architecture Overview

### Logical Component View

```
┌───────────────────────────────┐
│        Web Browser            │
│ (Customer / Cashier /         │
│  Manager / Admin UI)          │
└───────────────┬───────────────┘
                │ HTTPS + JWT
                ▼
┌───────────────────────────────┐
│ Frontend Web Application      │
│ React + JavaScript            │
│ Hosted on Vercel              │
│                               │
│ - Role-based pages            │
│ - Dashboard visualizations    │
│ - API consumption only        │
└───────────────┬───────────────┘
                │ REST API Calls
                ▼
┌───────────────────────────────┐
│ Backend Application API       │
│ Node.js + Express             │
│ Hosted on Render              │
│                               │
│ - Authentication (JWT)        │
│ - RBAC enforcement            │
│ - Business logic              │
│ - Analytics aggregation       │
└───────────────┬───────────────┘
                │ SQL Queries
                ▼
┌───────────────────────────────┐
│ PostgreSQL Database           │
│                               │
│ - Users                       │
│ - Products                    │
│ - Orders                      │
│ - Order Items                 │
│ - Analytics-ready data        │
└───────────────┬───────────────┘
                │ (Offline access)
                ▼
┌───────────────────────────────┐
│ Offline Analytics / ML Layer  │
│ Python (Pandas + sklearn)     │
│                               │
│ - Forecasting                 │
│ - Trend analysis              │
│ - Outputs stored in Postgres  │
└───────────────────────────────┘
```

---

## 4. Component Responsibilities

### 4.1 Frontend (Presentation Layer)

**Technology**

* React (JavaScript)
* Tailwind CSS
* Recharts
* Deployed on Vercel

**Responsibilities**

* Render role-specific user interfaces
* Handle user interactions (ordering, status viewing, dashboards)
* Visualize analytics data using charts
* Send authenticated API requests to the backend

**Key Design Rules**

* No business logic
* No analytics calculations
* No direct database access
* All data comes from backend APIs

---

### 4.2 Backend (Application Layer)

**Technology**

* Node.js
* Express.js
* JWT Authentication
* Hosted on Render

**Responsibilities**

* Authenticate users and issue JWTs
* Enforce role-based access control (RBAC)
* Implement business workflows (orders, status updates)
* Execute SQL analytics queries
* Format analytics results for frontend consumption

**Key Design Rules**

* All authorization checks happen here
* Managers have read-only access to orders
* Only cashiers update order status
* Only admins manage users

---

### 4.3 Database (Data Layer)

**Technology**

* PostgreSQL

**Responsibilities**

* Store transactional data (orders, products, users)
* Enforce data integrity using constraints
* Act as the single source of truth
* Support analytics queries using SQL

**Design Characteristics**

* Relational schema
* Analytics-ready timestamps and numeric fields
* No business logic inside the database

---

### 4.4 Offline Analytics / Machine Learning Layer

**Technology**

* Python
* Pandas
* scikit-learn

**Responsibilities**

* Periodically extract data from PostgreSQL
* Perform forecasting and trend analysis
* Store prediction results back into PostgreSQL

**Important Constraints**

* Not part of real-time request flow
* Not exposed as an API
* Used only for managerial decision support

---

## 5. Data Flow Descriptions

### 5.1 Order Processing Flow

```
Customer / Cashier
→ Frontend UI
→ Backend API
→ PostgreSQL (orders, order_items)
→ Cashier updates status
```

Managers may **view orders in read-only mode** but do not modify them.

---

### 5.2 Analytics Flow (Manager)

```
PostgreSQL (orders, products, users)
→ SQL Aggregation Queries
→ Backend /api/analytics/*
→ Frontend Dashboards (Recharts)
```

Analytics calculations are:

* Centralized
* SQL-based
* Role-restricted

---

### 5.3 Forecasting Flow 

```
PostgreSQL
→ Python ML Script
→ Forecast Results
→ Stored in PostgreSQL
→ Manager Dashboard Reads Results
```

---

## 6. Deployment View

| Component   | Platform                    |
| ----------- | --------------------------- |
| Frontend    | Vercel                      |
| Backend API | Render                      |
| Database    | PostgreSQL (managed)        |
| ML Scripts  | Local / scheduled execution |

All communication occurs over **HTTPS**.

---

## 7. Security Integration in Architecture

* JWT authentication between frontend and backend
* RBAC enforced at API level
* SQL parameterized queries only
* No frontend access to database credentials
* Role-specific UI rendering

---

## 8. Architectural Constraints

* Web application only
* PostgreSQL as the only database
* Analytics implemented using SQL
* ML executed offline only
* No real-time streaming architecture
