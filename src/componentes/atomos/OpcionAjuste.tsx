import { cx } from '../../lib/cx';

type Props = {
  tipo: 'Radio' | 'Casilla';
  titulo: string;
  nota?: string;
  elegida: boolean;
  onCambio: () => void;
  grupo?: string;
};

// Fila de un ajuste. Tipo Radio: una opción entre varias. Tipo Casilla: activar o desactivar.
// Elegida invierte los colores (Primario sobre Blanco). El input real es nativo, para teclado y lectores de pantalla.
export function OpcionAjuste({ tipo, titulo, nota, elegida, onCambio, grupo }: Props) {
  return (
    <label className={cx('c-opcion', elegida && 'c-opcion--elegida')}>
      <input
        className="c-opcion__input"
        type={tipo === 'Radio' ? 'radio' : 'checkbox'}
        name={grupo}
        checked={elegida}
        onChange={onCambio}
      />
      <span className="c-opcion__control" aria-hidden="true">
        {tipo === 'Radio' ? (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" fill="white" stroke={elegida ? 'white' : 'var(--color-texto)'} strokeWidth="2" />
            {elegida && <circle cx="11" cy="11" r="5" fill="var(--color-primario)" />}
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="20" height="20" rx="4" fill="white" stroke={elegida ? 'white' : 'var(--color-texto)'} strokeWidth="2" />
            {elegida && <path d="M5.5 11.5L9.5 15.5L16.5 7.5" stroke="var(--color-primario)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
        )}
      </span>
      <span className="c-opcion__texto">
        <span className="t-cuerpo-semibold-16">{titulo}</span>
        {nota && <span className="t-cuerpo-regular-14 c-opcion__nota">{nota}</span>}
      </span>
    </label>
  );
}
