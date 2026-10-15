import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { animation } from '../design/tokens';

/** Respect OS “reduce motion” — shorten or skip decorative animation. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduced(!!v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      mounted = false;
      // RN types vary by version
      // @ts-expect-error older RN returns subscription with remove()
      sub?.remove?.();
    };
  }, []);
  return reduced;
}

export function motionMs(base: number, reduced: boolean): number {
  return reduced ? Math.min(base, 80) : base;
}

export const motion = {
  fast: animation.fast,
  normal: animation.normal,
  slow: animation.slow,
  success: animation.success,
};
