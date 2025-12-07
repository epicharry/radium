import { Menu, X, Bell, HelpCircle, Crown } from 'lucide-react'
import { cn } from '../lib/utils'

export default function DashboardHeader({
  onMenuClick,
  isMenuOpen,
  activeTab,
  tabs,
  onTabChange
}) {
  const activeTabLabel = tabs.find(t => t.id === activeTab)?.label || 'Dashboard'

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-2xl lg:hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div>
            <h1 className="text-lg font-bold">Dashboard</h1>
            <p className="text-xs text-gray-400">{activeTabLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
      <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                isActive
                  ? "bg-gradient-to-r from-orange-500/20 to-orange-500/10 border border-orange-500/30 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.premium && (
                <Crown className="w-3 h-3 text-yellow-400" />
              )}
            </button>
          )
        })}
      </div>
    </header>
  )
}

