import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Spinner } from './Spinner';

export type TipoBoton = 'Primario' | 'Secundario' | 'Acento' | 'Cargando';

type Props = {
  etiqueta: string;
  tipo?: TipoBoton;
  icono?: ReactNode;
  onClick?: () => void;
  href?: string;
  deshabilitado?: boolean;
  type?: 'button' | 'submit';
};

// Botón de la web. Cuatro tipos, como en Figma: Primario, Secundario, Acento y Cargando.
export function Boton({ etiqueta, tipo = 'Primario', icono, onClick, href, deshabilitado, type = 'button' }: Props) {
  const clase = cx('c-boton', `c-boton--${tipo.toLowerCase()}`);
  const contenido = (
    <>
      {tipo === 'Cargando' && <Spinner />}
      {icono}
      <span className="t-cuerpo-bold-17">{etiqueta}</span>
    </>
  );
  if (href) {
    return <a className={clase} href={href} target="_blank" rel="noopener">{contenido}</a>;
  }
  return (
    <button className={clase} type={type} onClick={onClick} disabled={deshabilitado || tipo === 'Cargando'}>
      {contenido}
    </button>
  );
}
