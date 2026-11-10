import { useEffect, useRef } from 'react';
import { Boton } from '../componentes/atomos/Boton';
import { BloqueFicha } from '../componentes/moleculas/BloqueFicha';
import { NoticiaOriginal } from '../componentes/organismos/NoticiaOriginal';
import type { Noticia } from '../datos/noticias';
import { abrirVisor } from '../ar/visorTele';
import { useEntrada } from '../lib/useEntrada';

type Props = { noticia: Noticia; onChequear: () => void; onVolver: () => void };

export function Ficha({ noticia, onChequear, onVolver }: Props) {
  const caja = useRef<HTMLDivElement>(null);
  const ref = useEntrada<HTMLElement>();
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
    <main className="p-ficha" ref={ref}>
      <div className="p-ficha__tele" ref={caja} />
      <div className="p-ficha__cabeza">
        <p className="t-rotulo p-ficha__epoca">{noticia.epoca} · {noticia.anio}</p>
        <h1 className="t-display-34">{noticia.titulo}</h1>
      </div>
      <BloqueFicha tipo="Falso" etiqueta="Lo que decía el video">{noticia.falso}</BloqueFicha>
      <BloqueFicha tipo="Real" etiqueta="Lo que pasó de verdad">{noticia.real}</BloqueFicha>
      <BloqueFicha tipo="Neutro" etiqueta="Cómo te engañó" titulo={noticia.tecnica}>{noticia.ficha}</BloqueFicha>
      <NoticiaOriginal noticia={noticia} />
      <BloqueFicha tipo="Consejo" etiqueta="Para no caer">{noticia.tip}</BloqueFicha>
      <Boton tipo="Secundario" etiqueta="Cómo chequear una noticia" onClick={onChequear} />
      <Boton etiqueta="Volver" onClick={onVolver} />
    </main>
  );
}
