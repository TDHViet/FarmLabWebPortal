import typing

from django.contrib.auth import authenticate

from rest_framework import serializers

from users.models import User
from users.serializers import UserSerializer


class AuthTokenSerializer(serializers.Serializer):
    """Custom auth serializer."""

    username = serializers.CharField(
        write_only=True,
        required=True,
    )
    password = serializers.CharField(
        style={"input_type": "password"},
        trim_whitespace=False,
        write_only=True,
        required=True,
    )

    def validate(self, attrs: dict) -> dict:
        """Authenticate with input data."""
        username = attrs.get("username")
        password = attrs.get("password")

        user: User | None = authenticate(
            request=self.context.get("request"),
            username=username,
            password=password,
        )

        # The authenticate call simply returns None for is_active=False
        # users. (Assuming the default ModelBackend authentication
        # backend.)
        if not user:
            msg = "Unable to log in with provided credentials."
            raise serializers.ValidationError(msg, code="authorization")

        attrs["user"] = user
        return attrs

    def create(self, validated_data: dict) -> None:
        """Escape warning."""

    def update(self, instance: typing.Any, validated_data: dict) -> None:  # type: ignore
        """Escape warning."""


class AuthTokenResponseSerializer(serializers.Serializer):
    """Serializer for auth token response."""

    expiry = serializers.DateTimeField(read_only=True)
    token = serializers.CharField(read_only=True)
    user = UserSerializer(read_only=True)
