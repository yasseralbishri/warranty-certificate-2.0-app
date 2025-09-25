import React, { useState, useEffect } from 'react'
import { useSecureAuth } from '@/contexts/SecureAuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function AuthDebugger() {
  const { user, loading, isAuthenticated } = useSecureAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [localStorageInfo, setLocalStorageInfo] = useState<any>(null)

  useEffect(() => {
    const updateSessionInfo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSessionInfo(session)
        
        if (typeof window !== 'undefined') {
          const storedSession = localStorage.getItem('sb-warranty-session')
          setLocalStorageInfo(storedSession ? JSON.parse(storedSession) : null)
        }
      } catch (error) {
        console.error('خطأ في جلب معلومات الجلسة:', error)
      }
    }

    updateSessionInfo()
    
    // تحديث كل 5 ثوان
    const interval = setInterval(updateSessionInfo, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const handleClearSession = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem('sb-warranty-session')
      setSessionInfo(null)
      setLocalStorageInfo(null)
    } catch (error) {
      console.error('خطأ في مسح الجلسة:', error)
    }
  }

  // إظهار المكون فقط في وضع التطوير
  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <Card className="fixed bottom-4 left-4 w-96 max-h-96 overflow-auto bg-yellow-50 border-yellow-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-yellow-800">🔍 Auth Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div>
          <strong>User:</strong> {user ? user.full_name : 'غير مسجل'}
        </div>
        <div>
          <strong>Loading:</strong> 
          <Badge variant={loading ? 'destructive' : 'success'} className="ml-1">
            {loading ? 'نعم' : 'لا'}
          </Badge>
        </div>
        <div>
          <strong>Authenticated:</strong>
          <Badge variant={isAuthenticated ? 'success' : 'destructive'} className="ml-1">
            {isAuthenticated ? 'نعم' : 'لا'}
          </Badge>
        </div>
        <div>
          <strong>Session:</strong> {sessionInfo ? 'موجودة' : 'غير موجودة'}
        </div>
        <div>
          <strong>LocalStorage:</strong> {localStorageInfo ? 'موجودة' : 'غير موجودة'}
        </div>
        {sessionInfo && (
          <div>
            <strong>Expires:</strong> {new Date(sessionInfo.expires_at).toLocaleString()}
          </div>
        )}
        <Button 
          onClick={handleClearSession}
          size="sm"
          variant="destructive"
          className="w-full text-xs"
        >
          مسح الجلسة
        </Button>
      </CardContent>
    </Card>
  )
}
