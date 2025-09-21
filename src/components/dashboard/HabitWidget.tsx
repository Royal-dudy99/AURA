import React from 'react'
import { Link } from 'react-router-dom'
import { Target, TrendingUp, Calendar, ArrowRight } from 'lucide-react'
import type { Habit } from '@/types'

interface HabitWidgetProps {
  habits: Habit[]
}

export default function HabitWidget({ habits }: HabitWidgetProps) {
  const today = new Date().toISOString().split('T')[0]
  const completedToday = habits.filter(habit => 
    habit.completions?.includes(today)
  ).length

  const totalStreak = habits.reduce((sum, habit) => sum + habit.currentStreak, 0)
  const completionRate = habits.length > 0 
    ? Math.round((completedToday / habits.length) * 100)
    : 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Habits Overview</h2>
        <Link 
          to="/habits"
          className="text-aura-cyan hover:text-aura-purple transition-colors text-sm font-medium flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Progress Ring */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${completionRate * 3.14} 314`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{completionRate}%</div>
              <div className="text-xs text-gray-400">Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 mx-auto mb-2">
            <Target className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-lg font-semibold text-white">{completedToday}</div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 mx-auto mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg font-semibold text-white">{totalStreak}</div>
          <div className="text-xs text-gray-400">Total Streak</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 mx-auto mb-2">
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-semibold text-white">{habits.length}</div>
          <div className="text-xs text-gray-400">Active</div>
        </div>
      </div>

      {/* Recent Habits */}
      {habits.length > 0 ? (
        <div className="space-y-3">
          {habits.slice(0, 3).map((habit) => (
            <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">{habit.title}</h3>
                <p className="text-xs text-gray-400">
                  {habit.currentStreak} day streak
                </p>
              </div>
              
              <div className={`w-3 h-3 rounded-full ${
                habit.completions?.includes(today) 
                  ? 'bg-green-400' 
                  : 'bg-gray-600'
              }`} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No habits yet</p>
          <Link
            to="/habits"
            className="btn-primary text-sm"
          >
            Create Your First Habit
          </Link>
        </div>
      )}
    </div>
  )
}
