import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { cx } from '../../lib/cx';
import { EASE, gsap, reducido } from '../../lib/movimiento';

type Props = { tipo: 'Falso' | 'Real' | 'Neutro' | 'Consejo'; etiqueta: string; titulo?: string; children: ReactNode };

// Hoja de papel con borde rasgado y cinta. "Falso" lleva el texto tachado y el sello rojo, que cae cuando la hoja entra en pantalla.
export function BloqueFicha({ tipo, etiqueta, titulo, children }: Props) {
  const sello = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = sello.current;
    if (!el || reducido()) return;
    gsap.set(el, { opacity: 0, scale: 2.2, rotation: -10 });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      gsap.to(el, { opacity: 1, scale: 1, rotation: 8, duration: 0.45, ease: EASE.pega });
      io.disconnect();
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className={cx('c-bloque', 'hoja', `c-bloque--${tipo.toLowerCase()}`)}>
      <span className="cinta" aria-hidden="true" />
      {tipo === 'Falso' && <span className="c-sello" ref={sello} aria-hidden="true">Falso</span>}
      <h3 className="t-rotulo">{etiqueta}</h3>
      {titulo && <p className="t-display-22">{titulo}</p>}
      <p className="t-cuerpo-15 c-bloque__texto">{tipo === 'Falso' && <span className="sr">Falso: </span>}{children}</p>
    </section>
  );
}
