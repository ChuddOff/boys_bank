from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_check():
    payload = {
        "message": "тест",
        "amount": 100,
        "currency": "RUB"
    }

    response = client.post("/api/v1/check", json=payload)

    assert response.status_code == 200

    data = response.json()

    assert "suspicious" in data
    assert "riskScore" in data
