import React, { useState } from 'react'
import { useSecureAuth } from '@/contexts/SecureAuthContext'
import { Button } from '@/components/ui/button'
import { 
  LogOut, 
  AlertTriangle, 
  CheckCircle, 
  X,
  User,
  Clock
} from 'lucide-react'

interface SecureLogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'default' | 'lg'
  showConfirmDialog?: boolean
  className?: string
}

export function SecureLogoutButton({ 
  variant = 'outline', 
  size = 'default',
  showConfirmDialog = true,
  className = ''
}: SecureLogoutButtonProps) {
  const { signOut, user, sessionInfo, loading } = useSecureAuth()
  const [showDialog, setShowDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // معالجة تسجيل الخروج
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      setShowDialog(false)
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // عرض زر تسجيل الخروج البسيط
  if (!showConfirmDialog) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleLogout}
        disabled={loading || isLoggingOut}
        className={`flex items-center gap-2 ${className}`}
      >
        {isLoggingOut ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            جاري تسجيل الخروج...
          </>
        ) : (
          <>
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </>
        )}
      </Button>
    )
  }

  return (
    <>
      {/* زر تسجيل الخروج */}
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowDialog(true)}
        disabled={loading}
        className={`flex items-center gap-2 ${className}`}
      >
        <LogOut className="w-4 h-4" />
        تسجيل الخروج
      </Button>

      {/* نافذة التأكيد */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {/* رأس النافذة */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  تأكيد تسجيل الخروج
                </h3>
                <p className="text-sm text-gray-600">
                  هل أنت متأكد من رغبتك في تسجيل الخروج؟
                </p>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="ml-auto text-gray-400 hover:text-gray-600"
                disabled={isLoggingOut}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* معلومات المستخدم */}
            {user && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.full_name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">الدور</p>
                    <p className="text-sm font-medium text-blue-600">
                      {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* معلومات الجلسة */}
            {sessionInfo?.timeRemaining && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    الجلسة تنتهي خلال {sessionInfo.timeRemaining} دقيقة
                  </span>
                </div>
              </div>
            )}

            {/* تحذيرات */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">تنبيه:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• سيتم إنهاء الجلسة الحالية</li>
                    <li>• ستحتاج لتسجيل الدخول مرة أخرى للوصول</li>
                    <li>• أي عمل غير محفوظ سيفقد</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={isLoggingOut}
                className="flex-1"
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 flex items-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري تسجيل الخروج...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                  </>
                )}
              </Button>
            </div>

            {/* رسالة النجاح */}
            {isLoggingOut && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">تم تسجيل الخروج بنجاح</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// مكون مبسط لتسجيل الخروج
export function SimpleLogoutButton({ className = '' }: { className?: string }) {
  return (
    <SecureLogoutButton 
      variant="ghost" 
      size="sm" 
      showConfirmDialog={false}
      className={className}
    />
  )
}

// مكون تسجيل الخروج مع تأكيد
export function ConfirmLogoutButton({ className = '' }: { className?: string }) {
  return (
    <SecureLogoutButton 
      variant="destructive" 
      showConfirmDialog={true}
      className={className}
    />
  )
}

export default SecureLogoutButton
