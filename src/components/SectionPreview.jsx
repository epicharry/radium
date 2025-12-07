import Header from './Header'
import HeroSection from './HeroSection'
import AboutPage from './AboutPage'
import ProjectsPage from './ProjectsPage'
import SkillsetPage from './SkillsetPage'
import LightRays from './LightRays'

export default function SectionPreview({ section, config, userProfile }) {
  const styles = config.styles || {}
  const sectionStyles = styles[section] || {}

  const getBackgroundStyle = () => {
    if (sectionStyles.background_gradient) {
      return {
        background: sectionStyles.background_gradient,
        opacity: sectionStyles.background_opacity || 1,
        filter: sectionStyles.background_blur ? `blur(${sectionStyles.background_blur}px)` : 'none'
      }
    }
    if (sectionStyles.background_color) {
      return {
        backgroundColor: sectionStyles.background_color,
        opacity: sectionStyles.background_opacity || 1,
        filter: sectionStyles.background_blur ? `blur(${sectionStyles.background_blur}px)` : 'none'
      }
    }
    return {}
  }

  const renderSection = () => {
    switch(section) {
      case 'hero':
        return (
          <div style={getBackgroundStyle()} className="min-h-[400px] flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-4 text-center">
              <h1 
                className={`${sectionStyles.title_font || 'font-mono'} ${sectionStyles.title_size || 'text-4xl'} font-bold mb-4`}
                style={{ color: sectionStyles.title_color || '#ffffff' }}
              >
                {config.hero_title || 'Your Title'}
              </h1>
              {config.hero_subtitle && (
                <h2 
                  className={`${sectionStyles.subtitle_font || 'font-mono'} ${sectionStyles.subtitle_size || 'text-2xl'} font-bold mb-4`}
                  style={{ color: sectionStyles.subtitle_color || '#ffffff' }}
                >
                  {config.hero_subtitle}
                </h2>
              )}
              {config.hero_description && (
                <p 
                  className={`${sectionStyles.description_font || 'font-mono'} ${sectionStyles.description_size || 'text-base'}`}
                  style={{ color: sectionStyles.description_color || '#d1d5db' }}
                >
                  {config.hero_description}
                </p>
              )}
            </div>
          </div>
        )
      case 'about':
        return (
          <div style={getBackgroundStyle()} className="min-h-[300px] p-8">
            <div className="max-w-2xl mx-auto">
              <h2 
                className={`${sectionStyles.title_font || 'font-mono'} ${sectionStyles.title_size || 'text-3xl'} font-bold mb-4`}
                style={{ color: sectionStyles.title_color || '#ffffff' }}
              >
                {config.about_title || 'About Me'}
              </h2>
              {config.about_description && (
                <p 
                  className={`${sectionStyles.description_font || 'font-mono'} ${sectionStyles.description_size || 'text-base'}`}
                  style={{ color: sectionStyles.description_color || '#d1d5db' }}
                >
                  {config.about_description}
                </p>
              )}
            </div>
          </div>
        )
      case 'projects':
        return (
          <div style={getBackgroundStyle()} className="min-h-[300px] p-8">
            <div className="max-w-4xl mx-auto">
              <h2 
                className={`${sectionStyles.title_font || 'font-mono'} ${sectionStyles.title_size || 'text-3xl'} font-bold mb-6`}
                style={{ color: sectionStyles.title_color || '#ffffff' }}
              >
                Projects
              </h2>
              {config.active_projects && config.active_projects.length > 0 && (
                <div className="space-y-4">
                  {config.active_projects.slice(0, 2).map((project, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-lg border"
                      style={{
                        background: sectionStyles.card_gradient || sectionStyles.card_background || 'rgba(255, 255, 255, 0.05)',
                        borderColor: sectionStyles.card_border || 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: sectionStyles.card_blur ? `blur(${sectionStyles.card_blur}px)` : 'none'
                      }}
                    >
                      <h3 
                        className={`${sectionStyles.project_title_font || 'font-mono'} font-bold mb-2`}
                        style={{ color: sectionStyles.project_title_color || '#ffffff' }}
                      >
                        {project.title || 'Project Title'}
                      </h3>
                      {project.description && (
                        <p 
                          className="text-sm"
                          style={{ color: sectionStyles.project_description_color || '#d1d5db' }}
                        >
                          {project.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      case 'skillset':
        return (
          <div style={getBackgroundStyle()} className="min-h-[300px] p-8">
            <div className="max-w-2xl mx-auto">
              <h2 
                className={`${sectionStyles.title_font || 'font-mono'} ${sectionStyles.title_size || 'text-3xl'} font-bold mb-6`}
                style={{ color: sectionStyles.title_color || '#ffffff' }}
              >
                Skillset
              </h2>
              {config.skillsets && config.skillsets.length > 0 && (
                <div className="space-y-3">
                  {config.skillsets.slice(0, 3).map((skill, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-lg border"
                      style={{
                        background: sectionStyles.skill_background || 'rgba(255, 255, 255, 0.05)',
                        borderColor: sectionStyles.skill_border || 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <span 
                        className="font-medium"
                        style={{ color: sectionStyles.skill_color || '#ffffff' }}
                      >
                        {skill.name || 'Skill Name'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      default:
        return <div className="min-h-[200px] p-8">Preview not available for this section</div>
    }
  }

  return (
    <div className="bg-black text-white font-mono rounded-lg border border-white/10 overflow-hidden" style={{ minHeight: '400px' }}>
      <div className="p-2 bg-white/5 border-b border-white/10 text-xs text-gray-400">
        {section.charAt(0).toUpperCase() + section.slice(1)} Preview
      </div>
      <div className="overflow-auto max-h-[500px]">
        {renderSection()}
      </div>
    </div>
  )
}


