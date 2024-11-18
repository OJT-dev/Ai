from agency_swarm import Agent
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool

class SocialMediaAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Social Media Agent",
            description="Manages social media interactions and content strategy.",
            instructions="./instructions.md",
            tools=[
                SimpleCommunicationTool
            ],
            temperature=0.7,
            max_prompt_tokens=25000,
            model="gpt-4o-mini"
        )
