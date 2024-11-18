import React from 'react';
import { useRouter } from 'next/router';
import { Sparkles } from 'lucide-react';

const WelcomePage: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/home');
  };

  return (
    <div className="h-screen bg-gradient-to-b from-blue-600 to-blue-800 p-6 flex flex-col items-center justify-center text-white">
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
};

export default WelcomePage;
