// Movimiento de la marca con GSAP (como en el manual): entradas, letras que se pegan y textos que se decodifican.
// Todo respeta "reducir movimiento" del sistema: sin animación, el contenido aparece directo.
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

export { gsap };

export const EASE = { entra: 'expo.out', pega: 'back.out(2.2)', sale: 'power3.in' } as const;

export const reducido = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Entrada de una pantalla: los bloques suben y aparecen en cascada.
export function entrada(raiz: HTMLElement | null) {
  if (!raiz || reducido()) return;
  const hijos = Array.from(raiz.children).filter((el) => !el.classList.contains('c-boton-ajustes') && !el.classList.contains('p-bienvenida__vortice'));
  gsap.from(hijos, { y: 18, opacity: 0, duration: 0.6, ease: EASE.entra, stagger: 0.05, clearProps: 'transform,opacity' });
}

// Algo que se pega como un recorte: cae girado y rebota.
export function pegar(el: Element | null, demora = 0) {
  if (!el || reducido()) return;
  gsap.from(el, { scale: 1.25, rotation: -6, opacity: 0, duration: 0.5, delay: demora, ease: EASE.pega, clearProps: 'transform,opacity' });
}
