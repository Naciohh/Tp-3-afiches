import type { Noticia } from '../../datos/noticias';
import { url } from '../../datos/noticias';

// La noticia de verdad, sin editar, con subtítulos en castellano.
export function NoticiaOriginal({ noticia }: { noticia: Noticia }) {
  return (
    <section className="c-original">
      <h3 className="t-rotulo">La noticia original</h3>
      <p className="t-cuerpo-15">{noticia.notaOriginal}</p>
      <video
        className="c-original__video"
        controls
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        poster={url(noticia.videoOriginal.replace(/\.mp4$/, '.jpg'))}
        src={url(noticia.videoOriginal)}
      >
        <track kind="subtitles" srcLang="es" label="Español" src={url(noticia.subtitulosOriginal)} default />
      </video>
      <p className="t-dato">Fuente: {noticia.fuenteOriginal}</p>
    </section>
  );
}
