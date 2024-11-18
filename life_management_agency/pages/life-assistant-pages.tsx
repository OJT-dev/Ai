import React, { useState } from 'react';
import { MessageSquare, Phone, Heart, Bell, Home, Settings, Search, User, ChevronRight, Star, Calendar, Sparkles, Plus } from 'lucide-react';

// Welcome/Onboarding Page
const WelcomePage = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <div className="h-screen bg-gradient-to-b from-blue-600 to-blue-800 p-6 flex flex-col items-center justify-center text-white">
    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8">
      <Sparkles className="w-12 h-12" />
    </div>
    <h1 className="text-3xl font-bold mb-4">Welcome to Life AI</h1>
    <p className="text-center mb-8">Your personal AI companion for growth and wellness</p>
    <div className="w-full space-y-4">
      <button 
        className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold"
        onClick={onGetStarted}
      >
        Get Started
      </button>
      <button className="w-full bg-white/20 py-3 rounded-lg font-semibold">
        Log In
      </button>
    </div>
  </div>
);

// Home Page
const HomePage = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <div className="h-screen bg-gray-900 text-white">
    <div className="bg-blue-500/10 p-4">
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

    <div className="p-4 space-y-6">
      {/* Daily Affirmation */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Daily Affirmation</h3>
          <Star className="w-4 h-4 text-yellow-400" />
        </div>
        <p className="text-gray-300">"I am surrounded by abundance"</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          className="bg-gray-800 p-4 rounded-lg flex flex-col items-center"
          aria-label="Quick action: Voice Call"
          onClick={() => onNavigate('call')}
        >
          <Phone className="text-blue-400 w-6 h-6 mb-2" />
          <span>Voice Call</span>
        </button>
        <button 
          className="bg-gray-800 p-4 rounded-lg flex flex-col items-center"
          aria-label="Quick action: Chat"
          onClick={() => onNavigate('chat')}
        >
          <MessageSquare className="text-green-400 w-6 h-6 mb-2" />
          <span>Chat</span>
        </button>
        <button 
          className="bg-gray-800 p-4 rounded-lg flex flex-col items-center"
          aria-label="Quick action: Wellness"
        >
          <Heart className="text-red-400 w-6 h-6 mb-2" />
          <span>Wellness</span>
        </button>
        <button 
          className="bg-gray-800 p-4 rounded-lg flex flex-col items-center"
          aria-label="Quick action: Schedule"
        >
          <Calendar className="text-purple-400 w-6 h-6 mb-2" />
          <span>Schedule</span>
        </button>
      </div>

      {/* Active Agents */}
      <div className="space-y-2">
        <h3 className="font-semibold mb-4">Your Agents</h3>
        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
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
  </div>
);

// Chat Page
const ChatPage = () => {
  const [messages, setMessages] = useState([
    { text: "How can I help you today?", sender: "agent" },
    { text: "I'd like to work on my daily goals.", sender: "user" }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: "user" }]);
      setInputValue("");
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <div className="bg-gray-800 p-4 flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-semibold">Master Agent</h2>
          <p className="text-sm text-gray-400">Online</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'agent' ? '' : 'justify-end'}`}>
            <div className={`rounded-lg p-3 max-w-[80%] ${message.sender === 'agent' ? 'bg-gray-800' : 'bg-blue-600'}`}>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-800">
        <div className="flex space-x-2">
          <input 
            className="flex-1 bg-gray-700 rounded-lg px-4 py-2"
            placeholder="Type your message..."
            aria-label="Message input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            className="bg-blue-600 p-2 rounded-lg" 
            aria-label="Send message"
            onClick={handleSendMessage}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Voice Call Page
const VoiceCallPage = () => (
  <div className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mb-6">
      <Sparkles className="w-12 h-12" />
    </div>
    <h2 className="text-xl font-semibold mb-2">Master Agent</h2>
    <p className="text-gray-400 mb-8">00:03:45</p>
    <div className="flex space-x-6">
      <button className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
        <Phone className="w-6 h-6" />
      </button>
      <button className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  </div>
);

// Settings Page
const SettingsPage = () => (
  <div className="h-screen bg-gray-900 text-white p-4">
    <h2 className="text-xl font-semibold mb-6">Settings</h2>
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium mb-2">Account</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between py-2">
            <span>Profile</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="w-full flex items-center justify-between py-2">
            <span>Subscription</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium mb-2">Preferences</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between py-2">
            <span>Notifications</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="w-full flex items-center justify-between py-2">
            <span>Appearance</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Main App Component with Navigation
const LifeAssistantApp = () => {
  const [currentPage, setCurrentPage] = useState('welcome');
  
  const handleGetStarted = () => {
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'welcome':
        return <WelcomePage onGetStarted={handleGetStarted} />;
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'chat':
        return <ChatPage />;
      case 'call':
        return <VoiceCallPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <WelcomePage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {renderPage()}
      
      {/* Navigation Bar */}
      {currentPage !== 'welcome' && (
        <nav className="bg-gray-800 px-4 py-2 flex justify-around">
          <button 
            onClick={() => setCurrentPage('home')}
            aria-label="Navigation: Home"
          >
            <Home className={`w-6 h-6 ${currentPage === 'home' ? 'text-blue-400' : 'text-gray-400'}`} />
          </button>
          <button 
            onClick={() => setCurrentPage('chat')}
            aria-label="Navigation: Chat"
          >
            <MessageSquare className={`w-6 h-6 ${currentPage === 'chat' ? 'text-blue-400' : 'text-gray-400'}`} />
          </button>
          <button 
            onClick={() => setCurrentPage('call')}
            aria-label="Navigation: Call"
          >
            <Phone className={`w-6 h-6 ${currentPage === 'call' ? 'text-blue-400' : 'text-gray-400'}`} />
          </button>
          <button 
            onClick={() => setCurrentPage('settings')}
            aria-label="Navigation: Settings"
          >
            <Settings className={`w-6 h-6 ${currentPage === 'settings' ? 'text-blue-400' : 'text-gray-400'}`} />
          </button>
        </nav>
      )}
    </div>
  );
};

export default LifeAssistantApp;
