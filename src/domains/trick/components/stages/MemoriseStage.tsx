'use client';

import { CardSpread } from '../CardSpread';
import type { Deck } from '../../model/types';
import { Button } from '@/shared/ui/Button';

interface MemoriseStageProps {
  deck: Deck;
  onReady: () => void;
}

export function MemoriseStage({ deck, onReady }: MemoriseStageProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <header className="animate-rise space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Pick one. Keep it.</h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-chalk-dim text-pretty">
          Choose any card below and hold it in your head.{' '}
          <strong className="font-semibold text-chalk">Do not tap it</strong> &mdash; nothing here
          records your choice, and that is the whole point.
        </p>
      </header>

      <CardSpread deck={deck} />

      <Button onClick={onReady} className="w-full max-w-xs" haptic="select">
        Got it &mdash; memorised
      </Button>
    </div>
  );
}
