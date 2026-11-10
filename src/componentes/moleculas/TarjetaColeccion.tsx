import { useEffect, useRef } from 'react';
import type { Noticia } from '../../datos/noticias';
import { cx } from '../../lib/cx';
import { pegar } from '../../lib/movimiento';
import { Censura } from '../atomos/Censura';
import { Miniatura } from '../atomos/Miniatura';

type Props = {
  noticia: Noticia;
  numero: number;
  estado: 'Desbloqueada' | 'Bloqueada' | 'Nueva';
  onAbrir?: () => void;
};

// Hoja de papel con borde rasgado. Bloqueada: silueta de la tele y los datos tapados. Nueva: se pega con un rebote.
export function TarjetaColeccion({ noticia, numero, estado, onAbrir }: Props) {
  const num = String(numero).padStart(2, '0');
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (estado === 'Nueva') pegar(ref.current, 0.35); }, [estado]);
  if (estado === 'Bloqueada') {
    return (
      <div className="c-tarjeta c-tarjeta--bloqueada hoja" aria-label={`Noticia ${num} bloqueada`}>
        <Miniatura id={noticia.id} estado="Silueta" />
        <div className="c-tarjeta__texto c-tarjeta__texto--bloqueada">
          <p className="t-numero c-tarjeta__numero">{num}</p>
          <Censura ancho={150} />
          <Censura ancho={104} />
          <p className="t-rotulo-fino">Sin escanear</p>
        </div>
      </div>
    );
  }
  return (
    <button className={cx('c-tarjeta', 'hoja', estado === 'Nueva' && 'c-tarjeta--nueva')} type="button" onClick={onAbrir} ref={ref}>
      <Miniatura id={noticia.id} />
      <div className="c-tarjeta__texto">
        <p className="t-numero c-tarjeta__numero">{num}</p>
        <p className="t-cuerpo-15">{noticia.titulo}</p>
        <p className="t-rotulo-fino">{noticia.epoca} · {noticia.anio}</p>
      </div>
    </button>
  );
}
