import os
from agency_swarm import Agent
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool

class KnowledgeAgent(Agent):
    def __init__(self):
        # Get absolute path to instructions file
        instructions_path = os.path.join(os.path.dirname(__file__), 'instructions.md')
        
        super().__init__(
            name="Knowledge Agent",
            description="Processes and analyzes information, providing research and knowledge-based insights.",
            instructions=instructions_path,
            tools=[SimpleCommunicationTool],
            temperature=0.3,
            max_prompt_tokens=25000,
            model="gpt-4o-mini"  # Using GPT-4o mini for cost-efficient knowledge processing
        )
