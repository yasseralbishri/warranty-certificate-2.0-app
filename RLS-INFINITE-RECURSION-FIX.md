# 🔧 إصلاح مشكلة التكرار اللانهائي في سياسات RLS

## 🚨 المشكلة

```
infinite recursion detected in policy for relation "user_profiles"
```

هذه المشكلة تحدث عندما تكون سياسات Row Level Security (RLS) تحتوي على مراجع دائرية أو عندما تحاول السياسة الوصول إلى نفس الجدول الذي تحميه.

## 🔍 أسباب المشكلة

1. **سياسات RLS معقدة**: سياسات تحاول الوصول إلى `user_profiles` من داخل سياسة `user_profiles`
2. **مراجع دائرية**: السياسة تحاول قراءة نفس الجدول الذي تحميه
3. **سياسات مفقودة**: جدول له RLS مفعل لكن بدون سياسات واضحة
4. **سياسات متضاربة**: سياسات متعددة تتعارض مع بعضها

## ✅ الحلول

### الحل الأول: إصلاح السياسات الموجودة

1. **اذهب إلى Supabase Dashboard**
2. **افتح SQL Editor**
3. **انسخ والصق محتوى `fix-rls-policies.sql`**
4. **اضغط Run**

```sql
-- هذا الملف يحتوي على إصلاح شامل للسياسات
-- fix-rls-policies.sql
```

### الحل الثاني: إعادة إنشاء قاعدة البيانات (إذا كان لديك نسخة احتياطية)

1. **احذف جميع الجداول**
2. **استخدم `database-setup-fixed.sql`**
3. **أعد إنشاء قاعدة البيانات من الصفر**

### الحل الثالث: إصلاح تدريجي

#### الخطوة 1: حذف جميع السياسات
```sql
-- حذف جميع السياسات الموجودة
DROP POLICY IF EXISTS "السماح للمستخدمين المصادق عليهم بإدارة المنتجات" ON products;
DROP POLICY IF EXISTS "السماح للمستخدمين المصادق عليهم بإدارة العملاء" ON customers;
DROP POLICY IF EXISTS "السماح للمستخدمين المصادق عليهم بإدارة الضمانات" ON warranties;
DROP POLICY IF EXISTS "السماح للمستخدمين المصادق عليهم بإدارة ملفات المستخدمين" ON user_profiles;
```

#### الخطوة 2: إنشاء سياسات بسيطة وآمنة
```sql
-- سياسات بسيطة بدون تعقيدات
CREATE POLICY "user_profiles_select_policy" ON user_profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "user_profiles_insert_policy" ON user_profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "user_profiles_update_policy" ON user_profiles
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "user_profiles_delete_policy" ON user_profiles
    FOR DELETE USING (auth.role() = 'authenticated');
```

## 🛠️ خطوات الإصلاح المفصلة

### 1. فتح Supabase Dashboard
- اذهب إلى [supabase.com/dashboard](https://supabase.com/dashboard)
- اختر مشروعك
- اذهب إلى **SQL Editor**

### 2. تشغيل إصلاح السياسات
```sql
-- نسخ والصق محتوى fix-rls-policies.sql
-- اضغط Run
```

### 3. التحقق من الإصلاح
```sql
-- تحقق من السياسات الموجودة
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';
```

### 4. اختبار الوصول
```sql
-- اختبار قراءة البيانات
SELECT * FROM user_profiles LIMIT 1;
```

## 🔒 أفضل الممارسات لسياسات RLS

### 1. سياسات بسيطة
```sql
-- ✅ جيد - بسيط وآمن
CREATE POLICY "simple_select" ON table_name
    FOR SELECT USING (auth.role() = 'authenticated');

-- ❌ سيء - معقد وقد يسبب مشاكل
CREATE POLICY "complex_select" ON table_name
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM another_table 
            WHERE condition = 'complex'
        )
    );
```

### 2. تجنب المراجع الدائرية
```sql
-- ❌ سيء - مرجع دائري
CREATE POLICY "circular_policy" ON user_profiles
    FOR SELECT USING (
        id IN (
            SELECT id FROM user_profiles 
            WHERE role = 'admin'
        )
    );

-- ✅ جيد - بدون مراجع دائرية
CREATE POLICY "simple_policy" ON user_profiles
    FOR SELECT USING (auth.role() = 'authenticated');
```

### 3. استخدام auth.role() بدلاً من auth.uid()
```sql
-- ✅ جيد - بسيط وموثوق
CREATE POLICY "authenticated_users" ON table_name
    FOR ALL USING (auth.role() = 'authenticated');

-- ⚠️ احذر - قد يسبب مشاكل مع user_profiles
CREATE POLICY "own_data_only" ON user_profiles
    FOR ALL USING (auth.uid() = id);
```

## 🧪 اختبار الإصلاح

### 1. اختبار محلي
```bash
# تشغيل اختبار التكامل
npm run test-integration

# تشغيل التطبيق
npm run dev
```

### 2. اختبار في Supabase
```sql
-- اختبار إنشاء مستخدم جديد
INSERT INTO user_profiles (id, email, full_name, role, is_active)
VALUES (
    gen_random_uuid(),
    'test@example.com',
    'مستخدم تجريبي',
    'user',
    true
);

-- اختبار قراءة البيانات
SELECT * FROM user_profiles WHERE email = 'test@example.com';

-- اختبار تحديث البيانات
UPDATE user_profiles 
SET full_name = 'مستخدم محدث' 
WHERE email = 'test@example.com';

-- اختبار حذف البيانات
DELETE FROM user_profiles WHERE email = 'test@example.com';
```

## 🚨 علامات التحذير

### تجنب هذه الأنماط:
```sql
-- ❌ مراجع دائرية
CREATE POLICY "bad_policy" ON user_profiles
    FOR SELECT USING (
        id IN (SELECT id FROM user_profiles WHERE ...)
    );

-- ❌ استعلامات معقدة
CREATE POLICY "complex_policy" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM warranties w
            JOIN customers c ON w.customer_id = c.id
            WHERE c.created_by = user_profiles.id
        )
    );

-- ❌ مراجع لـ auth.users مباشرة
CREATE POLICY "auth_users_policy" ON user_profiles
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE ...)
    );
```

## 📋 قائمة التحقق بعد الإصلاح

- [ ] تم حذف جميع السياسات القديمة
- [ ] تم إنشاء سياسات جديدة بسيطة
- [ ] تم اختبار قراءة البيانات
- [ ] تم اختبار كتابة البيانات
- [ ] تم اختبار التطبيق محلياً
- [ ] لا توجد أخطاء في Console
- [ ] يعمل تسجيل الدخول بشكل صحيح
- [ ] يعمل إنشاء شهادات الضمان

## 🔄 في حالة استمرار المشكلة

### 1. إعادة تعيين كامل
```sql
-- حذف جميع السياسات والجداول
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- إعادة إنشاء من الصفر
-- استخدم database-setup-fixed.sql
```

### 2. التحقق من الإعدادات
- تأكد من أن RLS مفعل فقط للجداول المطلوبة
- تحقق من أن السياسات لا تحتوي على مراجع دائرية
- تأكد من أن auth.role() يعمل بشكل صحيح

### 3. طلب المساعدة
إذا استمرت المشكلة:
1. تحقق من [Supabase Documentation](https://supabase.com/docs/guides/auth/row-level-security)
2. راجع [Troubleshooting Guide](./TROUBLESHOOTING.md)
3. استخدم أدوات التشخيص المدمجة

---

## 🎯 الخلاصة

مشكلة التكرار اللانهائي في سياسات RLS عادة ما تكون بسبب:
1. **سياسات معقدة** تحتوي على مراجع دائرية
2. **سياسات مفقودة** لجدول له RLS مفعل
3. **مراجع لـ auth.users** من داخل سياسات user_profiles

**الحل**: استخدام سياسات بسيطة وآمنة تعتمد على `auth.role() = 'authenticated'` بدلاً من استعلامات معقدة.

بعد تطبيق الإصلاح، يجب أن يعمل التطبيق بدون مشاكل! 🎉
