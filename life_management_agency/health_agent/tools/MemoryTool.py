from agency_swarm.tools import BaseTool
from pydantic import Field
import json
import os
from datetime import datetime

class MemoryTool(BaseTool):
    """
    A tool for storing and retrieving fitness activities and progress data.
    This tool helps maintain a persistent memory of user's fitness journey.
    """

    action: str = Field(
        ..., 
        description="Action to perform: 'store' or 'retrieve'"
    )
    
    activity_type: str = Field(
        ..., 
        description="Type of activity (e.g., 'yoga', 'running', etc.)"
    )
    
    duration: int = Field(
        None, 
        description="Duration of activity in minutes"
    )
    
    def run(self):
        """
        Stores or retrieves fitness activities from the memory storage.
        """
        memory_file = "fitness_memory.json"
        os.makedirs("memory", exist_ok=True)
        memory_path = os.path.join("memory", memory_file)
        
        if self.action == "store":
            # Create memory entry
            entry = {
                "timestamp": datetime.now().isoformat(),
                "activity_type": self.activity_type,
                "duration": self.duration
            }
            
            # Read existing memories
            memories = []
            if os.path.exists(memory_path):
                try:
                    with open(memory_path, "r") as f:
                        memories = json.load(f)
                except json.JSONDecodeError:
                    memories = []
            
            # Add new memory
            memories.append(entry)
            
            # Save updated memories
            with open(memory_path, "w") as f:
                json.dump(memories, f, indent=2)
            
            return f"Stored activity: {self.activity_type} for {self.duration} minutes"
            
        elif self.action == "retrieve":
            if not os.path.exists(memory_path):
                return "No fitness activities recorded yet."
                
            with open(memory_path, "r") as f:
                try:
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
                    
                except json.JSONDecodeError:
                    return "Error reading fitness memory."
        
        return "Invalid action specified. Use 'store' or 'retrieve'."

if __name__ == "__main__":
    # Example usage - storing activity
    store_tool = MemoryTool(action="store", activity_type="yoga", duration=45)
    print(store_tool.run())
    
    # Example usage - retrieving activities
    retrieve_tool = MemoryTool(action="retrieve", activity_type="all", duration=None)
    print(retrieve_tool.run())
