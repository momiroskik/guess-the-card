'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { useHaptics } from '@/shared/hooks/useHaptics';
import type { HapticPattern } from '@/shared/hooks/useHaptics';
import { cn } from '@/shared/lib/cn';

type Variant = 'primary' | 'ghost';
type Size = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  haptic?: HapticPattern | false;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', haptic = 'tap', className, onClick, children, ...rest },
  ref,
) {
  const vibrate = useHaptics();

  return (
    <button
      ref={ref}
      type="button"
      className={cn('btn', VARIANTS[variant], size === 'sm' && 'btn-sm', className)}
      onClick={(event) => {
        if (haptic) vibrate(haptic);
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </button>
  );
});
