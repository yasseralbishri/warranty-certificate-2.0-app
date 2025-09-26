import { useEffect, useLayoutEffect } from 'react'

// Hook آمن للاستخدام في بيئات مختلفة
export const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
