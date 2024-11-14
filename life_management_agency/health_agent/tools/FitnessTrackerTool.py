from agency_swarm.tools import BaseTool
from pydantic import Field
import json

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
        # For simplicity, we'll store data in a JSON file
        data = {
            "activity": self.activity,
            "duration_minutes": self.duration_minutes
        }

        # Append the record to a fitness_log.json file
        try:
            with open("fitness_log.json", "a") as f:
                json.dump(data, f)
                f.write("\n")
            return f"Recorded activity: {self.activity} for {self.duration_minutes} minutes."
        except Exception as e:
            return f"An error occurred while recording the activity: {e}"

if __name__ == "__main__":
    # Example usage
    tool = FitnessTrackerTool(activity="Running", duration_minutes=30)
    print(tool.run()) 