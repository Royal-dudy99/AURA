import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Timestamp } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { firestoreService } from '@/firebase/firestore'
import { HABIT_CATEGORIES } from '@/lib/constants'
import Button from '@/components/ui/Button'
import type { Habit } from '@/types'


interface CreateHabitModalProps {
  onHabitCreated: (habit: Habit) => void
}

export default function CreateHabitModal({ onHabitCreated }: CreateHabitModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Health',
    targetDays: 30,
    reminderTime: '09:00',
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'targetDays' ? parseInt(value) || 0 : value 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.title.trim()) return

    setLoading(true)
    try {
      const habitData = {
  title: formData.title.trim(),
  description: formData.description.trim(),
  category: formData.category,
  targetDays: formData.targetDays,
  currentStreak: 0,
  longestStreak: 0,
  completions: [],
  isActive: true,
  reminderTime: formData.reminderTime || undefined,
  createdAt: Timestamp.now(),    // THIS IS THE FIX!
  updatedAt: Timestamp.now()     // THIS IS THE FIX!
}


      const newHabit = await firestoreService.createHabit(user.uid, habitData)
      onHabitCreated(newHabit)
    } catch (error) {
      console.error('Error creating habit:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Habit Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="input w-full"
            placeholder="e.g., Morning Meditation, Daily Reading"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="input w-full h-24 resize-none"
            placeholder="Describe your habit and why it's important to you"
          />
        </div>

        {/* Category and Duration */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input w-full"
            >
              {HABIT_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Duration (days)
            </label>
            <input
              type="number"
              name="targetDays"
              value={formData.targetDays}
              onChange={handleInputChange}
              className="input w-full"
              min="1"
              max="365"
            />
          </div>
        </div>

        {/* Reminder Time */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reminder Time (optional)
          </label>
          <div className="relative">
            <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="time"
              name="reminderTime"
              value={formData.reminderTime}
              onChange={handleInputChange}
              className="input pl-12 w-full"
            />
          </div>
        </div>

        {/* Preset Options */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Setup</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: '21-Day Challenge', days: 21, category: 'Health' },
              { name: '30-Day Challenge', days: 30, category: 'Fitness' },
              { name: '66-Day Formation', days: 66, category: 'Productivity' },
              { name: '90-Day Transform', days: 90, category: 'Learning' },
            ].map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  targetDays: preset.days,
                  category: preset.category
                }))}
                className="p-3 text-left rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="font-medium text-white text-sm">{preset.name}</div>
                <div className="text-xs text-gray-400">{preset.days} days • {preset.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit" loading={loading}>
            Create Habit
          </Button>
        </div>
      </form>
    </div>
  )
}
