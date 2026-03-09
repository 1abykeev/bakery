# backend/products/views.py

from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from bakery.models import Product, Expense, ProductExpense
from .serializers import ProductSerializer, ExpenseSerializer, ProductExpenseSerializer


class ExpenseViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return Expense.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProductViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(
            owner=self.request.user
        ).prefetch_related('expenses__expense').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], url_path='add_expense')
    def add_expense(self, request, pk=None):
        """
        POST /api/products/{id}/add_expense/
        Body: { "expense_id": 3, "cost": "15.00" }
        """
        product = self.get_object()
        serializer = ProductExpenseSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            expense = serializer.validated_data['expense']
            if expense.owner != request.user:
                return Response(
                    {'detail': 'Уруксат жок.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            if ProductExpense.objects.filter(product=product, expense=expense).exists():
                return Response(
                    {'detail': 'Бул чыгым продуктка мурунтан кошулган.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serializer.save(product=product)
            return Response(
                ProductSerializer(product, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='remove_expense/(?P<pe_id>[^/.]+)')
    def remove_expense(self, request, pk=None, pe_id=None):
        """
        DELETE /api/products/{id}/remove_expense/{pe_id}/
        """
        product = self.get_object()
        try:
            pe = ProductExpense.objects.get(id=pe_id, product=product)
            pe.delete()
            return Response(
                ProductSerializer(product, context={'request': request}).data,
                status=status.HTTP_200_OK
            )
        except ProductExpense.DoesNotExist:
            return Response(
                {'detail': 'Табылган жок.'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['patch'], url_path='update_stock')
    def update_stock(self, request, pk=None):
        """
        PATCH /api/products/{id}/update_stock/
        Body: { "stock": 50 }
        """
        product = self.get_object()
        stock = request.data.get('stock')
        if stock is None or int(stock) < 0:
            return Response(
                {'detail': 'Туура эмес сан.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        product.stock = int(stock)
        product.save()
        return Response(
            ProductSerializer(product, context={'request': request}).data,
            status=status.HTTP_200_OK
        )