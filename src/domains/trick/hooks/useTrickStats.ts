'use client';

import { useCallback } from 'react';

import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export interface TrickStats {
  plays: number;
  bestMs: number | null;
  lastMs: number | null;
}

const EMPTY: TrickStats = { plays: 0, bestMs: null, lastMs: null };
const STORAGE_KEY = 'guess-the-card:stats:v2';

export function useTrickStats() {
  const [stats, persist, hydrated] = useLocalStorage<TrickStats>(STORAGE_KEY, EMPTY);

  const record = useCallback(
    (durationMs: number) => {
      persist((previous) => ({
        plays: previous.plays + 1,
        lastMs: durationMs,
        bestMs: previous.bestMs === null ? durationMs : Math.min(previous.bestMs, durationMs),
      }));
    },
    [persist],
  );

  const clear = useCallback(() => persist(EMPTY), [persist]);

  return { stats, hydrated, record, clear };
}
