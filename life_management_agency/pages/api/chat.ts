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

const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || '8000';  // Default to 8000
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
    console.log('Using backend URL:', backendUrl)  // Debug log

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
        type: 'chat'
      }),
    })

    console.log('Backend response status:', response.status)  // Debug log

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error response:', errorText)  // Debug log
      throw new Error(`Backend responded with status ${response.status}: ${errorText}`)
    }

    // Get response text and fix malformed JSON
    const responseText = await response.text()
    console.log('Raw backend response:', responseText)  // Debug log
    
    // Fix malformed JSON by adding missing commas
    const fixedJson = responseText
      .replace(/""(?=[a-zA-Z])/g, '","')  // Fix missing commas between properties
      .replace(/}"/g, '},"')  // Fix missing commas between objects
    
    console.log('Fixed JSON:', fixedJson)  // Debug log
    
    const data = JSON.parse(fixedJson)
    console.log('Parsed backend data:', data)  // Debug log
    
    // Format response to match frontend expectations
    const responseData: ChatResponse = {
      status: 'success',
      data: {
        response: data.data?.message || data.data?.response || '',
        metadata: {
          thought_process: data.data?.metadata?.thought_process || [],
          involved_agents: data.data?.involved_agents || []
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
