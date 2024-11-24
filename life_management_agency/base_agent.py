from typing import Dict, Any, List, Optional
import openai
import asyncio
from agency_swarm import Agent

class BaseAgent(Agent):
    def __init__(self, name: str, description: str, expertise: List[str]):
        super().__init__(name=name, description=description)
        self.expertise = expertise
        self.client = openai.OpenAI()
        self.agency = None  # Will be set by Agency class

    def set_agency(self, agency):
        """Set the agency instance this agent belongs to"""
        self.agency = agency

    async def process_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        try:
            if not await self.validate_request(request):
                return {
                    'message': "Invalid request format. Please provide a message.",
                    'metadata': {'error': 'Invalid request'}
                }

            request = await self.preprocess_request(request)
            message = request.get('message', '')
            context = request.get('context', {})
            
            # Generate response using GPT-4
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model="gpt-4",
                messages=[
                    {"role": "system", "content": self._get_system_prompt()},
                    {"role": "user", "content": self._format_user_message(message, context)}
                ]
            )

            return {
                'message': response.choices[0].message.content,
                'metadata': {
                    'agent': self.name,
                    'expertise_used': self._get_relevant_expertise(message),
                    'confidence': self._calculate_confidence(message)
                }
            }
        except Exception as e:
            return await self.handle_error(e)

    def _get_system_prompt(self) -> str:
        """Generate the system prompt based on agent's expertise."""
        expertise_str = "\n".join([f"- {exp}" for exp in self.expertise])
        return f"""
        You are a specialized AI agent with expertise in:
        {expertise_str}

        Your role is to provide accurate, helpful, and relevant information within your areas of expertise.
        Always maintain a professional yet friendly tone, and be clear and concise in your responses.
        If a query falls outside your expertise, acknowledge this and suggest which other agent might be better suited to help.
        """

    def _format_user_message(self, message: str, context: Dict[str, Any]) -> str:
        """Format the user message with any additional context."""
        context_str = "\n".join([f"{k}: {v}" for k, v in context.items()])
        return f"""
        User Message: {message}

        Additional Context:
        {context_str}
        """

    def _get_relevant_expertise(self, message: str) -> List[str]:
        """Determine which areas of expertise are relevant to the message."""
        return [exp for exp in self.expertise if any(keyword in message.lower() for keyword in exp.lower().split())]

    def _calculate_confidence(self, message: str) -> float:
        """Calculate confidence score based on relevance to expertise."""
        relevant_expertise = self._get_relevant_expertise(message)
        return min(1.0, len(relevant_expertise) / len(self.expertise))

    async def handle_error(self, error: Exception) -> Dict[str, Any]:
        """Handle any errors that occur during processing."""
        error_msg = str(error)
        if "MasterAgent' object has no attribute 'agency'" in error_msg:
            error_msg = "Agent initialization incomplete. Please try again."
        
        return {
            'message': f"I apologize, but I encountered an error while processing your request: {error_msg}",
            'metadata': {
                'agent': self.name,
                'error': error_msg,
                'error_type': type(error).__name__
            }
        }

    async def validate_request(self, request: Dict[str, Any]) -> bool:
        """Validate the incoming request."""
        required_fields = ['message']
        return all(field in request for field in required_fields)

    async def preprocess_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess the request before handling."""
        # Clean and normalize the message
        if 'message' in request:
            request['message'] = request['message'].strip()
        return request

    async def postprocess_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """Postprocess the response before sending."""
        # Ensure all required fields are present
        if 'message' not in response:
            response['message'] = ''
        if 'metadata' not in response:
            response['metadata'] = {}
        return response
