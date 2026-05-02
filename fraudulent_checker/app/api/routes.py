from fastapi import APIRouter, Depends

from app.dependencies import get_fraud_service
from app.models.payment import PaymentRequest
from app.models.response import FraudResponse
from app.services.fraud_service import FraudService

router = APIRouter(prefix="/api", tags=["fraud"])


@router.post("/check", response_model=FraudResponse)
def check_payment(
        payment: PaymentRequest,
        service: FraudService = Depends(get_fraud_service)
):
    return service.check(payment)


@router.get("/health")
def health_check():
    return {"status": "healthy"}
