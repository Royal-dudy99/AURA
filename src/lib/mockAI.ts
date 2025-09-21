import type { AIResponse, Flashcard, MindmapNode } from '@/types'

// Mock AI service that provides deterministic responses
// Easy to replace with real OpenAI API later
export class MockAIService {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async summarizeText(text: string): Promise<AIResponse> {
    await this.delay(1000) // Simulate API call

    // Simple extraction of first few sentences as summary
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const summary = sentences.slice(0, 3).join('. ') + (sentences.length > 3 ? '.' : '')

    return {
      content: summary || 'Unable to generate summary for this text.',
      type: 'summary',
      metadata: { originalLength: text.length, summaryLength: summary.length }
    }
  }

  async generateFlashcards(text: string): Promise<AIResponse> {
    await this.delay(1200)

    // Simple keyword extraction for flashcards
    const words = text.toLowerCase().split(/\s+/)
    const keywords = words.filter(word => 
      word.length > 6 && 
      !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word)
    )

    const flashcards: Flashcard[] = keywords.slice(0, 5).map((keyword, index) => ({
      id: `fc_${index}`,
      front: `What is ${keyword}?`,
      back: `Key concept from your notes: ${keyword}`,
      difficulty: 'medium' as const,
    }))

    return {
      content: JSON.stringify(flashcards),
      type: 'flashcards',
      metadata: { count: flashcards.length }
    }
  }

  async generateMindmap(text: string): Promise<AIResponse> {
    await this.delay(1500)

    // Extract main topics for mindmap
    const sentences = text.split(/[.!?]+/)
    const topics = sentences.slice(0, 6).map(sentence => sentence.trim().substring(0, 30))

    const mindmap: MindmapNode[] = [
      {
        id: 'center',
        text: 'Main Topic',
        x: 200,
        y: 150,
        connections: topics.map((_, i) => `node_${i}`),
        color: '#06b6d4'
      },
      ...topics.map((topic, index) => ({
        id: `node_${index}`,
        text: topic,
        x: 100 + (index % 3) * 150,
        y: 50 + Math.floor(index / 3) * 100,
        connections: ['center'],
        color: ['#8b5cf6', '#6366f1', '#10b981'][index % 3]
      }))
    ]

    return {
      content: JSON.stringify(mindmap),
      type: 'mindmap',
      metadata: { nodeCount: mindmap.length }
    }
  }

  async chatCompletion(messages: { role: string; content: string }[]): Promise<AIResponse> {
    await this.delay(800)

    const lastMessage = messages[messages.length - 1]?.content || ''
    
    // Simple response generation based on keywords
    let response = "I understand you're asking about " + lastMessage.substring(0, 50) + "..."
    
    if (lastMessage.toLowerCase().includes('help')) {
      response = "I'm here to help! You can ask me to summarize text, create flashcards, generate ideas, or assist with planning."
    } else if (lastMessage.toLowerCase().includes('summary') || lastMessage.toLowerCase().includes('summarize')) {
      response = "I can help you create summaries! Just paste your text and I'll extract the key points for you."
    } else if (lastMessage.toLowerCase().includes('flashcard')) {
      response = "Flashcards are great for learning! I can generate questions and answers from your notes to help you study effectively."
    } else if (lastMessage.toLowerCase().includes('plan')) {
      response = "Let's create a plan! Break down your goal into smaller, actionable steps. What would you like to plan for?"
    } else if (lastMessage.toLowerCase().includes('habit')) {
      response = "Building habits takes consistency! Start small, track your progress, and celebrate small wins. What habit are you working on?"
    }

    return {
      content: response,
      type: 'chat',
      metadata: { timestamp: new Date().toISOString() }
    }
  }

  async generateWriting(prompt: string): Promise<AIResponse> {
    await this.delay(1200)

    const templates = {
      'email': `Subject: ${prompt}

Dear [Recipient],

I hope this email finds you well. I'm writing to...

[Generated based on your prompt: ${prompt}]

Best regards,
[Your name]`,
      'blog': `# ${prompt}

## Introduction
This blog post explores the topic of ${prompt}...

## Main Points
1. First key insight
2. Supporting evidence
3. Practical applications

## Conclusion
In summary, ${prompt} is important because...`,
      'essay': `# ${prompt}

## Thesis Statement
This essay will examine ${prompt} and its implications...

## Body Paragraphs
### Argument 1
[First supporting argument]

### Argument 2
[Second supporting argument]

## Conclusion
Therefore, ${prompt} demonstrates that...`
    }

    const type = prompt.toLowerCase().includes('email') ? 'email' : 
                 prompt.toLowerCase().includes('blog') ? 'blog' : 'essay'

    return {
      content: templates[type],
      type: 'writing',
      metadata: { template: type, prompt }
    }
  }
}

export const mockAI = new MockAIService()

// Instructions for switching to OpenAI:
export const OPENAI_INTEGRATION_GUIDE = `
To integrate with OpenAI API:

1. Install openai package: npm install openai
2. Add your API key to .env: OPENAI_API_KEY=sk-your-key
3. Replace MockAIService with OpenAI client:

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
})

export class RealAIService {
  async summarizeText(text: string): Promise<AIResponse> {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that creates concise summaries." },
        { role: "user", content: \`Please summarize this text: \${text}\` }
      ],
      model: "gpt-3.5-turbo",
    })
    
    return {
      content: completion.choices[0]?.message?.content || '',
      type: 'summary'
    }
  }
  
  // Similar implementations for other methods...
}
`
