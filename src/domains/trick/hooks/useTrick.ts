'use client';

import { useMemo, useReducer } from 'react';

import { drawDeck, placeholderDeck, randomSeed } from '../model/deck';
import { ROUNDS, cardAt, restack, toPiles } from '../model/engine';
import { MAX_TARGET } from '../model/ternary';
import type { Deck, PileIndex } from '../model/types';

export type Phase =
  | 'intro'
  | 'shuffling'
  | 'memorise'
  | 'target'
  | 'round'
  | 'divining'
  | 'reveal';

export interface TrickState {
  readonly phase: Phase;
  readonly deck: Deck;
  readonly seed: number;
  readonly target: number;
  readonly round: number;
  readonly picks: readonly PileIndex[];
  readonly startedAt: number | null;
  readonly finishedAt: number | null;
}

export type TrickAction =
  | { type: 'begin'; seed: number; now: number }
  | { type: 'shuffled' }
  | { type: 'memorised' }
  | { type: 'chooseTarget'; target: number }
  | { type: 'pickPile'; pile: PileIndex }
  | { type: 'divined'; now: number }
  | { type: 'reset' };

const INITIAL: TrickState = {
  phase: 'intro',
  deck: placeholderDeck(),
  seed: 0,
  target: 0,
  round: 0,
  picks: [],
  startedAt: null,
  finishedAt: null,
};

export function trickReducer(state: TrickState, action: TrickAction): TrickState {
  switch (action.type) {
    case 'begin':
      return {
        ...INITIAL,
        phase: 'shuffling',
        deck: drawDeck(action.seed),
        seed: action.seed,
        startedAt: action.now,
      };

    case 'shuffled':
      return state.phase === 'shuffling' ? { ...state, phase: 'memorise' } : state;

    case 'memorised':
      return state.phase === 'memorise' ? { ...state, phase: 'target' } : state;

    case 'chooseTarget': {
      if (state.phase !== 'target') return state;
      if (!Number.isInteger(action.target) || action.target < 1 || action.target > MAX_TARGET) {
        return state;
      }
      return { ...state, phase: 'round', target: action.target, round: 0, picks: [] };
    }

    case 'pickPile': {
      if (state.phase !== 'round') return state;
      const deck = restack(state.deck, action.pile, state.target, state.round);
      const round = state.round + 1;
      return {
        ...state,
        deck,
        round,
        picks: [...state.picks, action.pile],
        phase: round >= ROUNDS ? 'divining' : 'round',
      };
    }

    case 'divined':
      return state.phase === 'divining'
        ? { ...state, phase: 'reveal', finishedAt: action.now }
        : state;

    case 'reset':
      return INITIAL;

    default:
      return state;
  }
}

function stepIndexOf(state: TrickState): number {
  switch (state.phase) {
    case 'intro':
      return 0;
    case 'shuffling':
    case 'memorise':
      return 1;
    case 'target':
      return 2;
    case 'round':
      return 3;
    default:
      return 4;
  }
}

export function useTrick() {
  const [state, dispatch] = useReducer(trickReducer, INITIAL);

  const piles = useMemo(() => toPiles(state.deck), [state.deck]);

  const revealedCard = useMemo(
    () => (state.phase === 'reveal' ? cardAt(state.deck, state.target) : null),
    [state.phase, state.deck, state.target],
  );

  const actions = useMemo(
    () => ({
      begin: () => dispatch({ type: 'begin', seed: randomSeed(), now: Date.now() }),
      shuffled: () => dispatch({ type: 'shuffled' }),
      memorised: () => dispatch({ type: 'memorised' }),
      chooseTarget: (target: number) => dispatch({ type: 'chooseTarget', target }),
      pickPile: (pile: PileIndex) => dispatch({ type: 'pickPile', pile }),
      divined: () => dispatch({ type: 'divined', now: Date.now() }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [],
  );

  const durationMs =
    state.startedAt !== null && state.finishedAt !== null
      ? state.finishedAt - state.startedAt
      : null;

  return {
    state,
    piles,
    revealedCard,
    durationMs,
    stepIndex: stepIndexOf(state),
    ...actions,
  };
}

export type TrickController = ReturnType<typeof useTrick>;
