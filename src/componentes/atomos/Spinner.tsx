import blanco from '../../assets/iconos/spinner-blanco.svg';
import oscuro from '../../assets/iconos/spinner-oscuro.svg';

export function Spinner({ color = 'Blanco' }: { color?: 'Blanco' | 'Oscuro' }) {
  return <img className="c-spinner" src={color === 'Oscuro' ? oscuro : blanco} width={16} height={16} alt="" />;
}
