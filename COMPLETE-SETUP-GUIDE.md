# دليل الإعداد الكامل للنظام

## 🎯 **الخطوات الكاملة لإعداد النظام من الصفر**

### **المرحلة 1: إعداد Supabase**

#### 1.1 إنشاء مشروع Supabase
1. اذهب إلى [supabase.com](https://supabase.com)
2. انقر "Start your project"
3. سجل دخول أو أنشئ حساب
4. انقر "New project"
5. املأ البيانات:
   - **Name:** `warranty-system`
   - **Database Password:** اختر كلمة مرور قوية
   - **Region:** اختر أقرب منطقة لك
6. انقر "Create new project"
7. انتظر حتى ينتهي الإنشاء (2-3 دقائق)

#### 1.2 الحصول على بيانات الاتصال
1. في لوحة التحكم، اذهب إلى **Settings > API**
2. انسخ البيانات التالية:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **المرحلة 2: إعداد قاعدة البيانات**

#### 2.1 إنشاء ملف .env
```bash
# في مجلد المشروع، أنشئ ملف .env
touch .env
```

#### 2.2 إضافة متغيرات البيئة
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 2.3 إنشاء قاعدة البيانات
1. في Supabase Dashboard، اذهب إلى **SQL Editor**
2. انقر "New query"
3. انسخ والصق محتوى ملف `database-setup-arabic.sql`
4. انقر "Run"

### **المرحلة 3: تفعيل Authentication**

#### 3.1 تفعيل Auth
1. في Dashboard، اذهب إلى **Authentication > Settings**
2. فعّل الخيارات التالية:
   - ✅ **Enable email confirmations**
   - ✅ **Enable phone confirmations** (اختياري)
   - ✅ **Enable signup**

#### 3.2 إعداد Site URL
1. في **Authentication > URL Configuration**
2. أضف في **Site URL:** `http://localhost:5173`
3. أضف في **Redirect URLs:** `http://localhost:5173/**`

### **المرحلة 4: إنشاء المدير الأول**

#### 4.1 الطريقة الأولى: من Dashboard
1. اذهب إلى **Authentication > Users**
2. انقر "Add user"
3. املأ البيانات:
   - **Email:** `admin@system.com`
   - **Password:** `admin123`
   - **Auto Confirm User:** ✅ (مفعل)
4. انقر "Create user"

#### 4.2 الطريقة الثانية: من SQL
```sql
-- في SQL Editor
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@system.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "مدير النظام"}',
  false
);

-- تحديث الدور
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'admin@system.com';
```

### **المرحلة 5: تشغيل التطبيق**

#### 5.1 تثبيت المتطلبات
```bash
npm install
```

#### 5.2 تشغيل التطبيق
```bash
npm run dev
```

#### 5.3 تسجيل الدخول
- **البريد:** `admin@system.com`
- **كلمة المرور:** `admin123`

### **المرحلة 6: التحقق من العمل**

#### 6.1 اختبار تسجيل الدخول
- تأكد من ظهور صفحة تسجيل الدخول
- جرب تسجيل الدخول بالبيانات أعلاه
- تأكد من الانتقال للوحة التحكم

#### 6.2 اختبار الوظائف
- جرب إضافة ضمان جديد
- جرب عرض قائمة الضمانات
- جرب الوصول للوحة الإدارة

## 🔧 **حل المشاكل الشائعة**

### مشكلة: "Invalid login credentials"
```sql
-- تأكيد البريد الإلكتروني
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'admin@system.com';
```

### مشكلة: "RLS policy"
```sql
-- إصلاح السياسات
DROP POLICY IF EXISTS "Allow all operations" ON customers;
DROP POLICY IF EXISTS "Allow all operations" ON products;
DROP POLICY IF EXISTS "Allow all operations" ON warranties;

CREATE POLICY "Authenticated users can manage customers" ON customers 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage products" ON products 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage warranties" ON warranties 
  FOR ALL USING (auth.role() = 'authenticated');
```

### مشكلة: متغيرات البيئة
- تأكد من صحة URL و API Key
- تأكد من عدم وجود مسافات إضافية
- أعد تشغيل التطبيق بعد تعديل .env

## 📋 **قائمة التحقق**

- [ ] إنشاء مشروع Supabase
- [ ] الحصول على URL و API Key
- [ ] إنشاء ملف .env
- [ ] تنفيذ database-setup-arabic.sql
- [ ] تفعيل Authentication
- [ ] إنشاء مدير أول
- [ ] تثبيت المتطلبات (npm install)
- [ ] تشغيل التطبيق (npm run dev)
- [ ] تسجيل الدخول بنجاح
- [ ] اختبار الوظائف الأساسية

## 🎉 **بعد الإكمال**

ستحصل على:
- ✅ نظام تسجيل دخول آمن
- ✅ لوحة تحكم للمديرين
- ✅ إدارة المستخدمين
- ✅ تتبع العمليات
- ✅ واجهة عربية جميلة
