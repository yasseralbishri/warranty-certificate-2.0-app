import { ReactNode, memo, useCallback } from 'react'
import { AlSweedLogo } from './AlSweedLogo'
import { ConnectionStatus } from './ConnectionStatus'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './ui/button'
import { LogOut, User, Shield, Settings } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

interface LayoutProps {
  children: ReactNode
}

export const Layout = memo(function Layout({ children }: LayoutProps) {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = useCallback(async () => {
    await signOut()
  }, [signOut])

  const handleLogoClick = useCallback(() => {
    // If we're in admin panel, navigate to home page
    if (location.pathname === ROUTES.ADMIN) {
      navigate(ROUTES.HOME)
    } else {
      // If we're in dashboard, trigger the warranty form navigation
      if (typeof window !== 'undefined' && (window as any).navigateToWarrantyForm) {
        (window as any).navigateToWarrantyForm()
      }
    }
  }, [navigate, location.pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24 py-2">
            {/* Logo - positioned on the right (RTL) */}
            <div className="flex items-center">
              <AlSweedLogo 
                size="md" 
                showText={false}
                className="h-28" 
                onClick={handleLogoClick}
              />
            </div>

            {/* User Info & Actions - positioned on the left (RTL) */}
            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <ConnectionStatus />
              
              {/* User Info */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <Shield className="w-5 h-5 text-red-600" />
                  ) : (
                    <User className="w-5 h-5 text-blue-600" />
                  )}
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{user?.full_name}</p>
                    <p className="text-xs text-gray-500">
                      {isAdmin ? 'مدير' : 'مستخدم'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Panel Link */}
              {isAdmin && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    لوحة الإدارة
                  </Button>
                </Link>
              )}

              {/* Sign Out Button */}
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
})