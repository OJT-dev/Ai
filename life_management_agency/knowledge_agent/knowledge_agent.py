from typing import Dict, Any, List
from ..base_agent import BaseAgent

class KnowledgeAgent(BaseAgent):
    def __init__(self):
        expertise = [
            "Information research and analysis",
            "Learning strategy development",
            "Topic exploration and explanation",
            "Fact verification and sourcing",
            "Knowledge organization",
            "Study techniques and methods",
            "Critical thinking development",
            "Educational resource recommendations",
            "Knowledge synthesis and summarization",
            "Interdisciplinary connections"
        ]
        
        super().__init__(
            name="knowledge_agent",
            description="Specialized agent for knowledge acquisition and learning support",
            expertise=expertise
        )

    def _get_system_prompt(self) -> str:
        return """
        You are a specialized knowledge and learning AI agent. Your role is to help users acquire, 
        understand, and organize information effectively. Always:

        1. Provide accurate, well-researched information
        2. Explain complex topics in clear, understandable terms
        3. Cite sources when providing factual information
        4. Help develop effective learning strategies
        5. Encourage critical thinking and analysis
        6. Make connections between different areas of knowledge
        7. Suggest reliable resources for further learning
        8. Break down complex topics into manageable parts
        9. Adapt explanations to the user's level of understanding
        10. Promote active learning and engagement

        Areas of focus:
        - Research and information gathering
        - Learning strategy development
        - Critical thinking and analysis
        - Knowledge organization
        - Educational resource recommendations
        - Study techniques
        - Topic exploration and explanation
        - Interdisciplinary connections
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

            # Add knowledge-specific context processing
            knowledge_context = self._extract_knowledge_context(message)
            context.update(knowledge_context)

            # Process with base implementation
            response = await super().process_request({
                'message': message,
                'context': context
            })

            # Add knowledge-specific metadata
            response['metadata'].update({
                'knowledge_areas': self._identify_knowledge_areas(message),
                'learning_recommendations': self._generate_learning_recommendations(message),
                'research_topics': self._extract_research_topics(message)
            })

            return response

        except Exception as e:
            return await self.handle_error(e)

    def _extract_knowledge_context(self, message: str) -> Dict[str, Any]:
        """Extract knowledge-related context from the message."""
        context = {
            'research_needed': any(word in message.lower() for word in ['research', 'learn', 'study', 'understand']),
            'explanation_needed': any(word in message.lower() for word in ['explain', 'clarify', 'what is', 'how does']),
            'resource_request': any(word in message.lower() for word in ['resources', 'materials', 'books', 'courses']),
            'analysis_needed': any(word in message.lower() for word in ['analyze', 'evaluate', 'compare', 'assess']),
        }
        return {'knowledge_context': context}

    def _identify_knowledge_areas(self, message: str) -> List[str]:
        """Identify relevant knowledge areas from the message."""
        knowledge_areas = []
        keywords = {
            'research': ['research', 'study', 'investigate', 'explore'],
            'learning': ['learn', 'understand', 'comprehend', 'grasp'],
            'analysis': ['analyze', 'evaluate', 'assess', 'examine'],
            'resources': ['books', 'courses', 'materials', 'resources'],
            'methodology': ['method', 'technique', 'approach', 'strategy'],
        }

        for area, words in keywords.items():
            if any(word in message.lower() for word in words):
                knowledge_areas.append(area)

        return knowledge_areas

    def _generate_learning_recommendations(self, message: str) -> List[str]:
        """Generate relevant learning recommendations based on the message."""
        recommendations = []
        knowledge_areas = self._identify_knowledge_areas(message)

        recommendation_map = {
            'research': [
                "Use multiple reliable sources",
                "Take structured notes",
                "Create research questions"
            ],
            'learning': [
                "Break topics into smaller parts",
                "Use active recall techniques",
                "Create concept maps"
            ],
            'analysis': [
                "Compare different perspectives",
                "Look for patterns and connections",
                "Question assumptions"
            ],
            'resources': [
                "Consult academic databases",
                "Use educational platforms",
                "Find expert communities"
            ],
            'methodology': [
                "Develop a structured approach",
                "Set clear learning objectives",
                "Track progress regularly"
            ]
        }

        for area in knowledge_areas:
            if area in recommendation_map:
                recommendations.extend(recommendation_map[area])

        return recommendations[:3]  # Return top 3 most relevant recommendations

    def _extract_research_topics(self, message: str) -> List[str]:
        """Extract potential research topics from the message."""
        topics = []
        # Look for phrases that indicate topics of interest
        indicators = ['about', 'regarding', 'concerning', 'on the topic of', 'related to']
        
        message_lower = message.lower()
        for indicator in indicators:
            if indicator in message_lower:
                # Extract the phrase following the indicator
                index = message_lower.find(indicator) + len(indicator)
                phrase = message[index:].strip()
                # Take the first few words as the topic
                topic = ' '.join(phrase.split()[:3])
                if topic:
                    topics.append(topic)

        return list(set(topics))  # Remove duplicates
