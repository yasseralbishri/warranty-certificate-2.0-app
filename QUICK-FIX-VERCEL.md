# إصلاح سريع لمشكلة Vercel - الصفحة البيضاء

## المشكلة
الموقع يعمل محلياً لكن يظهر صفحة بيضاء على Vercel مع خطأ:
```
Uncaught TypeError: Cannot read properties of undefined (reading 'headers')
```

## الحل السريع

### 1. ✅ تم إنشاء ملف .env محلياً
الملف موجود ويحتوي على:
```env
VITE_SUPABASE_URL=https://rmaybqvpwqwymfvthhmd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_iEbN6Lc-3tRTbcx5maMsIA_MzPKv6P5
```

### 2. 🔧 إضافة متغيرات البيئة في Vercel

**اذهب إلى لوحة تحكم Vercel:**
1. [vercel.com](https://vercel.com) → مشروعك
2. **Settings** → **Environment Variables**
3. أضف المتغيرات:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://rmaybqvpwqwymfvthhmd.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_iEbN6Lc-3tRTbcx5maMsIA_MzPKv6P5` |

4. اختر **Production, Preview, Development** لجميع البيئات
5. اضغط **Save**

### 3. 🚀 إعادة نشر الموقع
- اذهب إلى **Deployments**
- اضغط **Redeploy** على آخر deployment
- أو ادفع تغيير جديد إلى Git

### 4. ✅ التحقق
- افتح الموقع في المتصفح
- يجب أن يعمل بدون صفحة بيضاء
- في Console يجب أن ترى رسائل Supabase بدون أخطاء

## ملاحظة
تم تحسين معالجة الأخطاء في `src/lib/supabase.ts` لتعطي رسائل أوضح في حالة وجود مشاكل.

---
**الوقت المطلوب:** 5 دقائق
**النتيجة المتوقعة:** الموقع يعمل بشكل طبيعي على Vercel
