# backend/sales/views.py

from rest_framework import mixins, viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from bakery.models import Sale, SaleExpenseSnapshot
from .serializers import SaleSerializer


class SaleViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    """
    GET    /api/sales/        → list all sales for this owner
    POST   /api/sales/        → create sale (also snapshots expenses + deducts stock)
    DELETE /api/sales/{id}/   → delete sale record
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SaleSerializer

    def get_queryset(self):
        return Sale.objects.filter(
            product__owner=self.request.user
        ).select_related('product').prefetch_related('expense_snapshots').order_by('-sold_at', '-created_at')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        product  = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']

        # ── 1. Stock check ──────────────────────────────────
        if product.stock < quantity:
            return Response(
                {'detail': f'Складта жетишсиз. Учурда {product.stock} дана бар.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ── 2. Calculate total price ─────────────────────────
        total_price = product.price * quantity

        # ── 3. Create Sale ───────────────────────────────────
        sale = Sale.objects.create(
            product      = product,
            quantity     = quantity,
            total_price  = total_price,
            client_name  = serializer.validated_data.get('client_name', ''),
            client_phone = serializer.validated_data.get('client_phone', ''),
            sold_at      = serializer.validated_data['sold_at'],
        )

        # ── 4. Snapshot expenses at time of sale ─────────────
        product_expenses = product.expenses.select_related('expense').all()
        snapshots = [
            SaleExpenseSnapshot(
                sale         = sale,
                expense_name = pe.expense.name,
                cost         = pe.cost,             # cost per unit
            )
            for pe in product_expenses
        ]
        SaleExpenseSnapshot.objects.bulk_create(snapshots)

        # ── 5. Deduct stock ──────────────────────────────────
        product.stock -= quantity
        product.save()

        # ── 6. Return full sale with snapshots ───────────────
        out = SaleSerializer(sale, context={'request': request})
        return Response(out.data, status=status.HTTP_201_CREATED)