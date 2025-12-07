import { supabase } from '../lib/supabase'
import type { Admin } from '../types'

export const adminService = {
  async getAdminByUserId(userId: string): Promise<Admin | null> {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.error('Error fetching admin:', error)
      throw new Error(`Failed to fetch admin: ${error.message}`)
    }

    return data
  },

  async getAllAdmins(): Promise<Admin[]> {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admins:', error)
      throw new Error(`Failed to fetch admins: ${error.message}`)
    }

    return data || []
  },

  async getAllProfiles(): Promise<any[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all profiles:', error)
      throw new Error(`Failed to fetch profiles: ${error.message}`)
    }

    return data || []
  },

  async createAdmin(userId: string, permissions: Record<string, unknown>, createdBy?: string): Promise<Admin> {
    const { data, error } = await supabase
      .from('admins')
      .insert({
        user_id: userId,
        permissions,
        is_active: true,
        created_by: createdBy,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating admin:', error)
      throw new Error(`Failed to create admin: ${error.message}`)
    }

    return data
  },

  async updateAdmin(adminId: string, updates: Partial<Admin>): Promise<Admin> {
    const { data, error } = await supabase
      .from('admins')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', adminId)
      .select()
      .single()

    if (error) {
      console.error('Error updating admin:', error)
      throw new Error(`Failed to update admin: ${error.message}`)
    }

    return data
  },

  async deleteAdmin(adminId: string): Promise<void> {
    const { error } = await supabase.from('admins').delete().eq('id', adminId)

    if (error) {
      console.error('Error deleting admin:', error)
      throw new Error(`Failed to delete admin: ${error.message}`)
    }
  },
}
