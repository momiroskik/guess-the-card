import { memo } from 'react';

import { ROUNDS } from '../constants';
import type { PileIndex } from '../model/types';

interface RoundTrackerProps {
  picks: readonly PileIndex[];
  round: number;
}

const ROUND_INDICES = Array.from({ length: ROUNDS }, (_, i) => i);

function RoundTrackerImpl({ picks, round }: RoundTrackerProps) {
  return (
    <ol className="tracker" aria-label="Rounds">
      {ROUND_INDICES.map((index) => {
        const done = index < picks.length;
        const state = done ? 'done' : index === round ? 'current' : 'todo';

        return (
          <li
            key={index}
            className="tracker-step"
            data-state={state}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            {done ? (
              <>
                <span className="tracker-tick" aria-hidden="true">
                  &#10003;
                </span>
                <span>Row {picks[index] + 1}</span>
                <span className="sr-only">, round {index + 1} locked</span>
              </>
            ) : (
              <span>
                {state === 'current' ? 'Pick now' : `Round ${index + 1}`}
                <span className="sr-only">{state === 'todo' ? ', not started' : ''}</span>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export const RoundTracker = memo(RoundTrackerImpl);
