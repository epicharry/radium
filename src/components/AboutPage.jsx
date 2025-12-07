import { useState, useEffect } from 'react'
import { Send, Code, Sun, MapPin, Laptop, Mail, Music } from 'lucide-react'
import ContactDialog from './ContactDialog'
import GithubContributionGraph from './GithubContributionGraph'
import ScrambleText from './ScrambleText'
import { 
  SiJavascript, SiTypescript, SiReact, SiPython, SiGo, SiPhp, 
  SiCplusplus, SiRuby, SiRust, SiSwift, SiKotlin,
  SiHtml5, SiCss3, SiVuedotjs, SiNodedotjs, SiDocker, SiMongodb, SiPostgresql,
  SiMysql, SiRedis, SiGit, SiMarkdown, SiJson, SiYaml, SiXml, SiGraphql,
  SiTailwindcss, SiNextdotjs, SiNuxtdotjs, SiSvelte, SiAngular, SiFlutter,
  SiDart, SiLua, SiPerl, SiScala, SiElixir, SiHaskell, SiClojure, SiErlang
} from 'react-icons/si'

const getLanguageIcon = (language) => {
  if (!language) return Code
  
  const lang = language.toLowerCase().trim()
  
  const iconMap = {
    'javascript': SiJavascript,
    'js': SiJavascript,
    'jsx': SiReact,
    'typescript': SiTypescript,
    'ts': SiTypescript,
    'tsx': SiReact,
    'react': SiReact,
    'vue': SiVuedotjs,
    'vue.js': SiVuedotjs,
    'nuxt': SiNuxtdotjs,
    'nuxt.js': SiNuxtdotjs,
    'next': SiNextdotjs,
    'next.js': SiNextdotjs,
    'svelte': SiSvelte,
    'angular': SiAngular,
    'node': SiNodedotjs,
    'node.js': SiNodedotjs,
    
    'html': SiHtml5,
    'html5': SiHtml5,
    'css': SiCss3,
    'css3': SiCss3,
    'tailwind': SiTailwindcss,
    'tailwindcss': SiTailwindcss,
    
    'python': SiPython,
    'java': Code,
    'go': SiGo,
    'golang': SiGo,
    'php': SiPhp,
    'ruby': SiRuby,
    'rust': SiRust,
    'c++': SiCplusplus,
    'cpp': SiCplusplus,
    'c': Code,
    'c#': Code,
    'csharp': Code,
    
    'swift': SiSwift,
    'kotlin': SiKotlin,
    'dart': SiDart,
    'flutter': SiFlutter,
    
    'bash': Code,
    'shell': Code,
    'sh': Code,
    'lua': SiLua,
    'perl': SiPerl,
    
    'scala': SiScala,
    'elixir': SiElixir,
    'haskell': SiHaskell,
    'clojure': SiClojure,
    'erlang': SiErlang,
    
    'sql': SiPostgresql,
    'postgresql': SiPostgresql,
    'mysql': SiMysql,
    'mongodb': SiMongodb,
    'redis': SiRedis,
    
    'docker': SiDocker,
    'git': SiGit,
    
    'json': SiJson,
    'yaml': SiYaml,
    'xml': SiXml,
    'markdown': SiMarkdown,
    'md': SiMarkdown,
    'graphql': SiGraphql,
  }
  
  if (iconMap[lang]) {
    return iconMap[lang]
  }
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lang.includes(key) || key.includes(lang)) {
      return icon
    }
  }
  
  return Code
}

export default function AboutPage({ config = {}, userProfile = null }) {
  const [spotifyData, setSpotifyData] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [vscodeData, setVscodeData] = useState(null)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  
  const isPremium = userProfile?.is_premium === true && (!userProfile?.premium_expires_at || new Date(userProfile.premium_expires_at) > new Date())
  const hasWakaTimeToken = !!(config.wakatime_token && config.wakatime_token.trim())

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const accessToken = config.spotify_token
        if (!accessToken) {
          return
        }

        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (response.status === 204 || !response.ok) {
          setSpotifyData({ isPlaying: false })
          return
        }

        const playerData = await response.json()

        if (!playerData.is_playing || !playerData.item) {
          setSpotifyData({ isPlaying: false })
          return
        }

        const track = playerData.item
        const progress = Math.round((playerData.progress_ms / track.duration_ms) * 100)
        
        const formatTime = (ms) => {
          const seconds = Math.floor(ms / 1000)
          const minutes = Math.floor(seconds / 60)
          const secs = seconds % 60
          return `${minutes}:${secs.toString().padStart(2, '0')}`
        }

        setSpotifyData({
          isPlaying: true,
          title: track.name,
          artist: track.artists.map(a => a.name).join(', '),
          album: track.album.name,
          albumArt: track.album.images[0]?.url || null,
          progress: progress,
          currentTime: formatTime(playerData.progress_ms),
          duration: formatTime(track.duration_ms),
          device: playerData.device?.name || 'Unknown'
        })
      } catch (error) {
        console.error('Failed to fetch Spotify data:', error)
        setSpotifyData({ isPlaying: false })
      }
    }

    const fetchWeather = async () => {
      try {
        const response = await fetch('https://wttr.in/Chennai?format=j1')
        if (!response.ok) throw new Error('Weather fetch failed')
        
        const data = await response.json()
        const current = data.current_condition[0]
        const location = data.nearest_area[0]
        
        const weatherDesc = current.weatherDesc[0]?.value || 'Clear'
        
        const getWindArrow = (direction) => {
          const arrows = {
            'N': '↑', 'NNE': '↗', 'NE': '↗', 'ENE': '→',
            'E': '→', 'ESE': '→', 'SE': '↘', 'SSE': '↘',
            'S': '↓', 'SSW': '↙', 'SW': '↙', 'WSW': '←',
            'W': '←', 'WNW': '←', 'NW': '↖', 'NNW': '↖'
          }
          return arrows[direction] || '→'
        }
        
        setWeatherData({
          name: location.areaName[0].value,
          sys: { country: location.country[0].value },
          main: {
            temp: parseFloat(current.temp_C),
            feelsLike: parseFloat(current.FeelsLikeC || current.temp_C),
            humidity: parseFloat(current.humidity)
          },
          weather: [{
            main: weatherDesc
          }],
          wind: {
            direction: current.winddir16Point || 'N',
            speed: parseFloat(current.windspeedKmph || 0),
            arrow: getWindArrow(current.winddir16Point || 'N')
          },
          visibility: parseFloat(current.visibility || 0),
          precipitation: parseFloat(current.precipMM || 0),
          admin1: location.region[0]?.value
        })
      } catch (error) {
        console.error('Failed to fetch weather data:', error)
      }
    }

    const fetchVSCode = async () => {
      try {
        const apiKey = config.wakatime_token
        if (!apiKey) {
          return
        }
        
        const today = new Date()
        const date = today.toISOString().split('T')[0]
        
        const response = await fetch(`https://wakatime.com/api/v1/users/current/heartbeats?date=${date}`, {
          headers: {
            'Authorization': `Basic ${btoa(apiKey + ':')}`
          }
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('WakaTime API error:', response.status, errorText)
          return
        }
        
        const data = await response.json()
        console.log('WakaTime response:', data) 

        
        if (data.data && data.data.length > 0) {
          

          const latestHeartbeat = data.data[data.data.length - 1]
          setVscodeData({
            file: latestHeartbeat.entity || 'No file open',
            project: latestHeartbeat.project || 'No project',
            language: latestHeartbeat.language || 'Unknown',
            files: data.data.length
          })
        } else {
          

          const statusResponse = await fetch('https://wakatime.com/api/v1/users/current/status_bar/today', {
            headers: {
              'Authorization': `Basic ${btoa(apiKey + ':')}`
            }
          })
          
          if (statusResponse.ok) {
            const statusData = await statusResponse.json()
            if (statusData.data) {
              setVscodeData({
                file: statusData.data.editors?.[0]?.name || 'No editor',
                project: statusData.data.projects?.[0]?.name || 'No project',
                language: statusData.data.languages?.[0]?.name || 'Unknown',
                files: 0
              })
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch WakaTime data:', error)
      }
    }

    fetchWeather()
    
    if (config.spotify_token) {
      fetchSpotify()
      const spotifyInterval = setInterval(fetchSpotify, 30000)
      
      if (config.wakatime_token) {
        fetchVSCode()
        const vscodeInterval = setInterval(fetchVSCode, 30000)
        const weatherInterval = setInterval(fetchWeather, 600000)
        
        return () => {
          clearInterval(spotifyInterval)
          clearInterval(weatherInterval)
          clearInterval(vscodeInterval)
        }
      } else {
        const weatherInterval = setInterval(fetchWeather, 600000)
        
        return () => {
          clearInterval(spotifyInterval)
          clearInterval(weatherInterval)
        }
      }
    } else if (config.wakatime_token) {
      fetchVSCode()
      const vscodeInterval = setInterval(fetchVSCode, 30000)
      const weatherInterval = setInterval(fetchWeather, 600000)
      
      return () => {
        clearInterval(weatherInterval)
        clearInterval(vscodeInterval)
      }
    } else {
      const weatherInterval = setInterval(fetchWeather, 600000)
      
      return () => {
        clearInterval(weatherInterval)
      }
    }
  }, [config.wakatime_token, config.spotify_token])

  const telegramUrl = (config.telegram_url || '').trim()
  const email = (config.email || '').trim()
  const aboutTitle = (config.about_title || '').trim()
  const aboutDescription = (config.about_description || '').trim()

  const hasAboutContent = aboutTitle || aboutDescription || config.profile_image_url || email || telegramUrl

  if (!hasAboutContent) {
    return null
  }

  return (
    <section id="about" className="min-h-screen py-20 sm:py-24 lg:py-32 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="mb-12 relative rounded-lg overflow-hidden -mx-4 sm:-mx-6 lg:-mx-0">
        {config.about_bg_image_url && (
          <div 
            className="absolute inset-0 bg-no-repeat"
            style={{ 
              backgroundImage: `url(${config.about_bg_image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: '95% center'
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 flex flex-col justify-center min-h-[300px] sm:min-h-[400px]"> 
          {(aboutTitle || aboutDescription) && (
            <div className="mb-6 sm:mb-8">
              {aboutTitle && (
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold leading-tight translate-y-[10px] pr-2 sm:pr-4 break-words lg:-mx-4">
                  {aboutTitle}
                </h1>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-8 mx-0 sm:mx-4">
            {aboutDescription && (
              <ScrambleText 
                radius={50}
                duration={1.2}
                speed={0.5}
                scrambleChars=".:"
                className="text-sm xs:text-base sm:text-lg text-gray-300 max-w-3xl leading-relaxed break-words flex-1 w-full"
              >
                {aboutDescription}
              </ScrambleText>
            )}
            {config.profile_image_url && (
              <div className="w-full sm:w-48 sm:h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-lg border-2 border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden mx-auto sm:mx-0 sm:ml-6 md:ml-8 mt-2 sm:-mt-6">
                <img src={config.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {(email || telegramUrl) && (
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-12">
          {email && (
            <button
              onClick={() => setIsContactDialogOpen(true)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all whitespace-nowrap"
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>Mail</span>
            </button>
          )}
          {telegramUrl && (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all whitespace-nowrap"
            >
              <Send className="w-4 h-4 flex-shrink-0" />
              <span>Telegram</span>
            </a>
          )}
        </div>
      )}

      <div className="mb-12">
        <GithubContributionGraph username={userProfile?.username || 'deyoyk'} config={config} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full">
        <div className="p-4 sm:p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm w-full overflow-hidden">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-400">Now playing</span>
            </div>
            {spotifyData?.device && (
              <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                <span className="whitespace-nowrap">{spotifyData.progress}%</span>
                <span>•</span>
                <Laptop className="w-3 h-3 flex-shrink-0" />
                <span className="truncate max-w-[100px] sm:max-w-[120px]">{spotifyData.device}</span>
              </div>
            )}
          </div>
          {spotifyData?.isPlaying ? (
            <>
              <div 
                className="w-full h-32 xs:h-40 sm:h-48 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: spotifyData.albumArt ? `url(${spotifyData.albumArt})` : 'none' }}
              >
                {!spotifyData.albumArt && <Music className="w-12 h-12 sm:w-16 sm:h-16 text-pink-400" />}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 break-words">{spotifyData.title}</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-4 break-words">{spotifyData.artist} • {spotifyData.album}</p>
              <div className="relative">
                <div className="w-full h-1 bg-white/10 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${spotifyData.progress || 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{spotifyData.currentTime || '0:00'}</span>
                  <span>{spotifyData.duration || '0:00'}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Music className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-xs sm:text-sm text-gray-500">Not playing anything</p>
            </div>
          )}
        </div>

        {isPremium && hasWakaTimeToken && (
          <div className="p-4 sm:p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm w-full overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <Code className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-400">Now coding</span>
            </div>
            {vscodeData ? (
            <div className="mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
                {(() => {
                  try {
                    const LanguageIcon = getLanguageIcon(vscodeData.language)
                    if (LanguageIcon && typeof LanguageIcon === 'function') {
                      return <LanguageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
                    }
                  } catch (error) {
                    console.error('Error rendering language icon:', error)
                  }
                  return <Code className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
                })()}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">Visual Studio Code</h3>
              <p className="text-xs sm:text-sm text-gray-400 text-center mb-1 px-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-full" title={vscodeData.file || 'No file open'}>
                {vscodeData.file ? vscodeData.file.split(/[/\\]/).pop() : 'No file open'}
              </p>
              <p className="text-xs text-gray-500 text-center px-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-full" title={`${vscodeData.project || 'No project'} - ${vscodeData.files || 0} files`}>
                {vscodeData.project || 'No project'} - {vscodeData.files || 0} files
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
                <Code className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">nothin cooking up aright now</h3>
              <p className="text-xs sm:text-sm text-gray-400 text-center mb-1">No activity detected</p>
              <p className="text-xs text-gray-500 text-center">Connect WakaTime or activity tracker</p>
            </div>
            )}
          </div>
        )}

        <div className="p-4 sm:p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm w-full overflow-hidden">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-400">Weather</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 flex-wrap">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="break-words">{weatherData?.name || 'Chennai'}{weatherData?.admin1 ? `, ${weatherData.admin1}` : ''}, {weatherData?.sys?.country || 'India'}</span>
            </div>
          </div>
          {weatherData ? (
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold mb-2 capitalize break-words">{weatherData.weather?.[0]?.main || 'N/A'}</h3>
              <div className="text-sm sm:text-base text-gray-300">
                +{Math.round(weatherData.main?.temp)}({Math.round(weatherData.main?.feelsLike)}) °C
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                {weatherData.wind?.arrow || '→'} {Math.round(weatherData.wind?.speed || 0)} km/h
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                {Math.round(weatherData.visibility || 0)} km
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                {weatherData.precipitation?.toFixed(1) || '0.0'} mm
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Loading...</h3>
              <div className="text-sm sm:text-base text-gray-300">Loading...</div>
              <div className="text-xs sm:text-sm text-gray-400">Loading...</div>
              <div className="text-xs sm:text-sm text-gray-400">Loading...</div>
              <div className="text-xs sm:text-sm text-gray-400">Loading...</div>
            </div>
          )}
        </div>
      </div>
      </div>

      <ContactDialog 
        isOpen={isContactDialogOpen} 
        onClose={() => setIsContactDialogOpen(false)} 
      />
    </section>
  )
}


