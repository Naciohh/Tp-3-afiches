import { useEffect, useRef } from 'react';
import { Boton } from '../componentes/atomos/Boton';
import { BloqueFicha } from '../componentes/moleculas/BloqueFicha';
import { NoticiaOriginal } from '../componentes/organismos/NoticiaOriginal';
import type { Noticia } from '../datos/noticias';
import { abrirVisor } from '../ar/visorTele';

type Props = { noticia: Noticia; onChequear: () => void; onVolver: () => void };

export function Ficha({ noticia, onChequear, onVolver }: Props) {
  const caja = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Un canvas cuyo contexto WebGL ya se cerró no se puede reusar: cada vez se crea uno nuevo.
    const lienzo = document.createElement('canvas');
    lienzo.className = 'p-ficha__lienzo';
    lienzo.setAttribute('aria-label', `Tele de ${noticia.titulo}`);
    caja.current?.append(lienzo);
    let cerrar: (() => void) | undefined;
    let vivo = true;
    abrirVisor(lienzo, noticia).then((c) => { if (vivo) cerrar = c; else c(); }).catch(() => undefined);
    return () => { vivo = false; cerrar?.(); lienzo.remove(); };
  }, [noticia]);

  return (
    <main className="p-ficha">
      <div className="p-ficha__tele" ref={caja} />
      <p className="t-datos-medium-13 p-ficha__epoca">{noticia.epoca.toUpperCase()} · {noticia.anio}</p>
      <h1 className="t-display-28">{noticia.titulo}</h1>
      <BloqueFicha tipo="Falso" titulo="Lo que decía el video">{noticia.falso}</BloqueFicha>
      <BloqueFicha tipo="Real" titulo="Lo que pasó de verdad">{noticia.real}</BloqueFicha>
      <BloqueFicha tipo="Neutro" titulo={`Cómo te engañó: ${noticia.tecnica}`}>{noticia.ficha}</BloqueFicha>
      <NoticiaOriginal noticia={noticia} />
      <BloqueFicha tipo="Consejo" titulo="Para no caer">{noticia.tip}</BloqueFicha>
      <Boton tipo="Secundario" etiqueta="Cómo chequear una noticia" onClick={onChequear} />
      <Boton etiqueta="Volver" onClick={onVolver} />
    </main>
  );
}
