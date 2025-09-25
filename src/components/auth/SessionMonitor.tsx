import React, { useState, useEffect } from 'react'
import { useSecureAuth } from '@/contexts/SecureAuthContext'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  User,
  Shield,
  Activity
} from 'lucide-react'

interface SessionMonitorProps {
  showDetails?: boolean
  autoRefresh?: boolean
  refreshInterval?: number // بالثواني
}

export function SessionMonitor({ 
  showDetails = true, 
  autoRefresh = true,
  refreshInterval = 30 
}: SessionMonitorProps) {
  const { sessionInfo, refreshSession, checkSession, user } = useSecureAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date>(new Date())
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  // تحديث الوقت المتبقي
  useEffect(() => {
    if (!sessionInfo?.timeRemaining) {
      setTimeRemaining(0)
      return
    }

    setTimeRemaining(sessionInfo.timeRemaining)

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1
        if (newTime <= 0) {
          clearInterval(interval)
          return 0
        }
        return newTime
      })
    }, 60000) // تحديث كل دقيقة

    return () => clearInterval(interval)
  }, [sessionInfo?.timeRemaining])

  // التحقق التلقائي من الجلسة
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(async () => {
      try {
        await checkSession()
        setLastChecked(new Date())
      } catch (error) {
        console.error('خطأ في التحقق من الجلسة:', error)
      }
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, checkSession])

  // تجديد الجلسة يدوياً
  const handleRefreshSession = async () => {
    try {
      setIsRefreshing(true)
      const success = await refreshSession()
      
      if (success) {
        setLastChecked(new Date())
        // إعادة التحقق من الجلسة
        await checkSession()
      }
    } catch (error) {
      console.error('خطأ في تجديد الجلسة:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // تنسيق الوقت
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} دقيقة`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours} ساعة ${remainingMinutes} دقيقة`
  }

  // تحديد حالة الجلسة
  const getSessionStatus = () => {
    if (!sessionInfo?.isValid) {
      return {
        status: 'invalid',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertTriangle,
        message: 'الجلسة غير صالحة'
      }
    }

    if (timeRemaining <= 5) {
      return {
        status: 'critical',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertTriangle,
        message: 'الجلسة تنتهي قريباً!'
      }
    }

    if (timeRemaining <= 15) {
      return {
        status: 'warning',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: Clock,
        message: 'الجلسة تنتهي قريباً'
      }
    }

    return {
      status: 'healthy',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      message: 'الجلسة صالحة'
    }
  }

  const sessionStatus = getSessionStatus()
  const StatusIcon = sessionStatus.icon

  // إذا لم تكن هناك جلسة، لا نعرض المكون
  if (!sessionInfo?.isValid && !user) {
    return null
  }

  return (
    <div className={`rounded-lg border-2 ${sessionStatus.borderColor} ${sessionStatus.bgColor} p-4`}>
      {/* رأس المراقب */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-5 h-5 ${sessionStatus.color}`} />
          <h3 className={`font-semibold ${sessionStatus.color}`}>
            مراقبة الجلسة
          </h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefreshSession}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-xs">تحديث</span>
        </Button>
      </div>

      {/* حالة الجلسة */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">الحالة:</span>
          <span className={`text-sm font-medium ${sessionStatus.color}`}>
            {sessionStatus.message}
          </span>
        </div>

        {timeRemaining > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">الوقت المتبقي:</span>
            <span className={`text-sm font-medium ${sessionStatus.color}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}

        {sessionInfo?.expiresAt && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">انتهاء الصلاحية:</span>
            <span className="text-sm text-gray-800">
              {new Date(sessionInfo.expiresAt).toLocaleTimeString('ar-SA')}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">آخر تحديث:</span>
          <span className="text-sm text-gray-800">
            {lastChecked.toLocaleTimeString('ar-SA')}
          </span>
        </div>
      </div>

      {/* تفاصيل إضافية */}
      {showDetails && user && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">المستخدم:</span>
              <span className="text-sm font-medium text-gray-800">
                {user.full_name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">الدور:</span>
              <span className={`text-sm font-medium ${user.role === 'admin' ? 'text-blue-600' : 'text-green-600'}`}>
                {user.role === 'admin' ? 'مدير' : 'مستخدم'}
              </span>
            </div>

            {user.last_login_at && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">آخر دخول:</span>
                <span className="text-sm text-gray-800">
                  {new Date(user.last_login_at).toLocaleDateString('ar-SA')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* تحذير انتهاء الجلسة */}
      {timeRemaining <= 5 && timeRemaining > 0 && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                تحذير: الجلسة تنتهي قريباً!
              </p>
              <p className="text-xs text-red-600">
                يرجى حفظ عملك وتجديد الجلسة أو تسجيل الخروج
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleRefreshSession}
              disabled={isRefreshing}
              className="bg-red-600 hover:bg-red-700"
            >
              تجديد الجلسة
            </Button>
          </div>
        </div>
      )}

      {/* مؤشر النشاط */}
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <Activity className="w-3 h-3" />
        <span>مراقبة نشطة</span>
        {autoRefresh && (
          <span>• تحديث كل {refreshInterval} ثانية</span>
        )}
      </div>
    </div>
  )
}

// مكون مبسط لمراقبة الجلسة
export function SimpleSessionMonitor() {
  return (
    <SessionMonitor 
      showDetails={false} 
      autoRefresh={true}
      refreshInterval={60}
    />
  )
}

// مكون مفصل لمراقبة الجلسة
export function DetailedSessionMonitor() {
  return (
    <SessionMonitor 
      showDetails={true} 
      autoRefresh={true}
      refreshInterval={30}
    />
  )
}

export default SessionMonitor
