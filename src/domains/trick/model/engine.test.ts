import { describe, expect, it } from 'vitest';

import { drawDeck, faceOf, mulberry32 } from './deck';
import {
  DECK_SIZE,
  ROUNDS,
  cardAt,
  finalIndexOf,
  pileHolding,
  restack,
  slotPlan,
  solvePermutation,
  toPiles,
} from './engine';
import { ALL_PERMUTATIONS, applyPermutation } from './permutations';
import { fromTrits, tritsOf } from './ternary';
import type { PileIndex } from './types';

const TARGETS = Array.from({ length: DECK_SIZE }, (_, i) => i + 1);

describe('ternary', () => {
  it('round-trips every representable number', () => {
    for (let n = 0; n < DECK_SIZE; n++) {
      expect(fromTrits(tritsOf(n))).toBe(n);
    }
  });
});

describe('permutations', () => {
  it('are all bijections of 0..26', () => {
    for (const map of ALL_PERMUTATIONS) {
      expect([...map].sort((a, b) => a - b)).toEqual(TARGETS.map((t) => t - 1));
    }
  });

  it('scatter, not gather: every source index lands somewhere unique', () => {
    for (const map of ALL_PERMUTATIONS) {
      expect(new Set(map).size).toBe(DECK_SIZE);
    }
  });
});

describe('the trick itself', () => {
  /** Plays a full game the way an honest spectator would. */
  function play(target: number, card: number, seed = 1) {
    let deck = drawDeck(seed);
    const secret = deck[card];
    const picks: PileIndex[] = [];

    for (let round = 0; round < ROUNDS; round++) {
      const pile = pileHolding(deck, secret);
      picks.push(pile);
      deck = restack(deck, pile, target, round);
    }
    return { deck, secret, picks };
  }

  it('lands any card on any requested position (all 729 games)', () => {
    for (const target of TARGETS) {
      for (let card = 0; card < DECK_SIZE; card++) {
        const { deck, secret } = play(target, card);
        expect(cardAt(deck, target)).toBe(secret);
      }
    }
  });

  it('is independent of the shuffle', () => {
    for (const seed of [1, 7, 99, 123456, 0xdecafbad]) {
      const { deck, secret } = play(14, 0, seed);
      expect(cardAt(deck, 14)).toBe(secret);
    }
  });

  it('final index equals 9*s3 + 3*s2 + s1, ignoring where the card started', () => {
    for (const target of TARGETS) {
      expect(finalIndexOf(slotPlan(target))).toBe(target - 1);
    }
  });

  it('fused single-pass solve matches round-by-round play', () => {
    for (const target of TARGETS) {
      for (let card = 0; card < DECK_SIZE; card += 4) {
        const start = drawDeck(42);
        const { deck, picks } = play(target, card, 42);
        const fused = applyPermutation(start, solvePermutation(target, picks));
        expect([...fused]).toEqual([...deck]);
      }
    }
  });

  it('reuses a caller-supplied buffer without allocating', () => {
    const deck = drawDeck(3);
    const scratch = new Uint8Array(DECK_SIZE);
    const result = restack(deck, 1, 20, 0, scratch);
    expect(result).toBe(scratch);
  });
});

describe('deck', () => {
  it('draws 27 distinct cards from a 52-card deck', () => {
    for (const seed of [0, 1, 2, 3, 4]) {
      const deck = drawDeck(seed);
      expect(deck.length).toBe(DECK_SIZE);
      expect(new Set(deck).size).toBe(DECK_SIZE);
      expect(Math.max(...deck)).toBeLessThan(52);
    }
  });

  it('is reproducible for a given seed', () => {
    expect([...drawDeck(1234)]).toEqual([...drawDeck(1234)]);
  });

  it('is not reproducible across seeds', () => {
    expect([...drawDeck(1)]).not.toEqual([...drawDeck(2)]);
  });

  it('exposes a stable face for every code', () => {
    expect(faceOf(0).label).toBe('Ace of spades');
    expect(faceOf(24).red).toBe(true);
  });

  it('mulberry32 stays in [0, 1)', () => {
    const next = mulberry32(9);
    for (let i = 0; i < 1000; i++) {
      const v = next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('piles', () => {
  it('deals round-robin, preserving order within each pile', () => {
    const deck = drawDeck(5);
    const [a, b, c] = toPiles(deck);
    for (let i = 0; i < 9; i++) {
      expect(a[i]).toBe(deck[i * 3]);
      expect(b[i]).toBe(deck[i * 3 + 1]);
      expect(c[i]).toBe(deck[i * 3 + 2]);
    }
  });
});
