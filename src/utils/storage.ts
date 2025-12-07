interface CacheItem<T> {
  data: T
  timestamp: number
}

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key)
      if (!item) return null

      const parsed: CacheItem<T> = JSON.parse(item)
      return parsed.data
    } catch {
      return null
    }
  },

  set<T>(key: string, data: T): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
      }
      sessionStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.error('Error setting storage item:', error)
    }
  },

  getCached<T>(key: string, expiry: number): T | null {
    try {
      const item = sessionStorage.getItem(key)
      if (!item) return null

      const parsed: CacheItem<T> = JSON.parse(item)
      const now = Date.now()

      if (now - parsed.timestamp > expiry) {
        sessionStorage.removeItem(key)
        return null
      }

      return parsed.data
    } catch {
      return null
    }
  },

  remove(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing storage item:', error)
    }
  },

  clear(): void {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  },
}
