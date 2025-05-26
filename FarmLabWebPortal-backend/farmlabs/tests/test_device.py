from django.urls import reverse

from rest_framework.test import APIClient

import pytest

from farmlabs.factories import DeviceFactory
from farmlabs.models import Device
from farmlabs.serializers import DeviceSerializer


@pytest.mark.django_db
def test_register_device(api_client: APIClient):
    """Test device registration using a real API server."""
    url = reverse("device-list")
    device = DeviceFactory()
    data = DeviceSerializer(device).data
    response = api_client.post(url, data, json=data, timeout=10)
    assert response.status_code in [200, 201]


@pytest.mark.django_db
def test_get_devices(api_client: APIClient):
    """Test retrieving all devices."""
    DeviceFactory.create_batch(3)

    url = reverse("device-list")
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.json()) == 3


@pytest.mark.django_db
def test_update_device(api_client: APIClient):
    """Test updating a device using PUT request."""
    device = DeviceFactory.create()
    assert Device.objects.filter(id=device.id).exists()
    url = reverse("device-detail", kwargs={"pk": device.id})
    updated_data = {
        "name": "Updated Device Name",
        "type": "SENSOR",
        "status": "ACTIVE",
        "farm": device.farm.id,
    }

    response = api_client.put(url, updated_data, format="json")
    assert response.status_code in [200, 201]


@pytest.mark.django_db
def test_get_devices_by_id(api_client: APIClient):
    """Test retrieving a single farm lab by ID."""
    device = DeviceFactory.create_batch(3)
    device_id = device[0].id
    url = reverse("device-detail", kwargs={"pk": device_id})
    response = api_client.get(url)
    assert response.status_code == 200


@pytest.mark.django_db
def test_delete_device(api_client: APIClient):
    """Test deleting a device."""
    device = DeviceFactory()
    device_id = device.id
    url = reverse("device-detail", kwargs={"pk": device_id})
    response = api_client.delete(url)
    assert response.status_code == 204
    assert not Device.objects.filter(
        id=device.id,
    ).exists()
