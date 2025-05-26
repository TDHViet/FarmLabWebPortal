from django.contrib.auth import login

from rest_framework import permissions

from drf_spectacular.utils import extend_schema
from knox.views import LoginView as KnoxLoginView

from . import serializers


class LoginView(KnoxLoginView):
    """User authentication view.

    We're using custom one because Knox using basic auth as default
    authorization method.

    """

    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    @extend_schema(
        request=serializers.AuthTokenSerializer,
        responses={
            200: serializers.AuthTokenResponseSerializer,
        },
    )
    def post(self, request, *args, **kwargs):
        """Login user and get auth token with expiry."""
        serializer = serializers.AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login(request, serializer.validated_data["user"]) # type: ignore
        return super().post(request, format=None)
