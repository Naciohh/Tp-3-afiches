export function DatoEvento({ rotulo, valor, abierto }: { rotulo: string; valor: string; abierto: boolean }) {
  return (
    <div className="c-dato">
      <p className="t-datos-medium-13 c-dato__rotulo">{rotulo}</p>
      {abierto ? <p className="t-cuerpo-regular-16 c-dato__valor">{valor}</p> : <span className="c-barra" style={{ width: 120 }} />}
    </div>
  );
}
