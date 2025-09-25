import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
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

export function LoginPage() {
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

  // التحقق من صحة البيانات
  const validateForm = () => {
    const errors: { email?: string; password?: string } = {}
    
    if (!email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب'
    } else if (!email.includes('@')) {
      errors.email = 'يرجى إدخال بريد إلكتروني صحيح'
    }
    
    if (!password.trim()) {
      errors.password = 'كلمة المرور مطلوبة'
    } else if (password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // تسجيل الدخول
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        let errorMessage = 'حدث خطأ في تسجيل الدخول'
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'يرجى تأكيد البريد الإلكتروني أولاً'
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً'
        }
        
        setError(errorMessage)
        return
      }

      if (data?.user && data?.session) {
        setSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه...')
        
        // التوجيه إلى الصفحة الرئيسية
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 1500)
      }
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error)
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <AlSweedLogo 
            size="lg" 
            showText={true}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">نظام إدارة شهادات الضمان</h1>
          <p className="text-gray-600 mt-2">تسجيل الدخول الآمن</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-xl font-bold text-gray-800">
              <Shield className="w-6 h-6 text-blue-600" />
              تسجيل الدخول الآمن
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className={`pl-10 h-12 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      validationErrors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className={`pl-10 pr-10 h-12 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      validationErrors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    تسجيل الدخول
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© 2024 السويد - نظام إدارة شهادات الضمان</p>
        </div>
      </div>
    </div>
  )
}
