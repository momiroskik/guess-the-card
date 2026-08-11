import { DECK_SIZE, PILE_SIZE, RADIX } from './ternary';
import type { Deck, Permutation, PileIndex, SlotIndex } from './types';

function slotAssignment(chosen: PileIndex, slot: SlotIndex): readonly SlotIndex[] {
  const assignment: SlotIndex[] = new Array(RADIX);
  assignment[chosen] = slot;

  let nextFreeSlot = 0;
  for (let pile = 0; pile < RADIX; pile++) {
    if (pile === chosen) continue;
    if (nextFreeSlot === slot) nextFreeSlot++;
    assignment[pile] = nextFreeSlot as SlotIndex;
    nextFreeSlot++;
  }

  return assignment;
}

function buildPermutation(chosen: PileIndex, slot: SlotIndex): Permutation {
  const slotOf = slotAssignment(chosen, slot);
  const map = new Uint8Array(DECK_SIZE);
  for (let i = 0; i < DECK_SIZE; i++) {
    map[i] = slotOf[i % RADIX] * PILE_SIZE + ((i / RADIX) | 0);
  }
  return map;
}

const PERMUTATIONS: readonly Permutation[] = Array.from({ length: RADIX * RADIX }, (_, k) =>
  buildPermutation(((k / RADIX) | 0) as PileIndex, (k % RADIX) as SlotIndex),
);

export function permutationFor(chosen: PileIndex, slot: SlotIndex): Permutation {
  return PERMUTATIONS[chosen * RADIX + slot];
}

export function applyPermutation(deck: Deck, map: Permutation, out?: Deck): Deck {
  const next = out ?? new Uint8Array(DECK_SIZE);
  for (let i = 0; i < DECK_SIZE; i++) next[map[i]] = deck[i];
  return next;
}

export function composePermutations(first: Permutation, second: Permutation): Permutation {
  const fused = new Uint8Array(DECK_SIZE);
  for (let i = 0; i < DECK_SIZE; i++) fused[i] = second[first[i]];
  return fused;
}

export const ALL_PERMUTATIONS = PERMUTATIONS;
