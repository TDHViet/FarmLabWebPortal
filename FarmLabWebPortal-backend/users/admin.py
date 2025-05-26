from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """Admin panel configuration for User model."""

    list_display = (
        "username",
        "email",
        "role",
        "active",
        "created",
    )
    search_fields = (
        "username",
        "email",
        "phone_number",
    )
    list_filter = ("active", "created")
    ordering = ("-id",)
    add_fieldsets = (
        (
            None, {
                "classes": (
                    "wide",
                ),
                "fields": (
                    "username",
                    "password1",
                    "password2",
                ),
            },
        ),
    )
    fieldsets = (
        (
            None, {
                "fields": (
                    "password",
                ),
            },
        ),
        (
            "General Information", {
                "fields": (
                    "username",
                    "role",
                ),
            },
        ),
        (
            "Personal Information", {
                "fields": (
                    "first_name",
                    "last_name",
                    "date_of_birth",
                ),
            },
        ),
        (
            "Contact Information", {
                "fields": (
                    "email",
                    "phone_number",
                    "address",
                    "province",
                ),
            },
        ),
        (
            "Permissions", {
                "fields": (
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )
