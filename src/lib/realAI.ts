import OpenAI from 'openai'
import type { AIResponse } from '@/types'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo - use server-side in production
})

export class RealAIService {
  private async callOpenAI(messages: any[], options: any = {}) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature || 0.7,
        ...options
      })

      return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
    } catch (error: any) {
      console.error('OpenAI API Error:', error)
      if (error.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your configuration.')
      }
      throw new Error('AI service temporarily unavailable. Please try again.')
    }
  }

  async chatCompletion(messages: Array<{ role: string; content: string }>): Promise<AIResponse> {
    const systemMessage = {
      role: 'system',
      content: 'You are AURA, a helpful AI assistant focused on productivity, note-taking, and habit building. Be concise, helpful, and encouraging. Always provide actionable advice.'
    }

    const response = await this.callOpenAI([systemMessage, ...messages])
    
    return {
      content: response,
      type: 'chat',
      metadata: {
        model: 'gpt-3.5-turbo',
        timestamp: new Date().toISOString()
      }
    }
  }

  async summarizeText(text: string): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'You are an expert at creating concise, informative summaries. Extract the key points and present them clearly.'
      },
      {
        role: 'user',
        content: `Please create a concise summary of the following text:\n\n${text}`
      }
    ]

    const response = await this.callOpenAI(messages, { maxTokens: 300 })
    
    return {
      content: response,
      type: 'summary'
    }
  }

  async generateFlashcards(text: string): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'Create educational flashcards from the given text. Return ONLY a JSON array of objects with "front" (question) and "back" (answer) properties. Maximum 10 cards.'
      },
      {
        role: 'user',
        content: `Create flashcards from this text:\n\n${text}`
      }
    ]

    try {
      const response = await this.callOpenAI(messages, { maxTokens: 800, temperature: 0.3 })
      
      // Try to parse JSON, fallback to structured text if needed
      let flashcards
      try {
        flashcards = JSON.parse(response)
      } catch {
        // If JSON parsing fails, create basic flashcards
        flashcards = [
          {
            front: "What is the main topic of this content?",
            back: text.substring(0, 100) + "..."
          }
        ]
      }

      return {
        content: JSON.stringify(flashcards),
        type: 'flashcards'
      }
    } catch (error) {
      // Fallback flashcards
      const fallbackCards = [
        {
          front: "What is this content about?",
          back: text.substring(0, 100) + "..."
        }
      ]
      
      return {
        content: JSON.stringify(fallbackCards),
        type: 'flashcards'
      }
    }
  }

  async generateMindmap(text: string): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'Create a mindmap structure from the given text. Return ONLY a JSON array of objects with "topic" and "subtopics" (array of strings) properties.'
      },
      {
        role: 'user',
        content: `Create a mindmap structure from this text:\n\n${text}`
      }
    ]

    try {
      const response = await this.callOpenAI(messages, { maxTokens: 600, temperature: 0.3 })
      
      let mindmap
      try {
        mindmap = JSON.parse(response)
      } catch {
        // Fallback mindmap
        mindmap = [
          {
            topic: "Main Topic",
            subtopics: ["Key Point 1", "Key Point 2", "Key Point 3"]
          }
        ]
      }

      return {
        content: JSON.stringify(mindmap),
        type: 'mindmap'
      }
    } catch (error) {
      const fallbackMindmap = [
        {
          topic: "Content Overview",
          subtopics: ["Main Idea", "Supporting Details", "Conclusion"]
        }
      ]
      
      return {
        content: JSON.stringify(fallbackMindmap),
        type: 'mindmap'
      }
    }
  }

  async generateWriting(prompt: string): Promise<AIResponse> {
    const messages = [
      {
        role: 'system',
        content: 'You are a professional writer and editor. Help users create high-quality written content based on their requirements.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await this.callOpenAI(messages, { maxTokens: 800 })
    
    return {
      content: response,
      type: 'writing'
    }
  }
}

export const realAI = new RealAIService()
