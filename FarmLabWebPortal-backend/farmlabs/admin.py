from django.contrib import admin

from . import models


@admin.register(models.FarmLab)
class FarmLabAdmin(admin.ModelAdmin):
    """Admin panel configuration for FarmLab model."""

    list_display = (
        "id",
        "name",
        "owner",
        "address",
        "latitude",
        "longitude",
        "created",
    )
    search_fields = (
        "name",
        "owner__username",
        "address",
    )
    fieldsets = (
        (
            "General",
            {
                "fields": (
                    "name",
                    "owner",
                    "token",
                ),
            },
        ),
        (
            "Location",
            {
                "fields": (
                    "address",
                    "latitude",
                    "longitude",
                ),
            },
        ),
    )


@admin.register(models.Sector)
class SectorAdmin(admin.ModelAdmin):
    """Admin panel configuration for Sector model."""

    list_display = (
        "id",
        "name",
        "farm",
    )
    search_fields = (
        "name",
        "farm__name",
    )
    fieldsets = (
        (
            "General",
            {
                "fields": (
                    "name",
                    "farm",
                    "description",
                ),
            },
        ),
    )


@admin.register(models.Device)
class DeviceAdmin(admin.ModelAdmin):
    """Admin panel configuration for Device model."""

    list_display = (
        "id",
        "name",
        "code",
        "farm",
        "sector",
        "device_type",
        "status",
    )
    list_filter = (
        "device_type",
        "status",
    )
    search_fields = (
        "name",
        "farm__name",
        "sector__name",
        "type",
    )
    fieldsets = (
        (
            "General",
            {
                "fields": (
                    "name",
                    "code",
                    "farm",
                    "sector",
                    "device_type",
                    "status",
                ),
            },
        ),
    )


@admin.register(models.WarningThreshold)
class WarningThresholdAdmin(admin.ModelAdmin):
    """Admin panel configuration for WarningThreshold model."""

    list_display = (
        "id",
        "device",
        "warning_type",
        "value",
    )
    list_filter = ("warning_type",)
    search_fields = (
        "device__name",
        "warning_type",
    )
    fieldsets = (
        (
            "General",
            {
                "fields": (
                    "device",
                    "warning_type",
                    "value",
                ),
            },
        ),
    )


@admin.register(models.DeviceType)
class DeviceTypeAdmin(admin.ModelAdmin):
    """Admin panel configuration for DeviceType model."""

    list_display = (
        "id",
        "name",
        "description",
        "unit",
        "color",
        "created",
    )
    search_fields = (
        "name",
        "description",
    )
    fieldsets = (
        (
            "General",
            {
                "fields": (
                    "name",
                    "description",
                    "unit",
                    "color",
                ),
            },
        ),
    )


@admin.register(models.CultivationLog)
class CultivationLogAdmin(admin.ModelAdmin):
    """Admin panel configuration for CultivationLog model."""

    list_display = (
        "id",
        "farm",
        "sector",
        "action",
        "created",
    )
    search_fields = (
        "farm__name",
        "sector__name",
    )
    list_filter = (
        "farm",
        "sector",
        "action",
    )
    ordering = ("-created",)

    def has_change_permission(self, request, obj=None):
        """Disable edit page."""
        return False

    def has_add_permission(self, request):
        """Disable add page."""
        return False
