'use client';

import { useEffect } from 'react';

import { faceOf } from '../../model/deck';
import { Button } from '@/shared/ui/Button';
import { PlayingCard } from '@/shared/ui/PlayingCard';
import { useHaptics } from '@/shared/hooks/useHaptics';
import { formatDuration } from '@/shared/lib/time';

const SPARKS = Array.from({ length: 20 }, (_, i) => i);

interface RevealStageProps {
  card: number;
  target: number;
  durationMs: number | null;
  bestMs: number | null;
  plays: number;
  onReplay: () => void;
}

export function RevealStage({
  card,
  target,
  durationMs,
  bestMs,
  plays,
  onReplay,
}: RevealStageProps) {
  const face = faceOf(card);
  const vibrate = useHaptics();

  useEffect(() => {
    const timer = window.setTimeout(() => vibrate('reveal'), 700);
    return () => window.clearTimeout(timer);
  }, [vibrate]);

  return (
    <div className="flex flex-col items-center gap-6">
      <header className="animate-rise space-y-1 text-center">
        <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-brand-lift uppercase">
          Position {target}
        </p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">You were thinking of</h2>
      </header>

      <div className="relative grid place-items-center">
        <span className="reveal-halo" aria-hidden="true" />

        <span className="sparks stagger" aria-hidden="true">
          {SPARKS.map((index) => (
            <span key={index} className="spark" />
          ))}
        </span>

        <div className="flip">
          <div className="flip-inner">
            <span className="flip-face flip-back">
              <PlayingCard code={null} decorative />
            </span>
            <span className="flip-face">
              <PlayingCard code={card} decorative />
            </span>
          </div>
        </div>
      </div>

      <p className="reveal-name text-lg font-semibold tracking-tight" aria-live="polite">
        The {face.label}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {durationMs !== null && <span className="chip">{formatDuration(durationMs)}</span>}
        {bestMs !== null && <span className="chip">Best {formatDuration(bestMs)}</span>}
        {plays > 0 && (
          <span className="chip">
            {plays} {plays === 1 ? 'play' : 'plays'}
          </span>
        )}
      </div>

      <Button onClick={onReplay} className="w-full max-w-xs" haptic="select">
        Again
      </Button>
    </div>
  );
}
