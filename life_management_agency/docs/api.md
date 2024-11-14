# Life Management Agency - API Reference

## Core APIs

### Agency API

#### Initialize Agency
```python
from life_management_agency.agency import Agency

agency = Agency()
```

#### Properties
| Name | Type | Description |
|------|------|-------------|
| agents | Dict[str, Agent] | Registered agents |
| active_tasks | List[Task] | Currently running tasks |
| state | Dict[str, Any] | Global agency state |

#### Methods

```python
def register_agent(self, agent: Agent) -> bool:
    """
    Register a new agent with the agency.
    
    Args:
        agent: Agent instance to register
        
    Returns:
        bool: Success status
    """
```

```python
def process_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process incoming request and route to appropriate agent.
    
    Args:
        request: Request data dictionary
        
    Returns:
        Dict: Response from agent
    """
```

### Agent Base Class

```python
class BaseAgent:
    def __init__(self):
        self.name: str
        self.tools: Dict[str, BaseTool]
        self.state: Dict[str, Any]
```

#### Methods

```python
def process_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process agent-specific request.
    
    Args:
        request: Request data
        
    Returns:
        Dict: Processed response
    """
```

```python
def register_tool(self, tool: BaseTool) -> bool:
    """
    Register new tool with agent.
    
    Args:
        tool: Tool instance
        
    Returns:
        bool: Registration success
    """
```

### Tool Base Class

```python
class BaseTool:
    def __init__(self):
        self.name: str
        self.description: str
        self.parameters: Dict[str, Type]
```

#### Methods

```python
def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Execute tool functionality.
    
    Args:
        params: Tool parameters
        
    Returns:
        Dict: Tool execution results
    """
```

## Agent-Specific APIs

### Master Agent

```python
class MasterAgent(BaseAgent):
    def delegate_task(self, task: Task, target_agent: str) -> bool:
        """
        Delegate task to specific agent.
        
        Args:
            task: Task to delegate
            target_agent: Agent to receive task
            
        Returns:
            bool: Delegation success
        """
```

### Family Coach Agent

```python
class FamilyCoachAgent(BaseAgent):
    def analyze_relationship(self, members: List[str]) -> Dict[str, Any]:
        """
        Analyze family relationships.
        
        Args:
            members: List of family members
            
        Returns:
            Dict: Analysis results
        """
```

### Health Agent

```python
class HealthAgent(BaseAgent):
    def track_metrics(self, metrics: Dict[str, float]) -> Dict[str, Any]:
        """
        Track health metrics.
        
        Args:
            metrics: Health metrics to track
            
        Returns:
            Dict: Tracking results
        """
```

## Message Formats

### Request Format
```python
{
    "type": str,          # Request type
    "agent": str,         # Target agent
    "content": Dict,      # Request content
    "metadata": Dict      # Additional information
}
```

### Response Format
```python
{
    "status": str,        # Success/failure
    "data": Dict,         # Response data
    "error": str,         # Error message if any
    "metadata": Dict      # Additional information
}
```

## WebSocket API

### Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
```

### Events

#### Connect
```javascript
ws.onopen = () => {
    console.log('Connected to server');
};
```

#### Message
```javascript
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Handle message
};
```

#### Close
```javascript
ws.onclose = () => {
    console.log('Disconnected from server');
};
```

## HTTP REST API

### Endpoints

#### GET /api/agents
List all available agents

**Response**
```json
{
    "agents": [
        {
            "name": "string",
            "type": "string",
            "status": "string"
        }
    ]
}
```

#### POST /api/request
Send request to specific agent

**Request Body**
```json
{
    "agent": "string",
    "type": "string",
    "content": {}
}
```

**Response**
```json
{
    "status": "string",
    "data": {},
    "error": "string"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 1000 | General Error |
| 1001 | Invalid Request |
| 1002 | Agent Not Found |
| 1003 | Tool Error |
| 1004 | Authorization Error |

## Data Types

### Task
```python
class Task:
    id: str
    type: str
    status: str
    agent: str
    content: Dict[str, Any]
    metadata: Dict[str, Any]
```

### Tool Result
```python
class ToolResult:
    success: bool
    data: Dict[str, Any]
    error: Optional[str]
    metadata: Dict[str, Any]
```

## Integration Examples

### Python Client
```python
from life_management_agency.client import AgencyClient

client = AgencyClient()

# Send request
response = client.send_request({
    "agent": "family_coach",
    "type": "analyze",
    "content": {"members": ["John", "Jane"]}
})
```

### JavaScript Client
```javascript
class AgencyClient {
    constructor() {
        this.ws = new WebSocket('ws://localhost:8000/ws');
        this.setupHandlers();
    }
    
    sendRequest(request) {
        this.ws.send(JSON.stringify(request));
    }
}
```

## Authentication

### Token Format
```python
{
    "token_type": "Bearer",
    "access_token": str,
    "expires_in": int
}
```

### Authentication Flow
1. Client requests access token
2. Server validates credentials
3. Server issues token
4. Client includes token in requests

## Rate Limiting

- 100 requests per minute per client
- 1000 requests per hour per client
- Exponential backoff on exceeded limits

## Webhook Integration

### Register Webhook
```python
def register_webhook(url: str, events: List[str]) -> str:
    """
    Register webhook for specific events.
    
    Args:
        url: Webhook URL
        events: List of events to subscribe to
        
    Returns:
        str: Webhook ID
    """
```

### Webhook Payload
```json
{
    "event": "string",
    "timestamp": "string",
    "data": {}
}
```

## Testing

### Mock Client
```python
class MockAgencyClient:
    def send_request(self, request):
        # Simulate request/response
        pass
```

### Test Examples
```python
def test_agent_request():
    client = MockAgencyClient()
    response = client.send_request({
        "agent": "test",
        "type": "echo",
        "content": {"message": "test"}
    })
    assert response["status"] == "success"
```

This API reference provides a comprehensive overview of the system's interfaces. For implementation details, refer to:
- [Architecture Documentation](architecture.md)
- [Development Guide](development.md)
- [Agent Documentation](agents.md)
