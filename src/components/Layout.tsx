import { ReactNode, memo, useCallback } from 'react'
import { AlSweedLogo } from './AlSweedLogo'
import { ConnectionStatus } from './ConnectionStatus'
import { useSecureAuth } from '@/contexts/SecureAuthContext'
import { SecureLogoutButton } from '@/components/auth/SecureLogoutButton'
import { Button } from './ui/button'
import { User, Shield, Settings, Clock } from 'lucide-react'
import { Link, useNavigate, useLocation, Routes, Route } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import Dashboard from './Dashboard'
import { WarrantyList } from './WarrantyList'
import { WarrantyForm } from './WarrantyForm'

interface LayoutProps {
  children: ReactNode
}

export const Layout = memo(function Layout({ children }: LayoutProps) {
  const { user, isAdmin, sessionInfo } = useSecureAuth()
  const navigate = useNavigate()
  const location = useLocation()

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
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-gray-500">
                        {isAdmin ? 'مدير' : 'مستخدم'}
                      </p>
                      {sessionInfo?.timeRemaining && sessionInfo.timeRemaining <= 15 && (
                        <>
                          <Clock className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600">
                            {sessionInfo.timeRemaining}د
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Panel Link - Only for admins */}
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

              {/* Secure Logout Button */}
              <SecureLogoutButton variant="outline" size="sm" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/warranties" element={<WarrantyList />} />
          <Route path="/form" element={<WarrantyForm />} />
          <Route path="/admin" element={
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">لوحة الإدارة</h1>
              <p className="text-gray-600">صفحة الإدارة قيد التطوير</p>
            </div>
          } />
        </Routes>
        {children}
      </main>
    </div>
  )
})