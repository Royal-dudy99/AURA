import { renderHook } from '@testing-library/react'
import { useAuth, AuthProvider } from '../../src/hooks/useAuth'


// Mock Firebase
jest.mock('@/firebase/config', () => ({
  auth: {
    currentUser: null,
  },
}))

jest.mock('@/firebase/auth', () => ({
  authService: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
}))

describe('useAuth', () => {
  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
  })

  it('should provide auth context when wrapped in provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current).toHaveProperty('user')
    expect(result.current).toHaveProperty('signIn')
    expect(result.current).toHaveProperty('signUp')
    expect(result.current).toHaveProperty('signOut')
  })
})
