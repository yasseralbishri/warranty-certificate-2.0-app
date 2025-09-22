/**
 * Security utilities for input validation and sanitization
 * This module provides comprehensive security functions to prevent
 * XSS, injection attacks, and other security vulnerabilities.
 */

// Rate limiting configuration
export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW: 15 * 60 * 1000, // 15 minutes
  API_CALLS: 100,
  API_WINDOW: 60 * 1000, // 1 minute
} as const

// Input length limits
export const INPUT_LIMITS = {
  NAME: 100,
  EMAIL: 254,
  PHONE: 20,
  ADDRESS: 500,
  DESCRIPTION: 1000,
  HTML_CONTENT: 5000,
  INVOICE_NUMBER: 50,
} as const

// Allowed file types for uploads
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
] as const

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024

/**
 * Validate input length against defined limits
 */
export function validateInputLength(input: string, maxLength: number, fieldName: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  if (input.length > maxLength) {
    console.warn(`Input too long for ${fieldName}: ${input.length} characters (max: ${maxLength})`)
    return input.substring(0, maxLength)
  }
  
  return input
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email) && email.length <= INPUT_LIMITS.EMAIL
}

/**
 * Validate phone number format (Saudi Arabia)
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false
  }
  
  const cleaned = phone.replace(/\D/g, '')
  
  // Saudi phone number patterns
  const saudiPatterns = [
    /^05\d{8}$/, // 05xxxxxxxx
    /^9665\d{8}$/, // 9665xxxxxxxx
    /^\+9665\d{8}$/, // +9665xxxxxxxx
  ]
  
  return saudiPatterns.some(pattern => pattern.test(cleaned))
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
    }
  }
  
  if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
    return { 
      valid: false, 
      error: `File type not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` 
    }
  }
  
  return { valid: true }
}

/**
 * Generate secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Check if a string contains potentially malicious content
 */
export function containsMaliciousContent(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false
  }
  
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /data:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /@import/i,
    /document\./i,
    /window\./i,
    /alert\s*\(/i,
    /confirm\s*\(/i,
    /prompt\s*\(/i,
  ]
  
  return maliciousPatterns.some(pattern => pattern.test(input))
}

/**
 * Log security events for monitoring
 */
export function logSecurityEvent(event: string, details: Record<string, any> = {}): void {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    event,
    details,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
  }
  
  // In production, this should be sent to a security monitoring service
  console.warn('Security Event:', logEntry)
  
  // You could also send this to your backend for logging
  // Example: sendToSecurityLog(logEntry)
}

/**
 * Validate CSRF token (if implemented)
 */
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) {
    return false
  }
  
  // Use constant-time comparison to prevent timing attacks
  if (token.length !== expectedToken.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i)
  }
  
  return result === 0
}
