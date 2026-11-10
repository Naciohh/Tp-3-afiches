import { cx } from '../../lib/cx';

type Props = {
  valor: string;
  onCambio: (v: string) => void;
  error?: boolean;
  placeholder?: string;
  tipo?: string;
  etiquetaAccesible: string;
};

export function CampoTexto({ valor, onCambio, error, placeholder = 'tu@mail.com', tipo = 'email', etiquetaAccesible }: Props) {
  return (
    <input
      className={cx('c-campo', 't-cuerpo-15', error && 'c-campo--error')}
      type={tipo}
      inputMode="email"
      autoComplete="email"
      value={valor}
      placeholder={placeholder}
      aria-label={etiquetaAccesible}
      aria-invalid={error || undefined}
      onChange={(e) => onCambio(e.target.value)}
    />
  );
}
