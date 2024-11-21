import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HealthData {
  fitness: {
    steps: number;
    activeMinutes: number;
    heartRate: number;
    sleepHours: number;
  };
  cognitive: {
    focusScore: number;
    stressLevel: number;
    mindfulnessMinutes: number;
  };
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    priority: number;
  }>;
  dailyGoals: Array<{
    type: string;
    target: number;
    current: number;
    unit: string;
  }>;
}

interface OnboardingData {
  dailyStepGoal: number;
  sleepGoal: number;
  mindfulnessGoal: number;
  currentSteps?: number;
  currentSleep?: number;
  currentMindfulness?: number;
}

export default function WellnessPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    dailyStepGoal: 10000,
    sleepGoal: 8,
    mindfulnessGoal: 15,
  });

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/health-agent/metrics');
      if (!response.ok) {
        if (response.status === 404) {
          setNeedsOnboarding(true);
        } else {
          throw new Error('Failed to fetch health data');
        }
      } else {
        const data = await response.json();
        setHealthData(data);
      }
    } catch (err) {
      console.error('Health data fetch error:', err);
      setError('Error loading health data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/health-agent/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(onboardingData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save onboarding data');
      }
      
      // Refresh health data after onboarding
      await fetchHealthData();
      setNeedsOnboarding(false);
    } catch (err) {
      console.error('Onboarding error:', err);
      setError('Error saving your preferences. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Wellness</h1>
        <p>Loading your wellness dashboard...</p>
      </div>
    );
  }

  if (needsOnboarding) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to Your Wellness Journey</h1>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Let's Get Started</h2>
          <form onSubmit={handleOnboardingSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Daily Step Goal</label>
              <Input
                type="number"
                value={onboardingData.dailyStepGoal}
                onChange={(e) => setOnboardingData({
                  ...onboardingData,
                  dailyStepGoal: parseInt(e.target.value)
                })}
                min="1000"
                max="50000"
              />
            </div>
            <div>
              <label className="block mb-2">Sleep Goal (hours)</label>
              <Input
                type="number"
                value={onboardingData.sleepGoal}
                onChange={(e) => setOnboardingData({
                  ...onboardingData,
                  sleepGoal: parseInt(e.target.value)
                })}
                min="4"
                max="12"
              />
            </div>
            <div>
              <label className="block mb-2">Daily Mindfulness Goal (minutes)</label>
              <Input
                type="number"
                value={onboardingData.mindfulnessGoal}
                onChange={(e) => setOnboardingData({
                  ...onboardingData,
                  mindfulnessGoal: parseInt(e.target.value)
                })}
                min="5"
                max="120"
              />
            </div>
            <div>
              <label className="block mb-2">Current Steps Today (optional)</label>
              <Input
                type="number"
                value={onboardingData.currentSteps || ''}
                onChange={(e) => setOnboardingData({
                  ...onboardingData,
                  currentSteps: parseInt(e.target.value)
                })}
                min="0"
              />
            </div>
            <div>
              <label className="block mb-2">Last Night's Sleep (hours, optional)</label>
              <Input
                type="number"
                value={onboardingData.currentSleep || ''}
                onChange={(e) => setOnboardingData({
                  ...onboardingData,
                  currentSleep: parseInt(e.target.value)
                })}
                min="0"
                max="24"
              />
            </div>
            <div>
              <label className="block mb-2">Today's Mindfulness Minutes (optional)</label>
              <Input
                type="number"
                value={onboardingData.currentMindfulness || ''}
                onChange={(e) => setOnboardingData({
                  ...onboardingData,
                  currentMindfulness: parseInt(e.target.value)
                })}
                min="0"
              />
            </div>
            <Button type="submit">Start My Wellness Journey</Button>
          </form>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Wellness</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!healthData) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Wellness</h1>
      <p className="text-gray-600 mb-6">Managed by Health Agent</p>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">❤️ Your Wellness Dashboard</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">📊 Daily Health Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Steps</p>
                  <p className="text-2xl font-bold">{healthData.fitness.steps}</p>
                </div>
                <div>
                  <p className="text-gray-600">Active Minutes</p>
                  <p className="text-2xl font-bold">{healthData.fitness.activeMinutes}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">🧘 Mindfulness</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Focus Score</p>
                  <p className="text-2xl font-bold">{healthData.cognitive.focusScore}</p>
                </div>
                <div>
                  <p className="text-gray-600">Mindfulness Minutes</p>
                  <p className="text-2xl font-bold">{healthData.cognitive.mindfulnessMinutes}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">⏰ Exercise Planning</h3>
              {healthData.recommendations.map((rec, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg mb-2">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-gray-600">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
