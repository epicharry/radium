import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../lib/supabase'
import { 
  Users, Shield, Ban, Crown, Search, Eye, Edit, Trash2, 
  Save, X, Plus, Mail, UserCheck, UserX, Calendar, 
  Settings, Lock, Unlock, AlertCircle, CheckCircle,
  ArrowLeft, RefreshCw, Key, UserPlus
} from 'lucide-react'
import DashboardCard from '../components/DashboardCard'
import DashboardInput from '../components/DashboardInput'
import DashboardButton from '../components/DashboardButton'

const MASTER_ADMIN = 'Deyo'

const ADMIN_PERMISSIONS = {
  manage_users: 'Manage Users',
  manage_premium: 'Manage Premium',
  manage_admins: 'Manage Admins',
  ban_users: 'Ban/Unban Users',
  view_emails: 'View User Emails',
  edit_profiles: 'Edit User Profiles',
  account_recovery: 'Account Recovery',
  view_all_data: 'View All Data'
}

export default function AdminDashboard() {
  const { isAuthenticated, profile, login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newAdminUsername, setNewAdminUsername] = useState('')
  const [adminPermissions, setAdminPermissions] = useState({})

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!isAuthenticated || !profile) {
        setIsLoading(false)
        return
      }

      try {
        const isMasterAdmin = profile.username?.toLowerCase() === MASTER_ADMIN.toLowerCase()
        
        if (!isMasterAdmin) {
          const { data: adminData, error } = await supabase
            .from('admins')
            .select('*')
            .eq('user_id', profile.id)
            .single()

          if (error || !adminData || !adminData.is_active) {
            navigate('/dashboard')
            return
          }
        }

        setIsAdmin(true)
        await loadData()
      } catch (error) {
        console.error('Error checking admin access:', error)
        navigate('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAccess()
  }, [isAuthenticated, profile, navigate])

  const loadData = async () => {
    await Promise.all([loadUsers(), loadAdmins()])
  }

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    }
  }

  const loadAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching admins:', error)
        toast.error(`Failed to load admins: ${error.message}`)
        setAdmins([])
        return
      }

      if (!data || data.length === 0) {
        setAdmins([])
        return
      }

      const adminsWithProfiles = await Promise.all(
        data.map(async (admin) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, display_name, email')
            .eq('id', admin.user_id)
            .single()

          if (profileError) {
            console.error(`Error fetching profile for admin ${admin.user_id}:`, profileError)
          }

          return {
            ...admin,
            profile: profileData || { username: 'Unknown', display_name: 'Unknown', email: 'N/A' }
          }
        })
      )

      setAdmins(adminsWithProfiles)
    } catch (error) {
      console.error('Error loading admins:', error)
      toast.error(`Failed to load admins: ${error.message || 'Unknown error'}`)
      setAdmins([])
    }
  }

  const handleTogglePremium = async (userId, currentPremiumStatus) => {
    try {
      const newPremiumStatus = !currentPremiumStatus
      const premiumExpiresAt = newPremiumStatus ? null : new Date().toISOString()

      const { error } = await supabase
        .from('profiles')
        .update({
          is_premium: newPremiumStatus,
          premium_expires_at: premiumExpiresAt
        })
        .eq('id', userId)

      if (error) throw error

      toast.success(`Premium ${newPremiumStatus ? 'granted' : 'revoked'}`)
      await loadUsers()
    } catch (error) {
      console.error('Error toggling premium:', error)
      toast.error('Failed to update premium status')
    }
  }

  const handleBanUser = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      toast.success(`User ${!currentStatus ? 'banned' : 'unbanned'}`)
      await loadUsers()
    } catch (error) {
      console.error('Error banning user:', error)
      toast.error('Failed to update user status')
    }
  }

  const handleEditUser = (user) => {
    setEditingUser({ ...user })
    setEditMode(true)
  }

  const handleSaveUser = async () => {
    if (!editingUser) return

    try {
      const updates = {
        username: editingUser.username.toLowerCase(),
        display_name: editingUser.display_name,
        email: editingUser.email,
        view_count: editingUser.view_count
      }

      if (editingUser.config) {
        updates.config = editingUser.config
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', editingUser.id)

      if (error) throw error

      toast.success('User updated successfully')
      setEditMode(false)
      setEditingUser(null)
      await loadUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error(error.message || 'Failed to update user')
    }
  }

  const handleViewConfig = async (user) => {
    try {
      const configText = JSON.stringify(user.config || {}, null, 2)
      const blob = new Blob([configText], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${user.username}-config.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting config:', error)
      toast.error('Failed to export config')
    }
  }

  const handleAddAdmin = async () => {
    if (!newAdminUsername.trim()) {
      toast.error('Please enter a username')
      return
    }

    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', newAdminUsername.toLowerCase())
        .single()

      if (userError || !userData) {
        toast.error('User not found')
        return
      }

      const { error } = await supabase
        .from('admins')
        .insert({
          user_id: userData.id,
          permissions: adminPermissions,
          is_active: true,
          created_by: profile.id
        })

      if (error) throw error

      toast.success('Admin added successfully')
      setNewAdminUsername('')
      setAdminPermissions({})
      await loadAdmins()
    } catch (error) {
      console.error('Error adding admin:', error)
      toast.error('Failed to add admin')
    }
  }

  const handleRemoveAdmin = async (adminId) => {
    if (!confirm('Are you sure you want to remove this admin?')) return

    try {
      const { error } = await supabase
        .from('admins')
        .update({ is_active: false })
        .eq('id', adminId)

      if (error) throw error

      toast.success('Admin removed successfully')
      await loadAdmins()
    } catch (error) {
      console.error('Error removing admin:', error)
      toast.error('Failed to remove admin')
    }
  }

  const handleUpdateAdminPermissions = async (adminId, permissions) => {
    try {
      const { error } = await supabase
        .from('admins')
        .update({ permissions })
        .eq('id', adminId)

      if (error) throw error

      toast.success('Admin permissions updated')
      await loadAdmins()
    } catch (error) {
      console.error('Error updating permissions:', error)
      toast.error('Failed to update permissions')
    }
  }

  const handleAccountMigration = async (oldUserId, newUsername) => {
    if (!confirm('This will migrate the account to a new username. Continue?')) return

    try {
      const { data: newUserData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', newUsername.toLowerCase())
        .single()

      if (!userError && newUserData) {
        toast.error('Username already exists')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername.toLowerCase() })
        .eq('id', oldUserId)

      if (error) throw error

      toast.success('Account migrated successfully')
      await loadUsers()
    } catch (error) {
      console.error('Error migrating account:', error)
      toast.error('Failed to migrate account')
    }
  }

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase()
    return (
      user.username?.toLowerCase().includes(query) ||
      user.display_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    )
  })

  const isMasterAdmin = profile?.username?.toLowerCase() === MASTER_ADMIN.toLowerCase()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-500" />
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                {isMasterAdmin && (
                  <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/50">
                    Master Admin
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={loadData}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Users ({users.length})</span>
            </div>
          </button>
          {isMasterAdmin && (
            <button
              onClick={() => setActiveTab('admins')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'admins'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Admins ({admins.length})</span>
              </div>
            </button>
          )}
        </div>

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by username, name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <DashboardCard key={user.id} title={null}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{user.username}</h3>
                          {user.is_premium && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                          {!user.is_active && (
                            <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/50">
                              Banned
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-400">
                          <p><strong>Display Name:</strong> {user.display_name || 'N/A'}</p>
                          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                          <p><strong>Views:</strong> {user.view_count || 0}</p>
                          <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-sm transition-colors flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleViewConfig(user)}
                          className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-sm transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Config
                        </button>
                        <button
                          onClick={() => handleTogglePremium(user.id, user.is_premium)}
                          className={`px-3 py-1.5 border rounded-lg text-sm transition-colors flex items-center gap-2 ${
                            user.is_premium
                              ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/50'
                              : 'bg-gray-500/20 hover:bg-gray-500/30 border-gray-500/50'
                          }`}
                        >
                          <Crown className="w-4 h-4" />
                          {user.is_premium ? 'Remove Premium' : 'Grant Premium'}
                        </button>
                        <button
                          onClick={() => handleBanUser(user.id, user.is_active)}
                          className={`px-3 py-1.5 border rounded-lg text-sm transition-colors flex items-center gap-2 ${
                            user.is_active
                              ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50'
                              : 'bg-green-500/20 hover:bg-green-500/30 border-green-500/50'
                          }`}
                        >
                          {user.is_active ? (
                            <>
                              <Ban className="w-4 h-4" />
                              Ban
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Unban
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {editMode && editingUser?.id === user.id && (
                      <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                        <DashboardInput
                          label="Username"
                          value={editingUser.username}
                          onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                        />
                        <DashboardInput
                          label="Display Name"
                          value={editingUser.display_name || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, display_name: e.target.value })}
                        />
                        <DashboardInput
                          label="Email"
                          value={editingUser.email || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          type="email"
                        />
                        <DashboardInput
                          label="View Count"
                          value={editingUser.view_count || 0}
                          onChange={(e) => setEditingUser({ ...editingUser, view_count: parseInt(e.target.value) || 0 })}
                          type="number"
                        />
                        <div className="flex gap-2">
                          <DashboardButton
                            onClick={handleSaveUser}
                            variant="primary"
                            icon={Save}
                          >
                            Save Changes
                          </DashboardButton>
                          <DashboardButton
                            onClick={() => {
                              setEditMode(false)
                              setEditingUser(null)
                            }}
                            variant="secondary"
                            icon={X}
                          >
                            Cancel
                          </DashboardButton>
                        </div>
                      </div>
                    )}
                  </div>
                </DashboardCard>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admins' && isMasterAdmin && (
          <div className="space-y-6">
            <DashboardCard title="Add New Admin">
              <div className="space-y-4">
                <DashboardInput
                  label="Username"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  placeholder="Enter username to make admin"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Permissions</label>
                  {Object.entries(ADMIN_PERMISSIONS).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adminPermissions[key] === true}
                        onChange={(e) => {
                          setAdminPermissions({
                            ...adminPermissions,
                            [key]: e.target.checked
                          })
                        }}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
                <DashboardButton
                  onClick={handleAddAdmin}
                  variant="primary"
                  icon={UserPlus}
                >
                  Add Admin
                </DashboardButton>
              </div>
            </DashboardCard>

            <div className="space-y-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">Master Admin: {MASTER_ADMIN}</span>
                </div>
                <p className="text-sm text-gray-400">Master admin has full access to all features.</p>
              </div>

              {admins.map((admin) => (
                <DashboardCard key={admin.id} title={admin.profile?.username || 'Unknown'}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-2">
                          <strong>Email:</strong> {admin.profile?.email || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-400">
                          <strong>Created:</strong> {new Date(admin.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveAdmin(admin.id)}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Permissions</label>
                      {Object.entries(ADMIN_PERMISSIONS).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={admin.permissions?.[key] === true}
                            onChange={(e) => {
                              handleUpdateAdminPermissions(admin.id, {
                                ...admin.permissions,
                                [key]: e.target.checked
                              })
                            }}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

