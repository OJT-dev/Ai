from agency_swarm.tools import BaseTool
from pydantic import Field
import json
from datetime import datetime
import os

class FamilyRelationshipTool(BaseTool):
    """
    A tool for tracking and managing family relationships, interactions, and important events.
    This tool helps maintain family harmony by recording interactions, scheduling family time,
    and providing insights into family dynamics.
    """

    action_type: str = Field(
        ..., 
        description="Type of family action (e.g., 'interaction', 'event', 'conflict_resolution', 'quality_time')"
    )
    
    family_members: list = Field(
        ..., 
        description="List of family members involved in the interaction or event"
    )
    
    description: str = Field(
        ..., 
        description="Detailed description of the interaction, event, or situation"
    )
    
    def run(self):
        """
        Records and manages family interactions and events, providing insights and recommendations
        for maintaining healthy family relationships.
        """
        # Create a record with timestamp
        record = {
            "timestamp": datetime.now().isoformat(),
            "action_type": self.action_type,
            "family_members": self.family_members,
            "description": self.description
        }
        
        # Ensure the family_records directory exists
        os.makedirs("family_records", exist_ok=True)
        
        # Save the record to a JSON file
        try:
            file_path = "family_records/family_log.json"
            
            # Read existing records or create new list
            existing_records = []
            if os.path.exists(file_path):
                with open(file_path, "r") as f:
                    try:
                        existing_records = json.load(f)
                    except json.JSONDecodeError:
                        existing_records = []
            
            # Append new record
            existing_records.append(record)
            
            # Write updated records
            with open(file_path, "w") as f:
                json.dump(existing_records, f, indent=2)
            
            # Generate response based on action type
            responses = {
                "interaction": f"Recorded family interaction involving {', '.join(self.family_members)}",
                "event": f"Logged family event with {', '.join(self.family_members)}",
                "conflict_resolution": "Documented conflict resolution strategy and outcome",
                "quality_time": f"Recorded quality time activity with {', '.join(self.family_members)}"
            }
            
            return responses.get(self.action_type, "Successfully recorded family activity")
            
        except Exception as e:
            return f"An error occurred while recording family activity: {e}"

if __name__ == "__main__":
    # Example usage
    tool = FamilyRelationshipTool(
        action_type="quality_time",
        family_members=["Mom", "Dad", "Sister"],
        description="Family game night playing board games and sharing stories"
    )
    print(tool.run())
