from core.serializers import ModelBaseSerializer

from .models import User


class UserSerializer(ModelBaseSerializer):
    """Serializer for User model."""

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "role",
            "first_name",
            "last_name",
            "date_of_birth",
            "email",
            "phone_number",
            "address",
            "province",
            "active",
        ]
