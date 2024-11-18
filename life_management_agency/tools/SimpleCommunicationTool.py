from agency_swarm.tools import BaseTool
from pydantic import Field
from typing import Optional, List, Dict, Any
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize AsyncOpenAI client once
client = AsyncOpenAI(api_key=os.getenv('OPENAI_API_KEY'))

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
    context: Optional[Dict[str, Any]] = Field(
        None,
        description="Optional context from other agents for integrated response."
    )

    async def run(self) -> Dict[str, Any]:
        """
        Process the communication between agents.
        
        Returns:
            Dict containing:
            - response: The processed response
            - status: Success/failure status
            - metadata: Any additional information including agent thought process
        """
        try:
            # Initialize response structure
            response = {
                'response': '',
                'status': 'success',
                'metadata': {
                    'thought_process': []
                }
            }

            # Check if OpenAI API key is available
            if not os.getenv('OPENAI_API_KEY'):
                raise ValueError("OpenAI API key not found in environment variables")

            # Prepare the system message based on agent type
            system_message = self._get_system_message(self.agent)

            # Enhance the message with context if available
            enhanced_message = self.message
            if self.context:
                enhanced_message = f"""
                User Request: {self.message}
                
                Additional Context:
                {self.context}
                
                Please provide a natural, cohesive response that addresses the user's request while incorporating relevant insights from the context provided.
                The response should flow naturally and not feel like separate pieces of advice stitched together.
                """

            # Prepare conversation messages
            messages = [
                {"role": "system", "content": system_message},
                {"role": "user", "content": enhanced_message}
            ]

            logger.debug(f"Sending request to OpenAI with messages: {messages}")

            try:
                # Get response from OpenAI
                chat_completion = await client.chat.completions.create(
                    model="gpt-4o",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=1000
                )

                logger.debug(f"Received response from OpenAI: {chat_completion}")

                # Extract response
                ai_response = chat_completion.choices[0].message.content

                # Update response structure
                response['response'] = ai_response
                response['metadata']['thought_process'].append({
                    'agent': self.agent or 'master',
                    'thought': f"Generated comprehensive response incorporating all relevant aspects"
                })

                logger.debug(f"Returning response: {response}")
                return response

            except Exception as api_error:
                logger.error(f"OpenAI API error: {str(api_error)}")
                raise ValueError(f"Error communicating with OpenAI API: {str(api_error)}")

        except Exception as e:
            logger.error(f"Error in SimpleCommunicationTool: {str(e)}")
            return {
                'response': f"Error processing message: {str(e)}",
                'status': 'error',
                'metadata': {
                    'error_type': type(e).__name__,
                    'error_message': str(e)
                }
            }

    def _get_system_message(self, agent: Optional[str]) -> str:
        """
        Get the appropriate system message based on agent type.
        """
        system_messages = {
            'health': """You are a Health Agent specializing in physical wellness, fitness, and nutrition. 
                        Provide comprehensive, natural-sounding advice that helps users achieve their health goals.""",
            
            'knowledge': """You are a Knowledge Agent with expertise in research and information analysis. 
                          Provide clear, well-researched information that helps users make informed decisions.""",
            
            'lifestyle': """You are a Lifestyle Agent focused on daily routine optimization and habit formation. 
                          Create personalized, practical advice for sustainable lifestyle improvements.""",
            
            'social': """You are a Social Media Agent specializing in online presence and digital communication. 
                        Provide strategic, actionable guidance for effective online interaction.""",
            
            'personal': """You are a Personal Coach Agent dedicated to individual growth and development. 
                         Deliver motivating, actionable guidance for achieving personal goals.""",
            
            'family': """You are a Family Coach Agent specializing in family dynamics and relationships. 
                        Provide thoughtful advice for strengthening family bonds and creating meaningful experiences."""
        }

        default_message = """You are a Master Agent with expertise across multiple domains including health, lifestyle, family, and personal development.
                           Provide comprehensive, well-integrated responses that naturally incorporate relevant insights from different areas.
                           Your responses should be cohesive and flow naturally, not feeling like separate pieces of advice stitched together."""

        return system_messages.get(agent, default_message)
