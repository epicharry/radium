import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../lib/supabase'
import { Search, Download, Share2, Copy, Eye, User, Calendar, Heart, ExternalLink, ArrowLeft } from 'lucide-react'
import LightRays from '../components/LightRays'

export default function TemplatesPage() {
  const { isAuthenticated, profile } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchByUser, setSearchByUser] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadTemplates()
  }, [isAuthenticated, navigate])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('templates')
        .select(`
          *,
          profiles!templates_profile_id_fkey (
            username,
            display_name
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (searchByUser) {
        const { data: userProfiles } = await supabase
          .from('profiles')
          .select('id')
          .ilike('username', `%${searchByUser}%`)
          .limit(10)

        if (userProfiles && userProfiles.length > 0) {
          const userIds = userProfiles.map(p => p.id)
          query = query.in('user_id', userIds)
        } else {
          setTemplates([])
          setLoading(false)
          return
        }
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query.limit(50)

      if (error) {
        console.error('Template query error:', error)
        const { data: simpleData, error: simpleError } = await supabase
          .from('templates')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(50)
        
        if (simpleError) throw simpleError
        
        const templatesWithProfiles = await Promise.all(
          (simpleData || []).map(async (template) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username, display_name')
              .eq('id', template.profile_id)
              .single()
            
            return {
              ...template,
              profiles: profileData || { username: 'Unknown', display_name: 'Unknown' }
            }
          })
        )
        
        setTemplates(templatesWithProfiles)
        return
      }
      
      setTemplates(data || [])
    } catch (error) {
      console.error('Error loading templates:', error)
      toast.error(`Failed to load templates: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadTemplates()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchByUser])

  const applyTemplate = async (template) => {
    if (!profile) {
      toast.error('Please log in to apply templates')
      return
    }

    if (!confirm(`Are you sure you want to apply template "${template.name}"? This will replace your current configuration.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ config: template.config })
        .eq('id', profile.id)

      if (error) throw error

      toast.success('Template applied successfully! Redirecting to dashboard...')
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (error) {
      console.error('Error applying template:', error)
      toast.error(`Failed to apply template: ${error.message}`)
    }
  }

  const shareTemplate = (template) => {
    const shareUrl = `${window.location.origin}/template/${template.share_id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Template link copied to clipboard!')
  }

  const likeTemplate = async (template) => {
    if (!profile) {
      toast.error('Please log in to like templates')
      return
    }

    try {
      const { data: existingLike } = await supabase
        .from('template_likes')
        .select('id')
        .eq('template_id', template.id)
        .eq('user_id', profile.id)
        .single()

      if (existingLike) {
        await supabase
          .from('template_likes')
          .delete()
          .eq('id', existingLike.id)

        await supabase
          .from('templates')
          .update({ likes: Math.max(0, (template.likes || 0) - 1) })
          .eq('id', template.id)
      } else {
        await supabase
          .from('template_likes')
          .insert({ template_id: template.id, user_id: profile.id })

        await supabase
          .from('templates')
          .update({ likes: (template.likes || 0) + 1 })
          .eq('id', template.id)
      }

      loadTemplates()
    } catch (error) {
      console.error('Error liking template:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-orange-500/50 border-t-orange-500 rounded-full animate-spin absolute"></div>
          <p className="text-gray-400">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-orange-950/10 text-white font-mono flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,140,0,0.03),transparent_50%)] pointer-events-none"></div>
      
      <LightRays 
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1}
        lightSpread={1}
        rayLength={2}
        followMouse={true}
        mouseInfluence={0.15}
      />

      <header className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
                  Templates
                </h1>
                <p className="text-sm text-gray-400">Browse and discover page templates</p>
              </div>
            </div>
            {profile && (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates by name or description..."
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchByUser}
                  onChange={(e) => setSearchByUser(e.target.value)}
                  placeholder="Search by username..."
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {templates.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No templates found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.01] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate mb-1">{template.name}</h3>
                        {template.description && (
                          <p className="text-sm text-gray-400 line-clamp-2 mb-2">{template.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate">
                          {template.profiles?.username || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(template.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{template.views || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => likeTemplate(template)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm flex-1"
                      >
                        <Heart className={`w-4 h-4 ${template.likes > 0 ? 'text-red-400 fill-red-400' : 'text-gray-400'}`} />
                        <span>{template.likes || 0}</span>
                      </button>
                      {profile && (
                        <button
                          onClick={() => applyTemplate(template)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 transition-all text-sm flex-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>Apply</span>
                        </button>
                      )}
                      <button
                        onClick={() => shareTemplate(template)}
                        className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                        title="Copy share link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

