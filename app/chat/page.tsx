'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface AIMode {
  id: string
  slug: string
  metadata: {
    mode_name: string
    mode_icon: string
    system_prompt: string
    color_theme?: string
  }
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [modes, setModes] = useState<AIMode[]>([])
  const [selectedMode, setSelectedMode] = useState<string>('')
  const [apiKey, setApiKey] = useState('')
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('radzz_token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    // Load API key
    const savedApiKey = localStorage.getItem('openai_api_key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    } else {
      setShowApiKeyModal(true)
    }

    // Load AI modes
    fetchModes()
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchModes = async () => {
    try {
      const response = await fetch('/api/modes')
      const data = await response.json()
      setModes(data.modes)
      if (data.modes.length > 0 && !selectedMode) {
        setSelectedMode(data.modes[0].slug)
      }
    } catch (error) {
      console.error('Failed to fetch modes:', error)
    }
  }

  const saveApiKey = () => {
    localStorage.setItem('openai_api_key', apiKey)
    setShowApiKeyModal(false)
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    if (!apiKey) {
      setShowApiKeyModal(true)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          mode: selectedMode,
          apiKey
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const currentMode = modes.find(m => m.slug === selectedMode)

  return (
    <div className="flex h-screen bg-dark">
      {/* Sidebar */}
      <div className="w-64 bg-dark-lighter border-r border-dark-border p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">AI Modes</h2>
          <div className="space-y-2">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.slug)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedMode === mode.slug
                    ? 'bg-accent-blue text-white'
                    : 'bg-dark hover:bg-dark-border text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{mode.metadata.mode_icon}</span>
                  <span className="text-sm font-medium">{mode.metadata.mode_name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="w-full px-4 py-2 bg-dark hover:bg-dark-border rounded-lg text-sm transition-colors"
          >
            ⚙️ API Settings
          </button>
          <button
            onClick={clearChat}
            className="w-full px-4 py-2 bg-dark hover:bg-dark-border rounded-lg text-sm transition-colors"
          >
            🗑️ Clear Chat
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('radzz_token')
              router.push('/')
            }}
            className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-dark-lighter border-b border-dark-border px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentMode?.metadata.mode_icon}</span>
            <div>
              <h1 className="text-xl font-bold">{currentMode?.metadata.mode_name}</h1>
              <p className="text-sm text-gray-400">AI-powered assistance</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-lg mb-2">Start a conversation with {currentMode?.metadata.mode_name}</p>
                <p className="text-sm">Ask me anything!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-accent-blue text-white'
                        : 'bg-dark-lighter text-gray-100'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-dark-lighter rounded-lg px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-dark-border px-6 py-4">
          <div className="max-w-4xl mx-auto flex gap-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '200px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-accent-blue hover:bg-accent-purple rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-dark-lighter border border-dark-border rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">OpenAI API Key</h2>
            <p className="text-gray-400 text-sm mb-4">
              Enter your OpenAI API key to start chatting. Your key is stored locally and never sent to our servers.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={saveApiKey}
                className="flex-1 px-4 py-2 bg-accent-blue hover:bg-accent-purple rounded-lg font-semibold transition-all duration-300"
              >
                Save
              </button>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-2 bg-dark hover:bg-dark-border rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}