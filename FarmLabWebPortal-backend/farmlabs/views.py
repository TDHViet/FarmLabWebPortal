import datetime as dt

import django

from rest_framework.decorators import action
from rest_framework.response import Response

from drf_spectacular.utils import OpenApiParameter, extend_schema

from core.views import CRUDViewSet, ReadOnlyViewSet

from . import filters, models, serializers, services


class FarmLabViewSet(CRUDViewSet):
    """ViewSet for FarmLab."""

    model_name = "FarmLab"
    queryset = models.FarmLab.objects.all().prefetch_related("sectors")
    serializer_class = serializers.FarmLabSerializer
    ordering_fields = ()
    search_fields = (
        "name",
        "address",
    )

    def get_queryset(self):
        """Get queryset for the viewset."""
        queryset = super().get_queryset()
        if self.request.user.is_superuser:
            return queryset
        return queryset.filter(owner_id=self.request.user.id)


class SectorViewSet(CRUDViewSet):
    """ViewSet for managing Sectors."""

    model_name = "Sector"
    queryset = models.Sector.objects.all()
    serializer_class = serializers.SectorSerializer
    ordering_fields = ()
    search_fields = (
        "name",
    )
    filterset_class = filters.SectorFilter

    def get_queryset(self):
        """Get queryset for the viewset."""
        queryset = super().get_queryset()
        if self.request.user.is_superuser:
            return queryset
        return queryset.filter(farm__owner_id=self.request.user.id)

    @extend_schema(
        operation_id="Upload Cultivation Image",
        description="Upload an image for cultivation logging.",
        request={
            "multipart/form-data": {
                "type": "object",
                "properties": {
                    "image": {
                        "type": "string",
                        "format": "binary",
                        "description": "Image file to upload.",
                    },
                },
                "required": ["image"],
            },
        },
        responses=None,
    )
    @action(
        methods=["POST"],
        detail=True,
        url_name="upload-image",
        url_path="upload-image",
    )
    def upload_image(
        self,
        request: django.http.HttpRequest,
        pk: int,
        *args: list,
        **kwargs: dict,
    ) -> Response:
        """Upload an image for a sector."""
        sector = self.get_object()
        image = request.FILES.get("image")
        if not image:
            return Response(
                {"error": "Image file is required."},
                status=400,
            )
        action = services.classify_image_action(image)
        if action:
            models.CultivationLog.objects.create(
                farm=sector.farm,
                sector=sector,
                action=action,
            )
        return Response(
            {
                "message": (
                    "Image is classified as "
                    f"{action.title() if action else "null"}."
                ),
            },
            status=200,
        )


class DeviceTypeViewSet(ReadOnlyViewSet):
    """ViewSet for managing DeviceTypes."""

    model_name = "DeviceType"
    queryset = models.DeviceType.objects.all()
    serializer_class = serializers.DeviceTypeSerializer
    ordering_fields = ()
    search_fields = (
        "name",
    )


class DeviceViewSet(CRUDViewSet):
    """ViewSet for managing Devices."""

    model_name = "Device"
    queryset = models.Device.objects.all()
    serializer_class = serializers.DeviceSerializer
    ordering_fields = ()
    search_fields = (
        "name",
        "device_type__name",
    )
    filterset_class = filters.DeviceFilter

    def get_queryset(self):
        """Get queryset for the viewset."""
        queryset = super().get_queryset()
        if self.request.user.is_superuser:
            return queryset
        return queryset.filter(farm__owner_id=self.request.user.id)

    @extend_schema(
        operation_id="Get Device Time Series Data",
        description="Get time series data for a device.",
        request=None,
        parameters=[
            OpenApiParameter(
                name="farm",
                type=int,
                description="ID of the farm.",
                required=False,
            ),
            OpenApiParameter(
                name="start_time",
                type=str,
                description="Start time for the data in ISO format.",
                required=False,
            ),
            OpenApiParameter(
                name="end_time",
                type=str,
                description="End time for the data in ISO format.",
                required=False,
            ),
        ],
        responses=None,
    )
    @action(
        methods=["GET"],
        detail=False,
        url_name="time-series",
        url_path="time-series",
    )
    def get_time_series_data(
        self,
        request: django.http.HttpRequest,
        *args: list,
        **kwargs: dict,
    ) -> Response:
        """Get time series data for a device."""
        devices = list(self.filter_queryset(self.get_queryset()))
        try:
            end_time = (
                dt.datetime.fromisoformat(request.query_params.get("end_time"))
                if request.query_params.get("end_time")
                else dt.datetime.now(tz=dt.UTC)
            )
            start_time = (
                dt.datetime.fromisoformat(request.query_params.get("start_time"))
                if request.query_params.get("start_time")
                else end_time - dt.timedelta(days=30)
            )
        except ValueError:
            return Response(
                {
                    "error": "Invalid date format. Use ISO format.",
                },
                status=400,
            )

        data = services.fetch_device_data(
            devices=devices,
            series=True,
            start_time=start_time,
            end_time=end_time,
        )
        response_data = {
            device.id: {
                "name": device.name,
                "code": device.code,
                "farm_data": serializers.FarmLabSerializer(
                    device.farm,
                ).data,
                "sector_data": serializers.SectorSerializer(
                    device.sector,
                ).data,
                "device_type_data": serializers.DeviceTypeSerializer(
                    device.device_type,
                ).data,
                "values": value,
            }
            for device, value in data.items()
        }
        return Response(
            {
                "data": response_data,
            },
            status=200,
        )


class WarningThresholdViewSet(CRUDViewSet):
    """ViewSet for managing WarningThresholds."""

    model_name = "WarningThreshold"
    queryset = models.WarningThreshold.objects.all()
    serializer_class = serializers.WarningThresholdSerializer
    ordering_fields = ()
    search_fields = ()

    def get_queryset(self):
        """Get queryset for the viewset."""
        queryset = super().get_queryset()
        if self.request.user.is_superuser:
            return queryset
        return queryset.filter(device__farm__owner_id=self.request.user.id)
