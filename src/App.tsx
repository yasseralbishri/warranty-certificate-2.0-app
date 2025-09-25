import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SecureAuthProvider, AuthGuard } from '@/contexts/SecureAuthContext'
import { LoginPage } from '@/components/auth/LoginPage'
import { Layout } from '@/components/Layout'
import ErrorBoundary from '@/components/ErrorBoundary'

// إنشاء QueryClient مع إعدادات مناسبة
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SecureAuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              } />
            </Routes>
          </Router>
        </SecureAuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App