import React, { useEffect, useState, useCallback } from 'react'
import { checkSupabaseConnection, realtimeManager } from '@/lib/supabase'
import { envConfig } from '@/lib/env-config'

interface ConnectionMonitorProps {
  children: React.ReactNode
}

interface ConnectionState {
  isOnline: boolean
  isConnected: boolean | null
  isChecking: boolean
  lastCheck: Date | null
  error: string | null
  realtimeStatus: {
    isConnected: boolean
    activeSubscriptions: string[]
  }
}

export function ConnectionMonitor({ children }: ConnectionMonitorProps) {
  const [state, setState] = useState<ConnectionState>({
    isOnline: navigator.onLine,
    isConnected: null,
    isChecking: false,
    lastCheck: null,
    error: null,
    realtimeStatus: {
      isConnected: false,
      activeSubscriptions: []
    }
  })

  const checkConnection = useCallback(async () => {
    if (!state.isOnline) return

    setState(prev => ({ ...prev, isChecking: true, error: null }))
    
    try {
      const result = await checkSupabaseConnection()
      const realtimeStatus = realtimeManager.getConnectionStatus()
      
      setState(prev => ({
        ...prev,
        isConnected: result.isConnected,
        lastCheck: new Date(),
        error: result.error || null,
        realtimeStatus,
        isChecking: false
      }))

      if (result.isConnected) {
        console.log('✅ [ConnectionMonitor] Database connection successful')
      } else {
        console.warn('⚠️ [ConnectionMonitor] Database connection failed:', result.error)
      }
    } catch (error: any) {
      console.error('❌ [ConnectionMonitor] Connection check failed:', error)
      setState(prev => ({
        ...prev,
        isConnected: false,
        error: error.message || 'Connection check failed',
        isChecking: false
      }))
    }
  }, [state.isOnline])

  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 [ConnectionMonitor] Network is online')
      setState(prev => ({ ...prev, isOnline: true, error: null }))
      checkConnection()
    }

    const handleOffline = () => {
      console.log('🌐 [ConnectionMonitor] Network is offline')
      setState(prev => ({
        ...prev,
        isOnline: false,
        isConnected: false,
        error: 'فقدان الاتصال بالإنترنت'
      }))
    }

    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Don't check connection if environment is invalid
    if (!envConfig.supabase.isValid) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        error: 'Invalid Supabase configuration',
        isChecking: false
      }))
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }

    // Test connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    
    // Test initial connection
    checkConnection()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [checkConnection])

  // Show connection status if there's an issue
  if (!state.isOnline || state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="text-yellow-600 text-6xl mb-4">
              {!state.isOnline ? '📡' : '⚠️'}
            </div>
            <h2 className="text-xl font-bold text-yellow-800 mb-2">
              {!state.isOnline ? 'فقدان الاتصال' : 'مشكلة في الاتصال'}
            </h2>
            <p className="text-yellow-700 mb-4">
              {!state.isOnline 
                ? 'يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى'
                : state.error
              }
            </p>
            <div className="space-y-2">
              <button
                onClick={checkConnection}
                disabled={state.isChecking}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white font-bold py-2 px-4 rounded w-full"
              >
                {state.isChecking ? 'جاري التحقق...' : 'إعادة المحاولة'}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                إعادة تحميل الصفحة
              </button>
            </div>
            {state.lastCheck && (
              <p className="text-xs text-yellow-600 mt-2">
                آخر فحص: {state.lastCheck.toLocaleTimeString('ar-SA')}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
