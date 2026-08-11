export type Trit = 0 | 1 | 2;

export type PileIndex = Trit;

export type SlotIndex = Trit;

export type CardCode = number;

export type Deck = Uint8Array;

export type Piles = readonly [Deck, Deck, Deck];

export type Permutation = Uint8Array;
