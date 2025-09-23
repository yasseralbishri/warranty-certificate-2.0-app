import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash2, Shield, User as UserIcon, Check, X, AlertCircle, UserPlus } from 'lucide-react'
import type { User } from '@/types'

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (updates: Partial<User>) => {
    if (!editingUser) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates as any)
        .eq('id', editingUser.id)

      if (error) throw error

      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...updates } : user
      ))
      setEditingUser(null)
      setSuccess('تم تحديث بيانات المستخدم بنجاح')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleCreateUser = async (userData: { email: string; password: string; fullName: string; role: 'admin' | 'user' }) => {
    try {
      // Use the userService.createUser function instead of direct admin call
      const { userService } = await import('@/lib/supabase')
      await userService.createUser(userData.email, userData.password, userData.fullName, userData.role)

      // Refresh users list
      await fetchUsers()
      setShowCreateForm(false)
      setSuccess('تم إنشاء المستخدم بنجاح')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      console.error('Create user error:', error)
      setError(error.message || 'حدث خطأ أثناء إنشاء المستخدم')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error

      setUsers(users.filter(user => user.id !== userId))
      setSuccess('تم حذف المستخدم بنجاح')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !isActive } as any)
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: !isActive } : user
      ))
      setSuccess(`تم ${!isActive ? 'تفعيل' : 'إلغاء تفعيل'} المستخدم بنجاح`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحميل بيانات المستخدمين...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
          <Button
            onClick={() => setError('')}
            variant="ghost"
            size="sm"
            className="text-red-700 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-4">
          <Check className="w-5 h-5" />
          <span className="text-sm">{success}</span>
          <Button
            onClick={() => setSuccess('')}
            variant="ghost"
            size="sm"
            className="text-green-700 hover:text-green-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Add User Button */}
      <div className="mb-6">
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UserPlus className="w-4 h-4" />
          إضافة مستخدم جديد
        </Button>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <CreateUserForm
          onCreateUser={handleCreateUser}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Users List */}
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="border border-gray-200">
            <CardContent className="p-6">
              {editingUser?.id === user.id ? (
                <EditUserForm
                  user={user}
                  onSave={handleUpdateUser}
                  onCancel={() => setEditingUser(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                      {user.role === 'admin' ? (
                        <Shield className="w-6 h-6 text-red-600" />
                      ) : (
                        <UserIcon className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.full_name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      variant="outline"
                      size="sm"
                      className={user.is_active ? 'text-orange-600 border-orange-200 hover:bg-orange-50' : 'text-green-600 border-green-200 hover:bg-green-50'}
                    >
                      {user.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
                    </Button>
                    <Button
                      onClick={() => setEditingUser(user)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(user.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">لا توجد مستخدمين في النظام</p>
        </div>
      )}
    </div>
  )
}

interface EditUserFormProps {
  user: User
  onSave: (updates: Partial<User>) => void
  onCancel: () => void
}

function EditUserForm({ user, onSave, onCancel }: EditUserFormProps) {
  const [fullName, setFullName] = useState(user.full_name)
  const [role, setRole] = useState(user.role)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      full_name: fullName,
      role: role as 'admin' | 'user'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">الاسم الكامل</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="role">الدور</Label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="user">مستخدم</option>
          <option value="admin">مدير</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          <Check className="w-4 h-4 mr-2" />
          حفظ
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          إلغاء
        </Button>
      </div>
    </form>
  )
}

interface CreateUserFormProps {
  onCreateUser: (userData: { email: string; password: string; fullName: string; role: 'admin' | 'user' }) => void
  onCancel: () => void
}

function CreateUserForm({ onCreateUser, onCancel }: CreateUserFormProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'user'>('user')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      alert('كلمة المرور وتأكيدها غير متطابقتين')
      return
    }
    
    if (password.length < 6) {
      alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    onCreateUser({ email, password, fullName, role })
    
    // Reset form
    setFullName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setRole('user')
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">إضافة مستخدم جديد</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="createFullName">الاسم الكامل</Label>
              <Input
                id="createFullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="createEmail">البريد الإلكتروني</Label>
              <Input
                id="createEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                dir="ltr"
              />
            </div>
            <div>
              <Label htmlFor="createPassword">كلمة المرور</Label>
              <Input
                id="createPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
                minLength={6}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="createRole">الدور</Label>
            <select
              id="createRole"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">مستخدم</option>
              <option value="admin">مدير</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              إنشاء المستخدم
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
