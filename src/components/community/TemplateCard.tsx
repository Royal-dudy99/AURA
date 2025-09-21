import { useState } from 'react'
import { Heart, Download, Share, Bookmark } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import type { CommunityTemplate } from '@/types'

interface TemplateCardProps {
  template: CommunityTemplate
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  const handleDownload = () => {
    // In a real app, this would download or copy the template
    console.log('Downloading template:', template.id)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: template.title,
        text: template.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="card group hover:scale-105 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-white group-hover:text-aura-cyan transition-colors">
            {template.title}
          </h3>
          <p className="text-sm text-gray-400 capitalize">{template.category}</p>
        </div>

        <div className={`px-2 py-1 text-xs rounded-full ${
          template.category === 'education' 
            ? 'bg-blue-500/20 text-blue-400'
            : template.category === 'health'
            ? 'bg-green-500/20 text-green-400'
            : template.category === 'creativity'
            ? 'bg-purple-500/20 text-purple-400'
            : 'bg-gray-500/20 text-gray-400'
        }`}>
          {template.category}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {template.description}
      </p>

      {/* Content Preview */}
      <div className="bg-white/5 rounded-lg p-3 mb-4">
        <div className="text-xs text-gray-400 mb-2">Sections:</div>
        <div className="flex flex-wrap gap-1">
          {template.content.sections.slice(0, 4).map((section, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded"
            >
              {section}
            </span>
          ))}
          {template.content.sections.length > 4 && (
            <span className="px-2 py-1 text-xs text-gray-400">
              +{template.content.sections.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Tags */}
      {template.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-aura-cyan/20 text-aura-cyan rounded"
            >
              #{tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-400">
              +{template.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{template.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>{template.downloads}</span>
          </div>
        </div>
        <span>{formatRelativeTime(template.createdAt.toDate())}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-lg transition-colors ${
              liked 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-white/5 text-gray-400 hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              bookmarked 
                ? 'bg-yellow-500/20 text-yellow-400' 
                : 'bg-white/5 text-gray-400 hover:text-yellow-400'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <Share className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleDownload}
          className="btn-primary text-sm px-4 py-2 flex items-center space-x-1"
        >
          <Download className="w-4 h-4" />
          <span>Use Template</span>
        </button>
      </div>
    </div>
  )
}
