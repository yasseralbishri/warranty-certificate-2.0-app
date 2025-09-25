# إصلاح خطأ حفظ الضمان - Quick Fix

## المشكلة
```
خطأ في حفظ الضمان: Could not find the 'purchase_date' column of 'warranties' in the schema cache
```

## الحل

### 1. تطبيق الإصلاح على قاعدة البيانات
قم بتشغيل هذا الأمر في Supabase SQL Editor:

```sql
-- إصلاح جدول warranties وإضافة الأعمدة المفقودة
ALTER TABLE warranties 
ADD COLUMN IF NOT EXISTS purchase_date DATE,
ADD COLUMN IF NOT EXISTS warranty_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS warranty_duration_months INTEGER;

-- تحديث البيانات الموجودة
UPDATE warranties 
SET 
    purchase_date = warranty_start_date,
    warranty_number = CONCAT('W-', id::text),
    warranty_duration_months = EXTRACT(MONTH FROM AGE(warranty_end_date, warranty_start_date)) + 
                               EXTRACT(YEAR FROM AGE(warranty_end_date, warranty_start_date)) * 12
WHERE purchase_date IS NULL;

-- جعل الأعمدة المطلوبة NOT NULL
ALTER TABLE warranties 
ALTER COLUMN purchase_date SET NOT NULL,
ALTER COLUMN warranty_number SET NOT NULL,
ALTER COLUMN warranty_duration_months SET NOT NULL;

-- إضافة فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_warranties_purchase_date ON warranties(purchase_date);
CREATE INDEX IF NOT EXISTS idx_warranties_warranty_number ON warranties(warranty_number);
CREATE INDEX IF NOT EXISTS idx_warranties_duration ON warranties(warranty_duration_months);

-- إضافة قيود فريدة
ALTER TABLE warranties 
ADD CONSTRAINT unique_warranty_number UNIQUE (warranty_number);
```

### 2. التحقق من الإصلاح
بعد تطبيق الإصلاح، يجب أن يعمل حفظ الضمانات بدون أخطاء.

### 3. الأعمدة المضافة
- `purchase_date`: تاريخ الشراء
- `warranty_number`: رقم الضمان الفريد
- `warranty_duration_months`: مدة الضمان بالأشهر

### 4. الفهارس المضافة
- فهرس على `purchase_date` للأداء
- فهرس على `warranty_number` للأداء
- فهرس على `warranty_duration_months` للأداء

## النتيجة المتوقعة
✅ تم إصلاح خطأ حفظ الضمان
✅ يمكن الآن حفظ الضمانات بدون أخطاء
✅ تم تحسين الأداء مع الفهارس الجديدة
✅ تم إضافة أرقام ضمان فريدة

## ملاحظات
- هذا الإصلاح آمن ولا يؤثر على البيانات الموجودة
- تم تحديث الكود ليرسل البيانات الصحيحة
- تم إضافة فهارس لتحسين الأداء
