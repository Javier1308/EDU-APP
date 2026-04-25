import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock


@pytest.fixture
def mock_supabase():
    with patch("app.database.supabase") as mock:
        yield mock


@pytest.fixture
def valid_token():
    return "Bearer valid-test-token"
