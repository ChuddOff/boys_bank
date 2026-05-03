import pytest

from app.main import app


@pytest.fixture(scope="session", autouse=True)
def init_app():
    from fastapi.testclient import TestClient

    client = TestClient(app)

    # принудительно триггерим startup
    with client:
        pass
