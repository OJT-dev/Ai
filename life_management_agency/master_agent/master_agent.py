from agency_swarm import Agent
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool
from ..tools.AgentCoordinationTool import AgentCoordinationTool

class MasterAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Master Agent",
            description="Coordinates communication between agents and manages overall task flow.",
            instructions="./instructions.md",
            tools=[
                SimpleCommunicationTool,
                AgentCoordinationTool
            ],
            temperature=0.3,
            max_prompt_tokens=25000,
            model="gpt-4o"
        )

    def format_thought(self, thought):
        """Format a thought dictionary into a string."""
        if isinstance(thought, str):
            return thought
        elif isinstance(thought, dict):
            agent = thought.get('agent', 'unknown')
            thought_content = thought.get('thought', '')
            return f"[{agent}] {thought_content}"
        else:
            return str(thought)

    async def process_request(self, request):
        """
        Process incoming chat requests and coordinate with other agents.
        
        Args:
            request: Can be either a string message or a dict containing message and session_id
            
        Returns:
            dict: Response containing the message, involved agents, and thought process
        """
        try:
            # Extract message and session_id from request
            if isinstance(request, dict):
                message = request.get('message', '')
                session_id = request.get('session_id')
            else:
                message = request
                session_id = None

            thought_process = []
            
            # Step 1: Analyze request and determine required agents
            coordination_tool = AgentCoordinationTool(message=message)
            coordination_result = coordination_tool.run()
            required_agents = coordination_result.get('required_agents', [])
            
            thought_process.append(
                self.format_thought({
                    'agent': 'master',
                    'thought': f"Analyzed request and identified relevant agents: {', '.join(required_agents)}"
                })
            )

            # Step 2: Gather insights from each required agent
            agent_insights = {}
            for agent in required_agents:
                thought_process.append(
                    self.format_thought({
                        'agent': agent,
                        'thought': f"Gathering specialized insights for {agent.replace('_', ' ')} perspective"
                    })
                )
                
                comm_tool = SimpleCommunicationTool(
                    message=message,
                    agent=agent,
                    session_id=session_id
                )
                response = await comm_tool.run()
                if response and 'response' in response:
                    agent_insights[agent] = response['response']
                    if 'metadata' in response and 'thought_process' in response['metadata']:
                        # Format any nested thought processes
                        nested_thoughts = response['metadata']['thought_process']
                        if isinstance(nested_thoughts, list):
                            thought_process.extend([self.format_thought(t) for t in nested_thoughts])
                        else:
                            thought_process.append(self.format_thought(nested_thoughts))

            # Step 3: Generate final integrated response
            thought_process.append(
                self.format_thought({
                    'agent': 'master',
                    'thought': "Synthesizing insights from all agents into a cohesive response"
                })
            )
            
            final_comm_tool = SimpleCommunicationTool(
                message=message,
                agent=None,
                context=agent_insights,
                session_id=session_id
            )
            final_response = await final_comm_tool.run()
            
            thought_process.append(
                self.format_thought({
                    'agent': 'master',
                    'thought': "Generated final integrated response incorporating all relevant perspectives"
                })
            )

            return {
                'message': final_response['response'],
                'involved_agents': required_agents,
                'metadata': {
                    'thought_process': thought_process
                }
            }

        except Exception as e:
            return {
                'message': f"I apologize, but I encountered an error: {str(e)}",
                'involved_agents': ['master'],
                'metadata': {
                    'thought_process': [
                        self.format_thought({
                            'agent': 'master',
                            'thought': f"Encountered error during processing: {str(e)}"
                        })
                    ]
                }
            }
