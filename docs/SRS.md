# Software Requirements Specification (SRS)

## Bear's Bakery — Web-Based Café Management & Analytics System

**(PHASE 0 — FINAL, FROZEN VERSION)**

---

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements of **Cloud Café**, a web-based café management and analytics system. It serves as the authoritative reference for system design, implementation, testing, and deployment under a **Waterfall Software Engineering lifecycle**.

---

### 1.2 Scope

Cloud Café is a **web application only**, designed to support:

* Online and walk-in café ordering
* Daily cashier operations
* Managerial decision-making through analytics
* System governance and user management

The system emphasizes:

* **PostgreSQL-based transactional and analytical data**
* **SQL-driven analytics**
* **Role-based access control (RBAC)**

#### Out of Scope / Future Work 

* Native mobile applications
* Real-time streaming analytics
* Online payment gateways
* Deep learning or real-time AI services

---

## 2. Overall Description

### 2.1 System Overview

Cloud Café follows a **three-tier architecture**:

* **Frontend:** React (JavaScript), deployed on Vercel
* **Backend:** Node.js with Express, deployed on Render
* **Database:** PostgreSQL

Analytics are computed using **SQL queries** within the backend, while **machine learning is executed offline** and stored back into the database for visualization.

---

### 2.2 User Roles

The system supports four distinct user roles:

| Role     | Description                                            |
| -------- | ------------------------------------------------------ |
| Customer | End users who browse the menu and place orders         |
| Cashier  | Operational staff handling order processing            |
| Manager  | Decision makers monitoring performance and analytics   |
| Admin    | System administrators managing users and configuration |

---

### 2.3 Operating Environment

* Modern web browsers (Chrome, Edge, Firefox)
* HTTPS-secured deployment
* PostgreSQL-compatible database server

---

## 3. Functional Requirements

### 3.1 Customer Functional Requirements

* **FR-C1:** The system shall allow customers to browse the café menu.
* **FR-C2:** The system shall allow customers to customize menu items.
* **FR-C3:** The system shall allow customers to place online orders.
* **FR-C4:** The system shall allow customers to view their own current and past orders.

---

### 3.2 Cashier Functional Requirements

* **FR-CA1:** The system shall allow cashiers to view incoming orders.
* **FR-CA2:** The system shall allow cashiers to update order statuses (paid, preparing, completed, cancelled).
* **FR-CA3:** The system shall allow cashiers to create walk-in (counter) orders.
* **FR-CA4:** The system shall record timestamps for all order status changes.

---

### 3.3 Manager Functional Requirements

* **FR-M1:** The system shall allow managers to view all orders in a read-only mode.
* **FR-M2:** The system shall provide managers with an executive analytics dashboard.
* **FR-M3:** The system shall display key performance indicators including revenue, order count, and average order value.
* **FR-M4:** The system shall provide product performance analytics.
* **FR-M5:** The system shall provide customer behavior and retention analytics.
* **FR-M6:** The system shall provide time-based operational insights such as peak hours.
* **FR-M7:** The system may provide forecasted sales and alerts.

Managers shall **not** modify order statuses or transactional data.

---

### 3.4 Admin Functional Requirements

* **FR-A1:** The system shall allow admins to create user accounts.
* **FR-A2:** The system shall allow admins to assign and update user roles.
* **FR-A3:** The system shall allow admins to disable user accounts.
* **FR-A4:** The system shall allow admins to configure system-level settings.
* **FR-A5:** The system shall allow admins to view system logs.

Admins shall **not** access business analytics dashboards.

---

## 4. Roles & Permissions Matrix (FINAL — LOCKED)

| Feature / Action          | Customer     | Cashier            | Manager (Read-only) | Admin |
| ------------------------- | ------------ | ------------------ | ------------------- | ----- |
| Browse menu               | ✅            | ❌                  | ❌                   | ❌     |
| Place order               | ✅            | ✅ (walk-in orders) | ❌                   | ❌     |
| View orders               | ✅ (own only) | ✅                  | ✅ (read-only)       | ❌     |
| Update order status       | ❌            | ✅                  | ❌                   | ❌     |
| View analytics dashboards | ❌            | ❌                  | ✅                   | ❌     |
| Manage users              | ❌            | ❌                  | ❌                   | ✅     |

This matrix defines the **Role-Based Access Control (RBAC)** rules and shall not be modified in subsequent phases.

---

## 5. Use Case Summary

### 5.1 Customer Use Cases

* **UC-C1:** Browse Menu
* **UC-C2:** Place Order
* **UC-C3:** Track Order

---

### 5.2 Cashier Use Cases

* **UC-CA1:** View Incoming Orders
* **UC-CA2:** Update Order Status
* **UC-CA3:** Create Walk-In Order

---

### 5.3 Manager Use Cases

* **UC-M1:** View Orders (Read-only)
* **UC-M2:** View Performance Dashboard
* **UC-M3:** Analyze Product Performance
* **UC-M4:** Analyze Customer Behavior
* **UC-M5:** Monitor Peak Hours
* **UC-M6:** Review Forecasts and Alerts

---

### 5.4 Admin Use Cases

* **UC-A1:** Manage Users
* **UC-A2:** Configure System Settings
* **UC-A3:** Monitor System Health

---

## 6. Analytics Requirements

### 6.1 Analytics Scope

Analytics shall be accessible **only to managers** and shall be implemented using **SQL-based aggregation queries** over PostgreSQL.

---

### 6.2 Required Analytics Modules

* **AR-01:** Executive Overview Dashboard

  * Revenue
  * Order count
  * Average Order Value
  * Growth trends

* **AR-02:** Product Performance Analytics

  * Top-selling products
  * Low-performing products
  * Category contribution

* **AR-03:** Customer Analytics

  * New vs returning customers
  * Retention cohorts
  * High-value customers

* **AR-04:** Time & Operations Analytics

  * Peak hours
  * Daily and weekly trends

* **AR-05:** Forecasts & Alerts (Optional)

  * Short-term sales forecast
  * Declining product alerts

---

## 7. Non-Functional Requirements

### 7.1 Security

* JWT-based authentication
* Role-based authorization
* Password hashing using bcrypt
* SQL parameterized queries
* HTTPS communication

---

### 7.2 Performance

* Analytics queries shall return results within acceptable response time
* System shall support concurrent users

---

### 7.3 Usability

* Role-specific interfaces
* Clear and intuitive navigation
* Minimal training required for cashiers

---

### 7.4 Maintainability

* Modular backend architecture
* Clear separation of concerns
* Well-documented APIs

---

## 8. Assumptions & Constraints

### Assumptions

* Users have reliable internet access
* Payments are handled externally or manually

### Constraints

* Web-based system only
* PostgreSQL as the primary database
* Analytics computed using SQL

* Full relational schema
* Enums
* Constraints
* Analytics-ready fields
