import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/Layout'
import ErrorBoundary from '@/components/ErrorBoundary'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ConnectionMonitor } from '@/components/ConnectionMonitor'
import { APP_CONFIG, ROUTES } from '@/lib/constants'

// 🔍 اختبار متغيرات البيئة - يمكن حذفها بعد التأكد
import '@/lib/vercel-debug'

// Lazy load components for better performance
const Dashboard = lazy(() => import('@/components/Dashboard'))
const AdminPanel = lazy(() => import('@/components/admin/AdminPanel'))

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONFIG.QUERY_STALE_TIME,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Loading component to avoid repetition
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
    <div className="text-lg animate-pulse">جاري التحميل...</div>
  </div>
)

function AppContent() {
  console.log('🔄 [AppContent] بدء تحميل محتوى التطبيق...')
  
  return (
    <div dir="rtl">
      <Router>
        <Routes>
          {/* Protected Routes */}
          <Route 
            path={ROUTES.HOME} 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Dashboard />
                    </Suspense>
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.WARRANTIES} 
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Dashboard />
                    </Suspense>
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.ADMIN} 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminPanel />
                    </Suspense>
                  </ErrorBoundary>
                </Layout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  )
}

function App() {
  console.log('🔄 [App] بدء تحميل التطبيق الرئيسي...')
  
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionMonitor>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ConnectionMonitor>
    </QueryClientProvider>
  )
}

export default App
