import spinner from '../../assets/iconos/spinner.png';

// Spinner de carga: anillo con cola que se desvanece, y gira sin parar (ver .c-spinner en atomos.css).
export function Spinner() {
  return <img className="c-spinner" src={spinner} width={20} height={20} alt="" />;
}
