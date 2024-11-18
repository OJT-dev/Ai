import type { NextApiRequest, NextApiResponse } from 'next';

type TokenResponse = {
  status: string;
  data?: {
    token: string;
  };
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', error: 'Method not allowed' });
  }

  const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      status: 'error', 
      error: 'HeyGen API key is not configured' 
    });
  }

  try {
    console.log('Requesting token with API key:', apiKey);
    const response = await fetch('https://api.heygen.com/v1/streaming.create_token', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ttl: 3600 // Token valid for 1 hour
      }),
    });

    const responseText = await response.text();
    console.log('HeyGen API response:', responseText);

    if (!response.ok) {
      console.error('HeyGen API error:', {
        status: response.status,
        statusText: response.statusText,
        response: responseText
      });
      throw new Error(`Failed to generate token: ${response.statusText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', e);
      throw new Error('Invalid JSON response from HeyGen API');
    }

    // Check the response structure
    console.log('Parsed response:', data);

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from HeyGen API: not an object');
    }

    // Extract the token from the response
    const token = data.data?.token || data.token;
    if (!token) {
      throw new Error('Invalid response format from HeyGen API: no token found');
    }

    // Return the full token string
    return res.status(200).json({
      status: 'success',
      data: {
        token: token
      }
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return res.status(500).json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Failed to generate token'
    });
  }
}
