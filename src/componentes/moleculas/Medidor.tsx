import { Tramo } from '../atomos/Tramo';

export function Medidor({ llenos, total }: { llenos: number; total: number }) {
  return (
    <div className="c-medidor" role="img" aria-label={`${llenos} de ${total}`}>
      {Array.from({ length: total }, (_, i) => <Tramo key={i} estado={i < llenos ? 'Lleno' : 'Vacío'} />)}
    </div>
  );
}
