import '@testing-library/jest-dom'

// Mock Firebase
jest.mock('@/firebase/config', () => ({
  auth: {},
  db: {},
}))

// Mock react-i18next
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

// Mock Particles
jest.mock('react-tsparticles', () => ({
  __esModule: true,
  default: () => <div data-testid="particles" />,
}))
