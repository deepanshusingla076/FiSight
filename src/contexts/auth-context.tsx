'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { setAuthCookie } from '@/lib/auth-cookie'

interface AuthContextType {
  user: User | null
  loading: boolean
  isNewUser: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signInWithGoogle: () => Promise<boolean>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
  clearNewUserFlag: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName })
      }
      
      setIsNewUser(true)
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      const creationTime = new Date(result.user.metadata.creationTime!).getTime()
      const lastSignInTime = new Date(result.user.metadata.lastSignInTime!).getTime()
      const isFirstTimeUser = Math.abs(creationTime - lastSignInTime) < 5000
      
      if (isFirstTimeUser) {
        setIsNewUser(true)
      }
      return isFirstTimeUser
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setIsNewUser(false)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  const clearNewUserFlag = () => {
    setIsNewUser(false)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setAuthCookie(!!user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    isNewUser,
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    logout,
    clearNewUserFlag
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
