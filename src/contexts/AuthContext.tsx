import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { profileService } from '../services/profileService'
import { logError, handleApiError } from '../utils/errorHandler'
import type { Profile } from '../types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isAuthenticated: boolean
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
  login: () => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)

        if (session?.user) {
          await loadProfile(session.user.id)
        }
      } catch (error) {
        logError(error, 'AuthContext')
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null)

        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
        }
      })()
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      let existingProfile = await profileService.getProfileBySupabaseUserId(userId)

      if (!existingProfile) {
        const { data: session } = await supabase.auth.getSession()
        const userEmail = session?.user?.email || ''
        const tempUsername = `user_${Date.now()}`

        existingProfile = await profileService.createProfile({
          supabase_user_id: userId,
          email: userEmail,
          username: tempUsername,
          display_name: userEmail?.split('@')[0] || 'User',
        })
      }

      setProfile(existingProfile)
    } catch (error) {
      logError(error, 'AuthContext')
      const apiError = handleApiError(error)
      console.error('[AuthContext] Error loading profile:', apiError.message)
    }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    signUp,
    signIn,
    signOut,
    login: () => window.location.href = '/login',
    logout: signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
