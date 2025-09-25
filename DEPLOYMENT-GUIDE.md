# 🚀 دليل النشر - نظام إدارة شهادات الضمان

## 📋 نظرة عامة

هذا الدليل يوضح كيفية نشر تطبيق نظام إدارة شهادات الضمان على Vercel مع إعداد Supabase بشكل صحيح.

## ✅ المتطلبات المسبقة

1. **حساب Supabase**: [إنشاء حساب على supabase.com](https://supabase.com)
2. **حساب Vercel**: [إنشاء حساب على vercel.com](https://vercel.com)
3. **GitHub Repository**: كود التطبيق محفوظ على GitHub

## 🔧 إعداد Supabase

### 1. إنشاء مشروع جديد

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اضغط على "New Project"
3. اختر منظمة أو أنشئ منظمة جديدة
4. أدخل اسم المشروع: `warranty-certificate-app`
5. أدخل كلمة مرور قوية لقاعدة البيانات
6. اختر المنطقة الأقرب لك
7. اضغط "Create new project"

### 2. إعداد قاعدة البيانات

1. اذهب إلى **SQL Editor** في لوحة التحكم
2. انسخ محتوى ملف `database-setup.sql`
3. الصق الكود في المحرر
4. اضغط **Run** لتنفيذ السكريبت

### 3. الحصول على المفاتيح

1. اذهب إلى **Settings** → **API**
2. انسخ القيم التالية:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIs...`

## 🌐 نشر على Vercel

### 1. ربط المشروع

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط "New Project"
3. اختر مستودع GitHub الخاص بك
4. اضغط "Import"

### 2. إعداد متغيرات البيئة

1. في صفحة إعداد المشروع، اذهب إلى **Environment Variables**
2. أضف المتغيرات التالية:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_APP_NAME=نظام إدارة شهادات الضمان
VITE_APP_VERSION=2.0.0
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
VITE_ENABLE_DEVTOOLS=false
```

### 3. إعدادات البناء

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. النشر

1. اضغط "Deploy"
2. انتظر حتى ينتهي البناء
3. ستحصل على رابط التطبيق المنشور

## 🧪 اختبار النشر

### 1. اختبار محلي

```bash
# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local
# عدّل القيم في .env.local

# تشغيل الاختبارات
npm run test-integration

# تشغيل التطبيق محلياً
npm run dev
```

### 2. اختبار الإنتاج

1. افتح رابط التطبيق المنشور
2. تأكد من:
   - تحميل الصفحة بدون أخطاء
   - عمل نظام تسجيل الدخول
   - إمكانية إنشاء شهادات ضمان
   - عمل البحث والفلترة

## 🔒 إعدادات الأمان

### 1. Row Level Security (RLS)

تأكد من تفعيل RLS في Supabase:

```sql
-- تفعيل RLS لجميع الجداول
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
```

### 2. سياسات الأمان

```sql
-- سياسة للمستخدمين - يمكنهم رؤية بياناتهم فقط
CREATE POLICY "Users can view own data" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- سياسة للضمانات - يمكن للمستخدمين رؤية جميع الضمانات
CREATE POLICY "Users can view warranties" ON warranties
  FOR SELECT USING (true);

-- سياسة للعملاء - يمكن للمستخدمين رؤية جميع العملاء
CREATE POLICY "Users can view customers" ON customers
  FOR SELECT USING (true);

-- سياسة للمنتجات - يمكن للمستخدمين رؤية جميع المنتجات
CREATE POLICY "Users can view products" ON products
  FOR SELECT USING (true);
```

## 📊 مراقبة الأداء

### 1. مراقبة Supabase

- اذهب إلى **Logs** في لوحة تحكم Supabase
- راقب **Database** و **API** logs
- تحقق من **Auth** logs للتسجيلات

### 2. مراقبة Vercel

- اذهب إلى **Analytics** في لوحة تحكم Vercel
- راقب **Performance** و **Errors**
- تحقق من **Functions** logs

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ "Invalid Supabase configuration"

**السبب**: متغيرات البيئة غير صحيحة
**الحل**: 
- تحقق من صحة `VITE_SUPABASE_URL`
- تحقق من صحة `VITE_SUPABASE_ANON_KEY`
- تأكد من عدم وجود مسافات إضافية

#### 2. خطأ "Failed to fetch"

**السبب**: مشكلة في الاتصال بقاعدة البيانات
**الحل**:
- تحقق من حالة Supabase
- تحقق من إعدادات الشبكة
- تأكد من صحة URL

#### 3. خطأ "JWT expired"

**السبب**: انتهاء صلاحية جلسة المستخدم
**الحل**:
- سجل خروج ثم دخول مرة أخرى
- تحقق من إعدادات Auth في Supabase

#### 4. صفحة فارغة

**السبب**: خطأ في JavaScript
**الحل**:
- افتح Developer Tools
- تحقق من Console للأخطاء
- تحقق من Network tab للطلبات الفاشلة

### أدوات التشخيص

```bash
# اختبار الاتصال
npm run test-integration

# فحص متغيرات البيئة
npm run check-env

# بناء محلي للاختبار
npm run build
npm run preview
```

## 📈 تحسينات الأداء

### 1. تحسين قاعدة البيانات

- أضف فهارس للبحث السريع
- استخدم pagination للقوائم الطويلة
- نظف البيانات القديمة بانتظام

### 2. تحسين التطبيق

- استخدم lazy loading للمكونات
- ضغط الصور والملفات
- استخدم CDN للموارد الثابتة

## 🔄 التحديثات والصيانة

### 1. تحديثات التطبيق

```bash
# سحب التحديثات
git pull origin main

# تثبيت التبعيات الجديدة
npm install

# بناء واختبار
npm run build
npm run test-integration

# نشر على Vercel
# سيتم النشر تلقائياً عند push للـ main branch
```

### 2. نسخ احتياطية

- قم بعمل نسخ احتياطية دورية من قاعدة البيانات
- احفظ نسخ من متغيرات البيئة
- وثق أي تغييرات في الإعدادات

## 📞 الدعم

إذا واجهت مشاكل:

1. تحقق من [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. راجع [Debugging Guide](./DEBUGGING-GUIDE.md)
3. تحقق من logs في Supabase و Vercel
4. استخدم أدوات التشخيص المدمجة

---

## ✅ قائمة التحقق النهائية

- [ ] مشروع Supabase منشأ ومُعد
- [ ] قاعدة البيانات مُعدة بالجداول المطلوبة
- [ ] متغيرات البيئة مُعدة في Vercel
- [ ] التطبيق منشور بنجاح
- [ ] جميع الاختبارات تمر
- [ ] نظام تسجيل الدخول يعمل
- [ ] إنشاء شهادات الضمان يعمل
- [ ] البحث والفلترة يعمل
- [ ] إعدادات الأمان مُعدة
- [ ] مراقبة الأداء مُعدة

🎉 **مبروك! تطبيقك جاهز للاستخدام**
