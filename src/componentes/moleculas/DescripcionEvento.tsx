import { Censura } from '../atomos/Censura';

export function DescripcionEvento({ texto, abierto }: { texto: string; abierto: boolean }) {
  if (abierto) return <p className="t-cuerpo-15">{texto}</p>;
  return (
    <div className="c-barras" aria-hidden="true">
      <Censura ancho={300} />
      <Censura ancho={260} />
      <Censura ancho={180} />
    </div>
  );
}
