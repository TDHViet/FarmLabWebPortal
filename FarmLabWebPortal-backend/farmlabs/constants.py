from django.db import models


class DeviceStatus(models.TextChoices):
    """Device status."""

    ONLINE = "online", "Online"
    OFFLINE = "offline", "Offline"
    MAINTENANCE = "maintenance", "Maintenance"


class WarningType(models.TextChoices):
    """Warning types."""

    HIGH = "high", "High"
    LOW = "low", "Low"


class CultivatingActionType(models.TextChoices):
    """Action types."""

    CHECKING = "checking", "Kiểm tra"
    FERTILIZING = "fertilizing", "Bón phân"
    HOEING = "hoeing", "Cày xới"
    PLANTING = "planting", "Gieo trồng"
    PRUNNING = "prunning", "Tỉa cành"
    WATERING = "watering", "Tưới nước"
    WEEDING = "weeding", "Nhổ cỏ"
