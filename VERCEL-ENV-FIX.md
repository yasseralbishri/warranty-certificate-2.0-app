# إصلاح مشكلة البيئة في Vercel

## المشكلة
تظهر صفحة بيضاء مع خطأ في الكونسول: `Cannot read properties of undefined (reading 'headers')`

## الحل

### 1. إعداد متغيرات البيئة في Vercel

اذهب إلى مشروعك في Vercel Dashboard:

1. **Settings** → **Environment Variables**
2. أضف المتغيرات التالية:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. الحصول على بيانات Supabase

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **Settings** → **API**
4. انسخ:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 3. إعادة النشر

بعد إضافة المتغيرات:
1. اذهب إلى **Deployments** في Vercel
2. اضغط على **Redeploy** للـ deployment الأخير
3. أو ادفع commit جديد إلى GitHub

### 4. التحقق من الحل

بعد النشر، تحقق من:
- عدم ظهور صفحة بيضاء
- عدم وجود أخطاء في الكونسول
- عمل التطبيق بشكل طبيعي

## ملاحظات مهمة

- تأكد من أن متغيرات البيئة تبدأ بـ `VITE_`
- لا تضع مسافات حول علامة `=` في Vercel
- تأكد من صحة URL و Key من Supabase
