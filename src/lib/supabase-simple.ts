import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 🔍 اختبار متغيرات البيئة في supabase-simple
console.log('🔍 [Supabase Simple] URL:', supabaseUrl)
console.log('🔍 [Supabase Simple] Key:', supabaseKey)
console.log('🔍 [Supabase Simple] URL exists:', !!supabaseUrl)
console.log('🔍 [Supabase Simple] Key exists:', !!supabaseKey)

// التحقق من وجود المتغيرات قبل إنشاء العميل
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ [Supabase Simple] متغيرات البيئة مفقودة!')
  throw new Error('متغيرات البيئة مفقودة - تحقق من إعدادات Vercel')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})
