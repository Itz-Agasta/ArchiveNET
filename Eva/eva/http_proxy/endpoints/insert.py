from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
import os
import httpx
import json

from eva.utils.models  import ContextQuery, ContextResponse, ContextData

router = APIRouter()
base_url = os.getenv("BASE_URL", "http://localhost:3000/memories")
headers = {
    "Content-Type": "application/json"
}
# Create a new client and connect to the server

@router.post("/context/insert")
async def insert_context(data:ContextData)-> JSONResponse:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{base_url}/insert",
            json= data.model_dump(mode="json"),
            headers = headers
        )
    if response.status_code == 200:
        return JSONResponse(content=response.json())
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text
        )
