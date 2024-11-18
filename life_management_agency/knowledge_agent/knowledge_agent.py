from agency_swarm import Agent
from .tools.TavilySearchTool import TavilySearchTool
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool

class KnowledgeAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Knowledge Agent",
            description="Processes and analyzes information, providing research and knowledge-based insights.",
            instructions="./instructions.md",
            tools=[
                TavilySearchTool,
                SimpleCommunicationTool
            ],
            temperature=0.3,
            max_prompt_tokens=25000,
            model="gpt-4o-mini"
        )
