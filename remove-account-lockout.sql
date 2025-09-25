-- ========================================
-- إزالة نظام الحظر بعد 5 محاولات
-- Remove Account Lockout System
-- ========================================

-- 1. إزالة أعمدة الحظر من جدول user_profiles
ALTER TABLE user_profiles DROP COLUMN IF EXISTS failed_login_attempts;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS locked_until;

-- 2. إصلاح وظيفة تسجيل محاولات تسجيل الدخول
CREATE OR REPLACE FUNCTION log_login_attempt(
    p_email VARCHAR,
    p_success BOOLEAN,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_failure_reason VARCHAR DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- تسجيل محاولة تسجيل الدخول فقط
    INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
    VALUES (p_email, p_ip_address, p_user_agent, p_success, p_failure_reason);
    
    -- تحديث آخر وقت تسجيل دخول عند النجاح فقط
    IF p_success THEN
        UPDATE user_profiles 
        SET last_login_at = NOW()
        WHERE email = p_email;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. تبسيط وظيفة التحقق من حالة المستخدم
CREATE OR REPLACE FUNCTION check_user_status(p_email VARCHAR)
RETURNS TABLE(
    is_active BOOLEAN,
    is_locked BOOLEAN,
    failed_attempts INTEGER,
    locked_until TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.is_active,
        false as is_locked,  -- دائماً غير محظور
        0 as failed_attempts,  -- دائماً 0
        NULL::TIMESTAMP WITH TIME ZONE as locked_until  -- دائماً NULL
    FROM user_profiles up
    WHERE up.email = p_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. رسالة النجاح
DO $$
BEGIN
    RAISE NOTICE '✅ تم إزالة نظام الحظر بنجاح!';
    RAISE NOTICE '✅ تم حذف أعمدة failed_login_attempts و locked_until';
    RAISE NOTICE '✅ تم تبسيط وظيفة log_login_attempt';
    RAISE NOTICE '✅ تم تبسيط وظيفة check_user_status';
    RAISE NOTICE '🚀 المستخدمون لن يتم حظرهم بعد الآن!';
END $$;
