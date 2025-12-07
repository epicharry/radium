import { FileText, Palette, ImageIcon, Settings, Sparkles, LogOut, ExternalLink, Eye, Save, LayoutDashboard, Command, Crown, Shield } from 'lucide-react'
import DashboardButton from './DashboardButton'
import { cn } from '../lib/utils'
import { Link } from 'react-router-dom'

export default function DashboardSidebar({
  activeTab,
  setActiveTab,
  tabs,
  onPreview,
  onViewLive,
  onSave,
  saving,
  profile,
  onLogout,
  isPremium = false,
  isAdmin = false
}) {

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 border-r border-white/10 bg-gradient-to-b from-black/80 via-black/60 to-black/80 backdrop-blur-2xl flex-shrink-0 hidden lg:flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <div className="flex flex-col gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
        </div>
        {profile?.username && (
          <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm">
            <p className="text-[10px] text-gray-400 mb-1 font-medium">Your page</p>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-white font-mono">radium.lol/{profile.username}</p>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-h-0 p-3">
        <div className="space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "group relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200",
                  "hover:scale-[1.02]",
                  isActive
                    ? "bg-gradient-to-r from-orange-500/30 via-orange-500/20 to-orange-500/10 border border-orange-500/40 text-white shadow-lg shadow-orange-500/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                )}
              >
                {isActive && (
                  <>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-orange-500 to-orange-400 rounded-r-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg"></div>
                  </>
                )}
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-7 h-7 rounded-md transition-all",
                  isActive 
                    ? "bg-orange-500/20 border border-orange-500/30" 
                    : "bg-white/5 border border-white/10 group-hover:bg-white/10"
                )}>
                  <Icon className={cn(
                    "w-4 h-4 transition-transform",
                    isActive ? "scale-110 text-orange-300" : "group-hover:scale-105"
                  )} />
                </div>
                <span className="relative z-10 text-sm font-medium flex-1 text-left">{tab.label}</span>
                {isActive && (
                  <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-shrink-0 p-3 border-t border-white/10 space-y-2 bg-gradient-to-t from-black/40 to-transparent">
        {!isPremium && (
          <Link
            to="/pricing"
            className="block mb-2 p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/40 hover:border-yellow-500/60 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="text-xs font-bold text-yellow-300 whitespace-nowrap">Upgrade to Premium</span>
            </div>
            <p className="text-[10px] text-gray-400 relative z-10">Unlock all features</p>
          </Link>
        )}
        <div className="mb-2">
          <p className="text-[10px] text-gray-500 mb-2 px-1 font-medium uppercase tracking-wider">Quick Actions</p>
          <div className="space-y-1.5">
            <DashboardButton
              onClick={onPreview}
              variant="secondary"
              icon={Eye}
              className="w-full"
              size="sm"
            >
              Preview
            </DashboardButton>
            <DashboardButton
              onClick={onViewLive}
              variant="secondary"
              icon={ExternalLink}
              className="w-full"
              size="sm"
            >
              View Live
            </DashboardButton>
            {isAdmin && (
              <Link
                to="/admin"
                className="block w-full"
              >
                <DashboardButton
                  variant="secondary"
                  icon={Shield}
                  className="w-full"
                  size="sm"
                >
                  Admin Panel
                </DashboardButton>
              </Link>
            )}
          </div>
        </div>
        
        <div className="pt-2 border-t border-white/10 space-y-1.5">
          <DashboardButton
            onClick={onSave}
            loading={saving}
            variant="primary"
            icon={Save}
            className="w-full"
            size="sm"
          >
            {saving ? 'Saving...' : 'Save All'}
          </DashboardButton>
          <button
            onClick={() => {
              onLogout()
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all group text-sm"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
          <div className="pt-1.5 border-t border-white/10">
            <p className="text-[10px] text-gray-500 text-center">
              Press <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400 text-[10px]">⌘</kbd> + <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400 text-[10px]">S</kbd> to save
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

