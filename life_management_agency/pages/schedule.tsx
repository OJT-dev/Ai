import React, { useEffect, useState } from 'react';
import { Calendar, Clock, List, BarChart, Target, Sparkles, Loader } from 'lucide-react';
import Link from 'next/link';
import type { ScheduleTask, ScheduleEvent, ProductivityMetrics } from '../types/agents';

interface ScheduleData {
  tasks: ScheduleTask[];
  events: ScheduleEvent[];
  productivity: ProductivityMetrics;
}

const SchedulePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      const response = await fetch('/api/lifestyle-agent/schedule');
      if (!response.ok) {
        throw new Error('Failed to fetch schedule data');
      }
      const data = await response.json();
      setScheduleData(data);
      setError(null);
    } catch (err) {
      setError('Error loading schedule data. Please try again later.');
      console.error('Schedule data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white">
      <header className="bg-blue-500/10 p-4">
        <h1 className="text-xl font-semibold">Schedule</h1>
        <p className="text-sm text-gray-400">Managed by Lifestyle Agent</p>
      </header>

      <div className="p-4 space-y-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="text-purple-400 w-6 h-6" />
            <h2 className="text-lg font-medium">Your AI-Optimized Schedule</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-200">
              {error}
            </div>
          ) : scheduleData ? (
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <h3 className="font-medium">Today's AI-Prioritized Agenda</h3>
                  </div>
                  <span className="text-sm text-gray-400">{scheduleData.tasks.length} tasks</span>
                </div>
                <div className="space-y-2">
                  {scheduleData.tasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-2 text-sm text-gray-300">
                      <Target className="w-4 h-4 text-green-400" />
                      <span>{task.title}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Powered by Lifestyle Agent's scheduling optimization
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-medium">AI Productivity Insights</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-400">Focus Time</p>
                    <p className="text-lg">{scheduleData.productivity.focusTime} min</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tasks Completed</p>
                    <p className="text-lg">{scheduleData.productivity.tasksCompleted}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Integrated with Lifestyle Agent's analytics system
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="font-medium">Upcoming Events</h3>
                </div>
                {scheduleData.events.map((event) => (
                  <div key={event.id} className="mt-2 p-2 bg-gray-600/50 rounded">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-300">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                ))}
                <div className="mt-2 text-sm text-gray-400">
                  Utilizing Lifestyle Agent's task optimization algorithms
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-gray-800 px-4 py-2 flex justify-around fixed bottom-0 left-0 right-0">
        <Link href="/home" className="text-gray-400 hover:text-white">
          <div className="flex flex-col items-center">
            <span className="text-xs">Home</span>
          </div>
        </Link>
        <Link href="/chat" className="text-gray-400 hover:text-white">
          <div className="flex flex-col items-center">
            <span className="text-xs">Chat</span>
          </div>
        </Link>
        <Link href="/call" className="text-gray-400 hover:text-white">
          <div className="flex flex-col items-center">
            <span className="text-xs">Call</span>
          </div>
        </Link>
        <Link href="/settings" className="text-gray-400 hover:text-white">
          <div className="flex flex-col items-center">
            <span className="text-xs">Settings</span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default SchedulePage;
