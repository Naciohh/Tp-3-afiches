import { Boton } from '../componentes/atomos/Boton';
import { GuiaChequeo } from '../componentes/organismos/GuiaChequeo';
import { useEntrada } from '../lib/useEntrada';

const A = ({ href, children }: { href: string; children: string }) => <a href={href} target="_blank" rel="noopener">{children}</a>;

export function Chequear({ onVolver }: { onVolver: () => void }) {
  const ref = useEntrada<HTMLElement>();
  return (
    <main className="p-chequear" ref={ref}>
      <div className="p-chequear__cabeza">
        <p className="t-rotulo p-chequear__etiqueta">Antes de creer (o compartir)</p>
        <h1 className="t-display-34">Cómo chequear una noticia</h1>
        <p className="t-cuerpo-15">Dudar no es lo mismo que no creer en nada. Se trata de pedir pruebas antes de creer algo, y de saber dónde buscarlas.</p>
      </div>
      <GuiaChequeo />
      <section className="c-bloque hoja">
        <span className="cinta" aria-hidden="true" />
        <h2 className="t-rotulo">Dónde informarte</h2>
        <p className="t-display-22">Fuentes para chequear</p>
        <ul className="p-chequear__fuentes t-cuerpo-15">
          <li>Medios con responsables identificados, que muestran de dónde sacan la información y corrigen cuando se equivocan. Mejor si leés más de uno, con miradas distintas.</li>
          <li>Fuentes primarias: documentos oficiales, fallos judiciales, informes de organismos y declaraciones completas.</li>
          <li>Archivos históricos: hemerotecas, la Biblioteca Nacional, el Archivo Histórico de RTA, <A href="https://web.archive.org">la Wayback Machine</A> para ver cómo era una página antes.</li>
          <li>Chequeadores: <A href="https://chequeado.com">Chequeado</A>, <A href="https://factual.afp.com">AFP Factual</A> y el <A href="https://toolbox.google.com/factcheck/explorer">buscador de chequeos de Google</A>.</li>
          <li>Para imágenes: buscalas al revés con <A href="https://lens.google">Google Lens</A> o <A href="https://tineye.com">TinEye</A> y fijate dónde aparecieron primero.</li>
          <li>Especialistas y universidades que firman lo que dicen y explican cómo llegaron a sus conclusiones.</li>
        </ul>
      </section>
      <Boton etiqueta="Volver" onClick={onVolver} />
    </main>
  );
}
