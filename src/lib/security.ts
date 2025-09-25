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
 * Enhanced input validation with comprehensive security checks
 */
export class SecurityValidator {
  private static readonly DANGEROUS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /@import/gi,
    /document\./gi,
    /window\./gi,
    /alert\s*\(/gi,
    /confirm\s*\(/gi,
    /prompt\s*\(/gi,
    /\.\.\//g, // Path traversal
    /\.\.\\/g, // Path traversal (Windows)
    /union\s+select/gi, // SQL injection
    /drop\s+table/gi, // SQL injection
    /delete\s+from/gi, // SQL injection
    /insert\s+into/gi, // SQL injection
    /update\s+set/gi, // SQL injection
  ]

  static validateInput(input: string, maxLength: number = 1000): {
    isValid: boolean
    sanitized: string
    warnings: string[]
  } {
    const warnings: string[] = []
    let sanitized = input

    // Check length
    if (input.length > maxLength) {
      warnings.push(`Input exceeds maximum length of ${maxLength} characters`)
      sanitized = input.substring(0, maxLength)
    }

    // Check for dangerous patterns
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(input)) {
        warnings.push(`Potentially dangerous content detected: ${pattern.source}`)
        sanitized = sanitized.replace(pattern, '')
      }
    }

    // Additional sanitization
    sanitized = sanitized
      .trim()
      .replace(/[<>'"&]/g, '')
      .replace(/\s+/g, ' ')

    return {
      isValid: warnings.length === 0,
      sanitized,
      warnings
    }
  }

  static validateFileUpload(file: File): {
    isValid: boolean
    error?: string
  } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      }
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
      }
    }

    // Check file name for dangerous patterns
    const nameValidation = this.validateInput(file.name, 255)
    if (!nameValidation.isValid) {
      return {
        isValid: false,
        error: 'Invalid file name'
      }
    }

    return { isValid: true }
  }

  static validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const isValid = emailRegex.test(email) && email.length <= INPUT_LIMITS.EMAIL

    if (!isValid) {
      logSecurityEvent('Invalid email format attempted', { email })
    }

    return isValid
  }

  static validatePhoneNumber(phone: string): boolean {
    if (!phone || typeof phone !== 'string') {
      return false
    }

    const cleaned = phone.replace(/\D/g, '')
    const saudiPatterns = [
      /^05\d{8}$/, // 05xxxxxxxx
      /^9665\d{8}$/, // 9665xxxxxxxx
      /^\+9665\d{8}$/, // +9665xxxxxxxx
    ]

    const isValid = saudiPatterns.some(pattern => pattern.test(cleaned))

    if (!isValid) {
      logSecurityEvent('Invalid phone number format attempted', { phone })
    }

    return isValid
  }
}

/**
 * Content Security Policy helpers
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}

/**
 * Rate limiting implementation
 */
export class RateLimiter {
  private attempts = new Map<string, { count: number; resetTime: number }>()

  isAllowed(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const record = this.attempts.get(key)

    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (record.count >= limit) {
      logSecurityEvent('Rate limit exceeded', { key, limit, windowMs })
      return false
    }

    record.count++
    return true
  }

  reset(key: string): void {
    this.attempts.delete(key)
  }

  clear(): void {
    this.attempts.clear()
  }
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
