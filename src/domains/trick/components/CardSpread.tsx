import { memo } from 'react';

import type { Deck } from '../model/types';
import { PlayingCard } from '@/shared/ui/PlayingCard';

function CardSpreadImpl({ deck }: { deck: Deck }) {
  return (
    <div className="spread stagger" role="list" aria-label="The twenty-seven cards in play">
      {Array.from(deck, (code) => (
        <div key={code} role="listitem">
          <PlayingCard code={code} />
        </div>
      ))}
    </div>
  );
}

export const CardSpread = memo(CardSpreadImpl);
