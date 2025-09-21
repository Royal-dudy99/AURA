import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  Timestamp,
  onSnapshot
} from 'firebase/firestore'
import { db } from './config'
import type { Note, Habit, Challenge, CommunityTemplate, UserProfile } from '@/types'

export class FirestoreService {
  // User Profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null
  }

  async setUserProfile(userId: string, profile: Partial<UserProfile>) {
    const docRef = doc(db, 'users', userId)
    await setDoc(docRef, {
      ...profile,
      updatedAt: Timestamp.now(),
    }, { merge: true })
  }

  // Notes
  async createNote(userId: string, note: Omit<Note, 'id'>) {
    const notesRef = collection(db, 'users', userId, 'notes')
    const docRef = doc(notesRef)
    const noteData = {
      ...note,
      id: docRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(docRef, noteData)
    return noteData
  }

  async getNotes(userId: string, limitCount = 50) {
    const notesRef = collection(db, 'users', userId, 'notes')
    const q = query(notesRef, orderBy('updatedAt', 'desc'), limit(limitCount))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data() as Note)
  }

  async updateNote(userId: string, noteId: string, updates: Partial<Note>) {
    const docRef = doc(db, 'users', userId, 'notes', noteId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  }

  async deleteNote(userId: string, noteId: string) {
    const docRef = doc(db, 'users', userId, 'notes', noteId)
    await deleteDoc(docRef)
  }

  // Habits
  async createHabit(userId: string, habit: Omit<Habit, 'id'>) {
    const habitsRef = collection(db, 'users', userId, 'habits')
    const docRef = doc(habitsRef)
    const habitData = {
      ...habit,
      id: docRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(docRef, habitData)
    return habitData
  }

  async getHabits(userId: string) {
    const habitsRef = collection(db, 'users', userId, 'habits')
    const q = query(habitsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data() as Habit)
  }

  async updateHabit(userId: string, habitId: string, updates: Partial<Habit>) {
    const docRef = doc(db, 'users', userId, 'habits', habitId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  }

  async checkInHabit(userId: string, habitId: string, date: string) {
    const docRef = doc(db, 'users', userId, 'habits', habitId)
    const habitDoc = await getDoc(docRef)
    
    if (habitDoc.exists()) {
      const habit = habitDoc.data() as Habit
      const newCompletions = [...(habit.completions || []), date]
      
      await updateDoc(docRef, {
        completions: newCompletions,
        currentStreak: this.calculateStreak(newCompletions),
        updatedAt: Timestamp.now(),
      })
    }
  }

  private calculateStreak(completions: string[]): number {
    if (completions.length === 0) return 0
    
    const sortedDates = completions.sort().reverse()
    let streak = 0
    const currentDate = new Date()
    
    for (const dateStr of sortedDates) {
      const date = new Date(dateStr)
      const diffTime = Math.abs(currentDate.getTime() - date.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays <= 1) {
        streak++
        currentDate.setDate(date.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  // Challenges
  async getChallenges() {
    const challengesRef = collection(db, 'challenges')
    const q = query(challengesRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data() as Challenge)
  }

  // Community Templates
  async getCommunityTemplates() {
    const templatesRef = collection(db, 'communities/templates')
    const q = query(templatesRef, orderBy('likes', 'desc'), limit(20))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data() as CommunityTemplate)
  }

  // Real-time subscriptions
  subscribeToUserData(userId: string, callback: (data: unknown) => void) {
    const userRef = doc(db, 'users', userId)
    return onSnapshot(userRef, callback)
  }

  subscribeToNotes(userId: string, callback: (notes: Note[]) => void) {
    const notesRef = collection(db, 'users', userId, 'notes')
    const q = query(notesRef, orderBy('updatedAt', 'desc'), limit(20))
    
    return onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map(doc => doc.data() as Note)
      callback(notes)
    })
  }
}

export const firestoreService = new FirestoreService()
