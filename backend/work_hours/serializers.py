# backend/work_hours/serializers.py

from rest_framework import serializers
from bakery.models import WorkLog, Staff


class WorkLogSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.name', read_only=True)
    hours_worked = serializers.FloatField(read_only=True)

    class Meta:
        model = WorkLog
        fields = (
            'id',
            'staff',
            'staff_name',
            'date',
            'start_time',
            'end_time',
            'hours_worked',
            'created_at',
        )
        read_only_fields = ('id', 'staff_name', 'hours_worked', 'created_at')

    def validate(self, data):
        start = data.get('start_time')
        end = data.get('end_time')
        if start and end and end <= start:
            raise serializers.ValidationError(
                {'end_time': 'Бүтүү убактысы башталуу убактысынан кийин болушу керек.'}
            )
        return data