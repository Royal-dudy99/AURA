import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LandingPage from '../../src/components/LandingPage'
import { ThemeProvider } from '../../src/hooks/useTheme'


const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </BrowserRouter>
)

describe('LandingPage', () => {
  it('renders main elements correctly', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    )

    expect(screen.getByText('AURA')).toBeInTheDocument()
    expect(screen.getByText(/Focus smarter/)).toBeInTheDocument()
    expect(screen.getByText(/Create faster/)).toBeInTheDocument()
    expect(screen.getByText(/Live brighter/)).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    )

    expect(screen.getByText(/AI Notes/)).toBeInTheDocument()
    expect(screen.getByText(/Habit & Goal/)).toBeInTheDocument()
    expect(screen.getByText(/AI Assistant/)).toBeInTheDocument()
  })

  it('has working navigation buttons', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    )

    const signInButton = screen.getByText(/Sign In/)
    expect(signInButton).toBeInTheDocument()
    fireEvent.click(signInButton)
  })
})
