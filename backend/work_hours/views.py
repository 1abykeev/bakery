# backend/work_hours/views.py

from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated
from bakery.models import WorkLog
from .serializers import WorkLogSerializer


class WorkLogViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsAuthenticated]
    serializer_class = WorkLogSerializer

    def get_queryset(self):
        qs = WorkLog.objects.filter(
            staff__owner=self.request.user
        ).select_related('staff').order_by('-date', '-created_at')

        # Optional filter by staff id: /api/work-hours/?staff=3
        staff_id = self.request.query_params.get('staff')
        if staff_id:
            qs = qs.filter(staff_id=staff_id)

        return qs

    def perform_create(self, serializer):
        # Ensure the staff belongs to this owner
        staff = serializer.validated_data['staff']
        if staff.owner != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Бул кызматкер сизге таандык эмес.')
        serializer.save()