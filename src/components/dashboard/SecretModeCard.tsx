import React, { useState } from 'react'
import { Lock, Unlock, Heart, Star } from 'lucide-react'
import { useSecretMode } from '@/hooks/useSecretMode'

interface SecretModeCardProps {
  isUnlocked: boolean
  consecutiveDays: number
}

export default function SecretModeCard({ isUnlocked, consecutiveDays }: SecretModeCardProps) {
  const { isSecretModeEnabled, toggleSecretMode } = useSecretMode()
  const [showConsent, setShowConsent] = useState(false)

  const daysNeeded = Math.max(0, 3 - consecutiveDays)

  const handleToggleSecretMode = () => {
    if (!isUnlocked) return
    
    if (!isSecretModeEnabled) {
      setShowConsent(true)
    } else {
      toggleSecretMode()
    }
  }

  const handleConsentAccept = () => {
    toggleSecretMode()
    setShowConsent(false)
  }

  if (showConsent) {
    return (
      <div className="card border-2 border-pink-500/30">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-lg font-semibold text-white">AURA After Dark</h3>
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-sm text-yellow-200">
              <strong>18+ Content Warning:</strong> This mode includes playful, flirtatious but non-explicit motivational messages. You must be 18 or older to enable this feature.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowConsent(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleConsentAccept}
              className="btn-primary flex-1"
            >
              I'm 18+ & Accept
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`card ${isUnlocked ? 'border-2 border-pink-500/30' : 'border border-gray-700'}`}>
      <div className="text-center space-y-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
          isUnlocked 
            ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
            : 'bg-gray-700'
        }`}>
          {isUnlocked ? (
            <Unlock className="w-8 h-8 text-white" />
          ) : (
            <Lock className="w-8 h-8 text-gray-400" />
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white">
            🌙 AURA After Dark
          </h3>
          <p className="text-sm text-gray-400">
            Playful motivational messages
          </p>
        </div>

        {isUnlocked ? (
          <div className="space-y-3">
            <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2 text-pink-200">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Secret Mode Unlocked!</span>
              </div>
            </div>
            
            <button
              onClick={handleToggleSecretMode}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
                isSecretModeEnabled
                  ? 'bg-pink-500 hover:bg-pink-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {isSecretModeEnabled ? 'Disable Secret Mode' : 'Enable Secret Mode'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold text-white mb-1">
                {consecutiveDays} / 3 days
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(consecutiveDays / 3) * 100}%` }}
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-400">
              {daysNeeded > 0 
                ? `Complete habits for ${daysNeeded} more consecutive days to unlock`
                : 'Secret mode is ready to unlock!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
