export function ConsejoNumerado({ numero, titulo, texto }: { numero: number; titulo: string; texto: string }) {
  return (
    <li className="c-consejo">
      <span className="t-display-16 c-consejo__numero">{String(numero).padStart(2, '0')}</span>
      <div className="c-consejo__texto">
        <p className="t-cuerpo-semibold-16">{titulo}</p>
        <p className="t-cuerpo-regular-16">{texto}</p>
      </div>
    </li>
  );
}
