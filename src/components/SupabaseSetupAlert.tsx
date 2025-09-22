import { AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SupabaseSetupAlert() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const isDefaultUrl = supabaseUrl === 'https://your-project-id.supabase.co' || supabaseUrl === 'https://your-project-ref.supabase.co'
  const hasValidConfig = supabaseUrl && supabaseKey && !isDefaultUrl

  if (hasValidConfig) {
    return null // لا تظهر التنبيه إذا كانت المفاتيح صحيحة
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
          <CardTitle className="text-orange-800">إعداد قاعدة البيانات مطلوب</CardTitle>
        </div>
        <CardDescription className="text-orange-700">
          التطبيق لا يستطيع الاتصال بقاعدة البيانات. يرجى إعداد Supabase أولاً.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-gray-800 mb-3">خطوات الإعداد:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>
              <strong>اذهب إلى:</strong>{' '}
              <a 
                href="https://supabase.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center"
                style={{color: '#0033cc'}}
              >
                https://supabase.com
                <ExternalLink className="h-3 w-3 mr-1" />
              </a>
            </li>
            <li><strong>أنشئ مشروع جديد</strong> وانتظر حتى ينتهي الإنشاء</li>
            <li><strong>اذهب إلى:</strong> Settings → API</li>
            <li><strong>انسخ المفاتيح:</strong> Project URL و anon public key</li>
            <li><strong>حدث ملف .env.local</strong> بالمفاتيح الصحيحة</li>
            <li><strong>أعد تشغيل التطبيق</strong></li>
          </ol>
        </div>

        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-gray-800 mb-3">مثال على ملف .env.local:</h4>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">VITE_SUPABASE_URL=https://xxxxx.supabase.co</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard('VITE_SUPABASE_URL=https://xxxxx.supabase.co')}
                className="h-6 px-2"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...')}
                className="h-6 px-2"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-gray-800 mb-3">بعد إعداد المفاتيح:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li><strong>اذهب إلى:</strong> SQL Editor في Supabase</li>
            <li><strong>انسخ محتوى:</strong> database-setup-arabic.sql</li>
            <li><strong>نفذ السكريبت</strong> لإنشاء الجداول</li>
            <li><strong>اختبر الاتصال:</strong> /test-database</li>
          </ol>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => window.open('https://supabase.com', '_blank')}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            اذهب إلى Supabase
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

