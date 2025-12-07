import React, { useState, useEffect, useMemo } from 'react'
import { Github, AlertCircle } from 'lucide-react'

const CACHE_DURATION = 60 * 60 * 1000

const getContributionColor = (count) => {
  if (count === 0) return 'bg-black border border-white/10'
  if (count <= 3) return 'bg-green-500/30 border border-green-500/40'
  if (count <= 6) return 'bg-green-500/50 border border-green-500/60'
  if (count <= 10) return 'bg-green-500/70 border border-green-500/80'
  return 'bg-green-500/90 border border-green-500'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatShortDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const isToday = (dateString) => {
  const today = new Date()
  const date = new Date(dateString)
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

const ContributionDay = React.memo(function ContributionDay({ day, dayIndex, weekIndex }) {
  const count = day.contributionCount || 0
  const isCurrentDay = isToday(day.date)
  
  return (
    <div
      className={`${getContributionColor(count)} rounded-sm h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 flex-shrink-0 transition-transform duration-150 ${
        isCurrentDay ? 'ring-2 ring-green-400 ring-offset-1 ring-offset-black/50' : ''
      } hover:scale-110 hover:z-10`}
      role="button"
      tabIndex={0}
      aria-label={`${count} ${count === 1 ? 'contribution' : 'contributions'} on ${formatDate(day.date)}`}
    />
  )
})

ContributionDay.displayName = 'ContributionDay'

export default function GithubContributionGraph({ username = 'deyoyk', config = {} }) {
  const [loading, setLoading] = useState(true)
  const [totalContributions, setTotalContributions] = useState(0)
  const [weeks, setWeeks] = useState([])
  const [error, setError] = useState(null)

  const githubToken = config?.github_token || import.meta.env.VITE_GITHUB_TOKEN
  const CACHE_KEY = `github_contributions_${username}`
  
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null
      
      const { data, timestamp } = JSON.parse(cached)
      const now = Date.now()
      
      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error reading cache:', error)
      return null
    }
  }

  const setCachedData = (data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error setting cache:', error)
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchContributions = async () => {
      try {
        const cachedData = getCachedData()
        if (cachedData) {
          setTotalContributions(cachedData.totalContributions || 0)
          setWeeks(cachedData.weeks || [])
          setLoading(false)
          return
        }

        const endDate = new Date()
        const startDate = new Date()
        startDate.setFullYear(startDate.getFullYear() - 1)
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)

        const query = `
          query {
            user(login: "${username}") {
              contributionsCollection(from: "${startDate.toISOString()}", to: "${endDate.toISOString()}") {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                      weekday
                    }
                  }
                }
              }
            }
          }
        `

        const headers = {
          'Content-Type': 'application/json',
        }

        if (githubToken) {
          headers['Authorization'] = `Bearer ${githubToken}`
        }

        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers,
          body: JSON.stringify({ query })
        })

        if (!isMounted) return

        const data = await response.json()

        if (!response.ok) {
          const errorMsg = data.message || data.errors?.[0]?.message || 'Failed to fetch contributions'
          if (errorMsg.includes('rate limit') || errorMsg.includes('API rate limit')) {
            setError('GitHub API rate limit exceeded. Please add a GitHub token in your dashboard settings for higher limits.')
          } else if (errorMsg.includes('requires authentication') || errorMsg.includes('Bad credentials')) {
            setError('GitHub API requires authentication. Please add a GitHub token in your dashboard settings.')
          } else {
            setError(`Failed to fetch: ${errorMsg}`)
          }
          console.error('GitHub API error:', data)
          setLoading(false)
          return
        }
        
        if (data.errors) {
          const errorMsg = data.errors[0]?.message || 'Unknown error'
          setError(`GitHub API error: ${errorMsg}. ${!githubToken ? 'Try adding a GitHub token in your dashboard settings.' : ''}`)
          console.warn('GraphQL errors:', data.errors)
          setLoading(false)
          return
        }
        
        if (data.data?.user?.contributionsCollection) {
          const calendar = data.data.user.contributionsCollection.contributionCalendar
          const contributionsData = {
            totalContributions: calendar.totalContributions || 0,
            weeks: calendar.weeks || []
          }
          
          setTotalContributions(contributionsData.totalContributions)
          setWeeks(contributionsData.weeks)
          setCachedData(contributionsData)
        } else {
          setError('No contribution data found. User may not exist or have no contributions.')
        }
      } catch (error) {
        if (!isMounted) return
        setError(`Network error: ${error.message}`)
        console.error('Failed to fetch GitHub contributions:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchContributions()

    return () => {
      isMounted = false
    }
  }, [username, githubToken])

  const monthLabels = useMemo(() => {
    if (weeks.length === 0) return []
    
    const monthMap = new Map()
    const seenMonths = new Set()
    
    weeks.forEach((week, weekIndex) => {
      if (week.contributionDays.length === 0) return
      
      const firstDay = week.contributionDays[0]
      const date = new Date(firstDay.date)
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      
      if (!seenMonths.has(monthKey)) {
        seenMonths.add(monthKey)
        if (!monthMap.has(weekIndex)) {
          monthMap.set(weekIndex, month)
        }
      }
    })
    
    return Array.from(monthMap.entries()).map(([weekIndex, month]) => ({
      weekIndex,
      month
    })).sort((a, b) => a.weekIndex - b.weekIndex)
  }, [weeks])

  if (loading) {
    return (
      <div className="relative p-4 sm:p-6 rounded-lg border border-white/10 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-600/5 to-black blur-xl scale-105"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Github className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 animate-pulse" />
          <span className="text-xs sm:text-sm text-gray-400">GitHub Activity</span>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
            <div className="text-gray-400 text-sm">Loading contributions...</div>
          </div>
        </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative p-4 sm:p-6 rounded-lg border border-white/10 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-600/5 to-black blur-xl scale-105"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Github className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-400">GitHub Activity</span>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
          <div className="text-red-400 text-sm mb-2 px-4">{error}</div>
          <div className="text-xs text-gray-500 px-4 max-w-md">
            To fix: Create a GitHub Personal Access Token with <code className="bg-black/20 px-1.5 py-0.5 rounded text-green-400">read:user</code> scope and add <code className="bg-black/20 px-1.5 py-0.5 rounded text-green-400">VITE_GITHUB_TOKEN=your_token_here</code> to your .env file
          </div>
        </div>
        </div>
      </div>
    )
  }

  const daysOfWeekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="relative p-4 sm:p-6 rounded-lg border border-white/10 w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-600/5 to-black"
      />
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-400 break-words">GitHub Activity</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 break-words">
              <span className="text-green-400 font-semibold">{totalContributions.toLocaleString()}</span> <span className="hidden xs:inline">contributions in the last year</span><span className="xs:hidden">contribs</span>
            </div>
          </div>

        <div className="w-full overflow-x-auto github-contrib-scroll -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="min-w-[600px] sm:min-w-full">
            <div className="flex flex-col">
              <div className="flex gap-[2px] mb-2 min-w-[600px] sm:min-w-0">
                <div className="w-8 sm:w-10 md:w-12 flex-shrink-0"></div>
                <div className="flex gap-[2px] flex-1 justify-between overflow-hidden">
                  {weeks.map((week, weekIndex) => {
                    const monthLabel = monthLabels.find(m => m.weekIndex === weekIndex)
                    
                    return (
                      <div
                        key={weekIndex}
                        className="flex-1 flex items-start justify-center min-w-0"
                      >
                        {monthLabel && (
                          <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                            {monthLabel.month}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className="flex gap-[2px] min-w-[600px] sm:min-w-0">
                <div className="flex flex-col gap-[2px] mr-2 sm:mr-3 flex-shrink-0">
                  {daysOfWeekLabels.map((day, idx) => (
                    <div 
                      key={idx} 
                      className="text-[10px] sm:text-xs text-gray-400 h-2.5 sm:h-3 w-8 sm:w-10 md:w-12 flex items-center justify-end pr-1"
                      aria-label={day}
                    >
                      {idx % 2 === 0 ? day : ''}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-[0.5px] flex-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[2px] flex-1 items-center min-w-0">
                      {week.contributionDays.map((day, dayIndex) => {
                        const dayKey = `${day.date}-${dayIndex}-${weekIndex}`
                        
                        return (
                          <ContributionDay
                            key={dayKey}
                            day={day}
                            dayIndex={dayIndex}
                            weekIndex={weekIndex}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-2 mt-4 text-[10px] sm:text-xs text-gray-500 flex-wrap min-w-[600px] sm:min-w-0">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black border border-white/10 rounded-sm transition-all hover:scale-110"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500/30 border border-green-500/40 rounded-sm transition-all hover:scale-110"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500/50 border border-green-500/60 rounded-sm transition-all hover:scale-110"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500/70 border border-green-500/80 rounded-sm transition-all hover:scale-110"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500/90 border border-green-500 rounded-sm transition-all hover:scale-110"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

