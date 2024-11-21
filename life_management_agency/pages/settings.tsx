import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MessageSquare, Phone, Home, Settings, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '../components/ui/button';
import Navigation from '../components/Navigation';

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(false);

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Load notification preference from localStorage
    const notifPref = localStorage.getItem('notifications') === 'true';
    setNotifications(notifPref);
  }, []);

  const handleNotificationToggle = async () => {
    try {
      if (!notifications) {
        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotifications(true);
          localStorage.setItem('notifications', 'true');
        }
      } else {
        setNotifications(false);
        localStorage.setItem('notifications', 'false');
      }
    } catch (error) {
      console.error('Error handling notifications:', error);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="flex-1 p-4 space-y-6">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h3 className="font-medium mb-4">Account</h3>
          <div className="space-y-2">
            <Link href="/profile" className="w-full flex items-center justify-between py-2 hover:bg-accent rounded-md px-2 transition-colors">
              <span>Profile</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/privacy" className="w-full flex items-center justify-between py-2 hover:bg-accent rounded-md px-2 transition-colors">
              <span>Privacy</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h3 className="font-medium mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Dark Mode</h4>
                <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={theme === 'dark'}
                  onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notifications</h4>
                <p className="text-sm text-muted-foreground">Enable push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications}
                  onChange={handleNotificationToggle}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h3 className="font-medium mb-4">About</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span>Version</span>
              <span className="text-muted-foreground">1.0.0</span>
            </div>
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-between py-2 text-left"
              onClick={() => window.open('/terms', '_blank')}
            >
              <span>Terms of Service</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-between py-2 text-left"
              onClick={() => window.open('/privacy', '_blank')}
            >
              <span>Privacy Policy</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default SettingsPage;
