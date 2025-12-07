import { X } from 'lucide-react'
import { cn } from '../lib/utils'

export default function MobileMenu({ isOpen, onClose, children, title }) {
  return (
    <>
      {}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-black/95 via-black/90 to-black/95 backdrop-blur-2xl border-r border-white/10 z-50 lg:hidden transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold">{title || 'Menu'}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

