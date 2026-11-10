import { Boton } from '../componentes/atomos/Boton';
import { OpcionAjuste } from '../componentes/atomos/OpcionAjuste';
import { GrupoAjustes } from '../componentes/moleculas/GrupoAjustes';
import { VistaPreviaAjustes } from '../componentes/moleculas/VistaPreviaAjustes';
import type { Ajustes as TipoAjustes, Daltonismo, Texto } from '../lib/accesibilidad';
import { useEntrada } from '../lib/useEntrada';

const TEXTOS: [Texto, string][] = [['normal', 'Normal'], ['grande', 'Grande'], ['muy-grande', 'Muy grande']];
const DALTONISMOS: [Daltonismo, string, string | undefined][] = [
  ['ninguno', 'Sin ajuste', undefined],
  ['deuteranomalia', 'Deuteranomalía', 'Dificultad con verdes y rojos'],
  ['protanopia', 'Protanopía', 'Los rojos se ven oscuros'],
  ['tritanopia', 'Tritanopía', 'Dificultad con azules y amarillos'],
];

type Props = { ajustes: TipoAjustes; onCambio: (a: TipoAjustes) => void; onListo: () => void };

export function Ajustes({ ajustes, onCambio, onListo }: Props) {
  const ref = useEntrada<HTMLElement>();
  return (
    <main className="p-ajustes" ref={ref}>
      <div className="p-ajustes__cabeza">
        <h1 className="t-display-34">Accesibilidad</h1>
        <p className="t-cuerpo-15">Se guardan en este celular.</p>
      </div>
      <GrupoAjustes leyenda="Tamaño de texto">
        {TEXTOS.map(([id, nombre]) => (
          <OpcionAjuste key={id} tipo="Radio" grupo="texto" titulo={nombre} elegida={ajustes.texto === id} onCambio={() => onCambio({ ...ajustes, texto: id })} />
        ))}
      </GrupoAjustes>
      <GrupoAjustes leyenda="Contraste">
        <OpcionAjuste
          tipo="Casilla"
          titulo="Contraste alto"
          nota="Fondo negro puro, texto blanco y sin texturas"
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
