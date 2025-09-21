import { Target, TrendingUp, Calendar, Award } from 'lucide-react'
import type { Habit } from '@/types'

interface HabitsStatsProps {
  habits: Habit[]
}

export default function HabitsStats({ habits }: HabitsStatsProps) {
  const activeHabits = habits.filter(h => h.isActive).length
  const totalStreak = habits.reduce((sum, habit) => sum + habit.currentStreak, 0)
  const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0)
  const completionRate = habits.length > 0 
    ? Math.round((habits.filter(h => {
        const today = new Date().toISOString().split('T')[0]
        return h.completions?.includes(today)
      }).length / habits.length) * 100)
    : 0

  const stats = [
    {
      label: 'Active Habits',
      value: activeHabits,
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      change: habits.length > activeHabits ? `${habits.length - activeHabits} inactive` : 'All active',
    },
    {
      label: 'Total Streak',
      value: totalStreak,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      change: 'days combined',
    },
    {
      label: 'Longest Streak',
      value: longestStreak,
      icon: Award,
      color: 'from-orange-500 to-red-500',
      change: 'personal best',
    },
    {
      label: 'Today Rate',
      value: `${completionRate}%`,
      icon: Calendar,
      color: 'from-purple-500 to-indigo-500',
      change: 'completed today',
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="card group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-gray-500 text-xs mt-1">{stat.change}</p>
            </div>
            
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
