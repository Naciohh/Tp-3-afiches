import type { ReactNode } from 'react';

// Un ajuste de accesibilidad: leyenda en Space Mono naranja y las opciones apiladas.
export function GrupoAjustes({ leyenda, children }: { leyenda: string; children: ReactNode }) {
  return (
    <fieldset className="c-grupo-ajustes">
      <legend className="t-rotulo">{leyenda}</legend>
      {children}
    </fieldset>
  );
}
