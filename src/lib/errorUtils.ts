// Error handling utilities for consistent error detection and messaging

export interface AppError {
  message: string
  code?: string
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown'
  originalError?: any
}

/**
 * Comprehensive network error detection
 * Checks for various network-related error patterns
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false

  const errorMessage = error.message || error.toString() || ''
  const errorName = error.name || ''

  // Common network error patterns
  const networkPatterns = [
    'Failed to fetch',
    'NetworkError',
    'Network request failed',
    'Connection failed',
    'Connection refused',
    'Connection timeout',
    'Request timeout',
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    'ECONNRESET',
    'fetch failed',
    'net::ERR_',
    'ERR_NETWORK',
    'ERR_INTERNET_DISCONNECTED',
    'ERR_CONNECTION_REFUSED',
    'ERR_CONNECTION_TIMED_OUT',
    'ERR_CONNECTION_RESET',
    'ERR_NAME_NOT_RESOLVED',
    'ERR_ADDRESS_UNREACHABLE',
    'ERR_CONNECTION_ABORTED',
    'ERR_CONNECTION_CLOSED',
    'ERR_CONNECTION_FAILED',
    'ERR_CONNECTION_REFUSED',
    'ERR_CONNECTION_RESET',
    'ERR_CONNECTION_TIMED_OUT',
    'ERR_DISALLOWED_URL_SCHEME',
    'ERR_EMPTY_RESPONSE',
    'ERR_FAILED',
    'ERR_INTERNET_DISCONNECTED',
    'ERR_NAME_NOT_RESOLVED',
    'ERR_NAME_RESOLUTION_FAILED',
    'ERR_NETWORK_ACCESS_DENIED',
    'ERR_NETWORK_CHANGED',
    'ERR_NETWORK_IO_SUSPENDED',
    'ERR_PROXY_CONNECTION_FAILED',
    'ERR_SOCKS_CONNECTION_FAILED',
    'ERR_SSL_PROTOCOL_ERROR',
    'ERR_TUNNEL_CONNECTION_FAILED',
    'ERR_UNEXPECTED',
    'ERR_UNSAFE_PORT',
    'ERR_UNSAFE_REDIRECT',
    'ERR_UNSUPPORTED_AUTH_SCHEME',
    'ERR_UNSUPPORTED_URL_SCHEME',
    'ERR_WEBKIT_CANNOT_CONNECT_TO_HOST',
    'ERR_WEBKIT_CONNECTION_REFUSED',
    'ERR_WEBKIT_CONNECTION_RESET',
    'ERR_WEBKIT_CONNECTION_TIMED_OUT',
    'ERR_WEBKIT_DNS_LOOKUP_FAILED',
    'ERR_WEBKIT_HOST_NOT_FOUND',
    'ERR_WEBKIT_INTERNAL_ERROR',
    'ERR_WEBKIT_INVALID_URL',
    'ERR_WEBKIT_NAME_NOT_RESOLVED',
    'ERR_WEBKIT_NETWORK_ACCESS_DENIED',
    'ERR_WEBKIT_PROXY_CONNECTION_FAILED',
    'ERR_WEBKIT_TIMEOUT',
    'ERR_WEBKIT_UNKNOWN_HOST',
    'ERR_WEBKIT_UNKNOWN_PROXY_HOST',
    'ERR_WEBKIT_UNSUPPORTED_AUTH_SCHEME',
    'ERR_WEBKIT_UNSUPPORTED_URL_SCHEME',
    'ERR_WEBKIT_WEBKIT_CANNOT_CONNECT_TO_HOST',
    'ERR_WEBKIT_WEBKIT_CONNECTION_REFUSED',
    'ERR_WEBKIT_WEBKIT_CONNECTION_RESET',
    'ERR_WEBKIT_WEBKIT_CONNECTION_TIMED_OUT',
    'ERR_WEBKIT_WEBKIT_DNS_LOOKUP_FAILED',
    'ERR_WEBKIT_WEBKIT_HOST_NOT_FOUND',
    'ERR_WEBKIT_WEBKIT_INTERNAL_ERROR',
    'ERR_WEBKIT_WEBKIT_INVALID_URL',
    'ERR_WEBKIT_WEBKIT_NAME_NOT_RESOLVED',
    'ERR_WEBKIT_WEBKIT_NETWORK_ACCESS_DENIED',
    'ERR_WEBKIT_WEBKIT_PROXY_CONNECTION_FAILED',
    'ERR_WEBKIT_WEBKIT_TIMEOUT',
    'ERR_WEBKIT_WEBKIT_UNKNOWN_HOST',
    'ERR_WEBKIT_WEBKIT_UNKNOWN_PROXY_HOST',
    'ERR_WEBKIT_WEBKIT_UNSUPPORTED_AUTH_SCHEME',
    'ERR_WEBKIT_WEBKIT_UNSUPPORTED_URL_SCHEME'
  ]

  // Check error message and name against patterns
  const lowerMessage = errorMessage.toLowerCase()
  const lowerName = errorName.toLowerCase()

  return networkPatterns.some(pattern => 
    lowerMessage.includes(pattern.toLowerCase()) || 
    lowerName.includes(pattern.toLowerCase())
  )
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: any): boolean {
  if (!error) return false

  const errorMessage = error.message || error.toString() || ''
  const errorCode = error.code || ''

  const authPatterns = [
    'Invalid login credentials',
    'Email not confirmed',
    'User not found',
    'Invalid token',
    'Token expired',
    'Unauthorized',
    'Forbidden',
    'invalid_grant',
    'invalid_request',
    'invalid_client',
    'invalid_scope',
    'unauthorized_client',
    'unsupported_grant_type',
    'invalid_redirect_uri',
    'access_denied',
    'unsupported_response_type',
    'server_error',
    'temporarily_unavailable'
  ]

  const lowerMessage = errorMessage.toLowerCase()
  const lowerCode = errorCode.toLowerCase()

  return authPatterns.some(pattern => 
    lowerMessage.includes(pattern.toLowerCase()) || 
    lowerCode.includes(pattern.toLowerCase())
  )
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: any): boolean {
  if (!error) return false

  const errorMessage = error.message || error.toString() || ''
  const errorCode = error.code || ''

  const validationPatterns = [
    'validation',
    'invalid',
    'required',
    'format',
    'length',
    'pattern',
    'constraint',
    'duplicate',
    'unique',
    'foreign key',
    'not null',
    'check constraint'
  ]

  const lowerMessage = errorMessage.toLowerCase()
  const lowerCode = errorCode.toLowerCase()

  return validationPatterns.some(pattern => 
    lowerMessage.includes(pattern.toLowerCase()) || 
    lowerCode.includes(pattern.toLowerCase())
  )
}

/**
 * Check if error is a server error
 */
export function isServerError(error: any): boolean {
  if (!error) return false

  const status = error.status || error.statusCode || 0
  const errorMessage = error.message || error.toString() || ''

  // HTTP status codes for server errors
  if (status >= 500 && status < 600) {
    return true
  }

  const serverPatterns = [
    'internal server error',
    'server error',
    'service unavailable',
    'bad gateway',
    'gateway timeout',
    'http version not supported',
    'variant also negotiates',
    'insufficient storage',
    'loop detected',
    'not extended',
    'network authentication required'
  ]

  const lowerMessage = errorMessage.toLowerCase()

  return serverPatterns.some(pattern => 
    lowerMessage.includes(pattern.toLowerCase())
  )
}

/**
 * Classify error type based on error characteristics
 */
export function classifyError(error: any): AppError['type'] {
  if (isNetworkError(error)) return 'network'
  if (isAuthError(error)) return 'auth'
  if (isValidationError(error)) return 'validation'
  if (isServerError(error)) return 'server'
  return 'unknown'
}

/**
 * Get user-friendly error message based on error type
 */
export function getErrorMessage(error: any, type?: AppError['type']): string {
  const errorType = type || classifyError(error)

  switch (errorType) {
    case 'network':
      return 'مشكلة في الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.'
    
    case 'auth':
      const authMessage = error?.message || ''
      if (authMessage.includes('Invalid login credentials')) {
        return 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور.'
      }
      if (authMessage.includes('Email not confirmed')) {
        return 'يرجى تأكيد البريد الإلكتروني قبل تسجيل الدخول.'
      }
      if (authMessage.includes('User not found')) {
        return 'المستخدم غير موجود.'
      }
      return 'خطأ في المصادقة. يرجى المحاولة مرة أخرى.'
    
    case 'validation':
      return 'البيانات المدخلة غير صحيحة. يرجى التحقق من جميع الحقول المطلوبة.'
    
    case 'server':
      return 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.'
    
    default:
      return error?.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
  }
}

/**
 * Create a standardized AppError object
 */
export function createAppError(error: any, customMessage?: string): AppError {
  const type = classifyError(error)
  const message = customMessage || getErrorMessage(error, type)

  return {
    message,
    code: error?.code || error?.status?.toString(),
    type,
    originalError: error
  }
}

/**
 * Check if error should be retried (for network errors)
 */
export function shouldRetry(error: any): boolean {
  if (isNetworkError(error)) {
    // Don't retry for certain network errors
    const errorMessage = error?.message || ''
    const nonRetryablePatterns = [
      'ERR_UNSAFE_PORT',
      'ERR_UNSAFE_REDIRECT',
      'ERR_UNSUPPORTED_AUTH_SCHEME',
      'ERR_UNSUPPORTED_URL_SCHEME',
      'ERR_DISALLOWED_URL_SCHEME'
    ]
    
    return !nonRetryablePatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    )
  }
  
  return false
}

/**
 * Get retry delay in milliseconds based on error type
 */
export function getRetryDelay(attempt: number, error: any): number {
  if (!shouldRetry(error)) return 0
  
  // Exponential backoff with jitter
  const baseDelay = 1000 // 1 second
  const maxDelay = 30000 // 30 seconds
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
  const jitter = Math.random() * 1000 // Add up to 1 second of jitter
  
  return delay + jitter
}
