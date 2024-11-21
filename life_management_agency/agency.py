from dotenv import load_dotenv
from agency_swarm import Agency
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import asyncio
import gradio as gr
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any, Union
import json

# Import agents
from life_management_agency.master_agent.master_agent import MasterAgent
from life_management_agency.knowledge_agent.knowledge_agent import KnowledgeAgent
from life_management_agency.health_agent.health_agent import HealthAgent
from life_management_agency.lifestyle_agent.lifestyle_agent import LifestyleAgent
from life_management_agency.social_media_agent.social_media_agent import SocialMediaAgent
from life_management_agency.personal_coach_agent.personal_coach_agent import PersonalCoachAgent
from life_management_agency.family_coach_agent.family_coach_agent import FamilyCoachAgent

# Load environment variables
load_dotenv()

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    type: str = "chat"

class ChatMetadata(BaseModel):
    thought_process: List[str] = Field(default_factory=list)
    involved_agents: List[str] = Field(default_factory=list)

class ChatData(BaseModel):
    response: str
    metadata: Optional[ChatMetadata] = None

class ChatResponse(BaseModel):
    status: str = "success"
    data: Optional[ChatData] = None
    error: Optional[str] = None

# Initialize agents
master_agent = MasterAgent()
knowledge_agent = KnowledgeAgent()
health_agent = HealthAgent()
lifestyle_agent = LifestyleAgent()
social_media_agent = SocialMediaAgent()
personal_coach_agent = PersonalCoachAgent()
family_coach_agent = FamilyCoachAgent()

# Initialize Agency Swarm
agency = Agency([
    master_agent,
    [master_agent, knowledge_agent],
    [master_agent, health_agent],
    [master_agent, lifestyle_agent],
    [master_agent, social_media_agent],
    [master_agent, personal_coach_agent],
    [master_agent, family_coach_agent],
    [knowledge_agent, health_agent],
    [knowledge_agent, lifestyle_agent],
    [health_agent, lifestyle_agent],
    [personal_coach_agent, lifestyle_agent],
    [personal_coach_agent, family_coach_agent],
    [family_coach_agent, lifestyle_agent]
], shared_instructions='agency_manifesto.md')

# Initialize FastAPI
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/api/chat")
async def chat_options():
    return {"message": "OK"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        print(f"Received chat request: {request}")
        
        # Process request through master agent
        response = await master_agent.process_request({
            'message': request.message,
            'session_id': request.session_id
        })

        print(f"Master agent response: {response}")

        # Extract involved agents
        involved_agents = response.get('metadata', {}).get('involved_agents', ['master_agent'])
        if isinstance(involved_agents, str):
            involved_agents = [involved_agents]

        # Get response message
        response_message = response.get('message', '')
        if not response_message and 'response' in response:
            response_message = response['response']

        # Extract thought process
        thought_process = response.get('metadata', {}).get('thought_process', [])
        if not isinstance(thought_process, list):
            thought_process = [str(thought_process)]

        return ChatResponse(
            status="success",
            data=ChatData(
                response=response_message,
                metadata=ChatMetadata(
                    thought_process=thought_process,
                    involved_agents=involved_agents
                )
            )
        )
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return ChatResponse(
            status="error",
            error=str(e)
        )

def run_server():
    """Run the FastAPI server."""
    port = int(os.getenv('PORT', 80))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="debug")

if __name__ == "__main__":
    try:
        run_server()
    except KeyboardInterrupt:
        print("Received KeyboardInterrupt, shutting down...")
    except Exception as e:
        print(f"Server error: {str(e)}")
        sys.exit(1)
