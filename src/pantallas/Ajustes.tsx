import { Boton } from '../componentes/atomos/Boton';
import { OpcionAjuste } from '../componentes/atomos/OpcionAjuste';
import { GrupoAjustes } from '../componentes/moleculas/GrupoAjustes';
import { VistaPreviaAjustes } from '../componentes/moleculas/VistaPreviaAjustes';
import type { Ajustes as TipoAjustes, Daltonismo, Texto } from '../lib/accesibilidad';

const TEXTOS: [Texto, string][] = [['normal', 'Normal'], ['grande', 'Grande'], ['muy-grande', 'Muy grande']];
const DALTONISMOS: [Daltonismo, string, string | undefined][] = [
  ['ninguno', 'Sin ajuste', undefined],
  ['deuteranomalia', 'Deuteranomalía', 'Dificultad con verdes y rojos'],
  ['protanopia', 'Protanopía', 'Los rojos se ven oscuros'],
  ['tritanopia', 'Tritanopía', 'Dificultad con azules y amarillos'],
];

type Props = { ajustes: TipoAjustes; onCambio: (a: TipoAjustes) => void; onListo: () => void };

export function Ajustes({ ajustes, onCambio, onListo }: Props) {
  return (
    <main className="p-ajustes">
      <h1 className="t-display-28">Accesibilidad</h1>
      <p className="t-cuerpo-regular-16">Los mismos ajustes que en el juego. Se guardan en este celular.</p>
      <GrupoAjustes leyenda="Tamaño de texto">
        {TEXTOS.map(([id, nombre]) => (
          <OpcionAjuste key={id} tipo="Radio" grupo="texto" titulo={nombre} elegida={ajustes.texto === id} onCambio={() => onCambio({ ...ajustes, texto: id })} />
        ))}
      </GrupoAjustes>
      <GrupoAjustes leyenda="Contraste">
        <OpcionAjuste
          tipo="Casilla"
          titulo="Contraste alto"
          nota="Fondo blanco, texto negro y bordes marcados"
          elegida={ajustes.contraste}
          onCambio={() => onCambio({ ...ajustes, contraste: !ajustes.contraste })}
        />
      </GrupoAjustes>
      <GrupoAjustes leyenda="Daltonismo">
        {DALTONISMOS.map(([id, nombre, nota]) => (
          <OpcionAjuste key={id} tipo="Radio" grupo="daltonismo" titulo={nombre} nota={nota} elegida={ajustes.daltonismo === id} onCambio={() => onCambio({ ...ajustes, daltonismo: id })} />
        ))}
      </GrupoAjustes>
      <VistaPreviaAjustes />
      <Boton etiqueta="Listo" onClick={onListo} />
    </main>
  );
}
