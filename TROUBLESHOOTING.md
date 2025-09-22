# حل مشاكل الاتصال بـ Supabase

## 🚨 **مشكلة: "لم يتم العثور على خادم باسم المضيف المحدد"**

### **السبب:**
- URL أو API Key غير صحيح
- مشكلة في متغيرات البيئة
- مشكلة في إعدادات Supabase

### **الحل:**

#### **1. التحقق من بيانات Supabase:**
1. اذهب إلى **Supabase Dashboard**
2. انقر على **Settings > API**
3. تأكد من نسخ البيانات الصحيحة:
   - **Project URL:** `https://xxxxxxxxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### **2. التحقق من ملف .env:**
```env
# تأكد من عدم وجود مسافات إضافية
VITE_SUPABASE_URL=https://xxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ❌ خطأ - لا تضع مسافات
VITE_SUPABASE_URL = https://xxxxxxxxx.supabase.co

# ❌ خطأ - لا تضع علامات اقتباس
VITE_SUPABASE_URL="https://xxxxxxxxx.supabase.co"
```

#### **3. التحقق من صحة URL:**
- تأكد من أن URL يبدأ بـ `https://`
- تأكد من أن URL ينتهي بـ `.supabase.co`
- تأكد من عدم وجود مسافات أو أحرف إضافية

#### **4. إعادة تشغيل التطبيق:**
```bash
# أوقف التطبيق (Ctrl+C)
# ثم أعد تشغيله
npm run dev
```

#### **5. التحقق من حالة المشروع:**
1. في Supabase Dashboard، تأكد من أن المشروع نشط
2. إذا كان المشروع معلق، فعّله
3. تحقق من أن المشروع لم ينته صلاحيته

### **خطوات التشخيص:**

#### **1. اختبار الاتصال:**
```bash
# في terminal
curl -I https://your-project.supabase.co
```

#### **2. التحقق من متغيرات البيئة:**
```javascript
// أضف هذا في console.log في App.tsx مؤقتاً
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
```

#### **3. إنشاء ملف .env جديد:**
```bash
# احذف ملف .env القديم
rm .env

# أنشئ ملف جديد
touch .env

# أضف البيانات الصحيحة
echo "VITE_SUPABASE_URL=https://your-project.supabase.co" >> .env
echo "VITE_SUPABASE_ANON_KEY=your_anon_key_here" >> .env
```

### **إذا استمرت المشكلة:**

#### **1. إنشاء مشروع جديد:**
- اذهب إلى Supabase Dashboard
- أنشئ مشروع جديد
- احصل على URL و API Key جديد
- حدث ملف .env

#### **2. التحقق من إعدادات المشروع:**
1. **Settings > API**
2. تأكد من أن **Project URL** صحيح
3. تأكد من أن **anon public key** صحيح

#### **3. التحقق من إعدادات Authentication:**
1. **Authentication > Settings**
2. تأكد من تفعيل **Enable email confirmations**
3. في **URL Configuration:**
   - **Site URL:** `http://localhost:5173`
   - **Redirect URLs:** `http://localhost:5173/**`

### **نموذج ملف .env صحيح:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.example_signature_here
```

### **رسائل الخطأ الشائعة:**

#### **"لم يتم العثور على خادم باسم المضيف المحدد":**
- URL غير صحيح أو المشروع غير موجود

#### **"CORS error":**
- مشكلة في إعدادات URL في Supabase

#### **"Invalid API key":**
- API Key غير صحيح أو منتهي الصلاحية

#### **"Project not found":**
- المشروع غير موجود أو محذوف

### **بعد حل المشكلة:**
1. أعد تشغيل التطبيق
2. جرب تسجيل الدخول
3. تأكد من عمل جميع الوظائف
