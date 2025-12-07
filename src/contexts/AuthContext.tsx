import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useAuth0, User } from '@auth0/auth0-react'
import { profileService } from '../services/profileService'
import { logError, handleApiError } from '../utils/errorHandler'
import type { Profile } from '../types'

interface AuthContextType {
  user: User | undefined
  profile: Profile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
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
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout: auth0Logout } = useAuth0()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const syncUser = useCallback(async () => {
    if (!user?.sub) return

    setLoadingProfile(true)
    try {
      let existingProfile = await profileService.getProfileByAuth0Id(user.sub)

      if (!existingProfile) {
        const tempUsername = `user_${Date.now()}`
        existingProfile = await profileService.createProfile({
          auth0_id: user.sub,
          email: user.email,
          username: tempUsername,
          display_name: user.name || user.email?.split('@')[0] || 'User',
        })
      }

      setProfile(existingProfile)
    } catch (error) {
      logError(error, 'AuthContext')
      const apiError = handleApiError(error)
      console.error('[AuthContext] Error syncing user:', apiError.message)
    } finally {
      setLoadingProfile(false)
    }
  }, [user])

  useEffect(() => {
    if (isAuthenticated && user) {
      syncUser()
    } else {
      setLoadingProfile(false)
      setProfile(null)
    }
  }, [isAuthenticated, user, syncUser])

  const logout = useCallback(() => {
    const returnUrl = `${window.location.origin}/`
    auth0Logout({
      returnTo: returnUrl,
      federated: false,
    })
  }, [auth0Logout])

  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated,
    isLoading: isLoading || loadingProfile,
    login: loginWithRedirect,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
