-- إصلاح سريع لخطأ حفظ الضمان
-- Quick fix for warranty save error

ALTER TABLE warranties 
ADD COLUMN IF NOT EXISTS purchase_date DATE,
ADD COLUMN IF NOT EXISTS warranty_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS warranty_duration_months INTEGER;

UPDATE warranties 
SET 
    purchase_date = warranty_start_date,
    warranty_number = CONCAT('W-', id::text),
    warranty_duration_months = EXTRACT(MONTH FROM AGE(warranty_end_date, warranty_start_date)) + 
                               EXTRACT(YEAR FROM AGE(warranty_end_date, warranty_start_date)) * 12
WHERE purchase_date IS NULL;

ALTER TABLE warranties 
ALTER COLUMN purchase_date SET NOT NULL,
ALTER COLUMN warranty_number SET NOT NULL,
ALTER COLUMN warranty_duration_months SET NOT NULL;
