import { useState, useEffect, useCallback } from 'react'
import { profileService } from '../services/profileService'
import type { Profile } from '../types'

interface UseProfileOptions {
  username?: string
  auth0Id?: string
  autoFetch?: boolean
}

export function useProfile(options: UseProfileOptions = {}) {
  const { username, auth0Id, autoFetch = true } = options
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!username && !auth0Id) {
      setError(new Error('Username or auth0Id is required'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = username
        ? await profileService.getProfileByUsername(username)
        : await profileService.getProfileByAuth0Id(auth0Id!)

      setProfile(data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch profile')
      setError(error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [username, auth0Id])

  useEffect(() => {
    if (autoFetch) {
      fetchProfile()
    }
  }, [autoFetch, fetchProfile])

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!profile?.id) {
        throw new Error('No profile to update')
      }

      setLoading(true)
      setError(null)

      try {
        const updated = await profileService.updateProfile(profile.id, updates)
        setProfile(updated)
        return updated
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update profile')
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [profile?.id]
  )

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  }
}
