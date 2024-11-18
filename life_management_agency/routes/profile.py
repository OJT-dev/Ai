from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()

class ProfilePreferences(BaseModel):
    language: str
    timezone: str
    theme: str

class ProfileData(BaseModel):
    name: str
    email: str
    dateJoined: str
    preferences: ProfilePreferences

class ProfileRequest(BaseModel):
    profile: ProfileData

@router.post("/api/profile")
async def update_profile(request: ProfileRequest):
    try:
        print(f"Received profile update request: {request.dict()}")
        # Here you would typically update the profile in a database
        # For now, we'll just return success with the updated profile
        return {
            "status": "success",
            "data": {
                "profile": request.profile.dict()
            }
        }
    except Exception as e:
        print(f"Error updating profile: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.options("/api/profile")
async def options_profile():
    return {"message": "OK"}
