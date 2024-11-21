import type { NextApiRequest, NextApiResponse } from 'next';
import { communicateWithAgent } from '../../../utils/agentCommunication';

interface OnboardingData {
  dailyStepGoal: number;
  sleepGoal: number;
  mindfulnessGoal: number;
  currentSteps?: number;
  currentSleep?: number;
  currentMindfulness?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const onboardingData: OnboardingData = req.body;

    // Validate required fields
    if (!onboardingData.dailyStepGoal || !onboardingData.sleepGoal || !onboardingData.mindfulnessGoal) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Send onboarding data to health agent
    const response = await communicateWithAgent('health', 'setup', onboardingData);

    if (!response.success) {
      throw new Error(response.error || 'Failed to setup health agent');
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Health Agent Setup Error:', error);
    res.status(500).json({ message: 'Error setting up health metrics' });
  }
}
