/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './useAuth'
import { firestoreService } from '@/firebase/firestore'
import rawSecretMessages from '@/data/secretMessages.json'
import type { SecretMessage, UserProfile } from '@/types'

// Allowed categories as const
const allowedCategories = ['motivation', 'habit', 'success', 'general'] as const
type SecretMessageCategory = typeof allowedCategories[number]

// Helper to check and cast JSON messages to correct types
function sanitizeSecretMessages(messages: unknown[]): SecretMessage[] {
  return messages
    .filter(
      (msg: unknown): msg is SecretMessage =>
        typeof msg === 'object' &&
        msg !== null &&
        typeof (msg as Record<string, unknown>).id === 'string' &&
        typeof (msg as Record<string, unknown>).text === 'string' &&
        typeof (msg as Record<string, unknown>).category === 'string' &&
        allowedCategories.includes((msg as Record<string, unknown>).category as SecretMessageCategory)
    )
    .map((msg) => ({
      ...msg,
      category: msg.category as SecretMessageCategory,
    }))
}

const secretMessages: SecretMessage[] = sanitizeSecretMessages(
  Array.isArray(rawSecretMessages) ? rawSecretMessages : []
)

interface SecretModeContextType {
  isSecretModeEnabled: boolean
  isSecretModeUnlocked: boolean
  consecutiveDays: number
  toggleSecretMode: () => void
  getSecretMessage: (category?: SecretMessageCategory) => SecretMessage
  checkDailyProgress: () => Promise<void>
}

const SecretModeContext = createContext<SecretModeContextType | undefined>(undefined)

export function useSecretMode() {
  const context = useContext(SecretModeContext)
  if (context === undefined) {
    throw new Error('useSecretMode must be used within a SecretModeProvider')
  }
  return context
}

interface SecretModeProviderProps {
  children: ReactNode
}

export function SecretModeProvider({ children }: SecretModeProviderProps) {
  const { user, userProfile } = useAuth()
  const [isSecretModeEnabled, setIsSecretModeEnabled] = useState(false)
  const [isSecretModeUnlocked, setIsSecretModeUnlocked] = useState(false)
  const [consecutiveDays, setConsecutiveDays] = useState(0)

  const checkDailyProgress = async () => {
    if (!user) return

    try {
      const habits = await firestoreService.getHabits(user.uid)
      let consecutive = 0
      const currentDate = new Date()
      for (let i = 0; i < 30; i++) {
        const dateStr = currentDate.toISOString().split('T')[0]
        const hasCompletion = habits.some(habit =>
          habit.completions?.includes(dateStr)
        )
        if (hasCompletion) {
          consecutive++
        } else {
          break
        }
        currentDate.setDate(currentDate.getDate() - 1)
      }
      setConsecutiveDays(consecutive)
      setIsSecretModeUnlocked(consecutive >= 3)
    } catch (error) {
      console.error('Error checking daily progress:', error)
    }
  }

  useEffect(() => {
    if (userProfile) {
      setIsSecretModeEnabled(userProfile.preferences.secretModeEnabled)
      checkDailyProgress()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile])

  const toggleSecretMode = async () => {
    if (!user || !isSecretModeUnlocked) return

    const newState = !isSecretModeEnabled
    setIsSecretModeEnabled(newState)

    try {
      await firestoreService.setUserProfile(user.uid, {
        preferences: {
          ...userProfile?.preferences,
          secretModeEnabled: newState,
        },
      } as Partial<UserProfile>)
    } catch (error) {
      console.error('Error updating secret mode:', error)
      setIsSecretModeEnabled(!newState)
    }
  }

  const getSecretMessage = (category: SecretMessageCategory = 'general'): SecretMessage => {
    const messages = secretMessages.filter(msg =>
      category === 'general' ? true : msg.category === category
    )
    const randomIndex = Math.floor(Math.random() * messages.length)
    return messages[randomIndex] || secretMessages[0]
  }

  const value: SecretModeContextType = {
    isSecretModeEnabled,
    isSecretModeUnlocked,
    consecutiveDays,
    toggleSecretMode,
    getSecretMessage,
    checkDailyProgress,
  }

  return (
    <SecretModeContext.Provider value={value}>
      {children}
    </SecretModeContext.Provider>
  )
}
