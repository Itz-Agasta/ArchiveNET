from fastapi import APIRouter
import os
import httpx
from fastapi.responses import JSONResponse
from fastapi import HTTPException

from eva.utils.models import ContextQuery, ContextResponse

base_url = os.getenv("BASE_URL", "http://localhost:3000/memories")
headers = {
    "Content-Type": "application/json"
}
router = APIRouter()

@router.post("/context/search")
async def search_context(query: ContextQuery)-> ContextResponse:
    print(query.model_dump(mode="json"))
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{base_url}/search",
            json= query.model_dump(mode="json"),
            headers = headers
        )
    if response.status_code == 200:
        return ContextResponse(**response.json())
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text
        )
