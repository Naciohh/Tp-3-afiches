export function DescripcionEvento({ texto, abierto }: { texto: string; abierto: boolean }) {
  if (abierto) return <p className="t-cuerpo-regular-16">{texto}</p>;
  return (
    <div className="c-barras" aria-hidden="true">
      <span className="c-barra" style={{ width: 308 }} />
      <span className="c-barra" style={{ width: 280 }} />
      <span className="c-barra" style={{ width: 190 }} />
    </div>
  );
}
