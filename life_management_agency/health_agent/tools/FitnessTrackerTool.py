from agency_swarm.tools import BaseTool
from pydantic import Field
import json
import os

class FitnessTrackerTool(BaseTool):
    """
    A tool that tracks the user's fitness activities and goals.
    """

    activity: str = Field(
        ..., description="The fitness activity performed by the user (e.g., running, yoga)."
    )
    duration_minutes: int = Field(
        ..., description="Duration of the activity in minutes."
    )

    def run(self):
        """
        Records the fitness activity and updates the user's progress.
        """
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
            "duration_minutes": self.duration_minutes
        }
        data.append(new_activity)

        # Write updated data
        try:
            with open(log_file, "w") as f:
                json.dump(data, f, indent=2)
            return f"Successfully recorded activity: {self.activity} for {self.duration_minutes} minutes."
        except Exception as e:
            return f"An error occurred while recording the activity: {e}"

if __name__ == "__main__":
    # Example usage
    tool = FitnessTrackerTool(activity="Running", duration_minutes=30)
    print(tool.run())
