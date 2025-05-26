from django.urls import reverse

from rest_framework.test import APIClient

import pytest

from farmlabs.factories import WarningThresholdFactory
from farmlabs.models import WarningThreshold
from farmlabs.serializers import WarningThresholdSerializer


@pytest.mark.django_db
def test_register_warning_threshold(api_client: APIClient):
    """Test warning threshold registration using a real API server."""
    url = reverse("warning-threshold-list")
    threshold = WarningThresholdFactory()
    json_data = WarningThresholdSerializer(threshold).data
    response = api_client.post(url, data=json_data, timeout=10)
    assert response.status_code in [200, 201]


@pytest.mark.django_db
def test_get_warning_thresholds(api_client: APIClient):
    """Test retrieving all warning thresholds."""
    WarningThresholdFactory.create_batch(3)
    url = reverse("warning-threshold-list")
    response = api_client.get(url)
    assert response.status_code == 200
    assert len(response.data) == 3


@pytest.mark.django_db
def test_get_warning_threshold_by_id(api_client: APIClient):
    """Test retrieving a single warning threshold by ID."""
    warning_threshold = WarningThresholdFactory.create_batch(3)
    warning_threshold_id = warning_threshold[0].id
    url = reverse(
        "warning-threshold-detail",
        kwargs={"pk": warning_threshold_id},
    )
    response = api_client.get(url)
    assert response.status_code == 200


@pytest.mark.django_db
def test_update_warning_threshold(api_client: APIClient):
    """Test updating a warning threshold."""
    threshold = WarningThresholdFactory()
    assert WarningThreshold.objects.filter(id=threshold.id).exists()
    warning_threshold_id = threshold.id
    url = reverse(
        "warning-threshold-detail",
        kwargs={"pk": warning_threshold_id},
    )
    updated_data = {
        "device": threshold.device.id,
        "type": "TEMPERATURE",
        "value": 30.0,
    }
    response = api_client.put(url, updated_data, format="json")
    assert response.status_code == 200


@pytest.mark.django_db
def test_delete_warning_threshold(api_client: APIClient):
    """Test deleting a warning threshold."""
    warning_threshold = WarningThresholdFactory()
    warning_threshold_id = warning_threshold.id
    url = reverse(
        "warning-threshold-detail",
        kwargs={"pk": warning_threshold_id},
    )
    response = api_client.delete(url)
    assert response.status_code == 204
    assert not WarningThreshold.objects.filter(
        pk=warning_threshold.pk,
    ).exists()
