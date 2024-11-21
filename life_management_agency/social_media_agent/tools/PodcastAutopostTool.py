import requests
import json
from datetime import datetime, timedelta
import os
import openai

class PodcastAutopostTool:
    def __init__(self):
        self.api_key = os.getenv("ACAST_API_KEY")
        self.show_id = os.getenv("SHOW_ID")
        self.base_url = "https://open.acast.com/rest/shows/"
        self.auth = {
            'x-api-key': self.api_key,
            'username': os.getenv("ACAST_USERNAME"),
            'password': os.getenv("ACAST_PASSWORD")
        }

    def get_latest_episode(self):
        """Fetch the latest podcast episode details"""
        url = f"{self.base_url}{self.show_id}/episodes"
        response = requests.get(url, headers=self.auth)
        if response.status_code == 200:
            episodes = response.json()
            if episodes:
                return episodes[0]  # Latest episode
        return None

    def schedule_social_posts(self, episode_data):
        """Schedule 5 social media posts throughout the day"""
        title = episode_data.get('title')
        summary = episode_data.get('summary')
        episode_number = episode_data.get('episodeNumber')
        publish_date = datetime.fromisoformat(episode_data.get('publishDate'))
        
        # Generate post times throughout the day
        post_times = [
            publish_date + timedelta(hours=i*3) for i in range(5)
        ]

        posts = []
        for i, post_time in enumerate(post_times):
            # Generate unique content for each post
            content = self._generate_post_content(
                title, summary, episode_number, i+1
            )
            
            post = {
                'content': content,
                'scheduledTime': post_time.isoformat(),
                'episodeId': episode_data.get('id')
            }
            posts.append(post)
            
            # Schedule post using social media API
            self._schedule_post(post)
        
        return posts

    def _generate_post_content(self, title, summary, episode_number, post_number):
        """Generate unique content for each post using OpenAI"""
        prompts = {
            1: f"Announce new episode #{episode_number}: {title}",
            2: f"Share key insight from episode #{episode_number}",
            3: f"Ask engaging question about episode #{episode_number}",
            4: f"Share quote from episode #{episode_number}",
            5: f"Final call to listen to episode #{episode_number}"
        }

        prompt = f"""Create a social media post for a podcast episode:
        Title: {title}
        Summary: {summary}
        Post type: {prompts[post_number]}
        Make it engaging and conversational."""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100,
            temperature=0.7
        )

        return response.choices[0].message.content

    def _schedule_post(self, post_data):
        """Schedule post using social media platform API"""
        # Implementation would vary based on social media platform
        # This is a placeholder for the actual API call
        url = "https://api.socialmedia.com/schedule"
        headers = {
            "Authorization": f"Bearer {os.getenv('SOCIAL_MEDIA_TOKEN')}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(url, json=post_data, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error scheduling post: {e}")
            return None

    def generate_original_content(self, topic=None):
        """Generate original content ideas for social media"""
        if not topic:
            # Generate random topic if none provided
            topics = [
                "podcast industry trends",
                "behind the scenes",
                "listener questions",
                "podcast tips",
                "community highlights"
            ]
            import random
            topic = random.choice(topics)

        prompt = f"""Generate an engaging social media post about {topic}.
        Make it informative yet conversational.
        Include relevant hashtags."""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.8
        )

        return {
            'content': response.choices[0].message.content,
            'topic': topic,
            'generated_at': datetime.now().isoformat()
        }
