import os
from agency_swarm import Agent
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool

class LifestyleAgent(Agent):
    def __init__(self):
        # Get absolute path to instructions file
        instructions_path = os.path.join(os.path.dirname(__file__), 'instructions.md')
        
        super().__init__(
            name="Lifestyle Agent",
            description="Provides lifestyle recommendations and habit optimization.",
            instructions=instructions_path,
            tools=[SimpleCommunicationTool],
            temperature=0.4,
            max_prompt_tokens=25000,
            model="gpt-4o-mini"  # Using GPT-4o mini for cost-efficient lifestyle advice
        )
