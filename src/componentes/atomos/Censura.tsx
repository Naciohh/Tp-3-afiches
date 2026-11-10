// Barra negra que tapa lo que todavía no se desbloqueó.
export function Censura({ ancho }: { ancho: number }) {
  return <span className="c-censura" style={{ width: ancho }} aria-hidden="true" />;
}
