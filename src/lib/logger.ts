/**
 * Centralized logging utility for the application
 * Provides consistent logging with environment-based controls
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

class Logger {
  private isDevelopment = import.meta.env.DEV
  private isProduction = import.meta.env.PROD
  private logLevel: LogLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.ERROR

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel
  }

  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString()
    return `[${timestamp}] ${level}: ${message}`
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message), ...args)
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message), ...args)
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message), ...args)
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage('DEBUG', message), ...args)
    }
  }

  // Specialized logging methods
  auth(message: string, ...args: any[]): void {
    this.debug(`[AUTH] ${message}`, ...args)
  }

  supabase(message: string, ...args: any[]): void {
    this.debug(`[SUPABASE] ${message}`, ...args)
  }

  component(componentName: string, message: string, ...args: any[]): void {
    this.debug(`[${componentName.toUpperCase()}] ${message}`, ...args)
  }

  performance(operation: string, duration: number): void {
    if (duration > 1000) { // Log slow operations
      this.warn(`[PERFORMANCE] Slow operation: ${operation} took ${duration}ms`)
    } else {
      this.debug(`[PERFORMANCE] ${operation} took ${duration}ms`)
    }
  }

  security(event: string, details?: any): void {
    this.warn(`[SECURITY] ${event}`, details)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export convenience functions
export const logError = (message: string, ...args: any[]) => logger.error(message, ...args)
export const logWarn = (message: string, ...args: any[]) => logger.warn(message, ...args)
export const logInfo = (message: string, ...args: any[]) => logger.info(message, ...args)
export const logDebug = (message: string, ...args: any[]) => logger.debug(message, ...args)
export const logAuth = (message: string, ...args: any[]) => logger.auth(message, ...args)
export const logSupabase = (message: string, ...args: any[]) => logger.supabase(message, ...args)
export const logComponent = (componentName: string, message: string, ...args: any[]) => 
  logger.component(componentName, message, ...args)
export const logPerformance = (operation: string, duration: number) => 
  logger.performance(operation, duration)
export const logSecurity = (event: string, details?: any) => logger.security(event, details)
