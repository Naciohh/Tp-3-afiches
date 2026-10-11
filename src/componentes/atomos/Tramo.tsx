import { cx } from '../../lib/cx';

export function Tramo({ estado }: { estado: 'Lleno' | 'Vacío' }) {
  return <span className={cx('c-tramo', estado === 'Lleno' && 'c-tramo--lleno')} />;
}
