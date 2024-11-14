import os
from agency_swarm import Agent
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool

class FamilyCoachAgent(Agent):
    def __init__(self):
        # Get absolute path to instructions file
        instructions_path = os.path.join(os.path.dirname(__file__), 'instructions.md')
        
        super().__init__(
            name="Family Coach Agent",
            description="Provides guidance on family relationships and dynamics.",
            instructions=instructions_path,
            tools=[SimpleCommunicationTool],
            temperature=0.4,
            max_prompt_tokens=25000,
            model="gpt-4o"  # Using GPT-4o for sophisticated family guidance
        )
