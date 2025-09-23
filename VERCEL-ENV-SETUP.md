# دليل إعداد متغيرات البيئة في Vercel

## المشكلة
عند رفع الموقع على Vercel، تظهر صفحة بيضاء مع خطأ في الكونسول:
```
Uncaught TypeError: Cannot read properties of undefined (reading 'headers')
```

هذا يحدث لأن متغيرات البيئة لـ Supabase غير متوفرة في بيئة الإنتاج.

## الحل

### 1. إنشاء ملف .env محلياً

أنشئ ملف `.env` في المجلد الجذر للمشروع:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://rmaybqvpwqwymfvthhmd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_iEbN6Lc-3tRTbcx5maMsIA_MzPKv6P5
```

### 2. إضافة متغيرات البيئة في Vercel

#### الطريقة الأولى: من لوحة تحكم Vercel

1. اذهب إلى [vercel.com](https://vercel.com) وسجل دخولك
2. اختر مشروعك
3. اذهب إلى **Settings** → **Environment Variables**
4. أضف المتغيرات التالية:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://rmaybqvpwqwymfvthhmd.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_iEbN6Lc-3tRTbcx5maMsIA_MzPKv6P5` | Production, Preview, Development |

5. اضغط **Save**

#### الطريقة الثانية: من سطر الأوامر

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# إضافة متغيرات البيئة
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# رفع الموقع
vercel --prod
```

### 3. إعادة نشر الموقع

بعد إضافة متغيرات البيئة:

1. اذهب إلى **Deployments** في لوحة تحكم Vercel
2. اضغط على **Redeploy** للنسخة الأخيرة
3. أو ادفع تغيير جديد إلى Git repository

### 4. التحقق من الإعداد

بعد إعادة النشر، تحقق من:

1. فتح الموقع في المتصفح
2. فتح Developer Tools (F12)
3. الذهاب إلى Console
4. يجب أن ترى رسائل Supabase بدون أخطاء:

```
🔧 [Supabase] إعداد Supabase Client...
🔧 [Supabase] URL: https://rmaybqvpwqwymfvthhmd.supabase.co
🔧 [Supabase] Key: sb_publishable_iEbN6Lc-3tRTbcx5maMsIA_MzPKv6P5
🔧 [Supabase] Session Storage: localStorage متاح
```

## ملاحظات مهمة

### أمان متغيرات البيئة

- **لا تشارك** ملف `.env` أو ترفعه إلى Git
- ملف `.env` موجود في `.gitignore` بالفعل
- متغيرات البيئة في Vercel محمية ولا تظهر في الكود

### أنواع البيئات في Vercel

- **Production**: الموقع المنشور للجمهور
- **Preview**: نسخ تجريبية من Pull Requests
- **Development**: للاختبار المحلي

يُنصح بإضافة المتغيرات لجميع البيئات.

### استكشاف الأخطاء

إذا استمرت المشكلة:

1. تحقق من أن المتغيرات مُضافة بشكل صحيح في Vercel
2. تأكد من إعادة النشر بعد إضافة المتغيرات
3. تحقق من Console في المتصفح لرؤية رسائل الخطأ المفصلة
4. تأكد من أن قيم Supabase صحيحة

### الحصول على قيم Supabase

إذا كنت تحتاج قيم جديدة:

1. اذهب إلى [supabase.com](https://supabase.com)
2. اختر مشروعك
3. اذهب إلى **Settings** → **API**
4. انسخ:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## مثال كامل

```bash
# 1. إنشاء ملف .env محلياً
echo "VITE_SUPABASE_URL=https://rmaybqvpwqwymfvthhmd.supabase.co" > .env
echo "VITE_SUPABASE_ANON_KEY=sb_publishable_iEbN6Lc-3tRTbcx5maMsIA_MzPKv6P5" >> .env

# 2. اختبار محلياً
npm run dev

# 3. إضافة متغيرات البيئة في Vercel (من لوحة التحكم)
# 4. إعادة النشر
# 5. التحقق من النتيجة
```

بعد تطبيق هذه الخطوات، سيعمل الموقع بشكل صحيح على Vercel.
