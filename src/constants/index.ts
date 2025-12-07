export const DEFAULT_TIMEZONE = 'Asia/Kolkata'
export const DEFAULT_DURATION = 3000
export const DEBOUNCE_DELAY = 500
export const API_POLL_INTERVAL = 30000
export const WEATHER_POLL_INTERVAL = 600000

export const SECTION_IDS = {
  HERO: 'hero',
  PROJECTS: 'projects',
  SKILLSET: 'skillset',
  ABOUT: 'about',
  CONTACT: 'contact',
} as const

export const TAB_IDS = {
  CONTENT: 'content',
  STYLE: 'style',
  LAYOUT: 'layout',
  SETTINGS: 'settings',
} as const

export const STORAGE_KEYS = {
  STATS_CACHE: 'homepage_stats',
  PROFILE_CACHE: 'profile_cache',
} as const

export const CACHE_EXPIRY = {
  STATS: 60000,
  PROFILE: 300000,
} as const

export const VALIDATION = {
  USERNAME_MIN_LENGTH: 1,
  USERNAME_MAX_LENGTH: 30,
  USERNAME_PATTERN: /^[a-z0-9_]+$/,
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SETUP: '/setup',
  PRICING: '/pricing',
  TEMPLATES: '/templates',
  ADMIN: '/admin',
  CALLBACK: '/callback',
  PROFILE: (username: string) => `/${username}`,
  TEMPLATE_VIEW: (shareId: string) => `/template/${shareId}`,
} as const
