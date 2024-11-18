import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Phone, Home, Settings, Sparkles, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type ThoughtProcess = {
  agent: string;
  thought: string;
}

type Message = {
  text: string;
  sender: 'user' | 'agent';
  thoughtProcess?: ThoughtProcess[];
  involvedAgents?: string[];
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "How can I help you today?", sender: "agent" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showThoughtProcess, setShowThoughtProcess] = useState(false);

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      const messageText = inputValue;
      setInputValue("");
      setIsLoading(true);

      setMessages(prev => [...prev, { text: messageText, sender: "user" }]);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: messageText }),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const data = await response.json();

        if (data.status === 'success' && data.data?.response) {
          setMessages(prev => [...prev, { 
            text: data.data.response, 
            sender: 'agent',
            thoughtProcess: data.data.metadata?.thought_process,
            involvedAgents: data.data.involved_agents
          }]);
        }
      } catch (error) {
        setMessages(prev => [...prev, { 
          text: "I apologize, but I'm having trouble processing your request at the moment. Please try again.", 
          sender: 'agent' 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold">Master Agent</h2>
            <p className="text-sm text-gray-400">Online</p>
          </div>
        </div>
        <button
          onClick={() => setShowThoughtProcess(!showThoughtProcess)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          title={showThoughtProcess ? "Hide thought process" : "Show thought process"}
        >
          {showThoughtProcess ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'agent' ? '' : 'justify-end'}`}>
            <div className={`rounded-lg p-4 shadow-lg max-w-[85%] ${
              message.sender === 'agent' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-blue-600'
            }`}>
              <div className="prose prose-invert prose-blue max-w-none">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
              
              {showThoughtProcess && message.thoughtProcess && (
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-400">Thought Process</p>
                  </div>
                  <div className="space-y-2">
                    {message.thoughtProcess.map((thought, i) => (
                      <div key={i} className="text-sm bg-gray-700/50 rounded-md p-2">
                        <span className="text-blue-400 font-medium">{thought.agent}:</span>{' '}
                        <span className="text-gray-300">{thought.thought}</span>
                      </div>
                    ))}
                  </div>
                  {message.involvedAgents && (
                    <div className="mt-3 text-sm text-gray-400">
                      <span className="font-medium">Agents involved:</span>{' '}
                      {message.involvedAgents.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex">
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex space-x-2">
          <input 
            className="flex-1 bg-gray-700 rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <button 
            className={`p-3 rounded-lg transition-colors ${
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      </div>

      <nav className="bg-gray-800 px-4 py-2 flex justify-around border-t border-gray-700">
        <Link href="/home" className="text-gray-400 hover:text-white transition-colors">
          <Home className="w-6 h-6" />
        </Link>
        <Link href="/chat" className="text-blue-400">
          <MessageSquare className="w-6 h-6" />
        </Link>
        <Link href="/call" className="text-gray-400 hover:text-white transition-colors">
          <Phone className="w-6 h-6" />
        </Link>
        <Link href="/settings" className="text-gray-400 hover:text-white transition-colors">
          <Settings className="w-6 h-6" />
        </Link>
      </nav>
    </div>
  );
};

export default ChatPage;
