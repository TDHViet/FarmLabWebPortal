from django.urls import reverse

from rest_framework.test import APIClient

import pytest

from farmlabs.factories import FarmLabFactory
from farmlabs.models import FarmLab
from farmlabs.serializers import FarmLabSerializer


@pytest.mark.django_db
def test_register_farm_lab(api_client: APIClient):
    """Test farm lab registration using a real API server."""
    url = reverse("farmlab-list")
    data = FarmLabFactory()
    json_data = FarmLabSerializer(data).data
    response = api_client.post(
        url,
        data=json_data,
        format="json",
    )  # No timeout here
    assert response.status_code in [200, 201], f"Failed: {response.json()}"


@pytest.mark.django_db
def test_get_farm_labs(api_client: APIClient):
    """Test retrieving all farm labs."""
    FarmLabFactory.create_batch(3)
    url = reverse("farmlab-list")
    response = api_client.get(url, timeout=10)
    assert response.status_code == 200
    assert len(response.data) == 3


@pytest.mark.django_db
def test_get_farm_lab_by_id(api_client: APIClient):
    """Test retrieving a single farm lab by ID."""
    farm_lab = FarmLabFactory.create_batch(3)
    farm_lab_id = farm_lab[0].id
    url = reverse("farmlab-detail", kwargs={"pk": farm_lab_id})
    response = api_client.get(url, timeout=10)
    assert response.status_code == 200


@pytest.mark.django_db
def test_update_farm_lab(api_client: APIClient):
    """Test updating a farm lab."""
    farmlabs = FarmLabFactory.create()
    assert FarmLab.objects.filter(id=farmlabs.id).exists()
    farm_lab_id = farmlabs.id
    url = reverse("farmlab-detail", kwargs={"pk": farm_lab_id})
    updated_data = {
        "owner": farmlabs.owner.id,
        "name": "Updated Farm Lab Name",
        "address": "Updated Farm Lab Address",
        "longitude": round(farmlabs.longitude, 6),
        "latitude": round(farmlabs.latitude, 6),
    }
    response = api_client.put(url, updated_data, format="json", timeout=10)
    assert response.status_code == 200


@pytest.mark.django_db
def test_delete_farm_lab(api_client: APIClient):
    """Test deleting a farm lab."""
    farm_lab = FarmLabFactory.create()
    url = reverse("farmlab-detail", kwargs={"pk": farm_lab.pk})
    response = api_client.delete(url, timeout=10)

    assert response.status_code == 204, (
        f"Expected status code 204, got {response.status_code}"
    )
    assert not FarmLab.objects.filter(id=farm_lab.id).exists()
