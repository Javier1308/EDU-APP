from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app

client = TestClient(app)


def test_protected_route_without_token():
    response = client.get("/sources")
    assert response.status_code == 401


def test_protected_route_with_invalid_token():
    with patch("app.dependencies.verify_token", side_effect=Exception("invalid")):
        response = client.get("/sources", headers={"Authorization": "Bearer bad"})
        assert response.status_code == 401
