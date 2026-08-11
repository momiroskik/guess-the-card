import { applyPermutation, composePermutations, permutationFor } from './permutations';
import { DECK_SIZE, PILE_SIZE, RADIX, ROUNDS, fromTrits, tritsOf } from './ternary';
import type { Deck, Permutation, PileIndex, Piles, SlotIndex, Trit } from './types';

export function slotForRound(target: number, round: number): SlotIndex {
  return tritsOf(target - 1)[round] as SlotIndex;
}

export function slotPlan(target: number): readonly SlotIndex[] {
  return tritsOf(target - 1) as readonly SlotIndex[];
}

export function restack(
  deck: Deck,
  chosen: PileIndex,
  target: number,
  round: number,
  out?: Deck,
): Deck {
  return applyPermutation(deck, permutationFor(chosen, slotForRound(target, round)), out);
}

export function solvePermutation(target: number, picks: readonly PileIndex[]): Permutation {
  let fused = permutationFor(picks[0], slotForRound(target, 0));
  for (let round = 1; round < picks.length; round++) {
    fused = composePermutations(fused, permutationFor(picks[round], slotForRound(target, round)));
  }
  return fused;
}

export function toPiles(deck: Deck): Piles {
  const piles: Deck[] = [
    new Uint8Array(PILE_SIZE),
    new Uint8Array(PILE_SIZE),
    new Uint8Array(PILE_SIZE),
  ];
  for (let i = 0; i < DECK_SIZE; i++) {
    piles[i % RADIX][(i / RADIX) | 0] = deck[i];
  }
  return piles as unknown as Piles;
}

export function pileHolding(deck: Deck, card: number): PileIndex {
  return (deck.indexOf(card) % RADIX) as PileIndex;
}

export function cardAt(deck: Deck, target: number): number {
  return deck[target - 1];
}

export function finalIndexOf(slots: readonly SlotIndex[]): number {
  return fromTrits([slots[0], slots[1], slots[2]] as unknown as readonly [Trit, Trit, Trit]);
}

export { DECK_SIZE, PILE_SIZE, RADIX, ROUNDS };
