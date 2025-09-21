import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '@/components/dashboard/Dashboard'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeProvider } from '@/hooks/useTheme'
import { SecretModeProvider } from '@/hooks/useSecretMode'

// Mock the auth hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid' },
    userProfile: {
      displayName: 'Test User',
      stats: {
        totalNotes: 5,
        totalHabits: 3,
        longestStreak: 7,
        challengesCompleted: 2,
      }
    },
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <SecretModeProvider>
          {children}
        </SecretModeProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
)

describe('Dashboard', () => {
  it('renders welcome message with user name', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    expect(screen.getByText(/Welcome back, Test/)).toBeInTheDocument()
  })

  it('renders stats cards', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    expect(screen.getByText('Notes Created')).toBeInTheDocument()
    expect(screen.getByText('Active Habits')).toBeInTheDocument()
    expect(screen.getByText('Longest Streak')).toBeInTheDocument()
    expect(screen.getByText('Challenges Done')).toBeInTheDocument()
  })

  it('renders quick actions', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )

    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
    expect(screen.getByText('Create Note')).toBeInTheDocument()
    expect(screen.getByText('Add Habit')).toBeInTheDocument()
  })
})
