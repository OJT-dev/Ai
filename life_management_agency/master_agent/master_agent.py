from typing import Dict, Any, List
import json
import asyncio
from life_management_agency.base_agent import BaseAgent

class MasterAgent(BaseAgent):
    def __init__(self):
        expertise = [
            "Message routing and coordination",
            "Multi-agent orchestration",
            "Context management",
            "Response synthesis",
            "Task delegation",
            "Conversation flow",
            "Error handling",
            "User intent analysis",
            "Agent selection",
            "Response quality control"
        ]
        
        super().__init__(
            name="master_agent",
            description="Master agent that coordinates all other agents and manages conversation flow",
            expertise=expertise
        )

    async def process_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        try:
            message = request.get('message', '')
            user = request.get('user', 'user')
            context = request.get('context', {})

            # Analyze message to determine which agents should be involved
            analysis = await self._analyze_message(message)
            involved_agents = analysis.get('involved_agents', ['master_agent'])
            
            # Initialize thought process tracking
            thought_process = [
                f"Analyzing message: {message}",
                f"Identified relevant agents: {', '.join(involved_agents)}"
            ]

            # Collect responses from relevant agents
            agent_responses = []
            for agent_name in involved_agents:
                if agent_name != 'master_agent':
                    try:
                        if hasattr(self.agency, agent_name):
                            agent = getattr(self.agency, agent_name)
                            response = await agent.process_request({
                                'message': message,
                                'user': user,
                                'context': {
                                    **context,
                                    'analysis': analysis.get('context', {}),
                                    'other_agents': [a for a in involved_agents if a != agent_name]
                                }
                            })
                            agent_responses.append(response)
                            thought_process.append(f"Received response from {agent_name}")
                        else:
                            thought_process.append(f"Agent {agent_name} not found in agency")
                    except Exception as e:
                        thought_process.append(f"Error getting response from {agent_name}: {str(e)}")

            # Synthesize final response
            final_response = await self._synthesize_responses(agent_responses, analysis)
            thought_process.append("Synthesized final response")

            return {
                'message': final_response,
                'metadata': {
                    'involved_agents': involved_agents,
                    'thought_process': thought_process
                }
            }

        except Exception as e:
            return await self.handle_error(e)

    async def _analyze_message(self, message: str) -> Dict[str, Any]:
        """Analyze the message to determine which agents should be involved."""
        try:
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model="gpt-4",
                messages=[
                    {"role": "system", "content": """
                    Analyze the message and determine which agents should be involved.
                    Available agents:
                    - knowledge_agent: For learning and information
                    - health_agent: For wellness and health
                    - lifestyle_agent: For daily routines and habits
                    - social_media_agent: For social media management
                    - personal_coach_agent: For personal growth
                    - family_coach_agent: For family relationships

                    Return a JSON with:
                    - involved_agents: list of agent names (always include master_agent)
                    - context: relevant context for the agents
                    - priority: order of agent involvement
                    """},
                    {"role": "user", "content": message}
                ]
            )

            # Parse and validate response
            try:
                content = response.choices[0].message.content
                analysis = json.loads(content)
                if 'master_agent' not in analysis.get('involved_agents', []):
                    analysis['involved_agents'].append('master_agent')
                return analysis
            except json.JSONDecodeError:
                return {
                    'involved_agents': ['master_agent'],
                    'context': {'error': 'Failed to parse agent analysis'},
                    'priority': ['master_agent']
                }

        except Exception as e:
            return {
                'involved_agents': ['master_agent'],
                'context': {'error': str(e)},
                'priority': ['master_agent']
            }

    async def _synthesize_responses(self, responses: List[Dict[str, Any]], analysis: Dict[str, Any]) -> str:
        """Synthesize responses from multiple agents into a coherent response."""
        try:
            # Extract response messages and metadata
            response_data = []
            for resp in responses:
                if isinstance(resp, dict):
                    message = resp.get('message', '')
                    if not message and 'response' in resp:
                        message = resp['response']
                    metadata = resp.get('metadata', {})
                    response_data.append({
                        'message': message,
                        'agent': metadata.get('agent', 'unknown'),
                        'confidence': metadata.get('confidence', 0.5)
                    })
                else:
                    response_data.append({
                        'message': str(resp),
                        'agent': 'unknown',
                        'confidence': 0.5
                    })

            # If no responses, provide a default response
            if not response_data:
                return "I understand your message. However, I need more context or information to provide a helpful response. Could you please provide more details?"

            # Use GPT to synthesize responses
            synthesis_prompt = f"""
            Synthesize these agent responses into a coherent, helpful reply:
            {json.dumps(response_data, indent=2)}

            Context from analysis:
            {json.dumps(analysis.get('context', {}), indent=2)}

            Guidelines:
            1. Maintain a consistent, friendly tone
            2. Integrate insights from all agents
            3. Prioritize practical, actionable advice
            4. Be clear and concise
            5. Address the user's original intent
            """

            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a response synthesizer that creates coherent, helpful responses from multiple agent inputs."},
                    {"role": "user", "content": synthesis_prompt}
                ]
            )

            return response.choices[0].message.content

        except Exception as e:
            return f"I've gathered insights from multiple perspectives but encountered an error synthesizing them: {str(e)}"
