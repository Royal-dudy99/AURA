import { Link } from 'react-router-dom'
import { Brain, ArrowRight, FileText } from 'lucide-react'
import { formatRelativeTime, truncateText } from '@/lib/utils'
import type { Note } from '@/types'

interface RecentNotesProps {
  notes: Note[]
}

export default function RecentNotes({ notes }: RecentNotesProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Notes</h2>
        <Link 
          to="/notes"
          className="text-aura-cyan hover:text-aura-purple transition-colors text-sm font-medium flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <Link
              key={note.id}
              to={`/notes/${note.id}`}
              className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white group-hover:text-aura-cyan transition-colors">
                    {note.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {truncateText(note.content, 120)}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      {note.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(note.updatedAt.toDate())}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No notes yet</p>
          <Link
            to="/notes"
            className="btn-primary"
          >
            Create Your First Note
          </Link>
        </div>
      )}
    </div>
  )
}
