from fastapi import APIRouter
from eva.utils.models import HealthCheck

router = APIRouter()

@router.get("/health")
async def health()-> HealthCheck:
    return HealthCheck(
        status="ok",
        connected=True,
    ) 