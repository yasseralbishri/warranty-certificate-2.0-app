import { createClient } from '@supabase/supabase-js'

// الحصول على متغيرات البيئة مباشرة
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// تشخيص مفصل
console.log('🔍 [Supabase Fixed] URL:', supabaseUrl)
console.log('🔍 [Supabase Fixed] Key:', supabaseAnonKey)
console.log('🔍 [Supabase Fixed] URL exists:', !!supabaseUrl)
console.log('🔍 [Supabase Fixed] Key exists:', !!supabaseAnonKey)

// التحقق من وجود المتغيرات
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [Supabase Fixed] متغيرات البيئة مفقودة!')
  console.error('❌ [Supabase Fixed] URL:', supabaseUrl)
  console.error('❌ [Supabase Fixed] Key:', supabaseAnonKey)
  throw new Error('متغيرات البيئة مفقودة - تحقق من إعدادات Vercel')
}

// إنشاء العميل مع إعدادات مبسطة
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

console.log('✅ [Supabase Fixed] تم إنشاء العميل بنجاح')
