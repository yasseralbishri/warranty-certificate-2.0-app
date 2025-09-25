-- إصلاح جدول warranties وإضافة الأعمدة المفقودة
-- Fix warranties table and add missing columns

-- إضافة الأعمدة المفقودة
ALTER TABLE warranties 
ADD COLUMN IF NOT EXISTS purchase_date DATE,
ADD COLUMN IF NOT EXISTS warranty_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS warranty_duration_months INTEGER;

-- تحديث البيانات الموجودة (إذا كانت موجودة)
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

-- رسالة النجاح
DO $$
BEGIN
    RAISE NOTICE '✅ تم إصلاح جدول warranties بنجاح!';
    RAISE NOTICE '✅ تم إضافة الأعمدة المفقودة:';
    RAISE NOTICE '   - purchase_date';
    RAISE NOTICE '   - warranty_number';
    RAISE NOTICE '   - warranty_duration_months';
    RAISE NOTICE '✅ تم تحديث البيانات الموجودة';
    RAISE NOTICE '✅ تم إضافة الفهارس والقيود';
    RAISE NOTICE '🚀 يمكنك الآن حفظ الضمانات بدون أخطاء!';
END $$;
