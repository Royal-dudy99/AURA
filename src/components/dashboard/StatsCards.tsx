import React from 'react'
import { Brain, Target, TrendingUp, Trophy } from 'lucide-react'

interface StatsCardsProps {
  totalNotes: number
  totalHabits: number
  longestStreak: number
  challengesCompleted: number
}

export default function StatsCards({ 
  totalNotes, 
  totalHabits, 
  longestStreak, 
  challengesCompleted 
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Notes Created',
      value: totalNotes,
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
    },
    {
      label: 'Active Habits',
      value: totalHabits,
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      change: '+8%',
    },
    {
      label: 'Longest Streak',
      value: longestStreak,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      change: '+3 days',
    },
    {
      label: 'Challenges Done',
      value: challengesCompleted,
      icon: Trophy,
      color: 'from-purple-500 to-indigo-500',
      change: '+2',
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
              <p className="text-green-400 text-xs mt-1">{stat.change}</p>
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
