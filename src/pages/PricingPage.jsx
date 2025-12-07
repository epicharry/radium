import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Check, Crown, Sparkles, Menu, X, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PayPalButton from '../components/PayPalButton'
import logo from '../assets/logo.png'

export default function PricingPage() {
  const { isAuthenticated, profile, login } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)

  useEffect(() => {
    if (profile) {
      setIsPremium(profile.is_premium === true && (!profile.premium_expires_at || new Date(profile.premium_expires_at) > new Date()))
    }
  }, [profile])

  useEffect(() => {
    const fetchSubscriberCount = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('is_premium, premium_expires_at')
        
        if (data) {
          const premiumUsers = data.filter(p => {
            const isPremium = p.is_premium === true
            const notExpired = !p.premium_expires_at || new Date(p.premium_expires_at) > new Date()
            return isPremium && notExpired
          }).length
          
          setSubscriberCount(premiumUsers)
        }
      } catch (error) {
        console.error('Failed to fetch subscriber count:', error)
      }
    }
    
    fetchSubscriberCount()
  }, [])

  const features = {
    free: [
      'Basic Customization',
      'Profile Analytics',
      'Basic Effects',
      'Add Your Socials',
      'Background Effects',
      'Color Customization',
      'Username Effects'
    ],
    premium: [
      'Exclusive Badge',
      'Custom Fonts',
      'Typewriter Animation',
      'Special Profile Effects',
      'Advanced Customization',
      'Metadata & SEO Customization',
      'Layout Customization',
      'Text Fonts',
      'Cursor Effects',
      'Profile Widgets',
      'Page Alias',
      'Exclusive Profile Preferences',
      'WakaTime Integration',
      'IDE-Compatible Features'
    ]
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.05),transparent_50%)]"></div>

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
              <Link to="/pricing" className="text-yellow-400 font-semibold text-sm lg:text-base">Pricing</Link>
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
              <Link to="/pricing" className="block text-yellow-400 font-semibold">Pricing</Link>
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

      <main className="relative z-10 py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Explore our exclusive plans and join{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {subscriberCount >= 1000 ? `${(subscriberCount / 1000).toFixed(1)}K+` : `${subscriberCount.toLocaleString()}+`}
              </span>{' '}
              subscribers.
            </h1>
            <div className="mt-6 max-w-3xl mx-auto">
              <p className="text-gray-400 text-sm sm:text-base mb-4">
                <strong className="text-white">radium.lol exclusive features:</strong> Only available on our platform. Create stunning developer portfolios with advanced customization, IDE-compatible code snippets, real-time WakaTime integration, custom page aliases, and professional SEO tools. Join thousands of developers showcasing their work.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-left text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span>Lightning-fast performance with global CDN</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span>Custom domain support (Premium)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span>Real-time profile analytics & insights</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span>Template marketplace & sharing</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span>Unlimited profile views & visitors</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span>Advanced SEO & metadata control</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="p-6 sm:p-8 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm relative">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Free</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold">0€</span>
                  <span className="text-gray-400 text-sm">/Lifetime</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">For beginners, link all your socials in one place.</p>
              </div>
              <ul className="space-y-3 mb-8">
                {features.free.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="block w-full text-center px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all"
                >
                  Get Started
                </Link>
              ) : (
                <button
                  onClick={() => login()}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all"
                >
                  Get Started
                </button>
              )}
            </div>

            <div className="p-6 sm:p-8 rounded-xl border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs font-semibold whitespace-nowrap">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl font-bold">Premium</h2>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold">6,99€</span>
                  <span className="text-gray-400 text-sm">/Lifetime</span>
                </div>
                <p className="text-gray-300 text-sm mt-2 font-semibold">Pay once. Keep it forever.</p>
                <p className="text-gray-400 text-sm mt-1">The perfect plan to discover your creativity & unlock more features.</p>
              </div>
              <ul className="space-y-3 mb-8">
                {features.premium.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm sm:text-base break-words">{feature}</span>
                  </li>
                ))}
              </ul>
              {isPremium ? (
                <div className="w-full text-center px-6 py-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 font-semibold">
                  Premium Active
                </div>
              ) : isAuthenticated ? (
                <PayPalButton
                  amount="6.99"
                  currency="EUR"
                  description="Premium Lifetime Access"
                  onSuccess={() => {
                    navigate('/dashboard')
                    window.location.reload()
                  }}
                />
              ) : (
                <button
                  onClick={() => login()}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold transition-all"
                >
                  Sign Up to Purchase
                </button>
              )}
            </div>
          </div>

          <div className="mt-12 sm:mt-16 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2024 radium.lol. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

