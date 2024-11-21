// Health Agent Types
export interface HealthMetrics {
  steps: number;
  activeMinutes: number;
  heartRate: number;
  sleepHours: number;
}

export interface CognitiveMetrics {
  focusScore: number;
  stressLevel: number;
  mindfulnessMinutes: number;
}

export interface HealthRecommendation {
  type: 'exercise' | 'mindfulness' | 'sleep' | 'nutrition';
  title: string;
  description: string;
  priority: number;
}

export interface HealthGoal {
  type: string;
  target: number;
  current: number;
  unit: string;
}

export interface FitnessTrackerTool {
  getMetrics(): Promise<HealthMetrics>;
  trackActivity(type: string, duration: number): Promise<void>;
}

export interface MemoryTool {
  getWellnessMetrics(): Promise<CognitiveMetrics>;
  trackMindfulness(duration: number): Promise<void>;
}

export interface HealthAgent {
  tools: {
    FitnessTrackerTool: FitnessTrackerTool;
    MemoryTool: MemoryTool;
  };
  getHealthRecommendations(): Promise<HealthRecommendation[]>;
  getDailyHealthGoals(): Promise<HealthGoal[]>;
}

// Lifestyle Agent Types
export interface ScheduleTask {
  id: string;
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: string;
}

export interface ProductivityMetrics {
  focusTime: number;
  tasksCompleted: number;
  efficiency: number;
}

export interface LifestyleAgent {
  getSchedule(): Promise<{
    tasks: ScheduleTask[];
    events: ScheduleEvent[];
  }>;
  getProductivityMetrics(): Promise<ProductivityMetrics>;
  optimizeSchedule(): Promise<void>;
}
