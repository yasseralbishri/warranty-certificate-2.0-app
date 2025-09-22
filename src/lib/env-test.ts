// 🔍 ملف اختبار متغيرات البيئة
// يمكن استيراد هذا الملف في أي مكان لاختبار المتغيرات

export const testEnvironmentVariables = () => {
  console.log('🔍 [Environment Test] ===== بدء اختبار متغيرات البيئة =====')
  
  // اختبار متغيرات Supabase
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  console.log('🔍 [Environment Test] Supabase URL:', supabaseUrl)
  console.log('🔍 [Environment Test] Supabase Key:', supabaseKey)
  console.log('🔍 [Environment Test] URL exists:', !!supabaseUrl)
  console.log('🔍 [Environment Test] Key exists:', !!supabaseKey)
  
  // اختبار البيئة
  console.log('🔍 [Environment Test] Environment Mode:', import.meta.env.MODE)
  console.log('🔍 [Environment Test] Is Development:', import.meta.env.DEV)
  console.log('🔍 [Environment Test] Is Production:', import.meta.env.PROD)
  
  // اختبار جميع متغيرات البيئة
  console.log('🔍 [Environment Test] All environment variables:')
  Object.keys(import.meta.env).forEach(key => {
    if (key.startsWith('VITE_')) {
      console.log(`  ${key}:`, import.meta.env[key])
    }
  })
  
  // التحقق من صحة القيم
  const isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co')
  const isValidKey = supabaseKey && (supabaseKey.startsWith('eyJ') || supabaseKey.startsWith('sb_'))
  
  console.log('🔍 [Environment Test] URL is valid:', isValidUrl)
  console.log('🔍 [Environment Test] Key is valid:', isValidKey)
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ [Environment Test] متغيرات البيئة مفقودة!')
    return false
  }
  
  if (!isValidUrl || !isValidKey) {
    console.error('❌ [Environment Test] تنسيق متغيرات البيئة غير صحيح!')
    return false
  }
  
  console.log('✅ [Environment Test] جميع متغيرات البيئة صحيحة!')
  console.log('🔍 [Environment Test] ===== انتهاء اختبار متغيرات البيئة =====')
  
  return true
}

// تشغيل الاختبار تلقائياً عند استيراد الملف
testEnvironmentVariables()
