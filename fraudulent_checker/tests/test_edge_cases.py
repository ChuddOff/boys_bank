from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_long_message():
    payload = {
        "message": "срочно " * 100,
        "amount": 1000,
        "currency": "RUB"
    }

    response = client.post("/api/v1/check", json=payload)
    assert response.status_code == 200


def test_uppercase():
    payload = {
        "message": "СРОЧНО ПЕРЕВЕДИ ДЕНЬГИ",
        "amount": 1000,
        "currency": "RUB"
    }

    response = client.post("/api/v1/check", json=payload)
    assert response.status_code == 200


def test_special_chars():
    payload = {
        "message": "!!! $$$ ???",
        "amount": 500,
        "currency": "RUB"
    }

    response = client.post("/api/v1/check", json=payload)
    assert response.status_code == 200
