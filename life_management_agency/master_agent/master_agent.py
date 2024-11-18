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

    async def process_request(self, message):
        """
        Process incoming chat requests and coordinate with other agents.
        
        Args:
            message (str): The incoming message to process
            
        Returns:
            dict: Response containing the message, involved agents, and thought process
        """
        try:
            thought_process = []
            
            # Step 1: Analyze request and determine required agents
            coordination_tool = AgentCoordinationTool(message=message)
            coordination_result = coordination_tool.run()
            required_agents = coordination_result.get('required_agents', [])
            
            thought_process.append({
                'agent': 'master',
                'thought': f"Analyzed request and identified relevant agents: {', '.join(required_agents) if required_agents else 'handling directly'}"
            })

            # If no specific agents required, handle with master agent directly
            if not required_agents:
                thought_process.append({
                    'agent': 'master',
                    'thought': "Request can be handled directly by master agent without specialized input"
                })
                
                comm_tool = SimpleCommunicationTool(
                    message=message,
                    agent=None
                )
                response = await comm_tool.run()
                
                return {
                    'message': response['response'],
                    'involved_agents': ['master'],
                    'metadata': {
                        'thought_process': thought_process
                    }
                }

            # Step 2: Gather insights from each required agent
            agent_insights = {}
            for agent in required_agents:
                thought_process.append({
                    'agent': agent,
                    'thought': f"Gathering specialized insights for {agent.replace('_', ' ')} perspective"
                })
                
                comm_tool = SimpleCommunicationTool(
                    message=message,
                    agent=agent
                )
                response = await comm_tool.run()
                if response and 'response' in response:
                    agent_insights[agent] = response['response']
                    if 'metadata' in response and 'thought_process' in response['metadata']:
                        thought_process.extend(response['metadata']['thought_process'])

            # Step 3: Generate final integrated response
            thought_process.append({
                'agent': 'master',
                'thought': "Synthesizing insights from all agents into a cohesive response"
            })
            
            final_comm_tool = SimpleCommunicationTool(
                message=message,
                agent=None,
                context=agent_insights
            )
            final_response = await final_comm_tool.run()
            
            thought_process.append({
                'agent': 'master',
                'thought': "Generated final integrated response incorporating all relevant perspectives"
            })

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
                        {
                            'agent': 'master',
                            'thought': f"Encountered error during processing: {str(e)}"
                        }
                    ]
                }
            }
