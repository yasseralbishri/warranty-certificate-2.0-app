# دليل الإطلاق السريع
## نظام إدارة شهادات الضمان

### 🚀 خطوات الإطلاق (5 دقائق)

#### 1. إصلاح قاعدة البيانات (دقيقة واحدة)
```sql
-- انسخ والصق هذا الكود في Supabase SQL Editor
-- quick-rls-fix.sql
```

#### 2. رفع المشروع إلى GitHub
```bash
git add .
git commit -m "Ready for deployment - $(date)"
git push origin main
```

#### 3. ربط المشروع بـ Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط "New Project"
3. اختر المشروع من GitHub
4. أضف متغيرات البيئة:
   ```
   VITE_SUPABASE_URL=https://uqzmimspoqruvpiznkhh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_APP_NAME=نظام إدارة شهادات الضمان
   VITE_APP_VERSION=2.0.0
   VITE_DEBUG_MODE=false
   VITE_LOG_LEVEL=error
   VITE_ENABLE_DEVTOOLS=false
   ```
5. اضغط "Deploy"

#### 4. اختبار الإطلاق
- افتح الرابط المقدم من Vercel
- تأكد من عمل جميع الوظائف
- اختبر تسجيل الدخول
- اختبر إنشاء ضمان جديد

### ✅ تم! المشروع جاهز للاستخدام

---

### 🔧 في حالة المشاكل

#### مشكلة في قاعدة البيانات
```sql
-- نفذ هذا في Supabase SQL Editor
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE warranties DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
```

#### مشكلة في البيئة
- تأكد من صحة متغيرات البيئة في Vercel
- تأكد من أن URL و Key صحيحان

#### مشكلة في البناء
```bash
npm run build
npm run preview
```

---

### 📞 الدعم
- راجع `DEPLOYMENT-READY-REPORT.md` للتفاصيل الكاملة
- راجع `TROUBLESHOOTING.md` لحل المشاكل
- استخدم `test-integration.js` لاختبار الاتصال

---

*تم إنشاء هذا الدليل تلقائياً - $(date)*
