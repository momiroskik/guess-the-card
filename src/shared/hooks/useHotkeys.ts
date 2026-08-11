'use client';

import { useEffect, useRef } from 'react';

type Handlers = Record<string, (event: KeyboardEvent) => void>;

export function useHotkeys(handlers: Handlers, enabled = true) {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? '')) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const handler = ref.current[event.key.toLowerCase()];
      if (!handler) return;
      event.preventDefault();
      handler(event);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}
