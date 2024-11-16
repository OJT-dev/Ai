import type { NextApiRequest, NextApiResponse } from 'next'

type ChatResponse = {
  status: string
  data?: any
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', error: 'Method not allowed' })
  }

  try {
    const { message } = req.body

    // Make request to Python backend
    const response = await fetch('http://localhost:80/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent: 'master_agent',
        type: 'chat',
        content: { message }
      }),
    })

    const data = await response.json()
    return res.status(200).json({ status: 'success', data })
  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({ 
      status: 'error', 
      error: 'Failed to communicate with AI agents'
    })
  }
}
