from agency_swarm.tools import BaseTool
from pydantic import Field
import os
from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()  # Load environment variables

# Access the Tavily API key from environment variables
tavily_api_key = os.getenv("TAVILY_API_KEY")

class TavilySearchTool(BaseTool):
    """
    A tool that allows agents to perform web searches using the Tavily Search API.
    This tool enables agents to retrieve relevant and up-to-date information from the web.
    """
    query: str = Field(
        ..., description="The search query to retrieve information from the web."
    )

    def run(self):
        """
        Executes the search query using the Tavily Search API and returns the results.
        """
        # Check if the Tavily API key is available
        if not tavily_api_key:
            return "Error: Tavily API key not found. Please set the TAVILY_API_KEY environment variable."

        # Initialize the Tavily client
        tavily_client = TavilyClient(api_key=tavily_api_key)

        # Perform the search
        try:
            response = tavily_client.search(self.query)
            # Process and return the search results
            return response
        except Exception as e:
            return f"An error occurred while performing the search: {e}"

if __name__ == "__main__":
    # Example usage
    tool = TavilySearchTool(query="Latest advancements in AI technology")
    print(tool.run()) 