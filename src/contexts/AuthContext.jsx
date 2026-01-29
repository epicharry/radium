import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
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
        console.error('[AuthContext] Error initializing auth:', error)
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

  const loadProfile = async (userId) => {
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('supabase_user_id', userId)
        .maybeSingle()

      if (fetchError) {
        console.error('[AuthContext] Error fetching profile:', fetchError)
        return
      }

      if (existingUser) {
        setProfile(existingUser)
      } else {
        const { data: session } = await supabase.auth.getSession()
        const userEmail = session?.user?.email || ''
        const tempUsername = `user_${Date.now()}`

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            supabase_user_id: userId,
            email: userEmail,
            username: tempUsername,
            display_name: userEmail?.split('@')[0] || 'User',
          })
          .select()
          .single()

        if (insertError) {
          console.error('[AuthContext] Error creating profile:', insertError)
          return
        }

        setProfile(newProfile)
      }
    } catch (error) {
      console.error('[AuthContext] Error loading profile:', error)
    }
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
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

  const value = {
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

