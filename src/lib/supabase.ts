import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logs for development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.log('🔧 [Supabase] Initializing Supabase client...')
  console.log('🔧 [Supabase] URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('🔧 [Supabase] Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
}

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = []
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL')
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY')
  
  const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file or Vercel settings.`
  console.error('❌ [Supabase]', errorMessage)
  throw new Error(errorMessage)
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  const errorMessage = 'Invalid Supabase URL format. Must start with https:// and end with .supabase.co'
  console.error('❌ [Supabase]', errorMessage)
  throw new Error(errorMessage)
}

// Validate key format
if (!supabaseAnonKey.startsWith('eyJ') && !supabaseAnonKey.startsWith('sb_')) {
  const errorMessage = 'Invalid Supabase key format. Must start with eyJ or sb_'
  console.error('❌ [Supabase]', errorMessage)
  throw new Error(errorMessage)
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic session refresh
    autoRefreshToken: true,
    // Persist session in localStorage
    persistSession: true,
    // Detect session in URL (for OAuth flows)
    detectSessionInUrl: true,
    // Storage key for session
    storageKey: 'sb-warranty-session',
    // Storage implementation
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    // Flow type for authentication
    flowType: 'pkce'
  },
  // Global configuration
  global: {
    headers: {
      'X-Client-Info': 'warranty-app'
    }
  }
})

// Helper functions for database operations
export const warrantyService = {

  // Get all products
  async getProducts() {
    console.log('🔄 [getProducts] Fetching products from Supabase...')
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('💥 [getProducts] Error fetching products:', error)
      throw error
    }
    
    console.log('✅ [getProducts] Products fetched successfully, count:', data?.length || 0)
    return data
  },

  // Get all warranties with related data
  async getWarranties() {
    console.log('🔄 [getWarranties] Fetching warranties from Supabase...')
    
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
    
    if (error) {
      console.error('💥 [getWarranties] Error fetching warranties:', error)
      throw error
    }
    
    console.log('✅ [getWarranties] Warranties fetched successfully, count:', data?.length || 0)
    return data
  },

  // Create a new customer
  async createCustomer(customer: Database['public']['Tables']['customers']['Insert']) {
    console.log('🔄 [createCustomer] Creating new customer in Supabase...', customer)
    
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single()
    
    if (error) {
      console.error('💥 [createCustomer] Error creating customer:', error)
      throw error
    }
    
    console.log('✅ [createCustomer] Customer created successfully:', data)
    return data
  },

  // Create warranties for a customer
  async createWarranties(warranties: Database['public']['Tables']['warranties']['Insert'][], userId?: string) {
    console.log('🔄 [createWarranties] Creating warranties in Supabase...', warranties)
    
    // Add created_by field if userId is provided
    const warrantiesWithUser = warranties.map(warranty => ({
      ...warranty,
      created_by: userId || undefined
    }))

    const { data, error } = await supabase
      .from('warranties')
      .insert(warrantiesWithUser)
      .select()
    
    if (error) {
      console.error('💥 [createWarranties] Error creating warranties:', error)
      throw error
    }
    
    console.log('✅ [createWarranties] Warranties created successfully, count:', data?.length || 0)
    return data
  },

  // Search warranties by invoice number or phone
  async searchWarranties(params: { invoiceNumber?: string; phoneNumber?: string }) {
    console.log('🔄 [searchWarranties] Searching warranties in Supabase...', params)
    
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
    
    if (error) {
      console.error('💥 [searchWarranties] Error searching warranties:', error)
      throw error
    }
    
    console.log('✅ [searchWarranties] Search completed successfully, count:', data?.length || 0)
    return data
  },

  // Delete warranty
  async deleteWarranty(warrantyId: string) {
    console.log('🔄 [deleteWarranty] Deleting warranty from Supabase...', warrantyId)
    
    const { error } = await supabase
      .from('warranties')
      .delete()
      .eq('id', warrantyId)
    
    if (error) {
      console.error('💥 [deleteWarranty] Error deleting warranty:', error)
      throw error
    }
    
    console.log('✅ [deleteWarranty] Warranty deleted successfully')
    return true
  },

  // Delete customer and all their warranties
  async deleteCustomer(customerId: string) {
    console.log('🔄 [deleteCustomer] Deleting customer and all warranties from Supabase...', customerId)
    
    // First delete all warranties for this customer
    const { error: warrantiesError } = await supabase
      .from('warranties')
      .delete()
      .eq('customer_id', customerId)
    
    if (warrantiesError) {
      console.error('💥 [deleteCustomer] Error deleting warranties:', warrantiesError)
      throw warrantiesError
    }

    // Then delete the customer
    const { error: customerError } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId)
    
    if (customerError) {
      console.error('💥 [deleteCustomer] Error deleting customer:', customerError)
      throw customerError
    }
    
    console.log('✅ [deleteCustomer] Customer and all warranties deleted successfully')
    return true
  },

  // Update customer information
  async updateCustomer(customerId: string, updates: Database['public']['Tables']['customers']['Update']) {
    console.log('🔄 [updateCustomer] Updating customer in Supabase...', { customerId, updates })
    
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', customerId)
      .select()
      .single()
    
    if (error) {
      console.error('💥 [updateCustomer] Error updating customer:', error)
      throw error
    }
    
    console.log('✅ [updateCustomer] Customer updated successfully:', data)
    return data
  },

  // Update warranty
  async updateWarranty(warrantyId: string, updates: Database['public']['Tables']['warranties']['Update'], userId?: string) {
    console.log('🔄 [updateWarranty] Updating warranty in Supabase...', { warrantyId, updates, userId })
    
    const updatesWithUser: Database['public']['Tables']['warranties']['Update'] = {
      ...updates,
      updated_by: userId || undefined
    }

    const { data, error } = await supabase
      .from('warranties')
      .update(updatesWithUser)
      .eq('id', warrantyId)
      .select()
      .single()
    
    if (error) {
      console.error('💥 [updateWarranty] Error updating warranty:', error)
      throw error
    }
    
    console.log('✅ [updateWarranty] Warranty updated successfully:', data)
    return data
  },

  // Initialize sample data
  async initializeSampleData() {
    console.log('🔄 [initializeSampleData] Initializing sample data in Supabase...')
    
    // Check if products already exist
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (existingProducts && existingProducts.length > 0) {
      console.log('✅ [initializeSampleData] Data already exists, no need to initialize')
      return // Data already exists
    }

    const { error: productsError } = await supabase
      .from('products')
      .insert(SAMPLE_PRODUCTS)

    if (productsError) {
      console.error('💥 [initializeSampleData] Error inserting sample products:', productsError)
    } else {
      console.log('✅ [initializeSampleData] Sample products inserted successfully')
    }
  }
}

// User management functions
export const userService = {
  // Get all users
  async getAllUsers() {
    console.log('🔄 [getAllUsers] Fetching all users from Supabase...')
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('💥 [getAllUsers] Error fetching users:', error)
      throw error
    }
    
    console.log('✅ [getAllUsers] Users fetched successfully, count:', data?.length || 0)
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
      throw new Error(`User creation error: ${authError.message}`)
    }
    
    if (!authData.user) {
      throw new Error('Failed to create user - no user data returned')
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
<<<<<<< Current (Your changes)
=======

// Sample products data
const SAMPLE_PRODUCTS = [
  { name: 'مكيف هواء', description: 'مكيف هواء منزلي', warranty_period_months: 24 },
  { name: 'غسالة', description: 'غسالة ملابس', warranty_period_months: 36 },
  { name: 'ثلاجة', description: 'ثلاجة منزلية', warranty_period_months: 24 },
  { name: 'فرن', description: 'فرن كهربائي', warranty_period_months: 12 },
  { name: 'ميكروويف', description: 'فرن ميكروويف', warranty_period_months: 12 }
]

// Database types (you may need to generate these from your Supabase schema)
export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          email?: string
          address?: string
          invoice_number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string
          address?: string
          invoice_number: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string
          address?: string
          invoice_number?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description?: string
          warranty_period_months: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          warranty_period_months: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          warranty_period_months?: number
          created_at?: string
          updated_at?: string
        }
      }
      warranties: {
        Row: {
          id: string
          customer_id: string
          product_id: string
          warranty_start_date: string
          warranty_end_date: string
          created_by?: string
          updated_by?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          product_id: string
          warranty_start_date: string
          warranty_end_date: string
          created_by?: string
          updated_by?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          product_id?: string
          warranty_start_date?: string
          warranty_end_date?: string
          created_by?: string
          updated_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'user'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: 'admin' | 'user'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'user'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

console.log('✅ [Supabase] Client initialized successfully')
>>>>>>> Incoming (Background Agent changes)
