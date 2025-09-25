import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'
import { createAppError, isNetworkError, getErrorMessage } from '@/lib/errorUtils'
import { logAuth, logError, logDebug } from '@/lib/logger'

export function useAuthState() {
  logAuth('بدء hook حالة المصادقة...')
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  logDebug('الحالة الحالية:', {
    user: user,
    loading: loading,
    error: error
  })

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout | null = null
    logAuth('بدء useEffect...')

    const initializeAuth = async () => {
      try {
        logAuth('بدء تهيئة المصادقة...')
        
        // Check localStorage for existing session
        if (typeof window !== 'undefined') {
          const storedSession = localStorage.getItem('sb-warranty-session')
          console.log('🔍 [useAuthState] الجلسة المحفوظة في localStorage:', storedSession ? 'موجودة' : 'غير موجودة')
        }
        
        // Get initial session with timeout
        console.log('🔄 [useAuthState] جلب الجلسة من Supabase...')
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Session timeout after 10 seconds'))
          }, 10000) // زيادة المهلة إلى 10 ثوان
        })

        const { data: { session }, error: sessionError } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any
        
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        
        console.log('📊 [useAuthState] جلسة المصادقة:', {
          session: session ? 'موجودة' : 'غير موجودة',
          userId: session?.user?.id || 'غير محدد',
          sessionError: sessionError ? sessionError.message : 'لا يوجد خطأ'
        })
        
        if (sessionError) {
          console.error('💥 [useAuthState] خطأ في الجلسة:', sessionError)
          if (mounted) {
            // لا نعرض خطأ الجلسة للمستخدم، فقط نعيده لصفحة تسجيل الدخول
            console.log('🔄 [useAuthState] إعادة توجيه لصفحة تسجيل الدخول بسبب خطأ الجلسة')
            setUser(null)
            setError(null)
            setLoading(false)
          }
          return
        }

        if (session?.user && mounted) {
          console.log('🔄 [useAuthState] جلب ملف المستخدم...', session.user.id)
          await fetchUserProfile(session.user.id)
        } else if (mounted) {
          console.log('📭 [useAuthState] لا توجد جلسة نشطة - إعادة توجيه لصفحة تسجيل الدخول')
          setUser(null)
          setError(null)
          setLoading(false)
        }
      } catch (error) {
        console.error('💥 [useAuthState] خطأ في تهيئة المصادقة:', error)
        if (mounted) {
          // في حالة خطأ الشبكة، لا نعرض خطأ للمستخدم
          if (isNetworkError(error)) {
            console.log('🌐 [useAuthState] خطأ شبكة - إعادة توجيه لصفحة تسجيل الدخول')
            setUser(null)
            setError(null)
          } else {
            const appError = createAppError(error)
            setError(appError.message)
          }
          setLoading(false)
        }
      }
    }

    const fetchUserProfile = async (userId: string) => {
      try {
        console.log('🔄 [useAuthState] جلب ملف المستخدم من Supabase...', userId)
        
        // Add timeout for profile fetch
        const profilePromise = supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single()

        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Profile fetch timeout after 5 seconds'))
          }, 5000)
        })

        const { data, error } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any

        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }

        console.log('📊 [useAuthState] بيانات ملف المستخدم:', {
          data: data,
          error: error
        })

        if (error) {
          console.error('💥 [useAuthState] خطأ في جلب ملف المستخدم:', error)
          
          // التعامل مع خطأ التكرار اللانهائي
          if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
            console.log('🔄 [useAuthState] تم اكتشاف خطأ التكرار اللانهائي - إنشاء مستخدم أساسي...')
            if (mounted) {
              try {
                const { data: { user: authUser } } = await supabase.auth.getUser()
                if (authUser && mounted) {
                  const basicUser: User = {
                    id: authUser.id,
                    email: authUser.email || '',
                    full_name: authUser.user_metadata?.full_name || 'مستخدم',
                    role: 'user',
                    is_active: true,
                    created_at: authUser.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }
                  console.log('✅ [useAuthState] تم إنشاء مستخدم أساسي بعد خطأ RLS:', basicUser)
                  setUser(basicUser)
                  setLoading(false)
                  return
                }
              } catch (authError) {
                console.error('💥 [useAuthState] خطأ في جلب بيانات المصادقة:', authError)
              }
            }
          }
          
          // If profile doesn't exist, create basic user from auth data
          if (error.code === 'PGRST116' && mounted) {
            console.log('🔄 [useAuthState] إنشاء مستخدم أساسي...')
            try {
              const { data: { user: authUser } } = await supabase.auth.getUser()
              if (authUser && mounted) {
                const basicUser: User = {
                  id: authUser.id,
                  email: authUser.email || '',
                  full_name: authUser.user_metadata?.full_name || 'مستخدم',
                  role: 'user',
                  is_active: true,
                  created_at: authUser.created_at || new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
                console.log('✅ [useAuthState] تم إنشاء مستخدم أساسي:', basicUser)
                setUser(basicUser)
                setLoading(false)
                return
              }
            } catch (authError) {
              console.error('💥 [useAuthState] خطأ في جلب بيانات المصادقة:', authError)
            }
          }
          throw error
        }

        if (mounted) {
          console.log('✅ [useAuthState] تم جلب ملف المستخدم بنجاح:', data)
          setUser(data)
          setLoading(false)
        }
      } catch (error) {
        console.error('💥 [useAuthState] خطأ في جلب ملف المستخدم:', error)
        if (mounted) {
          // Don't set user to null for network errors - preserve existing user state
          if (!isNetworkError(error)) {
            setUser(null)
          }
          const appError = createAppError(error)
          setError(appError.message)
          setLoading(false)
        }
      }
    }

    // Set up auth state listener
    console.log('🔄 [useAuthState] إعداد مستمع تغيير حالة المصادقة...')
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [useAuthState] تغيير في حالة المصادقة:', {
          event: event,
          session: session ? 'موجودة' : 'غير موجودة',
          userId: session?.user?.id || 'غير محدد'
        })
        
        // Log localStorage changes
        if (typeof window !== 'undefined') {
          const storedSession = localStorage.getItem('sb-warranty-session')
          console.log('🔍 [useAuthState] localStorage بعد التغيير:', storedSession ? 'موجودة' : 'غير موجودة')
        }
        
        if (!mounted) return

        try {
          if (event === 'SIGNED_OUT' || !session?.user) {
            console.log('📭 [useAuthState] تسجيل خروج المستخدم')
            setUser(null)
            setLoading(false)
            setError(null)
            return
          }

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log('🔐 [useAuthState] تسجيل دخول أو تحديث رمز المستخدم')
            await fetchUserProfile(session.user.id)
          }
        } catch (error) {
          console.error('💥 [useAuthState] خطأ في تغيير حالة المصادقة:', error)
          if (mounted) {
            if (event === 'SIGNED_OUT') {
              setUser(null)
              setError(null)
            } else if (!isNetworkError(error)) {
              // Only clear user for non-network errors
              setUser(null)
              const appError = createAppError(error)
              setError(appError.message)
            }
            setLoading(false)
          }
        }
      }
    )

    initializeAuth()

    // Fallback timeout - shorter timeout to prevent infinite loading
    const fallbackTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.log('⏰ [useAuthState] انتهت مهلة التحميل - إيقاف التحميل')
        setLoading(false)
      }
    }, 2000) // Reduced from 3000 to 2000

    return () => {
      console.log('🧹 [useAuthState] تنظيف useEffect...')
      mounted = false
      subscription.unsubscribe()
      clearTimeout(fallbackTimeout)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  console.log('📊 [useAuthState] إرجاع الحالة النهائية:', {
    user: user,
    loading: loading,
    error: error
  })

  return { user, loading, error, setError }
}
