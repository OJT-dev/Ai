import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MessageSquare, Phone, Home, Settings, Video, Mic, MicOff, VideoOff, Sparkles } from 'lucide-react';
import { initializeStreamingAvatar, StreamingEvents } from '../utils/streamingAvatar';

// HeyGen avatar and voice IDs
const AVATAR_ID = '336b72634e644335ad40bd56462fc780';
const VOICE_ID = 'en-US-JennyNeural';

const CallPage: React.FC = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamingAvatarRef = useRef<any>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<string | null>(null);

  const handleStartCall = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/heygen-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate token');
      }

      const data = await response.json();
      if (!data.data?.token) {
        throw new Error('Invalid token response');
      }

      const token = data.data.token;
      tokenRef.current = token;

      // Initialize streaming avatar
      streamingAvatarRef.current = await initializeStreamingAvatar({
        token: token
      });

      // Create and start avatar
      await streamingAvatarRef.current.createStartAvatar({
        avatar_id: AVATAR_ID,
        voice_id: VOICE_ID,
        quality: 'high',
        language: 'en-US',
        voice: {
          stability: 0.5,
          similarity: 0.8,
          style: 1.0,
          speed: 1.0
        }
      });

      setIsInCall(true);

    } catch (err) {
      console.error('Error starting call:', err);
      setError(err instanceof Error ? err.message : 'Failed to start call');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndCall = async () => {
    try {
      if (streamingAvatarRef.current) {
        await streamingAvatarRef.current.closeVoiceChat();
        await streamingAvatarRef.current.stopAvatar();
        streamingAvatarRef.current = null;
      }
      if (videoContainerRef.current) {
        videoContainerRef.current.innerHTML = '';
      }
      tokenRef.current = null;
    } catch (err) {
      console.error('Error ending call:', err);
    }
    setIsInCall(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const handleToggleMute = () => {
    if (streamingAvatarRef.current) {
      if (isMuted) {
        streamingAvatarRef.current.startListening();
      } else {
        streamingAvatarRef.current.stopListening();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (videoContainerRef.current) {
      const videoElement = videoContainerRef.current.querySelector('video');
      if (videoElement) {
        videoElement.style.display = isVideoOff ? 'none' : 'block';
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamingAvatarRef.current) {
        streamingAvatarRef.current.stopAvatar();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-white bg-gray-900">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Voice Call</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!isInCall ? (
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Phone className="w-12 h-12" />
            </div>
            <h2 className="text-xl mb-8">Start a Voice Call</h2>
            <button
              onClick={handleStartCall}
              disabled={isLoading}
              className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Connecting...' : 'Start Call'}
            </button>
            {error && (
              <p className="text-red-500 mt-4">{error}</p>
            )}
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <div 
              ref={videoContainerRef}
              className={`aspect-video bg-gray-800 rounded-lg mb-6 flex items-center justify-center overflow-hidden ${
                isVideoOff ? 'hidden' : ''
              }`}
            />

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleToggleMute}
                className={`p-4 rounded-full ${
                  isMuted ? 'bg-red-600' : 'bg-gray-700'
                }`}
              >
                {isMuted ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={handleToggleVideo}
                className={`p-4 rounded-full ${
                  isVideoOff ? 'bg-red-600' : 'bg-gray-700'
                }`}
              >
                {isVideoOff ? (
                  <VideoOff className="w-6 h-6" />
                ) : (
                  <Video className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={handleEndCall}
                className="bg-red-600 p-4 rounded-full"
              >
                <Phone className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Bar */}
      <nav className="bg-gray-800 px-4 py-2 flex justify-around">
        <Link href="/home" className="text-gray-400 hover:text-white">
          <Home className="w-6 h-6" />
        </Link>
        <Link href="/chat" className="text-gray-400 hover:text-white">
          <MessageSquare className="w-6 h-6" />
        </Link>
        <Link href="/call" className="text-blue-400">
          <Phone className="w-6 h-6" />
        </Link>
        <Link href="/settings" className="text-gray-400 hover:text-white">
          <Settings className="w-6 h-6" />
        </Link>
      </nav>
    </div>
  );
};

export default CallPage;
