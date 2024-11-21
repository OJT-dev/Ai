from agency_swarm.tools import BaseTool
from pydantic import Field
import json
import os
from datetime import datetime, timedelta

class FitnessTrackerTool(BaseTool):
    """
    A tool that tracks the user's fitness activities and goals.
    """

    activity: str = Field(
        default="", description="The fitness activity performed by the user (e.g., running, yoga)."
    )
    duration_minutes: int = Field(
        default=0, description="Duration of the activity in minutes."
    )

    def run(self):
        """
        Records the fitness activity and updates the user's progress.
        """
        if not self.activity or not self.duration_minutes:
            return self.get_metrics()

        # Create data directory if it doesn't exist
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "health")
        os.makedirs(data_dir, exist_ok=True)
        
        log_file = os.path.join(data_dir, "fitness_log.json")
        
        # Create the file with empty array if it doesn't exist
        if not os.path.exists(log_file):
            with open(log_file, "w") as f:
                json.dump([], f)

        # Read existing data
        try:
            with open(log_file, "r") as f:
                data = json.load(f)
        except json.JSONDecodeError:
            data = []

        # Add new activity
        new_activity = {
            "activity": self.activity,
            "duration_minutes": self.duration_minutes,
            "timestamp": datetime.now().isoformat()
        }
        data.append(new_activity)

        # Write updated data
        try:
            with open(log_file, "w") as f:
                json.dump(data, f, indent=2)
            return f"Successfully recorded activity: {self.activity} for {self.duration_minutes} minutes."
        except Exception as e:
            return f"An error occurred while recording the activity: {e}"

    def get_metrics(self):
        """Get current fitness metrics"""
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "health")
        log_file = os.path.join(data_dir, "fitness_log.json")

        # Initialize default metrics
        metrics = {
            "steps": 8432,  # Default value
            "activeMinutes": 0,
            "heartRate": 72,  # Default value
            "sleepHours": 7.5  # Default value
        }

        # If log file exists, calculate active minutes from recorded activities
        if os.path.exists(log_file):
            try:
                with open(log_file, "r") as f:
                    data = json.load(f)
                
                # Calculate active minutes from today's activities
                today = datetime.now().date()
                today_activities = [
                    activity for activity in data
                    if datetime.fromisoformat(activity["timestamp"]).date() == today
                ]
                
                metrics["activeMinutes"] = sum(
                    activity["duration_minutes"] for activity in today_activities
                )
            except (json.JSONDecodeError, KeyError, ValueError):
                pass  # Use default values if there's an error

        return metrics

    def get_step_count(self):
        """Get current step count"""
        return self.get_metrics()["steps"]

if __name__ == "__main__":
    # Example usage
    tool = FitnessTrackerTool()
    print("Current metrics:", tool.get_metrics())
    
    # Record an activity
    tool.activity = "Running"
    tool.duration_minutes = 30
    print(tool.run())
