import React from 'react'
import { Bell, Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useSecretMode } from '@/hooks/useSecretMode'
import { useTranslation } from 'react-i18next'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { isSecretModeEnabled, getSecretMessage } = useSecretMode()
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en'
    i18n.changeLanguage(newLang)
  }

  const secretMessage = isSecretModeEnabled ? getSecretMessage() : null

  return (
    <header className="h-16 border-b border-white/10 bg-gray-900/30 backdrop-blur-sm flex items-center justify-between px-6">
      {/* Secret Mode Message */}
      {secretMessage && (
        <div className="flex-1 max-w-md">
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full px-4 py-2">
            <p className="text-sm text-pink-200 text-center animate-pulse">
              {secretMessage.text}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          title="Toggle Language"
        >
          <Globe className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  )
}
