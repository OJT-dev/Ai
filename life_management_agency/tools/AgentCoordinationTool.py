from agency_swarm.tools import BaseTool
from pydantic import Field
from typing import List, Dict

class AgentCoordinationTool(BaseTool):
    """
    Tool for analyzing user requests and determining which specialized agents should handle them.
    """
    message: str = Field(
        ..., 
        description="The user message to analyze"
    )

    def run(self) -> Dict[str, List[str]]:
        """
        Analyzes the message and returns list of required agents.
        """
        required_agents = []
        message_lower = self.message.lower()
        
        # Knowledge-related topics
        if any(word in message_lower for word in ['learn', 'know', 'understand', 'research', 'information']):
            required_agents.append('knowledge')
            
        # Health-related topics
        if any(word in message_lower for word in ['health', 'exercise', 'diet', 'medical', 'wellness', 'fitness']):
            required_agents.append('health')
            
        # Lifestyle-related topics
        if any(word in message_lower for word in ['schedule', 'routine', 'lifestyle', 'habit', 'daily', 'time']):
            required_agents.append('lifestyle')
            
        # Social media-related topics
        if any(word in message_lower for word in ['social', 'media', 'network', 'online', 'digital', 'internet']):
            required_agents.append('social')
            
        # Personal development topics
        if any(word in message_lower for word in ['goal', 'personal', 'development', 'improve', 'growth', 'career']):
            required_agents.append('personal')
            
        # Family-related topics
        if any(word in message_lower for word in ['family', 'relationship', 'relative', 'partner', 'child', 'parent']):
            required_agents.append('family')

        return {"required_agents": required_agents}

if __name__ == "__main__":
    tool = AgentCoordinationTool(message="I want to improve my health and family relationships")
    print(tool.run())
