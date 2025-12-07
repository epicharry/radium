import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../lib/supabase'
import { Download, ArrowLeft, Loader2, Eye } from 'lucide-react'
import LightRays from '../components/LightRays'

export default function TemplateViewPage() {
  const { shareId } = useParams()
  const { isAuthenticated, profile } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplate()
  }, [shareId])

  const loadTemplate = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('templates')
        .select(`
          *,
          profiles:profile_id (
            username,
            display_name
          )
        `)
        .eq('share_id', shareId)
        .single()

      if (error) throw error

      if (!data) {
        toast.error('Template not found')
        navigate('/templates')
        return
      }

      setTemplate(data)

      await supabase
        .from('templates')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id)
    } catch (error) {
      console.error('Error loading template:', error)
      toast.error(`Failed to load template: ${error.message}`)
      navigate('/templates')
    } finally {
      setLoading(false)
    }
  }

  const applyTemplate = async () => {
    if (!profile) {
      toast.error('Please log in to apply templates')
      navigate('/login')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-orange-500/50 border-t-orange-500 rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-400">Loading template...</p>
        </div>
      </div>
    )
  }

  if (!template) {
    return null
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
            <Link
              to="/templates"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Templates</span>
            </Link>
            {isAuthenticated && profile && (
              <button
                onClick={applyTemplate}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Apply Template</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">{template.name}</h1>
            {template.description && (
              <p className="text-gray-400 text-lg">{template.description}</p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span>By</span>
                <Link
                  to={`/${template.profiles?.username || ''}`}
                  className="text-orange-400 hover:text-orange-300"
                >
                  {template.profiles?.display_name || template.profiles?.username || 'Unknown'}
                </Link>
              </div>
              <span>•</span>
              <span>{new Date(template.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{template.views || 0} views</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-gray-400 text-center py-8">
              Template preview coming soon. Click "Apply Template" to use this template on your page.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

