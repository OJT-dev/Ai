import os
from agency_swarm import Agent
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool

class HealthAgent(Agent):
    def __init__(self):
        # Get absolute path to instructions file
        instructions_path = os.path.join(os.path.dirname(__file__), 'instructions.md')
        
        super().__init__(
            name="Health Agent",
            description="Provides health-related advice and monitoring.",
            instructions=instructions_path,
            tools=[SimpleCommunicationTool],
            temperature=0.3,
            max_prompt_tokens=25000,
            model="gpt-4o"  # Using GPT-4o for accurate health advice
        )
