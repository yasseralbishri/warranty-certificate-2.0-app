# 🚨 إعداد متغيرات البيئة - عاجل!

## المشكلة الحالية
الصفحة تظهر بيضاء بسبب عدم وجود متغيرات البيئة المطلوبة.

## الحل السريع

### 1. إنشاء ملف `.env` في المجلد الجذر
```bash
# في terminal
touch .env
```

### 2. إضافة المحتوى التالي إلى ملف `.env`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Application Configuration
VITE_APP_NAME=نظام إدارة شهادات الضمان
VITE_APP_VERSION=2.0.0
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=info
VITE_ENABLE_DEVTOOLS=true

# Development Settings
VITE_DEV_MODE=true
VITE_SHOW_DEBUG_INFO=true
```

### 3. استبدال القيم
- استبدل `your-project-id` بـ Project ID الخاص بك من Supabase
- استبدل `your-anon-key-here` بـ Anonymous Key الخاص بك من Supabase

### 4. إعادة تشغيل الخادم
```bash
npm run dev
```

## كيفية الحصول على قيم Supabase

### 1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
### 2. اختر مشروعك
### 3. اذهب إلى Settings > API
### 4. انسخ:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## مثال على القيم الصحيحة
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2MDAwMCwiZXhwIjoyMDE0MzM2MDAwfQ.example-key-here
```

## التحقق من الإعداد
بعد إضافة المتغيرات، افتح Developer Tools (F12) وتحقق من:
- عدم وجود أخطاء في Console
- ظهور رسائل "✅ [Vercel Debug] جميع متغيرات البيئة صحيحة!"

## ملاحظة مهمة
- لا تشارك ملف `.env` مع أي شخص
- أضف `.env` إلى `.gitignore` إذا لم يكن موجوداً
- استخدم متغيرات البيئة المنفصلة للإنتاج
