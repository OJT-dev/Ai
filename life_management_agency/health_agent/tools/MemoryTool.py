from agency_swarm.tools import BaseTool
from pydantic import Field
import json
import os
from datetime import datetime, timedelta

class MemoryTool(BaseTool):
    """
    A tool for storing and retrieving fitness activities and wellness metrics.
    This tool helps maintain a persistent memory of user's fitness journey.
    """

    action: str = Field(
        default="get_metrics", 
        description="Action to perform: 'store', 'retrieve', or 'get_metrics'"
    )
    
    activity_type: str = Field(
        default="", 
        description="Type of activity (e.g., 'yoga', 'running', etc.)"
    )
    
    duration: int = Field(
        default=None, 
        description="Duration of activity in minutes"
    )
    
    def run(self):
        """
        Stores or retrieves fitness activities from the memory storage.
        """
        if self.action == "get_metrics":
            return self.get_wellness_metrics()

        # Use the same data directory as FitnessTrackerTool
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "health")
        os.makedirs(data_dir, exist_ok=True)
        
        memory_file = os.path.join(data_dir, "fitness_memory.json")
        
        # Create the file with empty array if it doesn't exist
        if not os.path.exists(memory_file):
            with open(memory_file, "w") as f:
                json.dump([], f)
        
        if self.action == "store":
            # Create memory entry
            entry = {
                "timestamp": datetime.now().isoformat(),
                "activity_type": self.activity_type,
                "duration": self.duration
            }
            
            # Read existing memories
            try:
                with open(memory_file, "r") as f:
                    memories = json.load(f)
            except json.JSONDecodeError:
                memories = []
            
            # Add new memory
            memories.append(entry)
            
            # Save updated memories
            try:
                with open(memory_file, "w") as f:
                    json.dump(memories, f, indent=2)
                return f"Successfully stored activity: {self.activity_type} for {self.duration} minutes"
            except Exception as e:
                return f"Error storing activity: {str(e)}"
            
        elif self.action == "retrieve":
            try:
                with open(memory_file, "r") as f:
                    memories = json.load(f)
                    
                    # Filter memories by activity type if specified
                    if self.activity_type != "all":
                        memories = [m for m in memories if m["activity_type"] == self.activity_type]
                    
                    if not memories:
                        return f"No {self.activity_type} activities found."
                    
                    # Format the activities for display
                    activities = []
                    for m in memories:
                        activity = f"{m['activity_type']} for {m['duration']} minutes on {m['timestamp'][:10]}"
                        activities.append(activity)
                    
                    return "\n".join(activities)
            except Exception as e:
                return f"Error retrieving activities: {str(e)}"
        
        return "Invalid action specified. Use 'store', 'retrieve', or 'get_metrics'."

    def get_wellness_metrics(self):
        """Get cognitive wellness metrics"""
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "health")
        memory_file = os.path.join(data_dir, "fitness_memory.json")

        # Initialize default metrics
        metrics = {
            "focusScore": 85,
            "stressLevel": 3,
            "mindfulnessMinutes": 0
        }

        # If memory file exists, calculate mindfulness minutes from recorded activities
        if os.path.exists(memory_file):
            try:
                with open(memory_file, "r") as f:
                    memories = json.load(f)
                
                # Calculate mindfulness minutes from today's activities
                today = datetime.now().date()
                mindfulness_activities = [
                    m for m in memories
                    if (m["activity_type"] in ["meditation", "yoga", "mindfulness"] and
                        datetime.fromisoformat(m["timestamp"]).date() == today)
                ]
                
                metrics["mindfulnessMinutes"] = sum(
                    m["duration"] for m in mindfulness_activities
                )
            except (json.JSONDecodeError, KeyError, ValueError):
                pass  # Use default values if there's an error

        return metrics

if __name__ == "__main__":
    # Example usage - getting wellness metrics
    metrics_tool = MemoryTool()
    print("Wellness metrics:", metrics_tool.run())
    
    # Example usage - storing activity
    store_tool = MemoryTool(action="store", activity_type="meditation", duration=15)
    print(store_tool.run())
    
    # Example usage - retrieving activities
    retrieve_tool = MemoryTool(action="retrieve", activity_type="all")
    print(retrieve_tool.run())
