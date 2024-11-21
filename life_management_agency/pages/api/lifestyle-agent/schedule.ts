import type { NextApiRequest, NextApiResponse } from 'next';
import type { ScheduleTask, ScheduleEvent, ProductivityMetrics } from '../../../types/agents';
import { communicateWithAgent } from '../../../utils/agentCommunication';

interface ScheduleResponse {
  tasks: ScheduleTask[];
  events: ScheduleEvent[];
  productivity: ProductivityMetrics;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScheduleResponse | { message: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await communicateWithAgent('lifestyle', 'get_schedule');

    if (!response.success) {
      throw new Error(response.error || 'Failed to get schedule data');
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Lifestyle Agent Schedule Error:', error);
    res.status(500).json({ message: 'Error fetching schedule data' });
  }
}
