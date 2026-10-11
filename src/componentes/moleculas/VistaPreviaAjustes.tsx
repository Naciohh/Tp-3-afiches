// "Así se ve": una muestra del texto y los colores con los ajustes elegidos.
export function VistaPreviaAjustes() {
  return (
    <div className="c-vista-previa" aria-hidden="true">
      <p className="t-cuerpo-bold-14">Así se ve</p>
      <p className="t-cuerpo-regular-16">Cada afiche escondido abre un tele. Escaneá todos.</p>
      <div className="c-vista-previa__muestras">
        <span style={{ background: 'var(--color-primario)' }} />
        <span style={{ background: 'var(--color-acento)' }} />
        <span style={{ background: 'var(--color-salmon)' }} />
      </div>
    </div>
  );
}
