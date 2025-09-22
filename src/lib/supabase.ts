import { supabase } from './supabase-client'

// Re-export supabase client for backward compatibility
export { supabase }

// Helper functions for database operations
export const warrantyService = {

  // Get all products
  async getProducts() {
    console.log('🔄 [getProducts] بدء جلب المنتجات من Supabase...')
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')
    
    console.log('📊 [getProducts] البيانات المستلمة:', data)
    console.log('❌ [getProducts] الأخطاء:', error)
    
    if (error) {
      console.error('💥 [getProducts] خطأ في جلب المنتجات:', error)
      throw error
    }
    
    console.log('✅ [getProducts] تم جلب المنتجات بنجاح، العدد:', data?.length || 0)
    return data
  },

  // Get all warranties with related data
  async getWarranties() {
    console.log('🔄 [getWarranties] بدء جلب شهادات الضمان من Supabase...')
    
    const { data, error } = await supabase
      .from('warranties')
      .select(`
        *,
        customer:customers(*),
        product:products(*),
        created_by_user:user_profiles!created_by(*),
        updated_by_user:user_profiles!updated_by(*)
      `)
      .order('created_at', { ascending: false })
    
    console.log('📊 [getWarranties] البيانات المستلمة:', data)
    console.log('❌ [getWarranties] الأخطاء:', error)
    
    if (error) {
      console.error('💥 [getWarranties] خطأ في جلب شهادات الضمان:', error)
      throw error
    }
    
    console.log('✅ [getWarranties] تم جلب شهادات الضمان بنجاح، العدد:', data?.length || 0)
    return data
  },

  // Create a new customer
  async createCustomer(customer: Database['public']['Tables']['customers']['Insert']) {
    console.log('🔄 [createCustomer] بدء إنشاء عميل جديد في Supabase...', customer)
    
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single()
    
    console.log('📊 [createCustomer] البيانات المستلمة:', data)
    console.log('❌ [createCustomer] الأخطاء:', error)
    
    if (error) {
      console.error('💥 [createCustomer] خطأ في إنشاء العميل:', error)
      throw error
    }
    
    console.log('✅ [createCustomer] تم إنشاء العميل بنجاح:', data)
    return data
  },

  // Create warranties for a customer
  async createWarranties(warranties: Database['public']['Tables']['warranties']['Insert'][], userId?: string) {
    console.log('🔄 [createWarranties] بدء إنشاء شهادات ضمان في Supabase...', warranties)
    
    // Add created_by field if userId is provided
    const warrantiesWithUser = warranties.map(warranty => ({
      ...warranty,
      created_by: userId || null
    }))

    const { data, error } = await supabase
      .from('warranties')
      .insert(warrantiesWithUser)
      .select()
    
    console.log('📊 [createWarranties] البيانات المستلمة:', data)
    console.log('❌ [createWarranties] الأخطاء:', error)
    
    if (error) {
      console.error('💥 [createWarranties] خطأ في إنشاء شهادات الضمان:', error)
      throw error
    }
    
    console.log('✅ [createWarranties] تم إنشاء شهادات الضمان بنجاح، العدد:', data?.length || 0)
    return data
  },

  // Search warranties by invoice number or phone
  async searchWarranties(params: { invoiceNumber?: string; phoneNumber?: string }) {
    console.log('🔄 [searchWarranties] بدء البحث عن شهادات الضمان في Supabase...', params)
    
    let query = supabase
      .from('warranties')
      .select(`
        *,
        customer:customers(*),
        product:products(*),
        created_by_user:user_profiles!created_by(*),
        updated_by_user:user_profiles!updated_by(*)
      `)

    if (params.invoiceNumber) {
      query = query.eq('customer.invoice_number', params.invoiceNumber)
    }
    
    if (params.phoneNumber) {
      query = query.eq('customer.phone', params.phoneNumber)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    console.log('📊 [searchWarranties] البيانات المستلمة:', data)
    console.log('❌ [searchWarranties] الأخطاء:', error)
    
    if (error) {
      console.error('💥 [searchWarranties] خطأ في البحث عن شهادات الضمان:', error)
      throw error
    }
    
    console.log('✅ [searchWarranties] تم البحث بنجاح، العدد:', data?.length || 0)
    return data
  },

  // Delete warranty
  async deleteWarranty(warrantyId: string) {
    console.log('🔄 [deleteWarranty] بدء حذف شهادة الضمان من Supabase...', warrantyId)
    
    const { error } = await supabase
      .from('warranties')
      .delete()
      .eq('id', warrantyId)
    
    console.log('❌ [deleteWarranty] الأخطاء:', error)
    
    if (error) {
      console.error('💥 [deleteWarranty] خطأ في حذف شهادة الضمان:', error)
      throw error
    }
    
    console.log('✅ [deleteWarranty] تم حذف شهادة الضمان بنجاح')
    return true
  },

  // Delete customer and all their warranties
  async deleteCustomer(customerId: string) {
    console.log('🔄 [deleteCustomer] بدء حذف العميل وجميع شهادات الضمان من Supabase...', customerId)
    
    // First delete all warranties for this customer
    const { error: warrantiesError } = await supabase
      .from('warranties')
      .delete()
      .eq('customer_id', customerId)
    
    console.log('❌ [deleteCustomer] أخطاء حذف شهادات الضمان:', warrantiesError)
    
    if (warrantiesError) {
      console.error('💥 [deleteCustomer] خطأ في حذف شهادات الضمان:', warrantiesError)
      throw warrantiesError
    }

    // Then delete the customer
    const { error: customerError } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId)
    
    console.log('❌ [deleteCustomer] أخطاء حذف العميل:', customerError)
    
    if (customerError) {
      console.error('💥 [deleteCustomer] خطأ في حذف العميل:', customerError)
      throw customerError
    }
    
    console.log('✅ [deleteCustomer] تم حذف العميل وجميع شهادات الضمان بنجاح')
    return true
  },

  // Update customer information
  async updateCustomer(customerId: string, updates: Database['public']['Tables']['customers']['Update']) {
    console.log('🔄 [updateCustomer] بدء تحديث بيانات العميل في Supabase...', { customerId, updates })
    
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', customerId)
      .select()
      .single()
    
    console.log('📊 [updateCustomer] البيانات المستلمة:', data)
    console.log('❌ [updateCustomer] الأخطاء:', error)
    
    if (error) {
      console.error('💥 [updateCustomer] خطأ في تحديث بيانات العميل:', error)
      throw error
    }
    
    console.log('✅ [updateCustomer] تم تحديث بيانات العميل بنجاح:', data)
    return data
  },

  // Update warranty
  async updateWarranty(warrantyId: string, updates: Database['public']['Tables']['warranties']['Update'], userId?: string) {
    console.log('🔄 [updateWarranty] بدء تحديث شهادة الضمان في Supabase...', { warrantyId, updates, userId })
    
    const updatesWithUser: Database['public']['Tables']['warranties']['Update'] = {
      ...updates,
      updated_by: userId || null
    }

    const { data, error } = await supabase
      .from('warranties')
      .update(updatesWithUser)
      .eq('id', warrantyId)
      .select()
      .single()
    
    console.log('📊 [updateWarranty] البيانات المستلمة:', data)
    console.log('❌ [updateWarranty] الأخطاء:', error)
    
    if (error) {
      console.error('💥 [updateWarranty] خطأ في تحديث شهادة الضمان:', error)
      throw error
    }
    
    console.log('✅ [updateWarranty] تم تحديث شهادة الضمان بنجاح:', data)
    return data
  },

  // Initialize sample data
  async initializeSampleData() {
    console.log('🔄 [initializeSampleData] بدء تهيئة البيانات التجريبية في Supabase...')
    
    // Check if products already exist
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    console.log('📊 [initializeSampleData] المنتجات الموجودة:', existingProducts)

    if (existingProducts && existingProducts.length > 0) {
      console.log('✅ [initializeSampleData] البيانات موجودة بالفعل، لا حاجة للتهيئة')
      return // Data already exists
    }

    const { error: productsError } = await supabase
      .from('products')
      .insert(SAMPLE_PRODUCTS)

    console.log('❌ [initializeSampleData] أخطاء إدراج المنتجات التجريبية:', productsError)

    if (productsError) {
      console.error('💥 [initializeSampleData] خطأ في إدراج المنتجات التجريبية:', productsError)
    } else {
      console.log('✅ [initializeSampleData] تم إدراج المنتجات التجريبية بنجاح')
    }
  }
}

// User management functions
export const userService = {
  // Get all users
  async getAllUsers() {
    console.log('🔄 [getAllUsers] بدء جلب جميع المستخدمين من Supabase...')
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('📊 [getAllUsers] البيانات المستلمة:', data)
    console.log('❌ [getAllUsers] الأخطاء:', error)
    
    if (error) {
      console.error('💥 [getAllUsers] خطأ في جلب المستخدمين:', error)
      throw error
    }
    
    console.log('✅ [getAllUsers] تم جلب المستخدمين بنجاح، العدد:', data?.length || 0)
    return data
  },

  // Create new user (admin only)
  async createUser(email: string, password: string, fullName: string, role: 'admin' | 'user' = 'user') {
    // First, sign up the user normally
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    })

    if (authError) {
      console.error('Auth signup error:', authError)
      throw new Error(`خطأ في إنشاء المستخدم: ${authError.message}`)
    }
    
    if (!authData.user) {
      throw new Error('فشل في إنشاء المستخدم - لم يتم إرجاع بيانات المستخدم')
    }

    // Wait a moment for the user to be created
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update user profile with role
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ 
        role,
        full_name: fullName,
        is_active: true
      })
      .eq('id', authData.user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      // If updating profile fails, we still have the user created
      return {
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName,
        role: role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    return data
  },

  // Get user by ID
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Update user
  async updateUser(userId: string, updates: Database['public']['Tables']['user_profiles']['Update']) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete user
  async deleteUser(userId: string) {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId)
    
    if (error) throw error
    return true
  },

  // Toggle user status
  async toggleUserStatus(userId: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ is_active: !isActive })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Change user role
  async changeUserRole(userId: string, role: 'admin' | 'user') {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
