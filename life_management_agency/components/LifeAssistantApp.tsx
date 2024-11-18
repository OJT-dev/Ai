import React from 'react';
import { MessageSquare, Phone, Heart, Bell, Home, Settings, Search, User, ChevronRight, Star, Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const LifeAssistantApp: React.FC = () => {
  const handleGetStarted = () => {
    // Navigation is now handled by Next.js Link component
  };

  return (
    <div className="min-h-screen flex flex-col text-white bg-gradient-to-b from-blue-600 to-blue-800">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8">
          <Sparkles className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to Life AI</h1>
        <p className="text-center mb-8">Your personal AI companion for growth and wellness</p>
        <div className="w-full max-w-md space-y-4">
          <Link 
            href="/chat" 
            className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold flex items-center justify-center"
          >
            Get Started
          </Link>
          <button className="w-full bg-white/20 py-3 rounded-lg font-semibold">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LifeAssistantApp;
