import { useState } from 'react'
import { X, Eye } from 'lucide-react'
import Header from './Header'
import HeroSection from './HeroSection'
import AboutPage from './AboutPage'
import ProjectsPage from './ProjectsPage'
import SkillsetPage from './SkillsetPage'
import Footer from './Footer'
import LightRays from './LightRays'

export default function ProfilePreview({ config, userProfile, isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-screen bg-black text-white font-mono overflow-x-hidden w-full max-w-full">
          <LightRays 
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={1}
            rayLength={2}
            followMouse={true}
            mouseInfluence={0.15}
          />
          <button
            onClick={onClose}
            className="group fixed top-6 right-6 z-[60] flex items-center gap-2.5 px-5 py-3 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-500/10 via-red-500/5 to-red-500/10 hover:from-red-500/20 hover:via-red-500/10 hover:to-red-500/20 hover:border-red-500/50 transition-all duration-300 backdrop-blur-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <X className="w-5 h-5 text-red-300 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <span className="font-semibold text-white relative z-10">Close Preview</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          <Header 
            username={userProfile?.username || 'preview'}
            displayName={userProfile?.display_name || 'User'}
            config={config}
          />
          <main className="w-full max-w-full overflow-x-hidden">
            <div 
              className="hero-background w-full max-w-full" 
              style={{ 
                backgroundImage: config.background_image_url 
                  ? `url(${config.background_image_url})` 
                  : 'none' 
              }}
            >
              <HeroSection config={config} />
            </div>
            <div className="dotted-pattern w-full max-w-full">
              <AboutPage config={config} userProfile={userProfile} />
            </div>
            <div className="grid-pattern w-full max-w-full">
              <ProjectsPage config={config} />
            </div>
            <div className="dotted-pattern w-full max-w-full">
              <SkillsetPage config={config} />
            </div>
          </main>
          <Footer config={config} />
        </div>
      </div>
    </div>
  )
}

