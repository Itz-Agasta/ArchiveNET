from fastapi import APIRouter
import os
import httpx
import json
from fastapi import HTTPException

from eva.utils.config import CONFIG_FILE
from eva.utils.models import ContextQuery, ContextResponse

router = APIRouter()
base_url = os.getenv("BASE_URL", "http://localhost:3000/memories")
headers = {}
with open(CONFIG_FILE, 'r') as f:
    config = json.load(f)
    headers["Authorization"] = config.get("Authorization", "")
    headers["x-contract-id"] = config.get("x-contract-id", "")
    headers["Content-Type"] = "application/json"

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
