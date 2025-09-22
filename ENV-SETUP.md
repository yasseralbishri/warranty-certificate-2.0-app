# إعداد متغيرات البيئة

## مشكلة متغيرات البيئة

المشكلة الحالية هي أن متغيرات البيئة لـ Supabase لا تُقرأ بشكل صحيح. 

## الحل

### 1. إنشاء ملف `.env`

أنشئ ملف `.env` في المجلد الجذر للمشروع مع المحتوى التالي:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. استبدال القيم

استبدل القيم التالية بقيم مشروع Supabase الخاص بك:

- `your_supabase_project_url_here` → URL مشروع Supabase
- `your_supabase_anon_key_here` → المفتاح العام (Anon Key)

### 3. مثال

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.example_signature_here
```

### 4. إعادة تشغيل الخادم

بعد إنشاء ملف `.env`، أعد تشغيل خادم التطوير:

```bash
npm run dev
```

## ملاحظات مهمة

1. **في Vite**: متغيرات البيئة يجب أن تبدأ بـ `VITE_` لتكون متاحة في المتصفح
2. **الأمان**: لا تشارك ملف `.env` أو ترفعه إلى Git
3. **التحقق**: تأكد من أن القيم صحيحة في لوحة تحكم Supabase

## التحقق من الإعداد

يمكنك التحقق من أن المتغيرات تُقرأ بشكل صحيح من خلال فتح Developer Tools في المتصفح وكتابة:

```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

يجب أن تظهر القيم التي وضعتها في ملف `.env`.
