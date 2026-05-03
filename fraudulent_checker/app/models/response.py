from pydantic import BaseModel


class FraudCheckResponse(BaseModel):
    suspicious: bool
    riskScore: float
    reason: str
    source: str = "ml-service"
