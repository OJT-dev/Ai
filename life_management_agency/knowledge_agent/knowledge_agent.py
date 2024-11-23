from agency_swarm import Agent
from knowledge_agent.tools.TavilySearchTool import TavilySearchTool
from tools.SimpleCommunicationTool import SimpleCommunicationTool

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
            model="gpt-4o"  # Using gpt-4o for complex information processing and analysis
        )
