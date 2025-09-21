import { useNavigate } from 'react-router-dom'
import { Plus, Brain, Target, MessageSquare, Users } from 'lucide-react'

const actions = [
  {
    title: 'Create Note',
    description: 'Start a new AI-powered note',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    href: '/notes',
  },
  {
    title: 'Add Habit',
    description: 'Track a new habit',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    href: '/habits',
  },
  {
    title: 'AI Assistant',
    description: 'Get help with anything',
    icon: MessageSquare,
    color: 'from-purple-500 to-indigo-500',
    href: '/assistant',
  },
  {
    title: 'Browse Community',
    description: 'Discover templates',
    icon: Users,
    color: 'from-pink-500 to-rose-500',
    href: '/community',
  },
]

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.href)}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-white group-hover:text-aura-cyan transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {action.description}
                </p>
              </div>

              <Plus className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
