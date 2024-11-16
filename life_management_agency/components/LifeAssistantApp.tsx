import React, { useState } from 'react';
import { MessageSquare, Phone, Heart, Bell, Home, Settings, Search, User, ChevronRight, Star, Calendar, Sparkles } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'agent';
}

type PageState = 'welcome' | 'home' | 'chat' | 'call' | 'settings';

export const LifeAssistantApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('welcome');
  const [messages, setMessages] = useState<Message[]>([
    { text: "How can I help you today?", sender: "agent" }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleGetStarted = () => {
    setCurrentPage('home');
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      // Add user message
      setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
      
      try {
        // Send message to API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputValue }),
        });

        const data = await response.json();
        
        // Add agent response
        setMessages(prev => [...prev, { text: data.response, sender: 'agent' }]);
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setInputValue("");
    }
  };

  const getNavIconColor = (page: PageState) => {
    return currentPage === page ? 'text-blue-400' : 'text-gray-400';
  };

  const renderNavigation = () => {
    const isWelcomePage: boolean = currentPage === 'welcome';
    if (isWelcomePage) return null;

    return (
      <nav className="bg-gray-800 px-4 py-2 flex justify-around">
        <button onClick={() => setCurrentPage('home')}>
          <Home className={`w-6 h-6 ${getNavIconColor('home')}`} />
        </button>
        <button onClick={() => setCurrentPage('chat')}>
          <MessageSquare className={`w-6 h-6 ${getNavIconColor('chat')}`} />
        </button>
        <button onClick={() => setCurrentPage('call')}>
          <Phone className={`w-6 h-6 ${getNavIconColor('call')}`} />
        </button>
        <button onClick={() => setCurrentPage('settings')}>
          <Settings className={`w-6 h-6 ${getNavIconColor('settings')}`} />
        </button>
      </nav>
    );
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'welcome':
        return (
          <div className="h-screen bg-gradient-to-b from-blue-600 to-blue-800 p-6 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8">
              <Sparkles className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Welcome to Life AI</h1>
            <p className="text-center mb-8">Your personal AI companion for growth and wellness</p>
            <div className="w-full space-y-4">
              <button 
                className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold"
                onClick={handleGetStarted}
              >
                Get Started
              </button>
              <button className="w-full bg-white/20 py-3 rounded-lg font-semibold">
                Log In
              </button>
            </div>
          </div>
        );

      case 'home':
        return (
          <div className="h-screen bg-gray-900 flex flex-col">
            <div className="header-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span>Welcome back, Alex</span>
                </div>
                <Settings className="w-6 h-6" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="affirmation-box">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Daily Affirmation</h3>
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
                <p className="text-gray-300">"I am surrounded by abundance"</p>
              </div>

              <div className="quick-actions">
                <button className="action-button">
                  <Phone className="text-blue-400 w-6 h-6 mb-2 mx-auto" />
                  <span>Voice Call</span>
                </button>
                <button className="action-button">
                  <MessageSquare className="text-green-400 w-6 h-6 mb-2 mx-auto" />
                  <span>Chat</span>
                </button>
                <button className="action-button">
                  <Heart className="text-red-400 w-6 h-6 mb-2 mx-auto" />
                  <span>Wellness</span>
                </button>
                <button className="action-button">
                  <Calendar className="text-purple-400 w-6 h-6 mb-2 mx-auto" />
                  <span>Schedule</span>
                </button>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Your Agents</h3>
                <div className="agent-box">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Master Agent</h4>
                      <p className="text-sm text-gray-400">Available</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-800">
              <div className="flex space-x-2">
                <input 
                  className="flex-1 bg-gray-700 rounded-lg px-4 py-2"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  className="bg-blue-600 p-2 rounded-lg"
                  onClick={handleSendMessage}
                >
                  <MessageSquare className="w-6 h-6" />
                </button>
              </div>
            </div>

            {renderNavigation()}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {renderPage()}
    </div>
  );
};

export default LifeAssistantApp;
