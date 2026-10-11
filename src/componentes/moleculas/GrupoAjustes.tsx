import type { ReactNode } from 'react';

// Un ajuste de accesibilidad: leyenda en Display/16 y las opciones apiladas.
export function GrupoAjustes({ leyenda, children }: { leyenda: string; children: ReactNode }) {
  return (
    <fieldset className="c-grupo-ajustes">
      <legend className="t-display-16">{leyenda}</legend>
      {children}
    </fieldset>
  );
}
