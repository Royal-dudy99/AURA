import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Eye, Edit, Trash2, Brain, Target } from 'lucide-react'
import { formatRelativeTime, truncateText } from '@/lib/utils'
import type { Note } from '@/types'

interface NoteCardProps {
  note: Note
}

export default function NoteCard({ note }: NoteCardProps) {
  const flashcardCount = note.flashcards?.length || 0
  const hasSummary = Boolean(note.summary)

  return (
    <div className="card group hover:scale-105 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-aura-cyan transition-colors">
              {note.title}
            </h3>
            <p className="text-sm text-gray-400">{note.category}</p>
          </div>
        </div>

        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/notes/${note.id}`}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            to={`/notes/${note.id}/edit`}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {truncateText(note.content, 150)}
      </p>

      {/* AI Features */}
      {(hasSummary || flashcardCount > 0) && (
        <div className="flex items-center space-x-4 mb-4">
          {hasSummary && (
            <div className="flex items-center space-x-1 text-aura-cyan">
              <Brain className="w-4 h-4" />
              <span className="text-xs">Summary</span>
            </div>
          )}
          {flashcardCount > 0 && (
            <div className="flex items-center space-x-1 text-aura-purple">
              <Target className="w-4 h-4" />
              <span className="text-xs">{flashcardCount} Cards</span>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded border border-gray-600"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-400">
              +{note.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{formatRelativeTime(note.updatedAt.toDate())}</span>
        <span>{note.content.length} chars</span>
      </div>
    </div>
  )
}
