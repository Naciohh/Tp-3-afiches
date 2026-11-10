import { useEffect, useRef, useState } from 'react';
import { Boton } from '../atomos/Boton';
import { CampoTexto } from '../atomos/CampoTexto';
import { Check } from '../atomos/Check';
import { esPendiente } from '../../datos/noticias';

type Estado = 'Reposo' | 'Error' | 'Enviando' | 'Confirmado';
type Props = { texto: string; simulado: boolean; url: string };

const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Con "simulado" no se guarda nada: valida el mail, muestra la carga y la confirmación.
// Para conectarlo de verdad: poné simulado en false y un link de formulario en noticias.json.
export function Newsletter({ texto, simulado, url }: Props) {
  const [estado, setEstado] = useState<Estado>('Reposo');
  const [mail, setMail] = useState('');
  const temporizador = useRef<number>();
  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!MAIL.test(mail.trim())) { setEstado('Error'); return; }
    setEstado('Enviando');
    if (!simulado && !esPendiente(url)) window.open(url, '_blank', 'noopener');
    temporizador.current = window.setTimeout(() => setEstado('Confirmado'), 1600);
  }

  if (estado === 'Confirmado') {
    return (
      <div className="c-newsletter">
        <div className="c-newsletter__ok"><Check /><p className="t-display-20">¡Listo, te anotamos!</p></div>
        <p className="t-cuerpo-15">Cuando termine el evento te escribimos a {mail.trim()} con el resumen y la info.</p>
        <Boton tipo="Secundario" etiqueta="Anotar otro mail" onClick={() => { setMail(''); setEstado('Reposo'); }} />
      </div>
    );
  }
  return (
    <form className="c-newsletter" onSubmit={enviar} noValidate>
      <h3 className="t-display-20">Newsletter</h3>
      <p className="t-cuerpo-15">{texto}</p>
      <CampoTexto valor={mail} onCambio={(v) => { setMail(v); if (estado === 'Error') setEstado('Reposo'); }} error={estado === 'Error'} etiquetaAccesible="Tu mail" />
      {estado === 'Error' && <p className="t-cuerpo-14 c-newsletter__error" role="alert"><span>Ese mail no parece válido. Revisalo.</span></p>}
      {estado === 'Enviando'
        ? <Boton tipo="Cargando" etiqueta="Enviando" />
        : <Boton type="submit" etiqueta="Quiero el resumen" />}
    </form>
  );
}
