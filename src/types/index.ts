export interface Profile {
  id: string
  supabase_user_id: string
  email?: string
  username: string
  display_name?: string
  config: ProfileConfig
  is_active: boolean
  view_count: number
  user_id: number
  is_premium: boolean
  premium_expires_at?: string
  paypal_subscription_id?: string
  created_at: string
  updated_at: string
}

export interface ProfileConfig {
  hero_title?: string
  hero_subtitle?: string
  hero_description?: string
  about_title?: string
  about_description?: string
  background_image_url?: string
  about_bg_image_url?: string
  projects_bg_image_url?: string
  skillset_bg_image_url?: string
  profile_image_url?: string
  github_url?: string
  telegram_url?: string
  discord_url?: string
  linkedin_url?: string
  twitter_url?: string
  instagram_url?: string
  youtube_url?: string
  website_url?: string
  email?: string
  location?: string
  timezone?: string
  show_date?: boolean
  show_time?: boolean
  show_view_count?: boolean
  show_scroll_arrow?: boolean
  active_projects?: Project[]
  active_projects_description?: string
  upcoming_projects?: Project[]
  upcoming_projects_description?: string
  skillsets?: Skillset[]
  wakatime_token?: string
  spotify_token?: string
  github_api_key?: string
  section_visibility?: SectionVisibility
  section_backgrounds?: SectionBackgrounds
  premium_features?: PremiumFeatures
  [key: string]: unknown
}

export interface Project {
  id: string
  title: string
  year?: string
  domain?: string
  url?: string
  description?: string
  tech?: string[]
}

export interface Skillset {
  id: string
  name: string
  items: string[]
}

export interface SectionVisibility {
  hero?: boolean
  projects?: boolean
  skillset?: boolean
  about?: boolean
}

export interface SectionBackgrounds {
  hero?: string
  projects?: string
  skillset?: string
  about?: string
}

export interface PremiumFeatures {
  exclusive_preferences?: {
    disable_analytics?: boolean
    custom_favicon?: string
    custom_og_image?: string
  }
}

export interface Template {
  id: string
  user_id: string
  profile_id: string
  name: string
  description?: string
  config: ProfileConfig
  share_id: string
  is_public: boolean
  views: number
  likes: number
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  user_id: string
  permissions: Record<string, unknown>
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}
