'use client';

import { useEffect, useState } from 'react';

export function useElapsed(startedAt: number | null, active: boolean): number {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (startedAt === null || !active) return;

    const sync = () => setElapsed(Date.now() - startedAt);
    sync();

    let timer = window.setInterval(sync, 1000);

    const onVisibility = () => {
      window.clearInterval(timer);
      if (document.visibilityState === 'visible') {
        sync();
        timer = window.setInterval(sync, 1000);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [startedAt, active]);

  return elapsed;
}
