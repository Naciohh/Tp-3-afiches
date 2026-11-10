import { forwardRef } from 'react';
import { Boton } from '../componentes/atomos/Boton';
import { BotonFlotante } from '../componentes/atomos/BotonFlotante';
import { Pastilla } from '../componentes/atomos/Pastilla';
import { Subtitulo } from '../componentes/atomos/Subtitulo';
import { Sintonizando } from '../componentes/moleculas/Sintonizando';

type Props = {
  desbloqueadas: number;
  total: number;
  buscando: boolean;
  puedeDesbloquear: boolean;
  necesitaSonido: boolean;
  hayAjuste: boolean;
  error: boolean;
  subtitulo: string | null;
  onColeccion: () => void;
  onDesbloquear: () => void;
  onSonido: () => void;
  onCentrar: () => void;
  onReintentar: () => void;
};

// Cámara a pantalla completa (la dibuja MindAR dentro de #ar-container) con los controles encima.
export const Camara = forwardRef<HTMLDivElement, Props & { refSubtitulo: React.RefObject<HTMLDivElement> }>(function Camara(p, refContenedor) {
  return (
    <div className="p-camara">
      <div className="p-camara__ar" ref={refContenedor} />
      <div className="p-camara__capa">
        <div className="p-camara__arriba">
          <button className="p-camara__pastilla" type="button" onClick={p.onColeccion} aria-label="Abrir la colección">
            <Pastilla etiqueta={`Colección ${p.desbloqueadas}/${p.total}`} />
          </button>
          {p.hayAjuste && <button type="button" onClick={p.onCentrar}><Pastilla etiqueta="Centrar tele" /></button>}
        </div>
        {p.buscando && !p.error && !p.puedeDesbloquear && !p.necesitaSonido && (
          <div className="p-camara__marco" aria-hidden="true"><i /><i /><i /><i /></div>
        )}
        <div className="p-camara__subtitulo" ref={p.refSubtitulo} hidden>
          <Subtitulo texto={p.subtitulo ?? ''} />
        </div>
        <div className="p-camara__abajo">
          {p.error ? (
            <div className="p-camara__error">
              <p className="t-cuerpo-15">No pudimos abrir la cámara. Revisá que le diste permiso y que estás en https.</p>
              <Boton etiqueta="Reintentar" onClick={p.onReintentar} />
            </div>
          ) : p.puedeDesbloquear ? (
            <BotonFlotante etiqueta="Desbloquear" onClick={p.onDesbloquear} />
          ) : p.necesitaSonido ? (
            <BotonFlotante etiqueta="Activar sonido" onClick={p.onSonido} />
          ) : p.buscando ? (
            <Sintonizando rotulo="Apuntá la cámara al afiche entero" />
          ) : null}
        </div>
      </div>
    </div>
  );
});
