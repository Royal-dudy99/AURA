# AURA - Focus smarter. Create faster. Live brighter.

A comprehensive AI-powered productivity and note-taking application built with React, TypeScript, Firebase, and TailwindCSS.

## ✨ Features

- **🧠 AI Notes & Flashcards**: Transform any text into smart summaries, flashcards, and mindmaps
- **🎯 Habit & Goal Tracker**: Build lasting habits with streak tracking and personalized challenges
- **💬 AI Assistant**: Get help with writing, planning, and problem-solving
- **🌍 Community Templates**: Share and discover productivity templates
- **🌙 Secret Mode**: Unlock playful motivational messages (18+ opt-in)
- **🎨 Glassmorphism UI**: Beautiful modern design with dark/light themes
- **🌐 Internationalization**: Multi-language support (English, Spanish)
- **📱 Responsive**: Mobile-first design that works everywhere

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
git clone <repository-url>
cd aura

2. **Install dependencies**
npm install


3. **Set up Firebase**
- Create a new Firebase project at https://console.firebase.google.com
- Enable Authentication (Email/Password + Google)
- Create a Firestore database
- Copy your Firebase config

4. **Configure environment variables**
cp .env.example .env

Fill in your Firebase configuration in `.env`

5. **Seed the database**
npm run seed

6. **Start development server**
npm run dev

### Firebase Setup

1. **Authentication**
- Enable Email/Password provider
- Enable Google provider
- Add your domain to authorized domains

2. **Firestore Database**
- Create in test mode initially
- Deploy the security rules from `firebase.rules`

3. **Deploy Firestore Rules**
firebase deploy --only firestore:rules

## 🧪 Testing

Run the test suite:
npm test


Run tests with coverage:
npm run test:coverage


## 🏗️ Building

Create a production build:
npm run build

Preview the build:
npm run preview

## 🚀 Deployment

### Netlify

1. **Connect your GitHub repository to Netlify**
2. **Set build command**: `npm run build`
3. **Set publish directory**: `dist`
4. **Add environment variables** in Netlify dashboard
5. **Deploy**

The `netlify.toml` file is already configured for optimal deployment.

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider

## 🔧 Configuration

### Switching from Mock AI to Real OpenAI

1. **Install OpenAI package**:
npm install openai


2. **Add your OpenAI API key to `.env`**:
OPENAI_API_KEY=sk-your-openai-api-key


3. **Replace the mock AI service**:
See detailed instructions in `src/lib/mockAI.ts`

### PDF Processing

The app currently mocks PDF parsing. To enable real PDF processing:

1. **Install PDF parsing library**:
npm install pdf-parse


2. **Update the file upload handler** in the notes components

## 📁 Project Structure

src/
├── components/ # React components
│ ├── auth/ # Authentication components
│ ├── dashboard/ # Dashboard components
│ ├── habits/ # Habit tracking components
│ ├── notes/ # AI notes components
│ ├── layout/ # Layout components
│ └── ui/ # Reusable UI components
├── hooks/ # Custom React hooks
├── lib/ # Utility functions and services
├── firebase/ # Firebase configuration and services
├── i18n/ # Internationalization
├── types/ # TypeScript type definitions
└── data/ # Static data and configuration


## 🎨 Styling

- **TailwindCSS** for utility-first styling
- **Custom glassmorphism** effects
- **Dark/light theme** support
- **Responsive design** with mobile-first approach

## 🌐 Internationalization

Add new languages:

1. Create a new locale file in `src/i18n/locales/`
2. Add the language to the resources object in `src/i18n/index.ts`
3. Add language toggle in the UI

## 📊 Analytics & Monitoring

The app is ready for analytics integration:
- Google Analytics (add your tracking ID)
- Error monitoring (Sentry, LogRocket)
- Performance monitoring (Firebase Performance)

## 🔒 Security

- Firebase Authentication handles user security
- Firestore security rules protect user data
- Environment variables for sensitive keys
- XSS protection via React's built-in sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📈 Performance

- **Code splitting** via dynamic imports
- **Lazy loading** of components
- **Optimized builds** with Vite
- **Caching strategies** for better performance

## 🐛 Troubleshooting

### Common Issues

1. **Firebase not connecting**: Check your environment variables
2. **Build failing**: Ensure all TypeScript types are correct
3. **Tests failing**: Make sure all mocks are properly set up

### Support

For issues and questions:
1. Check the [GitHub Issues](repository-url/issues)
2. Review the documentation
3. Join our community Discord

## 📄 License

MIT License - see LICENSE file for details.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI features (GPT-4 integration)
- [ ] Team collaboration features
- [ ] Offline support
- [ ] Advanced analytics dashboard
- [ ] Calendar integration
- [ ] Third-party app integrations

---

Built with ❤️ by the AURA team. Focus smarter. Create faster. Live brighter.