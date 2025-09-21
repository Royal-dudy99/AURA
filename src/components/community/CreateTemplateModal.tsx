import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'

interface CreateTemplateModalProps {
  onClose: () => void
}

export default function CreateTemplateModal({ onClose }: CreateTemplateModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'productivity',
    tags: '',
    isPublic: true,
  })
  const [sections, setSections] = useState([''])
  const [prompts, setPrompts] = useState([''])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }))
  }

  const addSection = () => setSections([...sections, ''])
  const removeSection = (index: number) => setSections(sections.filter((_, i) => i !== index))
  const updateSection = (index: number, value: string) => {
    const newSections = [...sections]
    newSections[index] = value
    setSections(newSections)
  }

  const addPrompt = () => setPrompts([...prompts, ''])
  const removePrompt = (index: number) => setPrompts(prompts.filter((_, i) => i !== index))
  const updatePrompt = (index: number, value: string) => {
    const newPrompts = [...prompts]
    newPrompts[index] = value
    setPrompts(newPrompts)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.title.trim()) return

    setLoading(true)
    try {
      // In a real app, this would save to Firestore
      console.log('Creating template:', {
        ...formData,
        sections: sections.filter(s => s.trim()),
        prompts: prompts.filter(p => p.trim()),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      })
      onClose()
    } catch (error) {
      console.error('Error creating template:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Template Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="e.g., Daily Planner Template"
              required
            />
          </div>

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
              <option value="productivity">Productivity</option>
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="creativity">Creativity</option>
              <option value="business">Business</option>
              <option value="personal">Personal</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="input w-full h-24 resize-none"
            placeholder="Describe your template and how it helps others"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="input w-full"
            placeholder="planning, goals, daily, routine"
          />
        </div>

        {/* Sections */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              Template Sections
            </label>
            <button
              type="button"
              onClick={addSection}
              className="text-sm text-aura-cyan hover:text-aura-purple transition-colors flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Section</span>
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((section, index) => (
              <div key={index} className="flex space-x-3">
                <input
                  type="text"
                  value={section}
                  onChange={(e) => updateSection(index, e.target.value)}
                  className="input flex-1"
                  placeholder={`Section ${index + 1} (e.g., Daily Goals, Priority Tasks)`}
                />
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="p-3 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prompts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              Guided Prompts
            </label>
            <button
              type="button"
              onClick={addPrompt}
              className="text-sm text-aura-cyan hover:text-aura-purple transition-colors flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Prompt</span>
            </button>
          </div>

          <div className="space-y-3">
            {prompts.map((prompt, index) => (
              <div key={index} className="flex space-x-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => updatePrompt(index, e.target.value)}
                  className="input flex-1"
                  placeholder={`Prompt ${index + 1} (e.g., What are your top 3 priorities today?)`}
                />
                {prompts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrompt(index)}
                    className="p-3 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Public Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleInputChange}
            className="w-4 h-4 text-aura-cyan rounded focus:ring-2 focus:ring-aura-cyan/20"
          />
          <label htmlFor="isPublic" className="text-sm text-gray-300">
            Make this template public for others to discover and use
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Share Template
          </Button>
        </div>
      </form>
    </div>
  )
}
