import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../lib/supabase'
import { Save, Upload, Image, Settings, Palette, FileText, Link2, Calendar, Clock, Loader2, X, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronUp, Layout, Type, ImageIcon, Sparkles, LogOut, ExternalLink, RotateCcw, LayoutDashboard, Music, Volume2, MousePointer2, Share2, Copy, Download, Search, Crown, Shield } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import ProfilePreview from '../components/ProfilePreview'
import StyleSection from '../components/StyleSection'
import ColorPicker from '../components/ColorPicker'
import FontSelector from '../components/FontSelector'
import DashboardCard from '../components/DashboardCard'
import DashboardInput from '../components/DashboardInput'
import DashboardTextarea from '../components/DashboardTextarea'
import DashboardButton from '../components/DashboardButton'
import DashboardSidebar from '../components/DashboardSidebar'
import DashboardHeader from '../components/DashboardHeader'
import DashboardStats from '../components/DashboardStats'
import MobileMenu from '../components/MobileMenu'
import LayoutEditor from '../components/LayoutEditor'
import PremiumBadge from '../components/PremiumBadge'

export default function Dashboard() {
  const { isAuthenticated, isLoading, profile: authProfile, login, logout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [profile, setProfile] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingSection, setSavingSection] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const [showFullPreview, setShowFullPreview] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState({ github: false, wakatime: false })
  const [templates, setTemplates] = useState([])
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [isPublicTemplate, setIsPublicTemplate] = useState(false)
  const [aliasError, setAliasError] = useState('')
  const [checkingAlias, setCheckingAlias] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    about: true,
    contact: true,
    datetime: false,
    projects: true,
    skillsets: true,
    apiKeys: false,
    settings: false,
    audio: true,
    musicWarning: true,
    cursor: true,
    sectionVisibility: true,
    sectionBackgrounds: false,
    exclusiveBadge: true,
    profileLayouts: true,
    customFonts: true,
    typewriterAnimation: true,
    specialEffects: true,
    metadataSeo: true,
    pageAlias: true,
    profileWidgets: true,
  })

  const defaultConfig = {
    hero_title: '',
    hero_subtitle: '',
    hero_description: '',
    about_title: '',
    about_description: '',
    background_image_url: '',
    about_bg_image_url: '',
    projects_bg_image_url: '',
    skillset_bg_image_url: '',
    profile_image_url: '',
    github_url: '',
    telegram_url: '',
    discord_url: '',
    linkedin_url: '',
    twitter_url: '',
    instagram_url: '',
    youtube_url: '',
    website_url: '',
    email: '',
    location: '',
    timezone: 'Asia/Kolkata',
    show_date: true,
    show_time: true,
    show_view_count: false,
    show_scroll_arrow: true,
    light_rays_enabled: false,
    light_rays_origin: 'top-center',
    light_rays_color: '#ffffff',
    light_rays_speed: 1,
    light_rays_spread: 1,
    light_rays_length: 2,
    light_rays_follow_mouse: true,
    light_rays_mouse_influence: 0.15,
    scroll_arrow_target: 'about',
    scroll_arrow_color: '#ffffff',
    scroll_arrow_opacity: 0.6,
    active_projects: [],
    active_projects_description: '',
    upcoming_projects: [],
    upcoming_projects_description: '',
    skillsets: [],
    github_token: '',
    wakatime_token: '',
    styles: {
      hero: {
        background_color: '',
        background_gradient: '',
        background_opacity: 1,
        background_blur: 0,
        title_color: '#ffffff',
        title_font: 'font-mono',
        title_size: 'text-7xl',
        subtitle_color: '#ffffff',
        subtitle_font: 'font-mono',
        subtitle_size: 'text-2xl',
        description_color: '#d1d5db',
        description_font: 'font-mono',
        description_size: 'text-lg'
      },
      about: {
        background_color: '',
        background_gradient: '',
        background_opacity: 1,
        background_blur: 0,
        title_color: '#ffffff',
        title_font: 'font-mono',
        title_size: 'text-4xl',
        description_color: '#d1d5db',
        description_font: 'font-mono',
        description_size: 'text-base',
        card_background: 'rgba(255, 255, 255, 0.05)',
        card_border: 'rgba(255, 255, 255, 0.1)',
        card_blur: 10
      },
      projects: {
        background_color: '',
        background_gradient: '',
        background_opacity: 1,
        background_blur: 0,
        title_color: '#ffffff',
        title_font: 'font-mono',
        title_size: 'text-4xl',
        description_color: '#d1d5db',
        description_font: 'font-mono',
        description_size: 'text-base',
        card_background: 'rgba(255, 255, 255, 0.05)',
        card_border: 'rgba(255, 255, 255, 0.1)',
        card_blur: 10,
        card_gradient: '',
        project_title_color: '#ffffff',
        project_title_font: 'font-mono',
        project_description_color: '#d1d5db'
      },
      skillset: {
        background_color: '',
        background_gradient: '',
        background_opacity: 1,
        background_blur: 0,
        title_color: '#ffffff',
        title_font: 'font-mono',
        title_size: 'text-4xl',
        description_color: '#d1d5db',
        description_font: 'font-mono',
        description_size: 'text-base',
        skill_background: 'rgba(255, 255, 255, 0.05)',
        skill_border: 'rgba(255, 255, 255, 0.1)',
        skill_color: '#ffffff'
      },
      global: {
        background_color: '#000000',
        text_color: '#ffffff',
        font_family: 'font-mono'
      }
    },
    layout: {
      hero: { order: 0, width: 100, height: 100, visible: true },
      about: { order: 1, width: 100, height: 100, visible: true },
      projects: { order: 2, width: 100, height: 100, visible: true },
      skillset: { order: 3, width: 100, height: 100, visible: true }
    },
    section_visibility: {
      hero: true,
      about: true,
      projects: true,
      skillset: true,
      footer: true
    },
    section_backgrounds: {
      hero: 'none',
      about: 'dots',
      projects: 'grid',
      skillset: 'dots'
    },
    music_enabled: false,
    music_url: '',
    music_warning: {
      title: 'This page has music enabled',
      message: 'Still want to visit?',
      accept_text: 'Yes, Continue',
      decline_text: 'No, Go Back',
      background_color: '#000000',
      text_color: '#ffffff',
      button_bg_color: '#ff8c00',
      button_text_color: '#ffffff'
    },
    cursor_icon_url: '',
    premium_features: {
      exclusive_badge: false,
      profile_layout: 'default',
      custom_fonts_enabled: false,
      custom_font_family: '',
      custom_font_url: '',
      typewriter_animation: false,
      typewriter_speed: 50,
      typewriter_delay: 100,
      special_effects: {
        particle_effects: false,
        glitch_effect: false,
        neon_glow: false,
        matrix_rain: false,
        floating_shapes: false
      },
      metadata: {
        page_title: '',
        meta_description: '',
        meta_keywords: '',
        og_title: '',
        og_description: '',
        og_image: '',
        twitter_card: 'summary_large_image'
      },
      seo: {
        custom_canonical: '',
        robots: 'index, follow',
        custom_head: ''
      },
      page_alias: '',
      profile_widgets: {
        wakatime_stats: false,
        spotify_widget: false,
        weather_widget: false,
        visitor_counter: false,
        last_updated: false
      },
      github_stats: false,
    }
  }

  const [config, setConfig] = useState(defaultConfig)
  const lastLoadedProfileId = useRef(null)
  const aliasCheckTimeout = useRef(null)

  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile)
      setIsPremium(authProfile.is_premium === true && (!authProfile.premium_expires_at || new Date(authProfile.premium_expires_at) > new Date()))
      setLoadingProfile(false)
    } else {
      setLoadingProfile(false)
    }
  }, [authProfile])

  const loadProfile = useCallback(async () => {
    if (!profile?.id) {
      console.warn('Cannot load profile: profile.id is missing')
      setLoadingProfile(false)
      return
    }

    if (lastLoadedProfileId.current === profile.id) {
      setLoadingProfile(false)
      return
    }

    try {
      setLoadingProfile(true)
      lastLoadedProfileId.current = profile.id
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        if (error.message && error.message.includes('column') && error.message.includes('does not exist')) {
          console.warn('Database columns missing - using fallback query')
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('profiles')
            .select('id, auth0_id, email, username, display_name, config, is_active, view_count, user_id, created_at, updated_at')
            .eq('id', profile.id)
            .single()
          
          if (fallbackError) {
            lastLoadedProfileId.current = null
            if (fallbackError.code !== 'PGRST116' && fallbackError.message) {
              toast.error(`Failed to load profile: ${fallbackError.message}`)
            }
            setLoadingProfile(false)
            return
          }
          data = { ...fallbackData, is_premium: false, premium_expires_at: null, paypal_subscription_id: null }
          error = null
        } else {
          lastLoadedProfileId.current = null
          if (error.code !== 'PGRST116' && error.message) {
            toast.error(`Failed to load profile settings: ${error.message}`)
          }
          setLoadingProfile(false)
          return
        }
      }

      if (!data) {
        console.warn('No profile data returned')
        lastLoadedProfileId.current = null
        setLoadingProfile(false)
        return
      }

      const premiumStatus = data.is_premium === true && (!data.premium_expires_at || new Date(data.premium_expires_at) > new Date())
      
      setProfile(prev => ({
        ...prev,
        ...data,
        is_active: data.is_active !== undefined ? data.is_active !== false : true,
        view_count: data.view_count || 0,
        is_premium: data.is_premium || false,
        premium_expires_at: data.premium_expires_at || null
      }))
      setIsPremium(premiumStatus)
      
      if (data.config && typeof data.config === 'object') {
        setConfig({
          ...defaultConfig,
          ...data.config,
          styles: {
            ...defaultConfig.styles,
            ...(data.config.styles || {}),
            hero: {
              ...defaultConfig.styles.hero,
              ...(data.config.styles?.hero || {})
            },
            about: {
              ...defaultConfig.styles.about,
              ...(data.config.styles?.about || {})
            },
            projects: {
              ...defaultConfig.styles.projects,
              ...(data.config.styles?.projects || {})
            },
            skillset: {
              ...defaultConfig.styles.skillset,
              ...(data.config.styles?.skillset || {})
            },
            global: {
              ...defaultConfig.styles.global,
              ...(data.config.styles?.global || {})
            }
          },
          premium_features: {
            ...defaultConfig.premium_features,
            ...(data.config.premium_features || {}),
            special_effects: (() => {
              const loadedEffects = data.config.premium_features?.special_effects || {}
              const effectKeys = ['particle_effects', 'glitch_effect', 'neon_glow', 'matrix_rain', 'floating_shapes']
              const enabledEffects = effectKeys.filter(key => loadedEffects[key] === true)
              
              const normalized = {
                particle_effects: false,
                glitch_effect: false,
                neon_glow: false,
                matrix_rain: false,
                floating_shapes: false
              }
              
              if (enabledEffects.length > 0) {
                normalized[enabledEffects[0]] = true
              }
              
              return normalized
            })(),
            metadata: {
              ...defaultConfig.premium_features.metadata,
              ...(data.config.premium_features?.metadata || {})
            },
            seo: {
              ...defaultConfig.premium_features.seo,
              ...(data.config.premium_features?.seo || {})
            },
            profile_widgets: {
              ...defaultConfig.premium_features.profile_widgets,
              ...(data.config.premium_features?.profile_widgets || {})
            },
            ide_features: {
              ...defaultConfig.premium_features.ide_features,
              ...(data.config.premium_features?.ide_features || {})
            },
            exclusive_preferences: {
              ...defaultConfig.premium_features.exclusive_preferences,
              ...(data.config.premium_features?.exclusive_preferences || {})
            }
          }
        })
      } else {
        setConfig({
          ...defaultConfig,
          hero_title: data.display_name || '',
          email: data.email || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      

      if (error.message && !error.message.includes('PGRST')) {
        toast.error(`Failed to load profile settings: ${error.message}`)
      }
    } finally {
      setLoadingProfile(false)
    }
  }, [profile?.id, toast])

  const handleSave = useCallback(async (sectionName = null) => {
    if (!profile) {
      toast.error('Profile not loaded')
      return
    }

    const configToSave = { ...config }
    
    if (!isPremium) {
      configToSave.light_rays_enabled = false
      if (configToSave.wakatime_token && configToSave.wakatime_token.trim() !== '') {
        toast.warning('WakaTime integration requires Premium. Token will not be saved.')
      }
      configToSave.wakatime_token = ''
    }

    if (sectionName) {
      setSavingSection(sectionName)
    } else {
      setSaving(true)
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ config: configToSave })
        .eq('id', profile.id)

      if (error) throw error

      setConfig(configToSave)
      toast.success(sectionName ? `${sectionName} saved successfully!` : 'All settings saved successfully!')
    } catch (error) {
      console.error('Error saving:', error)
      toast.error(`Failed to save: ${error.message}`)
    } finally {
      setSaving(false)
      setSavingSection(null)
    }
  }, [config, profile, toast, isPremium])

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      login()
      return
    }

    if (!profile || !profile.id) {
      setLoadingProfile(false)
      return
    }

    if (profile.username && profile.username.startsWith('user_')) {
      navigate('/setup')
      return
    }

    if (lastLoadedProfileId.current !== profile.id) {
      loadProfile()
    } else {
      setLoadingProfile(false)
    }
  }, [isAuthenticated, isLoading, profile?.id, profile?.username, login, navigate, loadProfile])

  useEffect(() => {
    if (!isAuthenticated) return
    
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave, isAuthenticated])

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleImageUpload = async (field, file) => {
    if (!file || !profile) {
      toast.error('Please select a file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, GIF, or WebP)')
      return
    }

    try {
      toast.info('Uploading image...')
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}/${field}_${Date.now()}.${fileExt}`
      const filePath = `profiles/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profile-assets')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('profile-assets')
        .getPublicUrl(filePath)

      setConfig({ ...config, [field]: data.publicUrl })
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(`Failed to upload image: ${error.message}`)
    }
  }

  const handleAudioUpload = async (file) => {
    if (!file || !profile) {
      toast.error('Please select a file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Audio file size must be less than 10MB')
      return
    }

    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid audio file (MP3, WAV, OGG, or WebM)')
      return
    }

    try {
      toast.info('Uploading audio...')
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}/music_${Date.now()}.${fileExt}`
      const filePath = `profiles/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profile-assets')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('profile-assets')
        .getPublicUrl(filePath)

      setConfig({ ...config, music_url: data.publicUrl })
      toast.success('Audio uploaded successfully!')
    } catch (error) {
      console.error('Error uploading audio:', error)
      toast.error(`Failed to upload audio: ${error.message}`)
    }
  }

  const handleCursorUpload = async (file) => {
    if (!file || !profile) {
      toast.error('Please select a file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Cursor file size must be less than 2MB')
      return
    }

    const allowedTypes = ['image/png', 'image/svg+xml', 'image/x-icon', 'image/cur']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid cursor file (PNG, SVG, ICO, or CUR)')
      return
    }

    try {
      toast.info('Uploading cursor...')
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}/cursor_${Date.now()}.${fileExt}`
      const filePath = `profiles/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profile-assets')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('profile-assets')
        .getPublicUrl(filePath)

      setConfig({ ...config, cursor_icon_url: data.publicUrl })
      toast.success('Cursor uploaded successfully!')
    } catch (error) {
      console.error('Error uploading cursor:', error)
      toast.error(`Failed to upload cursor: ${error.message}`)
    }
  }

  const handleImageDelete = async (field, url) => {
    if (!profile || !url) return

    try {
      const urlParts = url.split('/profile-assets/')
      if (urlParts.length < 2) {
        setConfig(prev => ({ ...prev, [field]: '' }))
        toast.success('Image removed successfully!')
        return
      }

      const filePath = urlParts[1].split('?')[0]
      const { error } = await supabase.storage
        .from('profile-assets')
        .remove([filePath])

      if (error) throw error

      setConfig(prev => ({ ...prev, [field]: '' }))
      toast.success('Image deleted successfully!')
    } catch (error) {
      console.error('Error deleting image:', error)
      setConfig(prev => ({ ...prev, [field]: '' }))
      toast.error(`Failed to delete image: ${error.message}`)
    }
  }

  const handleDeleteAllImages = async () => {
    if (!profile) return
    
    if (!confirm('Are you sure you want to delete all uploaded images? This action cannot be undone.')) {
      return
    }

    const imageFields = [
      'background_image_url',
      'about_bg_image_url',
      'projects_bg_image_url',
      'skillset_bg_image_url',
      'profile_image_url'
    ]

    try {
      const urlsToDelete = imageFields
        .map(field => config[field])
        .filter(url => url && (url.includes('/profile-assets/') || url.includes('profile-assets/')))

      if (urlsToDelete.length === 0) {
        toast.info('No images to delete')
        return
      }

      const filePaths = urlsToDelete.map(url => {
        const parts = url.split('/profile-assets/')
        if (parts.length > 1) {
          return `profile-assets/${parts[1].split('?')[0]}`
        }
        const parts2 = url.split('profile-assets/')
        if (parts2.length > 1) {
          return `profile-assets/${parts2[1].split('?')[0]}`
        }
        return null
      }).filter(Boolean)

      if (filePaths.length > 0) {
        const { error } = await supabase.storage
          .from('profile-assets')
          .remove(filePaths)

        if (error) throw error
      }

      setConfig(prev => ({
        ...prev,
        background_image_url: '',
        about_bg_image_url: '',
        projects_bg_image_url: '',
        skillset_bg_image_url: '',
        profile_image_url: ''
      }))

      toast.success('All images deleted successfully!')
    } catch (error) {
      console.error('Error deleting images:', error)
      toast.error(`Failed to delete images: ${error.message}`)
    }
  }

  const handleResetStyling = (section) => {
    if (section) {
      if (!confirm(`Are you sure you want to reset ${section} styling to defaults?`)) {
        return
      }
      setConfig(prev => ({
        ...prev,
        styles: {
          ...prev.styles,
          [section]: { ...defaultConfig.styles[section] }
        }
      }))
      toast.success(`${section} styling reset to defaults!`)
    } else {
      if (!confirm('Are you sure you want to reset all styling to defaults? This action cannot be undone.')) {
        return
      }
      setConfig(prev => ({
        ...prev,
        styles: { ...defaultConfig.styles }
      }))
      toast.success('All styling reset to defaults!')
    }
  }

  const handleResetContent = (section) => {
    if (section === 'hero') {
      if (!confirm('Are you sure you want to reset Hero section content to defaults?')) {
        return
      }
      setConfig(prev => ({
        ...prev,
        hero_title: '',
        hero_subtitle: '',
        hero_description: ''
      }))
      toast.success('Hero section reset to defaults!')
    } else if (section === 'about') {
      if (!confirm('Are you sure you want to reset About section content to defaults?')) {
        return
      }
      setConfig(prev => ({
        ...prev,
        about_title: '',
        about_description: ''
      }))
      toast.success('About section reset to defaults!')
    } else if (section === 'contact') {
      if (!confirm('Are you sure you want to reset Contact & Links to defaults?')) {
        return
      }
      setConfig(prev => ({
        ...prev,
        email: '',
        location: '',
        github_url: '',
        telegram_url: '',
        discord_url: '',
        linkedin_url: '',
        twitter_url: '',
        instagram_url: '',
        youtube_url: '',
        website_url: ''
      }))
      toast.success('Contact & Links reset to defaults!')
    } else if (section === 'projects') {
      if (!confirm('Are you sure you want to reset all projects? This action cannot be undone.')) {
        return
      }
      setConfig(prev => ({
        ...prev,
        active_projects: [],
        active_projects_description: '',
        upcoming_projects: [],
        upcoming_projects_description: ''
      }))
      toast.success('Projects reset to defaults!')
    } else if (section === 'skillsets') {
      if (!confirm('Are you sure you want to reset all skillsets? This action cannot be undone.')) {
        return
      }
      setConfig(prev => ({
        ...prev,
        skillsets: []
      }))
      toast.success('Skillsets reset to defaults!')
    } else if (!section) {
      if (!confirm('Are you sure you want to reset all content to defaults? This action cannot be undone.')) {
        return
      }
      setConfig(prev => ({
        ...prev,
        hero_title: '',
        hero_subtitle: '',
        hero_description: '',
        about_title: '',
        about_description: '',
        email: '',
        location: '',
        github_url: '',
        telegram_url: '',
        discord_url: '',
        linkedin_url: '',
        twitter_url: '',
        instagram_url: '',
        youtube_url: '',
        website_url: '',
        active_projects: [],
        active_projects_description: '',
        upcoming_projects: [],
        upcoming_projects_description: '',
        skillsets: []
      }))
      toast.success('All content reset to defaults!')
    }
  }

  const updateStyle = (section, newStyles) => {
    setConfig({
      ...config,
      styles: {
        ...config.styles,
        [section]: newStyles
      }
    })
  }

  const checkAliasAvailability = useCallback(async (aliasValue) => {
    if (!aliasValue || !aliasValue.trim()) {
      setAliasError('')
      return true
    }

    const reservedRoutes = ['dashboard', 'login', 'callback', 'setup', 'logout', 'api', 'admin', 'auth', 'home', 'about', 'contact', 'privacy', 'terms', 'help', 'support', 'faq', 'blog', 'docs', 'status', 'health', 'templates', 'pricing']
    
    if (reservedRoutes.includes(aliasValue.toLowerCase())) {
      setAliasError('This alias is reserved and cannot be used')
      return false
    }

    setCheckingAlias(true)
    setAliasError('')

    try {
      const { data: usernameData, error: usernameError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', aliasValue.toLowerCase())
        .single()

      if (usernameError && usernameError.code !== 'PGRST116') {
        throw usernameError
      }

      if (usernameData) {
        setAliasError('This alias conflicts with an existing username')
        setCheckingAlias(false)
        return false
      }

      const { data: aliasData, error: aliasError } = await supabase
        .from('profiles')
        .select('id, config')
      
      if (aliasError) {
        throw aliasError
      }

      if (aliasData && aliasData.length > 0) {
        const aliasConflict = aliasData.some(p => {
          if (p.id === profile?.id) return false
          const alias = p.config?.premium_features?.page_alias
          return alias && alias.toLowerCase() === aliasValue.toLowerCase()
        })

        if (aliasConflict) {
          setAliasError('This alias is already taken by another user')
          setCheckingAlias(false)
          return false
        }
      }

      setAliasError('')
      setCheckingAlias(false)
      return true
    } catch (error) {
      console.error('Error checking alias:', error)
      setAliasError('Error checking alias availability')
      setCheckingAlias(false)
      return false
    }
  }, [profile?.id])

  const addProject = (type) => {
    const newProject = {
      id: Date.now(),
      title: '',
      description: '',
      year: new Date().getFullYear().toString(),
      domain: '',
      url: '',
      tech: [],
      role: []
    }

    if (type === 'active') {
      setConfig({
        ...config,
        active_projects: [...config.active_projects, newProject]
      })
    } else {
      setConfig({
        ...config,
        upcoming_projects: [...config.upcoming_projects, newProject]
      })
    }
  }

  const updateProject = (type, index, field, value) => {
    const projects = type === 'active' ? [...config.active_projects] : [...config.upcoming_projects]
    projects[index] = { ...projects[index], [field]: value }
    
    if (type === 'active') {
      setConfig({ ...config, active_projects: projects })
    } else {
      setConfig({ ...config, upcoming_projects: projects })
    }
  }

  const removeProject = (type, index) => {
    if (type === 'active') {
      setConfig({
        ...config,
        active_projects: config.active_projects.filter((_, i) => i !== index)
      })
    } else {
      setConfig({
        ...config,
        upcoming_projects: config.upcoming_projects.filter((_, i) => i !== index)
      })
    }
  }

  const addSkill = () => {
    setConfig({
      ...config,
      skillsets: [...config.skillsets, {
        id: Date.now(),
        name: '',
        category: 'frontend',
        icon: 'Code'
      }]
    })
  }

  const updateSkill = (index, field, value) => {
    const skillsets = [...config.skillsets]
    skillsets[index] = { ...skillsets[index], [field]: value }
    setConfig({ ...config, skillsets })
  }

  const removeSkill = (index) => {
    setConfig({
      ...config,
      skillsets: config.skillsets.filter((_, i) => i !== index)
    })
  }

  const createTemplate = async () => {
    if (!isPremium) {
      toast.error('Template sharing requires Premium. Upgrade to unlock this feature.')
      return
    }
    
    if (!profile || !templateName.trim()) {
      toast.error('Please enter a template name')
      return
    }

    try {
      let shareId
      let isUnique = false
      while (!isUnique) {
        shareId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const { data: existing } = await supabase
          .from('templates')
          .select('id')
          .eq('share_id', shareId)
          .single()
        if (!existing) isUnique = true
      }
      
      const { data, error } = await supabase
        .from('templates')
        .insert({
          user_id: profile.id,
          profile_id: profile.id,
          name: templateName.trim(),
          description: templateDescription.trim() || null,
          config: config,
          share_id: shareId,
          is_public: isPublicTemplate
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Template created successfully!')
      setTemplateName('')
      setTemplateDescription('')
      setIsPublicTemplate(false)
      loadTemplates()
    } catch (error) {
      console.error('Error creating template:', error)
      toast.error(`Failed to create template: ${error.message}`)
    }
  }

  const loadTemplates = async () => {
    if (!profile) return

    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }

  const applyTemplate = async (template) => {
    if (!confirm(`Are you sure you want to apply template "${template.name}"? This will replace your current configuration.`)) {
      return
    }

    try {
      setConfig(template.config)
      toast.success('Template applied successfully!')
    } catch (error) {
      console.error('Error applying template:', error)
      toast.error(`Failed to apply template: ${error.message}`)
    }
  }

  const deleteTemplate = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', templateId)

      if (error) throw error

      toast.success('Template deleted successfully!')
      loadTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error(`Failed to delete template: ${error.message}`)
    }
  }

  const shareTemplate = (template) => {
    const shareUrl = `${window.location.origin}/template/${template.share_id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Template link copied to clipboard!')
  }

  useEffect(() => {
    if (profile) {
      loadTemplates()
    }
  }, [profile])

  useEffect(() => {
    const checkAdmin = async () => {
      if (!profile?.username) {
        setIsAdmin(false)
        return
      }

      const isMasterAdmin = profile.username.toLowerCase() === 'deyo'
      if (isMasterAdmin) {
        setIsAdmin(true)
        return
      }

      try {
        const { data } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', profile.id)
          .eq('is_active', true)
          .single()

        if (data) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        setIsAdmin(false)
      }
    }

    if (isAuthenticated && profile) {
      checkAdmin()
    }
  }, [profile, isAuthenticated])

  

  useEffect(() => {
    if (!profile?.id) return

    const refreshViewCount = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('view_count')
          .eq('id', profile.id)
          .single()

        if (!error && data) {
          setProfile(prev => ({
            ...prev,
            view_count: data.view_count || 0
          }))
        }
      } catch (err) {
        console.error('Failed to refresh view count:', err)
      }
    }

    const interval = setInterval(refreshViewCount, 30000)
    return () => clearInterval(interval)
  }, [profile?.id])

  useEffect(() => {
    if (loadingProfile) {
      const timeout = setTimeout(() => {
        console.warn('Profile loading timeout - forcing stop')
        setLoadingProfile(false)
        lastLoadedProfileId.current = null
      }, 10000)
      return () => clearTimeout(timeout)
    }
  }, [loadingProfile])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-orange-950/20 text-white font-mono flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-orange-500/50 border-t-orange-500 rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white mb-1">Loading dashboard...</p>
            <p className="text-sm text-gray-400">Preparing your workspace</p>
          </div>
        </div>
      </div>
    )
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-orange-950/20 text-white font-mono flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-orange-500/50 border-t-orange-500 rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white mb-1">Loading dashboard...</p>
            <p className="text-sm text-gray-400">Preparing your workspace</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'styling', label: 'Styling', icon: Palette, premium: true },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'layout', label: 'Layout', icon: LayoutDashboard },
    { id: 'audio', label: 'Audio & Cursor', icon: Music },
    { id: 'premium', label: 'Premium Features', icon: Crown, premium: true }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-orange-950/10 text-white font-mono flex relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,140,0,0.03),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none"></div>
      
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        onPreview={() => setShowPreview(true)}
        onViewLive={() => navigate(`/${profile?.username}`)}
        onSave={() => handleSave()}
        saving={saving}
        profile={profile}
        onLogout={logout}
        isPremium={isPremium}
        isAdmin={isAdmin}
      />

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="Dashboard"
      >
        <div className="space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500/20 to-orange-500/10 border border-orange-500/30 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </div>
                {tab.premium && (
                  <Crown className="w-4 h-4 text-yellow-400" />
                )}
              </button>
            )
          })}
        </div>
        <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
          <DashboardButton
            onClick={() => {
              setShowPreview(true)
              setMobileMenuOpen(false)
            }}
            variant="secondary"
            icon={Eye}
            className="w-full"
          >
            Preview
          </DashboardButton>
          <DashboardButton
            onClick={() => {
              navigate(`/${profile?.username}`)
              setMobileMenuOpen(false)
            }}
            variant="secondary"
            icon={ExternalLink}
            className="w-full"
          >
            View Live
          </DashboardButton>
          <DashboardButton
            onClick={() => {
              handleSave()
              setMobileMenuOpen(false)
            }}
            loading={saving}
            variant="primary"
            icon={Save}
            className="w-full"
          >
            {saving ? 'Saving...' : 'Save All'}
          </DashboardButton>
          <button
            onClick={() => {
              setMobileMenuOpen(false)
              setTimeout(() => {
                logout()
              }, 100)
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </MobileMenu>

      <div className="flex-1 flex flex-col min-w-0 relative z-10 lg:ml-64">
        <DashboardHeader
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMenuOpen={mobileMenuOpen}
          activeTab={activeTab}
          tabs={tabs}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto p-3 sm:p-4 lg:p-6 max-w-7xl w-full">
            {activeTab === 'content' && (
              <>
                <DashboardStats profile={profile} config={config} />
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile?.is_active !== false}
                        onChange={async (e) => {
                          try {
                            const { error } = await supabase
                              .from('profiles')
                              .update({ is_active: e.target.checked })
                              .eq('id', profile.id)
                            
                            if (error) {
                              if (error.message.includes('is_active') || error.message.includes('schema cache')) {
                                toast.error('Please run the database migration first. Check supabase-migration-fix.sql')
                                return
                              }
                              throw error
                            }
                            
                            toast.success(`Page ${e.target.checked ? 'activated' : 'deactivated'} successfully!`)
                            window.location.reload()
                          } catch (error) {
                            toast.error(`Failed to update: ${error.message}`)
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600"></div>
                      <span className="text-sm font-medium text-gray-300">
                        {profile?.is_active !== false ? 'Page Active' : 'Page Inactive'}
                      </span>
                    </label>
                  </div>
                  <DashboardButton
                    onClick={() => {
                      const userName = prompt(`To confirm, please type your username: ${profile?.username || ''}`)
                      if (userName === profile?.username) {
                        handleResetContent()
                      } else if (userName !== null) {
                        toast.error('Username does not match. Reset cancelled.')
                      }
                    }}
                    variant="secondary"
                    icon={RotateCcw}
                  >
                    Reset All Content
                  </DashboardButton>
                </div>
                <div className="space-y-6">
                  <DashboardCard
                    title="Hero Section"
                  icon={FileText}
                  action={
                    <div className="flex flex-wrap items-center gap-2">
                      <DashboardButton
                        onClick={() => handleResetContent('hero')}
                        variant="secondary"
                        size="sm"
                        icon={RotateCcw}
                      >
                        Reset
                      </DashboardButton>
                      <DashboardButton
                        onClick={() => handleSave('Hero Section')}
                        loading={savingSection === 'Hero Section'}
                        variant="primary"
                        size="sm"
                        icon={Save}
                      >
                        Save
                      </DashboardButton>
                    </div>
                  }
                >
                  <div className="space-y-5">
                    <DashboardInput
                      label="Title"
                      value={config.hero_title}
                      onChange={(e) => setConfig({ ...config, hero_title: e.target.value })}
                      placeholder="Your Name"
                    />
                    <DashboardInput
                      label="Subtitle"
                      value={config.hero_subtitle}
                      onChange={(e) => setConfig({ ...config, hero_subtitle: e.target.value })}
                      placeholder="Your Role or Tagline"
                    />
                    <DashboardTextarea
                      label="Description"
                      value={config.hero_description}
                      onChange={(e) => setConfig({ ...config, hero_description: e.target.value })}
                      rows="4"
                      placeholder="A brief description about yourself..."
                    />
                  </div>
                  </DashboardCard>

                  <DashboardCard
                    title="About Section"
                    icon={FileText}
                    action={
                      <div className="flex flex-wrap items-center gap-2">
                        <DashboardButton
                          onClick={() => handleResetContent('about')}
                          variant="secondary"
                          size="sm"
                          icon={RotateCcw}
                        >
                          Reset
                        </DashboardButton>
                        <DashboardButton
                          onClick={() => handleSave('About Section')}
                          loading={savingSection === 'About Section'}
                          variant="primary"
                          size="sm"
                          icon={Save}
                        >
                          Save
                        </DashboardButton>
                      </div>
                    }
                  >
                    <div className="space-y-5">
                      <DashboardInput
                        label="Title"
                        value={config.about_title}
                        onChange={(e) => setConfig({ ...config, about_title: e.target.value })}
                        placeholder="Briefly about me."
                      />
                      <DashboardTextarea
                        label="Description"
                        value={config.about_description}
                        onChange={(e) => setConfig({ ...config, about_description: e.target.value })}
                        rows="6"
                        placeholder="Tell visitors about yourself..."
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ImageUpload
                          label="Profile Image"
                          value={config.profile_image_url}
                          field="profile_image_url"
                          onUpload={handleImageUpload}
                          onDelete={handleImageDelete}
                          onChange={(file, error) => {
                            if (error) {
                              toast.error(error)
                            }
                          }}
                        />
                        <ImageUpload
                          label="About Background"
                          value={config.about_bg_image_url}
                          field="about_bg_image_url"
                          onUpload={handleImageUpload}
                          onDelete={handleImageDelete}
                          onChange={(file, error) => {
                            if (error) {
                              toast.error(error)
                            }
                          }}
                        />
                      </div>
                    </div>
                  </DashboardCard>

                  <DashboardCard
                    title="API Keys & Tokens"
                    icon={Settings}
                    action={
                      <DashboardButton
                        onClick={() => handleSave('API Keys')}
                        loading={savingSection === 'API Keys'}
                        variant="primary"
                        size="sm"
                        icon={Save}
                      >
                        Save
                      </DashboardButton>
                    }
                  >
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">GitHub Token</label>
                        <div className="relative">
                          <input
                            type={showApiKeys.github ? "text" : "password"}
                            value={config.github_token || ''}
                            onChange={(e) => setConfig({ ...config, github_token: e.target.value })}
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                            className="w-full px-4 py-2.5 pr-10 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 hover:border-white/20 break-all overflow-hidden text-ellipsis"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKeys({ ...showApiKeys, github: !showApiKeys.github })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showApiKeys.github ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Create a Personal Access Token with read:user scope</p>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                        <div>
                          <p className="font-medium text-white mb-1">GitHub Statistics</p>
                          <p className="text-sm text-gray-400">Show your GitHub contribution graph and stats</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.github_stats === true}
                            onChange={(e) => setConfig({ ...config, github_stats: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600"></div>
                        </label>
                      </div>
                      <div className={`relative ${!isPremium ? 'opacity-60' : ''}`}>
                        {!isPremium && (
                          <PremiumBadge feature="WakaTime Integration" className="w-full h-full" compact />
                        )}
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${!isPremium ? 'text-gray-500' : 'text-gray-300'}`}>
                          WakaTime API Key
                          <Crown className="w-4 h-4 text-yellow-400" />
                        </label>
                        <div className="relative">
                          <input
                            type={showApiKeys.wakatime ? "text" : "password"}
                            value={isPremium ? (config.wakatime_token || '') : ''}
                            onChange={(e) => {
                              if (isPremium) {
                                setConfig({ ...config, wakatime_token: e.target.value })
                              }
                            }}
                            disabled={!isPremium}
                            placeholder={isPremium ? "waka_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" : "Premium feature"}
                            className="w-full px-4 py-2.5 pr-10 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 hover:border-white/20 break-all overflow-hidden text-ellipsis disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (isPremium) {
                                setShowApiKeys({ ...showApiKeys, wakatime: !showApiKeys.wakatime })
                              }
                            }}
                            disabled={!isPremium}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {showApiKeys.wakatime ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Get your API key from wakatime.com/settings/api-key</p>
                      </div>
                    </div>
                  </DashboardCard>

                  <DashboardCard
                    title="Links & Contact"
                  icon={Link2}
                    action={
                      <div className="flex items-center gap-2">
                        <DashboardButton
                          onClick={() => handleResetContent('contact')}
                          variant="secondary"
                          size="sm"
                          icon={RotateCcw}
                        >
                          Reset
                        </DashboardButton>
                        <DashboardButton
                          onClick={() => handleSave('Contact Section')}
                          loading={savingSection === 'Contact Section'}
                          variant="primary"
                          size="sm"
                          icon={Save}
                        >
                          Save
                        </DashboardButton>
                      </div>
                    }
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DashboardInput
                          type="email"
                          label="Email"
                          value={config.email}
                          onChange={(e) => setConfig({ ...config, email: e.target.value })}
                          placeholder="your@email.com"
                        />
                        <DashboardInput
                          type="text"
                          label="Location"
                          value={config.location}
                          onChange={(e) => setConfig({ ...config, location: e.target.value })}
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DashboardInput
                          type="url"
                          label="GitHub URL"
                          value={config.github_url}
                          onChange={(e) => setConfig({ ...config, github_url: e.target.value })}
                          placeholder="https://github.com/username"
                        />
                        <DashboardInput
                          type="url"
                          label="Telegram URL"
                          value={config.telegram_url}
                          onChange={(e) => setConfig({ ...config, telegram_url: e.target.value })}
                          placeholder="https://t.me/username"
                        />
                        <DashboardInput
                          type="url"
                          label="Discord URL"
                          value={config.discord_url}
                          onChange={(e) => setConfig({ ...config, discord_url: e.target.value })}
                          placeholder="https://discord.gg/username"
                        />
                        <DashboardInput
                          type="url"
                          label="LinkedIn URL"
                          value={config.linkedin_url}
                          onChange={(e) => setConfig({ ...config, linkedin_url: e.target.value })}
                          placeholder="https://linkedin.com/in/username"
                        />
                        <DashboardInput
                          type="url"
                          label="Twitter/X URL"
                          value={config.twitter_url}
                          onChange={(e) => setConfig({ ...config, twitter_url: e.target.value })}
                          placeholder="https://twitter.com/username"
                        />
                        <DashboardInput
                          type="url"
                          label="Instagram URL"
                          value={config.instagram_url}
                          onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
                          placeholder="https://instagram.com/username"
                        />
                        <DashboardInput
                          type="url"
                          label="YouTube URL"
                          value={config.youtube_url}
                          onChange={(e) => setConfig({ ...config, youtube_url: e.target.value })}
                          placeholder="https://youtube.com/@username"
                        />
                        <DashboardInput
                          type="url"
                          label="Website URL"
                          value={config.website_url}
                          onChange={(e) => setConfig({ ...config, website_url: e.target.value })}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </DashboardCard>

                  <DashboardCard
                    title="Projects"
                    description="Manage your active and upcoming projects"
                    icon={Settings}
                  >
                    <div className="mb-4 pb-4 border-b border-white/10">
                      <div className="flex flex-wrap items-center gap-2">
                        <DashboardButton
                          onClick={() => addProject('active')}
                          variant="secondary"
                          size="sm"
                          icon={Plus}
                        >
                          Add Active
                        </DashboardButton>
                        <DashboardButton
                          onClick={() => addProject('upcoming')}
                          variant="secondary"
                          size="sm"
                          icon={Plus}
                        >
                          Add Upcoming
                        </DashboardButton>
                        <DashboardButton
                          onClick={() => handleResetContent('projects')}
                          variant="secondary"
                          size="sm"
                          icon={RotateCcw}
                        >
                          Reset
                        </DashboardButton>
                        <DashboardButton
                          onClick={() => handleSave('Projects')}
                          loading={savingSection === 'Projects'}
                          variant="primary"
                          size="sm"
                          icon={Save}
                        >
                          Save
                        </DashboardButton>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Active Projects</h3>
                        <div className="ml-8 mb-4">
                          <DashboardTextarea
                            label=""
                            value={config.active_projects_description || ''}
                            onChange={(e) => setConfig({ ...config, active_projects_description: e.target.value })}
                            placeholder="Describe your active projects section..."
                            rows="2"
                            containerClassName="mb-0"
                          />
                        </div>
                        <div className="space-y-4">
                          {config.active_projects.length > 0 ? (
                            config.active_projects.map((project, index) => (
                              <div key={project.id} className="group relative p-4 sm:p-5 border border-white/10 rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/20 transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-orange-500/50 group-hover:bg-orange-500 transition-colors flex-shrink-0"></div>
                                    <h3 className="font-bold text-white text-sm sm:text-base">Project {index + 1}</h3>
                                  </div>
                                  <button
                                    onClick={() => removeProject('active', index)}
                                    className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20 w-full sm:w-auto"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Remove</span>
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <DashboardInput
                                    label="Title *"
                                    value={project.title}
                                    onChange={(e) => updateProject('active', index, 'title', e.target.value)}
                                    placeholder="Project Name"
                                  />
                                  <DashboardInput
                                    label="Year"
                                    value={project.year}
                                    onChange={(e) => updateProject('active', index, 'year', e.target.value)}
                                    placeholder="2024"
                                  />
                                  <DashboardInput
                                    label="Domain"
                                    value={project.domain}
                                    onChange={(e) => updateProject('active', index, 'domain', e.target.value)}
                                    placeholder="example.com"
                                  />
                                  <DashboardInput
                                    type="url"
                                    label="URL"
                                    value={project.url}
                                    onChange={(e) => updateProject('active', index, 'url', e.target.value)}
                                    placeholder="https://..."
                                  />
                                  <div className="sm:col-span-2">
                                    <DashboardTextarea
                                      label="Description"
                                      value={project.description}
                                      onChange={(e) => updateProject('active', index, 'description', e.target.value)}
                                      rows="3"
                                      placeholder="Describe your project..."
                                    />
                                  </div>
                                  <div className="sm:col-span-2">
                                    <DashboardInput
                                      label="Tech Stack (comma separated)"
                                      value={project.tech?.join(', ') || ''}
                                      onChange={(e) => updateProject('active', index, 'tech', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                      placeholder="TypeScript, React, Node.js"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 border border-white/10 rounded-xl bg-white/5">
                              <p className="text-gray-400 text-sm">No active projects added yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Upcoming Projects</h3>
                        <div className="ml-8 mb-4">
                          <DashboardTextarea
                            label=""
                            value={config.upcoming_projects_description || ''}
                            onChange={(e) => setConfig({ ...config, upcoming_projects_description: e.target.value })}
                            placeholder="Describe your upcoming projects section..."
                            rows="2"
                            containerClassName="mb-0"
                          />
                        </div>
                        <div className="space-y-4">
                          {config.upcoming_projects.map((project, index) => (
                            <div key={project.id} className="group relative p-4 sm:p-5 border border-white/10 rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/20 transition-all">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors flex-shrink-0"></div>
                                  <h3 className="font-bold text-white text-sm sm:text-base">Upcoming {index + 1}</h3>
                                </div>
                                <button
                                  onClick={() => removeProject('upcoming', index)}
                                  className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20 w-full sm:w-auto"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Remove</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                  <DashboardInput
                                    label="Title *"
                                    value={project.title}
                                    onChange={(e) => updateProject('upcoming', index, 'title', e.target.value)}
                                    placeholder="Upcoming Project Name"
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <DashboardTextarea
                                    label="Description"
                                    value={project.description}
                                    onChange={(e) => updateProject('upcoming', index, 'description', e.target.value)}
                                    rows="3"
                                    placeholder="Describe your upcoming project..."
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <DashboardInput
                                    label="Tech Stack (comma separated)"
                                    value={project.tech?.join(', ') || ''}
                                    onChange={(e) => updateProject('upcoming', index, 'tech', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                    placeholder="TypeScript, React, Node.js"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          {config.upcoming_projects.length === 0 && (
                            <div className="text-center py-8 border border-white/10 rounded-xl bg-white/5">
                              <p className="text-gray-400 text-sm">No upcoming projects added yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </DashboardCard>

                  <DashboardCard
                    title="Skillsets"
                    description="Add and manage your technical skills"
                    icon={Settings}
                    action={
                      <div className="flex flex-wrap items-center gap-2">
                        <DashboardButton
                          onClick={addSkill}
                          variant="secondary"
                          size="sm"
                          icon={Plus}
                        >
                          Add Skill
                        </DashboardButton>
                        <DashboardButton
                          onClick={() => handleResetContent('skillsets')}
                          variant="secondary"
                          size="sm"
                          icon={RotateCcw}
                        >
                          Reset
                        </DashboardButton>
                        <DashboardButton
                          onClick={() => handleSave('Skillsets')}
                          loading={savingSection === 'Skillsets'}
                          variant="primary"
                          size="sm"
                          icon={Save}
                        >
                          Save
                        </DashboardButton>
                      </div>
                    }
                  >
                    <div className="space-y-4">
                      {config.skillsets.map((skill, index) => (
                        <div key={skill.id} className="group relative p-4 sm:p-5 border border-white/10 rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/20 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-purple-500/50 group-hover:bg-purple-500 transition-colors flex-shrink-0"></div>
                              <h3 className="font-bold text-white text-sm sm:text-base">Skill {index + 1}</h3>
                            </div>
                            <button
                              onClick={() => removeSkill(index)}
                              className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20 w-full sm:w-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Remove</span>
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DashboardInput
                              label="Name *"
                              value={skill.name}
                              onChange={(e) => updateSkill(index, 'name', e.target.value)}
                              placeholder="e.g., TypeScript, React, Vue"
                            />
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
                              <select
                                value={skill.category}
                                onChange={(e) => updateSkill(index, 'category', e.target.value)}
                                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors hover:border-white/20"
                              >
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="environment">Environment</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                      {config.skillsets.length === 0 && (
                        <div className="text-center py-8 border border-white/10 rounded-xl bg-white/5">
                          <p className="text-gray-400 text-sm">No skills added yet</p>
                        </div>
                      )}
                    </div>
                  </DashboardCard>

                  <DashboardCard
                    title="Section Backgrounds"
                    icon={ImageIcon}
                    action={
                      <DashboardButton
                        onClick={() => handleSave('Section Backgrounds')}
                        loading={savingSection === 'Section Backgrounds'}
                        variant="primary"
                        size="sm"
                        icon={Save}
                      >
                        Save
                      </DashboardButton>
                    }
                  >
                    <div className="space-y-6">
                      {['about', 'projects', 'skillset'].map((section) => {
                        const patterns = [
                          { value: 'none', label: 'None', preview: 'bg-black', premium: false },
                          { value: 'dots', label: 'Dots', preview: 'pattern-dots', premium: false },
                          { value: 'grid', label: 'Grid', preview: 'pattern-grid', premium: false },
                          { value: 'diagonal', label: 'Diagonal', preview: 'pattern-diagonal', premium: true },
                          { value: 'waves', label: 'Waves', preview: 'pattern-waves', premium: true },
                          { value: 'hexagon', label: 'Hexagon', preview: 'pattern-hexagon', premium: true },
                          { value: 'circular', label: 'Circular', preview: 'pattern-circular', premium: true },
                          { value: 'crosshatch', label: 'Crosshatch', preview: 'pattern-crosshatch', premium: true },
                          { value: 'stars', label: 'Stars', preview: 'pattern-stars', premium: true },
                          { value: 'mesh', label: 'Mesh', preview: 'pattern-mesh', premium: true }
                        ]
                        const currentPattern = config.section_backgrounds?.[section] || (section === 'projects' ? 'grid' : 'dots')
                        
                        return (
                          <div key={section} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-white capitalize text-sm">{section} Section</p>
                              <span className="text-xs text-gray-400">{patterns.find(p => p.value === currentPattern)?.label}</span>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              {patterns.map((pattern) => {
                                const isPremiumPattern = pattern.premium && !isPremium
                                return (
                                <button
                                  key={pattern.value}
                                  onClick={() => {
                                    if (!isPremiumPattern) {
                                      setConfig({
                                        ...config,
                                        section_backgrounds: {
                                          ...config.section_backgrounds,
                                          [section]: pattern.value
                                        }
                                      })
                                    }
                                  }}
                                  disabled={isPremiumPattern}
                                  className={`relative h-16 rounded-lg border-2 transition-all overflow-hidden ${
                                    currentPattern === pattern.value
                                      ? 'border-orange-500 ring-2 ring-orange-500/50 bg-orange-500/20'
                                      : 'border-white/10 hover:border-white/30'
                                  } ${isPremiumPattern ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                  title={pattern.label}
                                >
                                  {pattern.value === 'none' ? (
                                    <div className="absolute inset-0 rounded-lg bg-black" />
                                  ) : (
                                    <div className={`absolute inset-0 rounded-lg bg-black ${pattern.preview}`} style={{
                                      backgroundSize: pattern.value === 'dots' ? '8px 8px' : 
                                                     pattern.value === 'grid' ? '12px 12px' :
                                                     pattern.value === 'diagonal' ? '8px 8px' :
                                                     pattern.value === 'waves' ? '16px 16px' :
                                                     pattern.value === 'hexagon' ? '20px 20px' :
                                                     pattern.value === 'circular' ? '24px 24px' :
                                                     pattern.value === 'crosshatch' ? '12px 12px' :
                                                     pattern.value === 'stars' ? '32px 32px' :
                                                     pattern.value === 'mesh' ? '20px 20px' : 'auto'
                                    }} />
                                  )}
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg z-10 pointer-events-none">
                                    <span className="text-xs font-medium text-white drop-shadow-lg">{pattern.label}</span>
                                  </div>
                                  {isPremiumPattern && (
                                    <div className="absolute top-1 left-1 z-20">
                                      <Crown className="w-4 h-4 text-yellow-400 drop-shadow-lg" />
                                    </div>
                                  )}
                                </button>
                              )})}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </DashboardCard>

                  <DashboardCard
                    title="Page Display Settings"
                    description="Control what's displayed on your page"
                    icon={Settings}
                    action={
                      <DashboardButton
                        onClick={() => handleSave('Page Display Settings')}
                        loading={savingSection === 'Page Display Settings'}
                        variant="primary"
                        size="sm"
                        icon={Save}
                      >
                        Save
                      </DashboardButton>
                    }
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white mb-1">Show View Count</p>
                          <p className="text-sm text-gray-400">Display view count in the header</p>
                        </div>
                        <label className="relative inline-flex items-center flex-shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.show_view_count === true}
                            onChange={(e) => setConfig({ ...config, show_view_count: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600"></div>
                        </label>
                      </div>

                      <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-white/10 bg-white/5 relative">
                        {!isPremium && (
                          <PremiumBadge feature="Light Rays Effect" className="w-full h-full" compact />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white mb-1">Light Rays Effect</p>
                          <p className="text-sm text-gray-400">Add animated light rays background effect</p>
                        </div>
                        <label className={`relative inline-flex items-center flex-shrink-0 ${!isPremium ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
                          <input
                            type="checkbox"
                            checked={isPremium && config.light_rays_enabled === true}
                            onChange={(e) => {
                              if (isPremium) {
                                setConfig({ ...config, light_rays_enabled: e.target.checked })
                              }
                            }}
                            disabled={!isPremium}
                            className="sr-only peer"
                          />
                          <div className={`relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${!isPremium ? 'opacity-50' : 'peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600'}`}></div>
                        </label>
                      </div>

                      <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white mb-1">Show Date</p>
                          <p className="text-sm text-gray-400">Display current date in header</p>
                        </div>
                        <label className="relative inline-flex items-center flex-shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.show_date !== false}
                            onChange={(e) => setConfig({ ...config, show_date: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600"></div>
                        </label>
                      </div>

                      <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white mb-1">Show Time</p>
                          <p className="text-sm text-gray-400">Display current time in header</p>
                        </div>
                        <label className="relative inline-flex items-center flex-shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.show_time !== false}
                            onChange={(e) => setConfig({ ...config, show_time: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600"></div>
                        </label>
                      </div>
                    </div>
                  </DashboardCard>

                  <DashboardCard
                    title="Templates"
                    description="Create and manage your page templates"
                    icon={Share2}
                    action={
                      <DashboardButton
                        onClick={() => navigate('/templates')}
                        variant="secondary"
                        size="sm"
                        icon={Search}
                      >
                        Browse
                      </DashboardButton>
                    }
                  >
                    {!isPremium && (
                      <div className="mb-4 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                        <div className="flex items-center gap-2 mb-1">
                          <Crown className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs font-semibold text-yellow-300">Premium Feature</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">Template sharing requires Premium</p>
                        <Link
                          to="/pricing"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-xs transition-all"
                        >
                          <Crown className="w-3 h-3" />
                          Upgrade
                        </Link>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className={`p-4 border border-white/10 rounded-lg bg-white/5 relative ${!isPremium ? 'opacity-60' : ''}`}>
                        {!isPremium && (
                          <PremiumBadge feature="Template Sharing" className="w-full h-full" compact />
                        )}
                        <h4 className="text-sm font-semibold mb-3 text-white">Create Template</h4>
                        <div className="space-y-3">
                          <DashboardInput
                            label="Template Name *"
                            disabled={!isPremium}
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="My Awesome Template"
                          />
                          <DashboardTextarea
                            label="Description"
                            value={templateDescription}
                            onChange={(e) => setTemplateDescription(e.target.value)}
                            rows="2"
                            placeholder="Describe your template..."
                            disabled={!isPremium}
                          />
                          <label className={`flex items-center gap-2 ${!isPremium ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                            <input
                              type="checkbox"
                              checked={isPublicTemplate}
                              onChange={(e) => {
                                if (isPremium) {
                                  setIsPublicTemplate(e.target.checked)
                                }
                              }}
                              disabled={!isPremium}
                              className="w-4 h-4 rounded border-white/20 bg-black/40 text-orange-500 focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50"
                            />
                            <span className="text-sm text-gray-300">Make public (visible to others)</span>
                          </label>
                          <DashboardButton
                            onClick={createTemplate}
                            variant="primary"
                            size="sm"
                            icon={Plus}
                            className="w-full"
                            disabled={!isPremium}
                          >
                            Create Template
                          </DashboardButton>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-3 text-white">My Templates</h4>
                        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                          {templates.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">No templates created yet</p>
                          ) : (
                            templates.map((template) => (
                              <div key={template.id} className="p-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-white text-sm truncate">{template.name}</h5>
                                    {template.description && (
                                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{template.description}</p>
                                    )}
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                      <span>{template.is_public ? 'Public' : 'Private'}</span>
                                      <span>•</span>
                                      <span>{new Date(template.created_at).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                  <DashboardButton
                                    onClick={() => applyTemplate(template)}
                                    variant="secondary"
                                    size="sm"
                                    icon={Download}
                                    className="flex-1"
                                  >
                                    Apply
                                  </DashboardButton>
                                  <DashboardButton
                                    onClick={() => shareTemplate(template)}
                                    variant="secondary"
                                    size="sm"
                                    icon={Share2}
                                  >
                                    Share
                                  </DashboardButton>
                                  <button
                                    onClick={() => deleteTemplate(template.id)}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </DashboardCard>
                </div>
              </>
            )}

            {activeTab === 'styling' && (
              <div className="space-y-6">
                {!isPremium && (
                  <div className="mb-4 p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-300">Premium Feature</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Advanced styling options require Premium subscription</p>
                    <Link
                      to="/pricing"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-sm transition-all"
                    >
                      <Crown className="w-4 h-4" />
                      Upgrade to Premium
                    </Link>
                  </div>
                )}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile?.is_active !== false}
                        onChange={async (e) => {
                          try {
                            const { error } = await supabase
                              .from('profiles')
                              .update({ is_active: e.target.checked })
                              .eq('id', profile.id)
                            
                            if (error) {
                              if (error.message.includes('is_active') || error.message.includes('schema cache')) {
                                toast.error('Please run the database migration first. Check supabase-migration-fix.sql')
                                return
                              }
                              throw error
                            }
                            
                            toast.success(`Page ${e.target.checked ? 'activated' : 'deactivated'} successfully!`)
                            window.location.reload()
                          } catch (error) {
                            toast.error(`Failed to update: ${error.message}`)
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600"></div>
                      <span className="text-sm font-medium text-gray-300">
                        {profile?.is_active !== false ? 'Page Active' : 'Page Inactive'}
                      </span>
                    </label>
                  </div>
                  <DashboardButton
                    onClick={() => {
                      if (isPremium) {
                        const userName = prompt(`To confirm, please type your username: ${profile?.username || ''}`)
                        if (userName === profile?.username) {
                          handleResetStyling()
                        } else if (userName !== null) {
                          toast.error('Username does not match. Reset cancelled.')
                        }
                      }
                    }}
                    variant="secondary"
                    icon={RotateCcw}
                    disabled={!isPremium}
                  >
                    Reset All Styling
                  </DashboardButton>
                </div>
                <section className={`rounded-lg border border-white/10 bg-white/5 p-6 relative ${!isPremium ? 'opacity-60' : ''}`}>
                  {!isPremium && (
                    <PremiumBadge feature="Global Styles" className="w-full h-full" compact />
                  )}
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Palette className="w-6 h-6" />
                    Global Styles
                  </h2>
                  <StyleSection
                    section="global"
                    styles={config.styles?.global || defaultConfig.styles.global}
                    onUpdate={(newStyles) => updateStyle('global', newStyles)}
                    title="Global"
                    disabled={!isPremium}
                  />
                  <div className="pt-4 border-t border-white/10 mt-6 flex items-center gap-2">
                    <DashboardButton
                      onClick={() => {
                        if (isPremium) handleResetStyling('global')
                      }}
                      variant="secondary"
                      icon={RotateCcw}
                      disabled={!isPremium}
                    >
                      Reset
                    </DashboardButton>
                    <button
                      onClick={() => {
                        if (isPremium) handleSave('Global Styles')
                      }}
                      disabled={!isPremium || savingSection === 'Global Styles'}
                      className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      {savingSection === 'Global Styles' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Global Styles</span>
                        </>
                      )}
                    </button>
                  </div>
                </section>


                <section className={`rounded-lg border border-white/10 bg-white/5 p-6 relative ${!isPremium ? 'opacity-60' : ''}`}>
                  {!isPremium && (
                    <PremiumBadge feature="Hero Styles" className="w-full h-full" compact />
                  )}
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    Hero Section Styles
                  </h2>
                  <StyleSection
                    section="hero"
                    styles={config.styles?.hero || defaultConfig.styles.hero}
                    onUpdate={(newStyles) => updateStyle('hero', newStyles)}
                    title="Hero"
                    disabled={!isPremium}
                  />
                  <div className="pt-4 border-t border-white/10 mt-6 flex items-center gap-2">
                    <DashboardButton
                      onClick={() => {
                        if (isPremium) handleResetStyling('hero')
                      }}
                      variant="secondary"
                      icon={RotateCcw}
                      disabled={!isPremium}
                    >
                      Reset
                    </DashboardButton>
                    <button
                      onClick={() => {
                        if (isPremium) handleSave('Hero Styles')
                      }}
                      disabled={!isPremium || savingSection === 'Hero Styles'}
                      className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      {savingSection === 'Hero Styles' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Hero Styles</span>
                        </>
                      )}
                    </button>
                  </div>
                </section>

                <section className={`rounded-lg border border-white/10 bg-white/5 p-6 relative ${!isPremium ? 'opacity-60' : ''}`}>
                  {!isPremium && (
                    <PremiumBadge feature="About Styles" className="w-full h-full" compact />
                  )}
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    About Section Styles
                  </h2>
                  <StyleSection
                    section="about"
                    styles={config.styles?.about || defaultConfig.styles.about}
                    onUpdate={(newStyles) => updateStyle('about', newStyles)}
                    title="About"
                    disabled={!isPremium}
                  />
                  <div className="pt-4 border-t border-white/10 mt-6 flex items-center gap-2">
                    <DashboardButton
                      onClick={() => {
                        if (isPremium) handleResetStyling('about')
                      }}
                      variant="secondary"
                      icon={RotateCcw}
                      disabled={!isPremium}
                    >
                      Reset
                    </DashboardButton>
                    <button
                      onClick={() => {
                        if (isPremium) handleSave('About Styles')
                      }}
                      disabled={!isPremium || savingSection === 'About Styles'}
                      className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      {savingSection === 'About Styles' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save About Styles</span>
                        </>
                      )}
                    </button>
                  </div>
                </section>

                <section className={`rounded-lg border border-white/10 bg-white/5 p-6 relative ${!isPremium ? 'opacity-60' : ''}`}>
                  {!isPremium && (
                    <PremiumBadge feature="Projects Styles" className="w-full h-full" compact />
                  )}
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Settings className="w-6 h-6" />
                    Projects Section Styles
                  </h2>
                  <StyleSection
                    section="projects"
                    styles={config.styles?.projects || defaultConfig.styles.projects}
                    onUpdate={(newStyles) => updateStyle('projects', newStyles)}
                    title="Projects"
                    disabled={!isPremium}
                  />
                  <div className="pt-4 border-t border-white/10 mt-6 flex items-center gap-2">
                    <DashboardButton
                      onClick={() => {
                        if (isPremium) handleResetStyling('projects')
                      }}
                      variant="secondary"
                      icon={RotateCcw}
                      disabled={!isPremium}
                    >
                      Reset
                    </DashboardButton>
                    <button
                      onClick={() => {
                        if (isPremium) handleSave('Projects Styles')
                      }}
                      disabled={!isPremium || savingSection === 'Projects Styles'}
                      className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      {savingSection === 'Projects Styles' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Projects Styles</span>
                        </>
                      )}
                    </button>
                  </div>
                </section>

                <section className={`rounded-lg border border-white/10 bg-white/5 p-6 relative ${!isPremium ? 'opacity-60' : ''}`}>
                  {!isPremium && (
                    <PremiumBadge feature="Skillset Styles" className="w-full h-full" compact />
                  )}
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Settings className="w-6 h-6" />
                    Skillset Section Styles
                  </h2>
                  <StyleSection
                    section="skillset"
                    styles={config.styles?.skillset || defaultConfig.styles.skillset}
                    onUpdate={(newStyles) => updateStyle('skillset', newStyles)}
                    title="Skillset"
                    disabled={!isPremium}
                  />
                  <div className="pt-4 border-t border-white/10 mt-6 flex items-center gap-2">
                    <DashboardButton
                      onClick={() => {
                        if (isPremium) handleResetStyling('skillset')
                      }}
                      variant="secondary"
                      icon={RotateCcw}
                      disabled={!isPremium}
                    >
                      Reset
                    </DashboardButton>
                    <button
                      onClick={() => {
                        if (isPremium) handleSave('Skillset Styles')
                      }}
                      disabled={!isPremium || savingSection === 'Skillset Styles'}
                      className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      {savingSection === 'Skillset Styles' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Skillset Styles</span>
                        </>
                      )}
                    </button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-6">
                <section className="rounded-lg border border-white/10 bg-white/5 p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <ImageIcon className="w-6 h-6" />
                    Image Uploads
                  </h2>
                  <div className="space-y-6">
                    <ImageUpload
                      label="Hero Background Image"
                      value={config.background_image_url}
                      field="background_image_url"
                      onUpload={handleImageUpload}
                      onDelete={handleImageDelete}
                      onChange={(file, error) => {
                        if (error) toast.error(error)
                      }}
                    />
                    <ImageUpload
                      label="Profile Image"
                      value={config.profile_image_url}
                      field="profile_image_url"
                      onUpload={handleImageUpload}
                      onDelete={handleImageDelete}
                      onChange={(file, error) => {
                        if (error) toast.error(error)
                      }}
                    />
                    <ImageUpload
                      label="About Background Image"
                      value={config.about_bg_image_url}
                      field="about_bg_image_url"
                      onUpload={handleImageUpload}
                      onDelete={handleImageDelete}
                      onChange={(file, error) => {
                        if (error) toast.error(error)
                      }}
                    />
                    <ImageUpload
                      label="Projects Background Image"
                      value={config.projects_bg_image_url}
                      field="projects_bg_image_url"
                      onUpload={handleImageUpload}
                      onDelete={handleImageDelete}
                      onChange={(file, error) => {
                        if (error) toast.error(error)
                      }}
                    />
                    <ImageUpload
                      label="Skillset Background Image"
                      value={config.skillset_bg_image_url}
                      field="skillset_bg_image_url"
                      onUpload={handleImageUpload}
                      onDelete={handleImageDelete}
                      onChange={(file, error) => {
                        if (error) toast.error(error)
                      }}
                    />
                    <div className="pt-4 border-t border-white/10 mt-4">
                      <DashboardButton
                        onClick={handleDeleteAllImages}
                        variant="secondary"
                        icon={Trash2}
                        className="w-full"
                      >
                        Delete All Images
                      </DashboardButton>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10 mt-6">
                    <button
                      onClick={() => handleSave('Images')}
                      disabled={savingSection === 'Images'}
                      className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      {savingSection === 'Images' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Images</span>
                        </>
                      )}
                    </button>
                  </div>
                </section>
              </div>
            )}

            <div className={activeTab === 'layout' ? 'block' : 'hidden'}>
              <div className="space-y-6">
                <LayoutEditor
                  config={config}
                  onLayoutChange={(newLayout) => {
                    setConfig({ ...config, layout: newLayout })
                  }}
                  onSave={() => handleSave('Layout')}
                  saving={savingSection === 'Layout'}
                />
                <DashboardCard
                  title="Section Visibility"
                  icon={Eye}
                  collapsible
                  expanded={expandedSections.sectionVisibility}
                  onToggle={() => toggleSection('sectionVisibility')}
                  action={
                    <DashboardButton
                      onClick={() => handleSave('Section Visibility')}
                      loading={savingSection === 'Section Visibility'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  <div className="space-y-4">
                    {['hero', 'about', 'projects', 'skillset', 'footer'].map((section) => (
                      <div key={section} className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                        <div>
                          <p className="font-medium text-white capitalize">{section} Section</p>
                          <p className="text-sm text-gray-400">
                            {config.section_visibility?.[section] !== false ? 'Visible on page' : 'Hidden from page'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.section_visibility?.[section] !== false}
                            onChange={(e) => setConfig({
                              ...config,
                              section_visibility: {
                                ...config.section_visibility,
                                [section]: e.target.checked
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </DashboardCard>
              </div>
            </div>

            {activeTab === 'audio' && (
              <div className="space-y-6">
                <DashboardCard
                  title="Background Music"
                  icon={Music}
                  collapsible
                  expanded={expandedSections.audio}
                  onToggle={() => toggleSection('audio')}
                  action={
                    <DashboardButton
                      onClick={() => handleSave('Audio Settings')}
                      loading={savingSection === 'Audio Settings'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                      <div>
                        <p className="font-medium text-white mb-1">Enable Background Music</p>
                        <p className="text-sm text-gray-400">
                          {config.music_enabled ? 'Music is enabled on your page' : 'Music is disabled'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.music_enabled || false}
                          onChange={(e) => setConfig({ ...config, music_enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-orange-600"></div>
                      </label>
                    </div>

                    {config.music_enabled && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Audio File</label>
                          <div className="space-y-3">
                            {config.music_url && (
                              <div className="p-4 rounded-lg border border-white/10 bg-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Music className="w-5 h-5 text-orange-400" />
                                  <div>
                                    <p className="text-sm font-medium text-white">Audio uploaded</p>
                                    <p className="text-xs text-gray-400">Background music ready</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setConfig({ ...config, music_url: '' })
                                    toast.success('Audio removed')
                                  }}
                                  className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors bg-white/5 hover:bg-white/10">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-400">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">MP3, WAV, OGG, or WebM (MAX. 10MB)</p>
                              </div>
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleAudioUpload(file)
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </DashboardCard>

                {config.music_enabled && (
                  <DashboardCard
                    title="Music Warning Page"
                    icon={Settings}
                    collapsible
                    expanded={expandedSections.musicWarning}
                    onToggle={() => toggleSection('musicWarning')}
                  >
                    <div className="space-y-5">
                      <DashboardInput
                        label="Warning Title"
                        value={config.music_warning?.title || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          music_warning: {
                            ...config.music_warning,
                            title: e.target.value
                          }
                        })}
                        placeholder="This page has music enabled"
                      />
                      <DashboardInput
                        label="Warning Message"
                        value={config.music_warning?.message || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          music_warning: {
                            ...config.music_warning,
                            message: e.target.value
                          }
                        })}
                        placeholder="Still want to visit?"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DashboardInput
                          label="Accept Button Text"
                          value={config.music_warning?.accept_text || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            music_warning: {
                              ...config.music_warning,
                              accept_text: e.target.value
                            }
                          })}
                          placeholder="Yes, Continue"
                        />
                        <DashboardInput
                          label="Decline Button Text"
                          value={config.music_warning?.decline_text || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            music_warning: {
                              ...config.music_warning,
                              decline_text: e.target.value
                            }
                          })}
                          placeholder="No, Go Back"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Background Color</label>
                          <input
                            type="color"
                            value={config.music_warning?.background_color || '#000000'}
                            onChange={(e) => setConfig({
                              ...config,
                              music_warning: {
                                ...config.music_warning,
                                background_color: e.target.value
                              }
                            })}
                            className="w-full h-10 rounded-lg border border-white/20 bg-black/50 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Text Color</label>
                          <input
                            type="color"
                            value={config.music_warning?.text_color || '#ffffff'}
                            onChange={(e) => setConfig({
                              ...config,
                              music_warning: {
                                ...config.music_warning,
                                text_color: e.target.value
                              }
                            })}
                            className="w-full h-10 rounded-lg border border-white/20 bg-black/50 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Button Background Color</label>
                          <input
                            type="color"
                            value={config.music_warning?.button_bg_color || '#ff8c00'}
                            onChange={(e) => setConfig({
                              ...config,
                              music_warning: {
                                ...config.music_warning,
                                button_bg_color: e.target.value
                              }
                            })}
                            className="w-full h-10 rounded-lg border border-white/20 bg-black/50 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Button Text Color</label>
                          <input
                            type="color"
                            value={config.music_warning?.button_text_color || '#ffffff'}
                            onChange={(e) => setConfig({
                              ...config,
                              music_warning: {
                                ...config.music_warning,
                                button_text_color: e.target.value
                              }
                            })}
                            className="w-full h-10 rounded-lg border border-white/20 bg-black/50 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </DashboardCard>
                )}

                <DashboardCard
                  title="Custom Cursor"
                  icon={MousePointer2}
                  collapsible
                  expanded={expandedSections.cursor}
                  onToggle={() => toggleSection('cursor')}
                  action={
                    <DashboardButton
                      onClick={() => handleSave('Cursor Settings')}
                      loading={savingSection === 'Cursor Settings'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                      disabled={!isPremium}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  {!isPremium && (
                    <div className="mb-4 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-semibold text-yellow-300">Premium Feature</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">Custom cursor requires Premium</p>
                      <Link
                        to="/pricing"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-xs transition-all"
                      >
                        <Crown className="w-3 h-3" />
                        Upgrade
                      </Link>
                    </div>
                  )}
                  <div className={`space-y-5 relative ${!isPremium ? 'opacity-60' : ''}`}>
                    {!isPremium && (
                      <PremiumBadge feature="Custom Cursor" className="w-full h-full" compact />
                    )}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${!isPremium ? 'text-gray-500' : ''}`}>Cursor Icon</label>
                      <div className="space-y-3">
                        {config.cursor_icon_url && (
                          <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <MousePointer2 className="w-5 h-5 text-orange-400" />
                                <div>
                                  <p className="text-sm font-medium text-white">Cursor uploaded</p>
                                  <p className="text-xs text-gray-400">Custom cursor active</p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  if (isPremium) {
                                    setConfig({ ...config, cursor_icon_url: '' })
                                    toast.success('Cursor removed')
                                  }
                                }}
                                disabled={!isPremium}
                                className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="mt-4 p-4 bg-black/40 rounded-lg border border-white/10">
                              <p className="text-xs text-gray-400 mb-2">Cursor Preview:</p>
                              <div 
                                className="w-full h-32 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center bg-white/5"
                                style={{ 
                                  cursor: config.cursor_icon_url && isPremium ? `url(${config.cursor_icon_url}), auto` : 'default',
                                  backgroundImage: config.cursor_icon_url ? `url(${config.cursor_icon_url})` : 'none',
                                  backgroundSize: 'contain',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                                }}
                              >
                                <p className="text-xs text-gray-500">Hover to see cursor</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-2 text-center">
                                File: {config.cursor_icon_url.split('/').pop()?.split('?')[0] || 'cursor'}
                              </p>
                            </div>
                          </div>
                        )}
                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg transition-colors bg-white/5 ${isPremium ? 'hover:border-white/40 hover:bg-white/10 cursor-pointer' : 'opacity-50 cursor-not-allowed pointer-events-none'}`} style={{ cursor: config.cursor_icon_url && isPremium ? `url(${config.cursor_icon_url}), auto` : 'not-allowed' }}>
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, SVG, ICO, or CUR (MAX. 2MB)</p>
                          </div>
                          <input
                            type="file"
                            accept="image/png,image/svg+xml,image/x-icon,.cur"
                            onChange={(e) => {
                              if (isPremium) {
                                const file = e.target.files?.[0]
                                if (file) handleCursorUpload(file)
                              }
                            }}
                            disabled={!isPremium}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </div>
            )}

            {activeTab === 'premium' && (
              <div className="space-y-6">
                {!isPremium && (
                  <div className="mb-6 p-5 rounded-lg border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
                    <div className="flex items-center gap-3 mb-3">
                      <Crown className="w-6 h-6 text-yellow-400" />
                      <h2 className="text-2xl font-bold text-yellow-300">Premium Features</h2>
                    </div>
                    <p className="text-gray-300 mb-4">Unlock exclusive features and take your profile to the next level with Premium.</p>
                    <Link
                      to="/pricing"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold transition-all"
                    >
                      <Crown className="w-5 h-5" />
                      Upgrade to Premium
                    </Link>
                  </div>
                )}

                <DashboardCard
                  title="Exclusive Badge"
                  icon={Crown}
                  collapsible
                  expanded={expandedSections.exclusiveBadge}
                  onToggle={() => toggleSection('exclusiveBadge')}
                  action={
                    <DashboardButton
                      onClick={() => handleSave('Exclusive Badge')}
                      loading={savingSection === 'Exclusive Badge'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                      disabled={!isPremium}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  <div className={`space-y-4 relative ${!isPremium ? 'opacity-60' : ''}`}>
                    {!isPremium && <PremiumBadge feature="Exclusive Badge" className="w-full h-full" compact />}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                      <div>
                        <p className="font-medium text-white mb-1">Show Exclusive Badge</p>
                        <p className="text-sm text-gray-400">Display a premium badge on your profile</p>
                      </div>
                      <label className={`relative inline-flex items-center ${!isPremium ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          checked={isPremium && config.premium_features?.exclusive_badge === true}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  exclusive_badge: e.target.checked
                                }
                              })
                            }
                          }}
                          disabled={!isPremium}
                          className="sr-only peer"
                        />
                        <div className={`relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${!isPremium ? 'opacity-50' : 'peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600'}`}></div>
                      </label>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="Custom Fonts"
                  icon={Type}
                  collapsible
                  expanded={expandedSections.customFonts}
                  onToggle={() => toggleSection('customFonts')}
                  action={
                    <DashboardButton
                      onClick={() => handleSave('Custom Fonts')}
                      loading={savingSection === 'Custom Fonts'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                      disabled={!isPremium}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  <div className={`space-y-4 relative ${!isPremium ? 'opacity-60' : ''}`}>
                    {!isPremium && <PremiumBadge feature="Custom Fonts" className="w-full h-full" compact />}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                      <div>
                        <p className="font-medium text-white mb-1">Enable Custom Fonts</p>
                        <p className="text-sm text-gray-400">Use custom fonts from Google Fonts or custom URLs</p>
                      </div>
                      <label className={`relative inline-flex items-center ${!isPremium ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          checked={isPremium && config.premium_features?.custom_fonts_enabled === true}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  custom_fonts_enabled: e.target.checked
                                }
                              })
                            }
                          }}
                          disabled={!isPremium}
                          className="sr-only peer"
                        />
                        <div className={`relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${!isPremium ? 'opacity-50' : 'peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600'}`}></div>
                      </label>
                    </div>
                    {config.premium_features?.custom_fonts_enabled && (
                      <div className="space-y-3">
                        <DashboardInput
                          label="Font Family Name"
                          value={config.premium_features?.custom_font_family || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  custom_font_family: e.target.value
                                }
                              })
                            }
                          }}
                          placeholder="e.g., Roboto, Inter, Poppins"
                          disabled={!isPremium}
                        />
                        <DashboardInput
                          label="Font URL (Google Fonts or CDN)"
                          value={config.premium_features?.custom_font_url || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  custom_font_url: e.target.value
                                }
                              })
                            }
                          }}
                          placeholder="https://fonts.googleapis.com/css2?family=..."
                          disabled={!isPremium}
                        />
                      </div>
                    )}
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="Typewriter Animation"
                  icon={Type}
                  collapsible
                  expanded={expandedSections.typewriterAnimation}
                  onToggle={() => toggleSection('typewriterAnimation')}
                  action={
                    <DashboardButton
                      onClick={() => handleSave('Typewriter Animation')}
                      loading={savingSection === 'Typewriter Animation'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                      disabled={!isPremium}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  <div className={`space-y-4 relative ${!isPremium ? 'opacity-60' : ''}`}>
                    {!isPremium && <PremiumBadge feature="Typewriter Animation" className="w-full h-full" compact />}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                      <div>
                        <p className="font-medium text-white mb-1">Enable Typewriter Effect</p>
                        <p className="text-sm text-gray-400">Add animated typewriter effect to your hero title</p>
                      </div>
                      <label className={`relative inline-flex items-center ${!isPremium ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          checked={isPremium && config.premium_features?.typewriter_animation === true}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  typewriter_animation: e.target.checked
                                }
                              })
                            }
                          }}
                          disabled={!isPremium}
                          className="sr-only peer"
                        />
                        <div className={`relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${!isPremium ? 'opacity-50' : 'peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600'}`}></div>
                      </label>
                    </div>
                    {config.premium_features?.typewriter_animation && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-2">Typing Speed (ms)</label>
                          <input
                            type="number"
                            min="10"
                            max="200"
                            value={config.premium_features?.typewriter_speed || 50}
                            onChange={(e) => {
                              if (isPremium) {
                                setConfig({
                                  ...config,
                                  premium_features: {
                                    ...config.premium_features,
                                    typewriter_speed: parseInt(e.target.value)
                                  }
                                })
                              }
                            }}
                            disabled={!isPremium}
                            className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:border-white/40 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Delay Between Characters (ms)</label>
                          <input
                            type="number"
                            min="0"
                            max="500"
                            value={config.premium_features?.typewriter_delay || 100}
                            onChange={(e) => {
                              if (isPremium) {
                                setConfig({
                                  ...config,
                                  premium_features: {
                                    ...config.premium_features,
                                    typewriter_delay: parseInt(e.target.value)
                                  }
                                })
                              }
                            }}
                            disabled={!isPremium}
                            className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:border-white/40 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="Special Profile Effects"
                  icon={Sparkles}
                  collapsible
                  expanded={expandedSections.specialEffects}
                  onToggle={() => toggleSection('specialEffects')}
                  action={
                    <DashboardButton
                      onClick={() => handleSave('Special Effects')}
                      loading={savingSection === 'Special Effects'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                      disabled={!isPremium}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  <div className={`space-y-4 relative ${!isPremium ? 'opacity-60' : ''}`}>
                    {!isPremium && <PremiumBadge feature="Special Effects" className="w-full h-full" compact />}
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-white mb-1">No Effect</p>
                            <p className="text-sm text-gray-400">Disable all special effects</p>
                          </div>
                          <label className={`relative inline-flex items-center ${!isPremium ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
                            <input
                              type="radio"
                              name="special_effect"
                              checked={isPremium && !['particle_effects', 'glitch_effect', 'neon_glow', 'matrix_rain', 'floating_shapes'].some(effect => config.premium_features?.special_effects?.[effect] === true)}
                              onChange={() => {
                                if (isPremium) {
                                  setConfig({
                                    ...config,
                                    premium_features: {
                                      ...config.premium_features,
                                      special_effects: {
                                        particle_effects: false,
                                        glitch_effect: false,
                                        neon_glow: false,
                                        matrix_rain: false,
                                        floating_shapes: false
                                      }
                                    }
                                  })
                                }
                              }}
                              disabled={!isPremium}
                              className="sr-only peer"
                            />
                            <div className={`relative w-6 h-6 border-2 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 ${!isPremium ? 'opacity-50 border-gray-600' : 'border-gray-400 peer-checked:border-orange-500 peer-checked:bg-orange-500'} after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-3 after:h-3 after:bg-white after:rounded-full after:scale-0 peer-checked:after:scale-100 after:transition-transform`}></div>
                          </label>
                        </div>
                      </div>
                      {['particle_effects', 'glitch_effect', 'neon_glow', 'matrix_rain', 'floating_shapes'].map((effect) => (
                        <div key={effect} className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                          <div>
                            <p className="font-medium text-white mb-1 capitalize">{effect.replace(/_/g, ' ')}</p>
                            <p className="text-sm text-gray-400">Enable {effect.replace(/_/g, ' ')} on your profile</p>
                          </div>
                          <label className={`relative inline-flex items-center ${!isPremium ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
                            <input
                              type="radio"
                              name="special_effect"
                              checked={isPremium && config.premium_features?.special_effects?.[effect] === true}
                              onChange={() => {
                                if (isPremium) {
                                  setConfig({
                                    ...config,
                                    premium_features: {
                                      ...config.premium_features,
                                      special_effects: {
                                        particle_effects: false,
                                        glitch_effect: false,
                                        neon_glow: false,
                                        matrix_rain: false,
                                        floating_shapes: false,
                                        [effect]: true
                                      }
                                    }
                                  })
                                }
                              }}
                              disabled={!isPremium}
                              className="sr-only peer"
                            />
                            <div className={`relative w-6 h-6 border-2 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 ${!isPremium ? 'opacity-50 border-gray-600' : 'border-gray-400 peer-checked:border-orange-500 peer-checked:bg-orange-500'} after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-3 after:h-3 after:bg-white after:rounded-full after:scale-0 peer-checked:after:scale-100 after:transition-transform`}></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="Metadata & SEO Customization"
                  icon={Search}
                  collapsible
                  expanded={expandedSections.metadataSeo}
                  onToggle={() => toggleSection('metadataSeo')}
                  action={
                    <DashboardButton
                      onClick={() => handleSave('Metadata & SEO')}
                      loading={savingSection === 'Metadata & SEO'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                      disabled={!isPremium}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  <div className={`space-y-4 relative ${!isPremium ? 'opacity-60' : ''}`}>
                    {!isPremium && <PremiumBadge feature="Metadata & SEO" className="w-full h-full" compact />}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Page Title</label>
                        <DashboardInput
                          value={config.premium_features?.metadata?.page_title || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  metadata: {
                                    ...config.premium_features.metadata,
                                    page_title: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          placeholder="Custom page title for SEO"
                          disabled={!isPremium}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Meta Description</label>
                        <DashboardTextarea
                          value={config.premium_features?.metadata?.meta_description || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  metadata: {
                                    ...config.premium_features.metadata,
                                    meta_description: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          placeholder="Meta description for search engines"
                          disabled={!isPremium}
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Meta Keywords</label>
                        <DashboardInput
                          value={config.premium_features?.metadata?.meta_keywords || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  metadata: {
                                    ...config.premium_features.metadata,
                                    meta_keywords: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          placeholder="keyword1, keyword2, keyword3"
                          disabled={!isPremium}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">OG Title</label>
                        <DashboardInput
                          value={config.premium_features?.metadata?.og_title || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  metadata: {
                                    ...config.premium_features.metadata,
                                    og_title: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          placeholder="Open Graph title for social sharing"
                          disabled={!isPremium}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">OG Description</label>
                        <DashboardTextarea
                          value={config.premium_features?.metadata?.og_description || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  metadata: {
                                    ...config.premium_features.metadata,
                                    og_description: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          placeholder="Open Graph description for social sharing"
                          disabled={!isPremium}
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">OG Image URL</label>
                        <DashboardInput
                          value={config.premium_features?.metadata?.og_image || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  metadata: {
                                    ...config.premium_features.metadata,
                                    og_image: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          placeholder="URL to image for social sharing"
                          disabled={!isPremium}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Twitter Card Type</label>
                        <select
                          value={config.premium_features?.metadata?.twitter_card || 'summary_large_image'}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  metadata: {
                                    ...config.premium_features.metadata,
                                    twitter_card: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          disabled={!isPremium}
                          className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:border-white/40 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="summary">Summary</option>
                          <option value="summary_large_image">Summary Large Image</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Custom Canonical URL</label>
                        <DashboardInput
                          value={config.premium_features?.seo?.custom_canonical || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  seo: {
                                    ...config.premium_features.seo,
                                    custom_canonical: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          placeholder="https://example.com"
                          disabled={!isPremium}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Robots Meta</label>
                        <DashboardInput
                          value={config.premium_features?.seo?.robots || 'index, follow'}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  seo: {
                                    ...config.premium_features.seo,
                                    robots: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          placeholder="index, follow"
                          disabled={!isPremium}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Custom Head HTML</label>
                        <DashboardTextarea
                          value={config.premium_features?.seo?.custom_head || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  seo: {
                                    ...config.premium_features.seo,
                                    custom_head: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          placeholder="Custom HTML to add to &lt;head&gt;"
                          disabled={!isPremium}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="Page Alias"
                  icon={Link2}
                  collapsible
                  expanded={expandedSections.pageAlias}
                  onToggle={() => toggleSection('pageAlias')}
                  action={
                    <DashboardButton
                      onClick={async () => {
                        if (aliasError) {
                          toast.error('Please fix alias errors before saving')
                          return
                        }
                        const aliasValue = config.premium_features?.page_alias
                        if (aliasValue) {
                          const isValid = await checkAliasAvailability(aliasValue)
                          if (!isValid) {
                            toast.error('Cannot save: alias conflicts with existing username or alias')
                            return
                          }
                        }
                        handleSave('Page Alias')
                      }}
                      loading={savingSection === 'Page Alias'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                      disabled={!isPremium || !!aliasError || checkingAlias}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  <div className={`space-y-4 relative ${!isPremium ? 'opacity-60' : ''}`}>
                    {!isPremium && <PremiumBadge feature="Page Alias" className="w-full h-full" compact />}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${!isPremium ? 'text-gray-500' : ''}`}>Custom Page URL Alias</label>
                      <div className="relative">
                        <DashboardInput
                          value={config.premium_features?.page_alias || ''}
                          onChange={async (e) => {
                            if (isPremium) {
                              const aliasValue = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  page_alias: aliasValue
                                }
                              })
                              
                              if (aliasValue && aliasValue.trim()) {
                                if (aliasCheckTimeout.current) {
                                  clearTimeout(aliasCheckTimeout.current)
                                }
                                aliasCheckTimeout.current = setTimeout(async () => {
                                  await checkAliasAvailability(aliasValue)
                                  aliasCheckTimeout.current = null
                                }, 500)
                              } else {
                                if (aliasCheckTimeout.current) {
                                  clearTimeout(aliasCheckTimeout.current)
                                  aliasCheckTimeout.current = null
                                }
                                setAliasError('')
                                setCheckingAlias(false)
                              }
                            }
                          }}
                          placeholder="my-custom-alias"
                          disabled={!isPremium}
                        />
                        {checkingAlias && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          </div>
                        )}
                      </div>
                      {aliasError && (
                        <p className="text-red-400 text-xs mt-2">{aliasError}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Your profile will be accessible at: /{config.premium_features?.page_alias || profile?.username || 'username'}
                      </p>
                      {config.premium_features?.page_alias && profile?.username && (
                        <p className="text-xs text-gray-500 mt-1">
                          Also accessible at: /{profile.username}
                        </p>
                      )}
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="Profile Widgets"
                  icon={LayoutDashboard}
                  collapsible
                  expanded={expandedSections.profileWidgets}
                  onToggle={() => toggleSection('profileWidgets')}
                  action={
                    <DashboardButton
                      onClick={() => handleSave('Profile Widgets')}
                      loading={savingSection === 'Profile Widgets'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                      disabled={!isPremium}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  <div className={`space-y-4 relative ${!isPremium ? 'opacity-60' : ''}`}>
                    {!isPremium && <PremiumBadge feature="Profile Widgets" className="w-full h-full" compact />}
                    <div className="space-y-3">
                      {[
                        { key: 'wakatime_stats', label: 'WakaTime Statistics', desc: 'Display your coding activity from WakaTime' },
                        { key: 'spotify_widget', label: 'Spotify Widget', desc: 'Show what you are currently listening to' },
                        { key: 'weather_widget', label: 'Weather Widget', desc: 'Display current weather at your location' },
                        { key: 'visitor_counter', label: 'Visitor Counter', desc: 'Show total number of profile visitors' },
                        { key: 'last_updated', label: 'Last Updated', desc: 'Display when your profile was last updated' }
                      ].map((widget) => (
                        <div key={widget.key} className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                          <div>
                            <p className="font-medium text-white mb-1">{widget.label}</p>
                            <p className="text-sm text-gray-400">{widget.desc}</p>
                          </div>
                          <label className={`relative inline-flex items-center ${!isPremium ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
                            <input
                              type="checkbox"
                              checked={isPremium && config.premium_features?.profile_widgets?.[widget.key] === true}
                              onChange={(e) => {
                                if (isPremium) {
                                  setConfig({
                                    ...config,
                                    premium_features: {
                                      ...config.premium_features,
                                      profile_widgets: {
                                        ...config.premium_features.profile_widgets,
                                        [widget.key]: e.target.checked
                                      }
                                    }
                                  })
                                }
                              }}
                              disabled={!isPremium}
                              className="sr-only peer"
                            />
                            <div className={`relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${!isPremium ? 'opacity-50' : 'peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600'}`}></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="WakaTime Integration"
                  icon={Clock}
                  collapsible
                  expanded={expandedSections.apiKeys}
                  onToggle={() => toggleSection('apiKeys')}
                  action={
                    <DashboardButton
                      onClick={() => handleSave('WakaTime Integration')}
                      loading={savingSection === 'WakaTime Integration'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                      disabled={!isPremium}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  <div className={`space-y-4 relative ${!isPremium ? 'opacity-60' : ''}`}>
                    {!isPremium && <PremiumBadge feature="WakaTime Integration" className="w-full h-full" compact />}
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${!isPremium ? 'text-gray-500' : 'text-gray-300'}`}>
                        WakaTime API Key
                        <Crown className="w-4 h-4 text-yellow-400" />
                      </label>
                      <div className="relative">
                        <DashboardInput
                          value={isPremium ? (config.wakatime_token || '') : ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({ ...config, wakatime_token: e.target.value })
                            }
                          }}
                          disabled={!isPremium}
                          placeholder={isPremium ? "waka_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" : "Premium feature"}
                          type={showApiKeys.wakatime ? 'text' : 'password'}
                        />
                        <button
                          onClick={() => {
                            if (isPremium) {
                              setShowApiKeys({ ...showApiKeys, wakatime: !showApiKeys.wakatime })
                            }
                          }}
                          disabled={!isPremium}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {showApiKeys.wakatime ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="IDE-Compatible Features"
                  icon={Settings}
                  collapsible
                  expanded={expandedSections.ideFeatures}
                  onToggle={() => toggleSection('ideFeatures')}
                  action={
                    <DashboardButton
                      onClick={() => handleSave('IDE Features')}
                      loading={savingSection === 'IDE Features'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                      disabled={!isPremium}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  <div className={`space-y-4 relative ${!isPremium ? 'opacity-60' : ''}`}>
                    {!isPremium && <PremiumBadge feature="IDE Features" className="w-full h-full" compact />}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">VS Code Theme</label>
                        <select
                          value={config.premium_features?.ide_features?.vs_code_theme || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  ide_features: {
                                    ...config.premium_features.ide_features,
                                    vs_code_theme: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          disabled={!isPremium}
                          className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:border-white/40 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">None</option>
                          <option value="dark">Dark+</option>
                          <option value="light">Light+</option>
                          <option value="monokai">Monokai</option>
                          <option value="dracula">Dracula</option>
                          <option value="one-dark">One Dark Pro</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                        <div>
                          <p className="font-medium text-white mb-1">Code Snippets</p>
                          <p className="text-sm text-gray-400">Display code snippets on your profile</p>
                        </div>
                        <label className={`relative inline-flex items-center ${!isPremium ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
                          <input
                            type="checkbox"
                            checked={isPremium && config.premium_features?.ide_features?.code_snippets === true}
                            onChange={(e) => {
                              if (isPremium) {
                                setConfig({
                                  ...config,
                                  premium_features: {
                                    ...config.premium_features,
                                    ide_features: {
                                      ...config.premium_features.ide_features,
                                      code_snippets: e.target.checked
                                    }
                                  }
                                })
                              }
                            }}
                            disabled={!isPremium}
                            className="sr-only peer"
                          />
                          <div className={`relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${!isPremium ? 'opacity-50' : 'peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600'}`}></div>
                        </label>
                      </div>
                      {isPremium && config.premium_features?.ide_features?.code_snippets && (
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium">Manage Code Snippets</label>
                            <button
                              onClick={() => {
                                const snippets = config.premium_features?.ide_features?.code_snippets_list || []
                                setConfig({
                                  ...config,
                                  premium_features: {
                                    ...config.premium_features,
                                    ide_features: {
                                      ...config.premium_features.ide_features,
                                      code_snippets_list: [...snippets, { id: Date.now(), title: '', language: 'javascript', code: '' }]
                                    }
                                  }
                                })
                              }}
                              className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add Snippet
                            </button>
                          </div>
                          {(config.premium_features?.ide_features?.code_snippets_list || []).map((snippet, index) => (
                            <div key={snippet.id || index} className="p-4 rounded-lg border border-white/10 bg-white/5 space-y-3">
                              <div className="flex items-center justify-between">
                                <input
                                  type="text"
                                  value={snippet.title || ''}
                                  onChange={(e) => {
                                    const snippets = [...(config.premium_features?.ide_features?.code_snippets_list || [])]
                                    snippets[index] = { ...snippets[index], title: e.target.value }
                                    setConfig({
                                      ...config,
                                      premium_features: {
                                        ...config.premium_features,
                                        ide_features: {
                                          ...config.premium_features.ide_features,
                                          code_snippets_list: snippets
                                        }
                                      }
                                    })
                                  }}
                                  placeholder="Snippet title"
                                  className="flex-1 px-3 py-2 bg-black/50 border border-white/20 rounded-lg focus:border-white/40 focus:outline-none text-sm"
                                />
                                <select
                                  value={snippet.language || 'javascript'}
                                  onChange={(e) => {
                                    const snippets = [...(config.premium_features?.ide_features?.code_snippets_list || [])]
                                    snippets[index] = { ...snippets[index], language: e.target.value }
                                    setConfig({
                                      ...config,
                                      premium_features: {
                                        ...config.premium_features,
                                        ide_features: {
                                          ...config.premium_features.ide_features,
                                          code_snippets_list: snippets
                                        }
                                      }
                                    })
                                  }}
                                  className="ml-2 px-3 py-2 bg-black/50 border border-white/20 rounded-lg focus:border-white/40 focus:outline-none text-sm"
                                >
                                  <option value="javascript">JavaScript</option>
                                  <option value="typescript">TypeScript</option>
                                  <option value="python">Python</option>
                                  <option value="java">Java</option>
                                  <option value="cpp">C++</option>
                                  <option value="csharp">C#</option>
                                  <option value="go">Go</option>
                                  <option value="rust">Rust</option>
                                  <option value="php">PHP</option>
                                  <option value="ruby">Ruby</option>
                                  <option value="swift">Swift</option>
                                  <option value="kotlin">Kotlin</option>
                                  <option value="html">HTML</option>
                                  <option value="css">CSS</option>
                                  <option value="json">JSON</option>
                                  <option value="yaml">YAML</option>
                                  <option value="bash">Bash</option>
                                  <option value="sql">SQL</option>
                                </select>
                                <button
                                  onClick={() => {
                                    const snippets = (config.premium_features?.ide_features?.code_snippets_list || []).filter((_, i) => i !== index)
                                    setConfig({
                                      ...config,
                                      premium_features: {
                                        ...config.premium_features,
                                        ide_features: {
                                          ...config.premium_features.ide_features,
                                          code_snippets_list: snippets
                                        }
                                      }
                                    })
                                  }}
                                  className="ml-2 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <DashboardTextarea
                                value={snippet.code || ''}
                                onChange={(e) => {
                                  const snippets = [...(config.premium_features?.ide_features?.code_snippets_list || [])]
                                  snippets[index] = { ...snippets[index], code: e.target.value }
                                  setConfig({
                                    ...config,
                                    premium_features: {
                                      ...config.premium_features,
                                      ide_features: {
                                        ...config.premium_features.ide_features,
                                        code_snippets_list: snippets
                                      }
                                    }
                                  })
                                }}
                                placeholder="Paste your code here..."
                                rows={8}
                                className="font-mono text-sm"
                              />
                            </div>
                          ))}
                          {(!config.premium_features?.ide_features?.code_snippets_list || config.premium_features.ide_features.code_snippets_list.length === 0) && (
                            <p className="text-sm text-gray-500 text-center py-4">No code snippets added yet. Click "Add Snippet" to create one.</p>
                          )}
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium mb-2">Terminal Theme</label>
                        <select
                          value={config.premium_features?.ide_features?.terminal_theme || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  ide_features: {
                                    ...config.premium_features.ide_features,
                                    terminal_theme: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          disabled={!isPremium}
                          className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:border-white/40 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">None</option>
                          <option value="powershell">PowerShell</option>
                          <option value="bash">Bash</option>
                          <option value="zsh">Zsh</option>
                          <option value="fish">Fish</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Editor Font</label>
                        <DashboardInput
                          value={config.premium_features?.ide_features?.editor_font || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  ide_features: {
                                    ...config.premium_features.ide_features,
                                    editor_font: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          placeholder="e.g., Fira Code, JetBrains Mono"
                          disabled={!isPremium}
                        />
                      </div>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="Exclusive Profile Preferences"
                  icon={Settings}
                  collapsible
                  expanded={expandedSections.exclusivePreferences}
                  onToggle={() => toggleSection('exclusivePreferences')}
                  action={
                    <DashboardButton
                      onClick={() => handleSave('Exclusive Preferences')}
                      loading={savingSection === 'Exclusive Preferences'}
                      variant="primary"
                      size="sm"
                      icon={Save}
                      disabled={!isPremium}
                    >
                      Save
                    </DashboardButton>
                  }
                >
                  <div className={`space-y-4 relative ${!isPremium ? 'opacity-60' : ''}`}>
                    {!isPremium && <PremiumBadge feature="Exclusive Preferences" className="w-full h-full" compact />}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                        <div>
                          <p className="font-medium text-white mb-1">Hide Online Status</p>
                          <p className="text-sm text-gray-400">Hide your online status from visitors</p>
                        </div>
                        <label className={`relative inline-flex items-center ${!isPremium ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
                          <input
                            type="checkbox"
                            checked={isPremium && config.premium_features?.exclusive_preferences?.hide_online_status === true}
                            onChange={(e) => {
                              if (isPremium) {
                                setConfig({
                                  ...config,
                                  premium_features: {
                                    ...config.premium_features,
                                    exclusive_preferences: {
                                      ...config.premium_features.exclusive_preferences,
                                      hide_online_status: e.target.checked
                                    }
                                  }
                                })
                              }
                            }}
                            disabled={!isPremium}
                            className="sr-only peer"
                          />
                          <div className={`relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${!isPremium ? 'opacity-50' : 'peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600'}`}></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                        <div>
                          <p className="font-medium text-white mb-1">Disable Analytics</p>
                          <p className="text-sm text-gray-400">Opt out of analytics tracking</p>
                        </div>
                        <label className={`relative inline-flex items-center ${!isPremium ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
                          <input
                            type="checkbox"
                            checked={isPremium && config.premium_features?.exclusive_preferences?.disable_analytics === true}
                            onChange={(e) => {
                              if (isPremium) {
                                setConfig({
                                  ...config,
                                  premium_features: {
                                    ...config.premium_features,
                                    exclusive_preferences: {
                                      ...config.premium_features.exclusive_preferences,
                                      disable_analytics: e.target.checked
                                    }
                                  }
                                })
                              }
                            }}
                            disabled={!isPremium}
                            className="sr-only peer"
                          />
                          <div className={`relative w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${!isPremium ? 'opacity-50' : 'peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600'}`}></div>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Custom Favicon URL</label>
                        <DashboardInput
                          value={config.premium_features?.exclusive_preferences?.custom_favicon || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  exclusive_preferences: {
                                    ...config.premium_features.exclusive_preferences,
                                    custom_favicon: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          placeholder="https://example.com/favicon.ico"
                          disabled={!isPremium}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Custom OG Image URL</label>
                        <DashboardInput
                          value={config.premium_features?.exclusive_preferences?.custom_og_image || ''}
                          onChange={(e) => {
                            if (isPremium) {
                              setConfig({
                                ...config,
                                premium_features: {
                                  ...config.premium_features,
                                  exclusive_preferences: {
                                    ...config.premium_features.exclusive_preferences,
                                    custom_og_image: e.target.value
                                  }
                                }
                              })
                            }
                          }}
                          placeholder="https://example.com/og-image.png"
                          disabled={!isPremium}
                        />
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <ProfilePreview
        config={config}
        userProfile={profile}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  )
}
