from decimal import Decimal

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from django_extensions.db.models import TimeStampedModel

from .constants import CultivatingActionType, DeviceStatus, WarningType


class FarmLab(TimeStampedModel):
    """Model for farm lab, owned by user."""

    owner = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="farmlabs",
    )
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        validators=[
            MinValueValidator(Decimal("-180.0")),
            MaxValueValidator(Decimal("180.0")),
        ],
    )
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        validators=[
            MinValueValidator(Decimal("-90.0")),
            MaxValueValidator(Decimal("90.0")),
        ],
    )
    token = models.CharField(
        max_length=1000,
        help_text="Unique token for farm lab.",
        blank=True,
    )

    def __str__(self) -> str:
        """Return farm lab name."""
        return self.name


class Sector(TimeStampedModel):
    """Model for sectors."""

    farm = models.ForeignKey(
        FarmLab,
        on_delete=models.CASCADE,
        related_name="sectors",
    )
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self) -> str:
        """Return sector name."""
        return self.name


class DeviceType(TimeStampedModel):
    """Model for device types."""

    name = models.CharField(
        max_length=255,
    )
    description = models.TextField()
    unit = models.CharField(
        max_length=50,
    )
    color = models.CharField(
        max_length=7,
        default="#000000",
    )

    def __str__(self) -> str:
        """Return device type name."""
        return self.name


class Device(TimeStampedModel):
    """Model for devices."""

    farm = models.ForeignKey(
        FarmLab,
        on_delete=models.CASCADE,
        related_name="devices",
    )
    sector = models.ForeignKey(
        Sector,
        on_delete=models.SET_NULL,
        related_name="devices",
        null=True,
        blank=True,
    )
    device_type = models.ForeignKey(
        "DeviceType",
        on_delete=models.SET_NULL,
        related_name="devices",
        null=True,
        blank=True,
    )
    code = models.CharField(
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=255)
    status = models.CharField(
        max_length=15,
        choices=DeviceStatus.choices,
        default=DeviceStatus.ONLINE,
    )

    def __str__(self) -> str:
        """Return device name."""
        return self.name


class WarningThreshold(TimeStampedModel):
    """Model for WarningThreshold."""

    device = models.ForeignKey(
        Device,
        on_delete=models.CASCADE,
        related_name="warning_thresholds",
    )
    value = models.DecimalField(
        max_digits=10,
        decimal_places=8,
    )
    warning_type = models.CharField(
        max_length=15,
        choices=WarningType.choices,
        default=WarningType.HIGH,
    )

    def __str__(self) -> str:
        """Return device name and type."""
        return (
            f"{self.device.name} - Warning when reached "
            f"{self.value} {self.warning_type}"
        )


class CultivationLog(TimeStampedModel):
    """Model for cultivation logs."""

    farm = models.ForeignKey(
        FarmLab,
        on_delete=models.CASCADE,
        related_name="cultivation_logs",
    )
    sector = models.ForeignKey(
        Sector,
        on_delete=models.SET_NULL,
        related_name="cultivation_logs",
        null=True,
    )
    action = models.CharField(
        max_length=15,
        choices=CultivatingActionType.choices,
        default=None,
        blank=True,
    )
