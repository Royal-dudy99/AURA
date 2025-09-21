# AURA Deployment Guide

## Quick Deploy to Netlify

### 1. Connect Repository
- Go to [Netlify](https://netlify.com)
- Click "New site from Git"
- Connect your GitHub repository

### 2. Build Settings
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

### 3. Environment Variables
Add these in Netlify dashboard > Site settings > Environment variables:

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456


### 4. Deploy
- Click "Deploy site"
- Your app will be live at `https://yourapp.netlify.app`

## Alternative: Deploy to Vercel

### 1. Install Vercel CLI
npm i -g vercel

### 2. Deploy
vercel --prod


### 3. Set Environment Variables
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID


## Custom Domain Setup

### 1. Add Custom Domain
- In Netlify dashboard, go to Domain management
- Click "Add custom domain"
- Enter your domain name

### 2. DNS Configuration
- Point your domain to Netlify:
  - For apex domain: A record to `75.2.60.5`
  - For www: CNAME to `yoursite.netlify.app`
- SSL certificate will be automatically provisioned

## Firebase Setup

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com)
- Click "Create a project"
- Enable Google Analytics (optional)

### 2. Enable Authentication
- Go to Authentication > Sign-in method
- Enable Email/Password
- Enable Google Sign-in
- Add your domain to authorized domains

### 3. Create Firestore Database
- Go to Firestore Database
- Create database in test mode
- Deploy security rules from `firebase.rules`

### 4. Get Configuration
- Go to Project settings > Your apps
- Click "Web app" icon
- Copy the configuration object

## Performance Optimization

### 1. Enable Compression
- Gzip/Brotli compression (enabled by default on Netlify)
- Asset optimization automatic

### 2. CDN Caching
- Static assets cached globally
- Custom cache headers in `netlify.toml`

### 3. Image Optimization
- Use WebP format when possible
- Implement lazy loading for images
- Optimize SVG icons

## Monitoring Setup

### 1. Error Tracking with Sentry
npm install @sentry/react @sentry/tracing


Add to `src/main.tsx`:
import * as Sentry from "@sentry/react"

Sentry.init({
dsn: "YOUR_SENTRY_DSN",
environment: import.meta.env.MODE,
})


### 2. Analytics
npm install @netlify/analytics


Or use Google Analytics:
npm install gtag


### 3. Performance Monitoring
- Lighthouse CI for continuous monitoring
- Web Vitals tracking
- Firebase Performance Monitoring

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check environment variables are set

### Firebase Connection Issues
- Verify all environment variables are correct
- Check Firebase project settings
- Ensure domain is in authorized domains list

### Routing Issues
- Verify `netlify.toml` redirects are configured
- Check React Router setup
- Ensure all routes are protected properly