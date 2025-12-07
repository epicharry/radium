import { useState, useEffect } from 'react'
import { Calendar, Clock, Box, Wrench, Star, Eye } from 'lucide-react'

export default function Header({ username, displayName, config = {}, userProfile = null, musicAccepted = false }) {
  const [currentDate, setCurrentDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [activeSection, setActiveSection] = useState('hero')

  const timezone = config.timezone || 'Asia/Kolkata'
  const showDate = config.show_date !== false
  const showTime = config.show_time !== false
  const showViewCount = config.show_view_count === true

  

  const shouldShowSection = (sectionId) => {
    

    if (config.section_visibility?.[sectionId] === false) {
      return false
    }

    

    if (sectionId === 'projects') {
      return config.active_projects && config.active_projects.length > 0
    }
    if (sectionId === 'skillset') {
      return config.skillsets && config.skillsets.length > 0
    }
    if (sectionId === 'about') {
      return !!(config.about_title || config.about_description || 
                config.github_url || config.telegram_url || config.discord_url || 
                config.linkedin_url || config.twitter_url || config.instagram_url || 
                config.youtube_url || config.website_url || config.email || config.location)
    }
    return true
  }

  const headerName = displayName || userProfile?.display_name || username || 'radium'

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      
      const dateOptions = { day: '2-digit', month: 'long', year: 'numeric', timeZone: timezone }
      const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: timezone }
      
      setCurrentDate(now.toLocaleDateString('en-US', dateOptions))
      const timeStr = now.toLocaleTimeString('en-US', timeOptions)
      const tzAbbr = Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value || ''
      setCurrentTime(timeStr + (tzAbbr ? ` ${tzAbbr}` : ''))
    }

    if (showDate || showTime) {
      updateDateTime()
      const interval = setInterval(updateDateTime, 1000)
      return () => clearInterval(interval)
    }
  }, [timezone, showDate, showTime])

  useEffect(() => {
    const availableSections = ['hero', 'projects', 'skillset', 'about'].filter(section => {
      if (section === 'hero') return true
      if (config.section_visibility?.[section] === false) return false
      if (section === 'projects') {
        return config.active_projects && config.active_projects.length > 0
      }
      if (section === 'skillset') {
        return config.skillsets && config.skillsets.length > 0
      }
      if (section === 'about') {
        return !!(config.about_title || config.about_description || 
                  config.github_url || config.telegram_url || config.discord_url || 
                  config.linkedin_url || config.twitter_url || config.instagram_url || 
                  config.youtube_url || config.website_url || config.email || config.location)
      }
      return true
    })

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150
      for (let i = availableSections.length - 1; i >= 0; i--) {
        const sectionId = availableSections[i]
        const section = document.getElementById(sectionId)
        if (section) {
          const sectionTop = section.offsetTop
          if (scrollPosition >= sectionTop) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [config.section_visibility, config.active_projects, config.skillsets, config.about_title, config.about_description, config.github_url, config.telegram_url, config.discord_url, config.linkedin_url, config.twitter_url, config.instagram_url, config.youtube_url, config.website_url, config.email, config.location])



  const scrollToSection = (sectionId) => {
    if (sectionId === 'hero' || sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[98%] max-w-7xl">
      <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl px-2 sm:px-4 lg:px-6 py-2 sm:py-3 shadow-2xl overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-white/5 before:pointer-events-none after:absolute after:inset-[1px] after:rounded-xl sm:after:rounded-2xl after:bg-gradient-to-br after:from-white/10 after:via-transparent after:to-transparent after:pointer-events-none">
        <div className="relative flex items-center justify-between gap-1 sm:gap-2 md:gap-4">
          <div className="flex items-center flex-1 min-w-0 relative">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="flex items-center gap-1 sm:gap-2 mr-1 sm:mr-2 md:mr-4 hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <Star className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-white" />
              <span className="text-xs sm:text-sm md:text-lg font-mono font-semibold text-white">{headerName}</span>
            </button>

            <nav 
              className="flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-3 shrink-0 overflow-x-auto scrollbar-hide -mx-1 px-1"
            >
              {shouldShowSection('projects') && (
                <button
                  onClick={() => scrollToSection('projects')}
                  className={`group relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap text-xs sm:text-sm md:text-base ${
                    activeSection === 'projects'
                      ? 'text-white bg-white/10 border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Box className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden xs:inline font-medium">Projects</span>
                </button>
              )}
              {shouldShowSection('skillset') && (
                <button
                  onClick={() => scrollToSection('skillset')}
                  className={`group relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap text-xs sm:text-sm md:text-base ${
                    activeSection === 'skillset'
                      ? 'text-white bg-white/10 border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Wrench className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden xs:inline font-medium">Skillset</span>
                </button>
              )}
              {shouldShowSection('about') && (
                <button
                  onClick={() => scrollToSection('about')}
                  className={`group relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap text-xs sm:text-sm md:text-base ${
                    activeSection === 'about'
                      ? 'text-white bg-white/10 border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden xs:inline font-medium">About</span>
                </button>
              )}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-2 lg:gap-3 text-xs sm:text-sm flex-shrink-0">
            {showViewCount && userProfile?.view_count !== undefined && (
              <div className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 whitespace-nowrap cursor-default">
                <Eye className="w-4 h-4 flex-shrink-0 text-gray-300 group-hover:text-white transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors font-mono">{userProfile.view_count.toLocaleString()}</span>
              </div>
            )}
            {(showDate || showTime) && (
              <>
                {showDate && (
                  <div className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 whitespace-nowrap cursor-default">
                    <Calendar className="w-4 h-4 flex-shrink-0 text-gray-300 group-hover:text-white transition-colors" />
                    <span className="text-gray-300 group-hover:text-white transition-colors">{currentDate}</span>
                  </div>
                )}
                {showTime && (
                  <div className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 whitespace-nowrap cursor-default">
                    <Clock className="w-4 h-4 flex-shrink-0 text-gray-300 group-hover:text-white transition-colors" />
                    <span className="text-gray-300 group-hover:text-white transition-colors font-mono">{currentTime}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
