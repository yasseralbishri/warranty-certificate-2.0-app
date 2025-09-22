# 🚨 حل مشكلة Supabase "undefined headers"

## المشكلة
```
Supabase client throws "undefined headers" because the environment variables 
(SUPABASE_URL and SUPABASE_KEY) are not being read correctly
```

## ✅ الحل الكامل

### 1. إنشاء ملف `.env` (تم إنشاؤه بالفعل)
```bash
# الملف موجود في: /Users/yasser/warranty-certificate-app/.env
```

### 2. تحديث قيم Supabase

افتح ملف `.env` وأستبدل القيم التالية:

```env
# استبدل هذه القيم بقيم مشروع Supabase الخاص بك
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### 3. الحصول على قيم Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. اختر مشروعك
3. اذهب إلى **Settings** → **API**
4. انسخ:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 4. التحقق من الإعداد

```bash
npm run check-env
```

يجب أن تظهر:
```
✅ VITE_SUPABASE_URL: Set
✅ VITE_SUPABASE_ANON_KEY: Set
🎉 All environment variables are properly configured!
```

### 5. إعادة تشغيل الخادم

```bash
# أوقف الخادم الحالي (Ctrl+C)
# ثم أعد تشغيله
npm run dev
```

## 🔍 التحقق من عمل Supabase

افتح Developer Tools في المتصفح واكتب:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

يجب أن تظهر القيم الصحيحة.

## 📝 مثال كامل لملف `.env`

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.example_signature_here
```

## ⚠️ تحذيرات مهمة

1. **لا تشارك ملف `.env`** مع أحد
2. **لا ترفع ملف `.env`** إلى Git (مُعرّف في `.gitignore`)
3. **استخدم قيم مختلفة** للإنتاج
4. **تأكد من صحة القيم** قبل إعادة تشغيل الخادم

## 🚀 بعد الإعداد

بعد تحديث ملف `.env` وإعادة تشغيل الخادم:
- ✅ مشكلة "undefined headers" ستختفي
- ✅ Supabase سيعمل بشكل صحيح
- ✅ المصادقة ستعمل
- ✅ قاعدة البيانات ستكون متاحة

## 📞 الدعم

إذا استمرت المشكلة:
1. تأكد من صحة القيم في Supabase Dashboard
2. تأكد من إعادة تشغيل الخادم
3. تحقق من console في المتصفح للأخطاء
