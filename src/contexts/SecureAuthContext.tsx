import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { secureAuth, type AuthUser, type LoginResult, type SessionInfo } from '@/lib/secure-auth'
import { logAuth, logError } from '@/lib/logger'

// أنواع البيانات
interface SecureAuthContextType {
  // حالة المصادقة
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  userRole: string
  
  // معلومات الجلسة
  sessionInfo: SessionInfo | null
  
  // العمليات
  signIn: (email: string, password: string) => Promise<LoginResult>
  signOut: () => Promise<void>
  refreshSession: () => Promise<boolean>
  checkSession: () => Promise<SessionInfo>
  
  // معلومات إضافية
  lastLoginAt?: string
}

// إنشاء Context
const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined)

// Hook للاستخدام
export function useSecureAuth() {
  const context = useContext(SecureAuthContext)
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider')
  }
  return context
}

// Props للمزود
interface SecureAuthProviderProps {
  children: React.ReactNode
}

// مكون المزود
export function SecureAuthProvider({ children }: SecureAuthProviderProps) {
  // الحالة
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const [lastLoginAt, setLastLoginAt] = useState<string | undefined>(undefined)

  // تهيئة النظام
  useEffect(() => {
    initializeAuth()
    
    return () => {
      // تنظيف الموارد عند إلغاء التحميل
      secureAuth.destroy()
    }
  }, [])


  // مراقبة حالة المستخدم
  useEffect(() => {
    if (user) {
      setLastLoginAt(user.last_login_at)
    } else {
      setLastLoginAt(undefined)
    }
  }, [user])

  // تهيئة المصادقة
  const initializeAuth = async () => {
    try {
      setLoading(true)
      logAuth('🚀 تهيئة نظام المصادقة الآمن...')

      // تهيئة النظام
      await secureAuth.initialize()
      
      // التحقق من الجلسة الحالية
      const session = await secureAuth.checkCurrentSession()
      setSessionInfo(session)
      
      if (session.isValid && session.user) {
        setUser(session.user)
        logAuth('✅ تم تحميل جلسة صالحة للمستخدم:', { userId: session.user.id })
      } else {
        setUser(null)
        logAuth('ℹ️ لا توجد جلسة صالحة')
      }
    } catch (error) {
      logError('❌ خطأ في تهيئة المصادقة:', error)
      setUser(null)
      setSessionInfo(null)
    } finally {
      setLoading(false)
    }
  }

  // تسجيل الدخول
  const signIn = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      setLoading(true)
      logAuth('🔐 بدء تسجيل الدخول...', { email: secureAuth['maskEmail'](email) })

      const result = await secureAuth.signIn(email, password)
      
      if (result.success && result.user) {
        setUser(result.user)
        
        // تحديث معلومات الجلسة
        const session = await secureAuth.checkCurrentSession()
        setSessionInfo(session)
        
        logAuth('✅ تم تسجيل الدخول بنجاح')
      } else {
        logAuth('❌ فشل في تسجيل الدخول:', { error: result.error })
      }
      
      return result
    } catch (error) {
      logError('❌ خطأ غير متوقع في تسجيل الدخول:', error)
      return { 
        success: false, 
        error: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى' 
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // تسجيل الخروج
  const signOut = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      logAuth('🚪 بدء تسجيل الخروج...')

      await secureAuth.signOut()
      
      setUser(null)
      setSessionInfo(null)
      setLastLoginAt(undefined)
      
      logAuth('✅ تم تسجيل الخروج بنجاح')
    } catch (error) {
      logError('❌ خطأ في تسجيل الخروج:', error)
      // حتى لو حدث خطأ، نستمر في تسجيل الخروج محلياً
      setUser(null)
      setSessionInfo(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // تجديد الجلسة
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      logAuth('🔄 تجديد الجلسة...')
      
      const refreshed = await secureAuth.refreshSession()
      
      if (refreshed) {
        // تحديث معلومات الجلسة
        const session = await secureAuth.checkCurrentSession()
        setSessionInfo(session)
        
        if (session.isValid && session.user) {
          setUser(session.user)
        }
        
        logAuth('✅ تم تجديد الجلسة بنجاح')
        return true
      } else {
        logAuth('❌ فشل في تجديد الجلسة')
        return false
      }
    } catch (error) {
      logError('❌ خطأ في تجديد الجلسة:', error)
      return false
    }
  }, [])

  // التحقق من الجلسة
  const checkSession = useCallback(async (): Promise<SessionInfo> => {
    try {
      const session = await secureAuth.checkCurrentSession()
      setSessionInfo(session)
      
      if (session.isValid && session.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      
      return session
    } catch (error) {
      logError('❌ خطأ في التحقق من الجلسة:', error)
      const invalidSession = { isValid: false }
      setSessionInfo(invalidSession)
      setUser(null)
      return invalidSession
    }
  }, [])

  // حساب القيم المشتقة
  const isAuthenticated = user !== null && user.is_active
  const isAdmin = user?.role === 'admin' && user?.is_active === true
  const userRole = user?.role || 'user'

  // قيمة Context
  const value: SecureAuthContextType = {
    // حالة المصادقة
    user,
    loading,
    isAuthenticated,
    isAdmin,
    userRole,
    
    // معلومات الجلسة
    sessionInfo,
    
    // العمليات
    signIn,
    signOut,
    refreshSession,
    checkSession,
    
    // معلومات إضافية
    lastLoginAt,
  }

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  )
}

// مكون للتحقق من الصلاحيات
interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requireAdmin = false, fallback }: AuthGuardProps) {
  const { isAuthenticated, isAdmin, loading } = useSecureAuth()
  const navigate = useNavigate()

  // جميع hooks في البداية - لا conditional rendering
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [loading, isAuthenticated, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            مطلوب تسجيل الدخول
          </h2>
          <p className="text-gray-600">
            جاري التوجيه إلى صفحة تسجيل الدخول...
          </p>
        </div>
      </div>
    )
  }

  if (requireAdmin && !isAdmin) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            غير مخول للوصول
          </h2>
          <p className="text-gray-600">
            هذه الصفحة مخصصة للمدراء فقط
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// مكون لعرض معلومات المستخدم
export function UserInfo() {
  const { user, sessionInfo } = useSecureAuth()

  if (!user) return null

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">معلومات المستخدم</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">الاسم:</span>
          <span className="font-medium">{user.full_name}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">البريد الإلكتروني:</span>
          <span className="font-medium">{user.email}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">الدور:</span>
          <span className={`font-medium ${user.role === 'admin' ? 'text-blue-600' : 'text-green-600'}`}>
            {user.role === 'admin' ? 'مدير' : 'مستخدم'}
          </span>
        </div>
        
        {user.last_login_at && (
          <div className="flex justify-between">
            <span className="text-gray-600">آخر دخول:</span>
            <span className="font-medium">
              {new Date(user.last_login_at).toLocaleDateString('ar-SA')}
            </span>
          </div>
        )}
        
        {sessionInfo?.timeRemaining && (
          <div className="flex justify-between">
            <span className="text-gray-600">انتهاء الجلسة:</span>
            <span className="font-medium">
              {sessionInfo.timeRemaining} دقيقة
            </span>
          </div>
        )}
        
      </div>
    </div>
  )
}

export default SecureAuthProvider
