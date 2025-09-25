/**
 * Performance monitoring and optimization utilities
 */

import { logPerformance } from './logger'

/**
 * Debounce function to limit the rate of function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Throttle function to limit the rate of function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Performance timer utility
 */
export class PerformanceTimer {
  private startTime: number = 0
  private operationName: string = ''

  constructor(operationName: string) {
    this.operationName = operationName
    this.startTime = performance.now()
  }

  end(): number {
    const duration = performance.now() - this.startTime
    logPerformance(this.operationName, duration)
    return duration
  }
}

/**
 * Memoization utility for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Lazy loading utility for components
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(importFunc)
}

/**
 * Intersection Observer for lazy loading images
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  })
}

/**
 * Virtual scrolling utility for large lists
 */
export interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function calculateVirtualScrollRange(
  scrollTop: number,
  totalItems: number,
  options: VirtualScrollOptions
): { startIndex: number; endIndex: number; visibleItems: number } {
  const { itemHeight, containerHeight, overscan = 5 } = options
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleItems = Math.ceil(containerHeight / itemHeight)
  const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + overscan * 2)
  
  return {
    startIndex,
    endIndex,
    visibleItems
  }
}

/**
 * Bundle size optimization utilities
 */
export const bundleOptimizations = {
  // Tree shaking helpers
  importOnly: <T>(module: T, key: keyof T) => module[key],
  
  // Dynamic imports for code splitting
  dynamicImport: async <T>(path: string): Promise<T> => {
    const module = await import(path)
    return module.default || module
  }
}

/**
 * Memory management utilities
 */
export class MemoryManager {
  private static instances = new Map<string, any>()
  
  static get<T>(key: string, factory: () => T): T {
    if (!this.instances.has(key)) {
      this.instances.set(key, factory())
    }
    return this.instances.get(key)
  }
  
  static clear(key?: string): void {
    if (key) {
      this.instances.delete(key)
    } else {
      this.instances.clear()
    }
  }
  
  static size(): number {
    return this.instances.size
  }
}
