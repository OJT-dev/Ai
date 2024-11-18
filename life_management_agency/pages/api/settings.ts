import type { NextApiRequest, NextApiResponse } from 'next';

type SettingsResponse = {
  status: string;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', error: 'Method not allowed' });
  }

  try {
    const { type, settings } = req.body;

    // Make request to Python backend
    const response = await fetch('http://localhost:80/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        settings,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();
    
    return res.status(200).json({
      status: 'success',
      data: data
    });
  } catch (error) {
    console.error('Settings API error:', error);
    return res.status(500).json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Failed to update settings'
    });
  }
}
