import { Boton } from '../atomos/Boton';

export function CierreColeccion({ onChequear }: { onChequear: () => void }) {
  return (
    <section className="c-cierre">
      <p className="t-rotulo">Los desbloqueaste a todos</p>
      <p className="t-display-22">Nadie te mintió del todo. Eso es lo que lo hace difícil de ver.</p>
      <Boton tipo="Secundario" etiqueta="Cómo chequear una noticia" onClick={onChequear} />
    </section>
  );
}
