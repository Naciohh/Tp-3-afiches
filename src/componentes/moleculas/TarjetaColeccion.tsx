import { cx } from '../../lib/cx';
import type { Noticia } from '../../datos/noticias';
import { Miniatura } from '../atomos/Miniatura';
import { Rayado } from '../atomos/Rayado';

type Props = {
  noticia: Noticia;
  numero: number;
  estado: 'Desbloqueada' | 'Bloqueada' | 'Nueva';
  onAbrir?: () => void;
};

export function TarjetaColeccion({ noticia, numero, estado, onAbrir }: Props) {
  const num = String(numero).padStart(2, '0');
  if (estado === 'Bloqueada') {
    return (
      <div className="c-tarjeta c-tarjeta--bloqueada" aria-label={`Noticia ${num} bloqueada`}>
        <Rayado />
        <Miniatura id={noticia.id} estado="Silueta" />
        <div className="c-tarjeta__texto c-tarjeta__texto--bloqueada">
          <p className="t-display-16">{num}</p>
          <span className="c-barra" style={{ width: 96 }} />
          <span className="c-barra" style={{ width: 112 }} />
        </div>
      </div>
    );
  }
  return (
    <button className={cx('c-tarjeta', estado === 'Nueva' && 'c-tarjeta--nueva')} type="button" onClick={onAbrir}>
      <Miniatura id={noticia.id} />
      <div className="c-tarjeta__texto">
        <p className="t-display-16">{num}</p>
        <p className="t-cuerpo-bold-17">{noticia.titulo}</p>
        <p className="t-datos-regular-12">{noticia.epoca} · {noticia.anio}</p>
      </div>
    </button>
  );
}
