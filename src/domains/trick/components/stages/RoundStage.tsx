'use client';

import { PileRows } from '../PileRows';
import { RoundTracker } from '../RoundTracker';
import { ROUND_HINTS, ROUND_PROMPTS, ROUNDS } from '../../constants';
import { PILE_SIZE } from '../../model/engine';
import type { PileIndex, Piles } from '../../model/types';

interface RoundStageProps {
  piles: Piles;
  round: number;
  target: number;
  picks: readonly PileIndex[];
  onSelect: (pile: PileIndex) => void;
}

export function RoundStage({ piles, round, target, picks, onSelect }: RoundStageProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <header className="animate-rise space-y-1.5 text-center">
        <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-brand-lift uppercase">
          Deal {round + 1} of {ROUNDS} &middot; 3 rows of {PILE_SIZE} &middot; heading for {target}
        </p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{ROUND_PROMPTS[round]}</h2>
        <p className="mx-auto max-w-sm text-sm text-chalk-dim text-pretty">{ROUND_HINTS[round]}</p>
      </header>

      <PileRows key={round} piles={piles} onSelect={onSelect} />

      <RoundTracker picks={picks} round={round} />

      <p className="text-[0.7rem] text-chalk-faint">
        Press the button on the left &mdash; or key{' '}
        <kbd className="font-mono text-chalk-dim">1</kbd>{' '}
        <kbd className="font-mono text-chalk-dim">2</kbd>{' '}
        <kbd className="font-mono text-chalk-dim">3</kbd>
      </p>
    </div>
  );
}
