import { realAI } from './realAI'
import { mockAI } from './mockAI'

// Switch between real and mock AI based on environment
const useRealAI = import.meta.env.VITE_OPENAI_API_KEY && 
                  import.meta.env.VITE_OPENAI_API_KEY.startsWith('sk-')

export const aiService = useRealAI ? realAI : mockAI

// Export for easy access
export { realAI, mockAI }
