import { X, Mail, Send, Copy } from 'lucide-react'

export default function ContactDialog({ isOpen, onClose }) {
  if (!isOpen) return null

  const email = 'hey@deyo.lol'
  const telegramUrl = 'https://t.me/deyodyalan'

  const handleEmailClick = () => {
    const mailtoLink = `mailto:${email}`
    window.open(mailtoLink, '_blank')
  }

  const handleTelegramClick = () => {
    window.open(telegramUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCopyEmail = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(email)
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-md w-full mx-2 sm:mx-4 my-auto shadow-2xl overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-white/5 before:to-transparent before:rounded-2xl sm:before:rounded-3xl before:pointer-events-none after:absolute after:inset-[0.5px] after:rounded-2xl sm:after:rounded-3xl after:bg-gradient-to-br after:from-white/30 after:via-white/15 after:to-transparent after:opacity-50 after:pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 hover:text-white transition-colors" />
        </button>

        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-white break-words">
            Contact Me
          </h2>

          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={handleEmailClick}
              className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-white/20 bg-white/8 hover:bg-white/12 hover:border-white/30 transition-all text-left group backdrop-blur-sm"
            >
              <div className="p-2 sm:p-3 rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors border border-white/10 flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Email</div>
                <div className="text-sm sm:text-base text-white font-medium truncate break-all">{email}</div>
              </div>
            </button>

            <button
              onClick={handleTelegramClick}
              className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-white/20 bg-white/8 hover:bg-white/12 hover:border-white/30 transition-all text-left group backdrop-blur-sm"
            >
              <div className="p-2 sm:p-3 rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors border border-white/10 flex-shrink-0">
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Telegram</div>
                <div className="text-sm sm:text-base text-white font-medium break-words">@deyodyalan</div>
              </div>
            </button>

            <button
              onClick={handleCopyEmail}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all text-xs sm:text-sm text-gray-300 hover:text-white backdrop-blur-sm"
            >
              <Copy className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="break-words">Copy email address</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

