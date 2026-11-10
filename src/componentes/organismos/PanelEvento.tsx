import { Boton } from '../atomos/Boton';
import { ChipRed } from '../atomos/ChipRed';
import { DatoEvento } from '../moleculas/DatoEvento';
import { DescripcionEvento } from '../moleculas/DescripcionEvento';
import { Newsletter } from '../moleculas/Newsletter';
import { esPendiente, evento, eventUrl } from '../../datos/noticias';
import { cx } from '../../lib/cx';

// Cierre de la colección: hoja de papel. Bloqueado: se lee el título y el resto está censurado. Abierto: toda la info.
export function PanelEvento({ abierto }: { abierto: boolean }) {
  const redes = evento.redes.filter((r) => r.nombre === 'Instagram' || r.nombre === 'TikTok') as { nombre: 'Instagram' | 'TikTok'; url: string }[];
  return (
    <article className={cx('c-panel', 'hoja', !abierto && 'c-panel--bloqueado')}>
      <p className="t-rotulo">Para el final</p>
      <h2 className="t-display-28">{evento.nombre}</h2>
      <div className="c-panel__datos">
        <DatoEvento rotulo="FECHA" valor={evento.fecha} abierto={abierto} />
        <DatoEvento rotulo="HORA" valor={evento.hora} abierto={abierto} />
        <DatoEvento rotulo="LUGAR" valor={evento.lugar} abierto={abierto} />
        <DatoEvento rotulo="DÓNDE" valor={evento.direccion} abierto={abierto} />
      </div>
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
            <p className="t-rotulo">Seguinos</p>
            <div className="c-panel__chips">
              {redes.map((r) => <ChipRed key={r.nombre} red={r.nombre} url={r.url} />)}
            </div>
          </div>
          <Newsletter texto={evento.newsletter.texto} simulado={evento.newsletter.simulado} url={evento.newsletter.url} />
        </>
      ) : (
        <p className="t-rotulo-fino">Se desbloquea cuando encontrás los cuatro teles.</p>
      )}
    </article>
  );
}
