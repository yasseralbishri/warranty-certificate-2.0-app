import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthPage } from './AuthPage'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth()

  // Add a timeout fallback for loading state
  React.useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        // Loading timeout reached
      }, 5000)
      return () => clearTimeout(timeout)
    }
    return undefined
  }, [loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg animate-pulse">جاري التحميل...</p>
          <p className="text-gray-500 text-sm mt-2">يرجى الانتظار...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthPage />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 text-6xl mb-4">🚫</div>
            <h2 className="text-xl font-bold text-red-800 mb-2">غير مصرح لك بالوصول</h2>
            <p className="text-red-700 mb-4">
              هذه الصفحة مخصصة للمديرين فقط. يرجى التواصل مع المدير للحصول على الصلاحيات المطلوبة.
            </p>
            <div className="text-sm text-gray-600">
              <p>المستخدم الحالي: <strong>{user?.full_name}</strong></p>
              <p>الدور: <strong>{user?.role === 'admin' ? 'مدير' : 'مستخدم'}</strong></p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
