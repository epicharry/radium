import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import logo from '../assets/logo.png'

export default function LoginPage() {
  const { login, isAuthenticated, profile, isLoading } = useAuth()
  const { isLoading: auth0Loading } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !auth0Loading && isAuthenticated) {
      if (profile) {
        console.log('[LoginPage] Redirecting authenticated user with profile')
        if (profile.username && profile.username.startsWith('user_')) {
          navigate('/setup', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      } else {
        console.log('[LoginPage] User authenticated but no profile yet, waiting...')
      }
    }
  }, [isAuthenticated, isLoading, auth0Loading, profile, navigate])

  if (isLoading || auth0Loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  if (isAuthenticated && profile) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Redirecting...</div>
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 flex flex-col items-center gap-4">
          <img 
            src={logo} 
            alt="radium.lol" 
            className="h-16 sm:h-20 w-auto"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Welcome to radium.lol
          </h1>
        </div>
        <p className="text-gray-400 mb-8">
          Sign in to create and customize your portfolio page
        </p>
        <button
          onClick={() => {
            console.log('Login button clicked, redirect URI should be:', `${window.location.origin}/callback`)
            login()
          }}
          className="w-full px-6 py-3 text-lg border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all"
        >
          Sign In / Sign Up
        </button>
      </div>
    </div>
  )
}

