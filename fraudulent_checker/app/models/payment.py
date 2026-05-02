from pydantic import BaseModel, Field


class PaymentRequest(BaseModel):
    from_user: str = Field(..., example="user_123")
    to_user: str = Field(..., example="user_456")
    amount: float = Field(..., gt=0, example=1500)
    message: str = Field("", example="переведи срочно")
