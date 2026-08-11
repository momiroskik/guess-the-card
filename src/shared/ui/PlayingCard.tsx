import { memo } from 'react';

import { faceOf } from '@/domains/trick/model/deck';
import { cn } from '@/shared/lib/cn';

interface PlayingCardProps {
  code: number | null;
  className?: string;
  decorative?: boolean;
}

function PlayingCardImpl({ code, className, decorative = false }: PlayingCardProps) {
  if (code === null) {
    return (
      <span
        className={cn('card card-back', className)}
        aria-hidden={decorative || undefined}
      />
    );
  }

  const face = faceOf(code);

  return (
    <span
      className={cn('card', className)}
      data-red={face.red}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : face.label}
      aria-hidden={decorative || undefined}
    >
      <span className="card-corner">
        {face.rank}
        <span aria-hidden="true">{face.suit}</span>
      </span>
      <span className="card-pip" aria-hidden="true">
        {face.suit}
      </span>
    </span>
  );
}

export const PlayingCard = memo(PlayingCardImpl);
