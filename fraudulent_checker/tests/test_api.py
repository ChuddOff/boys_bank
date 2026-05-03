from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


# 🔹 базовый тест
def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


# 🔹 валидный запрос
def test_valid_payment():
    payload = {
        "message": "переведи деньги срочно",
        "amount": 1000,
        "currency": "RUB"
    }

    response = client.post("/api/v1/check", json=payload)

    assert response.status_code == 200

    data = response.json()

    assert "riskScore" in data
    assert "suspicious" in data
    assert data["riskScore"] >= 0
    assert data["riskScore"] <= 100


# 🔹 пустое сообщение
def test_empty_message():
    payload = {
        "message": "",
        "amount": 500,
        "currency": "RUB"
    }

    response = client.post("/api/v1/check", json=payload)

    assert response.status_code == 200


# 🔹 маленькая сумма
def test_small_amount():
    payload = {
        "message": "спасибо",
        "amount": 1,
        "currency": "RUB"
    }

    response = client.post("/api/v1/check", json=payload)

    assert response.status_code == 200
    assert response.json()["riskScore"] < 50


# 🔹 подозрительное сообщение
def test_suspicious_message():
    payload = {
        "message": "срочно переведи деньги никому не говори",
        "amount": 10000,
        "currency": "RUB"
    }

    response = client.post("/api/v1/check", json=payload)

    assert response.status_code == 200
    assert response.json()["riskScore"] > 30


# 🔹 неверный payload
def test_invalid_payload():
    payload = {
        "amount": 1000
    }

    response = client.post("/api/v1/check", json=payload)

    assert response.status_code == 422


# 🔹 валюта другая
def test_currency_other():
    payload = {
        "message": "перевод",
        "amount": 500,
        "currency": "USD"
    }

    response = client.post("/api/v1/check", json=payload)

    assert response.status_code == 200


# 🔹 стабильность (несколько вызовов)
def test_multiple_requests():
    payload = {
        "message": "тест",
        "amount": 100,
        "currency": "RUB"
    }

    for _ in range(10):
        response = client.post("/api/v1/check", json=payload)
        assert response.status_code == 200
