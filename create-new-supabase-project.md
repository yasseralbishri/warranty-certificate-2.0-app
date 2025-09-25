# إنشاء مشروع Supabase جديد

## الخطوات:

1. اذهب إلى [supabase.com](https://supabase.com)
2. اضغط على "Start your project"
3. سجل دخول أو أنشئ حساب جديد
4. اضغط على "New Project"
5. اختر Organization
6. أدخل تفاصيل المشروع:
   - **Name**: warranty-certificate-app
   - **Database Password**: اختر كلمة مرور قوية
   - **Region**: اختر أقرب منطقة لك
7. اضغط على "Create new project"

## بعد إنشاء المشروع:

1. انتظر حتى يكتمل إنشاء المشروع (2-3 دقائق)
2. اذهب إلى Settings > API
3. انسخ:
   - **Project URL**
   - **anon public key**

## تحديث ملف .env:

```bash
VITE_SUPABASE_URL=your_new_project_url
VITE_SUPABASE_ANON_KEY=your_new_anon_key
```

## تشغيل SQL:

1. اذهب إلى SQL Editor
2. انسخ محتوى ملف `database-setup-fixed.sql`
3. اضغط Run

## إضافة بيانات تجريبية:

1. في SQL Editor
2. انسخ محتوى ملف `quick-fix-rls.sql`
3. اضغط Run
