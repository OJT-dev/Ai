import os
from agency_swarm import Agent
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool

class MasterAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Master Agent",
            description="Coordinates communication between agents and manages overall task flow.",
            instructions="./instructions.md",
            tools=[SimpleCommunicationTool],
            temperature=0.3,  # Lower temperature for more focused responses
            max_prompt_tokens=25000,
            model="gpt-4o"  # Using GPT-4o - most cost-effective high-performance model
        )
        
        # Initialize agent coordination state
        self.active_agents = set()
        self.conversation_context = {}

    async def process_request(self, message, history=None):
        """
        Process a user request by coordinating with appropriate agents.
        Returns both the final response and a list of involved agents.
        """
        # Reset active agents for new request
        self.active_agents = {'master'}
        
        # Analyze message to determine required agents
        required_agents = await self._analyze_requirements(message)
        
        # Collect responses from required agents
        agent_responses = {}
        for agent_name in required_agents:
            response = await self._get_agent_response(agent_name, message, history)
            if response:
                agent_responses[agent_name] = response
                self.active_agents.add(agent_name)

        # Combine responses into a coherent message
        final_response = await self._combine_responses(message, agent_responses)
        
        return {
            'message': final_response,
            'involved_agents': list(self.active_agents)
        }

    async def _analyze_requirements(self, message):
        """Analyze the message to determine which agents should be involved."""
        required_agents = set()
        message_lower = message.lower()
        
        # Knowledge-related topics
        if any(word in message_lower for word in ['learn', 'know', 'understand', 'research', 'information']):
            required_agents.add('knowledge')
            
        # Health-related topics
        if any(word in message_lower for word in ['health', 'exercise', 'diet', 'medical', 'wellness', 'fitness']):
            required_agents.add('health')
            
        # Lifestyle-related topics
        if any(word in message_lower for word in ['schedule', 'routine', 'lifestyle', 'habit', 'daily', 'time']):
            required_agents.add('lifestyle')
            
        # Social media-related topics
        if any(word in message_lower for word in ['social', 'media', 'network', 'online', 'digital', 'internet']):
            required_agents.add('social')
            
        # Personal development topics
        if any(word in message_lower for word in ['goal', 'personal', 'development', 'improve', 'growth', 'career']):
            required_agents.add('personal')
            
        # Family-related topics
        if any(word in message_lower for word in ['family', 'relationship', 'relative', 'partner', 'child', 'parent']):
            required_agents.add('family')
            
        # Life planning typically involves multiple aspects
        if any(word in message_lower for word in ['life plan', 'future', 'long term', 'planning']):
            required_agents.update(['personal', 'health', 'lifestyle'])
            
        return required_agents

    async def _get_agent_response(self, agent_name, message, history):
        """Get response from a specific agent."""
        try:
            # Use the SimpleCommunicationTool to interact with the agent
            response = await self.tools[0].execute({
                'agent': agent_name,
                'message': message,
                'history': history
            })
            return response.get('response')
        except Exception as e:
            print(f"Error getting response from {agent_name}: {str(e)}")
            return None

    async def _combine_responses(self, original_message, agent_responses):
        """Combine responses from multiple agents into a coherent message."""
        if not agent_responses:
            return "I apologize, but I need more specific information about what you'd like assistance with."
            
        # For single agent responses, return directly
        if len(agent_responses) == 1:
            return next(iter(agent_responses.values()))
            
        # For multiple agent responses, create a coordinated response
        coordination_prompt = f"""
        Original request: {original_message}
        Agent responses: {agent_responses}
        
        Create a unified, coherent response that:
        1. Addresses all aspects of the request
        2. Integrates insights from all involved agents
        3. Maintains a clear and organized structure
        4. Avoids repetition
        5. Provides actionable next steps
        """
        
        try:
            # Use the SimpleCommunicationTool for the final coordination
            coordinated_response = await self.tools[0].execute({
                'message': coordination_prompt
            })
            return coordinated_response.get('response')
        except Exception as e:
            print(f"Error coordinating responses: {str(e)}")
            # Fallback to simple combination if coordination fails
            return "\n\n".join(agent_responses.values())
