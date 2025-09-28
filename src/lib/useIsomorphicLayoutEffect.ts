import { useEffect, useLayoutEffect } from 'react'

// Use layout effect when DOM is available (prevents SSR warnings)
const canUseDOM = typeof globalThis !== 'undefined' && Boolean(globalThis?.document)

export const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect
