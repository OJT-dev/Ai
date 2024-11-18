from agency_swarm import Agent
from .tools.FitnessTrackerTool import FitnessTrackerTool
from .tools.MemoryTool import MemoryTool
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool

class HealthAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Health Agent",
            description="Provides health-related advice, fitness tracking, and wellness monitoring.",
            instructions="./instructions.md",
            tools=[
                FitnessTrackerTool,
                MemoryTool,
                SimpleCommunicationTool
            ],
            temperature=0.3,
            max_prompt_tokens=25000,
            model="gpt-4"
        )
