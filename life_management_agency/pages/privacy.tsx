import React, { useState } from 'react';
import { MessageSquare, Phone, Home, Settings, Shield, Eye, Bell, Lock } from 'lucide-react';
import Link from 'next/link';

interface PrivacySettings {
  dataSharing: boolean;
  profileVisibility: 'public' | 'private' | 'contacts';
  activityTracking: boolean;
  dataRetention: number; // in days
  twoFactorAuth: boolean;
}

const PrivacyPage: React.FC = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    dataSharing: false,
    profileVisibility: 'private',
    activityTracking: true,
    dataRetention: 30,
    twoFactorAuth: false
  });

  const Toggle: React.FC<{
    enabled: boolean;
    onChange: (enabled: boolean) => void;
  }> = ({ enabled, onChange }) => (
    <div
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
        enabled ? 'bg-blue-600' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </div>
  );

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save privacy settings
      console.log('Saving privacy settings:', settings);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white bg-gray-900">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Privacy Settings</h1>
      </div>

      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Data & Privacy</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Data Sharing</h3>
                  <p className="text-sm text-gray-400">Allow data sharing with AI agents</p>
                </div>
                <Toggle
                  enabled={settings.dataSharing}
                  onChange={(enabled) => setSettings({...settings, dataSharing: enabled})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Activity Tracking</h3>
                  <p className="text-sm text-gray-400">Track app usage for personalization</p>
                </div>
                <Toggle
                  enabled={settings.activityTracking}
                  onChange={(enabled) => setSettings({...settings, activityTracking: enabled})}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Profile Visibility</h3>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => setSettings({
                    ...settings,
                    profileVisibility: e.target.value as PrivacySettings['profileVisibility']
                  })}
                  className="w-full bg-gray-700 rounded p-2"
                >
                  <option value="public">Public</option>
                  <option value="contacts">Contacts Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Data Retention</h3>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => setSettings({
                    ...settings,
                    dataRetention: parseInt(e.target.value)
                  })}
                  className="w-full bg-gray-700 rounded p-2"
                >
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>1 year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Security</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
                <Toggle
                  enabled={settings.twoFactorAuth}
                  onChange={(enabled) => setSettings({...settings, twoFactorAuth: enabled})}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      <nav className="bg-gray-800 px-4 py-2 flex justify-around fixed bottom-0 left-0 right-0 z-10">
        <Link href="/" className="text-gray-400 hover:text-white">
          <Home className="w-6 h-6" />
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
};

export default PrivacyPage;
