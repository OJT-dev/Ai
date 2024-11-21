import type { NextApiRequest, NextApiResponse } from 'next'
import { spawn } from 'child_process'
import path from 'path'

type ChatResponse = {
  status: string
  data?: {
    response: string
    metadata?: {
      thought_process?: string[]
      involved_agents?: string[]
      messageType?: string
    }
  }
  error?: string
}

const backendUrl = 'http://localhost:80/api/chat';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', error: 'Method not allowed' })
  }

  try {
    const { message, messageType = 'chat' } = req.body
    console.log('Received message:', message, 'Type:', messageType)

    // Get session ID from cookies or create new one
    let sessionId = req.cookies.chatSessionId || `session_${Date.now()}`
    res.setHeader('Set-Cookie', `chatSessionId=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`)

    // Forward request to Python backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        type: messageType // Forward message type to backend
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    return res.status(200).json({
      status: 'success',
      data: {
        response: data.data?.response || data.message,
        metadata: {
          thought_process: data.data?.metadata?.thought_process || [],
          involved_agents: data.data?.metadata?.involved_agents || [],
          messageType: messageType // Include message type in response
        }
      }
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Failed to communicate with AI agents'
    })
  }
}
