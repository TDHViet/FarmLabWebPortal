import uuid

import factory

from . import models

DEFAULT_PASSWORD = "Test111!"  # noqa: S105
DEFAULT_PHONE_NUMBER = "0123456789"


class UserFactory(factory.django.DjangoModelFactory):
    """Factory to generate test Customer user."""

    username = factory.Faker("user_name")
    role = "farmlab_owner"
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    date_of_birth = factory.Faker("date_of_birth")
    phone_number = DEFAULT_PHONE_NUMBER
    address = factory.Faker("address")
    province = factory.Faker("city")
    active = True

    class Meta:
        model = models.User

    @factory.lazy_attribute
    def email(self) -> str:
        """Return formatted email."""
        return f"{uuid.uuid4()}@email.com"
