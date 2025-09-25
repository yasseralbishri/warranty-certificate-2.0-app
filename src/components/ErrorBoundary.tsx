import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { logError } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details using our logger
    logError('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Here you would typically send the error to a logging service
      logError('Production error:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                حدث خطأ غير متوقع
              </CardTitle>
              <CardDescription className="text-gray-600">
                نعتذر، حدث خطأ غير متوقع في التطبيق. يرجى المحاولة لاحقًا.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-100 p-3 rounded-md">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">تفاصيل الخطأ (وضع التطوير):</h4>
                  <p className="text-xs text-red-600 font-mono break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-600 cursor-pointer">
                        عرض Stack Trace
                      </summary>
                      <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  إعادة المحاولة
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  className="w-full"
                  variant="outline"
                >
                  <Home className="h-4 w-4 mr-2" />
                  العودة للصفحة الرئيسية
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  إذا استمر الخطأ، يرجى الاتصال بفريق الدعم الفني
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
