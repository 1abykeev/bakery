# backend/bakery/admin.py

from django.contrib import admin
from .models import Staff, Expense, Product, ProductExpense, WorkLog, Sale, SaleExpenseSnapshot


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display  = ('id', 'name', 'phone', 'profession', 'salary_hour', 'owner', 'created_at')
    list_filter   = ('profession',)
    search_fields = ('name', 'phone')
    ordering      = ('id',)

    fieldsets = (
        (None,            {'fields': ('owner', 'name', 'phone')}),
        ('Job Details',   {'fields': ('profession', 'salary_hour')}),
    )


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display  = ('id', 'name', 'owner', 'created_at')
    search_fields = ('name',)
    ordering      = ('id',)

    fieldsets = (
        (None, {'fields': ('owner', 'name')}),
    )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display  = ('id', 'name', 'price', 'stock', 'owner', 'created_at')
    list_filter   = ('owner',)
    search_fields = ('name',)
    ordering      = ('id',)

    fieldsets = (
        (None,          {'fields': ('owner', 'name')}),
        ('Pricing',     {'fields': ('price', 'stock')}),
    )


@admin.register(ProductExpense)
class ProductExpenseAdmin(admin.ModelAdmin):
    list_display  = ('id', 'product', 'expense', 'cost')
    search_fields = ('product__name', 'expense__name')
    ordering      = ('id',)

    fieldsets = (
        (None, {'fields': ('product', 'expense', 'cost')}),
    )


@admin.register(WorkLog)
class WorkLogAdmin(admin.ModelAdmin):
    list_display  = ('id', 'staff', 'date', 'start_time', 'end_time', 'hours_worked')
    list_filter   = ('date',)
    search_fields = ('staff__name',)
    ordering      = ('id',)

    fieldsets = (
        (None,       {'fields': ('staff', 'date')}),
        ('Schedule', {'fields': ('start_time', 'end_time')}),
    )


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display  = ('id', 'product', 'quantity', 'total_price', 'client_name', 'client_phone', 'sold_at')
    list_filter   = ('sold_at',)
    search_fields = ('client_name', 'client_phone', 'product__name')
    ordering      = ('id',)

    fieldsets = (
        (None,           {'fields': ('product', 'quantity', 'total_price')}),
        ('Client Info',  {'fields': ('client_name', 'client_phone')}),
        ('Timing',       {'fields': ('sold_at',)}),
    )


@admin.register(SaleExpenseSnapshot)
class SaleExpenseSnapshotAdmin(admin.ModelAdmin):
    list_display  = ('id', 'sale', 'expense_name', 'cost')
    search_fields = ('expense_name', 'sale__id')
    ordering      = ('id',)

    fieldsets = (
        (None, {'fields': ('sale', 'expense_name', 'cost')}),
    )