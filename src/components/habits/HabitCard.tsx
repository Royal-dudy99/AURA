import { CheckCircle, Circle, Target, TrendingUp, Flame, Settings, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { firestoreService } from '@/firebase/firestore'
import type { Habit } from '@/types'

interface HabitCardProps {
  habit: Habit
  onUpdate: (habit: Habit) => void
}

export default function HabitCard({ habit, onUpdate }: HabitCardProps) {
  const { user } = useAuth()
  const today = new Date().toISOString().split('T')[0]
  const isCompletedToday = habit.completions?.includes(today)

  const progressPercentage = Math.round((habit.currentStreak / habit.targetDays) * 100)
  const circumference = 2 * Math.PI * 45 // radius of 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  const handleToggleCompletion = async () => {
    if (!user) return

    try {
      if (isCompletedToday) {
        // Remove completion
        const newCompletions = habit.completions?.filter(date => date !== today) || []
        const updatedHabit = {
          ...habit,
          completions: newCompletions,
          currentStreak: Math.max(0, habit.currentStreak - 1),
        }
        await firestoreService.updateHabit(user.uid, habit.id, updatedHabit)
        onUpdate(updatedHabit)
      } else {
        // Add completion
        await firestoreService.checkInHabit(user.uid, habit.id, today)
        const updatedHabit = {
          ...habit,
          completions: [...(habit.completions || []), today],
          currentStreak: habit.currentStreak + 1,
          longestStreak: Math.max(habit.longestStreak, habit.currentStreak + 1),
        }
        onUpdate(updatedHabit)
      }
    } catch (error) {
      console.error('Error toggling habit completion:', error)
    }
  }

  return (
    <div className="card group hover:scale-105 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">{habit.title}</h3>
          <p className="text-sm text-gray-400">{habit.category}</p>
          {habit.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {habit.description}
            </p>
          )}
        </div>

        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient-progress)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="gradient-progress" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{habit.currentStreak}</div>
              <div className="text-xs text-gray-400">days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 mx-auto mb-2">
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm font-semibold text-white">{progressPercentage}%</div>
          <div className="text-xs text-gray-400">Progress</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20 mx-auto mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-sm font-semibold text-white">{habit.longestStreak}</div>
          <div className="text-xs text-gray-400">Best</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 mx-auto mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-sm font-semibold text-white">{habit.targetDays}</div>
          <div className="text-xs text-gray-400">Goal</div>
        </div>
      </div>

      {/* Check-in Button */}
      <button
        onClick={handleToggleCompletion}
        className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
          isCompletedToday
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
        }`}
      >
        {isCompletedToday ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Completed Today!</span>
          </>
        ) : (
          <>
            <Circle className="w-5 h-5" />
            <span>Mark as Complete</span>
          </>
        )}
      </button>

      {/* Reminder */}
      {habit.reminderTime && (
        <div className="mt-3 text-center text-xs text-gray-500">
          Reminder: {habit.reminderTime}
        </div>
      )}
    </div>
  )
}
