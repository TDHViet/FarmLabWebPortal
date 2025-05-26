from django.conf import settings

from rest_framework.pagination import LimitOffsetPagination


class CustomLimitOffsetPagination(LimitOffsetPagination):
    """Customized paginator class to limit max objects in list APIs."""

    max_limit = settings.MAX_PAGINATION_SIZE
