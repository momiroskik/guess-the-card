'use client';

import { useEffect } from 'react';

import { MIND_READING_MS, MIND_READING_SCRIPT } from '../../constants';
import { useTimedScript } from '@/shared/hooks/useTimedScript';

const SCAN = { cx: 50, cy: 50, r: 47 };
const MOTES = [0, 1, 2, 3];

export function DiviningStage({ onDone }: { onDone: () => void }) {
  const lineIndex = useTimedScript(MIND_READING_SCRIPT);
  const line = MIND_READING_SCRIPT[lineIndex];

  useEffect(() => {
    const timer = window.setTimeout(onDone, MIND_READING_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="animate-rise flex flex-col items-center gap-8 text-center">
      <div className="mind">
        <svg className="scan" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="scan-track" {...SCAN} />
          <circle className="scan-fill" {...SCAN} />
        </svg>

        <span className="mind-ring" aria-hidden="true" />
        <span className="mind-ring" aria-hidden="true" />
        <span className="mind-ring" aria-hidden="true" />

        <span className="motes" aria-hidden="true">
          {MOTES.map((index) => (
            <span key={index} className="mote" />
          ))}
        </span>

        <span className="mind-core" aria-hidden="true" />
      </div>

      <div key={lineIndex} className="animate-text-in min-h-24 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">{line.text}</h2>
        <p className="mx-auto max-w-xs text-sm text-chalk-dim text-pretty">{line.sub}</p>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {line.text}
      </p>

      <button
        type="button"
        onClick={onDone}
        className="btn btn-ghost btn-sm"
        aria-label="Skip to the reveal"
      >
        Skip ahead
      </button>
    </div>
  );
}
