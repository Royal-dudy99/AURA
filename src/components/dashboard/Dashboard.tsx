import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSecretMode } from '@/hooks/useSecretMode'
import { firestoreService } from '@/firebase/firestore'
import QuickActions from './QuickActions'
import HabitWidget from './HabitWidget'
import RecentNotes from './RecentNotes'
import TodaysTasks from './TodaysTasks'
import StatsCards from './StatsCards'
import AIQuickInput from './AIQuickInput'
import SecretModeCard from './SecretModeCard'
import type { Note, Habit } from '@/types'

export default function Dashboard() {
  const { user, userProfile } = useAuth()
  const { isSecretModeUnlocked, consecutiveDays } = useSecretMode()
  const [recentNotes, setRecentNotes] = useState<Note[]>([])
  const [activeHabits, setActiveHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadDashboardData = async () => {
      try {
        const [notes, habits] = await Promise.all([
          firestoreService.getNotes(user.uid, 5),
          firestoreService.getHabits(user.uid),
        ])

        setRecentNotes(notes)
        setActiveHabits(habits.filter(habit => habit.isActive))
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userProfile?.displayName?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-gray-400">
            Ready to make today productive and meaningful?
          </p>
        </div>

        <div className="mt-4 lg:mt-0">
          <div className="text-right text-sm text-gray-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards
        totalNotes={userProfile?.stats?.totalNotes || 0}
        totalHabits={userProfile?.stats?.totalHabits || 0}
        longestStreak={userProfile?.stats?.longestStreak || 0}
        challengesCompleted={userProfile?.stats?.challengesCompleted || 0}
      />

      {/* AI Quick Input */}
      <AIQuickInput />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <QuickActions />
          <TodaysTasks habits={activeHabits} />
          <RecentNotes notes={recentNotes} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <HabitWidget habits={activeHabits} />
          
          {/* Secret Mode Card */}
          {(!isSecretModeUnlocked || consecutiveDays >= 3) && (
            <SecretModeCard 
              isUnlocked={isSecretModeUnlocked}
              consecutiveDays={consecutiveDays}
            />
          )}
        </div>
      </div>
    </div>
  )
}
