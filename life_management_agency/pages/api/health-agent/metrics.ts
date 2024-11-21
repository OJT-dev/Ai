import type { NextApiRequest, NextApiResponse } from 'next';
import type { HealthMetrics, CognitiveMetrics, HealthRecommendation, HealthGoal } from '../../../types/agents';
import { communicateWithAgent } from '../../../utils/agentCommunication';

interface HealthResponse {
  fitness: HealthMetrics;
  cognitive: CognitiveMetrics;
  recommendations: HealthRecommendation[];
  dailyGoals: HealthGoal[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse | { message: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await communicateWithAgent('health', 'get_metrics');

    if (!response.success) {
      // Check if the error indicates no user data
      if (response.error?.includes('No user data found')) {
        return res.status(404).json({ message: 'No user data found. Please complete setup.' });
      }
      throw new Error(response.error || 'Failed to get health metrics');
    }

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Health Agent Metrics Error:', error);
    res.status(500).json({ message: error?.message || 'Error fetching health metrics' });
  }
}
