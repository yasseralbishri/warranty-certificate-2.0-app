// 🔍 تشخيص محسن لـ Vercel
console.log('🔍 [Vercel Debug] ===== بدء التشخيص =====')

// اختبار متغيرات البيئة
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 [Vercel Debug] Environment Mode:', import.meta.env.MODE)
console.log('🔍 [Vercel Debug] Is Production:', import.meta.env.PROD)
console.log('🔍 [Vercel Debug] Is Development:', import.meta.env.DEV)

console.log('🔍 [Vercel Debug] Supabase URL:', supabaseUrl)
console.log('🔍 [Vercel Debug] Supabase Key:', supabaseKey)
console.log('🔍 [Vercel Debug] URL type:', typeof supabaseUrl)
console.log('🔍 [Vercel Debug] Key type:', typeof supabaseKey)
console.log('🔍 [Vercel Debug] URL length:', supabaseUrl?.length || 0)
console.log('🔍 [Vercel Debug] Key length:', supabaseKey?.length || 0)

// اختبار جميع متغيرات البيئة
console.log('🔍 [Vercel Debug] All environment variables:')
Object.keys(import.meta.env).forEach(key => {
  if (key.startsWith('VITE_')) {
    const value = import.meta.env[key]
    console.log(`  ${key}:`, value ? `${value.substring(0, 20)}...` : 'undefined')
  }
})

// التحقق من صحة القيم
const isValidUrl = supabaseUrl && typeof supabaseUrl === 'string' && supabaseUrl.startsWith('https://')
const isValidKey = supabaseKey && typeof supabaseKey === 'string' && (supabaseKey.startsWith('eyJ') || supabaseKey.startsWith('sb_'))

console.log('🔍 [Vercel Debug] URL is valid:', isValidUrl)
console.log('🔍 [Vercel Debug] Key is valid:', isValidKey)

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ [Vercel Debug] متغيرات البيئة مفقودة!')
  console.error('❌ [Vercel Debug] يرجى إضافة متغيرات البيئة في Vercel:')
  console.error('❌ [Vercel Debug] VITE_SUPABASE_URL')
  console.error('❌ [Vercel Debug] VITE_SUPABASE_ANON_KEY')
} else if (!isValidUrl || !isValidKey) {
  console.error('❌ [Vercel Debug] تنسيق متغيرات البيئة غير صحيح!')
} else {
  console.log('✅ [Vercel Debug] جميع متغيرات البيئة صحيحة!')
}

console.log('🔍 [Vercel Debug] ===== انتهاء التشخيص =====')
