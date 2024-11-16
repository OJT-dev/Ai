import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Phone, Heart, Bell, Home, Settings, Search, User, ChevronRight, Star, Calendar, Sparkles, Eye, EyeOff } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'agent';
  thoughtProcess?: Array<{
    agent: string;
    thought: string;
  }>;
}

type PageState = 'welcome' | 'home' | 'chat' | 'call' | 'settings';

export const LifeAssistantApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showThoughtProcess, setShowThoughtProcess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGetStarted = () => {
    setCurrentPage('home');
    // Add initial greeting message
    setMessages([{ text: "How can I help you today?", sender: "agent" }]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a message before sending.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Add user message immediately
    const userMessage = { text: inputValue, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to communicate with AI agents');
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.data?.response) {
        // Add agent response with thought process
        setMessages(prev => [...prev, { 
          text: data.data.response, 
          sender: 'agent',
          thoughtProcess: data.data.metadata?.thought_process
        }]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to communicate with AI agents');
      // Add error message to chat
      setMessages(prev => [...prev, { 
        text: "I apologize, but I'm having trouble processing your request at the moment.", 
        sender: 'agent' 
      }]);
    } finally {
      setIsLoading(false);
      setInputValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const getNavIconColor = (page: PageState) => {
    return currentPage === page ? 'text-blue-400' : 'text-gray-400';
  };

  const renderNavigation = () => {
    const isWelcomePage: boolean = currentPage === 'welcome';
    if (isWelcomePage) return null;

    return (
      <nav className="bg-gray-800 px-4 py-2 flex justify-around fixed bottom-0 left-0 right-0 z-10">
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

  const renderMessages = () => {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-40">
        {messages.map((msg, index) => (
          <div key={index} className="space-y-2">
            <div
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] break-words rounded-lg px-4 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
            {showThoughtProcess && msg.thoughtProcess && (
              <div className="bg-gray-800/50 rounded-lg p-2 text-sm text-gray-400 space-y-1">
                {msg.thoughtProcess.map((thought, i) => (
                  <p key={i} className="break-words">
                    <span className="font-semibold">{thought.agent}:</span> {thought.thought}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'welcome':
        return (
          <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 p-6 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8">
              <Sparkles className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Welcome to Life AI</h1>
            <p className="text-center mb-8">Your personal AI companion for growth and wellness</p>
            <div className="w-full max-w-md space-y-4">
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
          <div className="min-h-screen bg-gray-900 flex flex-col">
            <div className="p-4 border-b border-gray-800">
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

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Daily Affirmation</h3>
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <p className="text-gray-300">"I am surrounded by abundance"</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                    <Phone className="text-blue-400 w-6 h-6 mb-2" />
                    <span>Voice Call</span>
                  </button>
                  <button className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                    <MessageSquare className="text-green-400 w-6 h-6 mb-2" />
                    <span>Chat</span>
                  </button>
                  <button className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                    <Heart className="text-red-400 w-6 h-6 mb-2" />
                    <span>Wellness</span>
                  </button>
                  <button className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                    <Calendar className="text-purple-400 w-6 h-6 mb-2" />
                    <span>Schedule</span>
                  </button>
                </div>

                {renderMessages()}
              </div>
            </div>

            <div className="fixed bottom-14 left-0 right-0 bg-gray-800 border-t border-gray-700">
              <div className="max-w-screen-lg mx-auto px-4 pt-3 pb-4">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setShowThoughtProcess(!showThoughtProcess)}
                    className="text-gray-400 hover:text-white flex items-center space-x-1 text-sm"
                  >
                    {showThoughtProcess ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span>Hide Agent Thoughts</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Show Agent Thoughts</span>
                      </>
                    )}
                  </button>
                </div>
                {error && (
                  <div className="text-red-500 text-sm mb-2">
                    {error}
                  </div>
                )}
                <div className="flex space-x-2">
                  <textarea 
                    ref={textareaRef}
                    className="flex-1 bg-gray-700 rounded-lg px-4 py-3 text-white resize-none overflow-hidden"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={isLoading}
                    rows={1}
                    style={{
                      minHeight: '48px',
                      maxHeight: '128px'
                    }}
                  />
                  <button 
                    className={`bg-blue-600 p-3 rounded-lg flex-shrink-0 ${isLoading ? 'opacity-50' : ''}`}
                    onClick={handleSendMessage}
                    disabled={isLoading}
                  >
                    <MessageSquare className="w-6 h-6" />
                  </button>
                </div>
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
    <div className="min-h-screen flex flex-col text-white bg-gray-900">
      {renderPage()}
    </div>
  );
};

export default LifeAssistantApp;
