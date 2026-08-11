'use client';

import { useEffect, useRef } from 'react';

import { ROUNDS, STEPPER } from '../constants';
import { useTrick } from '../hooks/useTrick';
import { useTrickStats } from '../hooks/useTrickStats';
import type { PileIndex } from '../model/types';
import { DiviningStage } from './stages/DiviningStage';
import { IntroStage } from './stages/IntroStage';
import { MemoriseStage } from './stages/MemoriseStage';
import { RevealStage } from './stages/RevealStage';
import { RoundStage } from './stages/RoundStage';
import { ShuffleStage } from './stages/ShuffleStage';
import { TargetStage } from './stages/TargetStage';
import { useElapsed } from '@/shared/hooks/useElapsed';
import { useHotkeys } from '@/shared/hooks/useHotkeys';
import { Stepper } from '@/shared/ui/Stepper';
import { formatDuration } from '@/shared/lib/time';

export function TrickGame() {
  const trick = useTrick();
  const { state, piles, revealedCard, durationMs, stepIndex } = trick;
  const { stats, record } = useTrickStats();

  const inProgress = state.phase !== 'intro' && state.phase !== 'reveal';
  const elapsed = useElapsed(state.startedAt, inProgress);

  const recordedAt = useRef<number | null>(null);
  useEffect(() => {
    if (state.phase !== 'reveal' || durationMs === null) return;
    if (recordedAt.current === state.finishedAt) return;
    recordedAt.current = state.finishedAt;
    record(durationMs);
  }, [state.phase, state.finishedAt, durationMs, record]);

  useHotkeys({
    '1': () => state.phase === 'round' && trick.pickPile(0 as PileIndex),
    '2': () => state.phase === 'round' && trick.pickPile(1 as PileIndex),
    '3': () => state.phase === 'round' && trick.pickPile(2 as PileIndex),
    r: () => state.phase !== 'intro' && trick.reset(),
    escape: () => state.phase !== 'intro' && trick.reset(),
  });

  return (
    <>
      <header>
        <div className="flex min-h-8 items-center justify-end gap-2 pt-1">
          {inProgress && state.startedAt !== null && (
            <span className="chip tabular-nums" aria-label="Elapsed time">
              {formatDuration(elapsed)}
            </span>
          )}
          {state.phase !== 'intro' && (
            <button
              type="button"
              onClick={trick.reset}
              className="chip transition-colors hover:text-chalk"
              aria-label="Start over"
            >
              Reset
            </button>
          )}
        </div>

        <Stepper
          steps={STEPPER}
          current={stepIndex}
          detail={state.phase === 'round' ? `${state.round + 1}/${ROUNDS}` : undefined}
        />
      </header>

      <main className="shell-body">
        <div className="w-full max-w-2xl py-4">
          {state.phase === 'intro' && <IntroStage onBegin={trick.begin} />}

          {state.phase === 'shuffling' && <ShuffleStage onDone={trick.shuffled} />}

          {state.phase === 'memorise' && (
            <MemoriseStage deck={state.deck} onReady={trick.memorised} />
          )}

          {state.phase === 'target' && <TargetStage onChoose={trick.chooseTarget} />}

          {state.phase === 'round' && (
            <RoundStage
              piles={piles}
              round={state.round}
              target={state.target}
              picks={state.picks}
              onSelect={trick.pickPile}
            />
          )}

          {state.phase === 'divining' && <DiviningStage onDone={trick.divined} />}

          {state.phase === 'reveal' && revealedCard !== null && (
            <RevealStage
              card={revealedCard}
              target={state.target}
              durationMs={durationMs}
              bestMs={stats.bestMs}
              plays={stats.plays}
              onReplay={trick.begin}
            />
          )}
        </div>
      </main>
    </>
  );
}
