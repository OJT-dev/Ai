import type { NextApiRequest, NextApiResponse } from 'next'

type ChatResponse = {
  status: string
  data?: {
    response: string
    metadata?: {
      thought_process?: any[]
      involved_agents?: string[]
    }
  }
  error?: string
}

const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || '80';  // Updated to match Python server port
const backendUrl = `http://localhost:${backendPort}/api/chat`;

// Generate a unique session ID for each client
function generateSessionId() {
  return 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
    console.log('Received message:', message)  // Debug log
    console.log('Using backend URL:', backendUrl)  // Debug log

    // Get or create session ID from cookies
    let sessionId = req.cookies.chatSessionId;
    if (!sessionId) {
      sessionId = generateSessionId();
      // Set cookie options
      res.setHeader('Set-Cookie', `chatSessionId=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`); // 24 hours
    }

    // Make request to Python backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        agent: 'master_agent',
        type: 'chat',
        session_id: sessionId
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

    // Format response to match frontend expectations
    const responseData: ChatResponse = {
      status: 'success',
      data: {
        response: data.data?.response || '',
        metadata: {
          thought_process: data.data?.metadata?.thought_process || [],
          involved_agents: data.data?.metadata?.involved_agents || []
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
