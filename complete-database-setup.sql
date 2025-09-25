-- ========================================
-- إعداد قاعدة البيانات الكامل لنظام شهادات الضمان
-- Complete Database Setup for Warranty Certificate System
-- ========================================

-- تنظيف شامل للبيانات الموجودة
-- ========================================

-- حذف جميع السياسات الموجودة (مع التحقق من وجود الجداول)
DO $$ 
BEGIN
    -- حذف سياسات user_profiles
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
        DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
        DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
        DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
        DROP POLICY IF EXISTS "Enable update for users based on email" ON user_profiles;
        DROP POLICY IF EXISTS "Enable delete for users based on email" ON user_profiles;
        DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
        DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
    END IF;
    
    -- حذف سياسات customers
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customers') THEN
        DROP POLICY IF EXISTS "Users can view all customers" ON customers;
        DROP POLICY IF EXISTS "Users can insert customers" ON customers;
        DROP POLICY IF EXISTS "Users can update customers" ON customers;
        DROP POLICY IF EXISTS "Users can delete customers" ON customers;
    END IF;
    
    -- حذف سياسات products
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        DROP POLICY IF EXISTS "Users can view all products" ON products;
        DROP POLICY IF EXISTS "Admins can manage products" ON products;
    END IF;
    
    -- حذف سياسات warranties
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'warranties') THEN
        DROP POLICY IF EXISTS "Users can view all warranties" ON warranties;
        DROP POLICY IF EXISTS "Users can insert warranties" ON warranties;
        DROP POLICY IF EXISTS "Users can update warranties" ON warranties;
        DROP POLICY IF EXISTS "Users can delete warranties" ON warranties;
    END IF;
    
    -- حذف سياسات login_attempts
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'login_attempts') THEN
        DROP POLICY IF EXISTS "Admins can view login attempts" ON login_attempts;
    END IF;
    
    -- حذف سياسات user_sessions
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
        DROP POLICY IF EXISTS "Admins can view all sessions" ON user_sessions;
    END IF;
END $$;

-- حذف جميع الـ Triggers الموجودة (مع التحقق من وجود الجداول)
DO $$ 
BEGIN
    -- حذف trigger على auth.users
    IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') THEN
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    END IF;
    
    -- حذف triggers على الجداول
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        DROP TRIGGER IF EXISTS update_products_updated_at ON products;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customers') THEN
        DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'warranties') THEN
        DROP TRIGGER IF EXISTS update_warranties_updated_at ON warranties;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
    END IF;
END $$;

-- حذف جميع الوظائف الموجودة (مع التحقق من وجودها)
DO $$ 
BEGIN
    -- حذف الوظائف
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'create_user_profile') THEN
        DROP FUNCTION IF EXISTS create_user_profile();
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'update_updated_at_column') THEN
        DROP FUNCTION IF EXISTS update_updated_at_column();
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_user_admin') THEN
        DROP FUNCTION IF EXISTS is_user_admin(UUID);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_user_active') THEN
        DROP FUNCTION IF EXISTS is_user_active(UUID);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'log_login_attempt') THEN
        DROP FUNCTION IF EXISTS log_login_attempt(VARCHAR, BOOLEAN, INET, TEXT, VARCHAR);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'check_user_status') THEN
        DROP FUNCTION IF EXISTS check_user_status(VARCHAR);
    END IF;
END $$;

-- إيقاف RLS مؤقتاً (مع التحقق من وجود الجداول)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customers') THEN
        ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        ALTER TABLE products DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'warranties') THEN
        ALTER TABLE warranties DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'login_attempts') THEN
        ALTER TABLE login_attempts DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- حذف جميع الجداول الموجودة
DROP TABLE IF EXISTS warranties CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS login_attempts CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;

-- إنشاء الجداول
-- ========================================

-- جدول المنتجات
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    warranty_period_months INTEGER NOT NULL DEFAULT 12,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول العملاء
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول شهادات الضمان
CREATE TABLE warranties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    warranty_start_date DATE NOT NULL,
    warranty_end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول ملفات المستخدمين
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول سجل محاولات تسجيل الدخول
CREATE TABLE login_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(255),
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول جلسات المستخدمين
CREATE TABLE user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء الفهارس للأداء
-- ========================================

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_invoice ON customers(invoice_number);
CREATE INDEX idx_customers_created_by ON customers(created_by);
CREATE INDEX idx_warranties_customer ON warranties(customer_id);
CREATE INDEX idx_warranties_product ON warranties(product_id);
CREATE INDEX idx_warranties_dates ON warranties(warranty_start_date, warranty_end_date);
CREATE INDEX idx_warranties_status ON warranties(status);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_active ON user_profiles(is_active);
CREATE INDEX idx_login_attempts_email ON login_attempts(email);
CREATE INDEX idx_login_attempts_time ON login_attempts(attempted_at);
CREATE INDEX idx_login_attempts_success ON login_attempts(success);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- إنشاء الوظائف المساعدة
-- ========================================

-- وظيفة للتحقق من صلاحيات المدير
CREATE OR REPLACE FUNCTION is_user_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = user_id AND role = 'admin' AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- وظيفة للتحقق من حالة المستخدم النشط
CREATE OR REPLACE FUNCTION is_user_active(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = user_id AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- وظيفة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- وظيفة لإنشاء ملف المستخدم عند التسجيل
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- وظيفة لتسجيل محاولات تسجيل الدخول
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

-- وظيفة للتحقق من حالة المستخدم
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

-- إنشاء الـ Triggers
-- ========================================

-- Trigger لتحديث updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warranties_updated_at 
    BEFORE UPDATE ON warranties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger لإنشاء ملف المستخدم عند التسجيل
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- تفعيل Row Level Security
-- ========================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات RLS
-- ========================================

-- سياسات user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON user_profiles
    FOR UPDATE USING (is_user_admin(auth.uid()));

-- سياسات customers
CREATE POLICY "Users can view all customers" ON customers
    FOR SELECT USING (is_user_active(auth.uid()));

CREATE POLICY "Users can insert customers" ON customers
    FOR INSERT WITH CHECK (is_user_active(auth.uid()));

CREATE POLICY "Users can update customers" ON customers
    FOR UPDATE USING (is_user_active(auth.uid()));

CREATE POLICY "Users can delete customers" ON customers
    FOR DELETE USING (is_user_active(auth.uid()));

-- سياسات products
CREATE POLICY "Users can view all products" ON products
    FOR SELECT USING (is_user_active(auth.uid()));

CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (is_user_admin(auth.uid()));

-- سياسات warranties
CREATE POLICY "Users can view all warranties" ON warranties
    FOR SELECT USING (is_user_active(auth.uid()));

CREATE POLICY "Users can insert warranties" ON warranties
    FOR INSERT WITH CHECK (is_user_active(auth.uid()));

CREATE POLICY "Users can update warranties" ON warranties
    FOR UPDATE USING (is_user_active(auth.uid()));

CREATE POLICY "Users can delete warranties" ON warranties
    FOR DELETE USING (is_user_active(auth.uid()));

-- سياسات login_attempts
CREATE POLICY "Admins can view login attempts" ON login_attempts
    FOR SELECT USING (is_user_admin(auth.uid()));

-- سياسات user_sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" ON user_sessions
    FOR SELECT USING (is_user_admin(auth.uid()));

-- إدراج البيانات التجريبية
-- ========================================

-- إدراج المنتجات
INSERT INTO products (name, description, warranty_period_months) VALUES
('مكيف هواء 1.5 طن', 'مكيف هواء عالي الكفاءة مع ضمان شامل', 24),
('مكيف هواء 2 طن', 'مكيف هواء عالي الكفاءة مع ضمان شامل', 24),
('ثلاجة 300 لتر', 'ثلاجة بفريزر علوي مع ضمان شامل', 36),
('ثلاجة 400 لتر', 'ثلاجة بفريزر سفلي مع ضمان شامل', 36),
('غسالة ملابس 7 كيلو', 'غسالة ملابس أوتوماتيكية مع ضمان شامل', 24),
('غسالة ملابس 8 كيلو', 'غسالة ملابس أوتوماتيكية مع ضمان شامل', 24),
('فرن كهربائي', 'فرن كهربائي متعدد الوظائف مع ضمان شامل', 12),
('ميكروويف', 'ميكروويف سعة 30 لتر مع ضمان شامل', 12),
('سخان مياه', 'سخان مياه كهربائي مع ضمان شامل', 24),
('مجفف ملابس', 'مجفف ملابس أوتوماتيكي مع ضمان شامل', 24)
ON CONFLICT DO NOTHING;

-- إعطاء الصلاحيات
-- ========================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- رسالة النجاح
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '🎉 تم إعداد قاعدة البيانات الكامل بنجاح!';
    RAISE NOTICE '✅ تم تنظيف جميع البيانات القديمة';
    RAISE NOTICE '✅ تم إنشاء جميع الجداول والوظائف';
    RAISE NOTICE '✅ تم تطبيق سياسات RLS آمنة';
    RAISE NOTICE '✅ تم إدراج البيانات التجريبية';
    RAISE NOTICE '✅ تم إعداد جميع الفهارس والأداء';
    RAISE NOTICE '✅ تم إصلاح جميع الأخطاء السابقة';
    RAISE NOTICE '✅ تم إزالة نظام الحظر بعد 5 محاولات';
    RAISE NOTICE '📋 النظام جاهز للاستخدام!';
    RAISE NOTICE '🔧 الخطوة التالية: إنشاء المستخدمين في Supabase Auth';
    RAISE NOTICE '🚀 يمكنك الآن تشغيل التطبيق!';
END $$;
