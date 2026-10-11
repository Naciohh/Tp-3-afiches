import { useEffect, useRef, useState } from 'react';
import { Boton } from '../atomos/Boton';
import { CampoTexto } from '../atomos/CampoTexto';
import { Check } from '../atomos/Check';
import { Spinner } from '../atomos/Spinner';
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
        <Check />
        <p className="t-display-20">¡Listo, te anotamos!</p>
        <p className="t-cuerpo-regular-16">Cuando termine el evento te escribimos a {mail.trim()} con el resumen y la info.</p>
        <Boton tipo="Secundario" etiqueta="Anotar otro mail" onClick={() => { setMail(''); setEstado('Reposo'); }} />
      </div>
    );
  }
  const enviando = estado === 'Enviando';
  return (
    <form className="c-newsletter" onSubmit={enviar} noValidate>
      <h3 className="t-display-16">Newsletter</h3>
      <p className="t-cuerpo-regular-16">{texto}</p>
      <CampoTexto valor={mail} onCambio={(v) => { setMail(v); if (estado === 'Error') setEstado('Reposo'); }} error={estado === 'Error'} etiquetaAccesible="Tu mail" />
      {estado === 'Error' && <p className="t-cuerpo-regular-14 c-newsletter__error" role="alert">Ese mail no parece válido. Revisalo.</p>}
      {enviando
        ? <div className="c-boton c-boton--cargando"><Spinner /><span className="t-cuerpo-bold-17">Enviando</span></div>
        : <Boton type="submit" etiqueta="Quiero el resumen" />}
    </form>
  );
}
