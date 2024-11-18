from agency_swarm import Agent
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool

class LifestyleAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Lifestyle Agent",
            description="Provides lifestyle recommendations and habit optimization.",
            instructions="./instructions.md",
            tools=[
                SimpleCommunicationTool
            ],
            temperature=0.4,
            max_prompt_tokens=25000,
            model="gpt-4o-mini"
        )
