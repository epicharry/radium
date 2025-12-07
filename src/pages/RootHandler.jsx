import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function RootHandler() {
  const { isLoading, isAuthenticated, error } = useAuth0()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading) {
      const urlParams = new URLSearchParams(location.search)
      const code = urlParams.get('code')
      const error = urlParams.get('error')
      const errorDescription = urlParams.get('error_description')

      if (code || error) {
        console.log('[RootHandler] Auth0 callback detected, redirecting to /callback')
        navigate(`/callback${location.search}`, { replace: true })
        return
      }

      if (isAuthenticated) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }
  }, [isLoading, isAuthenticated, location, navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Auth Error</h1>
          <p className="text-red-400">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">Loading...</div>
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}

