from django_filters import rest_framework as filters

from . import models


class SectorFilter(filters.FilterSet):
    """Filter for Sector model."""

    class Meta:
        model = models.Sector
        fields = ("farm",)


class DeviceFilter(filters.FilterSet):
    """Filter for Device model."""

    class Meta:
        model = models.Device
        fields = (
            "farm",
            "sector",
            "device_type",
        )
