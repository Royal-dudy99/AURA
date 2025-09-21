export const APP_NAME = 'AURA'
export const APP_TAGLINE = 'Focus smarter. Create faster. Live brighter.'
export const APP_DESCRIPTION = 'AI-powered productivity and note-taking application that helps you build better habits, create smarter notes, and achieve your goals faster.'

export const FEATURES = [
  {
    title: 'AI Notes & Flashcards',
    description: 'Transform any text into smart summaries, flashcards, and mindmaps',
    icon: 'brain',
  },
  {
    title: 'Habit & Goal Tracker',
    description: 'Build lasting habits with streak tracking and personalized challenges',
    icon: 'target',
  },
  {
    title: 'AI Assistant',
    description: 'Get help with writing, planning, and problem-solving',
    icon: 'sparkles',
  },
]

export const HABIT_CATEGORIES = [
  'Health',
  'Fitness',
  'Learning',
  'Productivity',
  'Mindfulness',
  'Creativity',
  'Social',
  'Finance',
]

export const NOTE_CATEGORIES = [
  'Work',
  'Personal',
  'Study',
  'Research',
  'Ideas',
  'Meeting',
  'Project',
  'Reference',
]

export const CHALLENGE_CATEGORIES = [
  'wellness',
  'productivity',
  'fitness',
  'mindfulness',
  'creativity',
  'learning',
  'health',
  'social',
]

export const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
]

export const PROMPT_TEMPLATES = [
  {
    id: 'brainstorm',
    title: 'Brainstorming Session',
    content: 'Help me brainstorm ideas for: [TOPIC]. Please provide 10 creative and diverse ideas.',
    category: 'creativity',
  },
  {
    id: 'email-professional',
    title: 'Professional Email',
    content: 'Write a professional email about: [TOPIC]. Keep it concise and respectful.',
    category: 'writing',
  },
  {
    id: 'study-plan',
    title: 'Study Plan Creator',
    content: 'Create a detailed study plan for: [SUBJECT]. Include timeline and key milestones.',
    category: 'productivity',
  },
  {
    id: 'code-review',
    title: 'Code Review',
    content: 'Review this code and suggest improvements:\n\n[CODE]\n\nFocus on best practices and optimization.',
    category: 'coding',
  },
  {
    id: 'goal-breakdown',
    title: 'Goal Breakdown',
    content: 'Break down this goal into actionable steps: [GOAL]. Make it SMART and achievable.',
    category: 'productivity',
  },
]

export const SECRET_MODE_UNLOCK_DAYS = 3
export const MAX_NOTES_FREE = 100
export const MAX_HABITS_FREE = 20

export const ANIMATION_CONFIG = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: '#06b6d4',
    },
    shape: {
      type: 'circle',
    },
    opacity: {
      value: 0.5,
      random: false,
    },
    size: {
      value: 3,
      random: true,
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#06b6d4',
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false,
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse',
      },
      onclick: {
        enable: true,
        mode: 'push',
      },
      resize: true,
    },
  },
  retina_detect: true,
}

export const STORAGE_KEYS = {
  THEME: 'aura-theme',
  LANGUAGE: 'aura-language',
  ONBOARDING_COMPLETED: 'aura-onboarding',
  LAST_VISIT: 'aura-last-visit',
}
