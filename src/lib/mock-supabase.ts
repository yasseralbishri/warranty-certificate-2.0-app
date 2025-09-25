// Mock Supabase service for testing when real Supabase is not available
import type { Database } from '@/types'

// Mock data
const mockProducts = [
  { id: '1', name: 'شركة أبل', description: 'شركة تقنية أمريكية متخصصة في الأجهزة الإلكترونية', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', name: 'شركة سامسونج', description: 'شركة كورية جنوبية متخصصة في الإلكترونيات والهواتف', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', name: 'شركة مايكروسوفت', description: 'شركة تقنية أمريكية متخصصة في البرمجيات والحوسبة', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', name: 'شركة ديل', description: 'شركة أمريكية متخصصة في أجهزة الكمبيوتر والخوادم', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', name: 'شركة إتش بي', description: 'شركة أمريكية متخصصة في أجهزة الكمبيوتر والطابعات', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
]

const mockCustomers: any[] = []
const mockWarranties: any[] = []
const mockUserProfiles: any[] = []

// Mock user for testing
const mockUser = {
  id: 'mock-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'مستخدم تجريبي'
  },
  created_at: new Date().toISOString()
}

// Mock Supabase client
export const mockSupabase = {
  auth: {
    getSession: async () => ({
      data: { session: { user: mockUser } },
      error: null
    }),
    getUser: async () => ({
      data: { user: mockUser },
      error: null
    }),
    signInWithPassword: async () => ({
      data: { user: mockUser, session: { user: mockUser } },
      error: null
    }),
    signOut: async () => ({
      error: null
    }),
    onAuthStateChange: (callback: any) => ({
      data: { subscription: { unsubscribe: () => {} } }
    })
  },
  from: (table: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          if (table === 'products') {
            const product = mockProducts.find(p => p[column as keyof typeof p] === value)
            return { data: product, error: product ? null : { code: 'PGRST116', message: 'Not found' } }
          } else if (table === 'user_profiles') {
            const profile = mockUserProfiles.find(p => p[column as keyof typeof p] === value)
            return { data: profile, error: profile ? null : { code: 'PGRST116', message: 'Not found' } }
          }
          return { data: null, error: { code: 'PGRST116', message: 'Not found' } }
        }
      }),
      limit: (count: number) => Promise.resolve({
        data: table === 'products' ? mockProducts.slice(0, count) : 
              table === 'customers' ? mockCustomers.slice(0, count) :
              table === 'warranties' ? mockWarranties.slice(0, count) :
              table === 'user_profiles' ? mockUserProfiles.slice(0, count) : [],
        error: null
      }),
      order: (column: string, options?: any) => Promise.resolve({
        data: table === 'products' ? mockProducts : 
              table === 'customers' ? mockCustomers :
              table === 'warranties' ? mockWarranties :
              table === 'user_profiles' ? mockUserProfiles : [],
        error: null
      }),
      then: (resolve: any) => {
        const data = table === 'products' ? mockProducts : 
                    table === 'customers' ? mockCustomers :
                    table === 'warranties' ? mockWarranties :
                    table === 'user_profiles' ? mockUserProfiles : []
        resolve({ data, error: null })
      },
      catch: (reject: any) => {
        reject({ data: null, error: { message: 'Mock error' } })
      }
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => {
          if (table === 'customers') {
            const newCustomer = {
              id: Date.now().toString(),
              ...data,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            mockCustomers.push(newCustomer)
            return { data: newCustomer, error: null }
          } else if (table === 'warranties') {
            const newWarranties = Array.isArray(data) ? data : [data]
            newWarranties.forEach((warranty: any) => {
              const newWarranty = {
                id: Date.now().toString() + Math.random(),
                ...warranty,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              mockWarranties.push(newWarranty)
            })
            return { data: newWarranties, error: null }
          } else if (table === 'user_profiles') {
            const newProfile = {
              id: data.id,
              email: data.email,
              full_name: data.full_name,
              role: data.role || 'user',
              is_active: data.is_active !== undefined ? data.is_active : true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            mockUserProfiles.push(newProfile)
            return { data: newProfile, error: null }
          }
          return { data: null, error: null }
        },
        async then(resolve: any) {
          if (table === 'warranties') {
            const newWarranties = Array.isArray(data) ? data : [data]
            newWarranties.forEach((warranty: any) => {
              const newWarranty = {
                id: Date.now().toString() + Math.random(),
                ...warranty,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              mockWarranties.push(newWarranty)
            })
            resolve({ data: newWarranties, error: null })
          } else {
            resolve({ data: [], error: null })
          }
        }
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => {
            if (table === 'customers') {
              const index = mockCustomers.findIndex(c => c[column] === value)
              if (index !== -1) {
                mockCustomers[index] = { ...mockCustomers[index], ...data, updated_at: new Date().toISOString() }
                return { data: mockCustomers[index], error: null }
              }
            }
            return { data: null, error: { code: 'PGRST116', message: 'Not found' } }
          }
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        async then(resolve: any) {
          if (table === 'customers') {
            const index = mockCustomers.findIndex(c => c[column] === value)
            if (index !== -1) {
              mockCustomers.splice(index, 1)
            }
          } else if (table === 'warranties') {
            const index = mockWarranties.findIndex(w => w[column] === value)
            if (index !== -1) {
              mockWarranties.splice(index, 1)
            }
          }
          resolve({ error: null })
        }
      })
    })
  })
}

// Mock connection check
export async function checkMockConnection() {
  return {
    isConnected: true,
    latency: 10
  }
}
