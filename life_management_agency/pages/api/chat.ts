import type { NextApiRequest, NextApiResponse } from 'next'

type ChatResponse = {
  status: string
  data?: any
  error?: string
}

const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || '80';
const backendUrl = `http://localhost:${backendPort}/api/chat`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', error: 'Method not allowed' })
  }

  try {
    const { message } = req.body
    console.log('Received message:', message)  // Debug log

    // Make request to Python backend
    console.log('Making request to backend:', backendUrl)  // Debug log
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        agent: 'master_agent',
        type: 'chat'
      }),
    })

    console.log('Backend response status:', response.status)  // Debug log

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error response:', errorText)  // Debug log
      throw new Error(`Backend responded with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('Backend response data:', data)  // Debug log
    
    // Ensure we have a valid response format
    if (!data || !data.data || !data.data.message) {
      console.error('Invalid response format:', data)  // Debug log
      throw new Error('Invalid response format from backend')
    }

    const responseData = {
      status: 'success',
      data: {
        response: data.data.message,
        metadata: {
          thought_process: data.data.metadata?.thought_process || [],
          involved_agents: data.data.involved_agents || []
        }
      }
    }
    console.log('Sending response:', responseData)  // Debug log

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    return res.status(200).json(responseData)
  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Failed to communicate with AI agents'
    })
  }
}
