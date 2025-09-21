import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeProvider } from '@/hooks/useTheme'
import { SecretModeProvider } from '@/hooks/useSecretMode'
import Layout from '@/components/layout/Layout'
import LandingPage from '@/components/LandingPage'
import Dashboard from '@/components/dashboard/Dashboard'
import AINotesPage from '@/components/notes/AINotesPage'
import HabitsPage from '@/components/habits/HabitsPage'
import AIAssistantPage from '@/components/AIAssistantPage'
import CommunityPage from '@/components/community/CommunityPage'
import LoginPage from '@/components/auth/LoginPage'
import SignupPage from '@/components/auth/SignupPage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SecretModeProvider>
          <Router>
            <div className="min-h-screen bg-gray-950 text-white">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notes"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AINotesPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/habits"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <HabitsPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assistant"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AIAssistantPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/community"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <CommunityPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </SecretModeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
