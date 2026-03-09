# backend/sales/serializers.py

from rest_framework import serializers
from bakery.models import Sale, SaleExpenseSnapshot, Product
from django.utils import timezone


class SaleExpenseSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleExpenseSnapshot
        fields = ('id', 'expense_name', 'cost')


class SaleSerializer(serializers.ModelSerializer):
    expense_snapshots = SaleExpenseSnapshotSerializer(many=True, read_only=True)
    product_name      = serializers.CharField(source='product.name', read_only=True)
    product_price     = serializers.CharField(source='product.price', read_only=True)

    # Write-only: accept product_id from frontend
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.none(),
        source='product',
        write_only=True
    )

    class Meta:
        model = Sale
        fields = (
            'id',
            'product_id',
            'product_name',
            'product_price',
            'quantity',
            'total_price',
            'client_name',
            'client_phone',
            'sold_at',
            'expense_snapshots',
            'created_at',
        )
        read_only_fields = ('id', 'total_price', 'expense_snapshots', 'created_at',
                            'product_name', 'product_price')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Only allow selecting products owned by this user
            self.fields['product_id'].queryset = Product.objects.filter(
                owner=request.user
            )