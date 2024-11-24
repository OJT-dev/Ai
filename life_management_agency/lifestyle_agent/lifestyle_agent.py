from typing import Dict, Any, List
from ..base_agent import BaseAgent

class LifestyleAgent(BaseAgent):
    def __init__(self):
        expertise = [
            "Daily routine optimization",
            "Habit formation and tracking",
            "Time management",
            "Productivity enhancement",
            "Work-life balance",
            "Goal setting and achievement",
            "Personal organization",
            "Lifestyle design",
            "Energy management",
            "Environmental optimization"
        ]
        
        super().__init__(
            name="lifestyle_agent",
            description="Specialized agent for lifestyle optimization and habit management",
            expertise=expertise
        )

    def _get_system_prompt(self) -> str:
        return """
        You are a specialized lifestyle and habit management AI agent. Your role is to help users 
        optimize their daily routines and develop positive habits. Always:

        1. Consider the user's current lifestyle and constraints
        2. Recommend sustainable changes and improvements
        3. Focus on habit formation and behavior change
        4. Promote work-life balance
        5. Suggest practical time management strategies
        6. Help set and track meaningful goals
        7. Consider energy management throughout the day
        8. Integrate with health and knowledge recommendations
        9. Encourage environmental optimization
        10. Support personal growth and development

        Areas of focus:
        - Daily routine optimization
        - Habit formation and tracking
        - Time management
        - Work-life balance
        - Goal setting and achievement
        - Personal organization
        - Energy management
        - Environmental design
        - Productivity enhancement
        - Lifestyle design
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

            # Add lifestyle-specific context processing
            lifestyle_context = self._extract_lifestyle_context(message)
            context.update(lifestyle_context)

            # Process with base implementation
            response = await super().process_request({
                'message': message,
                'context': context
            })

            # Add lifestyle-specific metadata
            response['metadata'].update({
                'lifestyle_areas': self._identify_lifestyle_areas(message),
                'habit_recommendations': self._generate_habit_recommendations(message),
                'routine_optimizations': self._suggest_routine_optimizations(message)
            })

            return response

        except Exception as e:
            return await self.handle_error(e)

    def _extract_lifestyle_context(self, message: str) -> Dict[str, Any]:
        """Extract lifestyle-related context from the message."""
        context = {
            'routine_related': any(word in message.lower() for word in ['routine', 'schedule', 'daily', 'habit']),
            'productivity_related': any(word in message.lower() for word in ['productivity', 'efficient', 'focus', 'work']),
            'balance_related': any(word in message.lower() for word in ['balance', 'stress', 'overwhelm', 'time']),
            'environment_related': any(word in message.lower() for word in ['environment', 'space', 'organize', 'setup']),
        }
        return {'lifestyle_context': context}

    def _identify_lifestyle_areas(self, message: str) -> List[str]:
        """Identify relevant lifestyle areas from the message."""
        lifestyle_areas = []
        keywords = {
            'routine': ['routine', 'schedule', 'daily', 'habit'],
            'productivity': ['productivity', 'efficient', 'focus', 'work'],
            'balance': ['balance', 'stress', 'overwhelm', 'time'],
            'environment': ['environment', 'space', 'organize', 'setup'],
            'goals': ['goal', 'achieve', 'target', 'objective']
        }

        for area, words in keywords.items():
            if any(word in message.lower() for word in words):
                lifestyle_areas.append(area)

        return lifestyle_areas

    def _generate_habit_recommendations(self, message: str) -> List[str]:
        """Generate relevant habit recommendations based on the message."""
        recommendations = []
        lifestyle_areas = self._identify_lifestyle_areas(message)

        recommendation_map = {
            'routine': [
                "Start with a morning routine",
                "Create evening wind-down habits",
                "Build consistency with daily rituals"
            ],
            'productivity': [
                "Use time-blocking technique",
                "Implement the 2-minute rule",
                "Practice regular breaks (Pomodoro)"
            ],
            'balance': [
                "Set work-life boundaries",
                "Schedule regular downtime",
                "Practice stress-relief activities"
            ],
            'environment': [
                "Organize workspace daily",
                "Create dedicated activity zones",
                "Minimize digital distractions"
            ],
            'goals': [
                "Set SMART goals",
                "Track progress daily",
                "Celebrate small wins"
            ]
        }

        for area in lifestyle_areas:
            if area in recommendation_map:
                recommendations.extend(recommendation_map[area])

        return recommendations[:3]  # Return top 3 most relevant recommendations

    def _suggest_routine_optimizations(self, message: str) -> List[Dict[str, Any]]:
        """Suggest optimizations for daily routines."""
        optimizations = []
        lifestyle_areas = self._identify_lifestyle_areas(message)

        optimization_templates = {
            'routine': {
                'time': 'morning',
                'activity': 'Plan your day',
                'duration': '10 minutes',
                'benefit': 'Increased clarity and focus'
            },
            'productivity': {
                'time': 'throughout day',
                'activity': 'Regular breaks',
                'duration': '5 minutes per hour',
                'benefit': 'Maintained energy and focus'
            },
            'balance': {
                'time': 'evening',
                'activity': 'Digital sunset',
                'duration': '1 hour before bed',
                'benefit': 'Better sleep and recovery'
            },
            'environment': {
                'time': 'start/end of day',
                'activity': '5-minute cleanup',
                'duration': '5 minutes',
                'benefit': 'Organized space and clear mind'
            }
        }

        for area in lifestyle_areas:
            if area in optimization_templates:
                optimizations.append(optimization_templates[area])

        return optimizations
