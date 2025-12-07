import { Wrench } from 'lucide-react'


export default function SkillsetPage({ config = {} }) {
  const skillsets = config.skillsets || []
  
  if (skillsets.length === 0) {
    return null
  }

  return (
    <section id="skillset" className="min-h-screen py-20 sm:py-24 lg:py-32 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="mb-10 relative rounded-lg -mx-4 sm:-mx-2 lg:-mx-0 overflow-hidden min-h-[200px] sm:min-h-[250px] lg:-mx-0">
        {config.skillset_bg_image_url && (
          <div 
            className="absolute inset-0 bg-no-repeat"
            style={{ 
              backgroundImage: `url(${config.skillset_bg_image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'right center'
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <div className="space-y-12 sm:space-y-16">
        {config.skillsets && config.skillsets.length > 0 ? (
          config.skillsets.map((skill, index) => (
            <section key={skill.id || index} className="space-y-4 sm:space-y-6 w-full">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                <Wrench className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold break-words">{skill.name || `Skill ${index + 1}`}</h2>
              </div>
              {skill.description && (
                <p className="text-gray-300 text-sm xs:text-base sm:text-lg max-w-3xl leading-relaxed break-words">
                  {skill.description}
                </p>
              )}
            </section>
          ))
        ) : (
          <div className="text-gray-400 text-center py-12">
            <p>No skills added yet.</p>
          </div>
        )}
      </div>
      </div>
    </section>
  )
}

