# backend/staff/views.py

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from bakery.models import Staff
from .serializers import StaffSerializer


class StaffViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = StaffSerializer
    http_method_names = ['get', 'post', 'delete']  # no put/patch — no edit needed

    def get_queryset(self):
        # Only return staff belonging to the logged-in owner
        return Staff.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically set owner to logged-in user
        serializer.save(owner=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {'detail': 'Кызматкер жок кылынды.'},
            status=status.HTTP_204_NO_CONTENT
        )