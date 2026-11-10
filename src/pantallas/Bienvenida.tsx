import { Aviso } from '../componentes/moleculas/Aviso';
import { Boton } from '../componentes/atomos/Boton';
import { BotonAjustes } from '../componentes/atomos/BotonAjustes';
import { useEntrada } from '../lib/useEntrada';

export function Bienvenida({ onEmpezar, onAjustes, cargando }: { onEmpezar: () => void; onAjustes: () => void; cargando: boolean }) {
  const ref = useEntrada<HTMLElement>();
  return (
    <main className="p-bienvenida" ref={ref}>
      <span className="p-bienvenida__vortice" aria-hidden="true" />
      <p className="t-rotulo submarca">Desinfo · Escaneo</p>
      <BotonAjustes onClick={onAjustes} />
      <h1 className="t-display-64 p-bienvenida__titulo">
        <span>Así te</span>
        <span className="p-bienvenida__marca">engañan</span>
      </h1>
      <p className="t-cuerpo-17">Mirá los afiches y escaneá cada uno con la cámara para ver cómo se contó la noticia.</p>
      <ul className="p-bienvenida__avisos">
        <Aviso numero={1} texto="Cuando se abra la cámara, apuntá al afiche entero, no solo al QR." />
        <Aviso numero={2} texto="Subí el volumen o usá auriculares." />
        <Aviso numero={3} texto="Mirá el afiche con atención, no mientras caminás." />
      </ul>
      <Boton etiqueta="Empezar" tipo={cargando ? 'Cargando' : 'Primario'} onClick={onEmpezar} />
    </main>
  );
}
