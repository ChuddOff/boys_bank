from fastapi import APIRouter, Depends

from app.dependencies import get_fraud_service
from app.models.payment import FraudCheckRequest
from app.models.response import FraudCheckResponse
from app.services.fraud_service import FraudService

router = APIRouter(prefix="/api/v1", tags=["fraud"])


@router.post("/check", response_model=FraudCheckResponse)
def check_payment(
        payment: FraudCheckRequest,
        service: FraudService = Depends(get_fraud_service)
):
    return service.check(payment)


@router.get("/health")
def health_check():
    return {"status": "healthy"}
