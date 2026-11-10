export function BotonFlotante({ etiqueta, onClick }: { etiqueta: string; onClick: () => void }) {
  return (
    <button className="c-boton-flotante t-boton" type="button" onClick={onClick}>
      {etiqueta}
    </button>
  );
}
