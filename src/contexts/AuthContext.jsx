import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
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
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0()
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user) {
      setLoadingProfile(true)
      const syncUser = async () => {
        try {
          console.log('[AuthContext] Syncing user:', user.sub)
          
          const { data: existingUser, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth0_id', user.sub)
            .maybeSingle()

          if (fetchError) {
            console.error('[AuthContext] Error fetching user:', fetchError)
            setLoadingProfile(false)
            return
          }

          if (existingUser) {
            console.log('[AuthContext] Existing user found:', existingUser.username)
            setProfile(existingUser)
            setLoadingProfile(false)
          } else {
            console.log('[AuthContext] Creating new user profile...')
            const tempUsername = `user_${Date.now()}`
            
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                auth0_id: user.sub,
                email: user.email,
                username: tempUsername,
                display_name: user.name || user.email?.split('@')[0] || 'User',
                created_at: new Date().toISOString()
              })
              .select()
              .single()

            if (insertError) {
              console.error('[AuthContext] Error creating profile:', insertError)
              setLoadingProfile(false)
              return
            }
            
            console.log('[AuthContext] New profile created:', newProfile.username)
            setProfile(newProfile)
            setLoadingProfile(false)
          }
        } catch (error) {
          console.error('[AuthContext] Error syncing user:', error)
          setLoadingProfile(false)
        }
      }

      syncUser()
    } else {
      setLoadingProfile(false)
    }
  }, [isAuthenticated, user])

  const value = {
    user,
    profile,
    isAuthenticated,
    isLoading: isLoading || loadingProfile,
    login: loginWithRedirect,
    logout: () => {
      const returnUrl = `${window.location.origin}/`
      console.log('[AuthContext] Logging out, returning to:', returnUrl)
      logout({ 
        returnTo: returnUrl,
        federated: false
      })
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

