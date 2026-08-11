'use client';

import { useEffect, useState } from 'react';

export interface ScriptLine {
  readonly at: number;
}

export function useTimedScript(script: readonly ScriptLine[], enabled = true): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    setIndex(0);

    const timers = script
      .map((line, lineIndex) =>
        line.at > 0 ? window.setTimeout(() => setIndex(lineIndex), line.at) : null,
      )
      .filter((timer): timer is number => timer !== null);

    return () => timers.forEach(window.clearTimeout);
  }, [script, enabled]);

  return index;
}
