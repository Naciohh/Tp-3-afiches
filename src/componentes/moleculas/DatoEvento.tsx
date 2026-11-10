import { Censura } from '../atomos/Censura';

export function DatoEvento({ rotulo, valor, abierto }: { rotulo: string; valor: string; abierto: boolean }) {
  return (
    <div className="c-dato">
      <p className="t-rotulo-fino c-dato__rotulo">{rotulo}</p>
      {abierto ? <p className="t-cuerpo-15 c-dato__valor">{valor}</p> : <Censura ancho={150} />}
    </div>
  );
}
