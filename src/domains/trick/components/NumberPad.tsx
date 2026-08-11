'use client';

import { memo } from 'react';

import { MAX_TARGET } from '../model/ternary';
import { useHaptics } from '@/shared/hooks/useHaptics';

const NUMBERS = Array.from({ length: MAX_TARGET }, (_, i) => i + 1);

function NumberPadImpl({ onSelect }: { onSelect: (value: number) => void }) {
  const vibrate = useHaptics();

  return (
    <div
      className="numpad stagger"
      role="group"
      aria-label={`Choose a position from 1 to ${MAX_TARGET}`}
    >
      {NUMBERS.map((value) => (
        <button
          key={value}
          type="button"
          className="numkey"
          aria-label={`Position ${value}`}
          onClick={() => {
            vibrate('select');
            onSelect(value);
          }}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

export const NumberPad = memo(NumberPadImpl);
