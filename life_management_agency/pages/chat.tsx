import type { NextPage } from 'next';
import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/router';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Brain, Code, FileText, ImageIcon, MessageSquare, Paperclip, Settings, Type, Upload, Eye, EyeOff, Menu } from 'lucide-react';
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ThemeToggle } from "../components/ui/theme-toggle";
import ErrorBoundary from "../components/ErrorBoundary";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    thought_process?: string[];
    involved_agents?: string[];
    messageType?: string;
  };
}

const ChatPage: NextPage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showThoughtProcess, setShowThoughtProcess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (messageType: string = 'chat') => {
    if ((!input.trim() && !selectedFile) || isLoading) return;
    setError(null);

    const formData = new FormData();
    formData.append('message', input);
    formData.append('messageType', messageType);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    const userMessage: Message = {
      role: 'user',
      content: input + (selectedFile ? ` [Attached file: ${selectedFile.name}]` : ''),
      timestamp: new Date(),
      metadata: { messageType }
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");
    setSelectedFile(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          messageType,
          hasAttachment: !!selectedFile
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        const aiMessage: Message = {
          role: 'assistant',
          content: data.data.response,
          timestamp: new Date(),
          metadata: data.data.metadata
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to send message. Please try again.');
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionClick = (action: string) => {
    const messageTypes = {
      'Brainstorm': 'brainstorm',
      'Create image': 'image',
      'Write text': 'text',
      'Generate code': 'code'
    };
    
    setInput(prev => {
      const prefix = action === 'Brainstorm' ? 'Help me brainstorm ideas about '
        : action === 'Create image' ? 'Create an image of '
        : action === 'Write text' ? 'Write a text about '
        : 'Generate code for ';
      return prefix;
    });
    inputRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <ErrorBoundary>
      <main className="flex h-screen bg-background" role="main">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 h-full w-[240px] bg-muted/20 border-r
            transition-transform duration-200 ease-in-out z-50
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
          role="complementary"
          aria-label="Chat controls"
        >
          <nav className="p-4 flex flex-col h-full">
            <Button 
              variant="outline" 
              className="w-full justify-start mb-4"
              onClick={() => {
                setMessages([]);
                setInput("");
                setError(null);
              }}
              aria-label="Start new chat"
            >
              <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
              New Chat
            </Button>

            <div className="space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setShowThoughtProcess(!showThoughtProcess)}
                aria-pressed={showThoughtProcess}
                aria-label={showThoughtProcess ? "Hide thought process" : "Show thought process"}
              >
                {showThoughtProcess ? (
                  <EyeOff className="mr-2 h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {showThoughtProcess ? 'Hide Thought Process' : 'Show Thought Process'}
              </Button>
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => router.push('/settings')}
                aria-label="Open settings"
              >
                <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                Settings
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:ml-[240px] relative">
          {/* Mobile Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 md:hidden z-[60]"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>

          <header className="h-14 border-b flex items-center px-4 bg-background sticky top-0 z-40" role="banner">
            <div className="ml-8 md:ml-0">
              <h1 className="text-lg font-semibold">Life Management Assistant</h1>
              <p className="text-sm text-muted-foreground">How can I help you today?</p>
            </div>
          </header>

          {error && (
            <div 
              role="alert" 
              className="bg-destructive/15 text-destructive px-4 py-2 text-sm"
            >
              {error}
            </div>
          )}

          <div 
            className="flex-1 overflow-y-auto px-4 py-6" 
            role="log" 
            aria-label="Chat messages"
            aria-live="polite"
          >
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  role="article"
                  aria-label={`${message.role === 'user' ? 'Your message' : 'Assistant message'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback 
                        className={message.role === 'assistant' ? 'bg-primary/10' : 'bg-primary text-primary-foreground'}
                        aria-label={message.role === 'assistant' ? 'AI Assistant' : 'You'}
                      >
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
                          <ul className="list-disc list-inside text-xs opacity-70 space-y-1">
                            {message.metadata.thought_process.map((thought, i) => (
                              <li key={i}>{thought}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {message.metadata?.involved_agents && (
                        <p className="text-xs opacity-50 mt-2">
                          Agents: {message.metadata.involved_agents.join(', ')}
                        </p>
                      )}
                      <time className="text-xs opacity-50 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </time>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div 
                  className="flex justify-start" 
                  role="status" 
                  aria-label="Assistant is typing"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10">AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-2 items-center">
                        <p className="text-sm">Thinking</p>
                        <div className="flex space-x-1" aria-hidden="true">
                          <span className="animate-bounce delay-0">.</span>
                          <span className="animate-bounce delay-150">.</span>
                          <span className="animate-bounce delay-300">.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} tabIndex={-1} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t bg-background/80 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto p-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="space-y-4"
                role="form"
                aria-label="Chat input"
              >
                <div className="flex gap-2">
                  <TooltipProvider>
                    {[
                      { icon: <Brain className="h-4 w-4" />, label: "Brainstorm" },
                      { icon: <ImageIcon className="h-4 w-4" />, label: "Create image" },
                      { icon: <Type className="h-4 w-4" />, label: "Write text" },
                      { icon: <Code className="h-4 w-4" />, label: "Generate code" },
                    ].map((action, i) => (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 shrink-0"
                            onClick={() => handleActionClick(action.label)}
                            aria-label={action.label}
                          >
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

                <div className="flex gap-2">
                  <div className="flex-1 flex bg-muted rounded-lg">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Message..."
                      className="flex-1 bg-transparent border-0 focus-visible:ring-0 px-3 py-2 h-auto min-h-[40px]"
                      disabled={isLoading}
                      aria-label="Message input"
                      aria-invalid={error ? "true" : "false"}
                      maxLength={1000}
                      required
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <div className="flex">
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10" 
                        disabled={isLoading}
                        onClick={handleFileUploadClick}
                        aria-label="Attach file"
                      >
                        <Paperclip className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      {selectedFile && (
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10" 
                          disabled={isLoading}
                          onClick={() => setSelectedFile(null)}
                          aria-label="Remove attached file"
                        >
                          <Upload className="h-4 w-4 text-destructive" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    onClick={() => handleSend()}
                    disabled={isLoading || (!input.trim() && !selectedFile)}
                    className="px-4 h-10"
                    aria-label={isLoading ? "Sending message..." : "Send message"}
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </Button>
                </div>

                {selectedFile && (
                  <div className="text-sm text-muted-foreground">
                    Attached: {selectedFile.name}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 md:hidden z-40"
            onClick={() => setIsSidebarOpen(false)}
            role="presentation"
            aria-hidden="true"
          />
        )}
      </main>
    </ErrorBoundary>
  );
};

export default ChatPage;
