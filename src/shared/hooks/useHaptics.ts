'use client';

import { useCallback } from 'react';

const PATTERNS = {
  tap: 8,
  select: [12, 30, 12],
  reveal: [18, 40, 18, 40, 60],
} as const;

export type HapticPattern = keyof typeof PATTERNS;

export function useHaptics() {
  return useCallback((pattern: HapticPattern = 'tap') => {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    try {
      navigator.vibrate(PATTERNS[pattern] as number | number[]);
    } catch {
      return;
    }
  }, []);
}
