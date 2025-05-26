from django.db import models


class UserRole(models.TextChoices):
    """User roles for the application."""

    ADMIN = "admin", "Admin"
    USER = "user", "User"
