from dotenv import load_dotenv
from agency_swarm import Agency
import os
import json
import sys
import asyncio
from typing import Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel

# Import agents using absolute imports
from life_management_agency.master_agent.master_agent import MasterAgent
from life_management_agency.knowledge_agent.knowledge_agent import KnowledgeAgent
from life_management_agency.health_agent.health_agent import HealthAgent
from life_management_agency.lifestyle_agent.lifestyle_agent import LifestyleAgent
from life_management_agency.social_media_agent.social_media_agent import SocialMediaAgent
from life_management_agency.personal_coach_agent.personal_coach_agent import PersonalCoachAgent
from life_management_agency.family_coach_agent.family_coach_agent import FamilyCoachAgent

# Load environment variables
load_dotenv()

class ChatRequest(BaseModel):
    message: str
    user: str = "user"

class LifeManagementAgency:
    def __init__(self):
        # Initialize all agents
        self.master_agent = MasterAgent()
        self.knowledge_agent = KnowledgeAgent()
        self.health_agent = HealthAgent()
        self.lifestyle_agent = LifestyleAgent()
        self.social_media_agent = SocialMediaAgent()
        self.personal_coach_agent = PersonalCoachAgent()
        self.family_coach_agent = FamilyCoachAgent()

        # Create a dictionary of all agents
        self.agents = {
            'master_agent': self.master_agent,
            'knowledge_agent': self.knowledge_agent,
            'health_agent': self.health_agent,
            'lifestyle_agent': self.lifestyle_agent,
            'social_media_agent': self.social_media_agent,
            'personal_coach_agent': self.personal_coach_agent,
            'family_coach_agent': self.family_coach_agent
        }

        # Create agent connections list
        agent_connections = [
            self.master_agent,
            [self.master_agent, self.knowledge_agent],
            [self.master_agent, self.health_agent],
            [self.master_agent, self.lifestyle_agent],
            [self.master_agent, self.social_media_agent],
            [self.master_agent, self.personal_coach_agent],
            [self.master_agent, self.family_coach_agent],
            [self.knowledge_agent, self.health_agent],
            [self.knowledge_agent, self.lifestyle_agent],
            [self.health_agent, self.lifestyle_agent],
            [self.personal_coach_agent, self.lifestyle_agent],
            [self.personal_coach_agent, self.family_coach_agent],
            [self.family_coach_agent, self.lifestyle_agent]
        ]

        # Initialize Agency Swarm
        self.agency = Agency(agent_connections, shared_instructions='agency_manifesto.md')

        # Set agency reference for each agent
        for agent in self.agents.values():
            agent.set_agency(self)

    async def process_message(self, message: str, user: str) -> Dict[str, Any]:
        try:
            # Process request through master agent
            response = await self.master_agent.process_request({
                'message': message,
                'user': user,
                'context': {
                    'session_user': user,
                    'timestamp': str(asyncio.get_event_loop().time())
                }
            })

            # Extract metadata
            involved_agents = response.get('metadata', {}).get('involved_agents', ['master_agent'])
            if isinstance(involved_agents, str):
                involved_agents = [involved_agents]

            thought_process = response.get('metadata', {}).get('thought_process', [])
            if not isinstance(thought_process, list):
                thought_process = [str(thought_process)]

            # Get response message
            response_message = response.get('message', '')
            if not response_message and 'response' in response:
                response_message = response['response']

            return {
                'message': response_message,
                'metadata': {
                    'involved_agents': involved_agents,
                    'thought_process': thought_process
                }
            }

        except Exception as e:
            print(f"Error processing message: {str(e)}", file=sys.stderr)
            return {
                'message': "I apologize, but I encountered an error processing your request. Please try again.",
                'metadata': {
                    'involved_agents': ['error_handler'],
                    'thought_process': [str(e)]
                }
            }

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agency
agency = None

@app.on_event("startup")
async def startup_event():
    global agency
    agency = LifeManagementAgency()

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        if agency is None:
            raise HTTPException(status_code=500, detail="Agency not initialized")
        response = await agency.process_message(request.message, request.user)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def main():
    if os.getenv('OPENAI_API_KEY') is None:
        print("Error: OpenAI API key is not set. Please check your environment variables.")
        sys.exit(1)
    
    print("Starting Life Management Agency server...")
    uvicorn.run(app, host="127.0.0.1", port=8002)

if __name__ == "__main__":
    main()
