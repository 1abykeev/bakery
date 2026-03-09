#!/bin/sh
# ── entrypoint.sh ───────────────────────────────────────────────────────────
set -e

echo "⏳ Waiting for database..."
sleep 3

echo "📦 Running migrations..."
python manage.py migrate --noinput

echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

echo "👤 Creating superuser if not exists..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
import os

User = get_user_model()
email    = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@nanbar.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')
name     = os.environ.get('DJANGO_SUPERUSER_NAME', 'Admin')

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(email=email, password=password, first_name=name)
    print(f"  Superuser created: {email}")
else:
    print(f"  Superuser already exists: {email}")
EOF

echo "🚀 Starting Django..."
exec python manage.py runserver 0.0.0.0:8000