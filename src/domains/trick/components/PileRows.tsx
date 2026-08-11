'use client';

import { memo, useCallback, useState } from 'react';

import { COLLECT_MS, PILE_NAMES } from '../constants';
import { faceOf } from '../model/deck';
import type { PileIndex, Piles } from '../model/types';
import { PlayingCard } from '@/shared/ui/PlayingCard';
import { useHaptics } from '@/shared/hooks/useHaptics';

interface PileRowsProps {
  piles: Piles;
  onSelect: (pile: PileIndex) => void;
}

function PileRowsImpl({ piles, onSelect }: PileRowsProps) {
  const vibrate = useHaptics();
  const [chosen, setChosen] = useState<PileIndex | null>(null);

  const choose = useCallback(
    (pile: PileIndex) => {
      if (chosen !== null) return;
      setChosen(pile);
      vibrate('select');
      window.setTimeout(() => onSelect(pile), COLLECT_MS);
    },
    [chosen, onSelect, vibrate],
  );

  return (
    <div className="rows" data-collecting={chosen !== null}>
      {piles.map((pile, rowIndex) => (
        <button
          key={rowIndex}
          type="button"
          className="row"
          data-chosen={chosen === rowIndex}
          disabled={chosen !== null}
          onClick={() => choose(rowIndex as PileIndex)}
        >
          <span className="sr-only">
            {`${PILE_NAMES[rowIndex]}: ` +
              Array.from(pile, (code) => faceOf(code).label).join(', ') +
              '. Select if your card is in this row.'}
          </span>

          <span className="row-pick" aria-hidden="true">
            {rowIndex + 1}
            <span className="row-pick-hint">here</span>
          </span>

          <span className="fan stagger" aria-hidden="true">
            {Array.from(pile, (code) => (
              <PlayingCard key={code} code={code} decorative />
            ))}
          </span>
        </button>
      ))}
    </div>
  );
}

export const PileRows = memo(PileRowsImpl);
