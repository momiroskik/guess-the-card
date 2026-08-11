'use client';

import { useCallback } from 'react';

import { NumberPad } from '../NumberPad';
import { MAX_TARGET } from '../../model/ternary';
import { randomSeed } from '../../model/deck';
import { Button } from '@/shared/ui/Button';

export function TargetStage({ onChoose }: { onChoose: (target: number) => void }) {
  const surpriseMe = useCallback(() => {
    onChoose(1 + (randomSeed() % MAX_TARGET));
  }, [onChoose]);

  return (
    <div className="flex flex-col items-center gap-6">
      <header className="animate-rise space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Name a position.</h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-chalk-dim text-pretty">
          Anywhere from 1 to {MAX_TARGET}. That is where your card will be sitting when I am done.
        </p>
      </header>

      <NumberPad onSelect={onChoose} />

      <Button variant="ghost" size="sm" onClick={surpriseMe}>
        Surprise me
      </Button>
    </div>
  );
}
