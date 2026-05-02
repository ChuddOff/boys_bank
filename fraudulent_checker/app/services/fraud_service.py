import logging

from app.models.payment import PaymentRequest

logger = logging.getLogger(__name__)


class FraudService:

    def check(self, payment: PaymentRequest):
        logger.info(f"Checking payment: {payment}")

        # пока заглушка
        score = 0.0

        return {
            "fraud_score": score,
            "details": {
                "metadata_score": 0.0,
                "text_score": 0.0,
                "note": "algorithm not implemented yet"
            }
        }
