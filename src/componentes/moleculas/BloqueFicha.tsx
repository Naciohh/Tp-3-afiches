import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

type Props = { tipo: 'Falso' | 'Real' | 'Neutro' | 'Consejo'; titulo: string; children: ReactNode };

export function BloqueFicha({ tipo, titulo, children }: Props) {
  return (
    <section className={cx('c-bloque', `c-bloque--${tipo.toLowerCase()}`)}>
      <h3 className="t-display-16">{titulo}</h3>
      {tipo === 'Falso' ? <div className="c-bloque__marca"><p className="t-cuerpo-regular-16">{children}</p></div> : <p className="t-cuerpo-regular-16">{children}</p>}
    </section>
  );
}
