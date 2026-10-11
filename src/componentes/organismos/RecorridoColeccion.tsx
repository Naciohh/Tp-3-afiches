import { useLayoutEffect, useRef, useState } from 'react';
import { frasesEpoca, noticias, type Noticia } from '../../datos/noticias';
import { Punto } from '../atomos/Punto';
import { TarjetaColeccion } from '../moleculas/TarjetaColeccion';
import { TituloEpoca } from '../moleculas/TituloEpoca';

type Props = {
  desbloqueadas: string[];
  nueva: string | null;
  onAbrir: (n: Noticia) => void;
};

// Línea de tiempo vertical: un punto por noticia (naranja si está desbloqueada), a la altura media de cada tarjeta.
export function RecorridoColeccion({ desbloqueadas, nueva, onAbrir }: Props) {
  const raiz = useRef<HTMLDivElement>(null);
  const [linea, setLinea] = useState<{ top: number; alto: number } | null>(null);

  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const medir = () => {
      const items = el.querySelectorAll<HTMLElement>('[data-item]');
      if (items.length < 2) return setLinea(null);
      const a = items[0], b = items[items.length - 1];
      const top = a.offsetTop + a.offsetHeight / 2;
      setLinea({ top, alto: b.offsetTop + b.offsetHeight / 2 - top });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [desbloqueadas.length]);

  const filas: React.ReactNode[] = [];
  let epocaActual = '';
  noticias.forEach((n, i) => {
    if (n.epoca !== epocaActual) {
      epocaActual = n.epoca;
      filas.push(<TituloEpoca key={`e-${n.epoca}`} frase={frasesEpoca[n.epoca]} />);
    }
    const abierta = desbloqueadas.includes(n.id);
    const estado = !abierta ? 'Bloqueada' : n.id === nueva ? 'Nueva' : 'Desbloqueada';
    filas.push(
      <div className="c-recorrido__item" data-item key={n.id}>
        <Punto estado={abierta ? 'Abierto' : 'Cerrado'} />
        <TarjetaColeccion noticia={n} numero={i + 1} estado={estado} onAbrir={() => onAbrir(n)} />
      </div>,
    );
  });

  return (
    <div className="c-recorrido" ref={raiz}>
      {linea && <span className="c-recorrido__linea" style={{ top: linea.top, height: linea.alto }} />}
      {filas}
    </div>
  );
}
