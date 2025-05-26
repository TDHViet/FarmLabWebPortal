from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import UserManager as DjangoUserManager
from django.db import models

from django_extensions.db.models import TimeStampedModel

from core.validators import PHONE_REGEX

from .constants import UserRole


class User(TimeStampedModel, AbstractBaseUser, PermissionsMixin):
    """Model for users."""

    username = models.CharField(max_length=255, unique=True)
    role = models.CharField(
        max_length=10,
        choices=UserRole.choices,
        default=UserRole.USER,
    )
    first_name = models.CharField(
        max_length=255,
        blank=True,
    )
    last_name = models.CharField(
        max_length=255,
        blank=True,
    )
    date_of_birth = models.DateField(
        blank=True,
        null=True,
    )
    email = models.EmailField(
        unique=True,
    )
    phone_number = models.CharField(
        max_length=20,
        validators=[PHONE_REGEX],
        blank=True,
    )
    address = models.CharField(
        max_length=255,
        blank=True,
    )
    province = models.CharField(
        max_length=100,
        blank=True,
    )
    active = models.BooleanField(
        default=True,
    )

    is_staff = models.BooleanField(
        verbose_name="Staff status",
        default=False,
        help_text="Designates whether the user can log into this admin site.",
    )

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"

    objects = DjangoUserManager()

    def __str__(self) -> str:
        """Return username."""
        return self.username

    def save(self, *args, **kwargs) -> None:
        """Save user."""
        if self.role == UserRole.ADMIN:
            self.is_staff = True
            self.is_superuser = True
        else:
            self.is_staff = False
            self.is_superuser = False
        super().save(*args, **kwargs)
