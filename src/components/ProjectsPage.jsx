import { useState } from 'react'
import { Server, ArrowRight, Sparkles, Clock } from 'lucide-react'


export default function ProjectsPage({ config = {} }) {
  const [showMessage, setShowMessage] = useState({})

  const projects = config.active_projects || []
  const upcomingProjects = config.upcoming_projects || []
  const projectsBg = config.projects_bg_image_url || ''

  const handleViewClick = (project) => {
    if (project.url) {
      window.open(project.url, '_blank', 'noopener,noreferrer')
    } else {
      setShowMessage(prev => ({ ...prev, [project.id]: true }))
      setTimeout(() => {
        setShowMessage(prev => ({ ...prev, [project.id]: false }))
      }, 7000)
    }
  }

  if (projects.length === 0 && upcomingProjects.length === 0) {
    return null
  }

  return (
    <section id="projects" className="min-h-screen py-20 sm:py-24 lg:py-32 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {projectsBg && (
          <div className="mb-10 relative rounded-lg -mx-4 sm:-mx-2 overflow-hidden min-h-[150px] sm:min-h-[180px] md:min-h-[200px]" style={{ maxHeight: '250' }}>
            <div 
              className="absolute inset-0 bg-no-repeat"
              style={{ 
                backgroundImage: `url(${projectsBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'right center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" style={{ background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0, 0, 0, 0.31) 60%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.2) 85%, transparent 100%)' }} />
          </div>
        )}

        {projects.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span>Active Projects</span>
            </h2>
            {config.active_projects_description && (
              <p className="text-sm sm:text-base text-gray-400 mb-6 ml-8">{config.active_projects_description}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
              {projects.map((project, index) => (
              <div
                key={project.id || index}
                className={`relative p-4 sm:p-6 rounded-lg border border-white/10 bg-gradient-to-br ${project.gradient || 'from-indigo-500/20 to-cyan-500/20'} backdrop-blur-sm hover:border-white/20 transition-all duration-300 group w-full overflow-hidden`}
              >
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold break-words">{project.title}</h3>
                        {project.domain && (
                          <p className="text-xs sm:text-sm text-gray-400 truncate">{project.domain}</p>
                        )}
                      </div>
                    </div>
                    {project.year && (
                      <span className="px-2 sm:px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold whitespace-nowrap flex-shrink-0 break-words">
                        {project.year}
                      </span>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-sm sm:text-base text-gray-300 mb-3 break-words">{project.description}</p>
                  )}

                  {project.role && project.role.length > 0 && (
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {project.role.map((r, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                          {r === 'Front-end' ? (
                            <Sparkles className="w-3 h-3 flex-shrink-0" />
                          ) : (
                            <Server className="w-3 h-3 flex-shrink-0" />
                          )}
                          {r}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.fullDescription && (
                    <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed break-words">{project.fullDescription}</p>
                  )}

                  {project.tech && project.tech.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 rounded text-xs bg-white/5 border border-white/10 whitespace-nowrap"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <button 
                    onClick={() => handleViewClick(project)}
                    className="flex items-center gap-2 text-xs sm:text-sm hover:text-white transition-all duration-300 group-hover:translate-x-1 w-full sm:w-auto"
                  >
                    <span className="transition-all duration-300 break-words">
                      {showMessage[project.id] ? "Sorry brah, the project isn't opensource or not hosted yet (no money)" : "View"}
                    </span>
                    {!showMessage[project.id] && <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-opacity duration-300 flex-shrink-0" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {upcomingProjects.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2 flex-wrap">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span className="break-words">Upcoming Projects</span>
            </h2>
            {config.upcoming_projects_description && (
              <p className="text-sm sm:text-base text-gray-400 mb-6 ml-8">{config.upcoming_projects_description}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-full">
              {upcomingProjects.map((project, index) => (
              <div
                key={project.id || index}
                className={`relative p-4 sm:p-6 rounded-lg border border-white/10 bg-gradient-to-br ${project.gradient || 'from-orange-500/20 to-red-500/20'} backdrop-blur-sm hover:border-white/20 transition-all duration-300 group w-full overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold break-words">{project.title}</h3>
                    </div>
                  </div>
                  <span className="px-2 sm:px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold whitespace-nowrap flex-shrink-0 break-words">
                    Coming Soon
                  </span>
                </div>

                {project.description && (
                  <p className="text-sm sm:text-base text-gray-300 mb-3 break-words">{project.description}</p>
                )}

                {project.fullDescription && (
                  <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed break-words">{project.fullDescription}</p>
                )}

                {project.tech && project.tech.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded text-xs bg-white/5 border border-white/10 whitespace-nowrap"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && upcomingProjects.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No projects added yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}

