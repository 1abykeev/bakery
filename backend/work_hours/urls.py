# backend/work_hours/urls.py

from rest_framework.routers import DefaultRouter
from .views import WorkLogViewSet

router = DefaultRouter()
router.register(r'', WorkLogViewSet, basename='worklog')

urlpatterns = router.urls