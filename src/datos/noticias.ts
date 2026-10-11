import datos from './noticias.json';

export type Noticia = {
  id: string;
  nombre: string;
  epoca: 'Abuelos' | 'Padres' | 'Vos';
  anio: string;
  titulo: string;
  tecnica: string;
  ficha: string;
  falso: string;
  real: string;
  tip: string;
  videoOriginal: string;
  subtitulosOriginal: string;
  fuenteOriginal: string;
  notaOriginal: string;
  modelo: string;
  video: string;
  subtitulos: string;
  /** Índices en targets.mind: los afiches sin QR y con QR de esta noticia. */
  targets: number[];
  transform?: { position: number[]; rotation: number[]; scale: number };
  uvRepeat?: number[];
  uvOffset?: number[];
  aspectoPantalla?: number;
};

export type Evento = typeof datos.evento;

export const noticias = datos.noticias as Noticia[];
export const evento = datos.evento;
export const eventUrl = datos.eventUrl;
export const opcionesAR = datos.ar;
export const frasesEpoca: Record<Noticia['epoca'], string> = {
  Abuelos: 'Así engañaron a tus abuelos',
  Padres: 'Así engañaron a tus padres',
  Vos: 'Así te engañan a vos',
};
export const TOTAL = noticias.length;
export const buscar = (id: string | null | undefined) => noticias.find((n) => n.id === id);
export const url = (ruta: string) => `${import.meta.env.BASE_URL}${ruta}`;
export const esPendiente = (v?: string) => !v || /^TODO/i.test(v) || !/^https?:\/\//.test(v);
