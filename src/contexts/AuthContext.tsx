import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // تحقق من الجلسة الحالية عند تحميل التطبيق
  useEffect(() => {
    checkUser()
    
    // الاستماع لتغييرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    } catch (error) {
      console.error('خطأ في التحقق من المستخدم:', error)
      setUser(null)
      setLoading(false)
    }
  }

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('خطأ في جلب ملف المستخدم:', error)
        // إنشاء مستخدم أساسي من بيانات المصادقة
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          const basicUser: User = {
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || 'مستخدم',
            role: 'user',
            is_active: true,
            created_at: authUser.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setUser(basicUser)
        }
      } else {
        setUser(data)
      }
    } catch (error) {
      console.error('خطأ في جلب ملف المستخدم:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // التحقق من صحة البيانات
      if (!email || !password) {
        return { success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' }
      }

      if (!email.includes('@')) {
        return { success: false, error: 'يرجى إدخال بريد إلكتروني صحيح' }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        // رسائل خطأ واضحة
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
        }
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'يرجى تأكيد البريد الإلكتروني أولاً' }
        }
        if (error.message.includes('Too many requests')) {
          return { success: false, error: 'تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً' }
        }
        return { success: false, error: 'حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى' }
      }

      if (!data?.user || !data?.session) {
        return { success: false, error: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى' }
      }

      // جلب ملف المستخدم
      await fetchUserProfile(data.user.id)
      return { success: true }
    } catch (error: any) {
      console.error('خطأ غير متوقع في تسجيل الدخول:', error)
      return { success: false, error: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى' }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('خطأ في تسجيل الخروج:', error)
      }
      setUser(null)
      
      // مسح البيانات المحلية
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sb-warranty-session')
        sessionStorage.clear()
      }
    } catch (error) {
      console.error('خطأ غير متوقع في تسجيل الخروج:', error)
      // حتى لو حدث خطأ، نستمر في تسجيل الخروج محلياً
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}