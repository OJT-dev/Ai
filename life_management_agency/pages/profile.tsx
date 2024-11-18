import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Phone, Home, Settings, User, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

interface ProfilePreferences {
  language: string;
  timezone: string;
  theme: string;
}

interface ProfileData {
  name: string;
  email: string;
  dateJoined: string;
  preferences: ProfilePreferences;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Alex',
    email: 'alex@example.com',
    dateJoined: '2023',
    preferences: {
      language: 'English',
      timezone: 'UTC-8',
      theme: 'Dark'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ProfileData>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Use the Next.js API endpoint
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: editedProfile,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setProfile(editedProfile);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(data.error || 'Failed to save profile changes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving changes');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditedProfile(profile);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col text-white bg-gray-900">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      <div className="flex-1 p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12" />
            </div>
            {isEditing ? (
              <input
                ref={nameInputRef}
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                className="bg-gray-800 text-xl font-semibold p-2 rounded text-center w-full max-w-xs"
                placeholder="Enter your name"
              />
            ) : (
              <h2 className="text-xl font-semibold">{profile.name}</h2>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    className="bg-gray-700 p-2 rounded flex-1"
                    placeholder="Enter your email"
                  />
                ) : (
                  <span className="break-all">{profile.email}</span>
                )}
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                <span>Member since {profile.dateJoined}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Preferences</h3>
            <div className="space-y-4">
              {(Object.keys(profile.preferences) as Array<keyof ProfilePreferences>).map((key) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="capitalize">{key}</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.preferences[key]}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        preferences: {
                          ...editedProfile.preferences,
                          [key]: e.target.value
                        }
                      })}
                      className="bg-gray-700 p-2 rounded w-48"
                      placeholder={`Enter ${key}`}
                    />
                  ) : (
                    <span className="text-gray-400">{profile.preferences[key]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/20 border border-green-500 text-green-500 p-3 rounded-lg">
              {successMessage}
            </div>
          )}

          <div className="flex space-x-4 mb-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${
                    isSaving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={startEditing}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
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

export default ProfilePage;
