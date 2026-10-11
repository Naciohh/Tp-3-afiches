export function BotonFlotante({ etiqueta, onClick }: { etiqueta: string; onClick: () => void }) {
  return (
    <button className="c-boton-flotante t-display-16-espaciado" type="button" onClick={onClick}>
      {etiqueta}
    </button>
  );
}
