import { Settings } from 'lucide-react';

// Engranaje que abre la pantalla Accesibilidad. Va arriba a la derecha en Bienvenida y Colección.
export function BotonAjustes({ onClick }: { onClick: () => void }) {
  return (
    <button className="c-boton-ajustes" type="button" onClick={onClick} aria-label="Accesibilidad">
      <Settings size={22} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
