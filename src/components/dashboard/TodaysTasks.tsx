import React from 'react'
import { CheckCircle, Circle, Target } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { firestoreService } from '@/firebase/firestore'
import type { Habit } from '@/types'

interface TodaysTasksProps {
  habits: Habit[]
}

export default function TodaysTasks({ habits }: TodaysTasksProps) {
  const { user } = useAuth()
  const today = new Date().toISOString().split('T')[0]

  const handleToggleHabit = async (habit: Habit) => {
    if (!user) return

    const isCompleted = habit.completions?.includes(today)
    
    try {
      if (isCompleted) {
        // Remove completion
        const newCompletions = habit.completions?.filter(date => date !== today) || []
        await firestoreService.updateHabit(user.uid, habit.id, {
          completions: newCompletions,
          currentStreak: Math.max(0, habit.currentStreak - 1),
        })
      } else {
        // Add completion
        await firestoreService.checkInHabit(user.uid, habit.id, today)
      }
    } catch (error) {
      console.error('Error toggling habit:', error)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="w-6 h-6 text-aura-cyan" />
        <h2 className="text-xl font-semibold text-white">Today's Tasks</h2>
      </div>

      {habits.length > 0 ? (
        <div className="space-y-3">
          {habits.map((habit) => {
            const isCompleted = habit.completions?.includes(today)
            
            return (
              <div
                key={habit.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <button
                  onClick={() => handleToggleHabit(habit)}
                  className="flex-shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 group-hover:text-aura-cyan transition-colors" />
                  )}
                </button>
                
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    isCompleted ? 'text-gray-400 line-through' : 'text-white'
                  }`}>
                    {habit.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {habit.currentStreak} day streak • {habit.category}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-400">
                    {habit.reminderTime || 'No reminder'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No habits to track today</p>
          <button className="btn-primary text-sm">
            Add Your First Habit
          </button>
        </div>
      )}
    </div>
  )
}
