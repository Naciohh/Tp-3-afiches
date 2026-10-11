import { Boton } from '../atomos/Boton';
import { ChipRed } from '../atomos/ChipRed';
import { Punto } from '../atomos/Punto';
import { Rayado } from '../atomos/Rayado';
import { DatoEvento } from '../moleculas/DatoEvento';
import { DescripcionEvento } from '../moleculas/DescripcionEvento';
import { Newsletter } from '../moleculas/Newsletter';
import { esPendiente, evento, eventUrl } from '../../datos/noticias';
import { cx } from '../../lib/cx';

// Cierre de la línea de tiempo. Bloqueado: se lee el título y el resto está tachado. Abierto: toda la info.
export function PanelEvento({ abierto }: { abierto: boolean }) {
  const redes = evento.redes.filter((r) => r.nombre === 'Instagram' || r.nombre === 'TikTok') as { nombre: 'Instagram' | 'TikTok'; url: string }[];
  return (
    <div className="c-evento-linea">
      <Punto estado={abierto ? 'Abierto' : 'Cerrado'} />
      <article className={cx('c-panel', !abierto && 'c-panel--bloqueado')}>
        {!abierto && <Rayado />}
        <p className="t-datos-medium-13 c-panel__etiqueta">PARA EL FINAL</p>
        <h2 className="t-display-28">{evento.nombre}</h2>
        <DatoEvento rotulo="FECHA" valor={evento.fecha} abierto={abierto} />
        <DatoEvento rotulo="HORA" valor={evento.hora} abierto={abierto} />
        <DatoEvento rotulo="LUGAR" valor={evento.lugar} abierto={abierto} />
        <DatoEvento rotulo="DÓNDE" valor={evento.direccion} abierto={abierto} />
        <DescripcionEvento texto={evento.descripcion} abierto={abierto} />
        {abierto ? (
          <>
            <Boton
              etiqueta="Ir a la web del evento"
              href={esPendiente(eventUrl) ? undefined : eventUrl}
              onClick={esPendiente(eventUrl) ? () => undefined : undefined}
            />
            <Boton tipo="Secundario" etiqueta="Cómo llegar" href={evento.mapaUrl} />
            <div className="c-panel__redes">
              <p className="t-datos-medium-13">SEGUINOS</p>
              <div className="c-panel__chips">
                {redes.map((r) => <ChipRed key={r.nombre} red={r.nombre} url={r.url} />)}
              </div>
            </div>
            <Newsletter texto={evento.newsletter.texto} simulado={evento.newsletter.simulado} url={evento.newsletter.url} />
          </>
        ) : (
          <p className="t-datos-regular-12 c-panel__candado">Se desbloquea cuando encontrás los cuatro teles.</p>
        )}
      </article>
    </div>
  );
}
