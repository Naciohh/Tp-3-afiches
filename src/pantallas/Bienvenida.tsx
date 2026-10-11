import { Aviso } from '../componentes/moleculas/Aviso';
import { Boton } from '../componentes/atomos/Boton';

export function Bienvenida({ onEmpezar, cargando }: { onEmpezar: () => void; cargando: boolean }) {
  return (
    <main className="p-bienvenida">
      <h1 className="t-display-40 p-bienvenida__titulo">
        <span>Así te</span>
        <span className="p-bienvenida__marca">engañan</span>
      </h1>
      <p className="t-cuerpo-regular-16">Mirá los afiches y escaneá cada uno con la cámara para ver cómo se contó la noticia.</p>
      <ul className="p-bienvenida__avisos">
        <Aviso icono="QR" texto="Cuando se abra la cámara, apuntá al afiche entero, no solo al QR." />
        <Aviso icono="Volumen" texto="Subí el volumen o usá auriculares." />
        <Aviso icono="Ojo" texto="Mirá el afiche con atención, no mientras caminás." />
      </ul>
      <Boton etiqueta="Empezar" tipo={cargando ? 'Cargando' : 'Primario'} onClick={onEmpezar} />
    </main>
  );
}
