# تعليمات إنشاء مستودع جديد على GitHub

## الخطوات المطلوبة:

### 1. إنشاء مستودع جديد على GitHub:
1. اذهب إلى [github.com](https://github.com)
2. اضغط على **"New repository"** أو **"+"** → **"New repository"**
3. املأ التفاصيل:
   - **Repository name:** `warranty-certificate-app`
   - **Description:** `نظام إدارة شهادات الضمان لشركة السويد للسباكة التجارية`
   - **Visibility:** Public (أو Private حسب تفضيلك)
   - **لا تضع علامة** على "Add a README file"
   - **لا تضع علامة** على "Add .gitignore"
   - **لا تضع علامة** على "Choose a license"
4. اضغط **"Create repository"**

### 2. ربط المستودع المحلي بالمستودع الجديد:

بعد إنشاء المستودع على GitHub، ستظهر لك تعليمات. استخدم هذه الأوامر:

```bash
# إضافة remote جديد
git remote add origin https://github.com/yasseralbishri/warranty-certificate-app.git

# رفع الملفات
git branch -M main
git push -u origin main
```

### 3. التحقق من النتيجة:
- اذهب إلى المستودع على GitHub
- يجب أن ترى جميع الملفات
- يجب أن ترى commit message: "🚀 إطلاق جديد لنظام إدارة شهادات الضمان"

## ملاحظات مهمة:

- ✅ **النسخة الاحتياطية:** تم إنشاؤها في `/Users/yasser/warranty-certificate-app-backup`
- ✅ **Git جاهز:** تم تهيئة Git من جديد
- ✅ **الملفات محفوظة:** تم عمل commit أولي
- ⏳ **ينتظر:** إنشاء المستودع على GitHub

## بعد إنشاء المستودع:

1. **ربط المستودع:** استخدم الأوامر أعلاه
2. **التحقق من Vercel:** قد تحتاج لإعادة ربط المشروع
3. **إضافة متغيرات البيئة:** في Vercel مرة أخرى

---

**الخطوة التالية:** اذهب إلى GitHub وأنشئ المستودع الجديد، ثم استخدم الأوامر أعلاه لربطه.
