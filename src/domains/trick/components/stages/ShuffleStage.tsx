'use client';

import { useEffect } from 'react';

import { SHUFFLE_MS } from '../../constants';
import { PlayingCard } from '@/shared/ui/PlayingCard';

const RIFFLE_CARDS = Array.from({ length: 12 }, (_, i) => i);

export function ShuffleStage({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, SHUFFLE_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="animate-rise flex flex-col items-center gap-7 text-center">
      <div className="riffle stagger" aria-hidden="true">
        {RIFFLE_CARDS.map((index) => (
          <span key={index}>
            <PlayingCard code={null} decorative />
          </span>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Shuffling</h2>
        <p className="text-sm text-chalk-dim">Twenty-seven cards, drawn from a full deck.</p>
      </div>

      <p className="sr-only" role="status">
        Shuffling the deck.
      </p>
    </div>
  );
}
