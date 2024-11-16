from dotenv import load_dotenv
from agency_swarm import Agency
import os

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

# Initialize agents
master_agent = MasterAgent()
knowledge_agent = KnowledgeAgent()
health_agent = HealthAgent()
lifestyle_agent = LifestyleAgent()
social_media_agent = SocialMediaAgent()
personal_coach_agent = PersonalCoachAgent()
family_coach_agent = FamilyCoachAgent()

# Initialize Agency Swarm with communication flows
agency = Agency([
    master_agent,  # Master agent is the entry point
    [master_agent, knowledge_agent],  # Master can communicate with Knowledge
    [master_agent, health_agent],     # Master can communicate with Health
    [master_agent, lifestyle_agent],  # Master can communicate with Lifestyle
    [master_agent, social_media_agent],  # Master can communicate with Social Media
    [master_agent, personal_coach_agent],  # Master can communicate with Personal Coach
    [master_agent, family_coach_agent],  # Master can communicate with Family Coach
    [knowledge_agent, health_agent],  # Knowledge can communicate with Health
    [knowledge_agent, lifestyle_agent],  # Knowledge can communicate with Lifestyle
    [health_agent, lifestyle_agent],  # Health can communicate with Lifestyle
    [personal_coach_agent, lifestyle_agent],  # Personal Coach can communicate with Lifestyle
    [personal_coach_agent, family_coach_agent],  # Personal Coach can communicate with Family Coach
    [family_coach_agent, lifestyle_agent]  # Family Coach can communicate with Lifestyle
], shared_instructions='agency_manifesto.md')

if __name__ == "__main__":
    # For web interface with deployment configuration
    port = int(os.getenv('PORT', 80))
    agency.demo_gradio(
        height=900,
        share=True,
        server_name="0.0.0.0",
        server_port=port
    )