import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(d)
}

export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout
  return ((...args: unknown[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean
  return ((...args: unknown[]) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function calculateStreak(completions: string[]): number {
  if (completions.length === 0) return 0

  const sortedDates = completions.sort().reverse()
  let streak = 0
  let currentDate = new Date()

  for (const dateStr of sortedDates) {
    const date = new Date(dateStr)
    const diffTime = Math.abs(currentDate.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) {
      streak++
      currentDate = date
    } else {
      break
    }
  }

  return streak
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-400'
  if (percentage >= 60) return 'text-yellow-400'
  if (percentage >= 40) return 'text-orange-400'
  return 'text-red-400'
}

export function animateNumber(
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 1000
) {
  const startTime = performance.now()
  const difference = end - start

  function updateNumber(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const current = Math.round(start + difference * easeOut)
    
    element.textContent = current.toString()

    if (progress < 1) {
      requestAnimationFrame(updateNumber)
    }
  }

  requestAnimationFrame(updateNumber)
}
