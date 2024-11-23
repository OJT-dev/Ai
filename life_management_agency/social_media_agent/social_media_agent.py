from agency_swarm import Agent
from tools.SimpleCommunicationTool import SimpleCommunicationTool
from .tools import PodcastAutopostTool

class SocialMediaAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Social Media Agent",
            description="Manages social media interactions and content strategy.",
            instructions="./instructions.md",
            tools=[
                SimpleCommunicationTool,
                PodcastAutopostTool
            ],
            temperature=0.7,
            max_prompt_tokens=25000,
            model="gpt-4"
        )
        self.podcast_tool = PodcastAutopostTool()

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
