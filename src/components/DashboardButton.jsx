import { cn } from '../lib/utils'
import { Loader2 } from 'lucide-react'

export default function DashboardButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  className,
  ...props
}) {
  const variants = {
    primary: "bg-gradient-to-r from-orange-500/20 to-orange-500/10 border-orange-500/50 hover:from-orange-500/30 hover:to-orange-500/20 text-white",
    secondary: "bg-white/5 border-white/20 hover:bg-white/10 text-white",
    ghost: "border-transparent hover:bg-white/5 text-gray-400 hover:text-white",
    danger: "bg-red-500/10 border-red-500/50 hover:bg-red-500/20 text-red-400"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-medium",
        "transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-orange-500/50",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  )
}

