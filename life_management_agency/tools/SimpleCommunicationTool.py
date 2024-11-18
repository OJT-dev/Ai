from agency_swarm.tools import BaseTool
from pydantic import Field
from typing import Optional, List, Dict, Any
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv

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

            # Prepare conversation history
            messages = [
                {"role": "system", "content": system_message},
                {"role": "user", "content": self.message}
            ]

            # Add conversation history if provided
            if self.history:
                for msg in self.history:
                    messages.append({
                        "role": "user" if msg.get("sender") == "user" else "assistant",
                        "content": msg.get("text", "")
                    })

            print(f"Sending request to OpenAI with messages: {messages}")  # Debug log

            try:
                # Get response from OpenAI
                chat_completion = await client.chat.completions.create(
                    model="gpt-4",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=500
                )

                print(f"Received response from OpenAI: {chat_completion}")  # Debug log

                # Extract response
                ai_response = chat_completion.choices[0].message.content

                # Update response structure
                response['response'] = ai_response
                response['metadata']['thought_process'].append({
                    'agent': self.agent or 'master',
                    'thought': f"Processing request about {self.message}"
                })

                # Add conversation history metadata if provided
                if self.history:
                    response['metadata']['history_length'] = len(self.history)

                # Add any additional metadata
                if self.metadata:
                    response['metadata'].update(self.metadata)

                print(f"Returning response: {response}")  # Debug log
                return response

            except Exception as api_error:
                print(f"OpenAI API error: {str(api_error)}")  # Debug log
                raise ValueError(f"Error communicating with OpenAI API: {str(api_error)}")

        except Exception as e:
            print(f"Error in SimpleCommunicationTool: {str(e)}")  # Debug log
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
                        Help users achieve their health goals through personalized advice and planning.""",
            
            'knowledge': """You are a Knowledge Agent with expertise in research and information analysis. 
                          Provide evidence-based information and insights to help users make informed decisions.""",
            
            'lifestyle': """You are a Lifestyle Agent focused on daily routine optimization and habit formation. 
                          Help users create sustainable lifestyle changes and balanced schedules.""",
            
            'social': """You are a Social Media Agent specializing in online presence and digital communication. 
                        Help users manage their social media strategy and online interactions.""",
            
            'personal': """You are a Personal Coach Agent dedicated to individual growth and development. 
                         Help users set and achieve personal goals while maintaining motivation.""",
            
            'family': """You are a Family Coach Agent specializing in family dynamics and relationships. 
                        Help users foster healthy family connections and activities."""
        }

        default_message = """You are a Master Agent coordinating responses across multiple specialized domains. 
                           Help users by providing comprehensive guidance and directing them to appropriate specialized assistance."""

        return system_messages.get(agent, default_message)
