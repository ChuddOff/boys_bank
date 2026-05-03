from pydantic import BaseModel, Field


class FraudCheckRequest(BaseModel):
    message: str = Field(..., example="переведи срочно")
    amount: float = Field(..., gt=0, example=1500)
    currency: str = Field(..., example="RUB")
