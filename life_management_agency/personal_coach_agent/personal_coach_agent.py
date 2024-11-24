from typing import Dict, Any, List
from ..base_agent import BaseAgent

class PersonalCoachAgent(BaseAgent):
    def __init__(self):
        expertise = [
            "Personal development planning",
            "Goal setting and achievement",
            "Motivation and accountability",
            "Behavior change strategies",
            "Decision making support",
            "Progress tracking",
            "Emotional intelligence",
            "Career development",
            "Life purpose and values",
            "Personal growth challenges"
        ]
        
        super().__init__(
            name="personal_coach_agent",
            description="Specialized agent for personal development and coaching support",
            expertise=expertise
        )

    def _get_system_prompt(self) -> str:
        return """
        You are a specialized personal development coach AI agent. Your role is to help users 
        achieve their personal goals and foster continuous growth. Always:

        1. Use a supportive and encouraging tone
        2. Ask thought-provoking questions
        3. Help users develop clear action plans
        4. Provide accountability and motivation
        5. Focus on sustainable personal growth
        6. Consider the whole person (mind, body, spirit)
        7. Help identify limiting beliefs and obstacles
        8. Celebrate progress and achievements
        9. Encourage self-reflection
        10. Connect insights from other agents into cohesive guidance

        Areas of focus:
        - Personal development planning
        - Goal setting and achievement
        - Motivation and accountability
        - Behavior change
        - Decision making
        - Progress tracking
        - Emotional intelligence
        - Career development
        - Life purpose and values
        - Personal challenges
        """

    async def process_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        try:
            # Validate and preprocess request
            if not await self.validate_request(request):
                return {
                    'message': "Invalid request format. Please provide a message.",
                    'metadata': {'error': 'Invalid request'}
                }

            request = await self.preprocess_request(request)
            message = request['message']
            context = request.get('context', {})

            # Add coaching-specific context processing
            coaching_context = self._extract_coaching_context(message)
            context.update(coaching_context)

            # Process with base implementation
            response = await super().process_request({
                'message': message,
                'context': context
            })

            # Add coaching-specific metadata
            response['metadata'].update({
                'coaching_areas': self._identify_coaching_areas(message),
                'action_steps': self._generate_action_steps(message),
                'growth_opportunities': self._identify_growth_opportunities(message),
                'reflection_prompts': self._generate_reflection_prompts(message)
            })

            return response

        except Exception as e:
            return await self.handle_error(e)

    def _extract_coaching_context(self, message: str) -> Dict[str, Any]:
        """Extract coaching-related context from the message."""
        context = {
            'goals_mentioned': any(word in message.lower() for word in ['goal', 'achieve', 'want to', 'plan']),
            'challenges_mentioned': any(word in message.lower() for word in ['challenge', 'difficult', 'struggle', 'problem']),
            'growth_mentioned': any(word in message.lower() for word in ['grow', 'improve', 'develop', 'learn']),
            'motivation_needed': any(word in message.lower() for word in ['motivation', 'stuck', 'help', 'support']),
        }
        return {'coaching_context': context}

    def _identify_coaching_areas(self, message: str) -> List[str]:
        """Identify relevant coaching areas from the message."""
        coaching_areas = []
        keywords = {
            'personal_development': ['growth', 'develop', 'improve', 'progress'],
            'goal_achievement': ['goal', 'achieve', 'accomplish', 'target'],
            'motivation': ['motivation', 'inspired', 'driven', 'energized'],
            'decision_making': ['decide', 'choice', 'option', 'path'],
            'career': ['career', 'work', 'professional', 'job']
        }

        for area, words in keywords.items():
            if any(word in message.lower() for word in words):
                coaching_areas.append(area)

        return coaching_areas

    def _generate_action_steps(self, message: str) -> List[Dict[str, Any]]:
        """Generate specific action steps based on the message."""
        action_steps = []
        coaching_areas = self._identify_coaching_areas(message)

        step_templates = {
            'personal_development': {
                'action': 'Create a personal development plan',
                'timeframe': 'This week',
                'outcome': 'Clear roadmap for growth'
            },
            'goal_achievement': {
                'action': 'Break down main goal into smaller milestones',
                'timeframe': 'Next 3 days',
                'outcome': 'Actionable goal framework'
            },
            'motivation': {
                'action': 'Identify and list your key motivators',
                'timeframe': 'Today',
                'outcome': 'Personal motivation toolkit'
            },
            'decision_making': {
                'action': 'Create a pros/cons analysis',
                'timeframe': 'Next 24 hours',
                'outcome': 'Clear decision framework'
            },
            'career': {
                'action': 'Update skills inventory',
                'timeframe': 'This week',
                'outcome': 'Career development baseline'
            }
        }

        for area in coaching_areas:
            if area in step_templates:
                action_steps.append(step_templates[area])

        return action_steps

    def _identify_growth_opportunities(self, message: str) -> List[str]:
        """Identify potential growth opportunities from the message."""
        opportunities = []
        coaching_areas = self._identify_coaching_areas(message)

        opportunity_map = {
            'personal_development': [
                "Develop new skills",
                "Expand comfort zone",
                "Build better habits"
            ],
            'goal_achievement': [
                "Improve goal-setting process",
                "Enhance accountability",
                "Strengthen follow-through"
            ],
            'motivation': [
                "Deepen self-understanding",
                "Build intrinsic motivation",
                "Create reward systems"
            ],
            'decision_making': [
                "Enhance analytical skills",
                "Trust intuition more",
                "Improve problem-solving"
            ],
            'career': [
                "Expand professional network",
                "Develop leadership skills",
                "Build personal brand"
            ]
        }

        for area in coaching_areas:
            if area in opportunity_map:
                opportunities.extend(opportunity_map[area])

        return opportunities[:3]  # Return top 3 most relevant opportunities

    def _generate_reflection_prompts(self, message: str) -> List[str]:
        """Generate relevant reflection prompts based on the message."""
        prompts = []
        coaching_areas = self._identify_coaching_areas(message)

        prompt_map = {
            'personal_development': [
                "What does success look like to you?",
                "What's holding you back from your goals?",
                "How do you measure personal growth?"
            ],
            'goal_achievement': [
                "Why is this goal important to you?",
                "What resources do you need to succeed?",
                "How will achieving this change your life?"
            ],
            'motivation': [
                "What energizes you most?",
                "When do you feel most confident?",
                "What are your core values?"
            ],
            'decision_making': [
                "What's the worst that could happen?",
                "What does your intuition tell you?",
                "What would you advise a friend?"
            ],
            'career': [
                "What impact do you want to make?",
                "What skills do you enjoy using most?",
                "Where do you see yourself in 5 years?"
            ]
        }

        for area in coaching_areas:
            if area in prompt_map:
                prompts.extend(prompt_map[area])

        return prompts[:2]  # Return top 2 most relevant prompts
