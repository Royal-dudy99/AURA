import { useState, useEffect } from 'react'
import { Plus, Search, Brain } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { firestoreService } from '@/firebase/firestore'
import Modal from '@/components/ui/Modal'
import CreateNoteModal from './CreateNoteModal'
import NoteCard from './NoteCard'
import type { Note } from '@/types'

export default function AINotesPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (!user) return

    const loadNotes = async () => {
      try {
        const userNotes = await firestoreService.getNotes(user.uid)
        setNotes(userNotes)
      } catch (error) {
        console.error('Error loading notes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNotes()
  }, [user])

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleNoteCreated = (newNote: Note) => {
    setNotes(prev => [newNote, ...prev])
    setShowCreateModal(false)
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
            <Brain className="w-8 h-8 text-aura-cyan" />
            <span>AI Notes</span>
          </h1>
          <p className="text-gray-400">
            Create smart notes with AI-powered summaries and flashcards
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary mt-4 lg:mt-0 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Note</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search notes..."
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
          <option value="all">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
          <option value="Research">Research</option>
        </select>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Brain className="w-24 h-24 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-gray-400 mb-8">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first AI-powered note to get started'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Note
            </button>
          )}
        </div>
      )}

      {/* Create Note Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Note"
        size="lg"
      >
        <CreateNoteModal onNoteCreated={handleNoteCreated} />
      </Modal>
    </div>
  )
}
