import { Boton } from '../componentes/atomos/Boton';
import { GuiaChequeo } from '../componentes/organismos/GuiaChequeo';

const A = ({ href, children }: { href: string; children: string }) => <a href={href} target="_blank" rel="noopener">{children}</a>;

export function Chequear({ onVolver }: { onVolver: () => void }) {
  return (
    <main className="p-chequear">
      <p className="t-datos-medium-13 p-chequear__etiqueta">ANTES DE CREER (O COMPARTIR)</p>
      <h1 className="t-display-28">Cómo chequear una noticia</h1>
      <p className="t-cuerpo-regular-16">Dudar no es lo mismo que no creer en nada. Se trata de pedir pruebas antes de creer algo, y de saber dónde buscarlas.</p>
      <GuiaChequeo />
      <h2 className="t-display-20">Dónde informarte</h2>
      <ul className="p-chequear__fuentes t-cuerpo-regular-14">
        <li>Medios con responsables identificados, que muestran de dónde sacan la información y corrigen cuando se equivocan. Mejor si leés más de uno, con miradas distintas.</li>
        <li>Fuentes primarias: documentos oficiales, fallos judiciales, informes de organismos y declaraciones completas.</li>
        <li>Archivos históricos: hemerotecas, la Biblioteca Nacional, el Archivo Histórico de RTA, <A href="https://web.archive.org">la Wayback Machine</A> para ver cómo era una página antes.</li>
        <li>Chequeadores: <A href="https://chequeado.com">Chequeado</A>, <A href="https://factual.afp.com">AFP Factual</A> y el <A href="https://toolbox.google.com/factcheck/explorer">buscador de chequeos de Google</A>.</li>
        <li>Para imágenes: buscalas al revés con <A href="https://lens.google">Google Lens</A> o <A href="https://tineye.com">TinEye</A> y fijate dónde aparecieron primero.</li>
        <li>Especialistas y universidades que firman lo que dicen y explican cómo llegaron a sus conclusiones.</li>
      </ul>
      <Boton etiqueta="Volver" onClick={onVolver} />
    </main>
  );
}
