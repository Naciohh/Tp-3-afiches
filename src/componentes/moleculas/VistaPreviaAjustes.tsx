// "Así se ve": una muestra del texto y los colores con los ajustes elegidos.
export function VistaPreviaAjustes() {
  return (
    <div className="c-vista-previa" aria-hidden="true">
      <p className="t-rotulo">Así se ve</p>
      <p className="t-cuerpo-15">Cada afiche escondido abre un tele. Escaneá todos.</p>
      <div className="c-vista-previa__muestras">
        <span style={{ background: 'var(--azul)' }} />
        <span style={{ background: 'var(--naranja)' }} />
        <span style={{ background: 'var(--rojo)' }} />
      </div>
    </div>
  );
}
