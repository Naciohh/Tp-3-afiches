export function ConsejoNumerado({ numero, titulo, texto }: { numero: number; titulo: string; texto: string }) {
  return (
    <li className="c-consejo">
      <span className="c-consejo__numero">{String(numero).padStart(2, '0')}</span>
      <div className="c-consejo__texto">
        <p className="t-display-20">{titulo}</p>
        <p className="t-cuerpo-14">{texto}</p>
      </div>
    </li>
  );
}
