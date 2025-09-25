import React, { useState } from 'react'
import { useSecureAuth } from '@/contexts/SecureAuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlSweedLogo } from '@/components/AlSweedLogo'
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react'

export function LoginForm() {
  const { signIn } = useSecureAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // التحقق من البيانات
    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني')
      setLoading(false)
      return
    }

    if (!password.trim()) {
      setError('يرجى إدخال كلمة المرور')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صحيح')
      setLoading(false)
      return
    }

    try {
      const result = await signIn(email.trim(), password.trim())
      
      if (result.success) {
        setSuccess('تم تسجيل الدخول بنجاح!')
        // سيتم إعادة التوجيه تلقائياً من خلال AuthContext
      } else {
        setError(result.error || 'حدث خطأ في تسجيل الدخول')
      }
    } catch (error: any) {
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <AlSweedLogo size="lg" showText={false} />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            تسجيل الدخول
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
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                البريد الإلكتروني *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                required
                className="h-12 text-base"
                dir="ltr"
                disabled={loading}
              />
            </div>

            {/* حقل كلمة المرور */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
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
                  className="h-12 text-base pr-10"
                  disabled={loading}
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
            </div>

            {/* زر تسجيل الدخول */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </div>
              )}
            </Button>
          </form>

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