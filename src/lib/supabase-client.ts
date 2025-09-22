import { createClient } from '@supabase/supabase-js'
import { supabaseUrl, supabaseAnonKey } from './env-validation'

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
