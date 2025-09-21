import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  updateProfile,
} from 'firebase/auth'
import { auth } from './config'

const googleProvider = new GoogleAuthProvider()

export const authService = {
  // Email/Password signup
  async signUp(email: string, password: string, displayName: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    return result
  },

  // Email/Password signin
  async signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  },

  // Google signin
  async signInWithGoogle() {
    return signInWithPopup(auth, googleProvider)
  },

  // Sign out
  async signOut() {
    return signOut(auth)
  },

  // Password reset
  async resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email)
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser
  },
}
