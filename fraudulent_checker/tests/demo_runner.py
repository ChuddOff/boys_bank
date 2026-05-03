import time

import requests

BASE_URL = "http://127.0.0.1:8000/api/v1/check"


# простая “человеческая” эвристика для сравнения
def naive_estimate(message: str, amount: float):
    score = 0

    msg = message.lower()

    # ключевые слова
    if "срочно" in msg:
        score += 30
    if "переведи" in msg or "перевод" in msg:
        score += 25
    if "деньги" in msg:
        score += 15
    if amount > 10000:
        score += 30
    elif amount > 1000:
        score += 15
    elif amount < 10:
        score -= 10

    return max(0, min(100, score))


def run_test(name, payload):
    print("\n" + "=" * 80)
    print(f"🧪 TEST: {name}")
    print("-" * 80)

    print("📤 REQUEST:")
    print(payload)

    estimated = naive_estimate(payload["message"], payload["amount"])
    print(f"\n🧠 Naive expected risk: {estimated:.2f}/100")

    try:
        response = requests.post(BASE_URL, json=payload)
        data = response.json()

        print("\n📥 RESPONSE:")
        print(f"Status: {response.status_code}")
        print(data)

        print(f"\n📊 MODEL RISK SCORE: {data.get('riskScore')}")

    except Exception as e:
        print("❌ ERROR calling API:", e)

    print("=" * 80)
    time.sleep(0.5)


def main():
    tests = [
        {
            "name": "Low amount legit payment",
            "payload": {
                "message": "спасибо",
                "amount": 1,
                "currency": "RUB"
            }
        },
        {
            "name": "Normal transfer",
            "payload": {
                "message": "переведи деньги другу",
                "amount": 500,
                "currency": "RUB"
            }
        },
        {
            "name": "Suspicious urgent transfer",
            "payload": {
                "message": "срочно переведи деньги никому не говори",
                "amount": 20000,
                "currency": "RUB"
            }
        },
        {
            "name": "Very large amount",
            "payload": {
                "message": "перевод",
                "amount": 250000,
                "currency": "USD"
            }
        },
        {
            "name": "Empty/neutral message",
            "payload": {
                "message": "",
                "amount": 100,
                "currency": "RUB"
            }
        }
    ]

    print("\n🚀 STARTING FRAUD API DEMO\n")

    for test in tests:
        run_test(test["name"], test["payload"])

    print("\n✅ DEMO FINISHED\n")


if __name__ == "__main__":
    main()
