import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'

interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className = '' }: ConnectionStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    
    const checkSupabaseConnection = async () => {
      if (!isOnline) {
        setSupabaseConnected(false)
        return
      }

      setChecking(true)
      try {
        // Try to get the current session as a simple connection test
        await supabase.auth.getSession()
        setSupabaseConnected(true)
      } catch (error) {
        console.error('Supabase connection check failed:', error)
        setSupabaseConnected(false)
      } finally {
        setChecking(false)
      }
    }

    // Initial check
    checkSupabaseConnection()
    
    // Check connection every 30 seconds
    intervalId = setInterval(checkSupabaseConnection, 30000)
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isOnline])

  if (isOnline && supabaseConnected === true) {
    return null // Don't show anything when everything is working
  }

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />
    if (checking) return <AlertCircle className="w-4 h-4 animate-pulse" />
    if (supabaseConnected === false) return <WifiOff className="w-4 h-4" />
    return <Wifi className="w-4 h-4" />
  }

  const getStatusText = () => {
    if (!isOnline) return 'لا يوجد اتصال بالإنترنت'
    if (checking) return 'جاري فحص الاتصال...'
    if (supabaseConnected === false) return 'مشكلة في الاتصال بقاعدة البيانات'
    return 'متصل'
  }

  const getStatusColor = () => {
    if (!isOnline || supabaseConnected === false) return 'text-red-600'
    if (checking) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm ${className}`}>
      {getStatusIcon()}
      <span className={getStatusColor()}>{getStatusText()}</span>
    </div>
  )
}
