import React from 'react';
import Link from 'next/link';
import { MessageSquare, Phone, Heart, Settings, User, ChevronRight, Star, Calendar, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => (
  <div className="h-screen bg-gray-900 text-white">
    <div className="bg-blue-500/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span>Welcome back, Alex</span>
        </div>
        <Link href="/settings">
          <Settings className="w-6 h-6 cursor-pointer" />
        </Link>
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
        <Link href="/call" className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
          <Phone className="text-blue-400 w-6 h-6 mb-2" />
          <span>Voice Call</span>
        </Link>
        <Link href="/chat" className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
          <MessageSquare className="text-green-400 w-6 h-6 mb-2" />
          <span>Chat</span>
        </Link>
        <Link href="/wellness" className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
          <Heart className="text-red-400 w-6 h-6 mb-2" />
          <span>Wellness</span>
        </Link>
        <Link href="/schedule" className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
          <Calendar className="text-purple-400 w-6 h-6 mb-2" />
          <span>Schedule</span>
        </Link>
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

    {/* Navigation Bar */}
    <nav className="bg-gray-800 px-4 py-2 flex justify-around fixed bottom-0 left-0 right-0">
      <Link href="/home" className="text-blue-400">
        <Sparkles className="w-6 h-6" />
      </Link>
      <Link href="/chat" className="text-gray-400 hover:text-white">
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

export default HomePage;
