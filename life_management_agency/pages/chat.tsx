'use client'

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card } from "../components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip"
import { Brain, Code, FileText, ImageIcon, MessageSquare, Paperclip, Settings, Type, Upload, Eye, EyeOff } from 'lucide-react'
import { Avatar, AvatarFallback } from "../components/ui/avatar"

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    thought_process?: string[]
    involved_agents?: string[]
  }
}

export default function Component() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showThoughtProcess, setShowThoughtProcess] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setInput("")

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.status === 'success' && data.data) {
        const aiMessage: Message = {
          role: 'assistant',
          content: data.data.response,
          timestamp: new Date(),
          metadata: data.data.metadata
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="relative flex h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 md:hidden z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MessageSquare className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed md:relative w-64 h-full border-r bg-muted/20 p-4 flex flex-col
        transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        z-40 md:z-0
      `}>
        <Button variant="outline" className="justify-start mb-4">
          <MessageSquare className="mr-2 h-4 w-4" />
          New Chat
        </Button>

        <div className="mt-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start mb-2"
            onClick={() => setShowThoughtProcess(!showThoughtProcess)}
          >
            {showThoughtProcess ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {showThoughtProcess ? 'Hide Thought Process' : 'Show Thought Process'}
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b p-4 md:p-6">
          <div className="ml-8 md:ml-0">
            <h1 className="text-2xl font-semibold">Good evening</h1>
            <p className="text-sm text-muted-foreground">How can I help you today?</p>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 pb-36">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={message.role === 'assistant' ? 'bg-primary/10' : 'bg-primary text-primary-foreground'}>
                      {message.role === 'assistant' ? 'AI' : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm break-words">{message.content}</p>
                    {showThoughtProcess && message.metadata?.thought_process && (
                      <div className="mt-2 pt-2 border-t border-primary/10">
                        <p className="text-xs font-semibold opacity-70">Thought Process:</p>
                        <ul className="list-disc list-inside text-xs opacity-70">
                          {message.metadata.thought_process.map((thought, i) => (
                            <li key={i}>{thought}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {message.metadata?.involved_agents && (
                      <p className="text-xs opacity-50 mt-1">
                        Agents: {message.metadata.involved_agents.join(', ')}
                      </p>
                    )}
                    <span className="text-xs opacity-50 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10">AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 md:relative p-4 border-t bg-background z-20">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col space-y-4">
              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  {[
                    { icon: <Brain className="h-4 w-4" />, label: "Brainstorm" },
                    { icon: <ImageIcon className="h-4 w-4" />, label: "Create image" },
                    { icon: <Type className="h-4 w-4" />, label: "Write text" },
                    { icon: <Code className="h-4 w-4" />, label: "Generate code" },
                  ].map((action, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          {action.icon}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{action.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>

              {/* Input */}
              <div className="flex space-x-2 pb-safe">
                <div className="flex-1 flex bg-muted rounded-lg">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Message..."
                    className="flex-1 bg-transparent border-0 focus-visible:ring-0"
                    disabled={isLoading}
                  />
                  <Button variant="ghost" size="icon" disabled={isLoading}>
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" disabled={isLoading}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  onClick={handleSend} 
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
