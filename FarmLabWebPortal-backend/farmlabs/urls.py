from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"farmlabs", views.FarmLabViewSet, basename="farmlab")
router.register(r"sectors", views.SectorViewSet, basename="sector")
router.register(r"devices", views.DeviceViewSet, basename="device")
router.register(
    r"device-types",
    views.DeviceTypeViewSet,
    basename="device-type",
)
router.register(
    r"warning-thresholds",
    views.WarningThresholdViewSet,
    basename="warning-threshold",
)

urlpatterns = router.urls
