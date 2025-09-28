import { useEffect, useLayoutEffect } from 'react'

// Hook آمن للاستخدام في بيئات مختلفة
// Defensive check for useLayoutEffect availability
export const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' && typeof useLayoutEffect !== 'undefined' 
    ? useLayoutEffect 
    : useEffect
