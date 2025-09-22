// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logs to verify values at runtime
console.log('🔧 [Supabase] إعداد Supabase Client...')
console.log('🔧 [Supabase] URL:', supabaseUrl)
console.log('🔧 [Supabase] Key:', supabaseAnonKey)
console.log('🔧 [Supabase] Session Storage:', typeof window !== 'undefined' ? 'localStorage متاح' : 'localStorage غير متاح')

// Better error handling for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = []
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL')
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY')
  
  const errorMessage = `متغيرات البيئة المطلوبة مفقودة: ${missingVars.join(', ')}. يرجى التحقق من ملف .env أو إعدادات Vercel.`
  console.error('❌ [Supabase]', errorMessage)
  throw new Error(errorMessage)
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  const errorMessage = 'تنسيق URL لـ Supabase غير صحيح. يجب أن يبدأ بـ https:// وينتهي بـ .supabase.co'
  console.error('❌ [Supabase]', errorMessage)
  throw new Error(errorMessage)
}

// Validate key format
if (!supabaseAnonKey.startsWith('eyJ') && !supabaseAnonKey.startsWith('sb_')) {
  const errorMessage = 'تنسيق مفتاح Supabase غير صحيح. يجب أن يبدأ بـ eyJ أو sb_'
  console.error('❌ [Supabase]', errorMessage)
  throw new Error(errorMessage)
}

export { supabaseUrl, supabaseAnonKey }
