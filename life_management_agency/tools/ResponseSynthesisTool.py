from agency_swarm.tools import BaseTool
from pydantic import Field
from typing import Dict

class ResponseSynthesisTool(BaseTool):
    """
    Tool for combining responses from multiple agents into a coherent message.
    """
    responses: Dict[str, str] = Field(
        ..., 
        description="Dictionary of agent responses with agent names as keys"
    )

    def run(self) -> str:
        """
        Combines multiple agent responses into a single coherent response.
        """
        if not self.responses:
            return "I need more specific information about what you'd like assistance with."
            
        # For single agent responses, return directly
        if len(self.responses) == 1:
            return next(iter(self.responses.values()))
            
        # Extract and combine key points
        combined_response = "Here's what you need to know:\n\n"
        
        for agent_name, response in self.responses.items():
            # Split response into bullet points
            points = [p.strip() for p in response.split('\n') if p.strip()]
            
            # Add section for each agent
            combined_response += f"• {agent_name.replace('_', ' ').title()} Insights:\n"
            for point in points:
                if not point.startswith('•'):
                    combined_response += f"  - {point}\n"
            combined_response += "\n"
            
        return combined_response.strip()

if __name__ == "__main__":
    responses = {
        "health_agent": "Exercise daily\nEat balanced meals",
        "family_agent": "Schedule family time\nPlan activities together"
    }
    tool = ResponseSynthesisTool(responses=responses)
    print(tool.run())
