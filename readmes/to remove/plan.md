# Bakery SaaS Dashboard — Build Plan & Models

## Tech Stack Reminder
- Backend: Django REST + ModelViewSet
- Frontend: Next.js, TypeScript, Tailwind CSS
- Forms: React Hook Form + Zod
- Date/Time: datetimepicker package
- Auth: JWT localStorage

---

## Step-by-Step Build Plan

### Step 1 — Backend: New App + Models + Migration
- Create `bakery` Django app
- Write all models (see below)
- Run makemigrations + migrate

### Step 2 — Backend: Serializers + ViewSets + URLs
- Write serializers for all models
- Wire up ModelViewSet for each
- Register URLs in bakery/urls.py and include in config/urls.py

### Step 3 — Frontend: Dashboard Shell + Sidebar
- Left sidebar layout with navigation links
- Working logout button
- Route placeholders for each section
- Mobile responsive

### Step 4 — Staff Section
- Add staff (name, phone, profession, salary per hour)
- Delete staff
- List view

### Step 5 — Products Section (3 parts)
- Part A: Add/Delete products (name, price)
- Part B: Add/Delete expense types (name only e.g. "Sugar")
- Part C: Link expenses to products with cost + manage stock per product

### Step 6 — Work Hours Section
- List all staff
- Add work log per staff (date, start time, end time) using datepicker
- Delete work log
- Show hours worked per entry

### Step 7 — Sales Section
- List all products with current stock
- Sell button → form (quantity, client name, client phone, date via datepicker)
- On submit: stock decreases, sale record created

### Step 8 — Client Database Section
- Table of all clients (name, phone, visit date, product bought)
- Date range filter (start date → end date)

### Step 9 — Analytics (later)
- Total revenue from sales
- Total expense costs (production costs)
- Total salary costs (from work logs)
- Profit = Revenue - Expenses - Salary

---

## Django Models

```python
# backend/bakery/models.py

from django.db import models


# ─── 1. STAFF ─────────────────────────────────────────────
class Staff(models.Model):
    name        = models.CharField(max_length=100)
    phone       = models.CharField(max_length=20)
    profession  = models.CharField(max_length=100)
    salary_hour = models.DecimalField(max_digits=10, decimal_places=2)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ─── 2. EXPENSE TYPE ──────────────────────────────────────
# e.g. "Sugar", "Flour", "Butter"
# Defined once, reused across many products
class Expense(models.Model):
    name       = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ─── 3. PRODUCT ───────────────────────────────────────────
class Product(models.Model):
    name       = models.CharField(max_length=100)
    price      = models.DecimalField(max_digits=10, decimal_places=2)
    stock      = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ─── 4. PRODUCT EXPENSE (Many-to-Many with cost) ──────────
# e.g. Donut → Sugar: 15 som, Flour: 10 som
class ProductExpense(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='expenses'
    )
    expense = models.ForeignKey(
        Expense, on_delete=models.CASCADE, related_name='products'
    )
    cost = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('product', 'expense')

    def __str__(self):
        return f"{self.product.name} -> {self.expense.name}: {self.cost}"


# ─── 5. WORK LOG ──────────────────────────────────────────
# Admin enters arrival and departure time for each staff each day
class WorkLog(models.Model):
    staff      = models.ForeignKey(
        Staff, on_delete=models.CASCADE, related_name='work_logs'
    )
    date       = models.DateField()
    start_time = models.TimeField()
    end_time   = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def hours_worked(self):
        from datetime import datetime, date
        start = datetime.combine(date.today(), self.start_time)
        end   = datetime.combine(date.today(), self.end_time)
        return round((end - start).seconds / 3600, 2)

    def __str__(self):
        return f"{self.staff.name} - {self.date}"


# ─── 6. SALE ──────────────────────────────────────────────
# Every sale reduces product stock and records client info
class Sale(models.Model):
    product      = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='sales'
    )
    quantity     = models.PositiveIntegerField(default=1)
    total_price  = models.DecimalField(max_digits=10, decimal_places=2)  # quantity x price
    client_name  = models.CharField(max_length=100, blank=True)
    client_phone = models.CharField(max_length=20, blank=True)
    sold_at      = models.DateTimeField()
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} x{self.quantity} - {self.sold_at.date()}"
```

---

## Model Relationships

```
Staff ──< WorkLog
         (one staff has many work logs)

Expense >──< Product  (through ProductExpense with cost field)
         (one expense like "Sugar" used in many products)
         (one product like "Donut" has many expenses)

Product ──< Sale
         (one product sold many times)

Sale contains client_name + client_phone + sold_at
         (this is the client database — no separate Client model needed)
```

---

## Analytics Queries (Step 9)

| Metric          | Source                                          |
|-----------------|-------------------------------------------------|
| Total Revenue   | SUM of Sale.total_price                         |
| Production Cost | SUM of ProductExpense.cost × Sale.quantity      |
| Salary Cost     | SUM of WorkLog.hours_worked × Staff.salary_hour |
| Profit          | Revenue - Production Cost - Salary Cost         |
| Top Products    | Sale grouped by product, ordered by quantity    |
| Client History  | Sale filtered by sold_at date range             |