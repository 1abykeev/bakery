# backend/staff/serializers.py

from rest_framework import serializers
from bakery.models import Staff


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = (
            'id',
            'name',
            'phone',
            'profession',
            'salary_hour',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')