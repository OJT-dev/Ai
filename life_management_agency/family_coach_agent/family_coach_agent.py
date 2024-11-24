from typing import Dict, Any, List
from ..base_agent import BaseAgent

class FamilyCoachAgent(BaseAgent):
    def __init__(self):
        expertise = [
            "Family relationship management",
            "Communication improvement",
            "Conflict resolution",
            "Parenting guidance",
            "Work-family balance",
            "Family activity planning",
            "Relationship building",
            "Family wellness",
            "Social connection",
            "Family tradition development"
        ]
        
        super().__init__(
            name="family_coach_agent",
            description="Specialized agent for family relationships and social connections",
            expertise=expertise
        )

    def _get_system_prompt(self) -> str:
        return """
        You are a specialized family and relationships AI agent. Your role is to help users 
        strengthen their family bonds and social connections. Always:

        1. Promote healthy communication patterns
        2. Suggest ways to strengthen relationships
        3. Provide conflict resolution strategies
        4. Support work-family balance
        5. Encourage quality time and activities
        6. Consider all family members' needs
        7. Respect family values and traditions
        8. Foster positive social connections
        9. Support parenting challenges
        10. Maintain appropriate boundaries in advice

        Areas of focus:
        - Family relationship management
        - Communication improvement
        - Conflict resolution
        - Parenting guidance
        - Work-family balance
        - Family activities
        - Relationship building
        - Family wellness
        - Social connections
        - Family traditions
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

            # Add family-specific context processing
            family_context = self._extract_family_context(message)
            context.update(family_context)

            # Process with base implementation
            response = await super().process_request({
                'message': message,
                'context': context
            })

            # Add family-specific metadata
            response['metadata'].update({
                'relationship_areas': self._identify_relationship_areas(message),
                'activity_suggestions': self._generate_activity_suggestions(message),
                'communication_tips': self._generate_communication_tips(message),
                'connection_opportunities': self._identify_connection_opportunities(message)
            })

            return response

        except Exception as e:
            return await self.handle_error(e)

    def _extract_family_context(self, message: str) -> Dict[str, Any]:
        """Extract family-related context from the message."""
        context = {
            'relationship_focus': any(word in message.lower() for word in ['family', 'relationship', 'partner', 'child']),
            'communication_focus': any(word in message.lower() for word in ['talk', 'communicate', 'discuss', 'share']),
            'conflict_focus': any(word in message.lower() for word in ['conflict', 'argue', 'disagree', 'problem']),
            'activity_focus': any(word in message.lower() for word in ['activity', 'time', 'together', 'plan']),
        }
        return {'family_context': context}

    def _identify_relationship_areas(self, message: str) -> List[str]:
        """Identify relevant relationship areas from the message."""
        relationship_areas = []
        keywords = {
            'family_bonds': ['family', 'bond', 'connection', 'together'],
            'communication': ['talk', 'communicate', 'express', 'share'],
            'parenting': ['child', 'parent', 'kid', 'raise'],
            'partnership': ['partner', 'spouse', 'relationship', 'marriage'],
            'social': ['friend', 'social', 'community', 'network']
        }

        for area, words in keywords.items():
            if any(word in message.lower() for word in words):
                relationship_areas.append(area)

        return relationship_areas

    def _generate_activity_suggestions(self, message: str) -> List[Dict[str, Any]]:
        """Generate family activity suggestions based on the message."""
        suggestions = []
        relationship_areas = self._identify_relationship_areas(message)

        activity_templates = {
            'family_bonds': {
                'activity': 'Family game night',
                'duration': '2 hours',
                'benefit': 'Strengthens family bonds through fun'
            },
            'communication': {
                'activity': 'Family dinner without devices',
                'duration': '1 hour',
                'benefit': 'Promotes open communication'
            },
            'parenting': {
                'activity': 'Parent-child project',
                'duration': 'Weekend',
                'benefit': 'Builds parent-child connection'
            },
            'partnership': {
                'activity': 'Weekly date night',
                'duration': '3 hours',
                'benefit': 'Nurtures romantic relationship'
            },
            'social': {
                'activity': 'Family and friends gathering',
                'duration': 'Afternoon',
                'benefit': 'Expands social connections'
            }
        }

        for area in relationship_areas:
            if area in activity_templates:
                suggestions.append(activity_templates[area])

        return suggestions

    def _generate_communication_tips(self, message: str) -> List[str]:
        """Generate relevant communication tips based on the message."""
        tips = []
        relationship_areas = self._identify_relationship_areas(message)

        tip_map = {
            'family_bonds': [
                "Practice active listening",
                "Share daily highlights",
                "Express appreciation regularly"
            ],
            'communication': [
                "Use 'I' statements",
                "Schedule regular check-ins",
                "Create safe space for sharing"
            ],
            'parenting': [
                "Get down to child's level",
                "Validate feelings first",
                "Make time for one-on-one talks"
            ],
            'partnership': [
                "Practice daily appreciation",
                "Schedule regular check-ins",
                "Share feelings openly"
            ],
            'social': [
                "Stay regularly connected",
                "Show genuine interest",
                "Make time for important people"
            ]
        }

        for area in relationship_areas:
            if area in tip_map:
                tips.extend(tip_map[area])

        return tips[:3]  # Return top 3 most relevant tips

    def _identify_connection_opportunities(self, message: str) -> List[Dict[str, Any]]:
        """Identify opportunities for strengthening connections."""
        opportunities = []
        relationship_areas = self._identify_relationship_areas(message)

        opportunity_templates = {
            'family_bonds': {
                'type': 'Regular family time',
                'frequency': 'Daily',
                'action': 'Create a family ritual'
            },
            'communication': {
                'type': 'Deep conversations',
                'frequency': 'Weekly',
                'action': 'Set aside dedicated time'
            },
            'parenting': {
                'type': 'One-on-one time',
                'frequency': 'Weekly per child',
                'action': 'Schedule special activities'
            },
            'partnership': {
                'type': 'Quality time',
                'frequency': 'Daily',
                'action': 'Create meaningful moments'
            },
            'social': {
                'type': 'Social gatherings',
                'frequency': 'Monthly',
                'action': 'Plan regular meetups'
            }
        }

        for area in relationship_areas:
            if area in opportunity_templates:
                opportunities.append(opportunity_templates[area])

        return opportunities
