import { ConsejoNumerado } from '../moleculas/ConsejoNumerado';

const CONSEJOS = [
  ['Frená.', 'Si una noticia te enoja, te asusta o te da la razón demasiado rápido, es el momento de dudar. Ese golpe emocional es lo que busca quien quiere engañarte.'],
  ['Buscá quién lo dice.', '¿Tiene nombre y apellido, o es "fuentes", "se supo", "agencias"? Una acusación grave sin una fuente que se pueda verificar no es una noticia, es un rumor.'],
  ['Fijate si otros lo confirman.', 'Si algo tan grande fuera cierto, lo estarían diciendo varios medios distintos, no uno solo.'],
  ['Andá al origen.', 'Buscá el documento, la declaración o el video completo, no el recorte que te llegó.'],
  ['Mirá la fecha y el lugar.', 'Muchas veces son imágenes viejas o de otro país presentadas como nuevas.'],
  ['Desconfiá de lo que parece muy oficial.', 'Un logo, un zócalo de noticiero o una cara conocida se copian y se editan, como en estos videos.'],
  ['Separá datos de conclusiones.', 'Que una parte sea cierta no hace cierto todo lo demás.'],
];

export function GuiaChequeo() {
  return (
    <ol className="c-guia">
      {CONSEJOS.map(([titulo, texto], i) => <ConsejoNumerado key={titulo} numero={i + 1} titulo={titulo} texto={texto} />)}
    </ol>
  );
}
