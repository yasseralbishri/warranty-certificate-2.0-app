#!/usr/bin/env node

// اختبار سريع لمتغيرات البيئة
console.log('🔍 اختبار متغيرات البيئة...\n')

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
]

let allGood = true

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 30)}...`)
  } else {
    console.log(`❌ ${varName}: غير معرف`)
    allGood = false
  }
})

console.log('\n' + '='.repeat(50))

if (allGood) {
  console.log('✅ جميع متغيرات البيئة موجودة!')
  process.exit(0)
} else {
  console.log('❌ بعض متغيرات البيئة مفقودة!')
  console.log('\nلإصلاح المشكلة:')
  console.log('1. في Vercel: Settings → Environment Variables')
  console.log('2. أضف المتغيرات المطلوبة')
  console.log('3. أعد النشر')
  process.exit(1)
}
