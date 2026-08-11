'use client';

import { DECK_SIZE, ROUNDS } from '../../model/engine';
import { PlayingCard } from '@/shared/ui/PlayingCard';
import { Button } from '@/shared/ui/Button';

const FAN = [0, 1, 2, 3, 4];

const FACTS = [
  { value: DECK_SIZE, label: 'cards' },
  { value: ROUNDS, label: 'questions' },
  { value: 1, label: 'answer' },
];

export function IntroStage({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="hand" aria-hidden="true">
        {FAN.map((index) => (
          <span key={index}>
            <PlayingCard code={null} decorative />
          </span>
        ))}
      </div>

      <div className="intro flex flex-col items-center gap-8">
        <div className="space-y-4">
          <h1 className="text-[2.6rem] leading-[0.98] font-bold tracking-[-0.03em] text-balance sm:text-6xl">
            Think of a card.
            <br />
            <span className="bg-gradient-to-br from-brand-lift to-brand bg-clip-text text-transparent">
              I&rsquo;ll name it.
            </span>
          </h1>
          <p className="mx-auto max-w-sm text-[0.95rem] leading-relaxed text-chalk-dim text-pretty">
            You pick a card and a position. I ask three questions and never learn which card you
            chose. It turns up exactly where you asked anyway.
          </p>
        </div>

        <ul className="flex items-center gap-6" aria-label="At a glance">
          {FACTS.map((fact) => (
            <li key={fact.label} className="flex flex-col items-center gap-0.5">
              <span className="text-2xl font-bold tabular-nums">{fact.value}</span>
              <span className="text-[0.62rem] font-semibold tracking-[0.16em] text-chalk-faint uppercase">
                {fact.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex w-full max-w-xs flex-col items-center gap-3">
          <Button onClick={onBegin} className="w-full" haptic="select">
            Shuffle and deal
          </Button>
          <p className="text-[0.7rem] text-chalk-faint">
            No accounts, no network, no images. Just arithmetic.
          </p>
        </div>
      </div>
    </div>
  );
}
