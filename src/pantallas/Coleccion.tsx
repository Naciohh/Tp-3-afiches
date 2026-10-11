import { useRef } from 'react';
import { Boton } from '../componentes/atomos/Boton';
import { CabeceraColeccion } from '../componentes/organismos/CabeceraColeccion';
import { CierreColeccion } from '../componentes/organismos/CierreColeccion';
import { PanelEvento } from '../componentes/organismos/PanelEvento';
import { RecorridoColeccion } from '../componentes/organismos/RecorridoColeccion';
import { TOTAL, type Noticia } from '../datos/noticias';

type Props = {
  desbloqueadas: string[];
  nueva: string | null;
  onAbrir: (n: Noticia) => void;
  onEscanear: () => void;
  onChequear: () => void;
  onReiniciar: () => void;
};

export function Coleccion({ desbloqueadas, nueva, onAbrir, onEscanear, onChequear, onReiniciar }: Props) {
  const completa = desbloqueadas.length >= TOTAL;
  // Reinicio oculto para las demos: mantener apretado el título 3 segundos.
  const timer = useRef<number>();
  const apretar = () => { timer.current = window.setTimeout(() => { if (confirm('¿Borrar tu progreso y empezar de cero?')) onReiniciar(); }, 3000); };
  const soltar = () => window.clearTimeout(timer.current);
  return (
    <main className="p-coleccion">
      <div onPointerDown={apretar} onPointerUp={soltar} onPointerLeave={soltar} onPointerCancel={soltar}>
        <CabeceraColeccion desbloqueadas={desbloqueadas.length} total={TOTAL} />
      </div>
      <RecorridoColeccion desbloqueadas={desbloqueadas} nueva={nueva} onAbrir={onAbrir} />
      <PanelEvento abierto={completa} />
      {completa ? <CierreColeccion onChequear={onChequear} /> : <Boton tipo="Secundario" etiqueta="Cómo chequear una noticia" onClick={onChequear} />}
      <Boton etiqueta="Escanear" onClick={onEscanear} />
    </main>
  );
}
