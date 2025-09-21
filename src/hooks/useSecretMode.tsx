import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './useAuth'
import { firestoreService } from '@/firebase/firestore'
import secretMessages from '@/data/secretMessages.json'
import type { SecretMessage } from '@/types'

interface SecretModeContextType {
  isSecretModeEnabled: boolean
  isSecretModeUnlocked: boolean
  consecutiveDays: number
  toggleSecretMode: () => void
  getSecretMessage: (category?: string) => SecretMessage
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

  useEffect(() => {
    if (userProfile) {
      setIsSecretModeEnabled(userProfile.preferences.secretModeEnabled)
      // Check if secret mode is unlocked (3+ consecutive days)
      checkDailyProgress()
    }
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
        } as any,
      })
    } catch (error) {
      console.error('Error updating secret mode:', error)
      // Revert state on error
      setIsSecretModeEnabled(!newState)
    }
  }

  const checkDailyProgress = async () => {
    if (!user) return

    try {
      const habits = await firestoreService.getHabits(user.uid)
      
      
      // Calculate consecutive days with habit completions
      let consecutive = 0
      let currentDate = new Date()

      // Check last 30 days for consecutive completions
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

  const getSecretMessage = (category = 'general'): SecretMessage => {
    const messages = secretMessages.filter(msg => 
      category === 'general' || msg.category === category
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
