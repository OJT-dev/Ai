from agency_swarm import Agent
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool

class PersonalCoachAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Personal Coach Agent",
            description="Provides personal development guidance and coaching.",
            instructions="./instructions.md",
            tools=[
                SimpleCommunicationTool
            ],
            temperature=0.4,
            max_prompt_tokens=25000,
            model="gpt-4o"
        )
