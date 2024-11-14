import os
from agency_swarm import Agent
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool

class SocialMediaAgent(Agent):
    def __init__(self):
        # Get absolute path to instructions file
        instructions_path = os.path.join(os.path.dirname(__file__), 'instructions.md')
        
        super().__init__(
            name="Social Media Agent",
            description="Manages social media interactions and content strategy.",
            instructions=instructions_path,
            tools=[SimpleCommunicationTool],
            temperature=0.7,  # Higher temperature for more creative social content
            max_prompt_tokens=25000,
            model="gpt-4o-mini"  # Using GPT-4o mini for cost-efficient social media tasks
        )
