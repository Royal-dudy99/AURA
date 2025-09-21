# AURA Customization Guide

## Theming and Branding

### Colors
Edit `tailwind.config.ts` to customize the color scheme:

colors: {
aura: {
cyan: '#06b6d4', // Change to your brand color
purple: '#8b5cf6', // Change to your secondary color
indigo: '#6366f1', // Change to your accent color
},
}

### Animations
Modify animations in `tailwind.config.ts`:

animation: {
'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
'your-custom-animation': 'your-keyframe 2s ease-in-out infinite',
}


### App Branding

#### Logo
Replace logo in these files:
- `src/components/layout/Sidebar.tsx` - Sidebar logo
- `src/components/LandingPage.tsx` - Header logo
- `public/aura-icon.svg` - App icon and favicon

#### App Name
Search and replace "AURA" throughout the codebase:

find . -type f 
−
n
a
m
e
"
∗
.
t
s
x
"
−
o
−
n
a
m
e
"
∗
.
t
s
"
−
o
−
n
a
m
e
"
∗
.
j
s
o
n
"
−name"∗.tsx"−o−name"∗.ts"−o−name"∗.json" | xargs sed -i 's/AURA/YourAppName/g'


#### Tagline
Update in `src/lib/constants.ts`:

export const APP_TAGLINE = 'Your new tagline here'
export const APP_DESCRIPTION = 'Your app description here'


## Feature Customization

### Adding New Habit Categories
Edit `src/lib/constants.ts`:

export const HABIT_CATEGORIES = [
'Health',
'Fitness',
'Learning',
'Productivity',
'Mindfulness',
'Creativity',
'Your New Category', // Add your categories here
]


### Custom Secret Messages
Edit `src/data/secretMessages.json`:

[
{
"id": "custom1",
"text": "Your motivational message here!",
"category": "motivation",
"intensity": "mild"
},
{
"id": "custom2",
"text": "Another encouraging message!",
"category": "success",
"intensity": "playful"
}
]


### AI Integration
Replace mock AI in `src/lib/mockAI.ts` with real OpenAI:

import OpenAI from 'openai'

const openai = new OpenAI({
apiKey: import.meta.env.OPENAI_API_KEY,
})

export class RealAIService {
async summarizeText(text: string): Promise<AIResponse> {
const completion = await openai.chat.completions.create({
messages: [
{ role: "system", content: "Summarize the following text concisely." },
{ role: "user", content: text }
],
model: "gpt-3.5-turbo",
max_tokens: 150,
})

return {
  content: completion.choices?.message?.content || '',
  type: 'summary'
}
}

// Add other AI methods...
}

## Internationalization

### Add New Language

1. Create language file `src/i18n/locales/fr.json`:
{
"landing": {
"title": "AURA - Concentrez-vous plus intelligemment",
"description": "Application de productivité alimentée par l'IA"
},
"auth": {
"signIn": "Se connecter",
"signUp": "S'inscrire"
}
}


2. Add to `src/i18n/index.ts`:
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json' // New language

const resources = {
en: { translation: en },
es: { translation: es },
fr: { translation: fr }, // Add here
}


3. Add language toggle in header components

### Translation Structure
Follow the existing nested structure:

{
"section": {
"subsection": {
"key": "Translated text"
}
}
}

## Database Schema

### Custom Collections
Add new collections in `src/firebase/firestore.ts`:

// Add to FirestoreService class
async createCustomCollection(userId: string, data: CustomType) {
const customRef = collection(db, 'users', userId, 'customCollection')
const docRef = doc(customRef)
await setDoc(docRef, {
...data,
id: docRef.id,
createdAt: Timestamp.now(),
updatedAt: Timestamp.now(),
})
return docRef.id
}

async getCustomCollection(userId: string) {
const customRef = collection(db, 'users', userId, 'customCollection')
const snapshot = await getDocs(customRef)
return snapshot.docs.map(doc => doc.data() as CustomType)
}


### Security Rules
Update `firebase.rules` for new collections:

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
match /users/{userId} {
allow read, write: if request.auth != null && request.auth.uid == userId;

  // Add custom collection rules
  match /customCollection/{docId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
}
}
}


## Component Development

### Custom Components
Create new components following this structure:

src/components/
├── your-feature/
│ ├── YourFeaturePage.tsx // Main page component
│ ├── YourFeatureCard.tsx // Card component
│ ├── YourFeatureModal.tsx // Modal component
│ └── index.ts // Export file


Example component structure:
// src/components/your-feature/YourFeatureCard.tsx
import React from 'react'
import { Icon } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface YourFeatureCardProps {
data: YourDataType
onAction: (id: string) => void
}

export default function YourFeatureCard({ data, onAction }: YourFeatureCardProps) {
return (
<div className="card group hover:scale-105 transition-all duration-200">
<div className="flex items-center justify-between mb-4">
<h3 className="font-semibold text-white">{data.title}</h3>
<Icon className="w-5 h-5 text-aura-cyan" />
</div>

  <p className="text-gray-300 text-sm mb-4">{data.description}</p>
  
  <button 
    onClick={() => onAction(data.id)}
    className="btn-primary w-full"
  >
    Action
  </button>
</div>
)
}


### Styling Guidelines
- Use Tailwind utility classes consistently
- Follow existing patterns: `card`, `btn-primary`, `btn-secondary`
- Maintain responsive design with `sm:`, `md:`, `lg:`, `xl:` prefixes
- Use consistent spacing: `space-x-4`, `space-y-6`, etc.
- Apply hover states and transitions for interactivity

## Testing

### Add Component Tests
Create test files in `__tests__/components/`:

// tests/components/YourComponent.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import YourComponent from '@/components/YourComponent'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
<BrowserRouter>{children}</BrowserRouter>
)

describe('YourComponent', () => {
it('renders correctly', () => {
render(
<TestWrapper>
<YourComponent data={mockData} />
</TestWrapper>
)

expect(screen.getByText('Expected Text')).toBeInTheDocument()
})

it('handles user interaction', () => {
const mockAction = jest.fn()

render(
  <TestWrapper>
    <YourComponent onAction={mockAction} />
  </TestWrapper>
)

fireEvent.click(screen.getByRole('button'))
expect(mockAction).toHaveBeenCalledTimes(1)
})
})


### Mock Services
Update `__tests__/setup.ts` for new services:

// Mock your custom services
jest.mock('@/services/yourCustomService', () => ({
yourMethod: jest.fn().mockResolvedValue({ success: true }),
anotherMethod: jest.fn(),
}))

// Mock Firebase functions if needed
jest.mock('@/firebase/firestore', () => ({
firestoreService: {
getCustomData: jest.fn().mockResolvedValue([]),
createCustomData: jest.fn(),
},
}))


### Integration Tests
Test complete user flows:

describe('User Flow Integration', () => {
it('completes full habit creation flow', async () => {
render(<App />)

// Navigate to habits
fireEvent.click(screen.getByText('Habits'))

// Open create modal
fireEvent.click(screen.getByText('Create Habit'))

// Fill form
fireEvent.change(screen.getByLabelText('Title'), {
  target: { value: 'Test Habit' }
})

// Submit
fireEvent.click(screen.getByText('Create'))

// Verify result
await waitFor(() => {
  expect(screen.getByText('Test Habit')).toBeInTheDocument()
})
})
})

## Performance Optimization

### Code Splitting
Implement lazy loading for routes:

import { lazy, Suspense } from 'react'

const YourFeaturePage = lazy(() => import('@/components/your-feature/YourFeaturePage'))

// In your routes
<Route
path="/your-feature"
element={
<Suspense fallback={<div>Loading...</div>}>
<YourFeaturePage />
</Suspense>
}
/>


### State Management
For complex state, consider adding Zustand:

npm install zustand

undefined
// src/stores/yourStore.ts
import { create } from 'zustand'

interface YourState {
data: YourDataType[]
loading: boolean
addData: (item: YourDataType) => void
setLoading: (loading: boolean) => void
}

export const useYourStore = create<YourState>((set) => ({
data: [],
loading: false,
addData: (item) => set((state) => ({ data: [...state.data, item] })),
setLoading: (loading) => set({ loading }),
}))


## Deployment Customization

### Custom Build Process
Modify `package.json` scripts:

{
"scripts": {
"build": "tsc && vite build",
"build:staging": "tsc && vite build --mode staging",
"build:production": "tsc && vite build --mode production",
"preview": "vite preview",
"analyze": "vite-bundle-analyzer"
}
}


### Environment-Specific Configs
Create environment files:
- `.env.development`
- `.env.staging` 
- `.env.production`

### Custom Netlify Functions
Add serverless functions in `netlify/functions/`:

// netlify/functions/send-email.ts
import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
// Your serverless function logic
return {
statusCode: 200,
body: JSON.stringify({ message: 'Success' }),
}
}


This completes the comprehensive customization guide for the AURA application!