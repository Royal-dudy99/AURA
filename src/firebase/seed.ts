import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from './config'
import type { Challenge, CommunityTemplate } from '@/types'

const sampleChallenges: Omit<Challenge, 'id'>[] = [
  {
    title: "30-Day Morning Routine",
    description: "Build a consistent morning routine that energizes your day",
    duration: 30,
    category: "wellness",
    tasks: [
      "Wake up at 6 AM",
      "Drink a glass of water",
      "5-minute meditation",
      "Write 3 gratitudes"
    ],
    difficulty: "beginner",
    participants: 1250,
    completionRate: 78,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: "7-Day Digital Detox",
    description: "Reduce screen time and reconnect with the real world",
    duration: 7,
    category: "productivity",
    tasks: [
      "No social media after 8 PM",
      "Phone-free meals",
      "Read for 30 minutes instead of scrolling",
      "Take a tech-free walk daily"
    ],
    difficulty: "intermediate",
    participants: 892,
    completionRate: 65,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: "14-Day Fitness Foundation",
    description: "Start your fitness journey with basic exercises",
    duration: 14,
    category: "fitness",
    tasks: [
      "10 push-ups",
      "20 squats",
      "30-second plank",
      "5-minute walk"
    ],
    difficulty: "beginner",
    participants: 2100,
    completionRate: 82,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: "21-Day Gratitude Practice",
    description: "Cultivate positivity through daily gratitude",
    duration: 21,
    category: "mindfulness",
    tasks: [
      "Write 3 things you're grateful for",
      "Send a thank you message to someone",
      "Reflect on positive moments from the day"
    ],
    difficulty: "beginner",
    participants: 1567,
    completionRate: 89,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: "30-Day Creative Writing",
    description: "Develop your writing skills with daily practice",
    duration: 30,
    category: "creativity",
    tasks: [
      "Write 300 words daily",
      "Try a new writing prompt",
      "Read your work aloud",
      "Edit previous day's writing"
    ],
    difficulty: "intermediate",
    participants: 743,
    completionRate: 71,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: "14-Day Learning Sprint",
    description: "Master a new skill in two weeks",
    duration: 14,
    category: "learning",
    tasks: [
      "Study for 45 minutes",
      "Practice what you learned",
      "Take notes on key concepts",
      "Review previous lessons"
    ],
    difficulty: "intermediate",
    participants: 1089,
    completionRate: 76,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: "7-Day Hydration Challenge",
    description: "Build the habit of staying properly hydrated",
    duration: 7,
    category: "health",
    tasks: [
      "Drink 8 glasses of water",
      "Start day with water",
      "Carry a water bottle",
      "Track your intake"
    ],
    difficulty: "beginner",
    participants: 3200,
    completionRate: 94,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: "30-Day Meditation Journey",
    description: "Develop mindfulness through daily meditation",
    duration: 30,
    category: "mindfulness",
    tasks: [
      "10-minute guided meditation",
      "Focus on breathing",
      "Practice mindful walking",
      "Journal about your experience"
    ],
    difficulty: "beginner",
    participants: 1876,
    completionRate: 67,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
]

const sampleCommunityTemplates: Omit<CommunityTemplate, 'id'>[] = [
  {
    title: "Student Study Planner",
    description: "Organize your academic life with this comprehensive template",
    category: "education",
    content: {
      sections: ["Daily Schedule", "Assignment Tracker", "Exam Prep", "Notes"],
      prompts: [
        "What are your study goals for today?",
        "Which subjects need the most attention?",
        "How will you reward yourself for completing tasks?"
      ]
    },
    tags: ["study", "academic", "planning"],
    likes: 234,
    downloads: 1250,
    createdBy: "demo-user",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: "Creative Project Tracker",
    description: "Keep your creative projects organized and inspired",
    category: "creativity",
    content: {
      sections: ["Project Ideas", "Progress Tracker", "Inspiration Board", "Reflection"],
      prompts: [
        "What creative project excites you most?",
        "Where do you find inspiration?",
        "What tools or resources do you need?"
      ]
    },
    tags: ["creative", "project", "art"],
    likes: 189,
    downloads: 876,
    createdBy: "demo-user",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: "Fitness Journey Log",
    description: "Track your fitness progress and stay motivated",
    category: "health",
    content: {
      sections: ["Workout Plan", "Progress Photos", "Measurements", "Nutrition"],
      prompts: [
        "What are your fitness goals?",
        "How do you feel after each workout?",
        "What healthy habits are you building?"
      ]
    },
    tags: ["fitness", "health", "tracking"],
    likes: 312,
    downloads: 1567,
    createdBy: "demo-user",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
]

export async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Seed challenges
    console.log('📝 Seeding challenges...')
    for (let i = 0; i < sampleChallenges.length; i++) {
      const challengeRef = doc(collection(db, 'challenges'))
      await setDoc(challengeRef, {
        ...sampleChallenges[i],
        id: challengeRef.id,
      })
    }

    // Seed community templates
    console.log('🎨 Seeding community templates...')
    for (let i = 0; i < sampleCommunityTemplates.length; i++) {
      const templateRef = doc(collection(db, 'communityTemplates'))
      await setDoc(templateRef, {
        ...sampleCommunityTemplates[i],
        id: templateRef.id,
      })
    }

    console.log('✅ Database seeding completed successfully!')
    console.log(`   - ${sampleChallenges.length} challenges created`)
    console.log(`   - ${sampleCommunityTemplates.length} community templates created`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run seeding if this file is executed directly
if (import.meta.url.endsWith('seed.ts')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
