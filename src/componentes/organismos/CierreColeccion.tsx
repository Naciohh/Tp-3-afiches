import { Boton } from '../atomos/Boton';

export function CierreColeccion({ onChequear }: { onChequear: () => void }) {
  return (
    <section className="c-cierre">
      <p className="t-datos-medium-13">LOS DESBLOQUEASTE A TODOS</p>
      <p className="t-display-20">Nadie te mintió del todo. Eso es lo que lo hace difícil de ver.</p>
      <Boton tipo="Secundario" etiqueta="Cómo chequear una noticia" onClick={onChequear} />
    </section>
  );
}
