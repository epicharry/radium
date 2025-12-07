import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function MusicWarning({ config, onAccept, onDecline }) {
  const [isVisible, setIsVisible] = useState(true)

  const warningConfig = config?.music_warning || {}
  const title = warningConfig.title || 'This page has music enabled'
  const message = warningConfig.message || 'Still want to visit?'
  
  

  const displayText = warningConfig.title 
    ? title 
    : 'This page has music enabled'
  const acceptText = warningConfig.accept_text || 'Yes, Continue'
  const declineText = warningConfig.decline_text || 'No, Go Back'
  const bgColor = warningConfig.background_color || '#000000'
  const textColor = warningConfig.text_color || '#ffffff'
  const buttonBgColor = warningConfig.button_bg_color || '#ff8c00'
  const buttonTextColor = warningConfig.button_text_color || '#ffffff'

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-md w-full bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-orange-500/40">
            <AlertTriangle className="w-10 h-10 text-orange-400" />
          </div>
          
          <div className="space-y-3 w-full">
            <h1 
              className="text-2xl sm:text-3xl font-bold text-center w-full"
              style={{ color: textColor }}
            >
              This page has music enabled
            </h1>
            {warningConfig.message && warningConfig.message !== 'Still want to visit?' && (
              <p 
                className="text-lg text-center w-full"
                style={{ color: textColor, opacity: 0.8 }}
              >
                {message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={() => {
                setIsVisible(false)
                onAccept()
              }}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ 
                backgroundColor: buttonBgColor,
                color: buttonTextColor
              }}
            >
              {acceptText}
            </button>
            <button
              onClick={() => {
                setIsVisible(false)
                onDecline()
              }}
              className="flex-1 px-6 py-3 rounded-lg font-semibold bg-white/10 border border-white/20 text-white transition-all hover:bg-white/20 active:scale-95"
            >
              {declineText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

