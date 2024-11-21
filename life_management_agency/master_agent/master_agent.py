from agency_swarm import Agent
from ..tools.SimpleCommunicationTool import SimpleCommunicationTool
from ..tools.AgentCoordinationTool import AgentCoordinationTool
import asyncio
from typing import Dict, Any, List, Union

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
            model="gpt-4o"  # Using gpt-4o for complex coordination tasks
        )

    def format_thought(self, thought: Union[Dict[str, Any], str]) -> str:
        """Format a thought dictionary into a string."""
        if isinstance(thought, str):
            return thought
        elif isinstance(thought, dict):
            agent = thought.get('agent', 'unknown')
            thought_content = thought.get('thought', '')
            return f"[{agent}] {thought_content}"
        else:
            return str(thought)

    async def process_request(self, request: Union[Dict[str, Any], str]) -> Dict[str, Any]:
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
                message = str(request)
                session_id = None

            if not message:
                raise ValueError("Empty message received")

            thought_process: List[str] = []
            
            # Step 1: Analyze request and determine required agents
            try:
                coordination_tool = AgentCoordinationTool(message=message)
                coordination_result = await coordination_tool.run()
                required_agents = coordination_result.get('required_agents', ['master_agent'])
                
                thought_process.append(
                    self.format_thought({
                        'agent': 'master',
                        'thought': f"Analyzed request and identified relevant agents: {', '.join(required_agents)}"
                    })
                )
            except Exception as e:
                print(f"Error in coordination step: {str(e)}")
                required_agents = ['master_agent']
                thought_process.append(
                    self.format_thought({
                        'agent': 'master',
                        'thought': f"Coordination error, defaulting to master agent: {str(e)}"
                    })
                )

            # Step 2: Gather insights from each required agent
            agent_insights: Dict[str, str] = {}
            for agent in required_agents:
                thought_process.append(
                    self.format_thought({
                        'agent': agent,
                        'thought': f"Gathering specialized insights for {agent.replace('_', ' ')} perspective"
                    })
                )
                
                try:
                    comm_tool = SimpleCommunicationTool(
                        message=message,
                        agent=agent,
                        session_id=session_id
                    )
                    response = await comm_tool.run()
                    if response and 'response' in response:
                        agent_insights[agent] = response['response']
                        if 'metadata' in response and 'thought_process' in response['metadata']:
                            nested_thoughts = response['metadata']['thought_process']
                            if isinstance(nested_thoughts, list):
                                thought_process.extend([self.format_thought(t) for t in nested_thoughts])
                            else:
                                thought_process.append(self.format_thought(nested_thoughts))
                except Exception as e:
                    print(f"Error getting insights from {agent}: {str(e)}")
                    thought_process.append(
                        self.format_thought({
                            'agent': agent,
                            'thought': f"Error gathering insights: {str(e)}"
                        })
                    )

            # Step 3: Generate final integrated response
            thought_process.append(
                self.format_thought({
                    'agent': 'master',
                    'thought': "Synthesizing insights from all agents into a cohesive response"
                })
            )
            
            try:
                final_comm_tool = SimpleCommunicationTool(
                    message=message,
                    agent=None,
                    context=agent_insights,
                    session_id=session_id
                )
                final_response = await final_comm_tool.run()
                
                if not final_response or 'response' not in final_response:
                    raise ValueError("Invalid response format from communication tool")
                
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
                print(f"Error in final response generation: {str(e)}")
                # Provide a fallback response using available insights
                fallback_response = "I apologize, but I'm having trouble generating a complete response. "
                if agent_insights:
                    fallback_response += "Here's what I understand: " + " ".join(agent_insights.values())
                else:
                    fallback_response += "Please try again with your request."

                return {
                    'message': fallback_response,
                    'involved_agents': required_agents,
                    'metadata': {
                        'thought_process': thought_process + [
                            self.format_thought({
                                'agent': 'master',
                                'thought': f"Error in final synthesis: {str(e)}"
                            })
                        ]
                    }
                }

        except Exception as e:
            error_message = f"I apologize, but I encountered an error: {str(e)}"
            print(f"Critical error in process_request: {str(e)}")
            return {
                'message': error_message,
                'involved_agents': ['master_agent'],
                'metadata': {
                    'thought_process': [
                        self.format_thought({
                            'agent': 'master',
                            'thought': f"Critical error during processing: {str(e)}"
                        })
                    ]
                }
            }
