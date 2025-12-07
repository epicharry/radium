import { cn } from '../lib/utils'
import { forwardRef } from 'react'

const DashboardTextarea = forwardRef(({ 
  label, 
  error, 
  hint, 
  className, 
  containerClassName,
  ...props 
}, ref) => {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg",
          "text-white placeholder-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50",
          "transition-all duration-200 resize-none",
          "hover:border-white/20",
          "break-words overflow-wrap-anywhere",
          error && "border-red-500/50 focus:ring-red-500/50",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  )
})

DashboardTextarea.displayName = 'DashboardTextarea'

export default DashboardTextarea

