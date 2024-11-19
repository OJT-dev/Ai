from agency_swarm.tools import BaseTool
from pydantic import Field
from typing import List, Dict

class AgentCoordinationTool(BaseTool):
    """
    Tool for analyzing user requests and determining which specialized agents should handle them.
    Implements advanced decision-making for agent selection and coordination.
    """
    message: str = Field(
        ..., 
        description="The user message to analyze"
    )

    def _analyze_domain_relevance(self, message: str) -> Dict[str, float]:
        """
        Analyzes message to determine relevance score for each domain.
        Returns dict of domain -> relevance score (0-1).
        """
        message_lower = message.lower()
        domain_keywords = {
            'knowledge': ['learn', 'know', 'understand', 'research', 'information', 'study', 'education', 'skill'],
            'health': ['health', 'exercise', 'diet', 'medical', 'wellness', 'fitness', 'sleep', 'wake', 'energy', 'tired', 'nutrition'],
            'lifestyle': ['schedule', 'routine', 'lifestyle', 'habit', 'daily', 'time', 'work', 'balance', 'organize'],
            'social': ['social', 'media', 'network', 'online', 'digital', 'internet', 'platform', 'connect'],
            'personal': ['goal', 'personal', 'development', 'improve', 'growth', 'career', 'productivity', 'motivation'],
            'family': ['family', 'relationship', 'relative', 'partner', 'child', 'parent', 'marriage', 'friend']
        }

        # Calculate relevance scores
        scores = {}
        for domain, keywords in domain_keywords.items():
            # Count keyword matches
            matches = sum(1 for keyword in keywords if keyword in message_lower)
            # Calculate score (0-1) based on matches and keyword list length
            scores[domain] = min(1.0, matches / (len(keywords) * 0.5))  # 50% threshold for max relevance

        return scores

    def _identify_interdependencies(self, relevant_domains: List[str]) -> List[str]:
        """
        Identifies additional domains that should be included based on interdependencies.
        """
        dependencies = {
            'health': ['lifestyle'],  # Health often requires lifestyle changes
            'personal': ['knowledge', 'lifestyle'],  # Personal development needs knowledge and lifestyle adaptation
            'family': ['lifestyle', 'personal'],  # Family matters often involve personal growth and lifestyle changes
            'lifestyle': ['health'],  # Lifestyle changes often impact health
            'social': ['personal']  # Social media management requires personal development
        }

        additional_domains = set()
        for domain in relevant_domains:
            if domain in dependencies:
                additional_domains.update(dependencies[domain])

        return list(additional_domains)

    def run(self) -> Dict[str, List[str]]:
        """
        Analyzes the message and returns list of required agents using advanced decision-making.
        Considers domain relevance scores and interdependencies.
        """
        # Get relevance scores for each domain
        relevance_scores = self._analyze_domain_relevance(self.message)

        # Select primary domains with significant relevance (threshold: 0.3)
        primary_domains = [domain for domain, score in relevance_scores.items() if score > 0.3]

        # If no domains meet the threshold, select the top 2 most relevant domains
        if not primary_domains:
            sorted_domains = sorted(relevance_scores.items(), key=lambda x: x[1], reverse=True)
            primary_domains = [domain for domain, _ in sorted_domains[:2]]

        # Add interdependent domains
        additional_domains = self._identify_interdependencies(primary_domains)
        
        # Combine and deduplicate domains
        required_agents = list(set(primary_domains + additional_domains))

        # Always ensure knowledge agent is included for information synthesis
        if 'knowledge' not in required_agents:
            required_agents.append('knowledge')

        return {
            "required_agents": required_agents,
            "metadata": {
                "relevance_scores": relevance_scores,
                "primary_domains": primary_domains,
                "added_dependencies": additional_domains
            }
        }

if __name__ == "__main__":
    tool = AgentCoordinationTool(message="I want to improve my health and family relationships")
    print(tool.run())
