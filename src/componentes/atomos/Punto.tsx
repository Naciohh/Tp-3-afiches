import { cx } from '../../lib/cx';

export function Punto({ estado }: { estado: 'Abierto' | 'Cerrado' }) {
  return <span className={cx('c-punto', estado === 'Abierto' ? 'c-punto--abierto' : 'c-punto--cerrado')} />;
}
