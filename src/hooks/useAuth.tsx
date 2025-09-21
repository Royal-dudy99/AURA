import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { authService } from '@/firebase/auth'
import { firestoreService } from '@/firebase/firestore'
import type { UserProfile } from '@/types'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        try {
          let profile = await firestoreService.getUserProfile(user.uid)
          
          if (!profile) {
            // Create new user profile
            profile = {
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName || 'Anonymous',
              photoURL: user.photoURL,
              preferences: {
                theme: 'dark' as const,
                language: 'en',
                notifications: true,
                secretModeEnabled: false,
              },
              stats: {
                totalNotes: 0,
                totalHabits: 0,
                longestStreak: 0,
                challengesCompleted: 0,
              },
              createdAt: new Date() as any,
              updatedAt: new Date() as any,
            }
            
            await firestoreService.setUserProfile(user.uid, profile)
          }
          
          setUserProfile(profile)
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true)
    try {
      await authService.signUp(email, password, displayName)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      await authService.signIn(email, password)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      await authService.signInWithGoogle()
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email)
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
