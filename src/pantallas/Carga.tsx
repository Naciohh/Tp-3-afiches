import { useLayoutEffect, useRef } from 'react';
import { EASE, gsap, reducido } from '../lib/movimiento';

// Las siete letras de DESINFO, recortadas como en el logo: cada una con su papel, su fuente y su giro.
// Son las mismas que en el Figma ("Carga · pantalla de inicio (collage)").
const LETRAS = [
  { ch: 'D', bg: 'var(--papel)', c: 'var(--tinta)', f: 'var(--fuente-collage-2)', i: 'normal', s: 1.0, r: -3 },
  { ch: 'E', bg: 'var(--rojo)', c: 'var(--papel-claro)', f: 'var(--fuente-collage-2)', i: 'normal', s: 0.92, r: 4 },
  { ch: 'S', bg: 'var(--papel-claro)', c: 'var(--tinta)', f: 'var(--fuente-collage-1)', i: 'normal', s: 1.05, r: -2 },
  { ch: 'I', bg: 'var(--gris-papel)', c: 'var(--papel-claro)', f: 'var(--fuente-display)', i: 'normal', s: 1.08, r: 3 },
  { ch: 'N', bg: 'var(--oxido)', c: 'var(--tinta)', f: 'var(--fuente-collage-2)', i: 'normal', s: 0.95, r: -4 },
  { ch: 'F', bg: 'var(--blanco)', c: 'var(--tinta)', f: 'var(--fuente-collage-3)', i: 'italic', s: 1.0, r: 5 },
  { ch: 'O', bg: 'var(--papel)', c: 'var(--tinta)', f: 'var(--fuente-display)', i: 'normal', s: 0.98, r: -2 },
];

// Pantalla de carga: DESINFO se arma letra por letra mientras el contador va de 000 a 100,
// y después la pantalla se rasga en dos y deja ver la bienvenida. Tocar en cualquier lado la adelanta.
export function Carga({ onFin }: { onFin: () => void }) {
  const raiz = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const el = raiz.current!;
    const q = gsap.utils.selector(el);
    const contador = q('.p-carga__contador')[0] as HTMLElement;
    const ctx = gsap.context(() => {
      if (reducido()) {
        contador.textContent = '100';
        tl.current = gsap.timeline({ onComplete: onFin }).to(el, { opacity: 0, duration: 0.4, delay: 0.8 });
        return;
      }
      const cuenta = { v: 0 };
      const t = gsap.timeline({ onComplete: onFin });
      gsap.set(q('.lc'), { opacity: 0, scale: 1.9, y: -30, rotation: (i: number) => LETRAS[i].r * 4 });
      gsap.set(q('.p-carga__lema'), { opacity: 0, y: 8 });
      t.to(cuenta, { v: 100, duration: 2.4, ease: 'none', onUpdate: () => { contador.textContent = String(Math.round(cuenta.v)).padStart(3, '0'); } }, 0)
        .to(q('.lc'), { opacity: 1, scale: 1, y: 0, rotation: (i: number) => LETRAS[i].r, duration: 0.42, ease: EASE.pega, stagger: 0.3 }, 0.15)
        .to(q('.p-carga__cinta'), { opacity: 1, duration: 0.2, stagger: 0.1 }, '>-0.05')
        .to(q('.p-carga__lema'), { opacity: 1, y: 0, duration: 0.35, ease: EASE.entra }, '<')
        .to({}, { duration: 0.45 })
        .addLabel('salida')
        .call(() => el.classList.add('p-carga--abriendo'), undefined, 'salida')
        .to(q('.p-carga__ui'), { opacity: 0, duration: 0.2 }, 'salida')
        .to(q('.p-carga__mitad--arriba, .p-carga__escena'), { yPercent: -110, rotation: -2, duration: 0.75, ease: EASE.sale }, 'salida')
        .to(q('.p-carga__mitad--abajo'), { yPercent: 110, rotation: 2, duration: 0.75, ease: EASE.sale }, 'salida');
      tl.current = t;
    }, el);
    return () => ctx.revert();
  }, [onFin]);

  const saltear = () => { const t = tl.current; if (t && t.timeScale() === 1) t.timeScale(5); };

  return (
    <div className="p-carga" ref={raiz} onClick={saltear} role="status" aria-label="Cargando Así te engañan">
      <div className="p-carga__mitad p-carga__mitad--arriba" />
      <div className="p-carga__mitad p-carga__mitad--abajo" />
      <div className="p-carga__escena">
        <div style={{ position: 'relative' }}>
          <p className="p-carga__palabra" aria-label="DESINFO">
            {LETRAS.map((l) => (
              <span key={l.ch} className="lc" aria-hidden="true"
                style={{ '--lc-bg': l.bg, '--lc-c': l.c, '--lc-f': l.f, '--lc-i': l.i, fontSize: `${l.s}em` } as React.CSSProperties}>
                {l.ch}
              </span>
            ))}
          </p>
          <span className="p-carga__cinta" style={{ left: -18, top: -14, transform: 'rotate(-14deg)' }} />
          <span className="p-carga__cinta" style={{ right: -18, bottom: -12, transform: 'rotate(10deg)' }} />
        </div>
        <p className="t-rotulo p-carga__lema">Así te engañan</p>
      </div>
      <div className="p-carga__ui p-carga__ui--arriba"><span className="t-rotulo-fino">Así te engañan · cargando</span></div>
      <div className="p-carga__ui p-carga__ui--abajo">
        <span className="t-rotulo-fino">Tocá para saltear</span>
        <span className="t-contador p-carga__contador">000</span>
      </div>
    </div>
  );
}
