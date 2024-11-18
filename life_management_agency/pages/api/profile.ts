import type { NextApiRequest, NextApiResponse } from 'next';

type ProfileResponse = {
  status: string;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProfileResponse>
) {
  if (req.method !== 'POST' && req.method !== 'OPTIONS') {
    return res.status(405).json({ status: 'error', error: 'Method not allowed' });
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'success' });
  }

  try {
    const { profile } = req.body;
    console.log('Received profile update:', profile);

    // For now, we'll just return success with the updated profile
    // In a real application, you would typically save this to a database
    return res.status(200).json({
      status: 'success',
      data: {
        profile
      }
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return res.status(500).json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Failed to update profile'
    });
  }
}
