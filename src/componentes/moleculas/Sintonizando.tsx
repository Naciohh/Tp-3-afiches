import { useEffect, useRef } from 'react';
import { gsap, reducido } from '../../lib/movimiento';

// Caja sobre la cámara mientras se busca el afiche. El rótulo se decodifica en loop, como una señal que entra y sale.
export function Sintonizando({ rotulo }: { rotulo: string }) {
  const zocalo = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (!zocalo.current || reducido()) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6 });
    tl.to(zocalo.current, { duration: 0.9, scrambleText: { text: 'SINTONIZANDO SEÑAL…', chars: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789', speed: 0.6 } });
    return () => { tl.kill(); };
  }, []);
  return (
    <div className="c-sintonizando" role="status">
      <p className="t-rotulo c-sintonizando__zocalo" ref={zocalo}>SINTONIZANDO SEÑAL…</p>
      <p className="t-cuerpo-14 c-sintonizando__rotulo">{rotulo}</p>
    </div>
  );
}
