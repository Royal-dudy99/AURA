import React, { useState } from 'react'
import { Send, Sparkles, Copy, Download, Trash2 } from 'lucide-react'
import { aiService } from '@/lib/aiService'
import { PROMPT_TEMPLATES } from '@/lib/constants'
import type { ChatMessage } from '@/types'

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date() as any,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await aiService.chatCompletion([
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: input }
      ])

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date() as any,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateSelect = (template: string) => {
    setInput(template)
    setSelectedTemplate('')
  }

  const clearChat = () => {
    setMessages([])
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-aura flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
            <p className="text-gray-400">Get help with anything you need</p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="btn-secondary flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Prompt Templates */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Templates</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROMPT_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template.content)}
              className="p-3 text-left rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-colors"
            >
              <h4 className="font-medium text-white text-sm">{template.title}</h4>
              <p className="text-xs text-gray-400 mt-1">{template.category}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 card overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                How can I help you today?
              </h3>
              <p className="text-gray-400">
                Ask me anything or use a template above to get started.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-aura text-white ml-4'
                      : 'bg-white/5 border border-white/10 text-white mr-4'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-white/10">
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="text-xs text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mr-4">
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner" />
                  <span className="text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="input flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary px-4 py-3 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Mock AI Notice */}
      <div className="text-xs text-gray-500 text-center">
      
      </div>
    </div>
  )
}
