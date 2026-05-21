# backend/products/serializers.py

from rest_framework import serializers
from bakery.models import Product, Expense, ProductExpense


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ('id', 'name', 'created_at')
        read_only_fields = ('id', 'created_at')


class ProductExpenseSerializer(serializers.ModelSerializer):
    expense_id   = serializers.PrimaryKeyRelatedField(
        queryset=Expense.objects.none(),
        source='expense'
    )
    expense_name = serializers.CharField(source='expense.name', read_only=True)

    class Meta:
        model = ProductExpense
        fields = ('id', 'expense_id', 'expense_name', 'cost')
        read_only_fields = ('id', 'expense_name')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            self.fields['expense_id'].queryset = Expense.objects.filter(
                owner=request.user
            )


class ProductSerializer(serializers.ModelSerializer):
    expenses = ProductExpenseSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'name', 'emoji', 'price', 'stock', 'expenses', 'created_at')
        read_only_fields = ('id', 'stock', 'expenses', 'created_at')