import { describe, expect, it } from 'vitest';

import { cardAt, pileHolding } from '../model/engine';
import { MAX_TARGET, ROUNDS } from '../model/ternary';
import { trickReducer } from './useTrick';
import type { TrickAction, TrickState } from './useTrick';

const INITIAL = trickReducer(undefined as unknown as TrickState, { type: 'reset' });

function run(actions: TrickAction[], from: TrickState = INITIAL): TrickState {
  return actions.reduce(trickReducer, from);
}

function playThrough(target: number, cardIndex: number, seed = 2026) {
  let state = run([
    { type: 'begin', seed, now: 1_000 },
    { type: 'shuffled' },
    { type: 'memorised' },
    { type: 'chooseTarget', target },
  ]);

  const secret = state.deck[cardIndex];

  for (let round = 0; round < ROUNDS; round++) {
    expect(state.phase).toBe('round');
    expect(state.round).toBe(round);
    state = trickReducer(state, { type: 'pickPile', pile: pileHolding(state.deck, secret) });
  }

  state = trickReducer(state, { type: 'divined', now: 9_000 });
  return { state, secret };
}

describe('trick state machine', () => {
  it('walks intro → shuffling → memorise → target → 3 rounds → divining → reveal', () => {
    const begun = run([{ type: 'begin', seed: 1, now: 0 }]);
    expect(begun.phase).toBe('shuffling');
    expect(trickReducer(begun, { type: 'shuffled' }).phase).toBe('memorise');

    const { state } = playThrough(11, 5);
    expect(state.phase).toBe('reveal');
    expect(state.picks).toHaveLength(ROUNDS);
    expect(state.finishedAt! - state.startedAt!).toBe(8_000);
  });

  it('reveals the memorised card for every target and every seat', () => {
    for (let target = 1; target <= MAX_TARGET; target++) {
      for (let cardIndex = 0; cardIndex < MAX_TARGET; cardIndex++) {
        const { state, secret } = playThrough(target, cardIndex);
        expect(cardAt(state.deck, target)).toBe(secret);
      }
    }
  });

  it('never records which card the player chose', () => {
    const { state } = playThrough(20, 3);
    const serialised = JSON.stringify({ ...state, deck: undefined });
    expect(Object.keys(state).sort()).toEqual(
      ['deck', 'finishedAt', 'phase', 'picks', 'round', 'seed', 'startedAt', 'target'].sort(),
    );
    expect(serialised).not.toContain('secret');
  });

  it('ignores actions that do not belong to the current phase', () => {
    const idle = run([
      { type: 'memorised' },
      { type: 'pickPile', pile: 0 },
      { type: 'divined', now: 1 },
    ]);
    expect(idle).toBe(INITIAL);
  });

  it('rejects out-of-range positions', () => {
    const ready = run([
      { type: 'begin', seed: 1, now: 0 },
      { type: 'shuffled' },
      { type: 'memorised' },
    ]);
    for (const target of [0, -3, 28, 1.5, Number.NaN]) {
      expect(trickReducer(ready, { type: 'chooseTarget', target }).phase).toBe('target');
    }
    expect(trickReducer(ready, { type: 'chooseTarget', target: 27 }).phase).toBe('round');
  });

  it('reset returns a pristine machine', () => {
    const { state } = playThrough(7, 1);
    const fresh = trickReducer(state, { type: 'reset' });
    expect(fresh.phase).toBe('intro');
    expect(fresh.target).toBe(0);
    expect(fresh.picks).toEqual([]);
    expect(fresh.startedAt).toBeNull();
  });

  it('is replayable: same seed and same answers give the same game', () => {
    const a = playThrough(19, 9, 555);
    const b = playThrough(19, 9, 555);
    expect([...a.state.deck]).toEqual([...b.state.deck]);
    expect(a.state.picks).toEqual(b.state.picks);
  });
});
