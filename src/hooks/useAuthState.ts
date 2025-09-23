import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'
import { createAppError, isNetworkError, getErrorMessage } from '@/lib/errorUtils'

export function useAuthState() {
  console.log('🔄 [useAuthState] بدء hook حالة المصادقة...')
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  console.log('📊 [useAuthState] الحالة الحالية:', {
    user: user,
    loading: loading,
    error: error
  })

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout | null = null
    console.log('🔄 [useAuthState] بدء useEffect...')

    const initializeAuth = async () => {
      try {
        console.log('🔄 [useAuthState] بدء تهيئة المصادقة...')
        
        // Check localStorage for existing session
        if (typeof window !== 'undefined') {
          const storedSession = localStorage.getItem('sb-warranty-session')
          console.log('🔍 [useAuthState] الجلسة المحفوظة في localStorage:', storedSession ? 'موجودة' : 'غير موجودة')
        }
        
        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Session timeout after 5 seconds'))
          }, 5000)
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
          session: session,
          sessionError: sessionError
        })
        
        if (sessionError) {
          console.error('💥 [useAuthState] خطأ في الجلسة:', sessionError)
          if (mounted) {
            const appError = createAppError(sessionError)
            setError(appError.message)
            setLoading(false)
          }
          return
        }

        if (session?.user && mounted) {
          console.log('🔄 [useAuthState] جلب ملف المستخدم...', session.user.id)
          await fetchUserProfile(session.user.id)
        } else if (mounted) {
          console.log('📭 [useAuthState] لا توجد جلسة نشطة')
          setUser(null)
          setLoading(false)
        }
      } catch (error) {
        console.error('💥 [useAuthState] خطأ في تهيئة المصادقة:', error)
        if (mounted) {
          const appError = createAppError(error)
          setError(appError.message)
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
          if (session?.user) {
            await fetchUserProfile(session.user.id)
          } else {
            console.log('📭 [useAuthState] تسجيل خروج المستخدم')
            setUser(null)
            setLoading(false)
          }
        } catch (error) {
          console.error('💥 [useAuthState] خطأ في تغيير حالة المصادقة:', error)
          if (mounted) {
            if (event === 'SIGNED_OUT') {
              setUser(null)
            } else if (!isNetworkError(error)) {
              // Only clear user for non-network errors
              setUser(null)
            }
            const appError = createAppError(error)
            setError(appError.message)
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
