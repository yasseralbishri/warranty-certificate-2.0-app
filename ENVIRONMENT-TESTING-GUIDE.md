# دليل اختبار متغيرات البيئة

## الطريقة الصحيحة لاختبار متغيرات البيئة

### 1. اختبار محلياً

```bash
# تشغيل المشروع محلياً
npm run dev
```

افتح المتصفح واذهب إلى `http://localhost:5173`، ثم افتح Developer Tools (F12) → Console.

ستجد رسائل مثل:
```
🔍 [Environment Test] ===== بدء اختبار متغيرات البيئة =====
🔍 [Environment Test] Supabase URL: https://rmaybqvpwqwymfvthhmd.supabase.co
🔍 [Environment Test] Supabase Key: sb_publishable_iEbN6Lc-3tRTbcx5maMsIA_MzPKv6P5
🔍 [Environment Test] URL exists: true
🔍 [Environment Test] Key exists: true
✅ [Environment Test] جميع متغيرات البيئة صحيحة!
```

### 2. اختبار على Vercel

#### الخطوة 1: إضافة متغيرات البيئة في Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. اختر مشروعك
3. **Settings** → **Environment Variables**
4. أضف:
   - `VITE_SUPABASE_URL` = `https://rmaybqvpwqwymfvthhmd.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_iEbN6Lc-3tRTbcx5maMsIA_MzPKv6P5`
5. اختر جميع البيئات (Production, Preview, Development)
6. اضغط **Save**

#### الخطوة 2: إعادة النشر
```bash
# رفع التغييرات إلى GitHub
git add .
git commit -m "🔍 إضافة اختبار متغيرات البيئة"
git push origin main
```

#### الخطوة 3: التحقق من النتيجة
1. اذهب إلى موقعك المرفوع على Vercel
2. افتح Developer Tools (F12) → Console
3. ستجد نفس الرسائل كما في الاختبار المحلي

### 3. ما يجب أن تراه في Console

#### ✅ إذا كانت المتغيرات صحيحة:
```
🔍 [Environment Test] ===== بدء اختبار متغيرات البيئة =====
🔍 [Environment Test] Supabase URL: https://rmaybqvpwqwymfvthhmd.supabase.co
🔍 [Environment Test] Supabase Key: sb_publishable_iEbN6Lc-3tRTbcx5maMsIA_MzPKv6P5
🔍 [Environment Test] URL exists: true
🔍 [Environment Test] Key exists: true
🔍 [Environment Test] Environment Mode: production
🔍 [Environment Test] Is Development: false
🔍 [Environment Test] Is Production: true
🔍 [Environment Test] URL is valid: true
🔍 [Environment Test] Key is valid: true
✅ [Environment Test] جميع متغيرات البيئة صحيحة!
```

#### ❌ إذا كانت المتغيرات مفقودة:
```
🔍 [Environment Test] Supabase URL: undefined
🔍 [Environment Test] Supabase Key: undefined
🔍 [Environment Test] URL exists: false
🔍 [Environment Test] Key exists: false
❌ [Environment Test] متغيرات البيئة مفقودة!
```

### 4. إزالة رسائل الاختبار

بعد التأكد من أن كل شيء يعمل، يمكنك إزالة رسائل الاختبار:

#### إزالة من App.tsx:
```typescript
// احذف هذا السطر
import '@/lib/env-test'
```

#### إزالة من supabase-simple.ts:
```typescript
// احذف هذه الأسطر
console.log('🔍 [Supabase Simple] URL:', supabaseUrl)
console.log('🔍 [Supabase Simple] Key:', supabaseKey)
console.log('🔍 [Supabase Simple] URL exists:', !!supabaseUrl)
console.log('🔍 [Supabase Simple] Key exists:', !!supabaseKey)
```

#### حذف ملف الاختبار:
```bash
rm src/lib/env-test.ts
```

### 5. نصائح مهمة

1. **لا تشارك مفاتيح Supabase** في الكود أو في الصور
2. **تأكد من إضافة المتغيرات لجميع البيئات** في Vercel
3. **أعد النشر بعد إضافة المتغيرات** في Vercel
4. **تحقق من Console** في كل من البيئة المحلية والإنتاجية

### 6. استكشاف الأخطاء

#### المشكلة: المتغيرات تظهر كـ undefined
**الحل:** تأكد من إضافة المتغيرات في Vercel وإعادة النشر

#### المشكلة: الموقع لا يعمل على Vercel
**الحل:** تحقق من Console لرؤية رسائل الخطأ

#### المشكلة: رسائل خطأ في Console
**الحل:** تأكد من صحة قيم Supabase من لوحة التحكم

---

**ملاحظة:** هذا الاختبار مؤقت ويمكن إزالته بعد التأكد من أن كل شيء يعمل بشكل صحيح.
