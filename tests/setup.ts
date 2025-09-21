import '@testing-library/jest-dom'

// Mock Firebase (adjust the path as needed)
jest.mock('../../src/firebase/config', () => ({
  auth: {},
  db: {},
}))

jest.mock('../../src/firebase/auth', () => ({
  authService: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
}))

// Mock react-i18next with explicit type for 'key'
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}))

// Mock Particles (createElement, no JSX)
jest.mock('react-tsparticles', () => ({
  __esModule: true,
  default: function MockParticles() {
    return require('react').createElement('div', { 'data-testid': 'particles' });
  },
}))
