# تعليمات النشر على Vercel

## المشكلة التي تم حلها
كانت هناك مشكلة في النشر على Vercel حيث تظهر رسالة خطأ:
```
GET https://warranty-certificate-app.vercel.app/assets/ui-d8c96d3c.js net::ERR_ABORTED 404 (Not Found)
```

## الحلول المطبقة

### 1. تحديث إعدادات Vite
- تم إزالة `ui` chunk من `manualChunks` لتجنب مشاكل تقسيم الملفات
- تم إضافة `assetsDir` و `outDir` للتأكد من المسارات الصحيحة

### 2. إضافة ملف `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. إضافة ملف `.vercelignore`
لتجنب رفع الملفات غير الضرورية

## خطوات النشر

1. **تأكد من أن جميع التغييرات محفوظة:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment issues"
   git push origin main
   ```

2. **في Vercel Dashboard:**
   - اذهب إلى مشروعك
   - انقر على "Redeploy" أو انتظر النشر التلقائي
   - تأكد من أن Build Command هو: `npm run build`
   - تأكد من أن Output Directory هو: `dist`

3. **تأكد من متغيرات البيئة:**
   - في Vercel Dashboard، اذهب إلى Settings > Environment Variables
   - أضف:
     - `VITE_SUPABASE_URL`: رابط مشروع Supabase
     - `VITE_SUPABASE_ANON_KEY`: مفتاح Supabase العام

## التحقق من النشر

بعد النشر، تأكد من:
- الموقع يفتح بدون أخطاء JavaScript
- جميع الملفات يتم تحميلها بنجاح
- لا توجد رسائل 404 في Console

## إذا استمرت المشكلة

1. احذف مجلد `dist` وابنِ مرة أخرى:
   ```bash
   rm -rf dist
   npm run build
   ```

2. تحقق من أن جميع الملفات موجودة في `dist/assets/`

3. في Vercel، جرب "Redeploy" مع "Clear Cache"

## الملفات المحدثة
- `vite.config.ts` - إعدادات البناء
- `vercel.json` - إعدادات Vercel
- `.vercelignore` - ملفات مستبعدة من النشر
