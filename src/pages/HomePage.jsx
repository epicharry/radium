import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRight, Sparkles, Eye, Users, FileText, Crown, Check, HelpCircle, MessageCircle, DollarSign, Menu, X, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'
import logo from '../assets/logo.png'

export default function HomePage() {
  const { isAuthenticated, login, profile, isLoading } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [stats, setStats] = useState({ views: 0, users: 0, pages: 0, subscribers: 0 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null)

  useEffect(() => {
    if (!isLoading && isAuthenticated && profile) {
      if (profile.username && profile.username.startsWith('user_')) {
        navigate('/setup')
      }
    }
  }, [isAuthenticated, isLoading, profile, navigate])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const cacheKey = 'homepage_stats'
        const cacheExpiry = 60000
        const cached = sessionStorage.getItem(cacheKey)
        const now = Date.now()
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          if (now - timestamp < cacheExpiry) {
            setStats(data)
            return
          }
        }
        
        const profilesResult = await supabase
          .from('profiles')
          .select('view_count, is_premium, premium_expires_at, config')
        
        if (profilesResult.data) {
          const totalViews = profilesResult.data.reduce((sum, p) => sum + (p.view_count || 0), 0)
          const totalUsers = profilesResult.data.length
          const totalPages = profilesResult.data.reduce((count, p) => {
            let pageCount = 1
            if (p.config?.premium_features?.page_alias) {
              pageCount++
            }
            return count + pageCount
          }, 0)
          const premiumUsers = profilesResult.data.filter(p => {
            const isPremium = p.is_premium === true
            const notExpired = !p.premium_expires_at || new Date(p.premium_expires_at) > new Date()
            return isPremium && notExpired
          }).length
          
          const newStats = {
            views: totalViews,
            users: totalUsers,
            pages: totalPages,
            subscribers: premiumUsers
          }
          
          sessionStorage.setItem(cacheKey, JSON.stringify({ data: newStats, timestamp: now }))
          setStats(newStats)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        const cached = sessionStorage.getItem('homepage_stats')
        if (cached) {
          const { data } = JSON.parse(cached)
          setStats(data)
        }
      }
    }
    
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
  }, [])

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
      setUsernameError(validationError)
      setIsUsernameAvailable(false)
      return
    }

    setCheckingUsername(true)
    setUsernameError('')
    
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
        setIsUsernameAvailable(false)
        setUsernameError('Username is already taken')
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
          setIsUsernameAvailable(false)
          setUsernameError('This username conflicts with an existing page alias')
          return
        }
      }

      setIsUsernameAvailable(true)
      setUsernameError('')
    } catch (error) {
      console.error('Error checking username:', error)
      setUsernameError('Error checking username availability')
      setIsUsernameAvailable(false)
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(value)
    setIsUsernameAvailable(null)
    setUsernameError('')
    
    if (value.length >= 1) {
      const timeoutId = setTimeout(() => {
        checkUsernameAvailability(value)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }

  const handleClaim = async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      toast.error('Please enter a username')
      return
    }

    const validationError = validateUsername(username)
    if (validationError) {
      setUsernameError(validationError)
      toast.error(validationError)
      return
    }

    if (isUsernameAvailable === null) {
      await checkUsernameAvailability(username)
      return
    }

    if (!isUsernameAvailable) {
      toast.error('Please choose an available username')
      return
    }

    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      localStorage.setItem('pending_username', username.toLowerCase())
      login({
        appState: {
          returnTo: '/setup'
        }
      })
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-orange-500/50 border-t-orange-500 rounded-full animate-spin absolute"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]"></div>

      <header className="relative z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src={logo} 
                alt="radium.lol" 
                className="h-8 sm:h-10 w-auto group-hover:opacity-80 transition-opacity"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link to="/help" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">Help Center</Link>
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">Discord</a>
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">Pricing</Link>
              {isAuthenticated ? (
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">Dashboard</Link>
              ) : (
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">Login</Link>
              )}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium text-sm transition-all"
                >
                  Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => login()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium text-sm transition-all"
                >
                  Sign Up Free
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              <Link to="/help" className="block text-gray-300 hover:text-white transition-colors">Help Center</Link>
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">Discord</a>
              <Link to="/pricing" className="block text-gray-300 hover:text-white transition-colors">Pricing</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                  <Link to="/dashboard" className="block px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium text-center">Dashboard</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-gray-300 hover:text-white transition-colors">Login</Link>
                  <button
                    onClick={() => login()}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium"
                  >
                    Sign Up Free
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        <section className="pt-12 sm:pt-16 lg:pt-24 pb-16 sm:pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Everything you want,{' '}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">right here.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              radium.lol is your go-to for modern, feature-rich portfolio pages and fast, secure file hosting. Everything you need — right here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => isAuthenticated ? navigate('/dashboard') : login()}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base sm:text-lg transition-all shadow-lg shadow-orange-500/30"
              >
                Sign Up for Free
              </button>
              <Link
                to="/pricing"
                className="px-8 py-3 rounded-lg border-2 border-green-500/50 bg-transparent hover:bg-green-500/10 text-green-400 hover:text-green-300 font-semibold text-base sm:text-lg transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-white/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-5 h-5 text-orange-400" />
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {stats.views >= 1000 ? `${(stats.views / 1000).toFixed(1)}K+` : `${stats.views.toLocaleString()}+`}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Profile Views</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {stats.users >= 1000 ? `${(stats.users / 1000).toFixed(1)}K+` : `${stats.users.toLocaleString()}+`}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Users</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-orange-400" />
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {stats.pages >= 1000 ? `${(stats.pages / 1000).toFixed(1)}K+` : `${stats.pages.toLocaleString()}+`}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Total Pages</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {stats.subscribers >= 1000 ? `${(stats.subscribers / 1000).toFixed(1)}K+` : `${stats.subscribers.toLocaleString()}+`}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Subscribers</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Claim your profile and create an account in minutes!
            </h2>
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleClaim} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono">radium.lol/</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                      placeholder="username"
                      className={`w-full pl-[100px] pr-12 py-3 rounded-lg bg-black/40 border ${
                        usernameError 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : isUsernameAvailable 
                          ? 'border-green-500/50 focus:border-green-500' 
                          : 'border-white/10 focus:border-orange-500/50'
                      } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm sm:text-base`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingUsername ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      ) : isUsernameAvailable === true ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : isUsernameAvailable === false ? (
                        <X className="w-5 h-5 text-red-400" />
                      ) : null}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={checkingUsername || !isUsernameAvailable}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base sm:flex-shrink-0"
                >
                  {checkingUsername ? 'Checking...' : 'Claim Now'}
                </button>
              </form>
              <div className="min-h-[24px] mt-2">
                {usernameError && (
                  <p className="text-red-400 text-sm text-left">{usernameError}</p>
                )}
                {isUsernameAvailable && !usernameError && (
                  <p className="text-green-400 text-sm text-left">Username is available!</p>
                )}
                {username && !usernameError && isUsernameAvailable === null && !checkingUsername && (
                  <p className="text-gray-500 text-xs text-left">
                    1-30 characters, lowercase letters, numbers, and underscores only
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-white/5 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Explore our exclusive plans and join{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">{stats.subscribers.toLocaleString()}+</span>{' '}
              subscribers.
            </h2>
            <Link
              to="/pricing"
              className="inline-block mt-8 px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-lg transition-all shadow-lg shadow-yellow-500/30"
            >
              Explore Plans
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2024 radium.lol. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
