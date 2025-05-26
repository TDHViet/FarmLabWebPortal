from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from . import mixins as core_mixins


class BaseViewSet(
    core_mixins.ActionPermissionsMixin,
    core_mixins.ActionSerializerMixin,
    GenericViewSet,
):
    """Base viewset for api."""

    base_permission_classes = (
        IsAuthenticated,
    )


class CRUDViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    core_mixins.UpdateModelWithoutPatchMixin,
    mixins.DestroyModelMixin,
    BaseViewSet,
):
    """CRUD viewset for api views."""


class ReadOnlyViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    BaseViewSet,
):
    """Read only viewset for api views."""
