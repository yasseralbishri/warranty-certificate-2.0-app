-- إعداد قاعدة البيانات الكاملة لنظام الضمانات
-- نفذ هذا الملف في Supabase SQL Editor

-- تفعيل المكونات المطلوبة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- حذف الجداول الموجودة (إذا كانت موجودة)
DROP TABLE IF EXISTS warranties CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- إنشاء جدول المنتجات
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول العملاء
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول ملفات المستخدمين
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الضمانات
CREATE TABLE warranties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    warranty_number VARCHAR(100) UNIQUE NOT NULL,
    purchase_date DATE NOT NULL,
    warranty_start_date DATE NOT NULL,
    warranty_end_date DATE NOT NULL,
    warranty_duration_months INTEGER NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_invoice ON customers(invoice_number);
CREATE INDEX idx_warranties_customer ON warranties(customer_id);
CREATE INDEX idx_warranties_product ON warranties(product_id);
CREATE INDEX idx_warranties_number ON warranties(warranty_number);
CREATE INDEX idx_warranties_dates ON warranties(warranty_start_date, warranty_end_date);

-- تفعيل Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- إنشاء السياسات الأمنية
-- سياسات المنتجات
CREATE POLICY "السماح للمستخدمين المصادق عليهم بإدارة المنتجات" ON products
    FOR ALL USING (auth.role() = 'authenticated');

-- سياسات العملاء
CREATE POLICY "السماح للمستخدمين المصادق عليهم بإدارة العملاء" ON customers
    FOR ALL USING (auth.role() = 'authenticated');

-- سياسات الضمانات
CREATE POLICY "السماح للمستخدمين المصادق عليهم بإدارة الضمانات" ON warranties
    FOR ALL USING (auth.role() = 'authenticated');

-- سياسات ملفات المستخدمين
CREATE POLICY "المستخدمون يمكنهم رؤية ملفاتهم فقط" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "المديرون يمكنهم إدارة جميع ملفات المستخدمين" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ربط الدالة بالجداول
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warranties_updated_at BEFORE UPDATE ON warranties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إنشاء دالة لإنشاء ملف المستخدم تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ربط الدالة بجدول auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- إدراج بيانات المنتجات الافتراضية
INSERT INTO products (name, description) VALUES
('شركة أبل', 'شركة تقنية أمريكية متخصصة في الأجهزة الإلكترونية'),
('شركة سامسونج', 'شركة كورية جنوبية متخصصة في الإلكترونيات والهواتف'),
('شركة مايكروسوفت', 'شركة تقنية أمريكية متخصصة في البرمجيات والحوسبة'),
('شركة ديل', 'شركة أمريكية متخصصة في أجهزة الكمبيوتر والخوادم'),
('شركة إتش بي', 'شركة أمريكية متخصصة في أجهزة الكمبيوتر والطابعات'),
('شركة لينوفو', 'شركة صينية متخصصة في أجهزة الكمبيوتر والأجهزة المحمولة'),
('شركة آسوس', 'شركة تايوانية متخصصة في أجهزة الكمبيوتر والمكونات'),
('شركة سوني', 'شركة يابانية متخصصة في الإلكترونيات والترفيه'),
('شركة كانون', 'شركة يابانية متخصصة في الكاميرات والطابعات'),
('شركة إنتل', 'شركة أمريكية متخصصة في معالجات الكمبيوتر');

-- رسالة نجاح
SELECT 'تم إنشاء قاعدة البيانات بنجاح! 🎉' as message;
