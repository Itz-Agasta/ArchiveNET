from fastapi import APIRouter
from utils.models import HealthCheck

router = APIRouter()

@router.get("/health")
async def fetch_context()-> HealthCheck:
    # basic API healthcheck
    return {"status": "ok", "message": "API is running", "code": 200}  # type: ignore