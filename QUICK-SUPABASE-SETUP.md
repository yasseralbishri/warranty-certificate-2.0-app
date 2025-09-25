# 🚀 إعداد سريع لـ Supabase

## الخطوات المطلوبة

### 1. إنشاء مشروع Supabase جديد
1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اضغط "New Project"
3. اختر Organization
4. أدخل اسم المشروع: `warranty-certificate-app`
5. أدخل كلمة مرور قوية لقاعدة البيانات
6. اختر المنطقة الأقرب لك
7. اضغط "Create new project"

### 2. الحصول على مفاتيح API
1. بعد إنشاء المشروع، اذهب إلى **Settings** > **API**
2. انسخ القيم التالية:
   - **Project URL** (يبدأ بـ `https://`)
   - **anon public** key (يبدأ بـ `eyJ`)

### 3. تحديث ملف `.env`
افتح ملف `.env` في مجلد المشروع واستبدل:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

بالقيم الحقيقية:
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. إعداد قاعدة البيانات
1. اذهب إلى **SQL Editor** في Supabase
2. انسخ محتوى ملف `fresh-database-setup.sql`
3. اضغط "Run" لتنفيذ الكود

### 5. اختبار التطبيق
```bash
npm run dev
```

## ملاحظات مهمة
- ⚠️ لا تشارك مفاتيح API مع أي شخص
- 🔒 استخدم كلمة مرور قوية لقاعدة البيانات
- 📝 احفظ مفاتيح API في مكان آمن
- 🚀 بعد الإعداد، يمكنك حذف ملف `.env` من Git

## استكشاف الأخطاء
إذا واجهت مشاكل:
1. تحقق من صحة مفاتيح API
2. تأكد من تنفيذ SQL script
3. تحقق من Console في المتصفح
4. تأكد من اتصال الإنترنت
