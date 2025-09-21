import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Loader, Sparkles, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { firestoreService } from '@/firebase/firestore'
import { aiService } from '@/lib/aiService'
import { NOTE_CATEGORIES } from '@/lib/constants'
import Button from '@/components/ui/Button'
import type { Note } from '@/types'

interface CreateNoteModalProps {
  onNoteCreated: (note: Note) => void
}

export default function CreateNoteModal({ onNoteCreated }: CreateNoteModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Personal',
    tags: '',
  })
  const [loading, setLoading] = useState(false)
  const [aiProcessing, setAiProcessing] = useState(false)
  const [aiResults, setAiResults] = useState<{
    summary?: string
    flashcards?: any[]
    mindmap?: any[]
  }>({})

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setFormData(prev => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        content: prev.content + '\n\n' + content
      }))
    }
    reader.readAsText(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/pdf': ['.pdf'] // Note: PDF parsing would need additional library
    },
    multiple: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const processWithAI = async () => {
    if (!formData.content.trim()) return

    setAiProcessing(true)
    try {
      const [summaryRes, flashcardsRes, mindmapRes] = await Promise.all([
  aiService.summarizeText(formData.content),
  aiService.generateFlashcards(formData.content),
  aiService.generateMindmap(formData.content)
])

      setAiResults({
        summary: summaryRes.content,
        flashcards: JSON.parse(flashcardsRes.content),
        mindmap: JSON.parse(mindmapRes.content)
      })
    } catch (error) {
      console.error('AI processing error:', error)
    } finally {
      setAiProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.title.trim() || !formData.content.trim()) return

    setLoading(true)
    try {
      const noteData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: aiResults.summary,
        flashcards: aiResults.flashcards || [],
        mindmap: aiResults.mindmap || [],
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      }

      const newNote = await firestoreService.createNote(user.uid, noteData)
      onNoteCreated(newNote)
    } catch (error) {
      console.error('Error creating note:', error)
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
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Enter note title"
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
              {NOTE_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
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
            placeholder="productivity, learning, ideas"
          />
        </div>

        {/* File Upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isDragActive 
              ? 'border-aura-cyan bg-aura-cyan/5' 
              : 'border-white/20 hover:border-white/40'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-white mb-2">
            {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
          </p>
          <p className="text-gray-400 text-sm">
            Supports TXT, MD files (PDF parsing can be added)
          </p>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Content *
            </label>
            {formData.content.trim() && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={processWithAI}
                loading={aiProcessing}
                className="flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Process with AI</span>
              </Button>
            )}
          </div>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="input w-full h-48 resize-none"
            placeholder="Enter your note content or upload a file..."
            required
          />
        </div>

        {/* AI Results */}
        {Object.keys(aiResults).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-aura-cyan" />
              <span>AI Processing Results</span>
            </h3>

            {/* Summary */}
            {aiResults.summary && (
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Summary</h4>
                <p className="text-gray-300 text-sm">{aiResults.summary}</p>
              </div>
            )}

            {/* Flashcards */}
            {aiResults.flashcards && aiResults.flashcards.length > 0 && (
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">
                  Flashcards ({aiResults.flashcards.length})
                </h4>
                <div className="space-y-2">
                  {aiResults.flashcards.slice(0, 3).map((card, index) => (
                    <div key={index} className="bg-white/5 rounded p-3">
                      <p className="text-sm text-gray-300">
                        <strong>Q:</strong> {card.front}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        <strong>A:</strong> {card.back}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button type="submit" loading={loading}>
            Create Note
          </Button>
        </div>
      </form>
    </div>
  )
}
