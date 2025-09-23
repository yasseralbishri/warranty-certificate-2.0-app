# ملفات Supabase

## الملفات المتاحة:

### 1. `supabase-simple.ts` - البسيط
```typescript
import { supabase } from '@/lib/supabase-simple'
```
- **الاستخدام:** للاستخدام البسيط والسريع
- **المميزات:** كود قصير ومباشر
- **العيوب:** لا يحتوي على تحقق من متغيرات البيئة

### 2. `supabase-client.ts` - المتقدم
```typescript
import { supabase } from '@/lib/supabase-client'
```
- **الاستخدام:** للاستخدام المتقدم مع إعدادات مخصصة
- **المميزات:** 
  - تحقق من متغيرات البيئة
  - إعدادات مصادقة متقدمة
  - رسائل خطأ واضحة
- **العيوب:** كود أطول

### 3. `supabase.ts` - الكامل
```typescript
import { supabase, warrantyService, userService } from '@/lib/supabase'
```
- **الاستخدام:** للاستخدام الكامل مع جميع الخدمات
- **المميزات:**
  - جميع خدمات قاعدة البيانات
  - إدارة المستخدمين
  - إدارة شهادات الضمان
- **العيوب:** ملف كبير

## التوصية:

- **للمشاريع الصغيرة:** استخدم `supabase-simple.ts`
- **للمشاريع المتوسطة:** استخدم `supabase-client.ts`
- **للمشاريع الكبيرة:** استخدم `supabase.ts`

## مثال على الاستخدام:

```typescript
// استيراد العميل البسيط
import { supabase } from '@/lib/supabase-simple'

// استخدام العميل
const { data, error } = await supabase
  .from('products')
  .select('*')
```
