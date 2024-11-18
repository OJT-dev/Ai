from dotenv import load_dotenv
from agency_swarm import Agency
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import asyncio
import gradio as gr
from pydantic import BaseModel
from typing import Optional
import json

# Import agents
from life_management_agency.master_agent.master_agent import MasterAgent
from life_management_agency.knowledge_agent.knowledge_agent import KnowledgeAgent
from life_management_agency.health_agent.health_agent import HealthAgent
from life_management_agency.lifestyle_agent.lifestyle_agent import LifestyleAgent
from life_management_agency.social_media_agent.social_media_agent import SocialMediaAgent
from life_management_agency.personal_coach_agent.personal_coach_agent import PersonalCoachAgent
from life_management_agency.family_coach_agent.family_coach_agent import FamilyCoachAgent

# Import routes
from life_management_agency.routes.profile import router as profile_router

# Load environment variables
load_dotenv()

# Get port from environment variable
port = int(os.getenv('PORT', 80))

# Initialize FastAPI
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

# Include routers
app.include_router(profile_router, prefix="")

# Request models
class ChatRequest(BaseModel):
    message: str
    agent: str = "master_agent"
    type: str = "chat"
    content: Optional[dict] = None

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

@app.options("/api/chat")
async def options_chat():
    return {"message": "OK"}

@app.post("/api/chat")
async def handle_chat(request: ChatRequest):
    try:
        print(f"Processing request: {request}")
        
        # Use master_agent to process request
        response = await master_agent.process_request(request.message)
        
        if not isinstance(response, dict):
            raise ValueError("Invalid response format from master agent")
            
        # Format response for frontend
        formatted_response = {
            "status": "success",
            "data": {
                "response": response.get('message', ''),
                "metadata": {
                    "thought_process": response.get('metadata', {}).get('thought_process', []),
                    "involved_agents": response.get('involved_agents', ['master'])
                }
            }
        }
        
        print(f"Sending response: {formatted_response}")
        return JSONResponse(content=formatted_response)
        
    except Exception as e:
        print(f"Error in handle_chat: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error": str(e)
            }
        )

# Graceful shutdown handler
async def shutdown():
    print("Shutting down server...")
    print("Server shutdown complete.")

@app.on_event("shutdown")
async def shutdown_event():
    await shutdown()

# Signal handlers
def handle_sigterm(signum, frame):
    print("Received SIGTERM signal")
    asyncio.create_task(shutdown())

def handle_sigint(signum, frame):
    print("Received SIGINT signal")
    asyncio.create_task(shutdown())

# Gradio interface
def create_gradio_interface():
    with gr.Blocks() as demo:
        chatbot = gr.Chatbot(type='messages')
        msg = gr.Textbox()
        clear = gr.Button("Clear")

        async def respond(message, chat_history):
            try:
                response = await master_agent.process_request(message)
                chat_history.append((message, response['message']))
                return "", chat_history
            except Exception as e:
                return "", chat_history + [(message, f"Error: {str(e)}")]

        msg.submit(respond, [msg, chatbot], [msg, chatbot])
        clear.click(lambda: None, None, chatbot, queue=False)

    return demo

if __name__ == "__main__":
    try:
        demo = create_gradio_interface()
        app = gr.mount_gradio_app(app, demo, path="/gradio")
        print(f"Starting server on port {port}")
        uvicorn.run(app, host="0.0.0.0", port=port, log_level="debug")
    except KeyboardInterrupt:
        print("Received KeyboardInterrupt, initiating graceful shutdown...")
        asyncio.run(shutdown())
    except Exception as e:
        print(f"Server error: {str(e)}")
        asyncio.run(shutdown())
