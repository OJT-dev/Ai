from typing import Dict, Any, List
from ..base_agent import BaseAgent

class HealthAgent(BaseAgent):
    def __init__(self):
        expertise = [
            "Physical health monitoring and recommendations",
            "Mental wellness and stress management",
            "Exercise and fitness planning",
            "Nutrition and diet advice",
            "Sleep optimization",
            "Health goal setting and tracking",
            "Wellness routine development",
            "Medical information interpretation",
            "Preventive health measures",
            "Work-life balance optimization"
        ]
        
        super().__init__(
            name="health_agent",
            description="Specialized agent for health and wellness management",
            expertise=expertise
        )

    def _get_system_prompt(self) -> str:
        return """
        You are a specialized health and wellness AI agent. Your role is to provide evidence-based health advice 
        and support while maintaining appropriate boundaries. Always:

        1. Emphasize that you're providing general guidance, not medical advice
        2. Recommend consulting healthcare professionals for specific medical concerns
        3. Focus on holistic wellness incorporating physical, mental, and emotional health
        4. Provide practical, actionable recommendations
        5. Consider the user's context and limitations
        6. Promote sustainable health habits over quick fixes
        7. Use positive, encouraging language
        8. Back recommendations with scientific evidence when possible
        9. Respect privacy and maintain confidentiality
        10. Know your limitations and defer to medical professionals when appropriate

        Areas of focus:
        - Physical health and fitness
        - Mental wellness
        - Nutrition and diet
        - Sleep optimization
        - Stress management
        - Work-life balance
        - Preventive health measures
        - Wellness routine development
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

            # Add health-specific context processing
            health_context = self._extract_health_context(message)
            context.update(health_context)

            # Process with base implementation
            response = await super().process_request({
                'message': message,
                'context': context
            })

            # Add health-specific metadata
            response['metadata'].update({
                'health_focus_areas': self._identify_health_areas(message),
                'wellness_recommendations': self._generate_wellness_recommendations(message)
            })

            return response

        except Exception as e:
            return await self.handle_error(e)

    def _extract_health_context(self, message: str) -> Dict[str, Any]:
        """Extract health-related context from the message."""
        context = {
            'physical_activity_mentioned': any(word in message.lower() for word in ['exercise', 'workout', 'fitness', 'training']),
            'nutrition_mentioned': any(word in message.lower() for word in ['food', 'diet', 'nutrition', 'eating']),
            'mental_health_mentioned': any(word in message.lower() for word in ['stress', 'anxiety', 'mental', 'mood']),
            'sleep_mentioned': any(word in message.lower() for word in ['sleep', 'rest', 'tired', 'fatigue']),
        }
        return {'health_context': context}

    def _identify_health_areas(self, message: str) -> List[str]:
        """Identify relevant health areas from the message."""
        health_areas = []
        keywords = {
            'physical_fitness': ['exercise', 'workout', 'fitness', 'strength', 'cardio'],
            'nutrition': ['diet', 'food', 'eating', 'nutrition', 'meal'],
            'mental_wellness': ['stress', 'anxiety', 'mental', 'mood', 'meditation'],
            'sleep': ['sleep', 'rest', 'tired', 'fatigue', 'insomnia'],
            'preventive_health': ['prevention', 'checkup', 'routine', 'habits'],
        }

        for area, words in keywords.items():
            if any(word in message.lower() for word in words):
                health_areas.append(area)

        return health_areas

    def _generate_wellness_recommendations(self, message: str) -> List[str]:
        """Generate relevant wellness recommendations based on the message."""
        recommendations = []
        health_areas = self._identify_health_areas(message)

        recommendation_map = {
            'physical_fitness': [
                "Schedule regular exercise sessions",
                "Mix cardio and strength training",
                "Start with achievable fitness goals"
            ],
            'nutrition': [
                "Focus on whole, unprocessed foods",
                "Stay hydrated throughout the day",
                "Practice mindful eating"
            ],
            'mental_wellness': [
                "Practice daily meditation or mindfulness",
                "Maintain a gratitude journal",
                "Take regular breaks during work"
            ],
            'sleep': [
                "Maintain a consistent sleep schedule",
                "Create a relaxing bedtime routine",
                "Optimize your sleep environment"
            ],
            'preventive_health': [
                "Schedule regular health check-ups",
                "Stay up to date with vaccinations",
                "Practice good hygiene habits"
            ]
        }

        for area in health_areas:
            if area in recommendation_map:
                recommendations.extend(recommendation_map[area])

        return recommendations[:3]  # Return top 3 most relevant recommendations
