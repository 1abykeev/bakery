# backend/sales/views.py

from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
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

        if product.stock < quantity:
            return Response(
                {'detail': f'Складта жетишсиз. Учурда {product.stock} дана бар.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        total_price = product.price * quantity

        sale = Sale.objects.create(
            product      = product,
            quantity     = quantity,
            total_price  = total_price,
            client_name  = serializer.validated_data.get('client_name', ''),
            client_phone = serializer.validated_data.get('client_phone', ''),
            sold_at      = serializer.validated_data['sold_at'],
        )

        product_expenses = product.expenses.select_related('expense').all()
        snapshots = [
            SaleExpenseSnapshot(
                sale         = sale,
                expense_name = pe.expense.name,
                cost         = pe.cost,
            )
            for pe in product_expenses
        ]
        SaleExpenseSnapshot.objects.bulk_create(snapshots)

        product.stock -= quantity
        product.save()

        out = SaleSerializer(sale, context={'request': request})
        return Response(out.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='clients')
    def clients(self, request):
        """
        GET /api/sales/clients/
        Aggregates sales into a per-client view.
        Only includes sales that have client_name or client_phone.
        """
        sales_qs = Sale.objects.filter(
            product__owner=request.user,
        ).exclude(
            client_name='',
            client_phone='',
        ).select_related('product').order_by('-sold_at')

        # Build client map — phone is primary key, fallback to name
        clients: dict = {}

        for sale in sales_qs:
            key = sale.client_phone.strip() if sale.client_phone.strip() else sale.client_name.strip()
            if not key:
                continue

            if key not in clients:
                clients[key] = {
                    'name':        sale.client_name.strip(),
                    'phone':       sale.client_phone.strip(),
                    'total_spent': 0.0,
                    'visit_count': 0,
                    'last_visit':  sale.sold_at,
                    'products':    set(),
                    'purchases':   [],
                }

            c = clients[key]
            c['total_spent'] += float(sale.total_price)
            c['visit_count'] += 1
            if sale.sold_at > c['last_visit']:
                c['last_visit'] = sale.sold_at
            c['products'].add(sale.product.name)
            c['purchases'].append({
                'sale_id':      sale.id,
                'date':         sale.sold_at.isoformat(),
                'product_name': sale.product.name,
                'quantity':     sale.quantity,
                'total_price':  str(sale.total_price),
            })

        result = []
        for c in clients.values():
            c['products'] = sorted(list(c['products']))
            c['purchases'] = sorted(c['purchases'], key=lambda x: x['date'], reverse=True)
            c['total_spent'] = round(c['total_spent'], 2)
            c['last_visit'] = c['last_visit'].isoformat()
            result.append(c)

        result.sort(key=lambda x: x['last_visit'], reverse=True)
        return Response(result)