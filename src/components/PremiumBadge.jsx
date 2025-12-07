import { Crown, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PremiumBadge({ feature, className = '', compact = false }) {
  if (compact) {
    return (
      <div className={`relative ${className} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/90 backdrop-blur-lg rounded-lg border-2 border-yellow-500/40 flex items-center justify-center z-50 shadow-2xl shadow-yellow-900/30">
          <div className="text-center p-3 w-full">
            <div className="relative inline-block mb-2">
              <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
              <Lock className="w-6 h-6 text-yellow-400 mx-auto relative z-10 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-yellow-300 mb-2 whitespace-nowrap">Premium</p>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-xs transition-all shadow-lg shadow-yellow-500/40 hover:scale-105 whitespace-nowrap"
              onClick={(e) => e.stopPropagation()}
            >
              <Crown className="w-3 h-3" />
              <span>Upgrade</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className} overflow-hidden`}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl rounded-lg border-2 border-yellow-500/50 flex items-center justify-center z-50 shadow-2xl shadow-yellow-900/50">
        <div className="text-center p-6 max-w-xs w-full">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-yellow-500/30 blur-2xl rounded-full"></div>
            <Lock className="w-12 h-12 text-yellow-400 mx-auto relative z-10 animate-pulse" />
          </div>
          <p className="text-base font-bold text-white mb-1">Premium Feature</p>
          <p className="text-sm text-gray-300 mb-4 break-words">{feature}</p>
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-sm transition-all shadow-lg shadow-yellow-500/50 hover:scale-105"
            onClick={(e) => e.stopPropagation()}
          >
            <Crown className="w-4 h-4" />
            <span>Upgrade to Premium</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

