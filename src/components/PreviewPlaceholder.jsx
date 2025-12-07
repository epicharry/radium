import { Info, Sparkles } from 'lucide-react'

export default function PreviewPlaceholder({ title, description, icon: Icon = Info }) {
  return (
    <div className="bg-black text-white font-mono rounded-lg border border-white/10 overflow-hidden h-full flex flex-col">
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-orange-300" />
        </div>
        <div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Preview</div>
          <div className="text-sm font-semibold text-white">{title}</div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-orange-400/50" />
          </div>
          <p className="text-gray-400 text-sm mb-2">{description || 'Preview not available for this section'}</p>
          <p className="text-gray-500 text-xs">Changes will be reflected on your live page</p>
        </div>
      </div>
    </div>
  )
}

