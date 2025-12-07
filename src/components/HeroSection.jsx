import { useState, useEffect, useRef } from 'react'
import { ArrowDown, Github, Send, ChevronDown, Mail } from 'lucide-react'

export default function HeroSection({ config = {} }) {
  const [isContactHovered, setIsContactHovered] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [displayedTitle, setDisplayedTitle] = useState('')
  const typewriterTimeoutRef = useRef(null)
  
  const email = (config.email || '').trim()
  const telegramUrl = (config.telegram_url || '').trim()
  const githubUrl = (config.github_url || '').trim()
  const heroTitle = (config.hero_title || '').trim()
  const heroSubtitle = (config.hero_subtitle || '').trim()
  const heroDescription = (config.hero_description || '').trim()
  const location = (config.location || '').trim()
  
  const typewriterEnabled = config.premium_features?.typewriter_animation === true
  const typewriterSpeed = config.premium_features?.typewriter_speed || 50
  const typewriterDelay = config.premium_features?.typewriter_delay || 100

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    setIsCopied(true)
  }

  const handleMouseLeave = () => {
    setIsContactHovered(false)
    setIsCopied(false)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    if (!typewriterEnabled || !heroTitle) {
      setDisplayedTitle(heroTitle)
      return
    }

    setDisplayedTitle('')
    let currentIndex = 0
    let isDeleting = false

    const typeNextChar = () => {
      if (!isDeleting) {
        if (currentIndex < heroTitle.length) {
          setDisplayedTitle(heroTitle.slice(0, currentIndex + 1))
          currentIndex++
          typewriterTimeoutRef.current = setTimeout(typeNextChar, typewriterSpeed)
        } else {
          typewriterTimeoutRef.current = setTimeout(() => {
            isDeleting = true
            typeNextChar()
          }, 2000)
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--
          setDisplayedTitle(heroTitle.slice(0, currentIndex))
          typewriterTimeoutRef.current = setTimeout(typeNextChar, typewriterSpeed / 2)
        } else {
          isDeleting = false
          typewriterTimeoutRef.current = setTimeout(() => {
            typeNextChar()
          }, typewriterDelay)
        }
      }
    }

    typewriterTimeoutRef.current = setTimeout(typeNextChar, typewriterDelay)

    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current)
      }
    }
  }, [heroTitle, typewriterEnabled, typewriterSpeed, typewriterDelay])

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center max-w-4xl mx-auto text-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 w-full overflow-x-hidden">
      <div className="w-full max-w-full">
        {heroTitle && (
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 leading-tight break-words px-1 sm:px-2">
            <span className="bg-gradient-to-r from-orange-200 via-orange-100 to-white bg-clip-text text-transparent">
              {typewriterEnabled ? displayedTitle : heroTitle}
              {typewriterEnabled && displayedTitle.length < heroTitle.length && (
                <span className="animate-pulse">|</span>
              )}
            </span>
          </h1>
        )}

        {heroSubtitle && (
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
            {heroSubtitle}
          </h2>
        )}

        {heroDescription && (
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 max-w-3xl mx-auto leading-relaxed px-1 sm:px-2 break-words">
            {heroDescription}
          </p>
        )}
        {location && (
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-1 sm:px-2 break-words">
            Located in <span className="text-green-400 font-semibold">{location}</span>
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 w-full px-1 sm:px-2">
          {(config.active_projects && config.active_projects.length > 0) && (
            <button
              onClick={() => scrollToSection('projects')}
              className="flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm whitespace-nowrap"
            >
              <span>Explore my work</span>
              <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            </button>
          )}
          {githubUrl && (
            <button
              onClick={() => window.open(githubUrl, '_blank')}
              className="flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm whitespace-nowrap"
            >
              <Github className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>GitHub</span>
            </button>
          )}
          {(telegramUrl || email) && (
            <div
              className="relative flex items-center"
              onMouseEnter={() => setIsContactHovered(true)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center overflow-hidden rounded-lg">
                {telegramUrl && (
                  <button
                    onClick={() => window.open(telegramUrl, '_blank', 'noopener,noreferrer')}
                    className={`flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 ease-out backdrop-blur-sm whitespace-nowrap ${
                      isContactHovered && email ? 'rounded-r-none border-r-0' : ''
                    }`}
                  >
                    <span>{isContactHovered ? 'Telegram' : 'Contact me'}</span>
                    <Send className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  </button>
                )}
                {email && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      isContactHovered ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'
                    }`}
                  >
                    <button
                      onClick={handleCopyEmail}
                      className={`flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 hover:border-white/30 backdrop-blur-sm whitespace-nowrap min-w-[80px] ${
                      isContactHovered && telegramUrl ? 'rounded-l-none border-l-0' : ''
                    }`}
                    >
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="min-w-[60px] text-center">{isCopied ? 'Copied' : 'Mail'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div 
          className="flex justify-center mt-8 sm:mt-12 cursor-pointer"
          onClick={() => scrollToSection('about')}
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/60 animate-bounce hover:text-white/80 transition-colors" />
        </div>
      </div>
    </section>
  )
}
