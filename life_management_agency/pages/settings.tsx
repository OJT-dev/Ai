import React from 'react';
import Link from 'next/link';
import { MessageSquare, Phone, Home, Settings, ChevronRight } from 'lucide-react';

const SettingsPage: React.FC = () => (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col">
    <div className="p-4 border-b border-gray-800">
      <h1 className="text-xl font-semibold">Settings</h1>
    </div>

    <div className="flex-1 p-4 space-y-6">
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium mb-4">Account</h3>
        <div className="space-y-2">
          <Link href="/profile" className="w-full flex items-center justify-between py-2">
            <span>Profile</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link href="/privacy" className="w-full flex items-center justify-between py-2">
            <span>Privacy</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Dark Mode</h4>
              <p className="text-sm text-gray-400">Toggle dark/light theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notifications</h4>
              <p className="text-sm text-gray-400">Enable push notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium mb-4">About</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2">
            <span>Version</span>
            <span className="text-gray-400">1.0.0</span>
          </div>
          <button className="w-full flex items-center justify-between py-2 text-left">
            <span>Terms of Service</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="w-full flex items-center justify-between py-2 text-left">
            <span>Privacy Policy</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    {/* Navigation Bar */}
    <nav className="bg-gray-800 px-4 py-2 flex justify-around">
      <Link href="/home" className="text-gray-400 hover:text-white">
        <Home className="w-6 h-6" />
      </Link>
      <Link href="/chat" className="text-gray-400 hover:text-white">
        <MessageSquare className="w-6 h-6" />
      </Link>
      <Link href="/call" className="text-gray-400 hover:text-white">
        <Phone className="w-6 h-6" />
      </Link>
      <Link href="/settings" className="text-blue-400">
        <Settings className="w-6 h-6" />
      </Link>
    </nav>
  </div>
);

export default SettingsPage;
