import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Brain, 
  Target, 
  MessageSquare, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'AI Notes', href: '/notes', icon: Brain },
  { name: 'Habits', href: '/habits', icon: Target },
  { name: 'AI Assistant', href: '/assistant', icon: MessageSquare },
  { name: 'Community', href: '/community', icon: Users },
]

export default function Sidebar() {
  const location = useLocation()
  const { signOut, userProfile } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-gray-900/50 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 p-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-aura flex items-center justify-center animate-pulse-glow">
              <div className="w-5 h-5 rounded-full bg-white/20" />
            </div>
            <span className="text-xl font-bold gradient-text">AURA</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-aura text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-aura flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userProfile?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {userProfile?.email}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to="/settings"
                className="flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
