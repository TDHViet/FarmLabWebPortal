from core.views import CRUDViewSet
from users.models import User
from users.serializers import UserSerializer


class UserViewSet(CRUDViewSet):
    """Viewset for users."""

    model_name = "User"
    queryset = User.objects.all()
    serializer_class = UserSerializer
    ordering_fields = ()
    search_fields = (
        "username",
        "email",
        "first_name",
        "last_name",
    )

    def get_queryset(self):
        """Get queryset for the viewset."""
        queryset = super().get_queryset()
        if self.request.user.is_superuser:
            return queryset
        return queryset.filter(id=self.request.user.id)
