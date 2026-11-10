import { useLayoutEffect, useRef } from 'react';
import { entrada, gsap } from './movimiento';

// Anima la entrada de la pantalla una vez, al montarse.
export function useEntrada<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => entrada(ref.current), ref);
    return () => ctx.revert();
  }, []);
  return ref;
}
