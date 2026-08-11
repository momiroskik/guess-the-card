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

type ActionOf<K extends TrickAction['type']> = Extract<TrickAction, { type: K }>;

type TrickHandlers = {
  readonly [K in TrickAction['type']]: (state: TrickState, action: ActionOf<K>) => TrickState;
};

const HANDLERS: TrickHandlers = {
  begin: (_state, action) => ({
    ...INITIAL,
    phase: 'shuffling',
    deck: drawDeck(action.seed),
    seed: action.seed,
    startedAt: action.now,
  }),

  shuffled: (state) => (state.phase === 'shuffling' ? { ...state, phase: 'memorise' } : state),

  memorised: (state) => (state.phase === 'memorise' ? { ...state, phase: 'target' } : state),

  chooseTarget: (state, action) => {
    if (state.phase !== 'target') return state;
    if (!Number.isInteger(action.target) || action.target < 1 || action.target > MAX_TARGET) {
      return state;
    }
    return { ...state, phase: 'round', target: action.target, round: 0, picks: [] };
  },

  pickPile: (state, action) => {
    if (state.phase !== 'round') return state;
    const round = state.round + 1;
    return {
      ...state,
      deck: restack(state.deck, action.pile, state.target, state.round),
      round,
      picks: [...state.picks, action.pile],
      phase: round >= ROUNDS ? 'divining' : 'round',
    };
  },

  divined: (state, action) =>
    state.phase === 'divining' ? { ...state, phase: 'reveal', finishedAt: action.now } : state,

  reset: () => INITIAL,
};

export const trickReducer = (state: TrickState, action: TrickAction): TrickState =>
  HANDLERS[action.type]?.(state, action as never) ?? state;

const STEP_INDEX: Record<Phase, number> = {
  intro: 0,
  shuffling: 1,
  memorise: 1,
  target: 2,
  round: 3,
  divining: 4,
  reveal: 4,
};

const stepIndexOf = (state: TrickState): number => STEP_INDEX[state.phase];

export const useTrick = () => {
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
};

export type TrickController = ReturnType<typeof useTrick>;
