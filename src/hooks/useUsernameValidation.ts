import { useState, useEffect, useCallback } from 'react'
import { profileService } from '../services/profileService'
import { VALIDATION } from '../constants'
import { useDebounce } from './useDebounce'

export function useUsernameValidation() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)

  const debouncedUsername = useDebounce(username, 500)

  const validateUsername = useCallback((value: string): string | null => {
    if (!value.trim()) {
      return null
    }

    if (value.length < VALIDATION.USERNAME_MIN_LENGTH || value.length > VALIDATION.USERNAME_MAX_LENGTH) {
      return `Username must be between ${VALIDATION.USERNAME_MIN_LENGTH} and ${VALIDATION.USERNAME_MAX_LENGTH} characters`
    }

    if (!VALIDATION.USERNAME_PATTERN.test(value)) {
      return 'Username can only contain lowercase letters, numbers, and underscores'
    }

    return null
  }, [])

  const checkAvailability = useCallback(async (value: string) => {
    if (!value.trim()) {
      setIsAvailable(null)
      return
    }

    const validationError = validateUsername(value)
    if (validationError) {
      setError(validationError)
      setIsAvailable(false)
      return
    }

    setError(null)
    setChecking(true)

    try {
      const available = await profileService.checkUsernameAvailability(value.toLowerCase())
      setIsAvailable(available)
      if (!available) {
        setError('Username is already taken')
      }
    } catch (err) {
      console.error('Error checking username availability:', err)
      setIsAvailable(false)
      setError('Failed to check username availability')
    } finally {
      setChecking(false)
    }
  }, [validateUsername])

  useEffect(() => {
    if (debouncedUsername) {
      checkAvailability(debouncedUsername)
    } else {
      setError(null)
      setIsAvailable(null)
    }
  }, [debouncedUsername, checkAvailability])

  const handleChange = useCallback((value: string) => {
    setUsername(value)
    const validationError = validateUsername(value)
    if (validationError) {
      setError(validationError)
      setIsAvailable(false)
    } else {
      setError(null)
    }
  }, [validateUsername])

  return {
    username,
    error,
    isAvailable,
    checking,
    setUsername: handleChange,
    validate: validateUsername,
  }
}
