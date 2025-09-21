import { useState, useEffect } from 'react'
import { Trophy, Users, Clock, ArrowRight } from 'lucide-react'
import { firestoreService } from '@/firebase/firestore'
import type { Challenge } from '@/types'

export default function ChallengesSection() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const allChallenges = await firestoreService.getChallenges()
        setChallenges(allChallenges.slice(0, 6)) // Show top 6
      } catch (error) {
        console.error('Error loading challenges:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChallenges()
  }, [])

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-aura-cyan" />
          <h2 className="text-xl font-semibold text-white">Popular Challenges</h2>
        </div>
        
        <button className="text-aura-cyan hover:text-aura-purple transition-colors text-sm font-medium flex items-center space-x-1">
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-white group-hover:text-aura-cyan transition-colors">
                  {challenge.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {challenge.description}
                </p>
              </div>
              
              <div className={`px-2 py-1 text-xs rounded-full ${
                challenge.difficulty === 'beginner' 
                  ? 'bg-green-500/20 text-green-400'
                  : challenge.difficulty === 'intermediate'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {challenge.difficulty}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{challenge.duration} days</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{challenge.participants.toLocaleString()}</span>
              </div>
              
              <div className="text-green-400">
                {challenge.completionRate}% complete
              </div>
            </div>

            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-aura-cyan to-aura-purple h-1 rounded-full transition-all duration-500"
                  style={{ width: `${challenge.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
