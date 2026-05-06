import pytest
import requests
from conftest import BASE_URL


def test_home_page_loads():
    """Home page should return 200."""
    # TODO: uncomment once Flask app is running in Docker
    # response = requests.get(f"{BASE_URL}/")
    # assert response.status_code == 200
    pass  # placeholder — remove when Daniel's routes are live


def test_health_endpoint():
    """Jenkins uses this to verify the app is alive."""
    # response = requests.get(f"{BASE_URL}/health")
    # assert response.status_code == 200
    pass


def test_add_item():
    """/add should accept a POST and return 200 or 201."""
    # payload = {
    #     "name": "Test item",
    #     "category": "Fun",
    #     "due_date": "2026-08-01",
    #     "lat": 27.9506,
    #     "lng": -82.4572
    # }
    # response = requests.post(f"{BASE_URL}/add", json=payload)
    # assert response.status_code in [200, 201]
    pass


def test_delete_item():
    """/delete/<id> should return 200 on a known item."""
    pass


def test_complete_item():
    """/complete/<id> should return 200 on a known item."""
    pass
