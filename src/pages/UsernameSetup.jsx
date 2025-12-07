import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../lib/supabase'
import { Check, X, Loader2 } from 'lucide-react'

export default function UsernameSetup() {
  const { profile, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [username, setUsername] = useState('')
  const [checking, setChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const reservedRoutes = ['dashboard', 'login', 'callback', 'setup', 'logout', 'api', 'admin', 'auth', 'home', 'about', 'contact', 'privacy', 'terms', 'help', 'support', 'faq', 'blog', 'docs', 'status', 'health', 'templates', 'pricing']
  
  const validateUsername = (username) => {
    if (username.length < 1) {
      return 'Username must be at least 1 character'
    }
    if (username.length > 30) {
      return 'Username must be less than 30 characters'
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      return 'Username can only contain lowercase letters, numbers, and underscores'
    }
    if (reservedRoutes.includes(username.toLowerCase())) {
      return 'This username is reserved and cannot be used'
    }
    return null
  }

  const checkUsernameAvailability = async (value) => {
    const validationError = validateUsername(value)
    if (validationError) {
      setError(validationError)
      setIsAvailable(false)
      return
    }

    setChecking(true)
    setError('')
    
    try {
      const { data: usernameData, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', value.toLowerCase())
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (usernameData) {
        setIsAvailable(false)
        setError('Username is already taken')
        return
      }

      const { data: aliasData, error: aliasError } = await supabase
        .from('profiles')
        .select('config')
      
      if (aliasError) {
        throw aliasError
      }

      if (aliasData) {
        const aliasConflict = aliasData.some(profile => {
          const alias = profile.config?.premium_features?.page_alias
          return alias && alias.toLowerCase() === value.toLowerCase()
        })

        if (aliasConflict) {
          setIsAvailable(false)
          setError('This username conflicts with an existing page alias')
          return
        }
      }

      setIsAvailable(true)
      setError('')
    } catch (error) {
      console.error('Error checking username:', error)
      setError('Error checking username availability')
      setIsAvailable(false)
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login')
      return
    }

    if (profile && profile.username && !profile.username.startsWith('user_')) {
      navigate('/dashboard')
      return
    }
  }, [isAuthenticated, isLoading, profile, navigate])

  useEffect(() => {
    const pendingUsername = localStorage.getItem('pending_username')
    if (pendingUsername && profile && profile.username && profile.username.startsWith('user_') && !username) {
      setUsername(pendingUsername)
      checkUsernameAvailability(pendingUsername)
    }
  }, [profile])

  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(value)
    setIsAvailable(null)
    setError('')
    
    if (value.length >= 1) {
      const timeoutId = setTimeout(() => {
        checkUsernameAvailability(value)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAvailable || !profile) return

    const validationError = validateUsername(username)
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          username: username.toLowerCase(),
          display_name: profile.display_name || username
        })
        .eq('id', profile.id)

      if (updateError) throw updateError

      localStorage.removeItem('pending_username')
      toast.success('Username set successfully!')
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 500)
    } catch (error) {
      console.error('Error updating username:', error)
      toast.error('Failed to save username. Please try again.')
      setError('Failed to save username. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Choose your <span className="bg-gradient-to-r from-orange-200 via-orange-100 to-white bg-clip-text text-transparent">username</span>
          </h1>
          <p className="text-gray-400">
            Your page will be available at radium.lol/{username || 'yourusername'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="yourusername"
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg pr-12"
                disabled={saving}
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checking ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : isAvailable === true ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : isAvailable === false ? (
                  <X className="w-5 h-5 text-red-400" />
                ) : null}
              </div>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
            {isAvailable && (
              <p className="text-green-400 text-sm mt-2">Username is available!</p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              1-30 characters, lowercase letters, numbers, and underscores only. Reserved routes cannot be used.
            </p>
          </div>

          <button
            type="submit"
            disabled={!isAvailable || saving || checking}
            className="w-full px-6 py-3 text-lg border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
