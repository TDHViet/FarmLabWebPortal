from rest_framework import serializers

from core.serializers import BaseSerializer, ModelBaseSerializer
from users.serializers import UserSerializer

from . import models, services


class SimpleSectorSerializer(ModelBaseSerializer):
    """Simple Sector Serializer."""

    class Meta:
        model = models.Sector
        fields = [
            "id",
            "name",
        ]


class FarmLabSerializer(ModelBaseSerializer):
    """FarmLab Serializer."""

    owner_data = UserSerializer(source="owner", read_only=True)
    sectors = SimpleSectorSerializer(many=True, read_only=True)

    class Meta:
        model = models.FarmLab
        fields = [
            "id",
            "owner",
            "owner_data",
            "name",
            "address",
            "longitude",
            "latitude",
            "sectors",
        ]


class SectorSerializer(ModelBaseSerializer):
    """Sector Serializer."""

    farm_data = FarmLabSerializer(source="farm", read_only=True)

    class Meta:
        model = models.Sector
        fields = [
            "id",
            "farm",
            "farm_data",
            "name",
            "description",
        ]


class DeviceTypeSerializer(ModelBaseSerializer):
    """DeviceType Serializer."""

    class Meta:
        model = models.DeviceType
        fields = [
            "id",
            "name",
            "description",
            "unit",
            "color",
        ]


class SimpleDeviceSerializer(ModelBaseSerializer):
    """Simple Device Serializer."""

    farm_data = FarmLabSerializer(source="farm", read_only=True)
    sector_data = SectorSerializer(source="sector", read_only=True)

    class Meta:
        model = models.Device
        fields = [
            "id",
            "farm",
            "farm_data",
            "sector",
            "sector_data",
            "name",
            "code",
        ]


class DeviceValueSerializer(BaseSerializer):
    """DeviceValue Serializer."""

    timestamp = serializers.DateTimeField(read_only=True)
    value = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )


class DevicesValueSerializer(BaseSerializer):
    """Devices Value Serializer."""

    device = SimpleDeviceSerializer(
        read_only=True,
    )
    data = DeviceValueSerializer(
        many=True,
        read_only=True,
    )


class DeviceSerializer(ModelBaseSerializer):
    """Device Serializer."""

    farm_data = FarmLabSerializer(source="farm", read_only=True)
    sector_data = SectorSerializer(source="sector", read_only=True)
    device_type_data = DeviceTypeSerializer(
        source="device_type",
        read_only=True,
    )
    value = serializers.SerializerMethodField(
        read_only=True,
    )

    class Meta:
        model = models.Device
        fields = [
            "id",
            "farm",
            "farm_data",
            "sector",
            "sector_data",
            "name",
            "code",
            "device_type",
            "device_type_data",
            "value",
        ]

    def get_value(self, obj: models.Device) -> int:
        """Get the value of the device."""
        data = services.fetch_device_data([obj])
        return data.get(obj, [{}])[0].get("value") if data else None


class WarningThresholdSerializer(ModelBaseSerializer):
    """WarningThreshold Serializer."""

    class Meta:
        model = models.WarningThreshold
        fields = [
            "id",
            "device",
            "value",
            "warning_type",
        ]
