from django.core.validators import RegexValidator

PHONE_REGEX = RegexValidator(
    regex=r"^\+?\d{9,15}$",
    message=(
        """Phone number must be entered in the format: '+84912345678'.
        Up to 15 digits allowed."""
    ),
)
