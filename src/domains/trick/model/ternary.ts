import type { Trit } from './types';

export const RADIX = 3;

export const ROUNDS = 3;

export const DECK_SIZE = RADIX ** ROUNDS;

export const PILE_SIZE = DECK_SIZE / RADIX;

export const MAX_TARGET = DECK_SIZE;

export type Trits = readonly [Trit, Trit, Trit];

const TRIT_TABLE: readonly Trits[] = Array.from(
  { length: DECK_SIZE },
  (_, n) => [(n % 3) as Trit, (((n / 3) | 0) % 3) as Trit, ((n / 9) | 0) as Trit] as const,
);

export function tritsOf(n: number): Trits {
  return TRIT_TABLE[n];
}

export function fromTrits([a, b, c]: Trits): number {
  return a + RADIX * b + RADIX * RADIX * c;
}
