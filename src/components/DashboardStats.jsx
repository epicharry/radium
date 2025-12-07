import { TrendingUp, Eye, Edit, Clock, Zap } from 'lucide-react'

export default function DashboardStats({ profile, config }) {
  const stats = [
    {
      label: 'Page Views',
      value: profile?.view_count?.toLocaleString() || '0',
      icon: Eye,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      gradient: 'from-blue-500/20 to-blue-500/5'
    },
    {
      label: 'Last Updated',
      value: 'Just now',
      icon: Clock,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      gradient: 'from-green-500/20 to-green-500/5'
    },
    {
      label: 'Sections',
      value: (() => {
        let count = 0
        

        if (config?.hero_title || config?.hero_subtitle || config?.hero_description) count++
        

        if (config?.about_title || config?.about_description || config?.profile_image_url) count++
        

        if ((config?.active_projects?.length || 0) > 0 || (config?.upcoming_projects?.length || 0) > 0) count++
        

        if ((config?.skillsets?.length || 0) > 0) count++
        return count.toString()
      })(),
      icon: Edit,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      gradient: 'from-purple-500/20 to-purple-500/5'
    },
    {
      label: 'Status',
      value: profile?.is_active !== false ? 'Active' : 'Inactive',
      icon: Zap,
      color: profile?.is_active !== false ? 'text-green-400' : 'text-red-400',
      bgColor: profile?.is_active !== false ? 'bg-green-500/10' : 'bg-red-500/10',
      borderColor: profile?.is_active !== false ? 'border-green-500/20' : 'border-red-500/20',
      gradient: profile?.is_active !== false ? 'from-green-500/20 to-green-500/5' : 'from-red-500/20 to-red-500/5'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl border ${stat.borderColor} bg-gradient-to-br ${stat.gradient} p-5 backdrop-blur-sm group hover:scale-[1.02] hover:shadow-xl hover:shadow-${stat.color.split('-')[1]}-500/20 transition-all duration-300`}
          >
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} border ${stat.borderColor} shadow-lg`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )
      })}
    </div>
  )
}

