import { supabase } from '../lib/supabase'
import type { Profile, ProfileConfig } from '../types'

export const profileService = {
  async getProfileByUsername(username: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.error('Error fetching profile:', error)
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }

    return data
  },

  async getProfileByAuth0Id(auth0Id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth0_id', auth0Id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching profile by auth0_id:', error)
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }

    return data
  },

  async createProfile(profileData: {
    auth0_id: string
    email?: string
    username: string
    display_name?: string
  }): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        ...profileData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      throw new Error(`Failed to create profile: ${error.message}`)
    }

    return data
  },

  async updateProfile(profileId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw new Error(`Failed to update profile: ${error.message}`)
    }

    return data
  },

  async updateProfileConfig(profileId: string, config: Partial<ProfileConfig>): Promise<Profile> {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('config')
      .eq('id', profileId)
      .single()

    if (!existingProfile) {
      throw new Error('Profile not found')
    }

    const updatedConfig = {
      ...existingProfile.config,
      ...config,
    }

    return this.updateProfile(profileId, { config: updatedConfig })
  },

  async incrementViewCount(profileId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_view_count', {
      profile_id: profileId,
    })

    if (error) {
      console.error('Error incrementing view count:', error)
    }
  },

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.toLowerCase())
      .maybeSingle()

    if (error) {
      console.error('Error checking username:', error)
      return false
    }

    return data === null
  },

  async updateUsername(profileId: string, newUsername: string): Promise<Profile> {
    const isAvailable = await this.checkUsernameAvailability(newUsername)
    if (!isAvailable) {
      throw new Error('Username is already taken')
    }

    return this.updateProfile(profileId, { username: newUsername.toLowerCase() })
  },
}
