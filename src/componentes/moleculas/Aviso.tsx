// Aviso numerado de la bienvenida (01, 02, 03 en naranja).
export function Aviso({ numero, texto }: { numero: number; texto: string }) {
  return (
    <li className="c-aviso">
      <span className="t-rotulo c-aviso__numero">{String(numero).padStart(2, '0')}</span>
      <p className="t-cuerpo-14">{texto}</p>
    </li>
  );
}
