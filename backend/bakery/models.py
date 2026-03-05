# backend/bakery/models.py

from django.db import models
from django.conf import settings


# ─── 1. STAFF ─────────────────────────────────────────────
class Staff(models.Model):
    owner       = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='staff'
    )
    name        = models.CharField(max_length=100)
    phone       = models.CharField(max_length=20)
    profession  = models.CharField(max_length=100)
    salary_hour = models.DecimalField(max_digits=10, decimal_places=2)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ─── 2. EXPENSE TYPE ──────────────────────────────────────
# e.g. "Sugar", "Flour", "Butter"
# Defined once per owner, reused across many products
class Expense(models.Model):
    owner      = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expenses'
    )
    name       = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('owner', 'name')  # same name allowed for different owners

    def __str__(self):
        return self.name


# ─── 3. PRODUCT ───────────────────────────────────────────
class Product(models.Model):
    owner      = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products'
    )
    name       = models.CharField(max_length=100)
    price      = models.DecimalField(max_digits=10, decimal_places=2)
    stock      = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ─── 4. PRODUCT EXPENSE (Many-to-Many with cost) ──────────
# e.g. Donut -> Sugar: 15 som, Flour: 10 som
# No owner field needed — cascades from Product
class ProductExpense(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='expenses'
    )
    expense = models.ForeignKey(
        Expense, on_delete=models.CASCADE, related_name='products'
    )
    cost    = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('product', 'expense')

    def __str__(self):
        return f"{self.product.name} -> {self.expense.name}: {self.cost}"


# ─── 5. WORK LOG ──────────────────────────────────────────
# Admin enters arrival and departure time for each staff each day
# No owner field needed — cascades from Staff
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
# No owner field needed — cascades from Product
class Sale(models.Model):
    product      = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='sales'
    )
    quantity     = models.PositiveIntegerField(default=1)
    total_price  = models.DecimalField(max_digits=10, decimal_places=2)
    client_name  = models.CharField(max_length=100, blank=True)
    client_phone = models.CharField(max_length=20, blank=True)
    sold_at      = models.DateTimeField()
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} x{self.quantity} - {self.sold_at.date()}"