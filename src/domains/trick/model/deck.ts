import { DECK_SIZE } from './ternary';
import type { CardCode, Deck } from './types';

export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
export const SUITS = ['♠', '♥', '♦', '♣'] as const;
export const SUIT_NAMES = ['spades', 'hearts', 'diamonds', 'clubs'] as const;

const RANKS_PER_SUIT = RANKS.length;
const FULL_DECK = RANKS_PER_SUIT * SUITS.length;

export type Rank = (typeof RANKS)[number];
export type Suit = (typeof SUITS)[number];

export interface CardFace {
  readonly code: CardCode;
  readonly rank: Rank;
  readonly suit: Suit;
  readonly red: boolean;
  readonly label: string;
}

const LONG_RANKS: Record<string, string> = { A: 'Ace', J: 'Jack', Q: 'Queen', K: 'King' };

const FACES: readonly CardFace[] = Array.from({ length: FULL_DECK }, (_, code) => {
  const suitIndex = (code / RANKS_PER_SUIT) | 0;
  const rank = RANKS[code % RANKS_PER_SUIT];
  return {
    code,
    rank,
    suit: SUITS[suitIndex],
    red: suitIndex === 1 || suitIndex === 2,
    label: `${LONG_RANKS[rank] ?? rank} of ${SUIT_NAMES[suitIndex]}`,
  };
});

export function faceOf(code: CardCode): CardFace {
  return FACES[code];
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed(): number {
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    return globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
  }
  return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
}

export function placeholderDeck(): Deck {
  return Uint8Array.from({ length: DECK_SIZE }, (_, i) => i);
}

export function drawDeck(seed: number = randomSeed()): Deck {
  const random = mulberry32(seed);
  const pool = new Uint8Array(FULL_DECK);
  for (let i = 0; i < FULL_DECK; i++) pool[i] = i;

  const deck = new Uint8Array(DECK_SIZE);
  for (let i = 0; i < DECK_SIZE; i++) {
    const j = i + ((random() * (FULL_DECK - i)) | 0);
    const picked = pool[j];
    pool[j] = pool[i];
    deck[i] = picked;
  }
  return deck;
}
