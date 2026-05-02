from pydantic import BaseModel


class FraudResponse(BaseModel):
    fraud_score: float
    details: dict
