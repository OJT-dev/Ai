from life_management_agency.base_agent import BaseAgent
from life_management_agency.tools.SimpleCommunicationTool import SimpleCommunicationTool
from .tools import PodcastAutopostTool

class SocialMediaAgent(BaseAgent):
    def __init__(self):
        expertise = [
            "Social media management",
            "Content strategy",
            "Digital marketing",
            "Online engagement",
            "Brand management",
            "Community building",
            "Content creation",
            "Social analytics",
            "Trend analysis",
            "Audience engagement"
        ]
        
        super().__init__(
            name="Social Media Agent",
            description="Manages social media interactions and content strategy.",
            expertise=expertise
        )
        self.podcast_tool = PodcastAutopostTool()

    async def process_request(self, request: dict) -> dict:
        try:
            message = request.get('message', '')
            context = request.get('context', {})
            
            # Process the request using the base agent's functionality
            response = await super().process_request(request)
            
            # Add social media specific processing if needed
            if 'podcast' in message.lower():
                episode_info = self.handle_new_episode()
                if episode_info['status'] == 'success':
                    response['message'] += f"\n\nI've also prepared social media posts for the latest podcast episode: {episode_info['episode']['title']}"
            
            return response
        except Exception as e:
            return await self.handle_error(e)

    def handle_new_episode(self):
        """Handle new podcast episode posting"""
        # Get latest episode
        episode = self.podcast_tool.get_latest_episode()
        if not episode:
            return {"status": "error", "message": "No episode found"}

        # Schedule 5 posts throughout the day
        posts = self.podcast_tool.schedule_social_posts(episode)
        
        return {
            "status": "success",
            "episode": episode,
            "scheduled_posts": posts
        }

    def generate_content(self, topic=None):
        """Generate original content"""
        content = self.podcast_tool.generate_original_content(topic)
        return content
