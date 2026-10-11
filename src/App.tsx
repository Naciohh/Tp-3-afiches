import { useCallback, useEffect, useRef, useState } from 'react';
import { destrabarAudio } from './ar/audio';
import type { MotorAR } from './ar/motor';
import { buscar, TOTAL, type Noticia } from './datos/noticias';
import { aplicarAjustes, leerAjustes } from './lib/accesibilidad';
import { guardarProgreso, leerProgreso } from './lib/progreso';
import { Ajustes } from './pantallas/Ajustes';
import { Bienvenida } from './pantallas/Bienvenida';
import { Camara } from './pantallas/Camara';
import { Chequear } from './pantallas/Chequear';
import { Coleccion } from './pantallas/Coleccion';
import { Ficha } from './pantallas/Ficha';

type Pantalla = 'bienvenida' | 'camara' | 'coleccion' | 'ficha' | 'chequear' | 'ajustes';

// Solo en desarrollo: ?pantalla=coleccion|chequear|ficha:<id> abre esa pantalla sin pasar por la cámara.
function pantallaInicial(): [Pantalla, string | null] {
  if (!import.meta.env.DEV) return ['bienvenida', null];
  const q = new URLSearchParams(location.search).get('pantalla') ?? '';
  const [p, id] = q.split(':');
  return p === 'coleccion' || p === 'chequear' || p === 'ficha' || p === 'ajustes' ? [p, id ?? null] : ['bienvenida', null];
}

export default function App() {
  const [inicial] = useState(pantallaInicial);
  const [pantalla, setPantalla] = useState<Pantalla>(inicial[0]);
  const [anterior, setAnterior] = useState<Pantalla>('coleccion');
  const [ajustes, setAjustes] = useState(leerAjustes);
  const [desbloqueadas, setDesbloqueadas] = useState<string[]>(leerProgreso);
  const [nueva, setNueva] = useState<string | null>(null);
  const [fichaId, setFichaId] = useState<string | null>(inicial[1]);
  const [iniciando, setIniciando] = useState(false);
  const [empezado, setEmpezado] = useState(false); // la cámara recién se abre después de tocar "Empezar"
  const [error, setError] = useState(false);
  const [buscando, setBuscando] = useState(true);
  const [terminada, setTerminada] = useState<Noticia | null>(null);
  const [necesitaSonido, setNecesitaSonido] = useState(false);
  const [hayAjuste, setHayAjuste] = useState(false);

  const contenedor = useRef<HTMLDivElement>(null);
  const refSubtitulo = useRef<HTMLDivElement>(null);
  const motor = useRef<MotorAR | null>(null);
  const arrancando = useRef(false);

  useEffect(() => guardarProgreso(desbloqueadas), [desbloqueadas]);
  useEffect(() => aplicarAjustes(ajustes), [ajustes]);

  const arrancarAR = useCallback(async () => {
    if (arrancando.current || motor.current || !contenedor.current) return;
    arrancando.current = true;
    setError(false);
    try {
      // MindAR y three pesan mucho: se cargan recién cuando se abre la cámara.
      const { iniciarAR } = await import('./ar/motor');
      motor.current = await iniciarAR(contenedor.current, document.getElementById('video-compartido') as HTMLVideoElement, {
        onFound: (n) => { setBuscando(false); setTerminada((t) => (t && t.id !== n.id ? null : t)); },
        onLost: () => setBuscando(true),
        onEnded: (n) => setTerminada(n),
        onNecesitaSonido: setNecesitaSonido,
        onAjuste: setHayAjuste,
        onCuadro: ({ texto, x, y }) => {
          const el = refSubtitulo.current;
          if (!el) return;
          el.hidden = !texto;
          if (texto) {
            el.style.transform = `translate(-50%, 0)`;
            el.style.left = `${x}px`;
            el.style.top = `${Math.min(y + 10, window.innerHeight - 140)}px`;
            const p = el.querySelector('p');
            if (p && p.textContent !== texto) p.textContent = texto;
          }
        },
        onError: () => setError(true),
      });
    } catch {
      setError(true);
    } finally {
      arrancando.current = false;
    }
  }, []);

  // El toque de "Empezar" destraba el audio, abre la cámara y arranca MindAR.
  function empezar() {
    setIniciando(true);
    setEmpezado(true);
    destrabarAudio(document.getElementById('video-compartido') as HTMLVideoElement);
    setPantalla('camara');
  }

  // La cámara se monta al salir de la bienvenida: recién ahí existe el contenedor donde dibuja MindAR.
  useEffect(() => {
    if (empezado) void arrancarAR().finally(() => setIniciando(false));
  }, [empezado, arrancarAR]);

  const aColeccion = () => { motor.current?.pausar(); setPantalla('coleccion'); };
  const aCamara = () => { setPantalla('camara'); motor.current?.reanudar(); if (!motor.current) void arrancarAR(); };
  const abrirFicha = (n: Noticia) => { setFichaId(n.id); if (n.id === nueva) setNueva(null); setPantalla('ficha'); };
  const aChequear = (desde: Pantalla) => { setAnterior(desde); setPantalla('chequear'); };
  const aAjustes = (desde: Pantalla) => { setAnterior(desde); setPantalla('ajustes'); };

  function desbloquear() {
    if (!terminada) return;
    setDesbloqueadas((d) => (d.includes(terminada.id) ? d : [...d, terminada.id]));
    setNueva(terminada.id);
    setTerminada(null);
    aColeccion();
  }

  const ficha = buscar(fichaId);
  const puedeDesbloquear = !!terminada && !desbloqueadas.includes(terminada.id);

  return (
    <>
      {pantalla === 'bienvenida' && <div className="pantalla"><Bienvenida onEmpezar={empezar} onAjustes={() => aAjustes('bienvenida')} cargando={iniciando} /></div>}
      {/* La cámara se monta una vez y queda debajo de las demás pantallas. */}
      {empezado && (
        <Camara
          ref={contenedor}
          refSubtitulo={refSubtitulo}
          desbloqueadas={desbloqueadas.length}
          total={TOTAL}
          buscando={buscando}
          puedeDesbloquear={puedeDesbloquear}
          necesitaSonido={necesitaSonido}
          hayAjuste={hayAjuste}
          error={error}
          subtitulo={null}
          onColeccion={aColeccion}
          onDesbloquear={desbloquear}
          onSonido={() => void motor.current?.activarSonido()}
          onCentrar={() => motor.current?.centrarTele()}
          onReintentar={() => void arrancarAR()}
        />
      )}
      {pantalla === 'coleccion' && (
        <div className="pantalla">
          <Coleccion
            desbloqueadas={desbloqueadas}
            nueva={nueva}
            onAbrir={abrirFicha}
            onEscanear={aCamara}
            onChequear={() => aChequear('coleccion')}
            onAjustes={() => aAjustes('coleccion')}
            onReiniciar={() => { setDesbloqueadas([]); setNueva(null); }}
          />
        </div>
      )}
      {pantalla === 'ficha' && ficha && (
        <div className="pantalla"><Ficha noticia={ficha} onChequear={() => aChequear('ficha')} onVolver={() => setPantalla('coleccion')} /></div>
      )}
      {pantalla === 'ajustes' && <div className="pantalla"><Ajustes ajustes={ajustes} onCambio={setAjustes} onListo={() => setPantalla(anterior)} /></div>}
      {pantalla === 'chequear' && <div className="pantalla"><Chequear onVolver={() => setPantalla(anterior)} /></div>}
    </>
  );
}

