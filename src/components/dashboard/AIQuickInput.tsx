import React, { useState } from 'react'
import { Sparkles, Send, Loader } from 'lucide-react'
import { aiService } from '@/lib/aiService'

export default function AIQuickInput() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    try {
      // Check if it's a summarize/draft/plan request
      const lowerInput = input.toLowerCase()
      let aiResponse

      if (lowerInput.includes('summarize') || lowerInput.includes('summary')) {
        const aiResponse = await aiService.summarizeText(input)
      } else if (lowerInput.includes('draft') || lowerInput.includes('write')) {
        aiResponse = await aiService.generateWriting(input)
      } else {
        aiResponse = await aiService.chatCompletion([
          { role: 'user', content: input }
        ])
      }

      setResponse(aiResponse.content)
    } catch (error) {
      setResponse('Sorry, I encountered an error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-aura flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">AI Quick Input</h2>
          <p className="text-sm text-gray-400">Summarize, draft, or plan anything</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try: 'Summarize this...', 'Draft an email about...', or 'Plan my day'"
            className="input flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary px-4 py-3 disabled:opacity-50"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {response && (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-white text-sm whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </form>

      <div className="mt-4 text-xs text-gray-500">
        
      </div>
    </div>
  )
}
