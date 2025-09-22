# دليل الإعداد الكامل لنظام الضمانات

## 🎯 الخطوات المطلوبة لإعداد النظام

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

#### 1.3 إنشاء ملف .env
```bash
# في مجلد المشروع، أنشئ ملف .env
touch .env
```

أضف المحتوى التالي:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **المرحلة 2: إعداد قاعدة البيانات**

#### 2.1 إنشاء قاعدة البيانات
1. في Supabase Dashboard، اذهب إلى **SQL Editor**
2. انقر "New query"
3. انسخ والصق محتوى ملف `database-setup.sql`
4. انقر "Run"

#### 2.2 إنشاء المدير الأول
1. في SQL Editor، انقر "New query"
2. انسخ والصق محتوى ملف `create-admin.sql`
3. انقر "Run"

#### 2.3 التحقق من الإعداد
1. في SQL Editor، انقر "New query"
2. انسخ والصق محتوى ملف `verify-setup.sql`
3. انقر "Run"
4. تأكد من ظهور جميع الجداول والبيانات

### **المرحلة 3: تفعيل Authentication**

#### 3.1 تفعيل Auth
1. في Dashboard، اذهب إلى **Authentication > Settings**
2. فعّل الخيارات التالية:
   - ✅ **Enable email confirmations**
   - ✅ **Enable signup**

#### 3.2 إعداد Site URL
1. في **Authentication > URL Configuration**
2. أضف في **Site URL:** `http://localhost:5173`
3. أضف في **Redirect URLs:** `http://localhost:5173/**`

### **المرحلة 4: تشغيل التطبيق**

#### 4.1 تثبيت المتطلبات
```bash
npm install
```

#### 4.2 اختبار الاتصال
```bash
node test-connection.js
```

#### 4.3 تشغيل التطبيق
```bash
npm run dev
```

### **المرحلة 5: تسجيل الدخول**

#### 5.1 بيانات المدير
- **البريد الإلكتروني:** `admin@system.com`
- **كلمة المرور:** `admin123`

#### 5.2 تسجيل الدخول
1. افتح المتصفح على `http://localhost:5173`
2. استخدم بيانات المدير أعلاه
3. تأكد من الانتقال للوحة التحكم

## 🔧 حل المشاكل الشائعة

### مشكلة: "No API key found"
- تأكد من إنشاء ملف `.env`
- تأكد من صحة URL و API Key
- أعد تشغيل التطبيق بعد تعديل `.env`

### مشكلة: "relation does not exist"
- نفذ ملف `database-setup.sql` في SQL Editor
- تأكد من نجاح التنفيذ

### مشكلة: "Invalid login credentials"
- نفذ ملف `create-admin.sql`
- تأكد من تفعيل Authentication في Supabase

### مشكلة: "RLS policy"
- تأكد من تنفيذ جميع السياسات في `database-setup.sql`

## 📋 قائمة التحقق

- [ ] إنشاء مشروع Supabase
- [ ] الحصول على URL و API Key
- [ ] إنشاء ملف .env
- [ ] تنفيذ database-setup.sql
- [ ] تنفيذ create-admin.sql
- [ ] تنفيذ verify-setup.sql
- [ ] تفعيل Authentication
- [ ] تثبيت المتطلبات (npm install)
- [ ] اختبار الاتصال (node test-connection.js)
- [ ] تشغيل التطبيق (npm run dev)
- [ ] تسجيل الدخول بنجاح

## 🎉 بعد الإكمال

ستحصل على:
- ✅ نظام تسجيل دخول آمن
- ✅ لوحة تحكم للمديرين
- ✅ إدارة المستخدمين
- ✅ تتبع العمليات
- ✅ واجهة عربية جميلة
- ✅ نظام ضمانات متكامل

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من ملف `.env`
2. نفذ `verify-setup.sql` للتأكد من الإعداد
3. تحقق من إعدادات Supabase Auth
4. تأكد من تنفيذ جميع ملفات SQL بالترتيب
