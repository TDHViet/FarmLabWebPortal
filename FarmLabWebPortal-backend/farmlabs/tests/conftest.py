import os

import django

from rest_framework.test import APIClient

import pytest

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()  # Initialize Django


@pytest.fixture
def api_client() -> APIClient:
    """Fixture for API client."""
    return APIClient()
