import logging

from app.ml.config import CONFIG
from app.ml.pipeline import compute_risk
from app.ml.runtime import get_model, get_embeddings
from app.models.payment import FraudCheckRequest

logger = logging.getLogger(__name__)


class FraudService:

    def check(self, payment: FraudCheckRequest):
        logger.info(f"Checking payment: {payment}")

        model = get_model()
        _, template_embeddings = get_embeddings()

        risk, features = compute_risk(payment, model, template_embeddings)

        return {
            "suspicious": risk > CONFIG["thresholds"]["suspicious"],
            "riskScore": risk,
            "reason": features,
            "source": "ml-service"
        }
