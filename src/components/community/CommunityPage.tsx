import { useState, useEffect } from 'react'
import { Users, Search, Plus } from 'lucide-react'
import { firestoreService } from '@/firebase/firestore'
import TemplateCard from './TemplateCard'
import CreateTemplateModal from './CreateTemplateModal'
import Modal from '@/components/ui/Modal'
import type { CommunityTemplate } from '@/types'

export default function CommunityPage() {
  const [templates, setTemplates] = useState<CommunityTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const communityTemplates = await firestoreService.getCommunityTemplates()
        setTemplates(communityTemplates)
      } catch (error) {
        console.error('Error loading community templates:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [])

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'education', 'creativity', 'health', 'productivity', 'business', 'personal']

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
            <Users className="w-8 h-8 text-aura-cyan" />
            <span>Community Templates</span>
          </h1>
          <p className="text-gray-400">
            Discover and share productivity templates with the community
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary mt-4 lg:mt-0 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Share Template</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {templates.length}
          </div>
          <div className="text-gray-400 text-sm">Templates</div>
        </div>

        <div className="card text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {templates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">Downloads</div>
        </div>

        <div className="card text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {templates.reduce((sum, t) => sum + t.likes, 0).toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">Likes</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-12 w-full"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input lg:w-48"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)} 
              {category === 'all' ? ' Categories' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="w-24 h-24 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No templates found' : 'No templates yet'}
          </h3>
          <p className="text-gray-400 mb-8">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Be the first to share a template with the community'
            }
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create First Template
          </button>
        </div>
      )}

      {/* Create Template Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Share Template"
        size="lg"
      >
        <CreateTemplateModal onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  )
}
