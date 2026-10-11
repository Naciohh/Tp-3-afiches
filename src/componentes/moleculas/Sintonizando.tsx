export function Sintonizando({ rotulo }: { rotulo: string }) {
  return (
    <div className="c-sintonizando" role="status">
      <div className="c-sintonizando__zocalo"><p className="t-datos-medium-13-espaciado">SINTONIZANDO SEÑAL</p></div>
      <div className="c-sintonizando__rotulo"><p className="t-cuerpo-regular-14">{rotulo}</p></div>
    </div>
  );
}
