# إعداد سريع لمتغيرات البيئة

## 🚨 مشكلة: "undefined headers" في Supabase

هذه المشكلة تحدث لأن متغيرات البيئة لـ Supabase غير مُعرّفة.

## ✅ الحل السريع:

### 1. افتح ملف `.env` في المجلد الجذر
```bash
nano .env
```

### 2. أضف متغيرات Supabase الخاصة بك:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. احصل على القيم من Supabase Dashboard:
- اذهب إلى [supabase.com](https://supabase.com)
- اختر مشروعك
- اذهب إلى Settings → API
- انسخ Project URL و anon public key

### 4. أعد تشغيل الخادم:
```bash
npm run dev
```

## 🔍 التحقق من الإعداد:

افتح Developer Tools في المتصفح واكتب:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
```

يجب أن تظهر URL مشروعك.

## 📝 مثال كامل:

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.example_signature_here
```

## ⚠️ تحذير:
- لا تشارك ملف `.env` مع أحد
- لا ترفع ملف `.env` إلى Git
- استخدم قيم مختلفة للإنتاج
