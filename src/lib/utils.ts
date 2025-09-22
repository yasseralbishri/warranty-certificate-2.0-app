import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateShort(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Calculate warranty end date
export function calculateWarrantyEndDate(startDate: Date, months: number): Date {
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + months)
  return endDate
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Saudi phone number formatting
  if (cleaned.length === 10 && cleaned.startsWith('05')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  } else if (cleaned.length === 12 && cleaned.startsWith('966')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  
  // Fallback formatting for other numbers
  if (cleaned.length >= 7) {
    const countryCode = cleaned.length > 10 ? cleaned.slice(0, -10) : ''
    const localNumber = cleaned.slice(-10)
    if (countryCode) {
      return `+${countryCode} ${localNumber.slice(0, 3)} ${localNumber.slice(3, 6)} ${localNumber.slice(6)}`
    }
    return `${localNumber.slice(0, 3)} ${localNumber.slice(3, 6)} ${localNumber.slice(6)}`
  }
  
  return phone
}

// Comprehensive input sanitization for security
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    // Remove HTML tags and script content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    // Remove potentially dangerous characters
    .replace(/[<>'"&]/g, '')
    // Remove JavaScript event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove data URLs and javascript: protocols
    .replace(/data:/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    // Remove SQL injection patterns
    .replace(/('|(\\')|(;)|(\-\-)|(\/\*)|(\*\/)|(\|)|(\*)|(%)|(\+)|(\=)|(\()|(\))|(\[)|(\])|(\{)|(\})|(\;)|(\:)|(\')|(\")|(\<)|(\>)|(\/)|(\\)|(\?)|(\!)|(\@)|(\#)|(\$)|(\^)|(\&)|(\~)|(\`)|(\|))/g, '')
    // Limit length to prevent buffer overflow attacks
    .substring(0, 1000)
}

// Sanitize HTML content specifically
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  return html
    .trim()
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove style tags and their content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: and data: URLs
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
    .replace(/src\s*=\s*["']data:[^"']*["']/gi, 'src=""')
    // Allow only safe HTML tags
    .replace(/<(?!\/?(?:p|br|strong|em|u|h[1-6]|ul|ol|li|a|img|div|span|table|tr|td|th|thead|tbody|tfoot)(?:\s|>))/gi, '&lt;')
    // Limit length
    .substring(0, 5000)
}

// Sanitize phone numbers specifically
export function sanitizePhoneNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return ''
  }

  // Remove all non-digit characters except + at the beginning
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  // Ensure it starts with + or digits only
  if (cleaned.startsWith('+')) {
    return '+' + cleaned.slice(1).replace(/\D/g, '')
  }
  
  return cleaned.replace(/\D/g, '')
}

// Sanitize email addresses
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return ''
  }

  return email
    .trim()
    .toLowerCase()
    // Remove any HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove potentially dangerous characters
    .replace(/[<>'"&]/g, '')
    // Basic email validation - only allow valid email characters
    .replace(/[^a-z0-9@._+-]/g, '')
    // Limit length
    .substring(0, 254)
}

// Validate and sanitize numeric input
export function sanitizeNumeric(input: string | number): number | null {
  if (typeof input === 'number') {
    return isNaN(input) ? null : input
  }
  
  if (!input || typeof input !== 'string') {
    return null
  }

  const cleaned = input.toString().replace(/[^\d.-]/g, '')
  const parsed = parseFloat(cleaned)
  
  return isNaN(parsed) ? null : parsed
}
