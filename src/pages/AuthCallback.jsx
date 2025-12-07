import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AuthCallback() {
  const { isLoading: auth0Loading, isAuthenticated: auth0Authenticated, user: auth0User, error: auth0Error, getAccessTokenSilently } = useAuth0()
  const { profile, isLoading: profileLoading } = useAuth()
  const navigate = useNavigate()
  const [redirected, setRedirected] = useState(false)
  const [triedToken, setTriedToken] = useState(false)

  useEffect(() => {
    if (auth0Error) {
      console.error('[AuthCallback] Auth0 Error:', auth0Error)
      if (!redirected) {
        setRedirected(true)
        setTimeout(() => navigate('/login', { replace: true }), 2000)
      }
      return
    }

    if (auth0Loading || profileLoading) {
      return
    }

    if (!auth0Authenticated && !auth0Loading) {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const error = urlParams.get('error')
      
      if (error) {
        if (!redirected) {
          setRedirected(true)
          setTimeout(() => navigate('/login', { replace: true }), 2000)
        }
        return
      }
      
      if (code && !triedToken) {
        setTriedToken(true)
        
        getAccessTokenSilently({ 
          authorizationParams: {
            redirect_uri: `${window.location.origin}/callback`
          }
        }).catch((err) => {
          console.error('[AuthCallback] Token exchange error:', err)
          if (!redirected) {
            setRedirected(true)
            setTimeout(() => navigate('/login', { replace: true }), 2000)
          }
        })
        
        const checkInterval = setInterval(() => {
          if (auth0Authenticated && auth0User) {
            clearInterval(checkInterval)
          }
        }, 500)
        
        setTimeout(() => {
          clearInterval(checkInterval)
          if (!auth0Authenticated && !redirected) {
            setRedirected(true)
            setTimeout(() => navigate('/login', { replace: true }), 2000)
          }
        }, 10000)
        return () => clearInterval(checkInterval)
      }
      
      if (!redirected) {
        setRedirected(true)
        setTimeout(() => navigate('/login', { replace: true }), 2000)
      }
      return
    }

    if (auth0Authenticated && auth0User) {
      if (profile) {
        if (!redirected) {
          setRedirected(true)
          setTimeout(() => {
            if (profile.username && profile.username.startsWith('user_')) {
              navigate('/setup', { replace: true })
            } else {
              navigate('/dashboard', { replace: true })
            }
          }, 500)
        }
        return
      }

      if (auth0Authenticated && !profile && !profileLoading) {
        const timer = setInterval(() => {
          if (profile) {
            clearInterval(timer)
            if (!redirected) {
              setRedirected(true)
              setTimeout(() => {
                if (profile.username && profile.username.startsWith('user_')) {
                  navigate('/setup', { replace: true })
                } else {
                  navigate('/dashboard', { replace: true })
                }
              }, 500)
            }
          }
        }, 500)

        setTimeout(() => {
          clearInterval(timer)
          if (!profile && !redirected) {
            setRedirected(true)
            setTimeout(() => navigate('/dashboard', { replace: true }), 1000)
          }
        }, 15000)

        return () => clearInterval(timer)
      }
    }
  }, [auth0Loading, profileLoading, auth0Authenticated, profile, navigate, redirected, auth0User, auth0Error, getAccessTokenSilently, triedToken])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-4 text-lg">Completing login...</div>
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}

