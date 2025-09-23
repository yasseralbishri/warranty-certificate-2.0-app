# تعليمات إعداد النظام

## 🚨 حل مشكلة قاعدة البيانات

إذا واجهت الخطأ: `column w.created_by does not exist`، اتبع هذه الخطوات:

### 1. **تحديث قاعدة البيانات:**
```sql
-- نفذ هذا الكود في Supabase SQL Editor:
-- (انسخ والصق محتوى ملف database-update.sql)
```

### 2. **أو إعادة إنشاء قاعدة البيانات:**
```sql
-- حذف الجداول الموجودة (إذا لزم الأمر)
DROP TABLE IF EXISTS warranties CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ثم نفذ database-setup-arabic.sql مرة أخرى
```

## 🔧 **إعداد النظام الكامل:**

### 1. **إنشاء مشروع Supabase:**
- اذهب إلى [supabase.com](https://supabase.com)
- أنشئ مشروع جديد
- احصل على URL و API Key

### 2. **إنشاء ملف .env:**
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. **تشغيل قاعدة البيانات:**
```sql
-- في Supabase SQL Editor، نفذ:
-- 1. database-setup-arabic.sql (أو database-update.sql إذا كانت قاعدة البيانات موجودة)
-- 2. الكود أدناه لإنشاء مدير أول
```

### 4. **إنشاء مدير أول:**
```sql
-- إنشاء مدير أول
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "المدير الرئيسي"}'
);

-- تحديث دور المدير
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

## 🔑 **بيانات الدخول:**

بعد تنفيذ الكود أعلاه:
- **البريد الإلكتروني:** `admin@example.com`
- **كلمة المرور:** `admin123`
- **الدور:** مدير

## 🚀 **تشغيل التطبيق:**
```bash
npm install
npm run dev
```

## ⚠️ **تحذيرات أمنية:**
1. **غير كلمة المرور فوراً** بعد تسجيل الدخول الأول
2. **استخدم بريد إلكتروني حقيقي** بدلاً من example.com
3. **تأكد من تفعيل Supabase Auth** في لوحة التحكم

## 🆘 **حل المشاكل:**

### مشكلة: "column does not exist"
- نفذ `database-update.sql`
- أو أعد إنشاء قاعدة البيانات

### مشكلة: "Auth not enabled"
- اذهب إلى Supabase Dashboard
- Authentication > Settings
- فعّل "Enable email confirmations"

### مشكلة: "RLS policies"
- تأكد من تنفيذ جميع السياسات في ملف SQL

## 📞 **الدعم:**
إذا واجهت أي مشاكل، تحقق من:
1. متغيرات البيئة (.env)
2. إعدادات Supabase Auth
3. تنفيذ جميع ملفات SQL
