import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSecureAuth } from '@/contexts/SecureAuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlSweedLogo } from '@/components/AlSweedLogo'
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  CheckCircle, 
  Lock,
  Shield,
  User
} from 'lucide-react'

interface SecureLoginFormProps {
  onSuccess?: () => void
}

export function SecureLoginForm({ onSuccess }: SecureLoginFormProps) {
  const { signIn, isAuthenticated } = useSecureAuth()
  const navigate = useNavigate()
  
  // حالة النموذج
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    password?: string
  }>({})

  // التوجيه التلقائي عند نجاح تسجيل الدخول
  useEffect(() => {
    if (isAuthenticated) {
      setSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه...')
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          navigate('/', { replace: true })
        }
      }, 1500)
    }
  }, [isAuthenticated, navigate, onSuccess])

  // إعادة تعيين الرسائل عند تغيير المدخلات
  useEffect(() => {
    if (error) setError('')
    if (success) setSuccess('')
    if (Object.keys(validationErrors).length > 0) setValidationErrors({})
  }, [email, password])

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}

    // التحقق من البريد الإلكتروني
    if (!email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب'
    } else if (!email.includes('@')) {
      errors.email = 'تنسيق البريد الإلكتروني غير صحيح'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        errors.email = 'تنسيق البريد الإلكتروني غير صحيح'
      }
    }

    // التحقق من كلمة المرور
    if (!password.trim()) {
      errors.password = 'كلمة المرور مطلوبة'
    } else if (password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // معالجة إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    setValidationErrors({})

    // التحقق من صحة البيانات
    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const result = await signIn(email.trim(), password.trim())
      
      if (result.success) {
        setSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه...')
        setEmail('')
        setPassword('')
        // سيتم التوجيه تلقائياً من خلال useEffect
      } else {
        setError(result.error || 'حدث خطأ في تسجيل الدخول')
        
        // معالجة حالات خاصة
        if (result.requiresConfirmation) {
          setError('يرجى تأكيد البريد الإلكتروني أولاً. تحقق من صندوق الوارد')
        }
      }
    } catch (error: any) {
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى')
      console.error('خطأ في تسجيل الدخول:', error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <AlSweedLogo size="lg" showText={false} />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            تسجيل الدخول الآمن
          </CardTitle>
          <p className="text-gray-600 mt-2">
            أدخل بياناتك للوصول إلى نظام إدارة شهادات الضمان
          </p>
        </CardHeader>
        
        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* رسالة الخطأ */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-medium">{error}</span>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-red-500 hover:text-red-700 ml-2"
                  type="button"
                >
                  ×
                </button>
              </div>
            )}

            {/* رسالة النجاح */}
            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-medium">{success}</span>
                </div>
                <button
                  onClick={() => setSuccess('')}
                  className="text-green-500 hover:text-green-700 ml-2"
                  type="button"
                >
                  ×
                </button>
              </div>
            )}

            {/* حقل البريد الإلكتروني */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                البريد الإلكتروني *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                required
                className={`h-12 text-base ${validationErrors.email ? 'border-red-500' : ''}`}
                dir="ltr"
                disabled={loading}
                autoComplete="email"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm">{validationErrors.email}</p>
              )}
            </div>

            {/* حقل كلمة المرور */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                كلمة المرور *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  required
                  className={`h-12 text-base pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-sm">{validationErrors.password}</p>
              )}
            </div>

            {/* زر تسجيل الدخول */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول الآمن
                </div>
              )}
            </Button>
          </form>

          {/* معلومات أمنية */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">حماية أمنية</span>
            </div>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• جميع البيانات مشفرة أثناء النقل</li>
              <li>• مراقبة محاولات تسجيل الدخول</li>
              <li>• جلسات آمنة مع انتهاء صلاحية</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              للحصول على حساب، يرجى التواصل مع المدير
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SecureLoginForm
