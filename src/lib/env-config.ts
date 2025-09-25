// Environment configuration and validation
export interface EnvironmentConfig {
  supabase: {
    url: string
    anonKey: string
    isValid: boolean
  }
  app: {
    name: string
    version: string
    debugMode: boolean
    logLevel: 'error' | 'warn' | 'info' | 'debug'
    enableDevtools: boolean
  }
  isProduction: boolean
  isDevelopment: boolean
}

function validateSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const errors: string[] = []
  
  if (!url) {
    errors.push('VITE_SUPABASE_URL is missing')
  } else if (!url.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must start with https://')
  } else if (!url.includes('.supabase.co')) {
    errors.push('VITE_SUPABASE_URL must be a valid Supabase URL')
  }

  if (!anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is missing')
  } else if (!anonKey.startsWith('eyJ') && !anonKey.startsWith('sb_')) {
    errors.push('VITE_SUPABASE_ANON_KEY must be a valid Supabase key')
  }

  const isValid = errors.length === 0

  if (!isValid) {
    console.error('❌ [Environment] Supabase configuration errors:', errors)
  }

  return {
    url: url || 'https://placeholder.supabase.co',
    anonKey: anonKey || 'placeholder-key',
    isValid
  }
}

function getAppConfig() {
  return {
    name: import.meta.env.VITE_APP_NAME || 'نظام إدارة شهادات الضمان',
    version: import.meta.env.VITE_APP_VERSION || '2.0.0',
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
    logLevel: (import.meta.env.VITE_LOG_LEVEL as any) || 'info',
    enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true'
  }
}

export function getEnvironmentConfig(): EnvironmentConfig {
  const isProduction = import.meta.env.PROD
  const isDevelopment = import.meta.env.DEV

  return {
    supabase: validateSupabaseConfig(),
    app: getAppConfig(),
    isProduction,
    isDevelopment
  }
}

// Export the configuration
export const envConfig = getEnvironmentConfig()

// Log configuration in development
if (envConfig.isDevelopment) {
  console.log('🔧 [Environment] Configuration loaded:', {
    supabase: {
      url: envConfig.supabase.url,
      isValid: envConfig.supabase.isValid
    },
    app: envConfig.app,
    environment: {
      isProduction: envConfig.isProduction,
      isDevelopment: envConfig.isDevelopment
    }
  })
}

// Validation function for runtime checks
export function validateEnvironment(): boolean {
  const config = getEnvironmentConfig()
  
  if (!config.supabase.isValid) {
    console.error('❌ [Environment] Invalid Supabase configuration')
    return false
  }

  if (config.isProduction && config.app.debugMode) {
    console.warn('⚠️ [Environment] Debug mode is enabled in production')
  }

  return true
}

// Helper function to check if we're in a valid environment
export function isEnvironmentValid(): boolean {
  return validateEnvironment()
}
