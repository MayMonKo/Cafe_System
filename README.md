# ☕ Café Ordering & Analytics System

An end-to-end web application for a café that allows customers to place orders online while providing the admin with management tools, analytics dashboards, and machine learning insights.

This project is built to demonstrate **full-stack development + data science integration**:

* Backend with Django & PostgreSQL
* Customer ordering system
* Admin panel for café management
* Data pipeline for order tracking
* Interactive analytics dashboards
* ML models for recommendations & demand forecasting
* Deployed live for demonstration

---

## 🚀 Features

### Customer Side

* Browse café menu (categories, prices, images).
* Add to cart, checkout, and place orders.
* Order history for registered customers.

### Admin Side

* Manage menu items (CRUD).
* Track and update customer orders.
* Access dashboards & reports.

### Analytics & Machine Learning

* Sales analytics (top-selling items, revenue trends).
* Customer behavior analysis (item combos, repeat orders).
* Recommendation system: *“If you liked espresso, try a croissant.”*
* Time-series forecasting: predict busiest hours/days.

---

## 🛠️ Tech Stack

**Frontend:** Django Templates + Bootstrap
**Backend:** Django REST Framework
**Database:** PostgreSQL
**Data Analysis:** Pandas, NumPy, Matplotlib, Plotly
**Machine Learning:** Scikit-learn, Prophet (for time-series)
**Deployment:** Render / Heroku

---

## 📂 Project Structure

```
cafe-analytics/
│── cafe_app/          # Main Django app
│── static/            # CSS, JS, images
│── templates/         # HTML templates
│── analytics/         # Data analysis + ML models
│── notebooks/         # Jupyter notebooks for exploration
│── requirements.txt   # Dependencies
│── README.md          # Project docs
```

---

## 🗄️ Database Schema

**Tables:**

* `MenuItems (id, name, category, price, stock)`
* `Customers (id, name, email, password, join_date)`
* `Orders (id, customer_id, order_date, status)`
* `OrderDetails (id, order_id, menu_item_id, quantity, price)`

(Relationships: Customers → Orders → OrderDetails → MenuItems)

---

## 📊 Example Analytics

* **Top 5 items sold this week**
* **Revenue per day/hour**
* **Most common item pairings**
* **Forecast of next week’s demand**

---

## 📸 Screenshots

*(Add UI screenshots)*


## 🌐 Deployment

Live demo: [https://your-demo-link.com](https://your-demo-link.com)


**May Mon Ko** – Data Science & Computer Science Student
[May Mon Ko on linkdin]
