import datetime as dt
from urllib.parse import quote_plus

from django.conf import settings

import requests

from .. import models


def _get_data_url(
    devices_code: list[str],
    series: bool = False,
    start_time: dt.datetime | None = None,
    end_time: dt.datetime | None = None,
) -> str:
    """Get the data URL for the devices.

    Args:
        devices_code (list[str]): List of device codes.
        series (bool, optional): Whether to get series data.
        start_time (dt.datetime, optional): Start date for the data.
        end_time (dt.datetime, optional): End date for the data.
        interval (int, optional): Interval for the data.

    Returns:
        str: The data URL.

    """
    keys = ",".join(quote_plus(code) for code in devices_code)
    device_id = "7a84a2a0-111a-11f0-b4bd-8b00c50fcae5"
    url = (
        f"https://thingsboard.cloud/api/plugins/telemetry/DEVICE/{device_id}"
        f"/values/timeseries?keys={keys}&agg=NONE"
    )

    if series:
        if start_time:
            url += f"&startTs={int(start_time.timestamp() * 1000)}"
        if end_time:
            url += f"&endTs={int(end_time.timestamp() * 1000)}"
        url += "&limit=200"
    return url


def fetch_token(farm: models.FarmLab) -> str:
    """Fetch the token for the farm.

    Args:
        farm (models.Farm): The farm object.

    Returns:
        str: The token for the farm.

    """
    url = "https://thingsboard.cloud/api/auth/login"
    headers = {"Content-Type": "application/json"}
    data = {
        "username": settings.CENTER_USERNAME,
        "password": settings.CENTER_PASSWORD,
    }
    response = requests.post(url, json=data, headers=headers, timeout=10)
    if response.status_code != 200:
        return ""
    data = response.json()
    access_token = f"Bearer {data.get('token')}"
    farm.token = access_token
    farm.save()
    return access_token


def fetch_device_data(
    devices: list[models.Device],
    series: bool = False,
    start_time: dt.datetime | None = None,
    end_time: dt.datetime | None = None,
) -> dict:
    """Fetch data from the API.

    Args:
        devices (list[models.Device]): List of devices to fetch data for.
        series (bool, optional): Whether to get series data.
        start_time (dt.datetime, optional): Start date for the data.
        end_time (dt.datetime, optional): End date for the data.

    Returns:
        dict: The fetched data.

    """
    if not devices:
        return {}
    farm = devices[0].farm
    url = _get_data_url(
        devices_code=[device.code for device in devices],
        series=series,
        start_time=start_time,
        end_time=end_time,
    )
    headers = {
        "Content-Type": "application/json",
        "X-Authorization": farm.token,
    }
    response = requests.get(url, headers=headers, timeout=10)
    if response.status_code != 200:
        access_token = fetch_token(farm)
        if not access_token:
            return {}
        headers["X-Authorization"] = access_token
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return {}
    data = response.json()
    return {
        device: [
            {
                "ts": dt.datetime.fromtimestamp(item["ts"] / 1000, tz=dt.UTC),
                "value": item["value"],
            }
            for item in data.get(device.code, [])
        ]
        for device in devices
    }
