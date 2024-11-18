import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Phone, Home, Settings, Sparkles } from 'lucide-react';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { text: "How can I help you today?", sender: "agent" }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      // Add user message
      setMessages(prev => [...prev, { text: inputValue, sender: "user" }]);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputValue }),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const data = await response.json();
        if (data.status === 'success' && data.data?.response) {
          setMessages(prev => [...prev, { 
            text: data.data.response, 
            sender: 'agent',
            thoughtProcess: data.data.metadata?.thought_process
          }]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => [...prev, { 
          text: "I apologize, but I'm having trouble processing your request at the moment. Please try again.", 
          sender: 'agent' 
        }]);
      }

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

      {/* Navigation Bar */}
      <nav className="bg-gray-800 px-4 py-2 flex justify-around">
        <Link href="/home" className="text-gray-400 hover:text-white">
          <Home className="w-6 h-6" />
        </Link>
        <Link href="/chat" className="text-blue-400">
          <MessageSquare className="w-6 h-6" />
        </Link>
        <Link href="/call" className="text-gray-400 hover:text-white">
          <Phone className="w-6 h-6" />
        </Link>
        <Link href="/settings" className="text-gray-400 hover:text-white">
          <Settings className="w-6 h-6" />
        </Link>
      </nav>
    </div>
  );
};

export default ChatPage;
