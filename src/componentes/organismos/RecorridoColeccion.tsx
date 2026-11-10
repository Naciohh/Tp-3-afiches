import { frasesEpoca, noticias, type Noticia } from '../../datos/noticias';
import { TarjetaColeccion } from '../moleculas/TarjetaColeccion';
import { TituloEpoca } from '../moleculas/TituloEpoca';

type Props = {
  desbloqueadas: string[];
  nueva: string | null;
  onAbrir: (n: Noticia) => void;
};

// Las noticias agrupadas por época ("Así engañaron a tus abuelos"...). Cada tarjeta es una hoja de papel.
export function RecorridoColeccion({ desbloqueadas, nueva, onAbrir }: Props) {
  const filas: React.ReactNode[] = [];
  let epocaActual = '';
  noticias.forEach((n, i) => {
    if (n.epoca !== epocaActual) {
      epocaActual = n.epoca;
      filas.push(<TituloEpoca key={`e-${n.epoca}`} frase={frasesEpoca[n.epoca]} />);
    }
    const abierta = desbloqueadas.includes(n.id);
    const estado = !abierta ? 'Bloqueada' : n.id === nueva ? 'Nueva' : 'Desbloqueada';
    filas.push(<TarjetaColeccion key={n.id} noticia={n} numero={i + 1} estado={estado} onAbrir={() => onAbrir(n)} />);
  });
  return <div className="c-recorrido">{filas}</div>;
}
