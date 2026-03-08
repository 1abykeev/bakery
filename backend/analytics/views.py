# backend/analytics/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncDate
from datetime import date, timedelta
from decimal import Decimal

from bakery.models import Sale, SaleExpenseSnapshot, WorkLog, Staff


class AnalyticsView(APIView):
    """
    GET /api/analytics/
    Query params:
        date_from   YYYY-MM-DD  (default: first day of current month)
        date_to     YYYY-MM-DD  (default: today)

    Returns a single JSON object with all KPI data.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # ── 1. Parse & validate date range ────────────────────────────────
        today = date.today()
        default_from = today.replace(day=1)  # first of current month

        try:
            date_from = date.fromisoformat(request.query_params.get('date_from', str(default_from)))
        except ValueError:
            date_from = default_from

        try:
            date_to = date.fromisoformat(request.query_params.get('date_to', str(today)))
        except ValueError:
            date_to = today

        # Safety: ensure from <= to
        if date_from > date_to:
            date_from, date_to = date_to, date_from

        # ── 2. Sales in range ──────────────────────────────────────────────
        sales_qs = Sale.objects.filter(
            product__owner=user,
            sold_at__range=(date_from, date_to),
        ).select_related('product')

        # ── 3. KPI: Revenue ───────────────────────────────────────────────
        revenue_agg = sales_qs.aggregate(total=Sum('total_price'))
        revenue = float(revenue_agg['total'] or 0)

        # ── 4. KPI: Production cost from snapshots ─────────────────────────
        # SaleExpenseSnapshot.cost is per-unit cost.
        # Total cost for a snapshot = cost × sale.quantity
        snapshots_qs = SaleExpenseSnapshot.objects.filter(
            sale__product__owner=user,
            sale__sold_at__range=(date_from, date_to),
        ).select_related('sale')

        production_cost = float(
            sum(snap.cost * snap.sale.quantity for snap in snapshots_qs)
        )

        # ── 5. KPI: Salary cost from WorkLogs ─────────────────────────────
        worklogs_qs = WorkLog.objects.filter(
            staff__owner=user,
            date__range=(date_from, date_to),
        ).select_related('staff')

        salary_cost = float(
            sum(log.hours_worked * float(log.staff.salary_hour) for log in worklogs_qs)
        )

        # ── 6. KPI: Net profit ─────────────────────────────────────────────
        net_profit = revenue - production_cost - salary_cost

        # ── 7. Daily revenue (for bar chart) ──────────────────────────────
        daily_qs = (
            sales_qs
            .values('sold_at')
            .annotate(revenue=Sum('total_price'))
            .order_by('sold_at')
        )
        daily_revenue = [
            {
                'date':    row['sold_at'].isoformat(),
                'revenue': float(row['revenue']),
            }
            for row in daily_qs
        ]

        # ── 8. Top products ────────────────────────────────────────────────
        top_products_qs = (
            sales_qs
            .values('product__name')
            .annotate(
                units_sold=Sum('quantity'),
                revenue=Sum('total_price'),
            )
            .order_by('-units_sold')[:10]
        )
        top_products = [
            {
                'name':       row['product__name'],
                'units_sold': row['units_sold'],
                'revenue':    float(row['revenue']),
            }
            for row in top_products_qs
        ]

        # ── 9. Expense breakdown per ingredient ────────────────────────────
        # Group SaleExpenseSnapshot by expense_name, sum cost × quantity
        expense_map: dict = {}
        for snap in snapshots_qs:
            name = snap.expense_name
            amount = float(snap.cost) * snap.sale.quantity
            expense_map[name] = expense_map.get(name, 0.0) + amount

        expense_breakdown = sorted(
            [{'name': k, 'total_cost': round(v, 2)} for k, v in expense_map.items()],
            key=lambda x: x['total_cost'],
            reverse=True,
        )

        # ── 10. Staff salary breakdown ─────────────────────────────────────
        staff_map: dict = {}
        for log in worklogs_qs:
            sid = log.staff.id
            if sid not in staff_map:
                staff_map[sid] = {
                    'name':        log.staff.name,
                    'profession':  log.staff.profession,
                    'hours':       0.0,
                    'salary':      0.0,
                    'salary_hour': float(log.staff.salary_hour),
                }
            staff_map[sid]['hours']  += log.hours_worked
            staff_map[sid]['salary'] += log.hours_worked * float(log.staff.salary_hour)

        staff_salary = sorted(
            [
                {
                    'name':        v['name'],
                    'profession':  v['profession'],
                    'hours':       round(v['hours'], 2),
                    'salary':      round(v['salary'], 2),
                    'salary_hour': v['salary_hour'],
                }
                for v in staff_map.values()
            ],
            key=lambda x: x['salary'],
            reverse=True,
        )

        # ── 11. Summary counts ─────────────────────────────────────────────
        total_sales_count = sales_qs.count()
        unique_clients = sales_qs.exclude(
            client_name='', client_phone=''
        ).values('client_phone', 'client_name').distinct().count()

        # ── 12. Build response ─────────────────────────────────────────────
        return Response({
            'date_from':          date_from.isoformat(),
            'date_to':            date_to.isoformat(),

            # KPI cards
            'revenue':            round(revenue, 2),
            'production_cost':    round(production_cost, 2),
            'salary_cost':        round(salary_cost, 2),
            'net_profit':         round(net_profit, 2),

            # Counts
            'total_sales_count':  total_sales_count,
            'unique_clients':     unique_clients,

            # Charts
            'daily_revenue':      daily_revenue,
            'top_products':       top_products,
            'expense_breakdown':  expense_breakdown,
            'staff_salary':       staff_salary,
        })