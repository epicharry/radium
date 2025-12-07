import { supabase } from '../lib/supabase'
import type { Template, ProfileConfig } from '../types'

export const templateService = {
  async getTemplateByShareId(shareId: string): Promise<Template | null> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('share_id', shareId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching template:', error)
      throw new Error(`Failed to fetch template: ${error.message}`)
    }

    return data
  },

  async getTemplatesByUserId(userId: string): Promise<Template[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching templates:', error)
      throw new Error(`Failed to fetch templates: ${error.message}`)
    }

    return data || []
  },

  async getPublicTemplates(limit = 20): Promise<Template[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching public templates:', error)
      throw new Error(`Failed to fetch public templates: ${error.message}`)
    }

    return data || []
  },

  async createTemplate(
    userId: string,
    profileId: string,
    name: string,
    config: ProfileConfig,
    description?: string,
    isPublic = false
  ): Promise<Template> {
    const shareId = this.generateShareId()

    const { data, error } = await supabase
      .from('templates')
      .insert({
        user_id: userId,
        profile_id: profileId,
        name,
        description,
        config,
        share_id: shareId,
        is_public: isPublic,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating template:', error)
      throw new Error(`Failed to create template: ${error.message}`)
    }

    return data
  },

  async updateTemplate(templateId: string, updates: Partial<Template>): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', templateId)
      .select()
      .single()

    if (error) {
      console.error('Error updating template:', error)
      throw new Error(`Failed to update template: ${error.message}`)
    }

    return data
  },

  async deleteTemplate(templateId: string): Promise<void> {
    const { error } = await supabase.from('templates').delete().eq('id', templateId)

    if (error) {
      console.error('Error deleting template:', error)
      throw new Error(`Failed to delete template: ${error.message}`)
    }
  },

  async incrementTemplateViews(shareId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_template_views', {
      template_share_id: shareId,
    })

    if (error) {
      console.error('Error incrementing template views:', error)
    }
  },

  generateShareId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  },
}
