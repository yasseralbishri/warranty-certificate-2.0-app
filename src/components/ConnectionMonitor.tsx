import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ConnectionMonitorProps {
  children: React.ReactNode
}

export function ConnectionMonitor({ children }: ConnectionMonitorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setConnectionError(null)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setConnectionError('فقدان الاتصال بالإنترنت')
    }

    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Test Supabase connection periodically
    const testConnection = async () => {
      try {
        await supabase.from('user_profiles').select('id').limit(1)
        setConnectionError(null)
      } catch (error) {
        console.error('Connection test failed:', error)
        setConnectionError('مشكلة في الاتصال بالخادم')
      }
    }

    // Test connection every 30 seconds
    const interval = setInterval(testConnection, 30000)
    
    // Test initial connection
    testConnection()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  // Show connection status if there's an issue
  if (!isOnline || connectionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="text-yellow-600 text-6xl mb-4">
              {!isOnline ? '📡' : '⚠️'}
            </div>
            <h2 className="text-xl font-bold text-yellow-800 mb-2">
              {!isOnline ? 'فقدان الاتصال' : 'مشكلة في الاتصال'}
            </h2>
            <p className="text-yellow-700 mb-4">
              {!isOnline 
                ? 'يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى'
                : connectionError
              }
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
