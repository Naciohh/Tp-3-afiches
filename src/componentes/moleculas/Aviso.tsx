import { Icono, type NombreIcono } from '../atomos/Icono';

export function Aviso({ icono, texto }: { icono: NombreIcono; texto: string }) {
  return (
    <li className="c-aviso">
      <Icono nombre={icono} />
      <p className="t-cuerpo-regular-14">{texto}</p>
    </li>
  );
}
