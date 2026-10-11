import { Medidor } from '../moleculas/Medidor';

export function CabeceraColeccion({ desbloqueadas, total }: { desbloqueadas: number; total: number }) {
  return (
    <header className="c-cabecera">
      <div className="c-cabecera__fila">
        <h1 className="t-display-28">Colección</h1>
        <p className="t-display-20 c-cabecera__contador">{desbloqueadas}/{total}</p>
      </div>
      <Medidor llenos={desbloqueadas} total={total} />
      <p className="t-cuerpo-regular-14 c-cabecera__nota">Cada afiche escondido abre un tele. Escaneá todos.</p>
    </header>
  );
}
