import { Timestamp } from 'firebase/firestore'


export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  preferences: {
    theme: 'light' | 'dark'
    language: string
    notifications: boolean
    secretModeEnabled: boolean
  }
  stats: {
    totalNotes: number
    totalHabits: number
    longestStreak: number
    challengesCompleted: number
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}


export interface Note {
  id: string
  title: string
  content: string
  summary?: string
  flashcards?: Flashcard[]
  mindmap?: MindmapNode[]
  tags: string[]
  category: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: 'easy' | 'medium' | 'hard'
  lastReviewed?: Timestamp
  nextReview?: Timestamp
}

export interface MindmapNode {
  id: string
  text: string
  x: number
  y: number
  connections: string[]
  color?: string
}

export interface Habit {
  id: string
  title: string
  description: string
  category: string
  targetDays: number
  currentStreak: number
  longestStreak: number
  completions: string[] // ISO date strings
  isActive: boolean
  reminderTime?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Challenge {
  id: string
  title: string
  description: string
  duration: number // days
  category: string
  tasks: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  participants: number
  completionRate: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CommunityTemplate {
  id: string
  title: string
  description: string
  category: string
  content: {
    sections: string[]
    prompts: string[]
  }
  tags: string[]
  likes: number
  downloads: number
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface PromptTemplate {
  id: string
  title: string
  content: string
  category: string
  isCustom: boolean
  isPublic: boolean
  usageCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Timestamp
}

export interface SecretMessage {
  id: string
  text: string
  category: 'motivation' | 'success' | 'habit' | 'general'
  intensity: 'mild' | 'medium' | 'playful'
}

export interface AIResponse {
  content: string
  type: 'summary' | 'flashcards' | 'mindmap' | 'chat' | 'writing'
  metadata?: Record<string, any>
}

export type ThemeMode = 'light' | 'dark'
