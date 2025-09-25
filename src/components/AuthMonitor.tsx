import React, { useEffect } from 'react'
import { useSecureAuth } from '@/contexts/SecureAuthContext'
import { useToast } from '@/components/ui/use-toast'

export function AuthMonitor() {
  const { user, loading, isAuthenticated } = useSecureAuth()
  const { toast } = useToast()

  useEffect(() => {
    // مراقبة تغييرات حالة المصادقة
    if (!loading) {
      if (isAuthenticated && user) {
        console.log('✅ [AuthMonitor] المستخدم مسجل:', user.full_name)
      } else {
        console.log('🚫 [AuthMonitor] المستخدم غير مسجل')
      }
    }
  }, [user, loading, isAuthenticated])

  // مراقبة انتهاء الجلسة
  useEffect(() => {
    const checkSessionExpiry = () => {
      if (typeof window !== 'undefined') {
        const sessionData = localStorage.getItem('sb-warranty-session')
        if (sessionData) {
          try {
            const session = JSON.parse(sessionData)
            if (session.expires_at) {
              const expiryTime = new Date(session.expires_at).getTime()
              const currentTime = new Date().getTime()
              const timeUntilExpiry = expiryTime - currentTime
              
              // تحذير قبل انتهاء الجلسة بـ 5 دقائق
              if (timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60 * 1000) {
                toast({
                  title: "تحذير: جلسة المصادقة ستنتهي قريباً",
                  description: "يرجى حفظ عملك وتسجيل الدخول مرة أخرى إذا لزم الأمر.",
                  variant: "warning",
                })
              }
            }
          } catch (error) {
            console.error('خطأ في فحص انتهاء الجلسة:', error)
          }
        }
      }
    }

    // فحص كل دقيقة
    const interval = setInterval(checkSessionExpiry, 60000)
    
    return () => clearInterval(interval)
  }, [toast])

  return null // هذا المكون لا يعرض أي شيء، فقط يراقب
}
