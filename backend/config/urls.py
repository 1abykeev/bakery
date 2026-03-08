# backend/config/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/',        include('accounts.urls')),
    path('api/staff/',       include('staff.urls')),
    path('api/products/',    include('products.urls')),
    path('api/sales/',       include('sales.urls')),
    path('api/work-hours/',  include('work_hours.urls')),
]