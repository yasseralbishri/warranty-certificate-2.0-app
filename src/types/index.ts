// Database types for Supabase
export interface Database {
  public: {
    Tables: {
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
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          invoice_number: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          invoice_number: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          invoice_number?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      warranties: {
        Row: {
          id: string
          customer_id: string
          product_id: string
          warranty_number: string
          purchase_date: string
          warranty_start_date: string
          warranty_end_date: string
          warranty_duration_months: number
          notes: string | null
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          product_id: string
          warranty_number: string
          purchase_date: string
          warranty_start_date: string
          warranty_end_date: string
          warranty_duration_months: number
          notes?: string | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          product_id?: string
          warranty_number?: string
          purchase_date?: string
          warranty_start_date?: string
          warranty_end_date?: string
          warranty_duration_months?: number
          notes?: string | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Application types
export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'user'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  invoice_number: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Warranty {
  id: string
  customer_id: string
  product_id: string
  warranty_number: string
  purchase_date: string
  warranty_start_date: string
  warranty_end_date: string
  warranty_duration_months: number
  notes: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
  customer?: Customer
  product?: Product
  created_by_user?: User
  updated_by_user?: User
}

export interface WarrantyFormData {
  customerName: string
  phoneNumber: string
  invoiceNumber: string
  selectedProducts: string[]
  warrantyDuration: 'per_product' | 'per_invoice'
  warrantyPeriod: number // in months
  userId?: string
}

export interface WarrantySearchParams {
  invoiceNumber?: string
  phoneNumber?: string
}

// Error types
export interface AppError {
  message: string
  code?: string
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown'
  originalError?: any
}

export interface AuthError {
  message: string
  code?: string
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown'
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

export interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  error?: string | null
}

