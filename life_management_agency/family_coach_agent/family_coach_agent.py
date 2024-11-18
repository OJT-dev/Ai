from agency_swarm import Agent
from .tools.FamilyRelationshipTool import FamilyRelationshipTool
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool

class FamilyCoachAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Family Coach Agent",
            description="Provides guidance on family relationships and dynamics.",
            instructions="./instructions.md",
            tools=[
                FamilyRelationshipTool,
                SimpleCommunicationTool
            ],
            temperature=0.4,
            max_prompt_tokens=25000,
            model="gpt-4o"
        )
