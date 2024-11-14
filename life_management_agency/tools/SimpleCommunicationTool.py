from agency_swarm.tools import BaseTool
from pydantic import Field
from typing import Optional, List, Dict, Any

class SimpleCommunicationTool(BaseTool):
    """
    A tool for facilitating communication between agents in the Life Management Agency.
    """

    message: str = Field(
        ..., 
        description="The message to be processed by the agent."
    )
    agent: Optional[str] = Field(
        None,
        description="The target agent to communicate with (e.g., 'health', 'knowledge', etc.)."
    )
    history: Optional[List[Dict[str, str]]] = Field(
        None,
        description="Optional conversation history for context."
    )
    metadata: Optional[Dict[str, Any]] = Field(
        None,
        description="Optional metadata for the communication."
    )

    async def run(self) -> Dict[str, Any]:
        """
        Process the communication between agents.
        
        Returns:
            Dict containing:
            - response: The processed response
            - status: Success/failure status
            - metadata: Any additional information
        """
        try:
            # Initialize response structure
            response = {
                'response': '',
                'status': 'success',
                'metadata': {}
            }

            # If a specific agent is targeted
            if self.agent:
                # Here we would normally route to specific agent
                # For now, we'll simulate agent-specific responses
                response['response'] = self._simulate_agent_response(
                    self.agent,
                    self.message,
                    self.history
                )
                response['metadata']['agent'] = self.agent
            else:
                # General message processing
                response['response'] = f"Processed: {self.message}"

            # Add conversation history if provided
            if self.history:
                response['metadata']['history_length'] = len(self.history)

            # Add any additional metadata
            if self.metadata:
                response['metadata'].update(self.metadata)

            return response

        except Exception as e:
            return {
                'response': f"Error processing message: {str(e)}",
                'status': 'error',
                'metadata': {
                    'error_type': type(e).__name__,
                    'error_message': str(e)
                }
            }

    def _simulate_agent_response(self, agent: str, message: str, history: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Simulate responses from different agents. This is a temporary solution
        until proper agent-specific processing is implemented.
        """
        # Use history if available to maintain context
        context = ""
        if history:
            last_messages = history[-3:]  # Get last 3 messages for context
            context = " ".join([msg['content'] for msg in last_messages])

        # Simulate different agent responses
        responses = {
            'health': f"Health Agent: Analyzing health aspects of your request: {message}",
            'knowledge': f"Knowledge Agent: Researching information about: {message}",
            'lifestyle': f"Lifestyle Agent: Considering lifestyle implications of: {message}",
            'social': f"Social Media Agent: Evaluating social media aspects of: {message}",
            'personal': f"Personal Coach Agent: Providing personal development guidance for: {message}",
            'family': f"Family Coach Agent: Addressing family-related aspects of: {message}"
        }

        return responses.get(
            agent,
            f"Unknown agent '{agent}'. Message: {message}"
        )

if __name__ == "__main__":
    # Example usage
    import asyncio

    async def test_tool():
        # Test with specific agent
        tool = SimpleCommunicationTool(
            message="How can I improve my work-life balance?",
            agent="lifestyle",
            history=[
                {"role": "user", "content": "I need help with my daily routine"},
                {"role": "assistant", "content": "Let's analyze your schedule"}
            ]
        )
        result = await tool.run()
        print("Test result:", result)

    # Run the test
    asyncio.run(test_tool())
