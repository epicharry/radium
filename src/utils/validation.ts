import { VALIDATION } from '../constants'

export function validateUsername(username: string): { isValid: boolean; error?: string } {
  if (!username.trim()) {
    return { isValid: false, error: 'Username is required' }
  }

  if (username.length < VALIDATION.USERNAME_MIN_LENGTH || username.length > VALIDATION.USERNAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Username must be between ${VALIDATION.USERNAME_MIN_LENGTH} and ${VALIDATION.USERNAME_MAX_LENGTH} characters`,
    }
  }

  if (!VALIDATION.USERNAME_PATTERN.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain lowercase letters, numbers, and underscores',
    }
  }

  return { isValid: true }
}

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' }
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }

  return { isValid: true }
}

export function validateUrl(url: string): { isValid: boolean; error?: string } {
  if (!url.trim()) {
    return { isValid: true }
  }

  try {
    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Invalid URL format' }
  }
}
