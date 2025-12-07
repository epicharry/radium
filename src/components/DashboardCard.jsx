import { cn } from '../lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function DashboardCard({ 
  children, 
  className, 
  title, 
  description, 
  icon: Icon,
  action,
  collapsible = false,
  expanded = true,
  onToggle,
  badge,
  ...props 
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.01] backdrop-blur-xl transition-all duration-300",
        "hover:border-white/20 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-0.5",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.1] before:via-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
        "group-hover:before:opacity-100",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        {(title || Icon) && (
          <div className="flex items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-white/5 gap-3">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 overflow-hidden">
              {Icon && (
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-500/10 border border-orange-500/30 shadow-lg shadow-orange-500/10">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-300" />
                </div>
              )}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2 flex-wrap">
                  {title && <h3 className="text-base sm:text-lg font-bold text-white truncate">{title}</h3>}
                  {badge && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 flex-shrink-0">
                      {badge}
                    </span>
                  )}
                </div>
                {description && <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2 break-words">{description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {action && <div className="flex-shrink-0">{action}</div>}
              {collapsible && (
                <button
                  onClick={onToggle}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all group/btn flex-shrink-0"
                  aria-label={expanded ? 'Collapse' : 'Expand'}
                >
                  {expanded ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover/btn:text-white transition-colors" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover/btn:text-white transition-colors" />
                  )}
                </button>
              )}
            </div>
          </div>
        )}
        {expanded && (
          <div className="p-4 sm:p-5 lg:p-6 overflow-hidden">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

