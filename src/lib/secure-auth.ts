import { supabase } from './supabase'
import { logAuth, logError, logDebug, logSecurity } from './logger'

// أنواع البيانات
export interface AuthUser {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'user'
  is_active: boolean
  last_login_at?: string
  failed_login_attempts: number
  locked_until?: string
  created_at: string
  updated_at: string
}

export interface LoginResult {
  success: boolean
  user?: AuthUser
  error?: string
  requiresConfirmation?: boolean
}

export interface SessionInfo {
  isValid: boolean
  user?: AuthUser
  expiresAt?: string
  timeRemaining?: number
}

// إعدادات الأمان
const SECURITY_CONFIG = {
  SESSION_TIMEOUT_MINUTES: 60,
  REFRESH_THRESHOLD_MINUTES: 10,
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ALLOWED_EMAIL_DOMAINS: ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'], // يمكن تخصيصها
}

// مساعدات التحقق
export class SecurityValidator {
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email || !email.trim()) {
      return { isValid: false, error: 'البريد الإلكتروني مطلوب' }
    }

    const trimmedEmail = email.trim().toLowerCase()
    
    if (!SECURITY_CONFIG.EMAIL_REGEX.test(trimmedEmail)) {
      return { isValid: false, error: 'تنسيق البريد الإلكتروني غير صحيح' }
    }

    const domain = trimmedEmail.split('@')[1]
    if (SECURITY_CONFIG.ALLOWED_EMAIL_DOMAINS.length > 0 && 
        !SECURITY_CONFIG.ALLOWED_EMAIL_DOMAINS.includes(domain)) {
      return { isValid: false, error: 'نطاق البريد الإلكتروني غير مسموح' }
    }

    return { isValid: true }
  }

  static validatePassword(password: string): { isValid: boolean; error?: string } {
    if (!password || !password.trim()) {
      return { isValid: false, error: 'كلمة المرور مطلوبة' }
    }

    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      return { isValid: false, error: `كلمة المرور يجب أن تكون ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} أحرف على الأقل` }
    }

    // فحوصات أمنية إضافية
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, error: 'كلمة المرور يجب أن تحتوي على حرف صغير' }
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, error: 'كلمة المرور يجب أن تحتوي على حرف كبير' }
    }

    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, error: 'كلمة المرور يجب أن تحتوي على رقم' }
    }

    return { isValid: true }
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>\"']/g, '')
  }
}

// فئة إدارة المصادقة الآمنة
export class SecureAuthManager {
  private static instance: SecureAuthManager
  private currentUser: AuthUser | null = null
  private sessionCheckInterval: NodeJS.Timeout | null = null
  private isInitialized = false

  private constructor() {}

  static getInstance(): SecureAuthManager {
    if (!SecureAuthManager.instance) {
      SecureAuthManager.instance = new SecureAuthManager()
    }
    return SecureAuthManager.instance
  }

  // تهيئة النظام
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      logAuth('🚀 تهيئة نظام المصادقة الآمن...')
      
      // التحقق من الجلسة الحالية
      await this.checkCurrentSession()
      
      // بدء مراقبة الجلسة
      this.startSessionMonitoring()
      
      // الاستماع لتغييرات المصادقة
      this.setupAuthListener()
      
      this.isInitialized = true
      logAuth('✅ تم تهيئة نظام المصادقة بنجاح')
    } catch (error) {
      logError('❌ فشل في تهيئة نظام المصادقة:', error)
      throw error
    }
  }

  // تسجيل الدخول الآمن
  async signIn(email: string, password: string): Promise<LoginResult> {
    try {
      logAuth('🔐 بدء عملية تسجيل الدخول...', { email: this.maskEmail(email) })

      // التحقق من صحة البيانات
      const emailValidation = SecurityValidator.validateEmail(email)
      if (!emailValidation.isValid) {
        logSecurity('🚨 محاولة تسجيل دخول ببريد إلكتروني غير صحيح', { email })
        return { success: false, error: emailValidation.error }
      }

      const passwordValidation = SecurityValidator.validatePassword(password)
      if (!passwordValidation.isValid) {
        logSecurity('🚨 محاولة تسجيل دخول بكلمة مرور ضعيفة')
        return { success: false, error: passwordValidation.error }
      }

      // التحقق من حالة المستخدم
      const userStatus = await this.checkUserStatus(email)
      if (!userStatus.isActive) {
        logSecurity('🚨 محاولة تسجيل دخول لحساب غير نشط', { email })
        return { 
          success: false, 
          error: 'الحساب غير نشط. يرجى التواصل مع الإدارة'
        }
      }

      // تسجيل محاولة تسجيل الدخول
      await this.logLoginAttempt(email, false)

      // محاولة تسجيل الدخول
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      })

      if (error) {
        logSecurity('🚨 فشل في تسجيل الدخول', { email: this.maskEmail(email), error: error.message })
        
        // تسجيل المحاولة الفاشلة
        await this.logLoginAttempt(email, false, error.message)
        
        // معالجة أنواع الأخطاء المختلفة
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
        }
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'يرجى تأكيد البريد الإلكتروني أولاً', requiresConfirmation: true }
        }
        if (error.message.includes('Too many requests')) {
          return { success: false, error: 'تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً' }
        }
        return { success: false, error: 'حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى' }
      }

      if (!data?.user || !data?.session) {
        logSecurity('🚨 تسجيل الدخول فشل - لا توجد بيانات مستخدم')
        await this.logLoginAttempt(email, false, 'No user data returned')
        return { success: false, error: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى' }
      }

      // جلب معلومات المستخدم
      const user = await this.fetchUserProfile(data.user.id)
      if (!user) {
        logError('❌ فشل في جلب ملف المستخدم')
        await this.signOut()
        return { success: false, error: 'فشل في تحميل بيانات المستخدم' }
      }

      if (!user.is_active) {
        logSecurity('🚨 محاولة تسجيل دخول لحساب غير مفعل', { email: this.maskEmail(email) })
        await this.signOut()
        return { success: false, error: 'الحساب غير مفعل. يرجى التواصل مع المدير' }
      }

      // تسجيل الدخول الناجح
      await this.logLoginAttempt(email, true)
      this.currentUser = user
      
      logAuth('✅ تم تسجيل الدخول بنجاح', { userId: user.id, role: user.role })
      
      return { success: true, user }
    } catch (error: any) {
      logError('❌ خطأ غير متوقع في تسجيل الدخول:', error)
      await this.logLoginAttempt(email, false, 'Unexpected error')
      return { success: false, error: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى' }
    }
  }

  // تسجيل الخروج الآمن
  async signOut(): Promise<void> {
    try {
      logAuth('🚪 بدء عملية تسجيل الخروج...')

      // تسجيل الجلسة النهائية
      if (this.currentUser) {
        await this.logSessionEnd(this.currentUser.id)
      }

      // تسجيل الخروج من Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
        logError('❌ خطأ في تسجيل الخروج من Supabase:', error)
      }

      // تنظيف البيانات المحلية
      this.currentUser = null
      this.clearLocalData()

      // إيقاف مراقبة الجلسة
      this.stopSessionMonitoring()

      logAuth('✅ تم تسجيل الخروج بنجاح')
    } catch (error) {
      logError('❌ خطأ في تسجيل الخروج:', error)
      // حتى لو حدث خطأ، نستمر في تسجيل الخروج محلياً
      this.currentUser = null
      this.clearLocalData()
    }
  }

  // التحقق من الجلسة الحالية
  async checkCurrentSession(): Promise<SessionInfo> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        logDebug('🔍 لا توجد جلسة صالحة')
        return { isValid: false }
      }

      const user = await this.fetchUserProfile(session.user.id)
      if (!user || !user.is_active) {
        logDebug('🔍 المستخدم غير موجود أو غير مفعل')
        return { isValid: false }
      }

      this.currentUser = user
      
      // حساب الوقت المتبقي
      const expiresAt = new Date(session.expires_at! * 1000)
      const timeRemaining = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000 / 60))

      return {
        isValid: true,
        user,
        expiresAt: expiresAt.toISOString(),
        timeRemaining
      }
    } catch (error) {
      logError('❌ خطأ في التحقق من الجلسة:', error)
      return { isValid: false }
    }
  }

  // تجديد الجلسة
  async refreshSession(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error || !data.session) {
        logError('❌ فشل في تجديد الجلسة:', error)
        return false
      }

      logAuth('✅ تم تجديد الجلسة بنجاح')
      return true
    } catch (error) {
      logError('❌ خطأ في تجديد الجلسة:', error)
      return false
    }
  }

  // جلب ملف المستخدم
  private async fetchUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        logError('❌ خطأ في جلب ملف المستخدم:', error)
        return null
      }

      return data as AuthUser
    } catch (error) {
      logError('❌ خطأ غير متوقع في جلب ملف المستخدم:', error)
      return null
    }
  }

  // التحقق من حالة المستخدم
  private async checkUserStatus(email: string): Promise<{
    isActive: boolean
  }> {
    try {
      const { data, error } = await supabase
        .rpc('check_user_status', { p_email: email })

      if (error || !data || data.length === 0) {
        return { isActive: false }
      }

      const status = data[0]
      return {
        isActive: status.is_active
      }
    } catch (error) {
      logError('❌ خطأ في التحقق من حالة المستخدم:', error)
      return { isActive: false }
    }
  }

  // تسجيل محاولات تسجيل الدخول
  private async logLoginAttempt(
    email: string, 
    success: boolean, 
    failureReason?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .rpc('log_login_attempt', {
          p_email: email,
          p_ip_address: null, // يمكن إضافة IP address
          p_user_agent: navigator.userAgent,
          p_success: success,
          p_failure_reason: failureReason
        })

      if (error) {
        logError('❌ خطأ في تسجيل محاولة تسجيل الدخول:', error)
      }
    } catch (error) {
      logError('❌ خطأ غير متوقع في تسجيل محاولة تسجيل الدخول:', error)
    }
  }

  // تسجيل انتهاء الجلسة
  private async logSessionEnd(userId: string): Promise<void> {
    try {
      // يمكن إضافة تسجيل انتهاء الجلسة هنا
      logDebug('📝 تم تسجيل انتهاء الجلسة للمستخدم:', userId)
    } catch (error) {
      logError('❌ خطأ في تسجيل انتهاء الجلسة:', error)
    }
  }

  // بدء مراقبة الجلسة
  private startSessionMonitoring(): void {
    this.sessionCheckInterval = setInterval(async () => {
      const sessionInfo = await this.checkCurrentSession()
      
      if (!sessionInfo.isValid) {
        logAuth('🔄 الجلسة غير صالحة، تسجيل خروج تلقائي')
        await this.signOut()
        return
      }

      // تجديد الجلسة قبل انتهائها بـ 10 دقائق
      if (sessionInfo.timeRemaining && sessionInfo.timeRemaining <= SECURITY_CONFIG.REFRESH_THRESHOLD_MINUTES) {
        logAuth('🔄 تجديد الجلسة قبل انتهائها...')
        const refreshed = await this.refreshSession()
        if (!refreshed) {
          logAuth('❌ فشل في تجديد الجلسة، تسجيل خروج تلقائي')
          await this.signOut()
        }
      }
    }, 60000) // فحص كل دقيقة
  }

  // إيقاف مراقبة الجلسة
  private stopSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval)
      this.sessionCheckInterval = null
    }
  }

  // إعداد مستمع تغييرات المصادقة
  private setupAuthListener(): void {
    supabase.auth.onAuthStateChange(async (event, session) => {
      logAuth('🔄 تغيير في حالة المصادقة:', { event })

      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            const user = await this.fetchUserProfile(session.user.id)
            if (user) {
              this.currentUser = user
              logAuth('✅ تم تسجيل الدخول:', { userId: user.id })
            }
          }
          break

        case 'SIGNED_OUT':
          this.currentUser = null
          this.clearLocalData()
          logAuth('✅ تم تسجيل الخروج')
          break

        case 'TOKEN_REFRESHED':
          logAuth('🔄 تم تجديد الرمز المميز')
          break

        case 'PASSWORD_RECOVERY':
          logAuth('🔄 طلب استرداد كلمة المرور')
          break
      }
    })
  }

  // تنظيف البيانات المحلية
  private clearLocalData(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sb-warranty-session')
        sessionStorage.clear()
      }
    } catch (error) {
      logError('❌ خطأ في تنظيف البيانات المحلية:', error)
    }
  }

  // إخفاء البريد الإلكتروني
  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@')
    if (localPart.length <= 2) return email
    return `${localPart[0]}***@${domain}`
  }

  // Getters
  getCurrentUser(): AuthUser | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentUser.is_active
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin' && this.currentUser?.is_active === true
  }

  getUserRole(): string {
    return this.currentUser?.role || 'user'
  }

  // تنظيف الموارد
  destroy(): void {
    this.stopSessionMonitoring()
    this.currentUser = null
    this.isInitialized = false
  }
}

// تصدير instance واحد
export const secureAuth = SecureAuthManager.getInstance()

// تصدير الأنواع
export type { AuthUser, LoginResult, SessionInfo }
