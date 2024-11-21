import json
import argparse
import os
from datetime import datetime
from agency_swarm import Agent
from life_management_agency.health_agent.tools.FitnessTrackerTool import FitnessTrackerTool
from life_management_agency.health_agent.tools.MemoryTool import MemoryTool
from life_management_agency.tools.SimpleCommunicationTool import SimpleCommunicationTool

class HealthAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Health Agent",
            description="Provides health-related advice, fitness tracking, and wellness monitoring.",
            instructions="./instructions.md",
            tools=[
                FitnessTrackerTool,
                MemoryTool,
                SimpleCommunicationTool
            ],
            temperature=0.3,
            max_prompt_tokens=25000,
            model="gpt-4o-mini"  # Using gpt-4o-mini for specific health-related tasks
        )
        self.fitness_tool = FitnessTrackerTool()
        self.memory_tool = MemoryTool()
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "health")
        os.makedirs(self.data_dir, exist_ok=True)
        self.user_data_file = os.path.join(self.data_dir, "user_data.json")
        self.load_user_data()

    def load_user_data(self):
        """Load user data from file"""
        try:
            if os.path.exists(self.user_data_file):
                with open(self.user_data_file, 'r') as f:
                    self.user_data = json.load(f)
            else:
                self.user_data = None
        except Exception as e:
            print(f"Error loading user data: {e}")
            self.user_data = None

    def save_user_data(self):
        """Save user data to file"""
        try:
            with open(self.user_data_file, 'w') as f:
                json.dump(self.user_data, f, indent=2)
        except Exception as e:
            print(f"Error saving user data: {e}")

    def setup(self, data):
        """Handle initial user setup"""
        try:
            self.user_data = {
                "goals": {
                    "dailySteps": data["dailyStepGoal"],
                    "sleep": data["sleepGoal"],
                    "mindfulness": data["mindfulnessGoal"]
                },
                "current": {
                    "steps": data.get("currentSteps", 0),
                    "sleep": data.get("currentSleep", 0),
                    "mindfulness": data.get("currentMindfulness", 0)
                },
                "lastUpdated": datetime.now().isoformat()
            }
            self.save_user_data()
            return json.dumps({
                "message": "Setup completed successfully",
                "data": self.user_data
            })
        except Exception as e:
            return json.dumps({
                "error": f"Failed to setup: {str(e)}"
            })

    def get_metrics(self):
        """Get health metrics"""
        try:
            if not self.user_data:
                return json.dumps({
                    "error": "No user data found. Please complete setup first."
                })

            metrics = {
                "fitness": {
                    "steps": self.user_data["current"]["steps"],
                    "activeMinutes": 45,  # Default value
                    "heartRate": 72,  # Default value
                    "sleepHours": self.user_data["current"]["sleep"]
                },
                "cognitive": {
                    "focusScore": 85,  # Default value
                    "stressLevel": 3,  # Default value
                    "mindfulnessMinutes": self.user_data["current"]["mindfulness"]
                },
                "recommendations": self.get_health_recommendations(),
                "dailyGoals": self.get_daily_health_goals()
            }

            return json.dumps(metrics)
        except Exception as e:
            return json.dumps({
                "error": f"Failed to get metrics: {str(e)}"
            })

    def get_health_recommendations(self):
        """Get personalized health recommendations"""
        if not self.user_data:
            return []

        recommendations = []
        
        # Check steps progress
        current_steps = self.user_data["current"]["steps"]
        step_goal = self.user_data["goals"]["dailySteps"]
        if current_steps < step_goal:
            steps_needed = step_goal - current_steps
            recommendations.append({
                "type": "exercise",
                "title": "Complete Your Step Goal",
                "description": f"Take a walk to reach your remaining {steps_needed} steps for today",
                "priority": 1
            })

        # Check mindfulness progress
        current_mindfulness = self.user_data["current"]["mindfulness"]
        mindfulness_goal = self.user_data["goals"]["mindfulness"]
        if current_mindfulness < mindfulness_goal:
            minutes_needed = mindfulness_goal - current_mindfulness
            recommendations.append({
                "type": "mindfulness",
                "title": "Mindfulness Session",
                "description": f"Take {minutes_needed} minutes for meditation or mindful breathing",
                "priority": 2
            })

        return recommendations

    def get_daily_health_goals(self):
        """Get daily health goals"""
        if not self.user_data:
            return []

        return [
            {
                "type": "steps",
                "target": self.user_data["goals"]["dailySteps"],
                "current": self.user_data["current"]["steps"],
                "unit": "steps"
            },
            {
                "type": "sleep",
                "target": self.user_data["goals"]["sleep"],
                "current": self.user_data["current"]["sleep"],
                "unit": "hours"
            },
            {
                "type": "mindfulness",
                "target": self.user_data["goals"]["mindfulness"],
                "current": self.user_data["current"]["mindfulness"],
                "unit": "minutes"
            }
        ]

def main():
    parser = argparse.ArgumentParser(description='Health Agent CLI')
    parser.add_argument('--action', type=str, required=True, help='Action to perform')
    parser.add_argument('--data', type=str, help='JSON data for the action')
    args = parser.parse_args()

    agent = HealthAgent()

    if args.action == 'get_metrics':
        print(agent.get_metrics())
    elif args.action == 'setup':
        if not args.data:
            print(json.dumps({"error": "Setup requires data parameter"}))
        else:
            try:
                data = json.loads(args.data)
                print(agent.setup(data))
            except json.JSONDecodeError:
                print(json.dumps({"error": "Invalid JSON data"}))
    else:
        print(json.dumps({
            "error": f"Unknown action: {args.action}"
        }))

if __name__ == "__main__":
    main()
