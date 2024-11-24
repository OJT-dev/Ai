# Life Management Agency

A comprehensive AI-powered life management system with specialized agents working together through a coordinated agency architecture.

## Architecture

The system uses a multi-agent architecture where each agent specializes in different aspects of life management:

- **Master Agent**: Coordinates all other agents and manages conversation flow
- **Knowledge Agent**: Handles learning, research, and information processing
- **Health Agent**: Manages wellness, fitness, and health-related matters
- **Lifestyle Agent**: Optimizes daily routines, habits, and time management
- **Personal Coach Agent**: Guides personal growth and development
- **Family Coach Agent**: Supports relationship management and family dynamics
- **Social Media Agent**: Manages online presence and digital communication

Each agent inherits from a BaseAgent class that provides:
- OpenAI GPT-4 integration
- Inter-agent communication
- Context management
- Error handling
- Response synthesis

## Features

- Real-time multi-agent coordination
- Secure user authentication
- Context-aware responses
- Comprehensive life management support
- Web-based chat interface
- Persistent conversation history
- Secure data handling

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd life_management_agency
```

2. Install Python dependencies:
```bash
pip install -e .
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Set up environment variables:
Create a .env file with:
```
OPENAI_API_KEY=your_api_key
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000
```

5. Start the FastAPI backend server:
```bash
python -m life_management_agency.agency
```
The server will run on http://localhost:8002

6. Start the Next.js frontend:
```bash
npm run dev
```
The frontend will be available at http://localhost:3000

## Usage

1. Access the web interface at http://localhost:3000
2. Sign in using your credentials
3. Start chatting with your AI life management team
4. The system will automatically route your requests to the appropriate specialized agents

## Development

- Backend: Python 3.12+ with FastAPI
- Frontend: Next.js 13+ with TypeScript
- Authentication: NextAuth.js
- AI: OpenAI GPT-4
- Styling: Tailwind CSS

## Project Structure

```
life_management_agency/
├── agency.py              # Main agency coordination
├── base_agent.py         # Base agent class
├── master_agent/         # Master agent implementation
├── knowledge_agent/      # Knowledge agent implementation
├── health_agent/        # Health agent implementation
├── lifestyle_agent/     # Lifestyle agent implementation
├── personal_coach_agent/ # Personal coach implementation
├── family_coach_agent/  # Family coach implementation
├── social_media_agent/  # Social media agent implementation
├── pages/              # Next.js pages
├── components/         # React components
├── styles/            # CSS styles
└── docs/              # Documentation
```

## API Endpoints

- POST /chat: Main chat endpoint
- GET /health: Health check endpoint
- Various agent-specific endpoints under /api/

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
