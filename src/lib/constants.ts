// Application constants
export const APP_CONFIG = {
  QUERY_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  AUTH_TIMEOUT: 5000, // 5 seconds
  CONNECTION_CHECK_INTERVAL: 30000, // 30 seconds
  WARRANTY_EXPIRY_WARNING_DAYS: 30,
  MAX_WARRANTY_MONTHS: 60,
  MIN_WARRANTY_MONTHS: 1,
} as const

export const ROUTES = {
  HOME: '/',
  WARRANTIES: '/warranties',
  ADMIN: '/admin',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const

export const WARRANTY_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  EXPIRING_SOON: 'expiring_soon',
} as const

export const DATE_FILTERS = {
  ALL: 'all',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const

export const WARRANTY_DURATION_TYPES = {
  PER_PRODUCT: 'per_product',
  PER_INVOICE: 'per_invoice',
} as const

// Sample products data
export const SAMPLE_PRODUCTS = [
  { name: 'شركة أبل', description: 'شركة تقنية أمريكية متخصصة في الأجهزة الإلكترونية', warranty_period_months: 24 },
  { name: 'شركة سامسونج', description: 'شركة كورية جنوبية متخصصة في الإلكترونيات والهواتف', warranty_period_months: 24 },
  { name: 'شركة مايكروسوفت', description: 'شركة تقنية أمريكية متخصصة في البرمجيات والحوسبة', warranty_period_months: 36 },
  { name: 'شركة ديل', description: 'شركة أمريكية متخصصة في أجهزة الكمبيوتر والخوادم', warranty_period_months: 36 },
  { name: 'شركة إتش بي', description: 'شركة أمريكية متخصصة في أجهزة الكمبيوتر والطابعات', warranty_period_months: 24 },
  { name: 'شركة لينوفو', description: 'شركة صينية متخصصة في أجهزة الكمبيوتر والأجهزة المحمولة', warranty_period_months: 24 },
  { name: 'شركة آسوس', description: 'شركة تايوانية متخصصة في أجهزة الكمبيوتر والمكونات', warranty_period_months: 24 },
  { name: 'شركة سوني', description: 'شركة يابانية متخصصة في الإلكترونيات والترفيه', warranty_period_months: 24 },
  { name: 'شركة كانون', description: 'شركة يابانية متخصصة في الكاميرات والطابعات', warranty_period_months: 12 },
  { name: 'شركة إنتل', description: 'شركة أمريكية متخصصة في معالجات الكمبيوتر', warranty_period_months: 36 }
] as const

// UI Constants
export const UI_CONFIG = {
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
} as const

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'مشكلة في الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.',
  AUTH_ERROR: 'خطأ في المصادقة. يرجى المحاولة مرة أخرى.',
  GENERIC_ERROR: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  VALIDATION_ERROR: 'يرجى التحقق من البيانات المدخلة.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  WARRANTY_CREATED: 'تم إنشاء شهادة الضمان بنجاح',
  WARRANTY_UPDATED: 'تم تحديث شهادة الضمان بنجاح',
  WARRANTY_DELETED: 'تم حذف شهادة الضمان بنجاح',
  USER_CREATED: 'تم إنشاء المستخدم بنجاح',
  USER_UPDATED: 'تم تحديث بيانات المستخدم بنجاح',
  USER_DELETED: 'تم حذف المستخدم بنجاح',
} as const
