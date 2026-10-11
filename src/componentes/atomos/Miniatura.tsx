import { cx } from '../../lib/cx';
import { teleColor, teleSilueta } from '../../datos/teles';

export function Miniatura({ id, estado = 'Color' }: { id: string; estado?: 'Color' | 'Silueta' }) {
  const src = estado === 'Color' ? teleColor[id] : teleSilueta[id];
  return <img className={cx('c-miniatura', estado === 'Silueta' && 'c-miniatura--silueta')} src={src} alt="" width={130} height={98} />;
}
