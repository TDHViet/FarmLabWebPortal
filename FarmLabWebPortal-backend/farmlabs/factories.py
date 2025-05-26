import factory

from users.factories import UserFactory

from . import models


class FarmLabFactory(factory.django.DjangoModelFactory):
    """Factory to generate test FarmLab."""

    owner = factory.SubFactory(UserFactory)
    name = factory.Faker("name")
    address = factory.Faker("address")
    longitude = factory.Faker("longitude")
    latitude = factory.Faker("latitude")

    class Meta:
        model = models.FarmLab


class SectorFactory(factory.django.DjangoModelFactory):
    """Factory to generate test Sector."""

    farm = factory.SubFactory(FarmLabFactory)
    name = factory.Faker("name")
    description = factory.Faker("text")

    class Meta:
        model = models.Sector


class DeviceFactory(factory.django.DjangoModelFactory):
    """Factory to generate test Device."""

    farm = factory.SubFactory(FarmLabFactory)
    code = factory.Faker("uuid4")
    name = factory.Faker("name")
    device_type = factory.Faker("word")

    class Meta:
        model = models.Device


class WarningThresholdFactory(factory.django.DjangoModelFactory):
    """Factory to generate test WarningThreshold."""

    device = factory.SubFactory(DeviceFactory)
    value = factory.Faker("random_int")

    class Meta:
        model = models.WarningThreshold


class DeviceTypeFactory(factory.django.DjangoModelFactory):
    """Factory to generate test DeviceType."""

    name = factory.Faker("name")
    description = factory.Faker("text")
    unit = factory.Faker("word")

    class Meta:
        model = models.DeviceType


class CultivatingLogFactory(factory.django.DjangoModelFactory):
    """Factory to generate test CultivatingLog."""

    farm = factory.SubFactory(FarmLabFactory)
    sector = factory.SubFactory(SectorFactory)

    class Meta:
        model = models.CultivationLog
