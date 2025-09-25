-- إضافة عمود purchase_date إلى جدول warranties
-- Add purchase_date column to warranties table

-- إضافة العمود الجديد
ALTER TABLE warranties 
ADD COLUMN purchase_date DATE;

-- تحديث البيانات الموجودة (إذا كانت موجودة)
-- Set purchase_date to warranty_start_date for existing records
UPDATE warranties 
SET purchase_date = warranty_start_date 
WHERE purchase_date IS NULL;

-- جعل العمود NOT NULL بعد تحديث البيانات
ALTER TABLE warranties 
ALTER COLUMN purchase_date SET NOT NULL;

-- إضافة فهرس للأداء
CREATE INDEX idx_warranties_purchase_date ON warranties(purchase_date);

-- رسالة النجاح
DO $$
BEGIN
    RAISE NOTICE '✅ تم إضافة عمود purchase_date إلى جدول warranties بنجاح!';
    RAISE NOTICE '✅ تم تحديث البيانات الموجودة';
    RAISE NOTICE '✅ تم إضافة فهرس للأداء';
    RAISE NOTICE '🚀 يمكنك الآن حفظ الضمانات بدون أخطاء!';
END $$;
