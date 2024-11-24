import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

type ChatResponse = {
  status: string
  data?: {
    response: string
    metadata?: {
      thought_process: string[]
      involved_agents: string[]
    }
  }
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
    // Make authentication optional in development
    const session = await getSession({ req })
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (!session && !isDevelopment) {
      return res.status(401).json({ status: 'error', error: 'Unauthorized' })
    }

    const { message } = req.body
    if (!message) {
      return res.status(400).json({ status: 'error', error: 'Message is required' })
    }

    // Forward request to Python FastAPI server
    const response = await fetch('http://localhost:8002/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        user: session?.user?.name || 'user'
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    const data = await response.json()

    return res.status(200).json({
      status: 'success',
      data: {
        response: data.message,
        metadata: data.metadata
      }
    })
  } catch (error) {
    console.error('Error processing chat request:', error)
    return res.status(500).json({
      status: 'error',
      error: 'Failed to process message'
    })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
