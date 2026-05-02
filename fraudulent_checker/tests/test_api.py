from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200


def test_check():
    payload = {
        "from_user": "1",
        "to_user": "2",
        "amount": 100,
        "message": "test"
    }

    response = client.post("/api/check", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert "fraud_score" in data
