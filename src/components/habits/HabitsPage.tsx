import React, { useState, useEffect } from 'react'
import { Plus, Target, TrendingUp, Calendar, Filter } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { firestoreService } from '@/firebase/firestore'
import Modal from '@/components/ui/Modal'
import CreateHabitModal from './CreateHabitModal'
import HabitCard from './HabitCard'
import HabitsStats from './HabitsStats'
import ChallengesSection from './ChallengesSection'
import type { Habit } from '@/types'

export default function HabitsPage() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    if (!user) return

    const loadHabits = async () => {
      try {
        const userHabits = await firestoreService.getHabits(user.uid)
        setHabits(userHabits)
      } catch (error) {
        console.error('Error loading habits:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHabits()
  }, [user])

  const filteredHabits = habits.filter(habit => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && habit.isActive) ||
      (filter === 'completed' && !habit.isActive)
    
    const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory

    return matchesFilter && matchesCategory
  })

  const handleHabitCreated = (newHabit: Habit) => {
    setHabits(prev => [newHabit, ...prev])
    setShowCreateModal(false)
  }

  const handleHabitUpdated = (updatedHabit: Habit) => {
    setHabits(prev => prev.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
            <Target className="w-8 h-8 text-aura-cyan" />
            <span>Habits & Goals</span>
          </h1>
          <p className="text-gray-400">
            Build lasting habits and track your progress
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary mt-4 lg:mt-0 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Habit</span>
        </button>
      </div>

      {/* Stats */}
      <HabitsStats habits={habits} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex space-x-2">
          {(['all', 'active', 'completed'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-aura-cyan text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input sm:w-48"
        >
          <option value="all">All Categories</option>
          <option value="Health">Health</option>
          <option value="Fitness">Fitness</option>
          <option value="Learning">Learning</option>
          <option value="Productivity">Productivity</option>
          <option value="Mindfulness">Mindfulness</option>
          <option value="Creativity">Creativity</option>
        </select>
      </div>

      {/* Habits Grid */}
      {filteredHabits.length > 0 ? (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHabits.map((habit) => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              onUpdate={handleHabitUpdated}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Target className="w-24 h-24 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {filter !== 'all' || selectedCategory !== 'all' 
              ? 'No habits match your filters' 
              : 'No habits yet'
            }
          </h3>
          <p className="text-gray-400 mb-8">
            {filter !== 'all' || selectedCategory !== 'all'
              ? 'Try adjusting your filters or create a new habit'
              : 'Start building better habits today'
            }
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Your First Habit
          </button>
        </div>
      )}

      {/* Challenges Section */}
      <ChallengesSection />

      {/* Create Habit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Habit"
        size="lg"
      >
        <CreateHabitModal onHabitCreated={handleHabitCreated} />
      </Modal>
    </div>
  )
}
